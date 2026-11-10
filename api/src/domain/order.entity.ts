import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';

export enum OrderStatus {
    CREATED = 'CREATED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'ORD-2024-001' })
    @IsString()
    orderNumber: string;

    @ApiProperty({ example: 100.50 })
    @IsNumber()
    totalAmount: number;

    @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty({ example: '2024-05-20T10:00:00Z' })
    @IsDateString()
    createdAt: string;

    @ApiProperty({ example: '2024-05-20T10:05:00Z' })
    @IsDateString()
    updatedAt: string;

    @ApiProperty({ example: ['PROD-001', 'PROD-002'] })
    @IsString({ each: true })
    productIds: string[];

    constructor(
        id: string,
        orderNumber: string,
        totalAmount: number,
        status: OrderStatus,
        createdAt: string,
        updatedAt: string,
        productIds: string[]
    ) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.productIds = productIds;
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
        this.updatedAt = new Date().toISOString();
    }
}