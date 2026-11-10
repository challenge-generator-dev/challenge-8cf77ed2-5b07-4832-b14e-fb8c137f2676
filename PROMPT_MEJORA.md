# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders/events`
  - `GET /orders/events/stream`
- `client` expone http:

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Archivos que la arquitectura del reto declara y no estan

Creálos con implementacion real, en la capa que les corresponde:

- `client/app.config.ts`

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/infrastructure/kafka/kafka-producer.service.ts` — `OrderEvent.map`: Se invoca `map` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/test/order-event.service.spec.ts` — `OrderEventService.consumeOrderEvents`: Se invoca `consumeOrderEvents` sobre `OrderEventService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/package.json` — `kafka-js@2.2.4`: kafka-js declara el rango ^2.2.4, que no resuelve a ninguna version publicada: `npm install` falla con ETARGET. Reemplazala por una version publicada real.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261109193147506), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de visualización de órdenes en tiempo real
- Tiempo estimado: 12 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del entorno Kafka — objetivo: Configurar y verificar la conectividad con el cluster Kafka. — entregable (NO resolver): Entorno de desarrollo configurado y conectividad con Kafka verificada.
- Fase 2: Publicación de eventos de órdenes en Kafka — objetivo: Publicar eventos de órdenes en un tópico Kafka. — entregable (NO resolver): Servicio que publica eventos de órdenes en Kafka.
- Fase 3: Consumo de eventos de órdenes desde Kafka — objetivo: Consumir eventos de órdenes desde un tópico Kafka y mostrarlos en la interfaz. — entregable (NO resolver): Servicio que consume eventos de órdenes desde Kafka y los muestra en la interfaz.
- Fase 4: Integración y verificación final — objetivo: Integrar y verificar el sistema completo para mostrar el estado de las órdenes en tiempo real. — entregable (NO resolver): Sistema completo que muestra el estado de las órdenes en tiempo real.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-events-api",
  "version": "1.0.0",
  "description": "API para publicación y consumo de eventos de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:prod": "node dist/main.js",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10.4.15",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.15",
    "@nestjs/platform-express": "^10.4.15",
    "@nestjs/swagger": "^7.1.13",
    "@nestjs/websockets": "^10.4.15",
    "class-validator": "^0.14.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.4.15",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.5",
    "@types/node": "^20.8.0",
    "@typescript-eslint/eslint-plugin": "^6.7.3",
    "@typescript-eslint/parser": "^6.7.3",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "ts-jest": "^29.1.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": ".",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "strict": true
  },
  "exclude": ["node_modules"],
  "include": ["src/**/*", "test/**/*"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Order Events API')
    .setDescription('API para publicación y consumo de eventos de órdenes en tiempo real')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/order.entity.ts ===
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';

export enum OrderStatus {
    CREATED = 'CREATED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'ORD-2024-001' })
    @IsString()
    orderNumber: string;

    @ApiProperty({ example: 100.50 })
    @IsNumber()
    totalAmount: number;

    @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty({ example: '2024-05-20T10:00:00Z' })
    @IsDateString()
    createdAt: string;

    @ApiProperty({ example: '2024-05-20T10:05:00Z' })
    @IsDateString()
    updatedAt: string;

    @ApiProperty({ example: ['PROD-001', 'PROD-002'] })
    @IsString({ each: true })
    productIds: string[];

    constructor(
        id: string,
        orderNumber: string,
        totalAmount: number,
        status: OrderStatus,
        createdAt: string,
        updatedAt: string,
        productIds: string[]
    ) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.productIds = productIds;
    }

    updateStatus(newStatus: OrderStatus): void {
        this.status = newStatus;
        this.updatedAt = new Date().toISOString();
    }
}

// === ARCHIVO: api/src/domain/order-events.interface.ts ===
import { Order } from './order.entity';

export enum OrderEventType {
    ORDER_CREATED = 'ORDER_CREATED',
    ORDER_UPDATED = 'ORDER_UPDATED',
    ORDER_CANCELLED = 'ORDER_CANCELLED'
}

export interface OrderEvent {
    eventId: string;
    eventType: OrderEventType;
    order: Order;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface OrderEventPublisher {
    emitOrderEvent(event: OrderEvent): Promise<void>;
}

export interface OrderEventConsumer {
    consumeOrderEvents(callback: (event: OrderEvent) => void): Promise<void>;
}

export class OrderEventDto {
    @ApiProperty({ enum: OrderEventType, example: OrderEventType.ORDER_CREATED })
    eventType: OrderEventType;

    @ApiProperty({ type: Order })
    order: Order;

    @ApiProperty({ example: '2024-05-20T10:00:00Z' })
    timestamp: string;

