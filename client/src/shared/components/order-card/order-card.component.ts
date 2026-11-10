import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { OrderEventDto } from '../../../core/services/order-event.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="order-card">
      <mat-card-header>
        <mat-card-title>Orden #{{ order?.orderId }}</mat-card-title>
        <mat-card-subtitle>{{ order?.customerName }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="order-details">
          <div class="detail-row">
            <span class="label">Producto:</span>
            <span class="value">{{ order?.productName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Cantidad:</span>
            <span class="value">{{ order?.quantity }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total:</span>
            <span class="value">{{ order?.total | currency }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fecha:</span>
            <span class="value">{{ order?.timestamp | date:'medium' }}</span>
          </div>
        </div>
        <mat-chip-set class="status-chips">
          <mat-chip [class]="'status-' + order?.status" highlighted>
            <mat-icon>{{ getStatusIcon(order?.status) }}</mat-icon>
            {{ getStatusLabel(order?.status) }}
          </mat-chip>
        </mat-chip-set>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .order-card {
      margin: 16px 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .order-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .label {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
    }
    .value {
      font-weight: 600;
    }
    .status-chips {
      display: flex;
      justify-content: center;
    }
    mat-chip {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .status-pending {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }
    .status-processing {
      background-color: #e3f2fd !important;
      color: #0d47a1 !important;
    }
    .status-completed {
      background-color: #e8f5e9 !important;
      color: #1b5e20 !important;
    }
    .status-cancelled {
      background-color: #ffebee !important;
      color: #b71c1c !important;
    }
  `]
})
export class OrderCardComponent {
  @Input({ required: true }) order!: OrderEventDto;

  getStatusIcon(status?: string): string {
    const icons: Record<string, string> = {
      pending: 'schedule',
      processing: 'sync',
      completed: 'check_circle',
      cancelled: 'cancel'
    };
    return icons[status || 'pending'] || 'help';
  }

  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status || 'pending'] || 'Desconocido';
  }
}