import {CONFIG} from './config.js';
//import {mostrarMensaje} from './ui.js';
console.log(CONFIG.API_URL);

import {manejarNavegacion,mostrarOcultarContraseña,configurarToggleBiografia, validarMotivoConsulta, mostrarFormularioRestablecerClave,
    mostrarMensajeBienvenida,deshabilitarBotonSesion,actualizarEstadoComentario,configurarBotonVolverArriba,mostrarMensaje}  from './ui.js';
import {configurarRegistroUsuario,configurarInicioSesion,configurarRecuperacionClave,configurarRestablecimientoClave,usuarioAutenticado,configurarCierreSesionAutomatico} from './autenticacion.js';
import {manejarEnvioReserva} from './reserva.js';
import {manejarEnvioComentario,configurarObtencionComentarios} from './comentario.js';

document.addEventListener('DOMContentLoaded', () => {

const urlParams = new URLSearchParams(window.location.search);
const mensaje = urlParams.get('mensaje');

if (mensaje) {
    mostrarMensaje(mensaje, 'exito');
}



//configuracion de fucionalidades existentes
  mostrarFormularioRestablecerClave();
  configurarRecuperacionClave();
  configurarRestablecimientoClave();
      mostrarOcultarContraseña('nueva-contraseña','toggle-passwordRestablecer');
      mostrarOcultarContraseña('confirmar-nueva-contraseña','toggle-passwordRestablecerConfirm');

  
  mostrarMensajeBienvenida();
  manejarNavegacion();
  //redirigirDesdeServicios();


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


});
