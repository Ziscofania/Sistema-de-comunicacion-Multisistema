let ultimaPalabra = '';
let animacionActiva = false;
let intervaloAnimacion;
let letras = [];
let indiceActual = 0;

async function iniciarAnimacion() {
  if (animacionActiva) return;
  
  const texto = document.getElementById('entradaTexto').value.trim().toLowerCase();
  if (!texto) return;
  
  ultimaPalabra = texto;
  animacionActiva = true;
  letras = texto.split('').filter(letra => letra !== ' ');
  indiceActual = 0;
  
  // Mostrar palabra completa
  const wordDisplay = document.getElementById('wordDisplay');
  wordDisplay.innerHTML = '';
  texto.split('').forEach((letra, index) => {
    const letterBox = document.createElement('div');
    letterBox.className = 'letter-box';
    letterBox.textContent = letra;
    if (letra === ' ') letterBox.innerHTML = '&nbsp;';
    wordDisplay.appendChild(letterBox);
  });
  
  mostrarSiguienteLetra();
}

async function mostrarSiguienteLetra() {
  if (indiceActual >= letras.length) {
    animacionActiva = false;
    document.getElementById('progressBar').style.width = '100%';
    document.querySelector('.letter-progress').setAttribute('data-current-letter', '¡Completado!');
    return;
  }
  
  const letra = letras[indiceActual];
  const progress = (indiceActual / letras.length) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.querySelector('.letter-progress').setAttribute('data-current-letter', `Letra actual: ${letra.toUpperCase()}`);
  
  // Actualizar visualización de letra grande
  const currentLetterDisplay = document.getElementById('currentLetterDisplay');
  currentLetterDisplay.textContent = letra.toUpperCase();
  
  // Resaltar letra en la palabra
  const letterBoxes = document.querySelectorAll('.letter-box');
  letterBoxes.forEach((box, index) => {
    box.classList.remove('active');
    if (box.textContent.toLowerCase() === letra && 
        Array.from(document.getElementById('wordDisplay').children)
             .filter(b => b.textContent.toLowerCase() === letra)
             .indexOf(box) === indiceActual) {
      box.classList.add('active');
    }
  });
  
  // Mostrar imagen de la letra en señas
  try {
    const contenedor = document.getElementById('contenedorImagenes');
    contenedor.innerHTML = '';
    
    const img = document.createElement('img');
    img.className = 'sign-image';
    contenedor.appendChild(img);
    
    // Conexión con tu backend real
    const res = await fetch(`http://localhost:3000/api/abecedario/${letra}`);
    const data = await res.json();
    img.src = `http://localhost:3000${data.imagen_url}`;
    img.alt = `Seña para la letra ${letra}`;
    
    setTimeout(() => {
      img.classList.add('active');
    }, 100);
    
    // Esperar 3 segundos antes de pasar a la siguiente letra
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    indiceActual++;
    mostrarSiguienteLetra();
  } catch (err) {
    console.error(`Error mostrando la letra ${letra}:`, err);
    indiceActual++;
    mostrarSiguienteLetra();
  }
}

function repetir() {
  if (ultimaPalabra) {
    detener();
    document.getElementById('entradaTexto').value = ultimaPalabra;
    iniciarAnimacion();
  }
}

function detener() {
  animacionActiva = false;
  clearInterval(intervaloAnimacion);
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('currentLetterDisplay').textContent = '';
  document.querySelector('.letter-progress').setAttribute('data-current-letter', '');
  
  const letterBoxes = document.querySelectorAll('.letter-box');
  letterBoxes.forEach(box => box.classList.remove('active'));
  
  const images = document.querySelectorAll('.sign-image');
  images.forEach(img => img.classList.remove('active'));
}

// Permitir iniciar con Enter
document.getElementById('entradaTexto').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    iniciarAnimacion();
  }
});