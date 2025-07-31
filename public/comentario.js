// Este módulo manejará los comentarios y respuestas.
import { iniciarWebSocket} from './websocket.js';
import { postData,obtenerDatosUsuarioToken,obtenerToken} from './utils.js';
import { CONFIG } from './config.js';
import { mostrarMensaje } from './ui.js';
import { usuarioAutenticado} from './autenticacion.js';


iniciarWebSocket(CONFIG.API_URL);

 //manejo de envio de comentarios

export const manejarEnvioComentario = () => {
 const botonEnviarComentario = document.getElementById('enviar-comentario');
 if (botonEnviarComentario) {
     botonEnviarComentario.addEventListener('click', async(e) =>{
         e.preventDefault();

         // if (!usuarioAutenticado()) {
         //     mostrarMensaje("¡Debes iniciar sesion para dejar tu comentario!", "error");
         //     return;
         // }

         const datosUsuarios = obtenerDatosUsuarioToken();
         
         if(!datosUsuarios){
             mostrarMensaje("¡No se pudieron obtener tus datos. Inicia sesión nuevamente!.", "error");
             return;
         }
         const {nombre,  apellido} = datosUsuarios;

         const textoComentario = document.getElementById('comentario-textoo').value.trim();

         if (!textoComentario) {
             mostrarMensaje('¡Por favor, agrega un comentario!.','error');
             return;
         }
         const comentario = {
              texto: textoComentario,
              nombre: nombre,
              apellido: apellido
         };
        
         try {
             const response = await postData(`${CONFIG.API_URL}/comentarios`,comentario);
            
            
             if (response.ok) {
                 const data = await response.json();
                 console.log(data);

                 //Se sincroniza con webSocket !
                 //agregarComentario(comentario.texto,data.comentario._id,nombre, apellido,data.comentario.fechaCreacion);

                 document.getElementById('comentario-textoo').value = '';
                 mostrarMensaje('¡Comentario enviado correctamente!.','exito');
             } else {
                 mostrarMensaje('¡Error al enviar comentario!.','error');
             }
         } catch (err) {
             console.log('¡Error al enviar el comentario!',err);
         }
 });
}   
};

