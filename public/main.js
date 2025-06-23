import {CONFIG} from './config.js';
console.log(CONFIG.API_URL);

import {manejarNavegacion, redirigirDesdeServicios,mostrarOcultarContraseña,configurarToggleBiografia, validarMotivoConsulta, mostrarFormularioRestablecerClave,
    mostrarMensajeBienvenida,deshabilitarBotonSesion,actualizarEstadoComentario,configurarBotonVolverArriba}  from './ui.js';
import {configurarRegistroUsuario,configurarInicioSesion,configurarRecuperacionClave,configurarRestablecimientoClave,usuarioAutenticado,configurarCierreSesionAutomatico} from './autenticacion.js';
import {manejarEnvioReserva} from './reserva.js';
import {manejarEnvioComentario,configurarObtencionComentarios} from './comentario.js';

document.addEventListener('DOMContentLoaded', () => {
 

  mostrarFormularioRestablecerClave();
  configurarRecuperacionClave();
  configurarRestablecimientoClave();
      mostrarOcultarContraseña('nueva-contraseña','toggle-passwordRestablecer');
      mostrarOcultarContraseña('confirmar-nueva-contraseña','toggle-passwordRestablecerConfirm');

  
  mostrarMensajeBienvenida();
  manejarNavegacion();
  redirigirDesdeServicios();


  configurarRegistroUsuario();
      mostrarOcultarContraseña('password','toggle-passwordCrear');   
      mostrarOcultarContraseña('confirmPassword','toggle-passwordCrearConfirm');


  configurarInicioSesion();
  mostrarOcultarContraseña('contraseña','toggle-password-Sesion');
  deshabilitarBotonSesion();


  manejarEnvioReserva();
  actualizarEstadoComentario();


  manejarEnvioComentario();
    

  validarMotivoConsulta();


  configurarToggleBiografia();

  configurarCierreSesionAutomatico();

  configurarBotonVolverArriba();

  if (usuarioAutenticado()) {
   configurarCierreSesionAutomatico();
  }
  
  configurarObtencionComentarios();














































// ///// CODIGO ORIGINAL !!!!!!!!!
 

//     //funcion para realizar peticiones POST
//     const postData = async(url,data)=>{
//         try {
          
//            const response = await fetch(url,{
//                method : 'POST',
//                headers: {"Content-type": "application/json",
//                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Token en encabezados
//                },
//                body   : JSON.stringify(data),
//            });
//            return response;
//        } catch (error) {
//            console.log("Error en la comunicacion con el servidor",error);
//            throw error;
//        }
//    };


//    // Función para mostrar y ocultar la contraseña
//    const mostrarOcultarContraseña = (idCampoContraseña,idToggleImg) => {

//        const contraseñaInput = document.getElementById(idCampoContraseña);
//        const toggleImg   = document.getElementById(idToggleImg);
   
//        if (!contraseñaInput || !toggleImg) {
//            console.error('No se encontraron los elementos para mostrar/ocultar la contraseña.');
//            return;
//        }
   
//        toggleImg.addEventListener('click', () => {
//            //Alternar el tipo de input entre password y text
//            const tipo = contraseñaInput.type === 'password' ? 'text' : 'password';
//            contraseñaInput.type = tipo;
//            //cambiar la imagen del ojo
//            toggleImg.src = tipo === 'password' ? 'Imagenes/ojo-cerrado.png' : 'Imagenes/ojo-abierto.png';
//        });
   
//    };

//    //funcion para obtener el token 
//    const obtenerToken = () => {
//        return localStorage.getItem("token");
//    };

//    //funcion para obtener nombre y apellido del token

//    const obtenerDatosUsuarioToken = () => {

//        const token = obtenerToken();
//        if(!token) return null;
       
//        try {
//            const decoded = jwt_decode(token);
           
//            return {
//                nombre: decoded.nombre,
//                apellido: decoded.apellido
//            };
//        } catch (error) {
//            console.log("Error al decodificar el token:", error);
//            return  null;
//        }
// };

//    //validar si el usuario esta autenticado

//    const usuarioAutenticado = () => {
//        const token = obtenerToken();
//        if (!token) {
//            return false;
//        }
//        try {
//            const decodificarToken = jwt_decode(token);
//            const expiracion = new Date(decodificarToken.exp*1000);
//            return expiracion > new Date(); //verificar si el token no esta expirado
//        } catch (error) {
//            console.log("Token invalido o no se pudo decodificar", error);
//            return false;
//        }
//    };
// //mostrar mensaje de bienvenida si el usuario esta autenticado

//    const mostrarMensajeBienvenida = () => {
//        if (usuarioAutenticado) {
//            const datosUsuario = obtenerDatosUsuarioToken();
//            if (datosUsuario) {
//                const mensajeBienvenida = document.getElementById("mensaje-bienvenida");
//                mensajeBienvenida.textContent = `👋 Bienvenido/a, ${datosUsuario.nombre} ${datosUsuario.apellido}`;
//                mensajeBienvenida.style.display = "block";
//            }
//        }
//    };
// mostrarMensajeBienvenida();
// //alternar formularios y secciones 

// document.querySelectorAll("nav ul li a, .inicio-sesion a, #formAcceso a").forEach(enlace => {
//    enlace.addEventListener("click", function (event) {
//        event.preventDefault();
//        const destinoID = this.getAttribute("href").substring(1); // Obtiene el ID sin el #
//        const contenidoPrincipal = document.getElementById("contenido-principal");
//        const formularioReserva = document.getElementById("formulario-reserva");
//        const formularioAcceso = document.getElementById("formulario-acceso");
//        const formularioCreacionUsuario = document.getElementById("formulario-creacionUsuario");
//        const formularioRecuperarClave = document.getElementById("formulario-recuperarClave"); 

//        ocultarElemento(contenidoPrincipal);
//        ocultarElemento(formularioReserva);
//        ocultarElemento(formularioAcceso);
//        ocultarElemento(formularioCreacionUsuario);
//        ocultarElemento(formularioRecuperarClave);

//        // Si el enlace es "Reservar Hora", muestra el formulario
//        if (destinoID === "formulario-reserva") {
//            mostrarElemento(formularioReserva);

//        }else if(destinoID === "formulario-acceso"){
//            mostrarElemento(formularioAcceso);
//        } 
//        else  if(destinoID === "formulario-creacionUsuario"){
//            mostrarElemento(formularioCreacionUsuario);
//        }
//        else  if(destinoID === "formulario-recuperarClave"){
//            mostrarElemento(formularioRecuperarClave);
//        }
//        else{
//            mostrarElemento(contenidoPrincipal);
       

//            // Desplázate a la sección correspondiente
//            const destino = document.getElementById(destinoID);
//            console.log(destino);
//            if (destino) {
//                destino.scrollIntoView({ behavior: "smooth" });
//            }
//        }
//    });
// });


// //Redireccionar desde la seccion servicios a formulario reserva

// document.querySelectorAll("#servicios button").forEach(enlaces => {
//    enlaces.addEventListener('click', () =>{
          
//       const contenidoPrincipal = document.getElementById("contenido-principal");
//       const formularioReserva = document.getElementById("formulario-reserva");
//       const combobox = document.getElementById("servicioCombo");

//       ocultarElemento(contenidoPrincipal);
//       mostrarElemento(formularioReserva);

//       if (enlaces.id === "agendarAdulto") {
//           combobox.value = "Tratamiento_psicológico_adultos";
//        } else if(enlaces.id === "agendarAdolescente"){
//            combobox.value = "Tratamiento_psicológico_adolescentes";
//        }
//      });
// });


// //manejo registro de usuario
// const botonCrearUsuario = document.getElementById('crear-usuario');
// if (botonCrearUsuario) {
//    botonCrearUsuario.addEventListener('click', async(e) =>  { 
//        e.preventDefault();
       
//            //obtener los valores ingresados
//            const nombre     = document.getElementById("nombrePaciente").value;
//            const apellido   = document.getElementById("apellidoPaciente").value;
//            const correo     = document.getElementById("email").value;
//            const contraseña = document.getElementById("password").value;
//            const confirmarContraseña = document.getElementById("confirmPassword").value;
           
//            //validacion simple con el cliente
       
//            if (!nombre || !apellido || !correo || !contraseña || !confirmarContraseña) {
//                mostrarMensaje("Por favor, Completa todos los campos !",'error');
//                return;
//            }
//            if(!validarCorreo(correo)){
//                mostrarMensaje("¡ Correo electronico no valido !", 'error');
//                return;
//            }
//            if(!validarContraseña(contraseña)){
//                mostrarMensaje("¡ La contraseña debe tener al menos 8 caracteres, una letra y un número !", 'error');
//                return;
//            }
//            if (contraseña !== confirmarContraseña) {
//                mostrarMensaje("¡ Las contraseñas no coinciden !", 'error');
//                return;  
//            }
       
//            const credenciales = { nombre:nombre, apellido:apellido, correo:correo, contraseña:contraseña, confirmarContraseña:confirmarContraseña};
//            console.log(credenciales);
//            //Enviar solicitud al servidor
//            try {
//                const response = await postData(`${CONFIG.API_URL}/usuarios`,credenciales);
//                console.log(response);
//                const data = await response.json();
//                console.log(data);
//                if (response.ok) {
       
//                    mostrarMensaje('¡Usuario creado correctamente!','exito');
//                    limpiarFormulario();
                   
//                    ocultarElemento(document.getElementById("formulario-creacionUsuario"));
//                    mostrarElemento(document.getElementById("formulario-acceso"));
                  
//                }else{
//                    mostrarMensaje('!Error al crear usuario!','error');
//                }
//            } catch (error) {
//                    mostrarMensaje(`Error al crear usuario: ${error.message}`, 'error');
//            }
       
//        });
// }
//  mostrarOcultarContraseña('password','toggle-passwordCrear');   
//  mostrarOcultarContraseña('confirmPassword','toggle-passwordCrearConfirm');

// //manejo acceso a login
// const botonInicioSesion = document.getElementById('inicio-sesion');
// if (botonInicioSesion) {
//    botonInicioSesion.addEventListener('click', async(e) => {
//        e.preventDefault();
       
//            //obtener los datos del formulario
//            const correo = document.getElementById('correo').value;
//            const contraseña = document.getElementById('contraseña').value;
       
//            if(!validarCorreo(correo)){
//                mostrarMensaje('¡Correo electronico no valido!', 'error');
//                return;
//            }
   
//            const credencialesLogin = {correo: correo, contraseña:contraseña};
//            console.log(credencialesLogin);
//            try {
//                 //enviar solicitud al servidor
//                 const response = await postData(`${CONFIG.API_URL}/login`,credencialesLogin);
//                 console.log(response);
//                 const data = await response.json();
//                 console.log(data);
//                 if (response.ok) {
       
//                    localStorage.setItem('token', data.token);
       
//                    mostrarMensaje('¡Inicio de sesion exitoso!', 'exito');
       
//                    //desabilitar el boton de inicio de sesion
//                     const botonSesion = document.getElementById('icon-sesion');
//                     botonSesion.classList.add('sesion-iniciada');
//                     botonSesion.removeAttribute("href");                                       
                    
//                    setTimeout(() => {
//                        window.location.href= 'indexPsicologia.html';
//                    }, 2000);
                 
//                 }else{
//                      mostrarMensaje(data.mensaje || 'Error al iniciar sesion' , 'error');  
//                 }
       
//            } catch (error) {
//                 console.log('Error en la comunicacion con el el servidor: ', error);
//                 mostrarMensaje('Error al conectarse al servidor', 'error');
//            }
       
//        });
// }
// //mostrar y ocultar la contraseña
//  mostrarOcultarContraseña('contraseña','toggle-password-Sesion');





// const botonSesion = document.getElementById('icon-sesion');
// if (usuarioAutenticado()) {
//    botonSesion.style.pointerEvents = 'none'; // Deshabilitar clics
//    botonSesion.style.opacity = '0.3';
// }



// //manejo de envio de reserva
// const botonEnviarReserva = document.getElementById('enviar-formulario');
// if (botonEnviarReserva) {
//    botonEnviarReserva.addEventListener('click', async(e) => {
//        e.preventDefault();
//        const reserva = typeof obtenerDatosFormulario  === "function" ? obtenerDatosFormulario() : {};
   
   
//        if (!validarFormulario(reserva)) {
//            mostrarMensaje('¡Por favor completa todos los campos correctamente!','error');
//            return;
//        }
   
//       try {
//           const response = await postData(`${CONFIG.API_URL}/reservas`, reserva);
//           if (response.ok) {
//               mostrarMensaje('¡Reserva enviada correctamente!','exito');
//               limpiarFormulario();
   
//               setTimeout(() => {
//                window.location.href= 'indexPsicologia.html';
//               }, 2000);
              
//           } else {
//               mostrarMensaje('¡Error al enviar la reserva!','error');
//           }
//       } catch (err) {
//           console.log('Error al guardar la reserva', err);
//       }
   
//    });
// }


//    // bloqueo de compoennte
//    // funcion para actualizar el estado del formulario de comentarios
//     //manajo de envio de comentarios

//     function actualizarEstadoComentario(){
//        const comentarioTexto = document.getElementById('comentario-textoo');
//        const enviarComentario = document.getElementById('enviar-comentario');
//        const respuestaComentario = document.getElementsByClassName('icono-responder');
    

       
//        if (!comentarioTexto || !enviarComentario) {
//            console.error("No se encontraron los elementos de comentario");
//            return;
//        }

//        if (!usuarioAutenticado()) {
//            comentarioTexto.disabled = true;
//            enviarComentario.style.display = "none";
//            comentarioTexto.placeholder = "¡inicia sesion para comentar!";
          
//            for( let i=0; i<respuestaComentario.length; i++){
//                respuestaComentario[i].style.display = "none";
//            }
   
//        }else{
//            comentarioTexto.disabled =false;
//            enviarComentario.style.display = "block";
//            comentarioTexto.placeholder = "Escribe un comentario";

//            for( let i=0; i<respuestaComentario.length; i++){
//                respuestaComentario[i].style.display = "block";
//            }
//        }
//     }
//     //ejecutar la funcion al cargar la pagina
//        actualizarEstadoComentario();


   
       


//    //manejo de envio de comentarios
//    const botonEnviarComentario = document.getElementById('enviar-comentario');
//    if (botonEnviarComentario) {
//        botonEnviarComentario.addEventListener('click', async(e) =>{
//            e.preventDefault();

//            // if (!usuarioAutenticado()) {
//            //     mostrarMensaje("¡Debes iniciar sesion para dejar tu comentario!", "error");
//            //     return;
//            // }

//            const datosUsuarios = obtenerDatosUsuarioToken();
           
//            if(!datosUsuarios){
//                mostrarMensaje("No se pudieron obtener tus datos. Inicia sesion nuevamente.", "error");
//                return;
//            }
//            const {nombre,  apellido} = datosUsuarios;

//            const textoComentario = document.getElementById('comentario-textoo').value.trim();

//            if (!textoComentario) {
//                mostrarMensaje('¡Por favor, agrega un comentario!','error');
//                return;
//            }
//            const comentario = {
//                 texto: textoComentario,
//                 nombre: nombre,
//                 apellido: apellido
//            };
          
//            try {
//                const response = await postData(`${CONFIG.API_URL}/comentarios`,comentario);
              
              
//                if (response.ok) {
//                    const data = await response.json();
//                    console.log(data);
//                    agregarComentario(comentario.texto,data.comentario._id,nombre, apellido,data.comentario.fechaCreacion);
//                    document.getElementById('comentario-textoo').value = '';
//                    mostrarMensaje('¡Comentario enviado correctamente!','exito');
//                } else {
//                    mostrarMensaje('¡Error al enviar comentario!','error');
//                }
//            } catch (err) {
//                console.log('¡Error al enviar el comentario!',err);
//            }
//    });
// }
   




//    //Cargar comentarios desde el servidor
//   //variables para manejar los comentarios
//    let comentarios = [];
//    let comentariosMostrados = 3;
//    let comentariosOrdenados = []
//    const obtenerComentarios =  async () => {
        
//        try {
//            const response = await fetch(`${CONFIG.API_URL}/comentarios`);
//            comentarios = await response.json();//almacena todos los comentarios en la variable global
//              //ordena los comentarios por fecha de creacion
         
//            mostrarComentarios(); //muestra los primeros 3 comentarios

//        } catch (err) {
//                console.log('Error al obtener los comentarios: ', err);
//        }
//    };
   
   

//    // funcion para mostrar los comentarios
//    const mostrarComentarios = () => {
//        const listaComentarios = document.getElementById('lista-comentarios');
//        listaComentarios.innerHTML=''; //limpia los comentarios actuales
       
//        comentariosOrdenados = [...comentarios].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
//        //muestra solo los primeros "comentariosMostrados" comentarios
//        comentariosOrdenados.slice(0,comentariosMostrados).forEach((comentario) => {
//            agregarComentario(comentario.texto, comentario._id, comentario.nombre, comentario.apellido,comentario.fechaCreacion);
           
//            if (comentario.respuestas) {
//                comentario.respuestas.forEach((respuesta) => {
//                   agregarRespuesta(comentario._id,respuesta.texto, respuesta.nombre, respuesta.apellido);

//                });
//            }
//        });

//        //mostrar el boton "Mostrar todos" si hay mas comentarios
//        const botonMostrarTodos = document.getElementById('mostrar-todos-comentarios');
//        if (comentariosMostrados < comentarios.length) {
//            botonMostrarTodos.style.display = 'block';
//        } else {
//            botonMostrarTodos.style.display = 'none';
//        }
//    };
//    //evento para mostrar todos los comentarios
//    const botonMostrarTodos = document.getElementById('mostrar-todos-comentarios');
//    if (botonMostrarTodos) {
//        botonMostrarTodos.addEventListener('click', () => {
//            comentariosMostrados = comentarios.length; //muestra todos los comentarios
//            mostrarComentarios();
//        });
//    }


//   //Agregar comentario

//    const agregarComentario = (texto,id,nombreUsuario, apellidoUsuario,fechaCreacion) => {

//        const listaComentarios = document.getElementById('lista-comentarios');
       
//        //crear contenedor principal del comentario
//        const comentarioDiv = document.createElement('div');
//        comentarioDiv.classList.add('comentario');
//        comentarioDiv.dataset.id =id;

//        //creamos la fecha
//        const ahora = new Date();
//        const fechaDiv = document.createElement('div');
//        fechaDiv.classList.add('comentario-fecha');
//        fechaDiv.textContent = `${new Date(fechaCreacion).toLocaleDateString()} - ${new Date(fechaCreacion).toLocaleTimeString()}`;

//        //creamos al autor
//        const autorDiv = document.createElement('div');
//        autorDiv.classList.add('comentario-autor');
//        autorDiv.textContent = `${nombreUsuario} ${apellidoUsuario}`;

//        //creamos el texto 
//        const textoDiv = document.createElement('div');
//        textoDiv.classList.add('comentario-texto');
//        textoDiv.textContent= texto;

//        //acciones
//        const accionesDiv = document.createElement('div');
//        accionesDiv.classList.add('comentario-acciones');
       
//        //boton responder
//        const responderLink = document.createElement('a');
//        responderLink.classList.add('icono-responder');
//        responderLink.textContent = 'Responder';
//        accionesDiv.appendChild(responderLink);

//        // Si es admin, boton eliminar.

//        if (usuarioEsAdmin()) {

//            const eliminarLink = document.createElement('a');
//            eliminarLink.classList.add('icono-eliminar');
//            eliminarLink.textContent = 'Eliminar';
//            accionesDiv.appendChild(eliminarLink);

//            // Evento para eliminar

//            eliminarLink.addEventListener("click", async () => {
//                Swal.fire({
//                    title: '¿Estás seguro?',
//                    text: "Esta acción no se puede deshacer",
//                    icon: 'warning',
//                    showCancelButton: true,
//                    confirmButtonText: 'Sí, eliminar',
//                    cancelButtonText: 'Cancelar',
//                }).then(async (result) => {
//                    if (result.isConfirmed) {
//                        try {
//                            const response = await fetch(`${CONFIG.API_URL}/comentarios/${id}`, {
//                                method: "DELETE",
//                                headers: {
//                                    "Authorization": `Bearer ${obtenerToken()}`, // Enviar el token
//                                },
//                            });
//                            if (response.ok) {
//                                Swal.fire('¡Eliminado!', 'El comentario ha sido eliminado.', 'success');
//                                comentarioDiv.remove();
//                            } else {
//                                mostrarMensaje("Error al eliminar el comentario", "error");
//                            }
//                        } catch (error) {
//                            console.log("Error al eliminar el comentario", error);
//                        }
//                    }
//                });
//            });
//        }
//          //contenedor de respuestas
       
//          const contenedorRespuestas = document.createElement('div');
//          contenedorRespuestas.classList.add('contenedor-respuestas');

//          //Estructura final del comentario
//          comentarioDiv.appendChild(fechaDiv);
//          comentarioDiv.appendChild(autorDiv);
//          comentarioDiv.appendChild(textoDiv);
//          comentarioDiv.appendChild(contenedorRespuestas);
//          comentarioDiv.appendChild(accionesDiv);
//          //insertar al principio de la lista

//          listaComentarios.prepend(comentarioDiv);
   
//          //Evento para responder

//          responderLink.addEventListener("click", async ()=> {
//            //Evitar crear multiples contenedores de respuesta
//            if (comentarioDiv.querySelector(".respuestas")) return;

//            //crear contenedor para la respuesta 
//            const respuestaDiv = document.createElement('div');
//            respuestaDiv.classList.add('respuestas');

//            const textAreaRes = document.createElement('textarea');
//            textAreaRes.classList.add('respuesta-texto');
//            textAreaRes.placeholder = "Ingresa tu respuesta";

//            const botonCancelar = document.createElement('button');
//            botonCancelar.classList.add('boton-cancelar');
//            botonCancelar.textContent= "Cancelar";

//            const botonPublicar = document.createElement('button');
//            botonPublicar.classList.add('boton-publicar');
//            botonPublicar.textContent = "Publicar";

//            //agregar los elementos al contenedor de respuesta
//            respuestaDiv.appendChild(textAreaRes);
//            respuestaDiv.appendChild(botonCancelar);
//            respuestaDiv.appendChild(botonPublicar);
//            comentarioDiv.appendChild(respuestaDiv);

//            //Evento para cancelar la respuesta
//            botonCancelar.addEventListener("click", async () => {
//                respuestaDiv.remove();
//                comentarioDiv.scrollIntoView({behavior: 'smooth'});
   
//            });

//            //  Evento para publicar la respuesta
//            botonPublicar.addEventListener("click", async () => {

//                if (!usuarioAutenticado()) {
//                    mostrarMensaje("¡Debes iniciar sesion para dejar tu comentario!", "error");
//                    return;
//                }
//                const datosUsuarios = obtenerDatosUsuarioToken();
               
//                if(!datosUsuarios){
//                    mostrarMensaje("No se pudieron obtener tus datos. Inicia sesion nuevamente.", "error");
//                    return;
//                }
//                const {nombre,  apellido} = datosUsuarios;
   
//                const textoRespuesta = respuestaDiv.querySelector(".respuesta-texto").value.trim();
   
//                if (!textoRespuesta) {
//                    mostrarMensaje("¡La respuesta no puede estar vacia!",'error');
//                    return;
//                }
//                const respuesta = {
//                    texto: textoRespuesta,
//                    nombre: nombre,
//                    apellido: apellido
   
//                };
//                try {
//                    const response = await postData(`${CONFIG.API_URL}/comentarios/${id}/respuestas`,respuesta);
//                    if (response.ok) {
//                        agregarRespuesta(id, textoRespuesta,nombre, apellido);
//                        respuestaDiv.remove();
//                    } else {
//                        mostrarMensaje("¡Error al publicar la respuesta!",'error');
//                    }
   
//                } catch (error) {
//                        console.log("Error al publicar la respuesta", error);
//                }
//            });
//        });
//    };
   
//    //verificar si el usuario tiene rol de admin
//    const usuarioEsAdmin = () => {

//        const token = obtenerToken();
//        if (!token) {
//            return false;
//        }
//        try {
//            const decodificarToken = jwt_decode(token);
//            return  decodificarToken && decodificarToken.role === "admin";
//        } catch (error) {
//            console.log("Error al decodificar el token", error);
//            return false;
//        }

//    };

// //agregar una respuesta a un comentario
// const agregarRespuesta = (comentarioId, texto,nombreUsuario, apellidoUsuario ) => { 

//        const comentarioDiv = document.querySelector(`[data-id="${comentarioId}"]`);

//        if (comentarioDiv) {
//            //verifica si ya existe un contenedor de respuestas, si no, lo crea
//            let contenedorRespuesta = comentarioDiv.querySelector(".contenedor-respuestas");
//            if(!contenedorRespuesta) {
//                contenedorRespuesta = document.createElement("div");
//                contenedorRespuesta.classList.add("contenedor-respuestas");
//                comentarioDiv.appendChild(contenedorRespuesta);
//            }

//            //Evitar duplicados
           
//            if (![...contenedorRespuesta.children].some(el => el.textContent === texto)) {
              
//                const respuestaMostrada = document.createElement("div");
               
//                respuestaMostrada.classList.add("respuesta-mostrada");
//                respuestaMostrada.textContent = `${nombreUsuario} ${apellidoUsuario} : ${texto}`;

//                contenedorRespuesta.appendChild(respuestaMostrada);
//            }
//        }
// };






// //utilidades

// const mostrarElemento = (elemento) => {
//    if (elemento) {
//        elemento.style.display = "block";
//        setTimeout(()=> elemento.classList.add("mostrar"),10);
//    }
// };

// const ocultarElemento = (elemento) => {
//    if (elemento) {
//        elemento.style.display= "none";
//        elemento.classList.remove("mostrar"); 
//    }
// };

// const limpiarFormulario = () => {
//    document.querySelectorAll("form input, form textarea").forEach((el) => (el.value = "")); 
//    document.querySelectorAll("form select").forEach((el) => {
//        el.selectedIndex =0; //rReestablece el combobox a la primera opcion
//    });
// };

// //Obtener los datos del formulario
// const obtenerDatosFormulario = () => {

//    return{
//        nombre:   document.getElementById("nombre").value.trim(),
//        apellido: document.getElementById("apellido").value.trim(),
//        edad:     parseInt(document.getElementById("edad").value),
//        telefono: parseInt(document.getElementById("telefono").value),
//        email:    document.getElementById("email2").value.trim(),
//        servicio: document.querySelector(".opciones").value,
//        motivoConsulta: document.getElementById("comentario-consulta").value.trim(),
//    };
// };


// //Validacion de correo
// const validarCorreo = (email) => {
//    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//    return regex.test(email);
// };
// //validacion de contraseña
// const validarContraseña = (contraseña) => {
//    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
//    return regex.test(contraseña);
// };

// //Validacion del formulario
// const validarFormulario = (reserva)  => {
//    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Permite letras y espacios
//    const errores = []; 

//    //funcion para resaltar el campo en rojo si es invalido

//    const resaltarError = (idCampo, mensaje, idError)  => {
//        const campo = document.getElementById(idCampo);
//        const errorMensaje = document.getElementById(idError);
//        if(campo){
//            campo.classList.add('err');
//            errores.push(mensaje);
//            if(errorMensaje){
//            errorMensaje.textContent = mensaje;
//            } 
//        }
//    };
//      // Limpiar mensajes de error anteriores
//      document.querySelectorAll('.error-msg').forEach((mensaje) => {
//        mensaje.textContent = '';
//    });
//          // Limpiar los errores al corregir los campos
//    document.querySelectorAll('#formReserva input, #formReserva select, #formReserva textarea').forEach((campo) => { 
//    campo.addEventListener('input', () => {
//        campo.classList.remove('err');
//        const errorMensaje = document.getElementById(`error-${campo.id}`);
//        if(errorMensaje){
//           errorMensaje.textContent = '';
//        }
//    });
// });
//    //validaciones
   
//    if(!reserva.nombre || !soloLetras.test(reserva.nombre)){
//        resaltarError("nombre","¡El NOMBRE es obligatorio y solo puede contener letras.!","error-nombre");
//    }
//    if(!reserva.apellido || !soloLetras.test(reserva.apellido)){
//        resaltarError("apellido","¡El APELLIDO es obligatorio y solo puede contener letras.!","error-apellido");
//    }
//    if(!reserva.edad || isNaN(reserva.edad) || reserva.edad <0 || reserva.edad > 120 || reserva.edad % 1 !== 0){
//        resaltarError("edad","¡La EDAD es obligatoria, valida entre 0 y 120 años.!","error-edad");
//    }
//    if(!reserva.telefono || isNaN(reserva.telefono) || reserva.telefono.toString().length < 9){
//        resaltarError("telefono", "¡El TELEFONO es obligatorio, válido (máximo 9 dígitos numéricos) Ej: 999999999 .!","error-telefono");
//    }
//    if(!validarCorreo(reserva.email)){
//        resaltarError("email2", "¡Ingrese un CORREO electronico valido.!","error-email2")
//    }
//    if(reserva.servicio === "Seleccione_un_servicio"){
//        resaltarError("servicioCombo","¡Debe seleccionar un servicio.!","error-servicioCombo");
//    }
//    if (!reserva.motivoConsulta || !soloLetras.test(reserva.motivoConsulta) || reserva.motivoConsulta.length > 250) {
   
//        resaltarError("comentario-consulta", "¡Debe escribir un motivo de consulta, Maximo 250 caracteres.!","error-motivoConsulta");
//    }
//    return errores.length === 0;
 
// };

// //validar cantidad de caracteres para el campo motivo de la consulta
// const campoMotivoConsulta = document.getElementById('comentario-consulta');
// const maxCaracteres = 250;
// const contadorCaracteres = document.getElementById('contador-caracteres');
// const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Permite letras y espacios

// //agregar un evento input para validar en tiempo real
// if (campoMotivoConsulta) {
//    campoMotivoConsulta.addEventListener('input', () => {
//        const mensajeError = document.getElementById('error-motivoConsulta');
      
//         //actualiza el contador de caracteres
//         const caracteresActuales = campoMotivoConsulta.value.length;
//         contadorCaracteres.textContent = `${caracteresActuales}/${maxCaracteres}`;
//         //Limpia el mensaje de error si existe
//         if (mensajeError) {
//            mensajeError.textContent = '';
//            campoMotivoConsulta.classList.remove('err');
//         }
//         //validacion longitud y caracteres permitidos
//         if (caracteresActuales > maxCaracteres) {
//               campoMotivoConsulta.value = campoMotivoConsulta.value.substring(0, maxCaracteres); //trunca el texto
//               contadorCaracteres.textContent = `${maxCaracteres}/${maxCaracteres}`;
//         }else if(!soloLetras.test(campoMotivoConsulta.value)){
//               if (mensajeError) {
//                   mensajeError.textContent = '¡El motivo solo puede contener letras y espacios!';
//               }
//               campoMotivoConsulta.classList.add('err');
//         } 
//       });
// }

// const urlParams = new URLSearchParams(window.location.search);
// const token = urlParams.get('token');
// console.log('Token recibido: ', token);


// if (token) {
//    const contenidoPrincipal = document.getElementById('contenido-principal');
//    const formularioAcceso = document.getElementById('formulario-acceso');
//    const formularioRestablecerClave = document.getElementById('formulario-reestablecerClave');

//    if (contenidoPrincipal) contenidoPrincipal.style.display='none';
//    if (formularioAcceso) formularioAcceso.style.display='none'; 
       
//    //mostrar formulario de restablecimiento de contraseña si existe
//    if(formularioRestablecerClave) formularioRestablecerClave.style.display="block";

// }
// const formularioRestablecerClave = document.getElementById('formulario-reestablecerClave');
// if (formularioRestablecerClave) {
//    formularioRestablecerClave.classList.add('mostrar');
//    console.log('Clase "mostrar" agregada al formualrio de restablecer clave.');
// } else {
//    console.error('El formulario de restablecer clave no existe.');
// }


// //logica para recuperacion de contraseña
// const botonRecuperarClave = document.getElementById('recuperar-clave');
// if (botonRecuperarClave) {
//    botonRecuperarClave.addEventListener('click',async (e) => {
//        e.preventDefault();
            
//            const correo = document.getElementById('correo-recuperar').value;
//            if (!correo) {
//                mostrarMensaje('¡Por favor, ingrese su correo electronico!','error');
//                return;
//            }
//            if (!validarCorreo(correo)){
//                mostrarMensaje('¡Correo electronico no valido!', 'error');
//                return;
//            }

//            try {
//                const response = await postData(`${CONFIG.API_URL}/recuperar-clave`, { correo });
//                const data = await  response.json();
       
//                if (response.ok) {
//                    mostrarMensaje('¡Correo enviado correctamente. Revisa tu bandeja de entrada.!','exito');
                   
//                } else {
//                    mostrarMensaje(data.message || '¡Error al enviar el correo de recuperacion!', 'error');
//                }
//            } catch (error) {
//                console.log('Error al enviar la solicitud de recuperacion', error);
//                mostrarMensaje('Error al conectarse al servidor', 'error');
//            }
//        });
// }





// //logica para restablecer contraseña
// const botonRestablecerClave = document.getElementById('restablecer-clave');
// if (botonRestablecerClave) {
//    botonRestablecerClave.addEventListener('click', async(e) => {
//        e.preventDefault();
   
//        const nuevaContraseña = document.getElementById('nueva-contraseña').value;
//        const confirmarNuevaContraseña = document.getElementById('confirmar-nueva-contraseña').value;
//        const token = new URLSearchParams(window.location.search).get('token');
 
//        console.log('Token en el evento de restablecimiento:', token);

//        if (!nuevaContraseña || !confirmarNuevaContraseña) {
//            mostrarMensaje('!Por favor completar todos los campos¡','error');
//            return;
//        }
//        if (!validarContraseña(nuevaContraseña)) {
//            mostrarMensaje('¡La contraseña debe tener al menos 8 caracteres, una letra y un número!', 'error');
//            return;
//        }
//        if (nuevaContraseña !== confirmarNuevaContraseña) {
//            mostrarMensaje('!Las contraseñas no coinciden¡','error');
//            return;
//        }
//        if (!token) {
//            mostrarMensaje('¡Token no válido o faltante!', 'error');
//            return;
//        }
   
//        console.log('Datos enviados:', { nuevaContraseña, token });
   
//        try {
//            const response = await postData(`${CONFIG.API_URL}/restablecer-clave`,{nuevaContraseña,token});
//            const data = await response.json();
//            console.log('Respuesta del servidor:', data);
//            if (response.ok) {
//                mostrarMensaje('¡Contraseña restablecida correctamente.!','exito');
//                setTimeout(() => {
//                    window.location.href = 'indexPsicologia.html';
//                },2000);
//            } else {
//                mostrarMensaje(data.message || '¡Error al restablecer la contraseña.!','error');
//            }
//        } catch (error) {
//            console.log('Error al restablecer contraseña', error);
//            mostrarMensaje('¡Error al conectarse al servidor!', 'error');
//        }
//    }); 
// }
//  mostrarOcultarContraseña('nueva-contraseña','toggle-passwordRestablecer');
//  mostrarOcultarContraseña('confirmar-nueva-contraseña','toggle-passwordRestablecerConfirm');




// //funcion ocultar y mostrar la contraseña






// //mostrar mesnsaje con estilo
// const mostrarMensaje = (mensaje,tipo) => {

//    const mensajeDiv = document.createElement("div");
//    mensajeDiv.textContent = mensaje;
//    mensajeDiv.classList.add("mensaje",tipo); //tipo 'exito' o 'error'
//    // agregalo al DOM
//    document.body.appendChild(mensajeDiv);
//    //mostrar mensaje con una animacion
//    setTimeout(() => mensajeDiv.classList.add('mostrar'),10);
//   //Ocultar y eliminar el mensaje despues de 5 segundos
//    setTimeout(() => {
//       mensajeDiv.classList.remove('mostrar');
//       setTimeout(() => mensajeDiv.remove(), 300); //espera a que termine la transision
//   },5000);

// };
// //configurar cierre automatico de la sesion

// const configurarCierreSesionAutomatico = () => {
    
//    const token = obtenerToken();
//    if(!token) return;

//    try {
//        const decodificarToken = jwt_decode(token);
//        const expiracion = decodificarToken.exp*1000;  //convertir en milisegundos
//        const tiempoRestante = expiracion - Date.now(); //diferencia entre expiracion y el tiempo actual

//        if (tiempoRestante>0) {
//            console.log(`Cierre de sesion en: ${tiempoRestante/1000} segundos`);

//            setTimeout(() => {
//                localStorage.removeItem("token"); //eliminar el token
               
//                mostrarMensaje("¡Sesion expirada. Inicia sesion nuevamente.!","error");
           
//                setTimeout(() =>{
//                    window.location.href = "indexPsicologia.html"; //redigir a la pagina de inicio
//                },2000);
   
       
//            }, tiempoRestante);
         
//        } else {
//            localStorage.removeItem("token");
//            window.location.href = "indexPsicologia.html";
         
//        }

//    } catch (error) {
//        console.log("Error al decodificar token: ", error);
//        localStorage.removeItem("token");
//        window.location.href = "indexPsicologia.html";
//    }
// };


// function abrirWhatsapp(){
//    const numero = "56988943105";
//    const mensaje = "Hola, me gustaria reservar una hora";
//    const url =  `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
//    window.open(url, "_blank");
// }

// //selecciona el boton
// const btnVolverArriba = document.getElementById('btn-volver-arriba');
// let scrollTimeout; //manejar el temporizador
// //detecta el dezplazamiento del usuario
// window.addEventListener('scroll', () => {
//    //muestra el boton si el usuario ha hecho scroll hacia abajo
//    if (window.scrollY > 200) {
//        btnVolverArriba.classList.add('visible');
       
//    }else{
//        btnVolverArriba.classList.remove('visible');
//    }
//    clearTimeout(scrollTimeout);
//    scrollTimeout = setTimeout(() => {
//        btnVolverArriba.classList.remove('visible');
//    }, 2000);

// });
// //vuelve al inicio al hacer clic en el boton
// btnVolverArriba.addEventListener('click', () => {
//    window.scrollTo({
//        top: 0,
//        behavior: 'smooth' // Desplazamiento suave
//    });
// });
// const toggleButton = document.getElementById('toggle-biografia');
// const textoCorto = document.querySelector('.texto-corto');
// const textoCompleto = document.querySelector('.texto-completo');

// toggleButton.addEventListener('click', () => {
//     if (textoCompleto.style.display === 'none') {
        
//        textoCompleto.style.display = 'block';
//         textoCorto.style.display = 'none';
//         toggleButton.textContent = 'Leer menos';
//     } else {
       
//        textoCompleto.style.display = 'none';
//         textoCorto.style.display = 'block';
//         toggleButton.textContent = 'Seguir leyendo';
//     }
// });


// // Asegúrate de que la función esté disponible globalmente
// window.abrirWhatsapp = abrirWhatsapp;



// if (usuarioAutenticado()) {
//   configurarCierreSesionAutomatico();
// }

// obtenerComentarios();

});
