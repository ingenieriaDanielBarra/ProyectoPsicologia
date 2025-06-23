exports.adminAccess = (req, res) => {
    res.send(`Bienvenido administrador, ${req.usuario.email}`);
};
exports.userAccess = (req, res) => {
    res.send(`Bienvenido usuario, ${req.usuario.email}`);
};
