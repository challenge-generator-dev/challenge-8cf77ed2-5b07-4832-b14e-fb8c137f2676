import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SseEvent {
  type: string;
  data: unknown;
  timestamp?: string;
}

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);
  private readonly clients: Map<string, Response> = new Map();
  private readonly eventSubject: Subject<SseEvent> = new Subject<SseEvent>();

  constructor() {
    this.eventSubject.subscribe((event) => {
      this.broadcastToClients(event);
    });
  }

  addClient(clientId: string, response: Response): void {
    this.clients.set(clientId, response);
    this.logger.log(`Cliente agregado al stream SSE: ${clientId}. Total clientes: ${this.clients.size}`);
  }

  removeClient(clientId: string): void {
    const removed = this.clients.delete(clientId);
    if (removed) {
      this.logger.log(`Cliente removido del stream SSE: ${clientId}. Total clientes: ${this.clients.size}`);
    }
  }

  sendEvent(event: SseEvent): void {
    const eventWithTimestamp: SseEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };
    this.eventSubject.next(eventWithTimestamp);
  }

  getEventStream(): Observable<SseEvent> {
    return this.eventSubject.asObservable();
  }

  getClientsCount(): number {
    return this.clients.size;
  }

  private broadcastToClients(event: SseEvent): void {
    const eventData = this.formatSseEvent(event);
    
    this.clients.forEach((client, clientId) => {
      try {
        if (!client.writableEnded) {
          client.write(eventData);
        } else {
          this.logger.warn(`Cliente ${clientId} tiene conexión terminada, removiendo`);
          this.clients.delete(clientId);
        }
      } catch (error) {
        this.logger.error(`Error al enviar evento a cliente ${clientId}: ${error.message}`);
        this.clients.delete(clientId);
      }
    });
  }

  private formatSseEvent(event: SseEvent): string {
    const eventString = `event: ${event.type}\n`;
    const dataString = `data: ${JSON.stringify(event.data)}\n`;
    const timestampString = event.timestamp ? `id: ${event.timestamp}\n` : '';
    return `${eventString}${timestampString}${dataString}\n`;
  }

  onModuleInit(): void {
    this.logger.log('SseService inicializado');
  }

  onModuleDestroy(): void {
    this.logger.log('Cerrando todas las conexiones SSE');
    this.clients.forEach((client, clientId) => {
      try {
        if (!client.writableEnded) {
          client.end();
        }
      } catch (error) {
        this.logger.error(`Error al cerrar conexión del cliente ${clientId}: ${error.message}`);
      }
    });
    this.clients.clear();
    this.eventSubject.complete();
  }
}