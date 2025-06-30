document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cameraFeed = document.getElementById('cameraFeed');
    const signCanvas = document.getElementById('signCanvas');
    const ctx = signCanvas.getContext('2d');
    const startCameraBtn = document.getElementById('startCamera');
    const stopCameraBtn = document.getElementById('stopCamera');
    const startMicBtn = document.getElementById('startMic');
    const textInput = document.getElementById('textInput');
    const translateToSignBtn = document.getElementById('translateToSign');
    const clearInputBtn = document.getElementById('clearInput');
    const signOutput = document.getElementById('signOutput');
    const translatedText = document.getElementById('translatedText');
    const playVoiceBtn = document.getElementById('playVoice');
    const copyTextBtn = document.getElementById('copyText');
    const historyList = document.getElementById('historyList');
    const helpButton = document.getElementById('helpButton');
    const helpPanel = document.getElementById('helpPanel');
    
    let stream = null;
    let recognition = null;
    let isCameraOn = false;
    
    // Configuración inicial
    translatedText.textContent = "Las señas se traducirán a texto aquí";
    
    // Event Listeners
    startCameraBtn.addEventListener('click', startCamera);
    stopCameraBtn.addEventListener('click', stopCamera);
    startMicBtn.addEventListener('click', toggleMic);
    translateToSignBtn.addEventListener('click', translateToSign);
    clearInputBtn.addEventListener('click', clearInput);
    playVoiceBtn.addEventListener('click', playVoice);
    copyTextBtn.addEventListener('click', copyText);
    helpButton.addEventListener('click', toggleHelp);
    
    // Funciones
    
    // 1. Control de cámara
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 }, 
                audio: false 
            });
            cameraFeed.srcObject = stream;
            isCameraOn = true;
            startCameraBtn.disabled = true;
            stopCameraBtn.disabled = false;
            animateSignDetection();
            
            // Simular detección de señas (en un sistema real, aquí iría el modelo de ML)
            simulateSignDetection();
            
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            alert("No se pudo acceder a la cámara. Asegúrate de permitir los permisos.");
        }
    }
    
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraFeed.srcObject = null;
            isCameraOn = false;
            startCameraBtn.disabled = false;
            stopCameraBtn.disabled = true;
            ctx.clearRect(0, 0, signCanvas.width, signCanvas.height);
        }
    }
    
    function animateSignDetection() {
        if (!isCameraOn) return;
        
        // Dibujar en el canvas (simulación de detección)
        ctx.clearRect(0, 0, signCanvas.width, signCanvas.height);
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        
        // Dibujar puntos de referencia simulados (en un sistema real, estos vendrían de la detección)
        const points = [
            {x: 150, y: 100}, {x: 200, y: 120}, {x: 250, y: 150},
            {x: 300, y: 180}, {x: 350, y: 200}, {x: 400, y: 220}
        ];
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        
        requestAnimationFrame(animateSignDetection);
    }
    
    function simulateSignDetection() {
        if (!isCameraOn) return;
        
        // Simular detección de señas cada 3 segundos
        setTimeout(() => {
            const signs = ["Hola", "Gracias", "Ayuda", "Comida", "Agua"];
            const randomSign = signs[Math.floor(Math.random() * signs.length)];
            updateTranslation(randomSign, "Seña detectada: " + randomSign);
            
            if (isCameraOn) {
                simulateSignDetection();
            }
        }, 3000);
    }
    
    // 2. Control de micrófono
    function toggleMic() {
        if (!('webkitSpeechRecognition' in window)) {
            alert("El reconocimiento de voz no es compatible con tu navegador");
            return;
        }
        
        if (recognition) {
            recognition.stop();
            recognition = null;
            startMicBtn.innerHTML = '<i class="fas fa-microphone"></i> Usar Micrófono';
            return;
        }
        
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';
        
        recognition.onstart = function() {
            startMicBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Detener';
            textInput.placeholder = "Escuchando...";
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            textInput.value = transcript;
            textInput.placeholder = "Escribe aquí o habla para traducir a señas...";
        };
        
        recognition.onerror = function(event) {
            console.error("Error en reconocimiento:", event.error);
            textInput.placeholder = "Escribe aquí o habla para traducir a señas...";
            startMicBtn.innerHTML = '<i class="fas fa-microphone"></i> Usar Micrófono';
        };
        
        recognition.onend = function() {
            if (recognition) {
                startMicBtn.innerHTML = '<i class="fas fa-microphone"></i> Usar Micrófono';
                textInput.placeholder = "Escribe aquí o habla para traducir a señas...";
            }
        };
        
        recognition.start();
    }
    
    // 3. Funciones de traducción
    function translateToSign() {
        const text = textInput.value.trim();
        if (!text) {
            alert("Por favor, escribe o habla algo para traducir");
            return;
        }
        
        // Simular traducción a lenguaje de señas
        const signTranslation = "🔤 " + text.toUpperCase();
        const textTranslation = "Texto traducido: " + text;
        
        updateTranslation(signTranslation, textTranslation);
    }
    
    function updateTranslation(sign, text) {
        // Mostrar en el área de salida
        signOutput.innerHTML = `<div class="sign-animation"><p>${sign}</p></div>`;
        translatedText.textContent = text;
        
        // Agregar al historial
        addToHistory(sign, text);
    }
    
    function addToHistory(sign, text) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const historyItem = document.createElement('li');
        historyItem.innerHTML = `
            <span>${text}</span>
            <small>${timeString}</small>
        `;
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Limitar el historial a 10 elementos
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }
    
    // 4. Funciones auxiliares
    function clearInput() {
        textInput.value = "";
    }
    
    function playVoice() {
        if (!translatedText.textContent || translatedText.textContent.includes("Las señas se traducirán")) {
            alert("No hay texto para leer");
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(translatedText.textContent);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
    }
    
    function copyText() {
        if (!translatedText.textContent || translatedText.textContent.includes("Las señas se traducirán")) {
            alert("No hay texto para copiar");
            return;
        }
        
        navigator.clipboard.writeText(translatedText.textContent)
            .then(() => {
                // Mostrar feedback visual
                const originalText = copyTextBtn.innerHTML;
                copyTextBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                setTimeout(() => {
                    copyTextBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error("Error al copiar:", err);
                alert("No se pudo copiar el texto");
            });
    }
    
    function toggleHelp() {
        helpPanel.classList.toggle('active');
    }
    
    // Cerrar panel de ayuda al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!helpPanel.contains(event.target) && event.target !== helpButton) {
            helpPanel.classList.remove('active');
        }
    });
});
// Configuración del sistema de visualización
let sequenceInterval;
let currentIndex = 0;
let currentWord = '';
let signImages = [];

