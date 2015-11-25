/*
Componente javascript que crea un dialogo

Incluir:

	js/drag_and_drop.js
	js/funciones_de_posicionamiento.js

*/
//Arreglo en donde mantengo los carteles
var _displayList = new Array();

var imagenAdvertencia = "/horus_fe/img/comun/advertencia.png";
var imagenError = "/horus_fe/img/comun/error.png";
var imagenInfo = "/horus_fe/img/comun/info.png";


function validarRespuesta(ok,mensaje){
	if(eval(ok)){
      mostrarCartel('Informacion',imagenInfo,mensaje);
	}else{
	   mostrarCartel('Error',imagenError,mensaje);
	}

} 

//Elimina el cartel
function limpiarCartel(){
	var cartel = document.getElementById("cartel");
	cartel.parentNode.removeChild(cartel);
}

//Dado un elemento DIV lo muestra con formato de dialogo
function mostrarDiv(titulo, div){
	div.style.display= "block";

	return _armarCartel(titulo, div);
	
}

//Dado un titulo, una imagen y un mensaje, se arma un cartel con un boton de cerrar
function mostrarCartel(titulo,srcImg,mensaje, conBoton){

	var divCartel = document.createElement("div");
	divCartel.setAttribute("class","divCartel");
	
	var imagen = document.createElement("img");
    imagen.setAttribute("src",srcImg);
    imagen.setAttribute("style","margin-right:5px;margin-top:10px;");
    divCartel.appendChild(imagen);
    
    var texto = document.createElement("p");
	texto.innerHTML = mensaje;
	divCartel.appendChild(texto);
	
	if (conBoton==undefined){
		var boton = document.createElement("input");
		boton.setAttribute("type", "button");
		boton.setAttribute("class","btnMensaje");
		boton.setAttribute("value", "Aceptar");
		boton.setAttribute("onclick", "ocultarCartel();");
		divCartel.appendChild(boton);
	}
	
	return _armarCartel(titulo, divCartel);
} 

//Dado un titlo y un contenido, arma un cartel de dialogo
function _armarCartel(titulo, divInterno){
	
	var _id = _displayList.length;
	
	//Div del titulo de la ventana
	var divTitulo = document.createElement("div");
	divTitulo.setAttribute("class","divTitulo");
	divTitulo.appendChild(document.createTextNode(titulo));
 
 	//Div que representa al cartel en si
	var divMensaje =  document.createElement("div");
	divMensaje.setAttribute("class","divMensaje");
	divMensaje.setAttribute("id","divMensaje_"+_id);
	
	//Firefox, Operay Safari
	var z_index_externo=_Z_BASE_DIALOGOS+ (_displayList.length*2);
	var z_index_mensaje=_Z_BASE_DIALOGOS+ (_displayList.length*2) + 1;
	
	divMensaje.setAttribute("style", "z-index:"+z_index_mensaje+"; -moz-box-shadow: 17px 23px 19px rgb(221, 221, 221);box-shadow: 17px 23px 19px rgb(221, 221, 221);-webkit-box-shadow: 17px 23px 19px rgb(221, 221, 221);");
 	
	hacerloMovible(divMensaje, divTitulo);
	
	divMensaje.appendChild(divTitulo);
	divMensaje.appendChild(divInterno);
	
	//Div opaco
	var divExterno =  document.createElement("div");
	divExterno.setAttribute("class","divExterno");
	divExterno.setAttribute("style", "height:"+screen.availHeight+"px; z-index:"+z_index_externo+";");
	
	//Creo el div que contiene tanto al cartel como a la capa opaca y le asigno un ID unico
	var divContenedor =  document.createElement("div");
	
	divContenedor.id = "cartel_"+_id;
		
	divContenedor.appendChild(divMensaje);
	divContenedor.appendChild(divExterno);
	
	document.body.appendChild(divContenedor);
	
	_displayList.push(divContenedor);
	
	//Devuelvo el cartel mostrado
	return divContenedor;
}

//Oculta todos los carteles
function ocultarTodos(){
	
	for (var indexDisplayList=0; indexDisplayList <= _displayList.length; indexDisplayList++){
		ocultarCartel(true);
	}
	
}

//Oculto el cartel
function ocultarCartel(guardar){
	
	//Recupero el ultimo abierto
	var div = _displayList.pop();
	
	//Lo quito de la vista
	div.parentNode.removeChild(div);
	
	//Reseteo el DND
	limpiarMovible();
	
	if (guardar){
		//Si tengo que salvar el cartel, lo agrego oculto al body
		div.style.display = 'none';
		document.body.appendChild(div);
	}
	
	
	//Devuelvo el div quitado
	return div;
}