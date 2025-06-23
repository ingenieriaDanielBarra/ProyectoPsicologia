const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors     = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para manejar variables de entorno
const path = require('path');
const nodemailer = require('nodemailer');



//modelos
const Reserva = require('./models/reserva');
const Comentario = require('./models/comentario');
const { db } = require('./models/comentario');
const Usuario = require('./models/usuario');

const app = express();
app.use(express.json());

// Configurar la carpeta de archivos estáticos

app.use(bodyParser.json());

const allowedOrigins = [
      'http://localhost:3000',
      'https://wfbtg48m-5500.brs.devtunnels.ms'
];

app.use(cors(
    {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}
));

//app.use(express.static(path.join(__dirname, 'public')));
// Configurar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
        };
        if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
        }
    }
}));

//conexion a mongoDB

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() =>{
    console.log('Conectado a mongoDB atlas')
}).catch(err => {    
    console.log('Error al conectar', err)
});



app.post('/reservas', async(req,res) => {
    
    console.log("solicitud recibida:",req.body);

    const {nombre,apellido,edad,telefono,email,servicio,motivoConsulta} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ingenieria.danielbarra@gmail.com',
        subject: 'Nueva reserva de cita',
        text: `
         Se ha recibido una nueva reserva:
            
            Nombre:   ${nombre},
            Apellido: ${apellido}.
            Edad:     ${edad}.
            Telefono: ${telefono},
            Email:    ${email},
            Servicio: ${servicio},
            Motivo  : ${motivoConsulta}
        `
    };
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        console.log('Reserva guardada en la base de datos');
        // Enviar correo electrónico
        await transporter.sendMail(mailOptions);
        res.status(200).json({mensaje: 'Reserva enviada correctamente'});
    } catch (error) {
        console.error('Error al enviar el correo', error);
        res.status(500).json({mensaje: 'Error al enviar el correo'});
    }

});


//Ruta para obtener todas las reservas
app.get('/reservas', async(req,res) => {
    const reservas = await Reserva.find();
    res.json(reservas);
});


app.post('/comentarios', async(req,res) => {

    try {
        console.log('Datos recibidos:', req.body);
        const {nombre,apellido,texto,fechaCreacion} = req.body;
        //validar que el campo de texto exista y no este vacio

        if (!nombre || !apellido || !texto || texto.trim() === '') {
            return res.status(400).json({message: 'Faltan datos.'});
        }
        
        const nuevoComentario = new Comentario(req.body);
        await nuevoComentario.save();

        res.status(201).json({
            message: 'Comentario creado correctamente',
            comentario: nuevoComentario,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error al crear comentario',
            error: err.message
        });
    }
});

//ruta para guardar un comentario
app.post('/comentarios/:id/respuestas', async(req,res) => {
    try {

        console.log("Datos recibidos: ", req.body);
        const {nombre, apellido,texto} = req.body;
        if (!nombre || !apellido || !texto || texto.trim() === '') {
            return res.status(400).json({message: 'Faltan datos.'});
        }
        

        const nuevoComentario = await Comentario.findById(req.params.id);

        if (!nuevoComentario) {
            return res.status(404).send('Comentario no encontrado');
        }
        nuevoComentario.respuestas.push(req.body);
        await nuevoComentario.save();
        res.status(201).send('Respuesta guardado exitosamente');    
    } catch (err) {
        res.status(400).send(err.message);
    }

});
app.get('/comentarios', async(req,res) =>  {

    try {
        const comentarios = await db.collection('comentarios').find().toArray();
        res.json(comentarios);        
    } catch (error) {
        console.error('Error al obtener comentarios', error);
        res.status(500).json({message: 'Error en el servidor'});
    }
    
});

//ruta para obtener todos los comentarios
app.get('/comentarios/:id', async(req,res) => {
    
    try {
        const comentarios = await Comentario.findById(req.params.id);
        if (!comentarios) {
            return res.status(404).send('Comentario no encontrado');
        }
        res.json(comentarios);
    } catch (err) {
        res.status(404).send(err.message);
    }  
});



