import { Controller, Post, Get, Body, Res, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { OrderEventDto } from '../../domain/order-events.interface';
import { OrderEventService } from '../../application/services/order-event.service';
import { SseService } from '../../common/sse/sse.service';

@ApiTags('orders')
@Controller('orders')
export class OrderEventController {
  private readonly logger = new Logger(OrderEventController.name);

  constructor(
    private readonly orderEventService: OrderEventService,
    private readonly sseService: SseService,
  ) {}

  @Post('events')
  @ApiOperation({ summary: 'Publicar un evento de orden' })
  @ApiCreatedResponse({ description: 'El evento de orden ha sido publicado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos del evento inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno al publicar el evento' })
  async emitOrderEvent(
    @Body() orderEventDto: OrderEventDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      this.logger.log(`Recibido evento de orden: ${orderEventDto.eventType}`);
      
      await this.orderEventService.emitOrderEvent(orderEventDto);
      
      this.sseService.sendEvent({
        type: 'order-event',
        data: orderEventDto,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Evento de orden publicado exitosamente',
        eventId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      });
    } catch (error) {
      this.logger.error(`Error al publicar evento de orden: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al publicar el evento de orden',
        error: error.message,
      });
    }
  }

  @Get('events/stream')
  @ApiOperation({ summary: 'Obtener stream de eventos de órdenes en tiempo real' })
  @ApiResponse({ status: 200, description: 'Stream de eventos establecido correctamente' })
  @ApiResponse({ status: 500, description: 'Error al establecer el stream de eventos' })
  getOrderEventsStream(@Res() res: Response): void {
    try {
      this.logger.log('Estableciendo conexión SSE para eventos de órdenes');
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const clientId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      this.logger.log(`Cliente SSE conectado: ${clientId}`);

      this.sseService.addClient(clientId, res);

      res.write(`: Connected to order events stream\n\n`);

      res.on('close', () => {
        this.logger.log(`Cliente SSE desconectado: ${clientId}`);
        this.sseService.removeClient(clientId);
      });
    } catch (error) {
      this.logger.error(`Error al establecer stream SSE: ${error.message}`, error.stack);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
}