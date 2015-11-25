//Version - 03-06-2014 v9.47 
// Acciones para el manejo del contrato 
function AdminQuirofanosRemoto(){

	this.obtenerCirugiasDeQuirofanoParaUnaFecha = function (strFecha, nroSala, fxSucces, fxError)
	{   //190.191.104.176
		//datos2009.help.org.ar
		//172.20.32.14
		
		var fechaDate = strFecha.split("/");

	    //var urlEspes = "http://172.20.32.247/horus_fe/seam/resource/rest/cirugias/obtenerCirugiasDeQuirofanoParaUnaFecha";
	   var urlEspes = "http://200.41.174.162:8080/rest/api/cirugias/obtenerCirugiasDeQuirofanoParaUnaFecha";

	    urlEspes += "/"+fechaDate[0];
	    urlEspes += "/"+fechaDate[1];
	    urlEspes += "/"+fechaDate[2];
	    urlEspes += "/"+nroSala;
	    
	    var xmlHttp = null;

	    if (window.XDomainRequest){
	        xmlHttp = new XDomainRequest();
	        xmlHttp.open("GET", urlEspes);
	    } else {
	        xmlHttp = new XMLHttpRequest();
	        xmlHttp.open( "GET", urlEspes, false );
	    }

	    xmlHttp.onload = fxSucces; 
	    xmlHttp.onerror  = fxError;

	    xmlHttp.send();
	    
	};

}

var admin_Quirofanos = new AdminQuirofanosRemoto();

var fechaActual;

function obtenerReservas(strFecha){
	
	fechaActual = strFecha;
	
	//Creo las salas vacias
	crearSalas();
	
	//Obtengo la info desde el server
	admin_Quirofanos.obtenerCirugiasDeQuirofanoParaUnaFecha(strFecha, 1, function(progressEvt){
		var target = progressEvt.srcElement || progressEvt.target;
		cargarQuirofano(target.responseText);}, function(err){error(err, 1);});
	admin_Quirofanos.obtenerCirugiasDeQuirofanoParaUnaFecha(strFecha, 2, function(progressEvt){
		var target = progressEvt.srcElement || progressEvt.target;
		cargarQuirofano(target.responseText);}, function(err){ error(err, 2);});
	admin_Quirofanos.obtenerCirugiasDeQuirofanoParaUnaFecha(strFecha, 3, function(progressEvt){
		var target = progressEvt.srcElement || progressEvt.target;
		cargarQuirofano(target.responseText);}, function(err){ error(err, 3);});
	admin_Quirofanos.obtenerCirugiasDeQuirofanoParaUnaFecha(strFecha, 4, function(progressEvt){
		var target = progressEvt.srcElement || progressEvt.target;
		cargarQuirofano(target.responseText);}, function(err){ error(err, 4);});
	admin_Quirofanos.obtenerCirugiasDeQuirofanoParaUnaFecha(strFecha, 5, function(progressEvt){
		var target = progressEvt.srcElement || progressEvt.target;
		cargarQuirofano(target.responseText);}, function(err){ error(err, 5);});
}
function error(err, nroSala){
	
	//console.error("Error al cargar sala "+nroSala);
	//console.error(err);
	
	var respuesta = { ok: true,  quirofanos: {reservas:[]}};
	
	//cargarQuirofano( JSON.stringify(respuesta) );
	cargarQuirofano( dojo.toJson(respuesta) );
}

/*************************************************************************************/
/**         						SALAS											 */
/*************************************************************************************/

var NRO_SALAS =5;

//Crea las grillas de las salas
function crearSalas(){
	
	//Creo el modelo
	for (var i=0; i <=NRO_SALAS; i++){
		crearSala(i);
	}
	
	//Reseteo el contador de quirofanos cargados
	quirofanosCargados = 0;
};

//Crea una sala vacia (MODELO)
function crearSala( nroSala ){
	
	salas[nroSala] = new Array();
	
	for (var i=0; i < 48; i++){
		salas[nroSala][convertirEnHora(i)] = null;
	}
}

//Ordenar x sala
function ordenarPorSala( quirofanos ){
	
	for (var i=0; i < quirofanos.length; i++){
		salas[ parseInt(cirugia.sala) ] = cirugia;
	}
	
}

