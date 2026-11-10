import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrderEventService, OrderEventDto } from '../../../core/services/order-event.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private readonly snackBar = inject(MatSnackBar);

  readonly connectionStatus = this.orderEventService.getConnectionStatus();
  readonly errors = this.orderEventService.getErrors();
  readonly orders = computed(() => {
    const orderList = this.orderEventService.getOrders();
    return [...orderList].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });
  });

  readonly isConnected = computed(() => this.connectionStatus());
  readonly hasError = computed(() => this.errors() !== null);
  readonly errorMessage = computed(() => this.errors());

  readonly orderTypes = ['PURCHASE', 'SALE', 'RETURN', 'CANCELLATION'];
  readonly orderStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];

  newOrder = signal<Partial<OrderEventDto>>({
    orderId: '',
    customerId: '',
    type: 'PURCHASE',
    amount: 0
  });

  isSubmitting = signal(false);

  ngOnInit(): void {
    this.orderEventService.connect();
  }

  ngOnDestroy(): void {
    this.orderEventService.disconnect();
  }

  reconnect(): void {
    this.orderEventService.reconnect();
    this.showNotification('Reconectando al stream de eventos...', 'info');
  }

  disconnect(): void {
    this.orderEventService.disconnect();
    this.showNotification('Desconectado del stream de eventos', 'info');
  }

  async submitOrder(): Promise<void> {
    const order = this.newOrder();

    if (!order.orderId || !order.customerId || !order.type) {
      this.showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (order.amount === undefined || order.amount <= 0) {
      this.showNotification('El monto debe ser mayor a 0', 'error');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const orderEvent: OrderEventDto = {
        orderId: order.orderId!,
        customerId: order.customerId!,
        type: order.type!,
        amount: order.amount!,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };

      await this.orderEventService.emitOrderEvent(orderEvent).toPromise();

      this.showNotification('Orden enviada exitosamente', 'success');
      this.resetForm();
    } catch (error) {
      this.showNotification('Error al enviar la orden', 'error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resetForm(): void {
    this.newOrder.set({
      orderId: '',
      customerId: '',
      type: 'PURCHASE',
      amount: 0
    });
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    const panelClass = type === 'success' ? 'snackbar-success' : 
                       type === 'error' ? 'snackbar-error' : 'snackbar-info';

    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'status-pending',
      'PROCESSING': 'status-processing',
      'COMPLETED': 'status-completed',
      'FAILED': 'status-failed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getTypeIcon(type: string): string {
    const typeMap: Record<string, string> = {
      'PURCHASE': 'shopping_cart',
      'SALE': 'sell',
      'RETURN': 'replay',
      'CANCELLATION': 'cancel'
    };
    return typeMap[type] || 'receipt';
  }
}