//registro de usuario

app.post('/usuarios', async(req,res) => {
    console.log('Solicitud recibida:', req.body);

    const {nombre,apellido,correo, contraseña,confirmarContraseña} = req.body;
    
    if(contraseña !== confirmarContraseña){
        console.log('Error: las contraseñas no coinciden');
        return res.status(400).json({error: 'las contraseñas no coinciden'});
    }

    try {
        //verificar si usuario existe
        const existeUsuario = await Usuario.findOne({correo});
        if (existeUsuario) {
            
            return res.status(400).json({message : 'Usuario ya registrado'});
        }
        //cifrar la contraseña
        const hashcontraseña = await bcrypt.hash(contraseña, 10);
        //guardar el nuevo usuario en la base de datos

        const nuevoUsuario = new Usuario({nombre,apellido,correo, contraseña: hashcontraseña});
    
        await nuevoUsuario.save();
    
        res.status(201).json({message: 'Usuario registrado con exito', usuario: nuevoUsuario});

    } catch (err) {
        console.log('Error en el servidor:', err);
        res.status(500).json({message : 'Error en el servidor', error: err.message});
    }
});

//ruta para obtener todos los usuarios registrados

app.get('/usuarios', async(req,res) => {

    try {
        //obtener todos los usuarios de la base de datos
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios); //responde con los usuarios en formato JSON

    } catch (error) {
        console.log('Error al obtener usuarios: ',error);
        res.status(500).json({message: 'Error en el servidor', error: error.message});
    }

});


//Login de usuario
app.post('/login', async(req,res) => {
    console.log('Solicitud recibida:', req.body);
    const {correo,contraseña} = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({message: 'Email y contraseña son obligatorios'});
    }

    try {
        //buscar al usuario en la base de datos
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({message: 'Usuario no encontrado'});
        }
        //verificar la contrasñea
        const esValida = await bcrypt.compare(contraseña,usuario.contraseña);
        if (!esValida) {
            return res.status(400).json({message: 'contraseña incorrecta'});
        }
        //generar token JWT
        const token = jwt.sign(
            {email: usuario.correo, role: usuario.role , nombre: usuario.nombre, apellido: usuario.apellido}, //informacion dentro del token
            process.env.JWT_SECRET || 'secret',         //clave secreta para firmar el token
            {expiresIn: '1m'});                         //tiempo de expiracion del token
        
            res.json({ message: 'Inicio de sesión exitoso', token});
           
            
    } catch (err) {
        res.status(500).json({message: 'Error en el servidor', error: err.message});
    }

});
//middleware para verificar el token
const autenticacionTokenYRol = (rolesPermitidos) => (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({message: 'Acceso denegado'});
    }
    jwt.verify(token,process.env.JWT_SECRET || 'secret', (err, usuario) => {
        if (err) {
            res.status(403).json({message: 'Token invalido'});
        }
        req.usuario=usuario;

        //verificar si el usuario tiene un rol permitido
        if (!rolesPermitidos.includes(usuario.role)) {
            return res.status(403).json({message: 'Acceso denegado, rol no autorizado'});
        }
         next();
    });

};


//ruta para recuperar la contraseña de acceso a login

app.post('/recuperar-clave', async(req,res) => {
    
    const {correo} = req.body;
    if (!correo) {
        return res.status(400).json({message: 'El correo es obligatorio'});
    }
    try {
        //verificar si el usuario existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(404).json({message: '¡Usuario no encontrado!'});
        }
        //generar un token de recuperacion (puedes usar JWT o un token aleatorio)
        const token = jwt.sign({ correo: usuario.correo }, process.env.JWT_SECRET || 'secret',{expiresIn: '1h'});
        console.log('token generado:', token);
        //configurar el transporte de correo
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
        console.log('enlace enviado:',`${process.env.TUNNEL_URL}/restablecer-clave?token=${token}`);
        // enviar correo
        await transporter.sendMail(mailOptions);
        res.json({message: 'Correo de recuperacion enviado'});

    } catch (error) {
        console.error('Error al enviar el correo de recuperacion', error);
        res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }

});