    @ApiProperty({ required: false, example: { source: 'mobile' } })
    metadata?: Record<string, unknown>;

    constructor(eventType: OrderEventType, order: Order, timestamp: string, metadata?: Record<string, unknown>) {
        this.eventType = eventType;
        this.order = order;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }
}

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/services/order-event.service.ts ===
import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { OrderEventDto, OrderEvent, OrderEventType, OrderEventPublisher, OrderEventConsumer } from '../../domain/order-events.interface';
import { Order } from '../../domain/order.entity';
import { SseService } from '../../common/sse/sse.service';

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private readonly eventSubject = new Subject<OrderEvent>();
  private isConsuming = false;

  constructor(
    @Inject('ORDER_EVENT_PUBLISHER') private readonly publisher: OrderEventPublisher,
    @Inject('ORDER_EVENT_CONSUMER') private readonly consumer: OrderEventConsumer,
    private readonly sseService: SseService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('OrderEventService initialized');
    await this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('OrderEventService destroyed - stopping event consumption');
    this.isConsuming = false;
  }

  async emitOrderEvent(eventDto: OrderEventDto): Promise<void> {
    const orderEvent: OrderEvent = {
      eventType: eventDto.eventType,
      order: eventDto.order,
      timestamp: eventDto.timestamp || new Date().toISOString(),
      metadata: eventDto.metadata || {},
    };

    try {
      await this.publisher.emitOrderEvent(orderEvent);
      this.logger.log(`Event emitted: ${orderEvent.eventType} for order ${orderEvent.order.id}`);
      this.eventSubject.next(orderEvent);
    } catch (error) {
      this.logger.error(`Failed to emit order event: ${error}`);
      throw error;
    }
  }

  getOrderEventsStream(): Observable<OrderEvent> {
    return this.eventSubject.asObservable();
  }

  private async startConsuming(): Promise<void> {
    if (this.isConsuming) {
      this.logger.warn('Event consumption already started');
      return;
    }

    this.isConsuming = true;
    this.logger.log('Starting Kafka event consumption');

    try {
      await this.consumer.consumeOrderEvents(async (event: OrderEvent) => {
        this.logger.log(`Received event from Kafka: ${event.eventType} for order ${event.order.id}`);
        this.eventSubject.next(event);
        this.sseService.sendEvent(event);
      });
    } catch (error) {
      this.logger.error(`Error in Kafka consumer: ${error}`);
      this.isConsuming = false;
    }
  }

  async processEvent(eventType: OrderEventType, order: Order, metadata?: Record<string, unknown>): Promise<void> {
    const eventDto = new OrderEventDto(
      eventType,
      order,
      new Date().toISOString(),
      metadata,
    );
    await this.emitOrderEvent(eventDto);
  }

  getEventHistory(): OrderEvent[] {
    return [];
  }

  isConsumerActive(): boolean {
    return this.isConsuming;
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
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

// === ARCHIVO: api/src/infrastructure/kafka/kafka-producer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, ProducerRecord } from 'kafka-js';
import { OrderEvent, OrderEventPublisher } from '../../domain/order-events.interface';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy, OrderEventPublisher {
  private readonly logger = new Logger(KafkaProducerService.name);
  private client: Kafka;
  private producer: Producer;
  private readonly topic = 'order-events';

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
    this.client = new Kafka({
      clientId: 'order-events-producer',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.producer = this.client.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka producer', error);
    }
  }

  async emitOrderEvent(event: OrderEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.order.id,
          value: JSON.stringify(event),
          timestamp: event.timestamp,
          headers: {
            eventType: event.eventType,
            orderId: event.order.id,
          },
        },
      ],
    };