// Elementos del DOM
const wordInput = document.getElementById('wordInput');
const displaySignsBtn = document.getElementById('displaySigns');
const pauseSequenceBtn = document.getElementById('pauseSequence');
const stopSequenceBtn = document.getElementById('stopSequence');
const currentSignContainer = document.getElementById('currentSign');
const currentLetterDisplay = document.getElementById('currentLetter');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

// Event Listeners
displaySignsBtn.addEventListener('click', startSignSequence);
pauseSequenceBtn.addEventListener('click', togglePauseSequence);
stopSequenceBtn.addEventListener('click', stopSignSequence);

// Función principal para iniciar la secuencia
async function startSignSequence() {
    const word = wordInput.value.trim().toUpperCase();
    
    if (!word) {
        alert("Por favor escribe una palabra");
        return;
    }
    
    // Limpiar estado anterior
    stopSignSequence();
    
    currentWord = word;
    currentIndex = 0;
    
    try {
        // Obtener imágenes del backend
        displaySignsBtn.disabled = true;
        wordInput.disabled = true;
        currentSignContainer.innerHTML = '<p class="instruction">Cargando señas...</p>';
        
        // Simular llamada al backend (reemplazar con tu API real)
        signImages = await fetchSignImagesFromBackend(word);
        
        // Configurar controles
        displaySignsBtn.disabled = false;
        pauseSequenceBtn.disabled = false;
        stopSequenceBtn.disabled = false;
        
        // Iniciar secuencia
        showNextSign();
        
        // Configurar intervalo para cambio automático
        sequenceInterval = setInterval(showNextSign, 2000);
        
    } catch (error) {
        console.error("Error al obtener señas:", error);
        currentSignContainer.innerHTML = '<p class="instruction error">Error al cargar las señas</p>';
        displaySignsBtn.disabled = false;
        wordInput.disabled = false;
    }
}

