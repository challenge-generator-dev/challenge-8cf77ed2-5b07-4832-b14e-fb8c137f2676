import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventService } from '../src/application/services/order-event.service';
import { OrderEventPublisher } from '../src/domain/order-events.interface';
import { SseService } from '../src/common/sse/sse.service';
import { OrderEventType } from '../src/domain/order-events.interface';
import { Order } from '../src/domain/order.entity';

describe('OrderEventService', () => {
  let service: OrderEventService;
  let publisher: jest.Mocked<OrderEventPublisher>;
  let sseService: jest.Mocked<SseService>;

  const mockOrder: Order = new Order(
    'ORD-001',
    'CUST-001',
    100.00,
    OrderStatus.PENDING,
  );

  const mockOrderEventDto = {
    eventType: OrderEventType.ORDER_CREATED,
    order: mockOrder,
    timestamp: new Date().toISOString(),
    metadata: { source: 'test' },
  };

  beforeEach(async () => {
    publisher = {
      emitOrderEvent: jest.fn().mockResolvedValue(undefined),
      consumeOrderEvents: jest.fn(),
    };

    sseService = {
      sendEvent: jest.fn(),
      addClient: jest.fn(),
      removeClient: jest.fn(),
      getEventStream: jest.fn(),
      getClientsCount: jest.fn().mockReturnValue(0),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventService,
        { provide: OrderEventPublisher, useValue: publisher },
        { provide: SseService, useValue: sseService },
      ],
    }).compile();

    service = module.get<OrderEventService>(OrderEventService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('emitOrderEvent', () => {
    it('debería publicar un evento de orden exitosamente', async () => {
      await service.emitOrderEvent(mockOrderEventDto as any);

      expect(publisher.emitOrderEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: mockOrderEventDto.eventType,
          order: mockOrderEventDto.order,
          timestamp: mockOrderEventDto.timestamp,
        }),
      );
    });

    it('debería enviar el evento via SSE después de publicar', async () => {
      await service.emitOrderEvent(mockOrderEventDto as any);

      expect(sseService.sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'order-event',
          data: expect.objectContaining({
            eventType: mockOrderEventDto.eventType,
          }),
        }),
      );
    });

    it('debería manejar errores al publicar evento', async () => {
      const error = new Error('Kafka connection failed');
      publisher.emitOrderEvent.mockRejectedValue(error);

      await expect(service.emitOrderEvent(mockOrderEventDto as any)).rejects.toThrow(
        'Kafka connection failed',
      );
    });

    it('no debería enviar evento SSE si la publicación falla', async () => {
      publisher.emitOrderEvent.mockRejectedValue(new Error('Kafka error'));

      try {
        await service.emitOrderEvent(mockOrderEventDto as any);
      } catch (error) {
        // Se espera que falle
      }

      expect(sseService.sendEvent).not.toHaveBeenCalled();
    });
  });

  describe('consumeOrderEvents', () => {
    it('debería consumir eventos de orden', async () => {
      const callback = jest.fn();

      await service.consumeOrderEvents(callback);

      expect(publisher.consumeOrderEvents).toHaveBeenCalledWith(callback);
    });

    it('debería pasar el callback al consumidor de Kafka', async () => {
      const callback = jest.fn();
      const mockEvent = {
        eventType: OrderEventType.ORDER_UPDATED,
        order: mockOrder,
        timestamp: new Date().toISOString(),
      };

      await service.consumeOrderEvents(callback);

      const passedCallback = (publisher.consumeOrderEvents as jest.Mock).mock.calls[0][0];
      passedCallback(mockEvent);

      expect(callback).toHaveBeenCalledWith(mockEvent);
    });
  });
});