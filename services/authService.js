const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Usuario = require('../models/usuario');

exports.autenticarUsuario = async (correo, contraseña) => {
    //buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    //verificar la contraseña
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
        throw new Error('Contraseña incorrecta');
    }
    //generar el token JWT
    const token = jwt.sign({email: usuario.correo, role: usuario.role, nombre: usuario.nombre, apellido: usuario.apellido},
                   process.env.JWT_SECRET || 'secret', { expiresIn: '3m' }
    
    );
    return token;
};


exports.generarTokenRecuperacion = async (correo) => {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    //generar token de recuperación 
    const token = jwt.sign({correo: usuario.correo},
        process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    return token;
};

exports.enviarCorreoRecuperacion = async (correo, token) => {

    const usuario = await Usuario.findOne({ correo });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
        //configurar contenido de correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to : correo,
            subject: 'Recuperacion de contraseña',
            html: `
                <p>Hola ${usuario.nombre},</p>
                <p>Haz solicitado recuperar tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <a href="${process.env.TUNNEL_URL}/restablecer-clave?token=${token}">Restablecer Contraseña</a>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
              `
        };

        await transporter.sendMail(mailOptions);
};

exports.actualizarContraseña = async (nuevaContraseña, token) => {

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const correo = decoded.correo;
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        // Hashear la nueva contraseña
        const contraseñaEncriptada = await bcrypt.hash(nuevaContraseña, 10);
        // Actualizar la contraseña del usuario
        usuario.contraseña = contraseñaEncriptada;
        // Guardar los cambios en la base de datos
        await usuario.save();

        return 'Contraseña actualizada exitosamente';
    } catch (error) {
        throw new Error('Error al actualizar la contraseña');
    }

};

exports.verificarToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};