const mongoose = require('mongoose');

const ReservaEsquema = new mongoose.Schema({

    nombre:  {type: String, required: true},
    apellido:{type: String, required: true},
    edad:    {type: Number, required: true},
    telefono:{type: Number, required: true},
    email:   {type: String, required: true},
    servicio:{type: String, required: true},
    motivoConsulta: {type: String, required: true},
    fechaCreacion: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Reserva',ReservaEsquema);


