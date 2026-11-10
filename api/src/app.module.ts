import { Module } from '@nestjs/common';
import { OrderEventController } from './infrastructure/controllers/order-event.controller';
import { OrderEventService } from './application/services/order-event.service';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { KafkaProducerService } from './infrastructure/kafka/kafka-producer.service';
import { KafkaConsumerService } from './infrastructure/kafka/kafka-consumer.service';
import { SseService } from './common/sse/sse.service';

@Module({
  imports: [
    KafkaModule,
  ],
  controllers: [
    OrderEventController,
  ],
  providers: [
    OrderEventService,
    KafkaProducerService,
    KafkaConsumerService,
    SseService,
    {
      provide: 'ORDER_EVENT_PUBLISHER',
      useExisting: KafkaProducerService,
    },
    {
      provide: 'ORDER_EVENT_CONSUMER',
      useExisting: KafkaConsumerService,
    },
  ],
  exports: [
    OrderEventService,
  ],
})
export class AppModule {}