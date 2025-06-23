const Comentario = require('../models/comentario');

exports.guardarComentario = async (datosComentario) => {

    const nuevoComentario = new Comentario(datosComentario);
    return await nuevoComentario.save();
};

exports.guardarRespuesta = async (comentarioId, datosRespuesta) => {

    const comentario = await (Comentario.findById(comentarioId));
    if (!comentario) {
        return null; //retorna null si no se encuentra el comentario
    }
    comentario.respuestas.push(datosRespuesta);
    return await comentario.save();
};

exports.obtenertodosComentarios = async () => {
    return await Comentario.find();
};

exports.obtenerComentarioPorId = async (comentarioId) => {

    return await Comentario.findById(comentarioId);
};

exports.eliminarComentarioPorId = async (comentarioId) => {

    return await Comentario.findByIdAndDelete(comentarioId);
};

exports.eliminarRespuestaPorId = async (comentarioId, respuestaId) => {
    // Busca el comentario por su ID
    const comentario = await Comentario.findById(comentarioId);
    console.log(`Comentario encontrado:`, comentario);
    console.log(`ID de la respuesta:`, respuestaId);
    if (!comentario) {
        return null; // Retorna null si no se encuentra el comentario
    }
    // // Filtra las respuestas para eliminar la respuesta específica
    // const respuestasActualizadas = comentario.respuestas.filter(respuesta => respuesta._id.toString() !== respuestaId.toString());
    // console.log('Respuestas actualizadas:', respuestasActualizadas);
    // // Actualiza las respuestas del comentario<
    // comentario.respuestas = respuestasActualizadas;
    // console.log(`Respuestas antes de eliminar:`, comentario.respuestas);
    // comentario.respuestas = comentario.respuestas.filter(respuesta => respuesta._id.toString() !== respuestaId.toString());
    // console.log(`Respuestas después de eliminar:`, comentario.respuestas);

    comentario.respuestas = comentario.respuestas.filter(respuesta => {
        const sonIguales = respuesta._id.toString() === respuestaId.toString();
        console.log(`Comparando ${respuesta._id} con ${respuestaId}:`, sonIguales);
        return !sonIguales;
      });


    // Guarda el comentario actualizado
    return await comentario.save();
    
};

