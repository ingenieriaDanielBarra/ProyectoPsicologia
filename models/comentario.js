const mongoose = require('mongoose');


const respuestaEsquema = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true}, 
    texto:{type: String, required: true},
    fechaCreacion:{type: Date, default: Date.now}
});

const comentarioEsquema = new mongoose.Schema({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    texto: {type: String, required: true},
    fechaCreacion: {type: Date, default: Date.now},
    respuestas: [respuestaEsquema]
});


module.exports = mongoose.model('Comentario', comentarioEsquema);