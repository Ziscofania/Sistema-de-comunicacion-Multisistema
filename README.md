# Sistema de Comunicación por Lenguaje de Señas

## 📌 Descripción del Proyecto
Este sistema innovador permite la comunicación bidireccional en tiempo real entre personas mediante lenguaje de señas. La solución integra:

- **Módulo transmisor**: Captura y envía señas mediante visión por computadora.
- **Módulo receptor**: Visualiza e interpreta las señas recibidas.
- **Conexión remota**: Utiliza WebSockets para comunicación en tiempo real y WebRTC para transmisión de video de baja latencia.

---

## ⚙️ Requisitos del Sistema
Antes de comenzar, asegúrese de tener instalado:

- Node.js versión 16 o superior
- npm versión 8 o superior
- Conexión a internet estable (mínimo 5 Mbps recomendado)
- Navegador web moderno (Chrome 90+, Firefox 85+, Edge 90+)

---

## 🚀 Instalación y Configuración

### Paso 1: Clonar el repositorio
Para obtener el código fuente, ejecute:

```bash
git clone https://github.com/tuusuario/sign-language-app.git
cd sign-language-app

Paso 2: Instalar dependencias del servidor (backend)

cd backend
npm install

Paso 3: Iniciar el servidor

node server.js

✅ Mensaje de confirmación

Si todo está correctamente configurado, deberías ver en la terminal el siguiente mensaje:

🟢 Servidor operativo en http://localhost:3000
  - Transmisor: http://localhost:3000/transmitter
  - Receptor: http://localhost:3000/receiver

🧪 Uso del Sistema
1. Modo Transmisor

Acceso: http://localhost:3000/transmitter

Funcionalidades principales:

    Activación de cámara para captura continua de señas.

    Visualización en tiempo real del flujo de video.

    Panel para envío de mensajes de texto complementarios.

    Indicadores de estado de conexión.

2. Modo Receptor

Acceso: http://localhost:3000/receiver

Funcionalidades principales:

    Recepción e interpretación visual de señas.

    Visualización de mensajes de texto asociados.

    Reproducción de audio mediante síntesis de voz.

    Historial de conversación.