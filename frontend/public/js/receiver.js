document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const roomInput = document.getElementById('roomId');
    const connectBtn = document.getElementById('connectBtn');
    const signAnimationContainer = document.getElementById('signAnimationContainer');
    const currentSignLabel = document.getElementById('currentSignLabel');
    const signProgress = document.getElementById('signProgress');
    const messageOutput = document.getElementById('messageOutput');
    const speakBtn = document.getElementById('speakBtn');
    const copyBtn = document.getElementById('copyBtn');
    const replyInput = document.getElementById('replyInput');
    const sendReplyBtn = document.getElementById('sendReplyBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const translationStatus = document.getElementById('translationStatus');

    let roomId = '';
    let currentMessage = '';

    // Conectar a sala
    connectBtn.addEventListener('click', () => {
        roomId = roomInput.value.trim() || 'default';
        socket.emit('join_room', roomId, 'receiver');
        updateConnectionStatus(true, `Conectado en sala: ${roomId}`);
    });

    // Recibir señas
    socket.on('receive_signal', (signal) => {
        displaySign(signal);
    });

    // Recibir mensajes
    socket.on('receive_message', (message) => {
        currentMessage = message;
        const messageElement = document.createElement('div');
        messageElement.className = 'message fade-in';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                <span class="message-sender">Transmisor</span>
            </div>
            <div class="message-content">${message}</div>
        `;
        messageOutput.prepend(messageElement);
    });

    // Leer mensaje en voz alta
    speakBtn.addEventListener('click', () => {
        if (currentMessage && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentMessage);
            utterance.lang = 'es-ES';
            speechSynthesis.speak(utterance);
        }
    });

    // Copiar mensaje
    copyBtn.addEventListener('click', () => {
        if (currentMessage) {
            navigator.clipboard.writeText(currentMessage)
                .then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
        }
    });

    // Responder
    sendReplyBtn.addEventListener('click', () => {
        const reply = replyInput.value.trim();
        if (reply && roomId) {
            socket.emit('send_message', roomId, reply);
            replyInput.value = '';
        }
    });

    // Mostrar seña
    function displaySign(signal) {
        signAnimationContainer.innerHTML = `
            <div class="sign-animation">
                <div class="sign-letter">${signal.value}</div>
                <div class="sign-confidence">Confianza: ${signal.confidence}%</div>
            </div>
        `;
        currentSignLabel.textContent = `Letra actual: ${signal.value}`;
        translationStatus.innerHTML = '<i class="fas fa-check-circle"></i> Seña detectada';
    }

    function updateConnectionStatus(isConnected, message) {
        const icon = connectionStatus.querySelector('i');
        if (isConnected) {
            connectionStatus.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
            connectionStatus.style.color = '#388e3c';
        } else {
            connectionStatus.innerHTML = '<i class="fas fa-times-circle"></i> ' + message;
            connectionStatus.style.color = '#d32f2f';
        }
    }

    // Manejo de desconexión
    socket.on('disconnect', () => {
        updateConnectionStatus(false, 'Desconectado del servidor');
    });
});