//Cargar comentarios desde el servidor
   //variables para manejar los comentarios

 export const configurarObtencionComentarios = () => {

    let comentarios = [];
    let comentariosMostrados = 3;
    let comentariosOrdenados = []
    const obtenerComentarios =  async () => {
         
        try {
            const response = await fetch(`${CONFIG.API_URL}/comentarios`);
            comentarios = await response.json();//almacena todos los comentarios en la variable global
              //ordena los comentarios por fecha de creacion
          
            mostrarComentarios(); //muestra los primeros 3 comentarios
 
        } catch (err) {
                console.log('Error al obtener los comentarios: ', err);
        }
    };
 
        // funcion para mostrar los comentarios
     const mostrarComentarios = () => {
         const listaComentarios = document.getElementById('lista-comentarios');
         listaComentarios.innerHTML=''; //limpia los comentarios actuales
         
         comentariosOrdenados = [...comentarios].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
         //muestra solo los primeros "comentariosMostrados" comentarios
         comentariosOrdenados.slice(0,comentariosMostrados).forEach((comentario) => {
             agregarComentario(comentario.texto, comentario._id, comentario.nombre, comentario.apellido,comentario.fechaCreacion);
             
             if (comentario.respuestas) {
                 comentario.respuestas.forEach((respuesta) => {
                    agregarRespuesta(comentario._id,respuesta._id,respuesta.texto, respuesta.nombre, respuesta.apellido);
 
                 });
             }
         });
 
         //mostrar el boton "Mostrar todos" si hay mas comentarios
         const botonMostrarTodos = document.getElementById('mostrar-todos-comentarios');
         if (comentariosMostrados < comentarios.length) {
             botonMostrarTodos.style.display = 'block';
         } else {
             botonMostrarTodos.style.display = 'none';
         }
     };
    
         //evento para mostrar todos los comentarios
         const botonMostrarTodos = document.getElementById('mostrar-todos-comentarios');
         if (botonMostrarTodos) {
             botonMostrarTodos.addEventListener('click', () => {
                 comentariosMostrados = comentarios.length; //muestra todos los comentarios
                 mostrarComentarios();
             });
         }
         obtenerComentarios();
};  



           //Agregar comentario

    export const agregarComentario = (texto,id,nombreUsuario, apellidoUsuario,fechaCreacion) => {

        const listaComentarios = document.getElementById('lista-comentarios');
        
        //crear contenedor principal del comentario
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('comentario');
        comentarioDiv.dataset.id =id;

        //creamos la fecha
        const ahora = new Date();
        const fechaDiv = document.createElement('div');
        fechaDiv.classList.add('comentario-fecha');
        fechaDiv.textContent = `${new Date(fechaCreacion).toLocaleDateString()} - ${new Date(fechaCreacion).toLocaleTimeString()}`;

        //creamos al autor
        const autorDiv = document.createElement('div');
        autorDiv.classList.add('comentario-autor');
        autorDiv.textContent = `${nombreUsuario} ${apellidoUsuario}`;

        //creamos el texto 
        const textoDiv = document.createElement('div');
        textoDiv.classList.add('comentario-texto');
        textoDiv.textContent= texto;

        //acciones
        const accionesDiv = document.createElement('div');
        accionesDiv.classList.add('comentario-acciones');
        
        if (usuarioAutenticado()) {
            //boton responder
        const responderLink = document.createElement('a');
        responderLink.classList.add('icono-responder');
        responderLink.textContent = 'Responder';
        accionesDiv.appendChild(responderLink);

                //Evento para responder
                responderLink.addEventListener("click", async ()=> {
                    //Evitar crear multiples contenedores de respuesta
                    if (comentarioDiv.querySelector(".respuestas")) return;
        
                    //crear contenedor para la respuesta 
                    const respuestaDiv = document.createElement('div');
                    respuestaDiv.classList.add('respuestas');
        
                    const textAreaRes = document.createElement('textarea');
                    textAreaRes.classList.add('respuesta-texto');
                    textAreaRes.placeholder = "Ingresa tu respuesta..";
        
                    const botonCancelar = document.createElement('button');
                    botonCancelar.classList.add('boton-cancelar');
                    botonCancelar.textContent= "Cancelar";
        
                    const botonPublicar = document.createElement('button');
                    botonPublicar.classList.add('boton-publicar');
                    botonPublicar.textContent = "Publicar";
        
                    //agregar los elementos al contenedor de respuesta
                    respuestaDiv.appendChild(textAreaRes);
                    respuestaDiv.appendChild(botonCancelar);
                    respuestaDiv.appendChild(botonPublicar);
                    comentarioDiv.appendChild(respuestaDiv);
        
                    //Evento para cancelar la respuesta
                    botonCancelar.addEventListener("click", async () => {
                        respuestaDiv.remove();
                        comentarioDiv.scrollIntoView({behavior: 'smooth'});
            
                    });
        
                    //  Evento para publicar la respuesta
                    botonPublicar.addEventListener("click", async () => {
        
                        // if (!usuarioAutenticado()) {
                        //     mostrarMensaje("¡Debes iniciar sesion para dejar tu comentario!", "error");
                        //     return;
                        // }
                        const datosUsuarios = obtenerDatosUsuarioToken();
                        
                        if(!datosUsuarios){
                            mostrarMensaje("¡No se pudieron obtener tus datos. Inicia sesión nuevamente!.", "error");
                            return;
                        }
                        const {nombre,  apellido} = datosUsuarios;
            
                        const textoRespuesta = respuestaDiv.querySelector(".respuesta-texto").value.trim();
            
                        if (!textoRespuesta) {
                            mostrarMensaje("¡La respuesta no puede estar vacía!.",'error');
                            return;
                        }
                        const respuesta = {
                            texto: textoRespuesta,
                            nombre: nombre,
                            apellido: apellido
            
                        };
                        try {
                            const response = await postData(`${CONFIG.API_URL}/comentarios/${id}/respuestas`,respuesta);
                            
                            const data = await response.json();
                            
                            if (response.ok) {
                                const respuestaId = data.respuestaId; // Obtener el ID de la respuesta recién creada
                                console.log("El id de la respuesta es: ",respuestaId);
                                //se sincroniza con webSocket ! 
                                //agregarRespuesta(id, textoRespuesta,nombre, apellido);
                                
                                respuestaDiv.remove();
                            } else {
                                mostrarMensaje("¡Error al publicar la respuesta!.",'error');
                            }
            
                        } catch (error) {
                                console.log("¡Error al publicar la respuesta!.", error);
                        }
                    });
                });
        }
        

        // Si es admin, boton eliminar.

        if (usuarioEsAdmin()) {

            const eliminarLink = document.createElement('a');
            eliminarLink.classList.add('icono-eliminar');
            eliminarLink.textContent = 'Eliminar';
            accionesDiv.appendChild(eliminarLink);

            // Evento para eliminar

            eliminarLink.addEventListener("click", async () => {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta acción no se puede deshacer",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await fetch(`${CONFIG.API_URL}/comentarios/${id}`, {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${obtenerToken()}`, // Enviar el token
                                },
                            });
                            if (response.ok) {
                                Swal.fire('¡Eliminado!', 'El comentario ha sido eliminado.', 'success');
                                //websocket lo realiza.
                                //comentarioDiv.remove();
                            } else {
                                mostrarMensaje("¡Error al eliminar el comentario!.", "error");
                            }
                        } catch (error) {
                            console.log("Error al eliminar el comentario", error);
                        }
                    }
                });
            });
        }
          //contenedor de respuestas
        
          const contenedorRespuestas = document.createElement('div');
          contenedorRespuestas.classList.add('contenedor-respuestas');

          //Estructura final del comentario
          comentarioDiv.appendChild(fechaDiv);
          comentarioDiv.appendChild(autorDiv);
          comentarioDiv.appendChild(textoDiv);
          comentarioDiv.appendChild(contenedorRespuestas);
          comentarioDiv.appendChild(accionesDiv);
          //insertar al principio de la lista

          listaComentarios.prepend(comentarioDiv);
    
  
    };

        //verificar si el usuario tiene rol de admin
    export const usuarioEsAdmin = () => {

            const token = obtenerToken();
            if (!token) {
                return false;
            }
            try {
                const decodificarToken = jwt_decode(token);
                return  decodificarToken && decodificarToken.role === "admin";
            } catch (error) {
                console.log("Error al decodificar el token", error);
                return false;
            }
    
    };

     //agregar una respuesta a un comentario
