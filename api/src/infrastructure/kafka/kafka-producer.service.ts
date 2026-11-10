import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafka-js';
import { OrderEvent, OrderEventPublisher } from '../../domain/order-events.interface';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy, OrderEventPublisher {
  private readonly logger = new Logger(KafkaProducerService.name);
  private client: Kafka;
  private producer: Producer;
  private readonly topic = 'order-events';

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
    this.client = new Kafka({
      clientId: 'order-events-producer',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.producer = this.client.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka producer', error);
    }
  }

  async emitOrderEvent(event: OrderEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.order.id,
          value: JSON.stringify(event),
          timestamp: event.timestamp,
          headers: {
            eventType: event.eventType,
            orderId: event.order.id,
          },
        },
      ],
    };

    try {
      await this.producer.send(record);
      this.logger.log(`Order event emitted: ${event.eventType} for order ${event.order.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit order event for order ${event.order.id}`, error);
      throw error;
    }
  }

  async sendBatch(events: OrderEvent[]): Promise<void> {
    const messages = events.map((event) => ({
      key: event.order.id,
      value: JSON.stringify(event),
      timestamp: event.timestamp,
      headers: {
        eventType: event.eventType,
        orderId: event.order.id,
      },
    }));

    const record: ProducerRecord = {
      topic: this.topic,
      messages,
    };

    try {
      await this.producer.send(record);
      this.logger.log(`Batch of ${events.length} order events emitted`);
    } catch (error) {
      this.logger.error(`Failed to emit batch of ${events.length} order events`, error);
      throw error;
    }
  }

  getTopic(): string {
    return this.topic;
  }

  isConnected(): boolean {
    return this.producer.isConnected();
  }
}