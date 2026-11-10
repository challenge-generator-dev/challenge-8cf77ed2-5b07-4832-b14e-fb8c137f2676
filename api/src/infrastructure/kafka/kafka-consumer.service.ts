import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafka-js';
import { Subject, Observable } from 'rxjs';
import { OrderEvent, OrderEventConsumer } from '../../domain/order-events.interface';
import { OrderStatus } from '../../domain/order.entity';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy, OrderEventConsumer {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private client: Kafka;
  private consumer: Consumer;
  private readonly topic = 'order-events';
  private readonly groupId = 'order-events-consumer-group';
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000;

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
    this.client = new Kafka({
      clientId: 'order-events-consumer',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.consumer = this.client.consumer({ groupId: this.groupId });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.logger.log(`Kafka consumer connected and subscribed to topic: ${this.topic}`);
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.eventsSubject.complete();
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka consumer', error);
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    if (!message.value) {
      this.logger.warn(`Received empty message on ${topic}[${partition}]`);
      return;
    }

    try {
      const event = this.parseMessage(message.value.toString());
      this.logger.debug(`Processing event: ${event.eventType} for order ${event.order.id}`);
      this.eventsSubject.next(event);
    } catch (error) {
      this.logger.error(`Failed to process message from ${topic}[${partition}]`, error);
      await this.handleRetry(payload);
    }
  }

  private parseMessage(value: string): OrderEvent {
    const parsed = JSON.parse(value);
    
    const order = {
      id: parsed.order.id,
      customerId: parsed.order.customerId,
      totalAmount: parsed.order.totalAmount,
      status: parsed.order.status as OrderStatus,
      createdAt: parsed.order.createdAt,
      updatedAt: parsed.order.updatedAt,
    };

    return {
      eventType: parsed.eventType,
      order,
      timestamp: parsed.timestamp,
      metadata: parsed.metadata || {},
    };
  }

  private async handleRetry(payload: EachMessagePayload, attempt = 1): Promise<void> {
    if (attempt > this.retryAttempts) {
      this.logger.error(
        `Max retry attempts reached for message at ${payload.topic}[${payload.partition}][${payload.message.offset}]`,
      );
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt));
    this.logger.warn(`Retrying message processing, attempt ${attempt + 1}/${this.retryAttempts}`);
    
    try {
      await this.handleMessage(payload);
    } catch (error) {
      await this.handleRetry(payload, attempt + 1);
    }
  }

  async consumeOrderEvents(callback: (event: OrderEvent) => void): Promise<void> {
    this.eventsSubject.subscribe({
      next: (event) => {
        try {
          callback(event);
        } catch (error) {
          this.logger.error('Error in event callback', error);
        }
      },
      error: (error) => {
        this.logger.error('Error in events stream', error);
      },
    });
  }

  getEventsStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  getTopic(): string {
    return this.topic;
  }

  getGroupId(): string {
    return this.groupId;
  }

  async pause(): Promise<void> {
    await this.consumer.pause();
    this.logger.log('Kafka consumer paused');
  }

  async resume(): Promise<void> {
    await this.consumer.resume();
    this.logger.log('Kafka consumer resumed');
  }

  isConnected(): boolean {
    return this.consumer.isConnected();
  }
}