/*************************************************************************************/
/**         						RESERVAS										 */
/*************************************************************************************/

var quirofanosCargados = 0;
var salas = new Array(); 

var fondos = ["#C6E6F1", "#EBE5D3", "#E79F8C", "#82B2C5", "#EBCE9D"], 
	idFondo = [0,0,0,0,0,0]; //El id del fondo es por sala

//{ quirofanos:" + json_diasQuiro + ", fecha: " + str_fecha + ", 
//mensaje:'" + resp_diasQuirofano.getMensaje() + "', ok:" + resp_diasQuirofano.getOk() }
function cargarQuirofano( json_respuesta ){
	
	var respuesta;
	try{
		//Parseo la respuesta
		respuesta = JSON.parse( json_respuesta );
	}catch(e){
		respuesta = {"ok":false, "mensaje": "Error al pedir los quirofanos."};
	}
	
	if (respuesta.ok){ 
		//Escondo el cartel
		cargarReservas( respuesta.reservas );
		
		quirofanosCargados++;
		
		//Actualizo las vistas si llego toda la info
		if (quirofanosCargados == 5){
			crearVistaSalas();
			
			dojo.addClass("mensaje", "oculto");
			dojo.removeClass("bodySalas", "oculto");

		}
		
	}else{
		dojo.removeClass("mensaje", "oculto");
		dojo.addClass("bodySalas", "oculto");
		
		document.getElementById('mensaje').innerHTML = respuesta.mensaje;		
	}
	
	
}

//Cargo los datos del bt actual al bt pasado como parametro
function cargarReservas( reservas ){
	
	//ordenarPorSala(quirofanos);
	var cirugia, sala;
	
	for (var i=0; i<reservas.length; i++){
		
		cirugia = reservas[i];
		sala = parseInt(cirugia.sala);
		
		salas[sala][cirugia.horaInicio] = cirugia;
		
	}
}

//Crea una sala vacia (VISTA)
function crearVistaSalas(){
	
	var bodySalas = document.getElementById('bodySalas');
	bodySalas.innerHTML = "";
	
	var tr, td, rowspans=[0,1,1,1,1,1];
	for (var h=16; h < 44; h++){
		
		//Crear fila
		tr = document.createElement("tr");
		tr.setAttribute("id", h);
		tr.setAttribute("hora", h);
		//agregarClase(tr, "trNotHover");
		
		//Crear celda de hora
		td = document.createElement("td");
		td.setAttribute("id", h.toString()+"0");
		td.setAttribute("hora", h.toString());
		td.setAttribute("sala", "0");
		td.appendChild( document.createTextNode( convertirEnHora(h) ));
		
		tr.appendChild(td);
		
		for (var s=1; s <= NRO_SALAS; s++){
			
			//Crear celda SOLO si no hay un rowspan mayor que uno para esta sala
			if( rowspans[s] > 1 ){
				rowspans[s] --;
			}else{
				
				td = document.createElement("td");
				
				td.setAttribute("id", h.toString()+"_"+s.toString());
				td.setAttribute("hora", h.toString());
				td.setAttribute("sala", s.toString());
				td.setAttribute("class", "celdaCirugia");
				
				td.setAttribute("onmouseover", "resaltarHora('"+h.toString()+"0')");  
				td.setAttribute("onmouseout", "desresaltarHora('"+h.toString()+"0')"); 
				
				var hi_vista = convertirEnHora(h);
				var cirugia = salas[s][hi_vista];
				
				if ( cirugia ){
					
					var rowspan = convertirEnInt(cirugia.horaFin) - convertirEnInt(cirugia.horaInicio); 
					td.setAttribute("rowspan", rowspan);
					rowspans[s] = rowspan;
					
					td.appendChild( crearVistaCirugia(cirugia) );
					td.setAttribute("onclick", "mostrarCirugia("+s+",'"+hi_vista+"')");
					
					//Resaltar Cirugia
					td.setAttribute("onmouseover", "resaltarCirugia('"+cirugia.horaInicio+"','"+cirugia.horaFin+"', '"+s+"', '"+fondos[idFondo[s]]+"')");  
					td.setAttribute("onmouseout", "desresaltarCirugia('"+cirugia.horaInicio+"','"+cirugia.horaFin+"', '"+s+"', '"+fondos[idFondo[s]]+"')");  
					
					//Cambio el fondo
					td.setAttribute("style", "background-color:" + fondos[idFondo[s]]+"; cursor:pointer;");
					idFondo[s] = (idFondo[s] + 1) % NRO_SALAS; //Recorrido circular de los fondos
					
				}
				
				//Agregar celda a la fila
				tr.appendChild(td);
				
			}
		}
		
		bodySalas.appendChild(tr);
	}
}


