const path = require('path');
const {autenticarUsuario,generarTokenRecuperacion,enviarCorreoRecuperacion,
       actualizarContraseña,verificarToken} = require('../services/authService');

exports.loginUsuario = async (req, res) => {

    const { correo, contraseña } = req.body;
    try {
        //validar que los campos sean obligatorios
        if (!correo || !contraseña) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        //autenticar al usuario
        const token = await autenticarUsuario(correo, contraseña);
        res.status(200).json({ message: 'Inicio de sesión exitoso',token});
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
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