export const agregarRespuesta = (comentarioId,respuestaId,texto,nombreUsuario, apellidoUsuario ) => { 

    const comentarioDiv = document.querySelector(`[data-id="${comentarioId}"]`);

    if (comentarioDiv) {
        //verifica si ya existe un contenedor de respuestas, si no, lo crea
        let contenedorRespuesta = comentarioDiv.querySelector(".contenedor-respuestas");
        if(!contenedorRespuesta) {
            contenedorRespuesta = document.createElement("div");
            contenedorRespuesta.classList.add("contenedor-respuestas");
            comentarioDiv.appendChild(contenedorRespuesta);
        }

        //Evitar duplicados
        
        if (![...contenedorRespuesta.children].some(el => el.textContent === texto)) {
           
            const respuestaMostrada = document.createElement("div");
            respuestaMostrada.classList.add("respuesta-mostrada");
            //respuestaMostrada.setAttribute("data-id-respuesta", respuestaId); // Agregar el ID de la respuesta
            respuestaMostrada.dataset.id = respuestaId; // Agregar el ID de la respuesta
            console.log(`respuesta agregada con ID: ${respuestaId}`);
            
            //crear el contenido de la respuesta
            const textoRespuesta = document.createElement("span");
            textoRespuesta.textContent = `${nombreUsuario} ${apellidoUsuario} : ${texto}`;
            respuestaMostrada.appendChild(textoRespuesta);
            
            
            if (usuarioEsAdmin()) { 
                //crear el icono de eliminar
            const eliminarIcono = document.createElement("img");
            eliminarIcono.src = "./Imagenes/papelera.png";
            eliminarIcono.alt = "Eliminar respuesta";
            eliminarIcono.classList.add("eliminar-respuesta");
            

       

            //agregar evento de click para eliminar la respuesta
            eliminarIcono.addEventListener("click", async () =>{

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Esta accion no se puede deshacer",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                }).then(async (result) => {
                    if (result.isConfirmed){
                        try {
                            const response = await fetch(`${CONFIG.API_URL}/comentarios/${comentarioId}/respuestas/${respuestaId}`, {
                            method: "DELETE",
                            headers: {
                                 "Authorization": `Bearer ${obtenerToken()}`, // Enviar el token
                            },
                            });
                            if (response.ok) {
                               
                                // respuestaMostrada.remove(); //elimina la respuesta del DOM
                                Swal.fire('¡Eliminado!', 'La respuesta ha sido eliminada.', 'success');
                            }else {
                                Swal.fire('Error', 'No se pudo eliminar la respuesta', 'error');
                            }
                        } catch (error) {
                            console.log("Error al eliminar la respuesta", error);
                            Swal.fire('Error', 'Ocurrió un error al eliminar la respuesta', 'error');
                        }
                    }
                });
            });
            
            respuestaMostrada.appendChild(eliminarIcono);
        };
            


            contenedorRespuesta.appendChild(respuestaMostrada);
        }
    }
};

export const eliminarComentarioDeInterfaz = (comentarioId) => {
    const comentarioDiv = document.querySelector(`[data-id="${comentarioId}"]`);
    if (comentarioDiv) {
        comentarioDiv.remove();
        console.log(`Comentario con ID ${comentarioId} eliminado de la interfaz`);
    } else {
        console.log(`Comentario con ID ${comentarioId} no encontrado en la interfaz`);
    }
};
export const eliminarRespuestaDeInterfaz = (respuestaId) => {
    const respuestaMostrada =  document.querySelector(`[data-id="${respuestaId}"]`);
    if (respuestaMostrada) {
        respuestaMostrada.remove();
        console.log(`Respuesta con ID ${respuestaId} eliminada de la interfaz`);
    } else {
        console.log(`Respuesta con ID ${respuestaId} no encontrada en la interfaz`);
    }
};