function resaltarHora(idCelda){
	agregarClase( document.getElementById(idCelda), "celdaSobre");
}

function desresaltarHora(idCelda){
	quitarClase( document.getElementById(idCelda), "celdaSobre");
}

/*************************************************************************************/
/**         						CIRUGIAS										 */
/*************************************************************************************/

var campos = ["horaInicio","horaFin","paciente","habitacion","numero","sala","fechaReservaSala","cirugiaProgramada","profesional","anestesista","instrumentista","patologo","pediatra"];

function resaltarCirugia(horaInicio, horaFin, sala, fondo){
	
	var cantHI = convertirEnInt(horaInicio);
	var cantHF = convertirEnInt(horaFin);
	
	for (var i=cantHI; i<cantHF; i++ ){
		tdHora = document.getElementById(i.toString()+"0");
		tdHora.setAttribute("style", "background-color: "+fondo+";");
	}

}

function desresaltarCirugia(horaInicio, horaFin, sala, fondo){
	
	var cantHI = convertirEnInt(horaInicio);
	var cantHF = convertirEnInt(horaFin);
	
	for (var i=cantHI; i<cantHF; i++ ){
		document.getElementById(i.toString()+"0").setAttribute("style", "");
		//agregarClase( document.getElementById(i.toString()+"0"), "celdaSobre");
	}

}

function mostrarCirugia(sala, horaInicio) {
	
	var cirugia = salas[sala][horaInicio]
		,dato;
	
	for (var i=0; i!=campos.length; i++ ){
		try{
			$("#"+campos[i]).html( "" ) ;
			dato = cirugia[campos[i]];
			if (dato)
				//document.getElementById(campos[i]).value = dato ;
				$("#"+campos[i]).html( dato ) ;
		}catch(e){}
	}
	
	mostrarDiv("Reserva de sala", document.getElementById("informacionDeLaReserva") );
	//$('#informacionDeLaReserva').show()
;
}

function crearVistaCirugia(cirugia) {
	
	var span = document.createElement("span");
	span.appendChild(document.createTextNode("De "));
	
		var spanDe = document.createElement("span");
		spanDe.setAttribute("style", "font-weight: bold;");
		spanDe.appendChild(document.createTextNode(cirugia.horaInicio));
		span.appendChild( spanDe );
		
		span.appendChild(document.createTextNode(" a "));
		
		var spanA = document.createElement("span");
		spanA.setAttribute("style", "font-weight: bold;");
		spanA.appendChild(document.createTextNode(cirugia.horaFin));
		span.appendChild( spanA );

		span.appendChild(document.createTextNode(", opera: "));
		
		var spanProf = document.createElement("span");
		spanProf.setAttribute("style", "font-weight: bold;  text-transform: capitalize;");
		spanProf.appendChild(document.createTextNode(cirugia.profesional));
		span.appendChild( spanProf );
	
	
	return span;
}

/*****************************************************************************************/


function dateToString(date) {
	var stringDate = "";

	if (date) {
		stringDate += (date.getDate() < 10 ? "0" : "") + date.getDate()
				+ "/";
		stringDate += (date.getMonth() < 9 ? "0" : "")
				+ (date.getMonth() + 1) + "/";
		stringDate += date.getFullYear();
	}

	return stringDate;
}

/********************************************************************************************/

function quitarClase(nodo, clase) {
	if(nodo.classList.contains(clase)){
	    nodo.classList.remove(clase);
	}
};

function agregarClase(nodo, clase) {
	if(!nodo.classList.contains(clase)) {
	    nodo.classList.add(clase);
	}
};

/********************************************************************************************/