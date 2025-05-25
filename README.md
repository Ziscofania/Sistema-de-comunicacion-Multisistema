# Sistema de Comunicación por Lenguaje de Señas 👋

![Banner del Proyecto](https://via.placeholder.com/800x200?text=Sistema+Comunicación+Lenguaje+Señas) <!-- Reemplazar con imagen real -->

Un sistema innovador para comunicación bidireccional en tiempo real mediante lenguaje de señas, con soporte para conexiones locales y remotas.

## 🚀 Comenzando

Sigue estos sencillos pasos para configurar y usar el sistema.

### 📋 Prerrequisitos

- Node.js v16+
- npm v8+
- Conexión a Internet (5 Mbps mínimo recomendado)
- Navegador moderno (Chrome 90+, Firefox 85+, Edge 90+)

## 🔧 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/sign-language-app.git
cd sign-language-app

2. Instalar dependencias

cd backend
npm install

3. Iniciar el servidor

node server.js

4. Verificar instalación

Si todo está correcto, verás en la terminal:

🟢 Servidor operativo en http://localhost:3000
  - Transmisor: http://localhost:3000/transmitter
  - Receptor: http://localhost:3000/receiver

🌐 Uso Local
Modo Transmisor

🔗 Acceder a: http://localhost:3000/transmitter

    Activa tu cámara para captura de señas

    Visualización en tiempo real

    Envío de mensajes de texto complementarios

    Indicadores de estado de conexión

Modo Receptor

🔗 Acceder a: http://localhost:3000/receiver

    Interpretación visual de señas

    Visualización de mensajes de texto

    Síntesis de voz para audio

    Historial de conversación

🌍 Conexión Remota (Nueva Funcionalidad)

El sistema ahora soporta conexiones remotas mediante Ngrok:

    Crear sala - Genera una nueva sesión

    Unirse a sala - Conéctate a una sesión existente

    Seleccionar rol - Elige entre Transmisor o Receptor

Ngrok generará 4 URLs:

    Crear sala

    Unirse a sala

    Transmisor

    Receptor
