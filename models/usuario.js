const mongoose = require('mongoose');

const usuarioEsquema = new mongoose.Schema({
    nombre     : {type: String, required: true},
    apellido   : {type: String, required: true},
    correo     : {type: String, required: true, unique: true},
    contraseña : {type: String, required: true},
    role       : {type: String, enum:['admin','user'], default: 'user'}, // Rol de usuario.
    verificado : {type: Boolean, default: false}, // Si el usuario ha verificado su correo.
});


module.exports = mongoose.model('Usuario',usuarioEsquema);
