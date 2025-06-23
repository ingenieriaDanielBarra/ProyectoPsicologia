const {guardarComentario, guardarRespuesta, obtenertodosComentarios, 
       obtenerComentarioPorId, eliminarComentarioPorId,eliminarRespuestaPorId} = require('../services/comentarioService');

exports.crearComentario = async (req, res) => {
    const {nombre, apellido, texto, fechaCreacion} = req.body;

    try {
        //validar los datos del comentario
        if(!nombre || !apellido || !texto || !texto.trim() ==='') {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        //Guardar el comentario en la base de datos
        const nuevoComentario = await guardarComentario(req.body);

        //Emitir el evento de webSocket
        const io = req.app.get('socketio'); //obtener la instancia de 'io' desde el servidor
        io.emit('nuevoComentario', nuevoComentario);// emitir el evento a todos los clientes conectados.

        res.status(201).json({
            mensaje: 'Comentario creado exitosamente',
            comentario: nuevoComentario
        });
    } catch (error) {
        console.error('Error al crear el comentario:', error);
        res.status(500).json({
            message: 'Error al crear el comentario',
            error: error.message
        });   
    }
};

exports.crearRespuesta = async (req, res) => {
    const {nombre, apellido, texto} = req.body;
    const {id} = req.params;

    console.log('Comentario ID recibido:', id);
    console.log('Datos de la respuesta:', req.body);
    try {
        //fvalidar los datos de la respuesta
        if(!nombre || !apellido || !texto || !texto.trim() === '') {
            return res.status(400).json({error: 'Todos los campos son obligatorios'});
        }
        //Guardar la respuesta en la base de datos
        const comentarioActualizado = await guardarRespuesta(id, req.body);

        if (!comentarioActualizado) {
            return res.status(404).json({error: 'Comentario no encontrado'});
        }
 
        //obtener la ultima respuesta agregada
        const ultimaRespuesta = comentarioActualizado.respuestas[comentarioActualizado.respuestas.length -1 ];


        const io = req.app.get('socketio'); //obtener la instancia de 'io' desde el servidor
        io.emit('nuevaRespuesta', {
            //_id: comentarioActualizado._id,
            comentarioId: comentarioActualizado._id,
            respuestaId: ultimaRespuesta._id, // enviar el ID de la respuesta recién creada
            textoRespuesta: texto,
            nombre: nombre,
            apellido: apellido,
            fechaCreacion: new Date().toISOString() // o la fecha que corresponda
        }); // emitir el evento a todos los clientes conectados.

        res.status(201).json({
            mensaje: 'Respuesta creada exitosamente',
            //comentario: comentarioActualizado
            respuestaId: ultimaRespuesta._id,
        });
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).json({
            message: 'Error al crear la respuesta',
            error: error.message
        }); 
    }
};

exports.obtenerComentarios = async (req, res) => {
    try {
        const comentarios = await obtenertodosComentarios();
        res.status(200).json(comentarios);
    } catch (error) {
        consoe.error('Error al obtener los comentarios:', error);
        res.status(500).json({
            message: 'Error al obtener los comentarios',
            error: error.message
        });
    }
};

exports.obtenerComentarioMasRespuestas = async (req, res) => {
    const comentarioId = req.params.id;
    try {
        const comentarios = await obtenerComentarioPorId(comentarioId);
        if (!comentarios) {
            return res.status(404).json({error: 'Comentario no encontrado'});
        }
        res.status(200).json(comentarios);
    } catch (error) {
        console.error('Error al obtener el comentario con las respuestas:', error);
        res.status(500).json({
            message: 'Error al obtener el comentario con las respuestas',
            error: error.message
        });
    }
};

exports.eliminarComentario = async (req, res) => {

    const comentarioId = req.params.id;

    try {
        const comentario = await eliminarComentarioPorId(comentarioId); 
        if (!comentario) {
            return res.status(404).json({message: 'Comentario no encontrado'});
        }

        //Emitir el evento de webSocket
        const io = req.app.get('socketio'); //obtener la instancia de 'io' desde el servidor
        io.emit('comentarioEliminado', { id: comentarioId }); // emitir el evento a todos los clientes conectados.

        res.status(200).json({message: 'Comentario eliminado exitosamente'});
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        res.status(500).json({
            message: 'Error al eliminar el comentario',
            error: error.message
        });
    }
};

exports.eliminarRespuesta = async (req, res) => {

    const {comentarioId, respuestaId} = req.params;

        // // Validar que respuestaId sea un ObjectId válido
        // if (!mongoose.Types.ObjectId.isValid(respuestaId)) {
        //     return res.status(400).json({ message: 'ID de respuesta inválido' });
        // }
     

    try {
        const respuestaEliminada = await eliminarRespuestaPorId(comentarioId, respuestaId);
        if (!respuestaEliminada) {
            return res.status(404).json({message: 'Respuesta no encontrada'});
        }
        //Emitir el evento de webSocket
        const io = req.app.get('socketio'); //obtener la instancia de 'io' desde el servidor
        io.emit('respuestaEliminada', {comentarioId,respuestaId}); // emitir el evento a todos los clientes conectados.
        res.status(200).json({message: 'Respuesta eliminada exitosamente'});
    } catch (error) {
        console.log('Error al eliminar la respuesta:', error);
        res.status(500).json({message: 'Error al eliminar la respuesta',error: error.message});
    }

};