const jwt = require('jsonwebtoken');

//middleware para verificar el token
exports.verificarTokenYRol = (rolesPermitidos) => (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({message: 'Acceso denegado'});
    }
    jwt.verify(token,process.env.JWT_SECRET || 'secret', (err, usuario) => {
        if (err) {
            res.status(403).json({message: 'Token invalido'});
        }
        req.usuario = usuario;

        //verificar si el usuario tiene un rol permitido
        if (!rolesPermitidos.includes(usuario.role)) {
            return res.status(403).json({message: 'Acceso denegado, rol no autorizado'});
        }
         next();
    });

};