import { Order } from './order.entity';

export enum OrderEventType {
    ORDER_CREATED = 'ORDER_CREATED',
    ORDER_UPDATED = 'ORDER_UPDATED',
    ORDER_CANCELLED = 'ORDER_CANCELLED'
}

export interface OrderEvent {
    eventId: string;
    eventType: OrderEventType;
    order: Order;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface OrderEventPublisher {
    emitOrderEvent(event: OrderEvent): Promise<void>;
}

export interface OrderEventConsumer {
    consumeOrderEvents(callback: (event: OrderEvent) => void): Promise<void>;
}

export class OrderEventDto {
    @ApiProperty({ enum: OrderEventType, example: OrderEventType.ORDER_CREATED })
    eventType: OrderEventType;

    @ApiProperty({ type: Order })
    order: Order;

    @ApiProperty({ example: '2024-05-20T10:00:00Z' })
    timestamp: string;

    @ApiProperty({ required: false, example: { source: 'mobile' } })
    metadata?: Record<string, unknown>;

    constructor(eventType: OrderEventType, order: Order, timestamp: string, metadata?: Record<string, unknown>) {
        this.eventType = eventType;
        this.order = order;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }
}