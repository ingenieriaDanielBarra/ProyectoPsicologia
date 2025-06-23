const express = require('express');
const {registrarUsuario, obtenerUsuarios} = require('../controllers/usuarioController');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/usuarios', registrarUsuario);
router.get('/usuarios', obtenerUsuarios);

module.exports = router;