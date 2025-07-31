const express = require('express');
const {adminAccess,userAccess} = require('../controllers/roleController');
const {verificarTokenYRol,verificarCorreoVerificado} = require('../middlewares/authMiddleware');
const router = express.Router();

//ruta protegida para el administrador
router.get('/admin', verificarTokenYRol(['admin']),verificarCorreoVerificado,adminAccess);
//ruta protegida para el usuario
router.get('/user', verificarTokenYRol(['user']),verificarCorreoVerificado,userAccess);

module.exports = router;