import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly producerService: KafkaProducerService,
    private readonly consumerService: KafkaConsumerService,
  ) {}

  async onModuleInit() {
    await this.producerService.connect();
    await this.consumerService.connect();
  }

  async onModuleDestroy() {
    await this.producerService.disconnect();
    await this.consumerService.disconnect();
  }
}