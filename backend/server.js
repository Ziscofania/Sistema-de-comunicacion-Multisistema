require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const ngrok = require('ngrok');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas principales
app.get('/transmitter', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/transmitter.html'));
});

app.get('/receiver', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/receiver.html'));
});

app.get('/share', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/share.html'));
});

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/join.html'));
});

// Generador de códigos de sala
const generateRoomCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length: 6}, () => 
    characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

// Almacén de salas activas
const activeRooms = new Map();

// API para manejo de salas
app.post('/api/rooms', (req, res) => {
  const roomCode = generateRoomCode();
  const hostUrl = req.headers['x-forwarded-host'] || req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  
  activeRooms.set(roomCode, {
    createdAt: new Date(),
    participants: [],
    messages: []
  });

  res.json({ 
    roomCode,
    joinUrl: `${protocol}://${hostUrl}/join?room=${roomCode}`,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${protocol}://${hostUrl}/join?room=${roomCode}`)}`,
    adminUrl: `${protocol}://${hostUrl}/share?room=${roomCode}`
  });
});

app.get('/api/rooms/:code', (req, res) => {
  const roomCode = req.params.code;
  if (!activeRooms.has(roomCode)) {
    return res.status(404).json({ error: 'Sala no encontrada' });
  }
  
  const room = activeRooms.get(roomCode);
  res.json({ 
    status: 'active',
    participants: room.participants.length,
    createdAt: room.createdAt,
    messages: room.messages.slice(-10) // Últimos 10 mensajes
  });
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join_room', (roomId, userType) => {
    socket.join(roomId);
    
    if (activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);
      room.participants.push({
        id: socket.id,
        type: userType,
        joinedAt: new Date(),
        device: socket.handshake.headers['user-agent'] || 'unknown'
      });
      
      // Enviar historial de mensajes al nuevo usuario
      socket.emit('message_history', room.messages.slice(-10));
    }

    console.log(`${userType} conectado en sala ${roomId}`);
    io.to(roomId).emit('room_update', {
      participants: activeRooms.get(roomId).participants,
      roomId: roomId
    });
  });

  socket.on('send_signal', (roomId, signal) => {
    const timestamp = new Date().toISOString();
    const payload = {
      ...signal,
      sender: socket.id,
      timestamp
    };
    socket.to(roomId).emit('receive_signal', payload);
  });

  socket.on('send_message', (roomId, message) => {
    const timestamp = new Date().toISOString();
    const messageData = {
      content: message,
      sender: socket.id,
      timestamp,
      type: 'text'
    };

    // Almacenar y transmitir
    if (activeRooms.has(roomId)) {
      const room = activeRooms.get(roomId);
      room.messages.push(messageData);
      io.to(roomId).emit('receive_message', messageData);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    activeRooms.forEach((room, roomId) => {
      room.participants = room.participants.filter(p => p.id !== socket.id);
      if (room.participants.length === 0) {
        // Opcional: Guardar historial antes de eliminar
        activeRooms.delete(roomId);
      } else {
        io.to(roomId).emit('participant_left', socket.id);
      }
    });
  });
});

// Configuración mejorada de Ngrok para Fedora
const startNgrok = async (port) => {
  try {
    // Método 1: Conexión automática corregida
    await ngrok.authtoken(process.env.NGROK_AUTHTOKEN || '2xWY36IJanLQJ1rBKtzwA54kY2R_5H36HUSx6BHS9rwcL1Qef');
    
    const url = await ngrok.connect({
      proto: 'http',
      addr: port,
      region: 'us',
      onStatusChange: status => console.log('Ngrok status:', status)
    });
    return url;
  } catch (autoError) {
    console.error('❌ Error en conexión automática:', autoError.message);
    
    // Método 2: Ejecución manual mejorada
    try {
      console.log('🔧 Iniciando Ngrok manualmente...');
      return await new Promise((resolve, reject) => {
        const ngrokProcess = exec('/usr/local/bin/ngrok http 3000 --log=stdout', 
          (error, stdout, stderr) => {
            if (error) return reject(error);
            const urlMatch = stdout.match(/https:\/\/[a-z0-9-]+\.ngrok\.io/);
            resolve(urlMatch ? urlMatch[0] : null);
          });
      });
    } catch (manualError) {
      console.error('⚠️ Error en método manual:', manualError.message);
      return null;
    }
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`\n✅ Servidor local en http://localhost:${PORT}`);
  
  const url = await startNgrok(PORT);
  if (url) {
    console.log(`\n🌐 URL pública Ngrok: ${url}`);
    console.log('\n🔗 Endpoints disponibles:');
    console.log(`- Transmisor:    ${url}/transmitter`);
    console.log(`- Receptor:      ${url}/receiver`);
    console.log(`- Crear sala:    ${url}/share`);
    console.log(`- Unirse:        ${url}/join`);
    console.log(`\n📊 Panel de control: http://localhost:4040`);
  } else {
    console.log('\n⚠️ Modo local-only. Para acceso externo:');
    console.log('1. Abre otra terminal');
    console.log('2. Ejecuta: ngrok http 3000');
    console.log('3. Usa la URL que aparece');
  }
});

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n🔌 Cerrando conexiones...');
  try {
    await ngrok.kill();
  } catch (e) {
    console.log('⚠️ No se pudo cerrar Ngrok:', e.message);
  }
  server.close(() => {
    console.log('Servidor detenido correctamente');
    process.exit();
  });
});

// Middleware para errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});