    try {
      await this.producer.send(record);
      this.logger.log(`Order event emitted: ${event.eventType} for order ${event.order.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit order event for order ${event.order.id}`, error);
      throw error;
    }
  }

  async sendBatch(events: OrderEvent[]): Promise<void> {
    const messages = events.map((event) => ({
      key: event.order.id,
      value: JSON.stringify(event),
      timestamp: event.timestamp,
      headers: {
        eventType: event.eventType,
        orderId: event.order.id,
      },
    }));

    const record: ProducerRecord = {
      topic: this.topic,
      messages,
    };

    try {
      await this.producer.send(record);
      this.logger.log(`Batch of ${events.length} order events emitted`);
    } catch (error) {
      this.logger.error(`Failed to emit batch of ${events.length} order events`, error);
      throw error;
    }
  }

  getTopic(): string {
    return this.topic;
  }

  isConnected(): boolean {
    return this.producer.isConnected();
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka-consumer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafka-js';
import { Subject, Observable } from 'rxjs';
import { OrderEvent, OrderEventConsumer } from '../../domain/order-events.interface';
import { OrderStatus } from '../../domain/order.entity';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy, OrderEventConsumer {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private client: Kafka;
  private consumer: Consumer;
  private readonly topic = 'order-events';
  private readonly groupId = 'order-events-consumer-group';
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000;

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');
    this.client = new Kafka({
      clientId: 'order-events-consumer',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.consumer = this.client.consumer({ groupId: this.groupId });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.logger.log(`Kafka consumer connected and subscribed to topic: ${this.topic}`);
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.eventsSubject.complete();
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka consumer', error);
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    
    if (!message.value) {
      this.logger.warn(`Received empty message on ${topic}[${partition}]`);
      return;
    }

    try {
      const event = this.parseMessage(message.value.toString());
      this.logger.debug(`Processing event: ${event.eventType} for order ${event.order.id}`);
      this.eventsSubject.next(event);
    } catch (error) {
      this.logger.error(`Failed to process message from ${topic}[${partition}]`, error);
      await this.handleRetry(payload);
    }
  }

  private parseMessage(value: string): OrderEvent {
    const parsed = JSON.parse(value);
    
    const order = {
      id: parsed.order.id,
      customerId: parsed.order.customerId,
      totalAmount: parsed.order.totalAmount,
      status: parsed.order.status as OrderStatus,
      createdAt: parsed.order.createdAt,
      updatedAt: parsed.order.updatedAt,
    };

    return {
      eventType: parsed.eventType,
      order,
      timestamp: parsed.timestamp,
      metadata: parsed.metadata || {},
    };
  }

  private async handleRetry(payload: EachMessagePayload, attempt = 1): Promise<void> {
    if (attempt > this.retryAttempts) {
      this.logger.error(
        `Max retry attempts reached for message at ${payload.topic}[${payload.partition}][${payload.message.offset}]`,
      );
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, this.retryDelay * attempt));
    this.logger.warn(`Retrying message processing, attempt ${attempt + 1}/${this.retryAttempts}`);
    
    try {
      await this.handleMessage(payload);
    } catch (error) {
      await this.handleRetry(payload, attempt + 1);
    }
  }

  async consumeOrderEvents(callback: (event: OrderEvent) => void): Promise<void> {
    this.eventsSubject.subscribe({
      next: (event) => {
        try {
          callback(event);
        } catch (error) {
          this.logger.error('Error in event callback', error);
        }
      },
      error: (error) => {
        this.logger.error('Error in events stream', error);
      },
    });
  }

  getEventsStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  getTopic(): string {
    return this.topic;
  }

  getGroupId(): string {
    return this.groupId;
  }

  async pause(): Promise<void> {
    await this.consumer.pause();
    this.logger.log('Kafka consumer paused');
  }

  async resume(): Promise<void> {
    await this.consumer.resume();
    this.logger.log('Kafka consumer resumed');
  }

  isConnected(): boolean {
    return this.consumer.isConnected();
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order-event.controller.ts ===
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

// === ARCHIVO: api/src/common/sse/sse.service.ts ===
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

// === ARCHIVO: api/test/order-event.service.spec.ts ===
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

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^20.0.0",
    "@angular/common": "^20.0.0",
    "@angular/compiler": "^20.0.0",
    "@angular/core": "^20.0.0",
    "@angular/forms": "^20.0.0",
    "@angular/material": "^20.0.0",
    "@angular/platform-browser": "^20.0.0",
    "@angular/platform-browser-dynamic": "^20.0.0",
    "@angular/router": "^20.0.0",
    "rxjs": "~7.8.1",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "^20.0.0",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-preset-angular": "^13.1.0",
    "typescript": "~5.8.0"
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss",
          "skipTests": false
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "development": {
              "buildTarget": "client:build:development"
            },
            "production": {
              "buildTarget": "client:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "client:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:jest",
          "options": {
            "tsConfig": "tsconfig.spec.json",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "config": "jest.config.js",
            "passWithNoTests": true
          }
        }
      }
    }
  },
  "defaultProject": "client"
}

// === ARCHIVO: client/src/core/services/order-event.service.ts ===
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

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación Angular:', err));

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Real-Time Orders</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Sistema de visualización de órdenes en tiempo real con Kafka">
  <meta name="theme-color" content="#1976d2">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
  <noscript>
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript Requerido</h1>
      <p>Por favor, habilite JavaScript en su navegador para usar esta aplicación.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouterTransition } from './core/animations/router-transition.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      [],
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(
      withFetch()
    ),
    provideAnimations(),
    provideRouterTransition()
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
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

