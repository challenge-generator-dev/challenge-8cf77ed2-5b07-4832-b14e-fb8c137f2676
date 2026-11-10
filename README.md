# Implementación de visualización de órdenes en tiempo real

El sistema debe permitir la publicación y consumo de eventos en un tópico Kafka para mostrar el estado de las órdenes en tiempo real en la interfaz de usuario. Los eventos deben ser reflejados de manera inmediata en la interfaz una vez recibidos.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 12 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del entorno Kafka

**Objetivo:** Configurar y verificar la conectividad con el cluster Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Configurar el entorno de desarrollo para conectarse al cluster Kafka.
- Verificar la conectividad mediante la publicación y consumo de un evento de prueba.

**Entregable:** Entorno de desarrollo configurado y conectividad con Kafka verificada.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración de brokers Kafka
- Uso de clientes Kafka para publicación y consumo

</details>

### Fase 2: Publicación de eventos de órdenes en Kafka

**Objetivo:** Publicar eventos de órdenes en un tópico Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Crear un servicio que publique eventos de órdenes en un tópico Kafka.
- Verificar que los eventos son publicados correctamente.

**Entregable:** Servicio que publica eventos de órdenes en Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Creación de servicios para publicación de eventos
- Manejo de excepciones en la publicación de eventos

</details>

### Fase 3: Consumo de eventos de órdenes desde Kafka

**Objetivo:** Consumir eventos de órdenes desde un tópico Kafka y mostrarlos en la interfaz.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Crear un servicio que consuma eventos de órdenes desde un tópico Kafka.
- Actualizar la interfaz de usuario para mostrar los eventos recibidos en tiempo real.

**Entregable:** Servicio que consume eventos de órdenes desde Kafka y los muestra en la interfaz.

<details>
<summary>Pistas de conocimiento</summary>

- Creación de servicios para consumo de eventos
- Actualización de la interfaz de usuario en tiempo real

</details>

### Fase 4: Integración y verificación final

**Objetivo:** Integrar y verificar el sistema completo para mostrar el estado de las órdenes en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Integrar los servicios de publicación y consumo de eventos.
- Verificar que el sistema completo funciona correctamente y muestra el estado de las órdenes en tiempo real.

**Entregable:** Sistema completo que muestra el estado de las órdenes en tiempo real.

<details>
<summary>Pistas de conocimiento</summary>

- Integración de servicios
- Verificación de funcionalidades completas

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Kafka y cómo se utiliza en este contexto?
- **comoSeUsa**: ¿Cómo se publican y consumen eventos en Kafka?
- **erroresComunes**: ¿Cuáles son los errores comunes al trabajar con Kafka y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones se deben tomar al diseñar un sistema de publicación y consumo de eventos en Kafka?

## Criterios de Evaluacion

- Configuración correcta del entorno Kafka.
- Publicación exitosa de eventos de órdenes en Kafka.
- Consumo exitoso de eventos de órdenes desde Kafka.
- Actualización en tiempo real de la interfaz de usuario con los eventos recibidos.
- Integración y verificación exitosa del sistema completo.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
