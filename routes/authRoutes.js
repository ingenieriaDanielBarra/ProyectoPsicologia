const express = require('express');
const {loginUsuario, recuperarClave, restablecerClave,servirPaginaRestablecimiento,
       enviarVerificacionCorreo,verificarCorreo} = require('../controllers/authController');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', loginUsuario);
router.post('/recuperar-clave', recuperarClave);
router.post('/restablecer-clave', restablecerClave);
router.get('/restablecer-clave', servirPaginaRestablecimiento);
// Ruta para enviar correo de verificación
router.post('/enviar-verificacion-correo', enviarVerificacionCorreo);
// Ruta para verificar el correo
router.get('/verificar-correo', verificarCorreo);
// Exportar el router
module.exports = router;