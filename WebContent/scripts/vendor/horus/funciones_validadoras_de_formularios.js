//Devuelve TRUE si el valor es valido
//Tipos de validacion: "sinNumeros", "fechaNacimiento", "presencia", "documento", "cuit", "eMail", "telefono", "soloNumeros", "precio", "fecha", "palabra"
//Ejecuta la validacion establecida en el atributo "validacion"
function ejecutarValidacion(validacion, valor){
	if (validacion=="sinNumeros") return validarSinNumeros(valor);
	else
		if (validacion=="fechaNacimiento")	return validarFechaNacimiento(valor);
		else 
			if (validacion=="presencia")	return estaPresente(valor);
			else
				if (validacion=="documento")	return validarDocumento(valor);
				else
					if (validacion=="cuit") 	return validarCuit(valor);
					else
						if (validacion=="eMail")	return validarEmail(valor);
						else
							if (validacion=="telefono")	return validarTelefono(valor);
							else
								if (validacion=="soloNumeros")	return validarSoloNumeros(valor);
								else
									if (validacion=="fecha")return validarFecha(valor);
									else
										if (validacion=="precio")return validarPrecio(valor);
										else
											if (validacion=="hora")return validarHora(valor);
											else
												if (validacion=="palabra")return validarPalabra(valor);
}
	
function validarCampo(id){
	var validacion 	= nodoDiv.getAttribute("validacion");
	var valor 		= nodoDiv.getAttribute(id);
	
	return ejecutarValidacion(validacion, valor);
}
	
//Validador de direcciones de mail
function validarEmail(valor){
	//Si ingreso algun texto y es requerido lo valido
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "Direcci\u00F3n de e-mail incorrecta";
	
	return validacion;
}

//Validador de campos que NO deberian tener numeros
function validarSinNumeros(valor){
	//Si ingreso algun texto y es requerido lo valido
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = /^[\D]+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "No se permiten n\u00FAmeros";
	
	return validacion;
}

//Validador de campos que deberian tener SOLO numeros
function validarSoloNumeros(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado =  /^[\d]+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "S\u00F3lo se permiten n\u00FAmeros";
	
	return validacion;
}

//Validador de documentos
function validarDocumento(valor){
	//Si ingreso algun texto y es requerido lo valido
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = /^\d{3,8}$/.test(valor) || /^P[\d]+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "Nro de documento inv\u00E1lido";
	
	return validacion;
}

//Validador de documentos
function validarCuit(valor){
	//Si ingreso algun texto y es requerido lo valido
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = /^\d{3,11}$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "Nro de CUIT inv\u00E1lido";
	
	return validacion;
}

//Validador de telefonos
function validarTelefono(valor){
	//Si ingreso algun texto y es requerido lo valido
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = /^[0-9\s-()]+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "Tel\u00E9fono inv\u00E1lido";
	
	return validacion;
}

//Validador de fechas 
function validarFecha(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0 ){
		if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)){
			
			try{
				var dia   = parseInt( valor.slice(0,2) );
				var mes   = parseInt( valor.slice(3,5) );
				var anio  = parseInt( valor.slice(6)   );
			
				validacion.resultado = (dia<32) && (mes<13) && (anio>0);
				
				if (!validacion.resultado)
					validacion.mensaje = "Fecha inv\u00E1lida";
			}catch(e){
				validacion.resultado = false;
				validacion.mensaje = "Fecha inv\u00E1lida";
			}
			
		}else{
			validacion.resultado = false;
			validacion.mensaje = "Formato de fecha inv\u00E1lido";
		}
	}
	
	return validacion;
}

//Validador de hora
function validarHora(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0 ){
		if (/^\d{2}\:\d{2}$/.test(valor)){
			try{
				var hora   = parseInt(valor.slice(0,2));
				var min   = parseInt(valor.slice(3,5));
				validacion.resultado = (hora>=0) && (hora<=23) && ((min == 0) || (min == 30));
				
				if (!validacion.resultado)
					validacion.mensaje = "Hora inv\u00E1lida";
			}catch(e){
				validacion.resultado = false;
				validacion.mensaje = "Formato de hora inv\u00E1lida";
			}
		}else{
			validacion.resultado = false;
			validacion.mensaje = "Hora inv\u00E1lida";
		}
	}
	
	return validacion;
}


//Validador de fechas de nacimiento
function validarFechaNacimiento(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0){
	
		if (validarFecha(valor)){
			var anioActual = parseInt ( (new Date()).getFullYear() );
			
			var anio  = parseInt( valor.slice(6) );
			
			validacion.resultado = (anio>1900) && (anio<=anioActual);
			
			if (!validacion.resultado)
				validacion.mensaje = "Fecha de nacimiento inv\u00E1lida";
			
		} else {
			validacion.resultado = false;
			validacion.mensaje = "Formato de fecha de nacimiento inv\u00E1lida";
		}
	}else{
		validacion.resultado = false;
		validacion.mensaje = "Formato de fecha de nacimiento inv\u00E1lida";
	}
	
	return validacion;
}

//Validador de precios 
function validarPrecio(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado = (/^[\d]+\.\d{1,2}$/.test(valor))|| (/^[\d]+$/.test(valor));
	
	if (!validacion.resultado)
		validacion.mensaje = "Precio inv\u00E1lido (dddd.dd)";
	
	return validacion;
}

//Validador de presencia, si hay algo escrito
function estaPresente(valor){
	return {resultado: valor.length>0, mensaje:"Debe ingresar alg\u00FAn caracter"};
}

//Valida si es una palabra
function validarPalabra(valor){
	var validacion = {resultado: true};
	
	if (valor.length>0 )
		validacion.resultado =  /^[\w]+$/.test(valor);
	
	if (!validacion.resultado)
		validacion.mensaje = "Solo caracteres comunes";
	
	return validacion;
}

//Dado un evento onkeypress ($1), ejecuta la validacion ($2) sobre el caracter ingresado
function limitar(e, validacion, excepciones){
	var resp = false;

	if(window.event){ keynum = e.keyCode;}
	else if(e.which){ keynum = e.which;}
	
	try{
		keychar = String.fromCharCode(keynum);
		if ( /\w/.test(keychar) && !ejecutarValidacion(validacion, keychar).resultado ){
			//Si es un caracter comun y NO pasa la validacion estandar
			if( excepciones.search(keychar)<0 ){
				//Si no esta dentro de las excepciones y es un caracter comun
				e.stopPropagation();
	   			e.preventDefault();
			}
			
		}else if (!/\w/.test(keychar) && excepciones.search(keychar)<0){
			//Si es un simbolo y NO esta dentro de las excepciones, es INvalido
			e.stopPropagation();
   			e.preventDefault();
		}else{
			//Es un caracter normal que cumple o es un simbolo que esta como excepcion
			resp = true;
		}
	}catch(error){}
	
	return resp;
}