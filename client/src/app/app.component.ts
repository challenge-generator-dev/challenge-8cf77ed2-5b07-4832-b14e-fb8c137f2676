import { Component, OnInit, OnDestroy, inject, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderEventService, OrderEventDto } from '../core/services/order-event.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroy$ = new Subscription();

  readonly connectionStatus: Signal<boolean> = this.orderEventService.getConnectionStatus();
  readonly orders: Signal<OrderEventDto[]> = this.orderEventService.getOrders();
  readonly errors: Signal<string | null> = this.orderEventService.getErrors();

  readonly hasError: Signal<boolean> = computed(() => !!this.errors());
  readonly isConnected: Signal<boolean> = computed(() => this.connectionStatus());
  readonly hasOrders: Signal<boolean> = computed(() => this.orders().length > 0);
  readonly orderCount: Signal<number> = computed(() => this.orders().length);

  ngOnInit(): void {
    this.initializeConnection();
    this.subscribeToErrors();
  }

  ngOnDestroy(): void {
    this.orderEventService.disconnect();
    this.destroy$.unsubscribe();
  }

  private initializeConnection(): void {
    try {
      this.orderEventService.connect();
      this.showNotification('Conectado al stream de eventos', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al conectar';
      this.showNotification(`Error de conexión: ${message}`, 'error');
    }
  }

  private subscribeToErrors(): void {
    this.destroy$.add(
      this.orderEventService.getErrors.subscribe(error => {
        if (error) {
          this.showNotification(error, 'error', 5000);
        }
      })
    );
  }

  reconnect(): void {
    this.orderEventService.reconnect();
    this.showNotification('Reconectando...', 'info');
  }

  disconnect(): void {
    this.orderEventService.disconnect();
    this.showNotification('Desconectado del stream', 'info');
  }

  clearOrders(): void {
    const currentOrders = this.orders();
    if (currentOrders.length > 0) {
      this.showNotification(`${currentOrders.length} órdenes limpiadas`, 'info');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info', duration = 3000): void {
    const panelClass = type === 'success' ? ['snackbar-success'] : type === 'error' ? ['snackbar-error'] : ['snackbar-info'];
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass
    });
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'PENDING': '#ff9800',
      'PROCESSING': '#2196f3',
      'COMPLETED': '#4caf50',
      'CANCELLED': '#f44336',
      'FAILED': '#9c27b0'
    };
    return statusColors[status?.toUpperCase()] || '#757575';
  }

  getStatusIcon(status: string): string {
    const statusIcons: Record<string, string> = {
      'PENDING': 'schedule',
      'PROCESSING': 'sync',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel',
      'FAILED': 'error'
    };
    return statusIcons[status?.toUpperCase()] || 'help';
  }

  trackByOrderId(index: number, order: OrderEventDto): string {
    return order.orderId || `order-${index}`;
  }

  formatTimestamp(timestamp: string | number | Date): string {
    if (!timestamp) return 'Sin fecha';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatAmount(amount: number | string): string {
    if (amount === null || amount === undefined) return '$0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  }

  getTotalAmount(): string {
    const total = this.orders().reduce((sum, order) => {
      const amount = typeof order.amount === 'string' ? parseFloat(order.amount) : order.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return this.formatAmount(total);
  }
}