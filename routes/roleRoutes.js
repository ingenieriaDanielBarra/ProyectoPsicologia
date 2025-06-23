const express = require('express');
const {adminAccess,userAccess} = require('../controllers/roleController');
const {verificarTokenYRol} = require('../middlewares/authMiddleware');
const router = express.Router();

//ruta protegida para el administrador
router.get('/admin', verificarTokenYRol(['admin']), adminAccess);
//ruta protegida para el usuario
router.get('/user', verificarTokenYRol(['user']), userAccess);

module.exports = router;