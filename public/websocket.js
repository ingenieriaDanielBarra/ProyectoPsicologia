import {agregarComentario, agregarRespuesta, eliminarComentarioDeInterfaz,eliminarRespuestaDeInterfaz} from './comentario.js';

export const iniciarWebSocket = (url) => {

    const socket = io(url);
    //escuchar el evento de nuevoComentario
    socket.on('nuevoComentario', (data) => {
        console.log('Nuevo comentario recibido:', data);
        //actualizar la interfaz con el nuevo comentario
        agregarComentario(data.texto, data._id, data.nombre, data.apellido, data.fechaCreacion);
    });

    //escuchar el evento de nuevaRespuesta
    socket.on('nuevaRespuesta', (data) => {
        console.log('Nueva respuesta recibida:', data);
        //actualizar la interfaz con la nueva respuesta
        agregarRespuesta(data.comentarioId,data.respuestaId, data.textoRespuesta,data.nombre, data.apellido, data.fechaCreacion);
        //agregarRespuesta(data._id, data.textoRespuesta,data.nombre, data.apellido, data.fechaCreacion);
    });

    socket.on('comentarioEliminado', (data) => {
        console.log('Comentario eliminado recibido:', data);
        eliminarComentarioDeInterfaz(data.id);
    });

    socket.on('respuestaEliminada', (data) => {
        console.log('Respuesta eliminada recibida:', data);
        eliminarRespuestaDeInterfaz(data.respuestaId);   
    });

    return socket;
};

