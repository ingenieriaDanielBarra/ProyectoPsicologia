const {guardarReserva,enviarCorreoReserva,obtenerTodasReservas} = require('../services/reservaService');

exports.crearReserva = async (req, res) => {
     const {nombre,apellido,edad,telefono,email,servicio,motivoConsulta} = req.body;
    try {
        //guardar la reserva en la base de datos.
        const nuevaReserva = await guardarReserva(req.body);

        //enviar correo electronico con los datos de la reserva.

        await enviarCorreoReserva({nombre, apellido, edad, telefono, email, servicio, motivoConsulta});
        res.status(200).json({message: 'Reserva creada con éxito'});    

    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        res.status(500).json({message: 'Error al crear la reserva'});
    }
};

exports.obtenerReservas = async (req, res) => {
    try {
        const reservas = await obtenerTodasReservas();
        res.status(200).json(reservas);     
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({message: 'Error al obtener las reservas', error: error.message});
    }

};