// === ARCHIVO: client/src/features/orders/order-list/order-list.component.ts ===
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

// === ARCHIVO: client/src/features/orders/order-list/order-list.component.html ===
<div class="order-list-container">
  <header class="order-list-header">
    <div class="header-content">
      <h1 class="title">
        <mat-icon class="title-icon">list_alt</mat-icon>
        Órdenes en Tiempo Real
      </h1>
      <div class="connection-status" [class.connected]="isConnected()" [class.disconnected]="!isConnected()">
        <mat-icon>{{ isConnected() ? 'wifi' : 'wifi_off' }}</mat-icon>
        <span>{{ isConnected() ? 'Conectado' : 'Desconectado' }}</span>
      </div>
    </div>

    <div class="header-actions">
      <button mat-raised-button
              color="primary"
              (click)="reconnect()"
              [disabled]="isConnected()"
              class="action-button">
        <mat-icon>refresh</mat-icon>
        Reconectar
      </button>
      <button mat-raised-button
              color="warn"
              (click)="disconnect()"
              [disabled]="!isConnected()"
              class="action-button">
        <mat-icon>wifi_off</mat-icon>
        Desconectar
      </button>
    </div>
  </header>

  <div class="error-banner" *ngIf="hasError()">
    <mat-icon>error_outline</mat-icon>
    <span>{{ errorMessage() }}</span>
    <button mat-icon-button (click)="reconnect()">
      <mat-icon>refresh</mat-icon>
    </button>
  </div>

  <div class="content-wrapper">
    <section class="orders-form-section">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>add_circle</mat-icon>
            Nueva Orden
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="submitOrder()" class="order-form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>ID de Orden</mat-label>
              <input matInput
                     [value]="newOrder().orderId"
                     (input)="newOrder.set({...newOrder(), orderId: $any($event.target).value})"
                     placeholder="ORD-001"
                     required />
              <mat-icon matPrefix>tag</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>ID de Cliente</mat-label>
              <input matInput
                     [value]="newOrder().customerId"
                     (input)="newOrder.set({...newOrder(), customerId: $any($event.target).value})"
                     placeholder="CLI-001"
                     required />
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tipo de Orden</mat-label>
              <mat-select [value]="newOrder().type"
                          (selectionChange)="newOrder.set({...newOrder(), type: $event.value})">
                <mat-option *ngFor="let type of orderTypes" [value]="type">
                  {{ type }}
                </mat-option>
              </mat-select>
              <mat-icon matPrefix>category</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Monto</mat-label>
              <input matInput
                     type="number"
                     [value]="newOrder().amount"
                     (input)="newOrder.set({...newOrder(), amount: +$any($event.target).value})"
                     min="0"
                     step="0.01"
                     required />
              <mat-icon matPrefix>attach_money</mat-icon>
            </mat-form-field>

            <button mat-raised-button
                    color="accent"
                    type="submit"
                    [disabled]="isSubmitting()"
                    class="submit-button">
              <mat-spinner *ngIf="isSubmitting()" diameter="20"></mat-spinner>
              <mat-icon *ngIf="!isSubmitting()">send</mat-icon>
              <span>{{ isSubmitting() ? 'Enviando...' : 'Enviar Orden' }}</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </section>

    <section class="orders-list-section">
      <div class="section-header">
        <h2 class="section-title">
          <mat-icon>receipt_long</mat-icon>
          Historial de Órdenes
        </h2>
        <mat-chip class="order-count-chip">
          {{ orders().length }} ordenes
        </mat-chip>
      </div>

      <div class="orders-grid" *ngIf="orders().length > 0; else noOrders">
        <mat-card *ngFor="let order of orders()" class="order-card" [ngClass]="getStatusClass(order.status)">
          <mat-card-header>
            <div class="order-header">
              <div class="order-id">
                <mat-icon>{{ getTypeIcon(order.type) }}</mat-icon>
                <span class="order-id-text">{{ order.orderId }}</span>
              </div>
              <mat-chip class="status-chip" [ngClass]="getStatusClass(order.status)">
                {{ order.status }}
              </mat-chip>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="order-details">
              <div class="detail-row">
                <mat-icon>person</mat-icon>
                <span class="detail-label">Cliente:</span>
                <span class="detail-value">{{ order.customerId }}</span>
              </div>

              <div class="detail-row">
                <mat-icon>category</mat-icon>
                <span class="detail-label">Tipo:</span>
                <span class="detail-value">{{ order.type }}</span>
              </div>

              <div class="detail-row">
                <mat-icon>attach_money</mat-icon>
                <span class="detail-label">Monto:</span>
                <span class="detail-value amount">{{ formatAmount(order.amount) }}</span>
              </div>

              <div class="detail-row">
                <mat-icon>schedule</mat-icon>
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">{{ formatDate(order.timestamp) }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noOrders>
        <div class="no-orders">
          <mat-icon>inbox</mat-icon>
          <p>No hay órdenes disponibles</p>
          <span class="no-orders-hint">Conecta al stream de eventos para recibir órdenes en tiempo real</span>
        </div>
      </ng-template>
    </section>
  </div>
