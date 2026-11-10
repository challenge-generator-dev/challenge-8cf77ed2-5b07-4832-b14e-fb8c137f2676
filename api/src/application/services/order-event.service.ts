import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { OrderEventDto, OrderEvent, OrderEventType, OrderEventPublisher, OrderEventConsumer } from '../../domain/order-events.interface';
import { Order } from '../../domain/order.entity';
import { SseService } from '../../common/sse/sse.service';

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private readonly eventSubject = new Subject<OrderEvent>();
  private isConsuming = false;

  constructor(
    @Inject('ORDER_EVENT_PUBLISHER') private readonly publisher: OrderEventPublisher,
    @Inject('ORDER_EVENT_CONSUMER') private readonly consumer: OrderEventConsumer,
    private readonly sseService: SseService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('OrderEventService initialized');
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('OrderEventService destroyed - stopping event consumption');
    this.isConsuming = false;
  }

  async emitOrderEvent(eventDto: OrderEventDto): Promise<void> {
    const orderEvent: OrderEvent = {
      eventType: eventDto.eventType,
      order: eventDto.order,
      timestamp: eventDto.timestamp || new Date().toISOString(),
      metadata: eventDto.metadata || {},
    };

    try {
      await this.publisher.emitOrderEvent(orderEvent);
      this.logger.log(`Event emitted: ${orderEvent.eventType} for order ${orderEvent.order.id}`);
      this.eventSubject.next(orderEvent);
    } catch (error) {
      this.logger.error(`Failed to emit order event: ${error}`);
      throw error;
    }
  }

  getOrderEventsStream(): Observable<OrderEvent> {
    return this.eventSubject.asObservable();
  }

  private async startConsuming(): Promise<void> {
    if (this.isConsuming) {
      this.logger.warn('Event consumption already started');
      return;
    }

    this.isConsuming = true;
    this.logger.log('Starting Kafka event consumption');

    try {
      await this.consumer.consumeOrderEvents(async (event: OrderEvent) => {
        this.logger.log(`Received event from Kafka: ${event.eventType} for order ${event.order.id}`);
        this.eventSubject.next(event);
        this.sseService.sendEvent(event);
      });
    } catch (error) {
      this.logger.error(`Error in Kafka consumer: ${error}`);
      this.isConsuming = false;
    }
  }

  async processEvent(eventType: OrderEventType, order: Order, metadata?: Record<string, unknown>): Promise<void> {
    const eventDto = new OrderEventDto(
      eventType,
      order,
      new Date().toISOString(),
      metadata,
    );
    await this.emitOrderEvent(eventDto);
  }

  getEventHistory(): OrderEvent[] {
    return [];
  }

  isConsumerActive(): boolean {
    return this.isConsuming;
  }
}