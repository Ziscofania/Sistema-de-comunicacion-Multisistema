document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    
    // Elementos DOM
    const connectBtn = document.getElementById('connectBtn');
    const signalDisplay = document.getElementById('signalDisplay');
    const messageDisplay = document.getElementById('messageDisplay');
  
    // Conectar a sala
    connectBtn.addEventListener('click', () => {
      const roomId = document.getElementById('roomId').value || 'default';
      socket.emit('join_room', roomId, 'receiver');
      console.log(`Receptor conectado en sala ${roomId}`);
    });
  
    // Recibir señales
    socket.on('receive_signal', (signal) => {
      signalDisplay.textContent = `Seña recibida: ${signal}`;
    });
  
    // Recibir mensajes
    socket.on('receive_message', (message) => {
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageDisplay.prepend(messageElement);
    });
  });