const nodemailer = require('nodemailer');
const Reserva = require('../models/reserva');

exports.guardarReserva = async (datosReserva) => {
    const nuevaReserva = new Reserva(datosReserva);
    return await nuevaReserva.save();
};

exports.enviarCorreoReserva = async ({nombre, apellido, edad, telefono, email, servicio,motivoConsulta }) => {

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
    await transporter.sendMail(mailOptions);
};

exports.obtenerTodasReservas = async () => {

    return await Reserva.find(); //obtiene todas las reservas de la base de datos
    
};