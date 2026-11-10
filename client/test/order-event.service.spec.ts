import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderEventService, OrderEventDto } from '../src/core/services/order-event.service';

describe('OrderEventService', () => {
  let service: OrderEventService;
  let httpMock: HttpTestingController;

  const mockOrderEvent: OrderEventDto = {
    orderId: 'ORD-001',
    customerName: 'Juan Pérez',
    productName: 'Laptop ThinkPad',
    quantity: 2,
    total: 2500.00,
    status: 'pending',
    timestamp: new Date('2024-01-15T10:30:00Z')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderEventService]
    });
    service = TestBed.inject(OrderEventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.disconnect();
  });

  describe('emitOrderEvent', () => {
    it('debería enviar evento de orden al endpoint correcto', (done) => {
      service.emitOrderEvent(mockOrderEvent).subscribe({
        next: (response) => {
          expect(response).toBeTruthy();
          done();
        },
        error: (err) => done.fail(err)
      });

      const req = httpMock.expectOne('http://localhost:3000/orders/events');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrderEvent);
      req.flush({ success: true });
    });

    it('debería manejar error cuando el servidor responde con error', (done) => {
      service.emitOrderEvent(mockOrderEvent).subscribe({
        next: () => done.fail('Debería haber thrown un error'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:3000/orders/events');
      req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('connect', () => {
    it('debería establecer conexión EventSource', () => {
      service.connect();
      const connectionStatus = service.getConnectionStatus();
      expect(connectionStatus()).toBe(true);
    });

    it('debería limpiar error previo al conectar', () => {
      service.connect();
      const errors = service.getErrors();
      expect(errors()).toBeNull();
    });
  });

  describe('disconnect', () => {
    it('debería cerrar conexión EventSource', () => {
      service.connect();
      service.disconnect();
      const connectionStatus = service.getConnectionStatus();
      expect(connectionStatus()).toBe(false);
    });
  });

  describe('reconnect', () => {
    it('debería intentar reconectar después de una desconexión', () => {
      service.connect();
      service.disconnect();
      service.reconnect();
      const connectionStatus = service.getConnectionStatus();
      expect(connectionStatus()).toBe(true);
    });
  });

  describe('getConnectionStatus', () => {
    it('debería retornar señal reactiva con estado de conexión', () => {
      const statusBeforeConnect = service.getConnectionStatus();
      expect(statusBeforeConnect()).toBe(false);

      service.connect();
      const statusAfterConnect = service.getConnectionStatus();
      expect(statusAfterConnect()).toBe(true);
    });
  });

  describe('getErrors', () => {
    it('debería retornar señal reactiva para errores', () => {
      const errors = service.getErrors();
      expect(errors()).toBeNull();
    });
  });

  describe('getOrders', () => {
    it('debería retornar señal reactiva con lista de órdenes', () => {
      service.connect();
      const orders = service.getOrders();
      expect(orders()).toBeDefined();
      expect(Array.isArray(orders())).toBe(true);
    });
  });
});