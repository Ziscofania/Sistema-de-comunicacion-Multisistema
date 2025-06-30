document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let roomId;
    
    // Elementos DOM
    const connectBtn = document.getElementById('connectBtn');
    const localVideo = document.getElementById('localVideo');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
  
    // Conectar a sala
    connectBtn.addEventListener('click', async () => {
      roomId = document.getElementById('roomId').value || 'default';
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localVideo.srcObject = stream;
        
        socket.emit('join_room', roomId, 'transmitter');
        console.log(`Transmisor conectado en sala ${roomId}`);
        
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    });
  
    // Enviar mensaje
    sendBtn.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (message && roomId) {
        socket.emit('send_message', roomId, message);
        messageInput.value = '';
      }
    });
  
    // Enviar señales (simulado)
    setInterval(() => {
      if (roomId) {
        const fakeSignal = Math.random().toString(36).substring(7);
        socket.emit('send_signal', roomId, fakeSignal);
      }
    }, 2000);
  });