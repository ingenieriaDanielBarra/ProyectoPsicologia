const express = require('express');
const {loginUsuario, recuperarClave, restablecerClave,servirPaginaRestablecimiento} = require('../controllers/authController');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', loginUsuario);
router.post('/recuperar-clave', recuperarClave);
router.post('/restablecer-clave', restablecerClave);
router.get('/restablecer-clave', servirPaginaRestablecimiento);

// Exportar el router
module.exports = router;