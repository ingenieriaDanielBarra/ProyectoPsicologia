const express = require('express');
const {crearComentario, crearRespuesta, obtenerComentarios, obtenerComentarioMasRespuestas, eliminarComentario,eliminarRespuesta} =  require('../controllers/comentarioController');
const {verificarTokenYRol} = require('../middlewares/authMiddleware');
const router = express.Router();


// Rutas para manejar comentarios
router.post('/comentarios', crearComentario);
router.post('/comentarios/:id/respuestas', crearRespuesta);
router.get('/comentarios', obtenerComentarios);
router.get('/comentarios/:id', obtenerComentarioMasRespuestas);
router.delete('/comentarios/:id',verificarTokenYRol(['admin']),eliminarComentario);
router.delete('/comentarios/:comentarioId/respuestas/:respuestaId', verificarTokenYRol(['admin']), eliminarRespuesta);
// Exportar el router
module.exports = router; 