// Función para obtener imágenes del backend (simulada)
async function fetchSignImagesFromBackend(word) {
    // SIMULACIÓN - Reemplazar con llamada real a tu backend
    console.log(`Consultando backend para la palabra: ${word}`);
    
    // Simular retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Crear array de objetos con información de cada letra
    return word.split('').map(letter => {
        return {
            letter: letter,
            // En un sistema real, esta sería la URL de la imagen en tu backend
            imageUrl: `https://ejemplo.tubackend.com/signs/${letter}.png`,
            // Para la demo usaremos una imagen de marcador de posición
            demoImage: getDemoSignImage(letter)
        };
    });
}

// Función auxiliar para imágenes de demostración
function getDemoSignImage(letter) {
    const signIllustrations = {
        'A': '🖐️', 'B': '✋', 'C': '🤟', 'D': '🤘', 'E': '👌',
        'F': '🤙', 'G': '👈', 'H': '👉', 'I': '👆', 'J': '👇',
        'K': '✊', 'L': '👊', 'M': '🤛', 'N': '🤜', 'Ñ': '🤚',
        'O': '🖖', 'P': '✌️', 'Q': '🤞', 'R': '🤟', 'S': '🤘',
        'T': '👋', 'U': '🖐️', 'V': '✋', 'W': '🤟', 'X': '🤘',
        'Y': '👌', 'Z': '🤙'
    };
    
    return `
        <div class="demo-sign">
            <div class="sign-illustration">${signIllustrations[letter] || '✋'}</div>
            <div class="letter-label">${letter}</div>
        </div>
    `;
}

// Mostrar la siguiente seña en la secuencia
function showNextSign() {
    if (currentIndex >= signImages.length) {
        // Fin de la secuencia
        stopSignSequence();
        currentSignContainer.innerHTML = '<p class="instruction">Secuencia completada</p>';
        return;
    }
    
    const currentSign = signImages[currentIndex];
    
    // Mostrar la seña actual
    // EN PRODUCCIÓN: Usar imageUrl para mostrar la imagen real desde tu backend
    currentSignContainer.innerHTML = `
        <div class="sign-animation">
            ${currentSign.demoImage}
        </div>
    `;
    
    // Actualizar información de progreso
    currentLetterDisplay.textContent = currentSign.letter;
    progressText.textContent = `${currentIndex + 1}/${signImages.length}`;
    progressFill.style.width = `${((currentIndex + 1) / signImages.length) * 100}%`;
    
    currentIndex++;
}

// Controlar pausa/reanudación
function togglePauseSequence() {
    if (sequenceInterval) {
        clearInterval(sequenceInterval);
        sequenceInterval = null;
        pauseSequenceBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
    } else {
        sequenceInterval = setInterval(showNextSign, 2000);
        pauseSequenceBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    }
}

// Detener la secuencia
function stopSignSequence() {
    if (sequenceInterval) {
        clearInterval(sequenceInterval);
        sequenceInterval = null;
    }
    
    currentIndex = 0;
    pauseSequenceBtn.disabled = true;
    stopSequenceBtn.disabled = true;
    displaySignsBtn.disabled = false;
    wordInput.disabled = false;
    pauseSequenceBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    
    // Resetear progreso
    progressFill.style.width = '0%';
    progressText.textContent = '0/0';
    currentLetterDisplay.textContent = '';
}