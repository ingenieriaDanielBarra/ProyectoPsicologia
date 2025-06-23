const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

exports.registroNuevoUsuario = async ({nombre, apellido, correo, contraseña}) => {
    //verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({correo});
    if (existeUsuario) {
        throw new Error('El usuario ya existe con ese correo');
    }
    //encriptar la contraseña
    const hashContraseña = await bcrypt.hash(contraseña, 10);
    //crear y guardar un nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, apellido, correo, contraseña: hashContraseña});
    return await nuevoUsuario.save();
};

exports.obtenerTodosUsuarios = async () => {

    return await Usuario.find(); //obtiene todos los usuarios de la base de datos.
};

