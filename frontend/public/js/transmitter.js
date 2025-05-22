document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const roomInput = document.getElementById('roomId');
    const connectBtn = document.getElementById('connectBtn');
    const startCameraBtn = document.getElementById('startCamera');
    const stopCameraBtn = document.getElementById('stopCamera');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const clearBtn = document.getElementById('clearBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const signDetectionStatus = document.getElementById('signDetectionStatus');
    const localVideo = document.getElementById('localVideo');
    const signCanvas = document.getElementById('signCanvas');
    const ctx = signCanvas.getContext('2d');

    let roomId = '';
    let stream = null;
    let isCameraOn = false;
    let signDetectionInterval;

    // Conectar a sala
    connectBtn.addEventListener('click', () => {
        roomId = roomInput.value.trim() || 'default';
        
        socket.emit('join_room', roomId, 'transmitter');
        updateConnectionStatus(true, `Conectado en sala: ${roomId}`);
        
        // Iniciar detección de señas (simulado)
        startSignDetection();
    });

    // Control de cámara
    startCameraBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 }, 
                audio: false 
            });
            localVideo.srcObject = stream;
            isCameraOn = true;
            startCameraBtn.disabled = true;
            stopCameraBtn.disabled = false;
            signDetectionStatus.innerHTML = '<i class="fas fa-hand-paper"></i> Detectando señas...';
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            signDetectionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error al acceder a la cámara';
        }
    });

    stopCameraBtn.addEventListener('click', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            localVideo.srcObject = null;
            isCameraOn = false;
            startCameraBtn.disabled = false;
            stopCameraBtn.disabled = true;
            signDetectionStatus.innerHTML = '<i class="fas fa-hand-paper"></i> Cámara desactivada';
        }
    });

    // Enviar mensaje
    sendMessageBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && roomId) {
            socket.emit('send_message', roomId, message);
            messageInput.value = '';
        }
    });

    // Limpiar
    clearBtn.addEventListener('click', () => {
        messageInput.value = '';
    });

    // Simulación de detección de señas
    function startSignDetection() {
        signDetectionInterval = setInterval(() => {
            if (isCameraOn && roomId) {
                // Aquí iría tu modelo de detección real
                const fakeSign = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letra aleatoria A-Z
                const confidence = (Math.random() * 100).toFixed(2);
                
                // Dibujar en canvas (simulación)
                ctx.clearRect(0, 0, signCanvas.width, signCanvas.height);
                ctx.fillStyle = '#00FF00';
                ctx.font = '30px Arial';
                ctx.fillText(fakeSign, 50, 50);
                
                // Enviar señal
                socket.emit('send_signal', roomId, {
                    type: 'letter',
                    value: fakeSign,
                    confidence: confidence,
                    timestamp: Date.now()
                });
            }
        }, 2000);
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
        if (signDetectionInterval) clearInterval(signDetectionInterval);
    });
});