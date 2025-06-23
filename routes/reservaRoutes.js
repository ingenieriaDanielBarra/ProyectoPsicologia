const express = require('express');
const {crearReserva,obtenerReservas} = require('../controllers/reservaController');
const router = express.Router();

router.post('/reservas', crearReserva);
router.get('/reservas', obtenerReservas);

module.exports = router;