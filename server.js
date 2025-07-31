
// Importar las dependencias necesarias
const express = require('express');
const http = require('http'); // Para crear un servidor HTTP
const {Server} = require('socket.io');
const helmet = require('helmet');
const mongoose = require('mongoose');
const conectarDB = require('./config/db'); // Importar la función de conexión a la base de datos
const cors     = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Para manejar variables de entorno
const path = require('path');

// Inicialización de la aplicación
const app = express();
// Crear un servidor HTTP
const server = http.createServer(app);//crear archivo http
// Configuración de Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://wfbtg48m-5500.brs.devtunnels.ms'],
        methods: ['GET', 'POST'],
        credentials: true
    }

});

// Configuración de Helmet para mejorar la seguridad
//app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',     // Swiper, SweetAlert2, Socket.io CDN, etc.
          "'unsafe-inline'"              // Si tienes scripts en línea (no recomendado, pero necesario si los usas)
        ],
        styleSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          "'unsafe-inline'"
        ],
        imgSrc: ["'self'", 'data:', 'https://*'],
        connectSrc: [
          "'self'",
          'ws://localhost:3000',         // WebSocket local
          'wss://*',                     // WebSocket seguro si vas a producción
          'https://cdn.jsdelivr.net'
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );



// Middlewares globales
app.use(express.json());
app.use(bodyParser.json());


// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const rolesRoutes = require('./routes/roleRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');





// Configuración de CORS
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

// Conexión a la base de datos
conectarDB();

// Configuración de rutas
app.use('/', authRoutes);
app.use('/', reservaRoutes);
app.use('/', comentarioRoutes);
app.use('/', rolesRoutes);
app.use('/', usuarioRoutes);


//websocket: manejo de eventos
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    //escuchar desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

//compartir la intancia de 'io' con otros modulos
app.set('socketio', io);

// Manejo de eventos del proceso
process.on('SIGINT',async () =>{
    console.log('Cerrado conexion con mongoDB...');
    await mongoose.connection.close();
    console.log('Conexion con mongoDB cerrada...');
    process.exit(0);
});


// Inicio del servidor
const PORT =3000;
server.listen(PORT,() => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});