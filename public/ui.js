import { ocultarElemento, mostrarElemento,obtenerDatosUsuarioToken } from "./utils.js";
import {usuarioAutenticado} from "./autenticacion.js";

//Este módulo manejará las interacciones con la interfaz, como mostrar mensajes y alternar contraseñas.

export const manejarNavegacion = () => {

    document.querySelectorAll("nav ul li a, .inicio-sesion a, #formAcceso a").forEach(enlace => {
        enlace.addEventListener("click", function (event) {
            event.preventDefault();
            const destinoID = this.getAttribute("href").substring(1); // Obtiene el ID sin el #
            const contenidoPrincipal = document.getElementById("contenido-principal");
            const formularioReserva = document.getElementById("formulario-reserva");
            const formularioAcceso = document.getElementById("formulario-acceso");
            const formularioCreacionUsuario = document.getElementById("formulario-creacionUsuario");
            const formularioRecuperarClave = document.getElementById("formulario-recuperarClave"); 
    
            ocultarElemento(contenidoPrincipal);
            ocultarElemento(formularioReserva);
            ocultarElemento(formularioAcceso);
            ocultarElemento(formularioCreacionUsuario);
            ocultarElemento(formularioRecuperarClave);
    
            // Si el enlace es "Reservar Hora", muestra el formulario
            if (destinoID === "formulario-reserva") {
                mostrarElemento(formularioReserva);
    
            }else if(destinoID === "formulario-acceso"){
                mostrarElemento(formularioAcceso);
            } 
            else  if(destinoID === "formulario-creacionUsuario"){
                mostrarElemento(formularioCreacionUsuario);
            }
            else  if(destinoID === "formulario-recuperarClave"){
                mostrarElemento(formularioRecuperarClave);
            }
            else{
                mostrarElemento(contenidoPrincipal);
            
    
                // Desplázate a la sección correspondiente
                const destino = document.getElementById(destinoID);
                console.log(destino);
                if (destino) {
                    destino.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
};

//Redireccionar desde la seccion servicios a formulario reserva
// export const redirigirDesdeServicios = () => {
//     document.querySelectorAll("#servicios button").forEach(enlaces => {
//         enlaces.addEventListener('click', () =>{
               
//            const contenidoPrincipal = document.getElementById("contenido-principal");
//            const formularioReserva = document.getElementById("formulario-reserva");
//            const combobox = document.getElementById("servicioCombo");
    
//            ocultarElemento(contenidoPrincipal);
//            mostrarElemento(formularioReserva);
    
//            if (enlaces.id === "agendarAdulto") {
//                combobox.value = "Tratamiento_psicológico_adultos";
//             } else if(enlaces.id === "agendarAdolescente"){
//                 combobox.value = "Tratamiento_psicológico_adolescentes";
//             }
//           });
//     });
    
// };


export const mostrarMensaje = (mensaje,tipo) => {

    const mensajeDiv = document.createElement("div");
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add("mensaje",tipo); //tipo 'exito' o 'error'
    // agregalo al DOM
    document.body.appendChild(mensajeDiv);
    //mostrar mensaje con una animacion
    setTimeout(() => mensajeDiv.classList.add('mostrar'),10);
   //Ocultar y eliminar el mensaje despues de 5 segundos
    setTimeout(() => {
       mensajeDiv.classList.remove('mostrar');
       setTimeout(() => mensajeDiv.remove(), 300); //espera a que termine la transision
   },5000);

};

export const mostrarOcultarContraseña = (idCampoContraseña,idToggleImg) => {

    const contraseñaInput = document.getElementById(idCampoContraseña);
    const toggleImg   = document.getElementById(idToggleImg);

    if (!contraseñaInput || !toggleImg) {
        console.error('No se encontraron los elementos para mostrar/ocultar la contraseña.');
        return;
    }

    toggleImg.addEventListener('click', () => {
        //Alternar el tipo de input entre password y text
        const tipo = contraseñaInput.type === 'password' ? 'text' : 'password';
        contraseñaInput.type = tipo;
        //cambiar la imagen del ojo
        toggleImg.src = tipo === 'password' ? 'Imagenes/ojo-cerrado.png' : 'Imagenes/ojo-abierto.png';
    });

};

export const mostrarMensajeBienvenida = () => {
    if (usuarioAutenticado) {
        const mensajeBienvenida = document.getElementById("mensaje-bienvenida");
        const datosUsuario = obtenerDatosUsuarioToken();
        if (datosUsuario) {
            mensajeBienvenida.textContent = `👋 Bienvenido/a, ${datosUsuario.nombre} ${datosUsuario.apellido}`;
            mensajeBienvenida.style.display = "block";
        }
        else {
            mensajeBienvenida.style.display = "none";
        }
    }
};

export const deshabilitarBotonSesion = () => {
    const botonSesion = document.getElementById('icon-sesion');
    if (usuarioAutenticado()) {
        botonSesion.style.pointerEvents = 'none'; // Deshabilitar clics
        botonSesion.style.opacity = '0.3';
    }
};

    // bloqueo de compoennte
    // funcion para actualizar el estado del formulario de comentarios
     //manajo de envio de comentarios

export const actualizarEstadoComentario = () => {
 
    const comentarioTexto = document.getElementById('comentario-textoo');
    const enviarComentario = document.getElementById('enviar-comentario');
    const respuestaComentario = document.getElementsByClassName('icono-responder');
    
    if (!comentarioTexto || !enviarComentario) {
        console.error("No se encontraron los elementos de comentario");
        return;
    }

    if (!usuarioAutenticado()) {
        comentarioTexto.disabled = true;
        enviarComentario.style.display = "none";
        comentarioTexto.placeholder = "¡inicia sesión para comentar!";
       
        for( let i=0; i<respuestaComentario.length; i++){
            respuestaComentario[i].style.display = "none";
        }

    }else{
        comentarioTexto.disabled =false;
        enviarComentario.style.display = "block";
        comentarioTexto.placeholder = "Escribe un comentario..";

        for( let i=0; i<respuestaComentario.length; i++){
            respuestaComentario[i].style.display = "block";
        }
    }
 }


 export const configurarToggleBiografia = () => {
    
    const toggleButton = document.getElementById('toggle-biografia');
    const textoCorto = document.querySelector('.texto-corto');
    const textoCompleto = document.querySelector('.texto-completo');
   
    toggleButton.addEventListener('click', () => {
        if (textoCompleto.style.display === 'none') {
            
           textoCompleto.style.display = 'block';
            textoCorto.style.display = 'none';
            toggleButton.textContent = 'Leer menos';
        } else {
           
           textoCompleto.style.display = 'none';
            textoCorto.style.display = 'block';
            toggleButton.textContent = 'Seguir leyendo';
        }
    });
 };

 //validar cantidad de caracteres para el campo motivo de la consulta.

export const validarMotivoConsulta = ()  => {
 
    const campoMotivoConsulta = document.getElementById('comentario-consulta');
    const maxCaracteres = 250;
    const contadorCaracteres = document.getElementById('contador-caracteres');
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Permite letras y espacios
    
    //agregar un evento input para validar en tiempo real
    if (campoMotivoConsulta) {
        campoMotivoConsulta.addEventListener('input', () => {
            const mensajeError = document.getElementById('error-motivoConsulta');
           
             //actualiza el contador de caracteres
             const caracteresActuales = campoMotivoConsulta.value.length;
             contadorCaracteres.textContent = `${caracteresActuales}/${maxCaracteres}`;
             //Limpia el mensaje de error si existe
             if (mensajeError) {
                mensajeError.textContent = '';
                campoMotivoConsulta.classList.remove('err');
             }
             //validacion longitud y caracteres permitidos
             if (caracteresActuales > maxCaracteres) {
                   campoMotivoConsulta.value = campoMotivoConsulta.value.substring(0, maxCaracteres); //trunca el texto
                   contadorCaracteres.textContent = `${maxCaracteres}/${maxCaracteres}`;
             }else if(!soloLetras.test(campoMotivoConsulta.value)){
                   if (mensajeError) {
                       mensajeError.textContent = '¡El motivo solo puede contener letras y espacios!';
                   }
                   campoMotivoConsulta.classList.add('err');
             } 
           });
        }
    };



export const mostrarFormularioRestablecerClave = ()  => {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token obtenido de la URL:', token);
    
    if (token) {
        const contenidoPrincipal = document.getElementById('contenido-principal');
        const formularioAcceso = document.getElementById('formulario-acceso');
        const formularioRestablecerClave = document.getElementById('formulario-reestablecerClave');
    
        if (contenidoPrincipal) contenidoPrincipal.style.display='none';
        if (formularioAcceso) formularioAcceso.style.display='none'; 
            
        //mostrar formulario de restablecimiento de contraseña si existe
        if(formularioRestablecerClave) formularioRestablecerClave.style.display="block";
    
    }
    const formularioRestablecerClave = document.getElementById('formulario-reestablecerClave');
    if (formularioRestablecerClave) {
        formularioRestablecerClave.classList.add('mostrar');
        console.log('Clase "mostrar" agregada al formualrio de restablecer clave.');
    } else {
        console.error('El formulario de restablecer clave no existe.');
    }
};

//funcion para personalizar wsp.
export const abrirWhatsapp = () =>{
    const numero = "56988943105";
    const mensaje = "Hola, me gustaria reservar una hora";
    const url =  `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

// Asegúrate de que la función esté disponible globalmente
window.abrirWhatsapp = abrirWhatsapp;

export const configurarBotonVolverArriba = () => {

    const btnVolverArriba = document.getElementById('btn-volver-arriba');
let scrollTimeout; //manejar el temporizador
//detecta el dezplazamiento del usuario
window.addEventListener('scroll', () => {
    //muestra el boton si el usuario ha hecho scroll hacia abajo
    if (window.scrollY > 200) {
        btnVolverArriba.classList.add('visible');
        
    }else{
        btnVolverArriba.classList.remove('visible');
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        btnVolverArriba.classList.remove('visible');
    }, 2000);

});
//vuelve al inicio al hacer clic en el boton
btnVolverArriba.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
    });
});
};