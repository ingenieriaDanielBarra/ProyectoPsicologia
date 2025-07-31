//Este mmodulo maneja el inicio de sesion  y el registro de usuarios
import {CONFIG} from './config.js';
import {postData, validarCorreo, validarContraseña,mostrarElemento,ocultarElemento,limpiarFormulario,obtenerToken} from  './utils.js';
import {mostrarMensaje} from './ui.js';


export const configurarRegistroUsuario = () => {
   
    const botonCrearUsuario = document.getElementById('crear-usuario');
    if (botonCrearUsuario) {
    botonCrearUsuario.addEventListener('click', async(e) =>  { 
        e.preventDefault();
        
            //obtener los valores ingresados
            const nombre     = document.getElementById("nombrePaciente").value;
            const apellido   = document.getElementById("apellidoPaciente").value;
            const correo     = document.getElementById("email").value;
            const contraseña = document.getElementById("password").value;
            const confirmarContraseña = document.getElementById("confirmPassword").value;
            
            //validacion simple con el cliente
        
            if (!nombre || !apellido || !correo || !contraseña || !confirmarContraseña) {
                mostrarMensaje("¡Por favor, Completa todos los campos!.",'error');
                return;
            }
            if(!validarCorreo(correo)){
                mostrarMensaje("¡Correo electronico no válido!.", 'error');
                return;
            }
            if(!validarContraseña(contraseña)){
                mostrarMensaje("¡La contraseña debe tener al menos 8 caracteres, una letra y un número!.", 'error');
                return;
            }
            if (contraseña !== confirmarContraseña) {
                mostrarMensaje("¡Las contraseñas no coinciden!.", 'error');
                return;  
            }
        
            const credenciales = { nombre:nombre, apellido:apellido, correo:correo, contraseña:contraseña, confirmarContraseña:confirmarContraseña};
            console.log(credenciales);
            //Enviar solicitud al servidor
            try {
                const response = await postData(`${CONFIG.API_URL}/usuarios`,credenciales);
                console.log(response);
                const data = await response.json();
                console.log(data);
                if (response.ok) {
        
                    mostrarMensaje('¡Usuario creado correctamente. Favor verifica tu correo!.','exito');
                    limpiarFormulario();
                    
                    ocultarElemento(document.getElementById("formulario-creacionUsuario"));
                    mostrarElemento(document.getElementById("formulario-acceso"));

                    //Enviar correo de verificación
                    await postData(`${CONFIG.API_URL}/enviar-verificacion-correo`, {correo: correo});

                   
                }else{
                    mostrarMensaje(data.message || '¡Error al iniciar sesión!.','error');
                }
            } catch (error) {
                    mostrarMensaje(`¡Error al crear usuario: ${error.message}!.`, 'error');
            }
        
        });
}
};



   //manejo acceso a login
export const configurarInicioSesion = () => {
    const botonInicioSesion = document.getElementById('inicio-sesion');
 if (botonInicioSesion) {
    botonInicioSesion.addEventListener('click', async(e) => {
        e.preventDefault();
        
            //obtener los datos del formulario
            const correo = document.getElementById('correo').value;
            const contraseña = document.getElementById('contraseña').value;
        
            if(!validarCorreo(correo)){
                mostrarMensaje('¡Correo electrónico no válido!.', 'error');
                return;
            }
    
            const credencialesLogin = {correo: correo, contraseña:contraseña};
            console.log(credencialesLogin);
            try {
                 //enviar solicitud al servidor
                 const response = await postData(`${CONFIG.API_URL}/login`,credencialesLogin);
                 console.log(response);
                 const data = await response.json();
                 console.log(data);
                 if (response.ok) {
        
                    localStorage.setItem('token', data.token);
        
                    mostrarMensaje('¡Inicio de sesión exitoso!.', 'exito');
        
                    //desabilitar el boton de inicio de sesion
                     const botonSesion = document.getElementById('icon-sesion');
                     botonSesion.classList.add('sesion-iniciada');
                     botonSesion.removeAttribute("href");                                       
                     
                    setTimeout(() => {
                        window.location.href= 'indexPsicologia.html';
                    }, 2000);
                  
                 }else{
                      mostrarMensaje(data.message || '¡Error al iniciar sesión!.' , 'error');  
                 }
        
            } catch (error) {
                 console.log('¡Error en la comunicación con el el servidor!.: ', error);
                 mostrarMensaje('¡Error al conectarse al servidor!.', 'error');
            }
        
        });
    }
};

//validar si el usuario esta autenticado

