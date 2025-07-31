//Este módulo manejará funciones genéricas como validaciones y peticiones al servidor.

export const postData = async(url,data)=>{
    try {
      
       const response = await fetch(url,{
           method : 'POST',
           headers: {"Content-type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`, // Token en encabezados
           },
           body   : JSON.stringify(data),
       });
       return response;
   } catch (error) {
       console.log("Error en la comunicacion con el servidor",error);
       throw error;
   }
};


export const mostrarElemento = (elemento) => {
    if (elemento) {
        elemento.style.display = "block";
        setTimeout(()=> elemento.classList.add("mostrar"),10);
    }
};

export const ocultarElemento = (elemento) => {
    if (elemento) {
        elemento.style.display= "none";
        elemento.classList.remove("mostrar"); 
    }
};

export const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validarContraseña = (contraseña) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contraseña);
};

export const obtenerToken = () => {
    return localStorage.getItem("token");
};

export const obtenerDatosUsuarioToken = () => {

    const token = obtenerToken();
    if(!token) return null;
    
    try {
        const decoded = jwt_decode(token);
        
        return {
            nombre: decoded.nombre,
            apellido: decoded.apellido
        };
    } catch (error) {
        console.log("Error al decodificar el token:", error);
        return  null;
    }
};

export const limpiarFormulario = () => {
    document.querySelectorAll("form input, form textarea").forEach((el) => (el.value = "")); 
    document.querySelectorAll("form select").forEach((el) => {
        el.selectedIndex =0; //rReestablece el combobox a la primera opcion
    });
};

//Obtener los datos del formulario
export const obtenerDatosFormulario = () => {

    return{
        nombre:   document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        edad:     parseInt(document.getElementById("edad").value),
        telefono: parseInt(document.getElementById("telefono").value),
        email:    document.getElementById("email2").value.trim(),
        servicio: document.querySelector(".opciones").value,
        motivoConsulta: document.getElementById("comentario-consulta").value.trim(),
    };
};


export const validarFormulario = (reserva)  => {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Permite letras y espacios
    const errores = []; 

    //funcion para resaltar el campo en rojo si es invalido

    const resaltarError = (idCampo, mensaje, idError)  => {
        const campo = document.getElementById(idCampo);
        const errorMensaje = document.getElementById(idError);
        if(campo){
            campo.classList.add('err');
            errores.push(mensaje);
            if(errorMensaje){
            errorMensaje.textContent = mensaje;
            } 
        }
    };
      // Limpiar mensajes de error anteriores
      document.querySelectorAll('.error-msg').forEach((mensaje) => {
        mensaje.textContent = '';
    });
          // Limpiar los errores al corregir los campos
    document.querySelectorAll('#formReserva input, #formReserva select, #formReserva textarea').forEach((campo) => { 
    campo.addEventListener('input', () => {
        campo.classList.remove('err');
        const errorMensaje = document.getElementById(`error-${campo.id}`);
        if(errorMensaje){
           errorMensaje.textContent = '';
        }
    });
 });
    //validaciones
    
    if(!reserva.nombre || !soloLetras.test(reserva.nombre)){
        resaltarError("nombre","¡El NOMBRE es obligatorio y sólo puede contener letras!.","error-nombre");
    }
    if(!reserva.apellido || !soloLetras.test(reserva.apellido)){
        resaltarError("apellido","¡El APELLIDO es obligatorio y sólo puede contener letras!.","error-apellido");
    }
    if(!reserva.edad || isNaN(reserva.edad) || reserva.edad <0 || reserva.edad > 120 || reserva.edad % 1 !== 0){
        resaltarError("edad","¡La EDAD es obligatoria, válida entre 0 y 120 años!.","error-edad");
    }
    if(!reserva.telefono || isNaN(reserva.telefono) || reserva.telefono.toString().length < 9){
        resaltarError("telefono", "¡El TELEFONO es obligatorio, válido (máximo 9 dígitos numéricos) Ej: 999999999 !.","error-telefono");
    }
    if(!validarCorreo(reserva.email)){
        resaltarError("email2", "¡Ingrese un CORREO electrónico válido!.","error-email2")
    }
    if(reserva.servicio === "Seleccione_un_servicio"){
        resaltarError("servicioCombo","¡Debe seleccionar un servicio!.","error-servicioCombo");
    }
    if (!reserva.motivoConsulta || !soloLetras.test(reserva.motivoConsulta) || reserva.motivoConsulta.length > 250) {
    
        resaltarError("comentario-consulta", "¡Debe escribir un motivo de consulta, Máximo 250 caracteres!.","error-motivoConsulta");
    }
    return errores.length === 0;
  
};






