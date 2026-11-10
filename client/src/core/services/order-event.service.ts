import { Injectable, signal, effect, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface OrderEventDto {
  orderId: string;
  eventType: 'CREATED' | 'UPDATED' | 'CANCELLED' | 'DELIVERED';
  timestamp: string;
  payload?: {
    customerId?: string;
    items?: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    status?: string;
    totalAmount?: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly API_URL = 'http://localhost:3000/orders/events';
  private eventSource: EventSource | null = null;
  private eventSubscription: Subscription | null = null;

  // Signals para manejar el estado reactivo
  orders = signal<OrderEventDto[]>([]);
  error = signal<string | null>(null);
  isConnected = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // Efecto para limpiar recursos cuando el servicio se destruya
    effect(() => {
      return () => {
        this.disconnect();
      };
    });
  }

  /**
   * Publica un evento de orden al backend
   * @param event Evento de orden a publicar
   * @returns Observable con la respuesta del servidor
   */
  emitOrderEvent(event: OrderEventDto): Observable<unknown> {
    return this.http.post(this.API_URL, event).pipe(
      catchError(err => {
        this.error.set(`Error publicando evento: ${err.message}`);
        return throwError(() => new Error(err));
      })
    );
  }

  /**
   * Conecta al stream de eventos SSE y comienza a escuchar
   */
  connect(): void {
    if (this.isConnected()) {
      return;
    }

    try {
      this.eventSource = new EventSource(`${this.API_URL}/stream`);

      this.eventSource.onopen = () => {
        this.isConnected.set(true);
        this.error.set(null);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const orderEvent: OrderEventDto = JSON.parse(event.data);
          this.orders.update(orders => [...orders, orderEvent]);
        } catch (err) {
          this.error.set(`Error parseando evento: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        }
      };

      this.eventSource.onerror = (error) => {
        this.isConnected.set(false);
        this.error.set(`Error en la conexión SSE: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        // Intentar reconexión después de 5 segundos
        setTimeout(() => this.connect(), 5000);
      };
    } catch (err) {
      this.error.set(`Error creando EventSource: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      this.isConnected.set(false);
    }
  }

  /**
   * Desconecta del stream SSE y limpia recursos
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    this.isConnected.set(false);
  }

  /**
   * Reinicia la conexión al stream SSE
   */
  reconnect(): void {
    this.disconnect();
    this.connect();
  }

  /**
   * Obtiene el estado actual de conexión
   * @returns Estado de conexión como Signal
   */
  getConnectionStatus(): Signal<boolean> {
    return this.isConnected;
  }

  /**
   * Obtiene los errores recientes
   * @returns Errores como Signal
   */
  getErrors(): Signal<string | null> {
    return this.error;
  }

  /**
   * Obtiene todas las órdenes recibidas
   * @returns Órdenes como Signal
   */
  getOrders(): Signal<OrderEventDto[]> {
    return this.orders;
  }
}