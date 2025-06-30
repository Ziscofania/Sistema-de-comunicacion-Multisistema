const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Ruta para servir las imágenes directamente desde /backend/imagenes
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Ruta para retornar el link de una letra específica
app.get('/api/abecedario/:letra', (req, res) => {
  const letra = req.params.letra.toLowerCase();
  const fileName = `letra ${letra}.png`; // ejemplo: letra a.png

  const imageUrl = `/imagenes/abecedario/${fileName}`;

  res.json({
    letra: letra,
    imagen_url: imageUrl
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