</div>

// === ARCHIVO: client/src/features/orders/order-list/order-list.component.scss ===
.order-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 24px;
}

.order-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 28px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .header-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #1a1a2e;

    .title-icon {
      color: #6366f1;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
  }

  .connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 24px;
    font-weight: 500;
    font-size: 0.875rem;

    &.connected {
      background: #dcfce7;
      color: #166534;

      mat-icon {
        color: #22c55e;
      }
    }

    &.disconnected {
      background: #fee2e2;
      color: #991b1b;

      mat-icon {
        color: #ef4444;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;

    .action-button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin-bottom: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;

  mat-icon {
    color: #ef4444;
  }

  span {
    flex: 1;
    font-weight: 500;
  }

  button {
    color: #dc2626;
  }
}

.content-wrapper {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.orders-form-section {
  .form-card {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 24px;

    mat-card-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
      border-radius: 16px 16px 0 0;

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #374151;

        mat-icon {
          color: #6366f1;
        }
      }
    }

    mat-card-content {
      padding: 24px;
    }
  }

  .order-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .form-field {
      width: 100%;
    }

    .submit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: 600;
      margin-top: 8px;

      mat-spinner {
        display: inline-block;
      }
    }
  }
}

.orders-list-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a2e;

      mat-icon {
        color: #6366f1;
      }
    }

    .order-count-chip {
      background: #e0e7ff;
      color: #4338ca;
      font-weight: 600;
    }
  }

  .orders-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .order-card {
    border-radius: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    mat-card-header {
      padding: 16px 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .order-id {
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          color: #6366f1;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        .order-id-text {
          font-weight: 700;
          font-size: 1rem;
          color: #1f2937;
        }
      }

      .status-chip {
        font-weight: 600;
        font-size: 0.75rem;
        padding: 4px 10px;
        border-radius: 12px;

        &.status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        &.status-processing {
          background: #dbeafe;
          color: #1e40af;
        }

        &.status-completed {
          background: #dcfce7;
          color: #166534;
        }

        &.status-failed {
          background: #fee2e2;
          color: #991b1b;
        }

        &.status-cancelled {
          background: #f3f4f6;
          color: #6b7280;
        }
      }
    }

    mat-card-content {
      padding: 20px;

      .order-details {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;

          mat-icon {
            color: #9ca3af;
            font-size: 18px;
            width: 18px;
            height: 18px;
          }

          .detail-label {
            font-weight: 500;
            color: #6b7280;
            min-width: 60px;
          }

          .detail-value {
            font-weight: 600;
            color: #1f2937;

            &.amount {
              color: #059669;
              font-size: 1.1rem;
            }
          }
        }
      }
    }

    &.status-completed {
      border-left: 4px solid #22c55e;
    }

    &.status-failed {
      border-left: 4px solid #ef4444;
    }

    &.status-pending {
      border-left: 4px solid #f59e0b;
    }

    &.status-processing {
      border-left: 4px solid #3b82f6;
    }

    &.status-cancelled {
      border-left: 4px solid #9ca3af;
    }
  }

  .no-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    text-align: center;

    mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d1d5db;
      margin-bottom: 16px;
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #6b7280;
    }

    .no-orders-hint {
      margin-top: 8px;
      font-size: 0.875rem;
      color: #9ca3af;
    }
  }
}

// === ARCHIVO: client/src/shared/components/order-card/order-card.component.ts ===
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

// === ARCHIVO: client/test/order-event.service.spec.ts ===
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

// === ARCHIVO: client/src/app/core/animations/router-transition.provider.ts ===
import { Provider } from '@angular/core';
import { provideTransition } from '@angular/platform-browser/animations';

export function provideRouterTransition(): Provider {
  return provideTransition();
}

// === ARCHIVO: client/tsconfig.spec.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jest"
    ],
    "module": "ES2022",
    "target": "ES2022",
    "useDefineForClassFields": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts",
    "test/**/*.ts"
  ],
  "exclude": [
    "src/**/*.e2e.spec.ts",
    "src/**/*.po.ts"
  ],
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "enableI18nLegacyMessageIdFormat": false
  }
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
