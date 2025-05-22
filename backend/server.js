const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",  // Permitir conexiones desde cualquier origen
    methods: ["GET", "POST"]
  }
});

// Configurar archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas para las páginas
app.get('/transmitter', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/transmitter.html'));
});

app.get('/receiver', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/receiver.html'));
});

// Configurar Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Unirse a una sala
  socket.on('join_room', (roomId, userType) => {
    socket.join(roomId);
    console.log(`${userType} conectado en sala ${roomId}`);
  });

  // Enviar señal (Transmisor → Receptor)
  socket.on('send_signal', (roomId, signal) => {
    socket.to(roomId).emit('receive_signal', signal);
  });

  // Enviar mensaje (Receptor → Transmisor)
  socket.on('send_message', (roomId, message) => {
    socket.to(roomId).emit('receive_message', message);
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor en puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});
// Generador de códigos de sala
const generateRoomCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Almacén de salas activas
const activeRooms = new Map();

// Ruta para crear nueva sala
app.post('/api/rooms', (req, res) => {
  const roomCode = generateRoomCode();
  const roomUrl = `https://tudominio.com/join/${roomCode}`; // Cambiar por tu dominio real
  
  activeRooms.set(roomCode, {
    createdAt: new Date(),
    participants: []
  });

  res.json({ 
    roomCode,
    roomUrl,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(roomUrl)}`
  });
});

// Ruta para unirse a sala existente
app.get('/api/rooms/:code', (req, res) => {
  const roomCode = req.params.code;
  
  if (!activeRooms.has(roomCode)) {
    return res.status(404).json({ error: 'Sala no encontrada' });
  }
  
  res.json({ 
    status: 'active',
    participants: activeRooms.get(roomCode).participants.length
  });
});

// ... (resto de la configuración de Socket.io)
