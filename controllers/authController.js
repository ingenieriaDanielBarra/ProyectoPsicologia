const path = require('path');
const {autenticarUsuario,generarTokenRecuperacion,enviarCorreoRecuperacion,
       actualizarContraseña,verificarToken,generarTokenVerificacion,enviarCorreoVerificacion,verificarCorreo} = require('../services/authService');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

exports.loginUsuario = async (req, res) => {

    const { correo, contraseña } = req.body;
    try {
        //autenticar al usuario
        const token = await autenticarUsuario(correo, contraseña);
        res.status(200).json({ message: 'Inicio de sesión exitoso',token});
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        //res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
        //mapear errores a codigos HTTP adecuados
        let status = 500;
        if (error.message.includes('todos los campos son obligatorios')) status = 400;
        else if (error.message.includes('usuario no encontrado')) status = 404;
        else if (error.message.includes('contraseña incorrecta')) status = 401;
        else if (error.message.includes('verifica tu correo electronico')) status = 403;

        return res.status(status).json({message: error.message});
    }
};

exports.recuperarClave = async (req, res) => {

    const {correo} = req.body;
    try {
        //validar que el campo correo sea obligatorio
        if (!correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }
        //generar token de recuperación
        const token = await generarTokenRecuperacion(correo);
        //enviar correo de recuperación
        await enviarCorreoRecuperacion(correo, token);
        res.status(200).json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        console.error('Error al recuperar clave:', error);
        res.status(500).json({ message: 'Error al recuperar clave', error: error.message });
    }

};

exports.restablecerClave = async (req, res) => {

    const {nuevaContraseña, token} = req.body;
    try {
        //validar que los campos sean obligatorios
        if (!nuevaContraseña || !token) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        //actualizar contraseña
        const mensaje = await actualizarContraseña(nuevaContraseña, token);
        res.status(200).json({ message: mensaje });
    } catch (error) {
        console.error('Error al restablecer clave:', error);
        res.status(500).json({ message: 'Error al restablecer clave', error: error.message });
    }
};

exports.servirPaginaRestablecimiento = async (req, res, next) => {
    try {
        
        const ext = path.extname(req.url);
        if (['.js', '.css', '.png', '.jpg', '.jpeg', '.ico', '.svg'].includes(ext)) {
            return next(); // Ignorar archivos estáticos
        }
        const token = req.query.token;
        console.log('Token recibido:', token);

        if (!token) {
            console.log('Token no proporcionado en la URL');
            return res.status(400).send('El enlace de restablecimiento no es válido o ha expirado.');
        }
        // Verificar el token
        const decoded = await verificarToken(token);
        console.log('Token decodificado:', decoded);
        
        // Si el token es válido, sirve la página HTML
        res.sendFile(path.join(__dirname, '../public', 'restablecerContraseña.html'));

    } catch (error) {
        console.error('Token inválido o expirado:', error);
        res.status(400).send('El enlace de restablecimiento no es válido o ha expirado.');
    }

};

exports.enviarVerificacionCorreo = async (req, res) => {

    const {correo} = req.body;

    try {
        if (!correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }
        const token = await generarTokenVerificacion(correo);
        await enviarCorreoVerificacion(correo, token);
        res.status(200).json({ message: 'Correo de verificación enviado' });

    } catch (error) {
        console.error('Error al enviar verificación de correo:', error);
        res.status(500).json({ message: 'Error al enviar verificación de correo', error: error.message });
    }
};

// exports.verificarCorreo = async (req, res) => {

//     const {token} = req.query;
//     try {
//         const resultado = await verificarCorreo(token);
//         res.status(200).json({ message: resultado });
//     } catch (error) {
//         res.status(400).json({ message: 'Error al verificar correo', error: error.message });
//     }

// };

exports.verificarCorreo = async (req, res) => {
    const { token } = req.query;
    //console.log('Token recibido para verificación:', token);
    try {
        if (!token) throw new Error('Token no proporcionado');

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Busca y actualiza el usuario
        const usuario = await Usuario.findOneAndUpdate(
            { correo: decoded.correo },
            { verificado: true },
            { new: true }
        );

        if (!usuario) throw new Error('Usuario no encontrado');

        // Redirección al login con mensaje
        const mensaje = encodeURIComponent('¡Correo verificado exitosamente!. Ahora puedes iniciar sesión.');
        res.redirect(`/indexPsicologia.html?mensaje=${mensaje}`);
        
    } catch (error) {
        console.error('Error al verificar correo:', error.message);

        const mensaje = encodeURIComponent(error.message || 'Token inválido o expirado');
        res.redirect(`/indexPsicologia.html?mensaje=${mensaje}&tipo=error`);
    }
};