export const usuarioAutenticado = () => {
    const token = obtenerToken();
    if (!token) {
        return false;
    }
    try {
        const decodificarToken = jwt_decode(token);
        const expiracion = new Date(decodificarToken.exp*1000);
        return expiracion > new Date(); //verificar si el token no esta expirado
    } catch (error) {
        console.log("Token invalido o no se pudo decodificar", error);
        return false;
    }
};

//logica para recuperacion de contraseña

export const configurarRecuperacionClave = () => {
    const botonRecuperarClave = document.getElementById('recuperar-clave');
    if (botonRecuperarClave) {
        botonRecuperarClave.addEventListener('click',async (e) => {
            e.preventDefault();
                 
                const correo = document.getElementById('correo-recuperar').value;
                if (!correo) {
                    mostrarMensaje('¡Por favor, ingrese su correo electrónico!.','error');
                    return;
                }
                if (!validarCorreo(correo)){
                    mostrarMensaje('¡Correo electrónico no válido!.', 'error');
                    return;
                }
    
                try {
                    const response = await postData(`${CONFIG.API_URL}/recuperar-clave`, { correo });
                    const data = await  response.json();
            
                    if (response.ok) {
                        mostrarMensaje('¡Correo envíado correctamente. Revisa tu bandeja de entrada!.','exito');
                        
                    } else {
                        mostrarMensaje(data.message || '¡Error al enviar el correo de recuperación!.', 'error');
                    }
                } catch (error) {
                    console.log('Error al enviar la solicitud de recuperación', error);
                    mostrarMensaje('¡Error al conectarse al servidor!.', 'error');
                }
            });
    };
};

// se obtiene el toknen de la url
export const obtenerTokenDesdeURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token recibido: ', token);
    return token;
};



//logica para restablecer contraseña
export const configurarRestablecimientoClave = () => {

    const botonRestablecderClave = document.getElementById('restablecer-clave');
    if (botonRestablecderClave) {
        botonRestablecderClave.addEventListener('click', async(e) => {
            e.preventDefault();
        
            const nuevaContraseña = document.getElementById('nueva-contraseña').value;
            const confirmarNuevaContraseña = document.getElementById('confirmar-nueva-contraseña').value;
            const token = new URLSearchParams(window.location.search).get('token');
            console.log('Token en el evento de restablecimiento:', token);
    
            if (!nuevaContraseña || !confirmarNuevaContraseña) {
                mostrarMensaje('¡Por favor completar todos los campos!.','error');
                return;
            }
            if (!validarContraseña(nuevaContraseña)) {
                mostrarMensaje('¡La contraseña debe tener al menos 8 caracteres, una letra y un número!.', 'error');
                return;
            }
            if (nuevaContraseña !== confirmarNuevaContraseña) {
                mostrarMensaje('¡Las contraseñas no coinciden!.','error');
                return;
            }
            if (!token) {
                mostrarMensaje('¡Token no válido o faltante!.', 'error');
                return;
            }
        
            console.log('Datos enviados:', { nuevaContraseña, token });
        
            try {
                const response = await postData(`${CONFIG.API_URL}/restablecer-clave`,{nuevaContraseña,token});
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                if (response.ok) {
                    mostrarMensaje('¡Contraseña restablecida correctamente!.','exito');
                    setTimeout(() => {
                        window.location.href = 'indexPsicologia.html';
                    },2000);
                } else {
                    mostrarMensaje(data.message || '¡Error al restablecer la contraseña!.','error');
                }
            } catch (error) {
                console.log('Error al restablecer contraseña', error);
                mostrarMensaje('¡Error al conectarse al servidor!.', 'error');
            }
        }); 
    }
};



//configurar cierre automatico de la sesion

export const configurarCierreSesionAutomatico = () => {
     
    const token = obtenerToken();
    if(!token) return;

    try {
        const decodificarToken = jwt_decode(token);
        const expiracion = decodificarToken.exp*1000;  //convertir en milisegundos
        const tiempoRestante = expiracion - Date.now(); //diferencia entre expiracion y el tiempo actual

        if (tiempoRestante>0) {
            console.log(`Cierre de sesion en: ${tiempoRestante/1000} segundos`);

            setTimeout(() => {
                localStorage.removeItem("token"); //eliminar el token
                
                mostrarMensaje("¡Sesión expirada. Inicia sesión nuevamente!.","error");
            
                setTimeout(() =>{
                    window.location.href = "indexPsicologia.html"; //redigir a la pagina de inicio
                },2000);
    
        
            }, tiempoRestante);
          
        } else {
            localStorage.removeItem("token");
            window.location.href = "indexPsicologia.html";
          
        }

    } catch (error) {
        console.log("Error al decodificar token: ", error);
        localStorage.removeItem("token");
        window.location.href = "indexPsicologia.html";
    }
};