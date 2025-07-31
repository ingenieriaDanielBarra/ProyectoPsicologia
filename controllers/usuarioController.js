const {registroNuevoUsuario, obtenerTodosUsuarios} = require('../services/usuarioService');

exports.registrarUsuario = async (req, res) => {

    const {nombre, apellido, correo, contraseña, confirmarContraseña} = req.body;

    try {
        //validar que las contraseñas coincidan
        if (contraseña !== confirmarContraseña) {
            return res.status(400).json({error: 'Las contraseñas no coinciden'});
        }
        //registrar el nuevo usuario
        const nuevoUsuario = await registroNuevoUsuario({nombre, apellido, correo, contraseña});
        res.status(201).json({message: 'Usuario registrado exitosamente', usuario: nuevoUsuario});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.obtenerUsuarios = async (req, res) => {

    try {
        const usuarios = await obtenerTodosUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({message:  'Error en el servidor', error: error.message});
    }
}