//ruta para restablecer la contraseña

app.post('/restablecer-clave', async(req,res) => {
    
    const {nuevaContraseña,token} = req.body;
    console.log('nueva contraseña:', nuevaContraseña);
    console.log('token:', token);
    if (!nuevaContraseña || !token) {
        return res.status(400).json({message: 'token y nueva contraseña son obligatorias'});
    }
    try {
        //verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const correo = decoded.correo;
        //buscar al usuario y actulizar la contraseña
        const usuario= await Usuario.findOne({correo}); 
        if (!usuario) {
            return res.status(400).json({message: 'Usuario no encontrado'});
        }
        //Encriptar la nueva contraseña
        const contraseñaEncriptada = await bcrypt.hash(nuevaContraseña, 10);
        usuario.contraseña = contraseñaEncriptada;
        await usuario.save();
        res.json({message: 'Contraseña actualizada correctamente'});
    } catch (error) {
        console.log('Error al restablecer la contraseña', error);
        res.status(500).json({message: 'Error interno del servidor', error: error.message});
    }

});


// Ruta para servir la página de restablecimiento de contraseña
app.get('/restablecer-clave', (req, res, next) => {
 
    console.log("URL completa:", req.url);
    console.log("Query completa:", req.query);
    
    const ext = path.extname(req.url);
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.ico', '.svg'].includes(ext)) {
        return next(); // Ignorar archivos estáticos
    }
    const token = req.query.token;
    console.log('Token recibidoss:', token); 

    if (!token) {
        console.log('Token no proporcionado en la URL');
        return  res.status(400).send('El enlace de restablecimiento no es válido o ha expirado.');

    }

    try {      
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log('Token decodificadooo:', decoded);

        // Si el token es válido, sirve la página HTML
        res.sendFile(path.join(__dirname,'public','restablecerContraseña.html'));
    } catch (error) {
        console.log('Token inválido o expirado:', error);
        res.status(400).send('El enlace de restablecimiento no es válido o ha expirado.');
    }
});

// Ruta protegida para eliminar un comentario (solo para administradores)
app.delete('/comentarios/:id',autenticacionTokenYRol(['admin']),async(req, res) => {
    try {
            const {id} = req.params; //ID del cometario a eliminar
            //logica para buscar y eliminar el comentario en la base de datos
            const comentario = await Comentario.findByIdAndDelete(id);
            if (!comentario) {
                return res.status(404).json({message: 'Comentario no encontrado'});
            }
            res.status(200).json({message: 'Comentario eliminado correctamente'});
    } catch (error) {
            console.log('Error al eliminar el comentario: ',error);
            res.status(500).json({message: 'Error interno del servidor'});
    }

});

//Ruta protegida para usuarios con rol "admin"
app.get('/admin',autenticacionTokenYRol(['admin']), (req, res) => {
      res.send(`Bienvenido administrador, ${req.usuario.email}.`);
});

//Ruta protegida para roles especificos (e.g 'admin' o 'editor')
app.get('/editor',autenticacionTokenYRol(['admin','editor']), (req, res) => {
      res.send(`Bienvenido, ${req.usuario.email}. Tienes acceso como ${req.usuario.role}.`);
});

//Ruta abierta para cualquier Rol
app.get('/welcome',autenticacionTokenYRol(['admin','usuario','editor']), (req, res) => {
      res.send(`Bienvenido, ${req.usuario.email}.`);
});




process.on('SIGINT',async () =>{
    console.log('Cerrado conexion con mongoDB...');
    await mongoose.connection.close();
    console.log('Conexion con mongoDB cerrada...');
    process.exit(0);
});

//inicio Servidor
const PORT =3000;
app.listen(PORT,() => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});