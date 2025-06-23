import { mostrarMensaje } from './ui.js';
import { postData,limpiarFormulario,obtenerDatosFormulario,validarFormulario } from './utils.js';
import { CONFIG } from './config.js';


//manejo de envio de reserva

export const manejarEnvioReserva = () => {
    const botonEnviarReserva = document.getElementById('enviar-formulario');
    if (botonEnviarReserva) {
        botonEnviarReserva.addEventListener('click', async(e) => {
            e.preventDefault();
            const reserva = typeof obtenerDatosFormulario  === "function" ? obtenerDatosFormulario() : {};
        
        
            if (!validarFormulario(reserva)) {
                mostrarMensaje('¡Por favor completa todos los campos correctamente!','error');
                return;
            }
        
           try {
               const response = await postData(`${CONFIG.API_URL}/reservas`, reserva);
               if (response.ok) {
                   mostrarMensaje('¡Reserva enviada correctamente!','exito');
                   limpiarFormulario();
        
                   setTimeout(() => {
                    window.location.href= 'indexPsicologia.html';
                   }, 2000);
                   
               } else {
                   mostrarMensaje('¡Error al enviar la reserva!','error');
               }
           } catch (err) {
               console.log('Error al guardar la reserva', err);
           }
        
        });
    }
  
};

