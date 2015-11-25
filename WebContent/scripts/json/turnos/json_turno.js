function JSON_Turno(json_t, fila_p, cancelar) {

	this.json = json_t;

	this.fila = fila_p;
	
	this.puedeCancelar = cancelar;

	this.cartelPrivado = "--Informacion privada--";

	var propiedadesEntidad = new Array('fecha', 'str_fecha', 'hora',
			'str_hora', 'horaDesde', 'str_horaDesde', 'nombre', 'numero',
			'especialidad', 'matricula', 'servicio', 'profesional', 'mutual', 
			'libre','frecuencia', 'servicio');
	
	// Carga los datos
	this.cargarDatos = function() {
		for ( var i = 0; i != propiedadesEntidad.length; i++) {
			try {
				document.getElementById(propiedadesEntidad[i]).value = this.json[propiedadesEntidad[i]];
			} catch (e) {
			}

		}
	};

	// Toma los datos
	this.tomarDatos = function() {
		for ( var i = 0; i != propiedadesEntidad.length; i++) {
			try {
				this.json[propiedadesEntidad[i]] = document
						.getElementById(propiedadesEntidad[i]).value;
			} catch (e) {
			}
		}
	};

	this.toString = function() {
		return dojo.toJson(this.json);
	};

	// this.json.str_fecha - this.json.nombre - this.json.str_hora - this.json.numero - this.json.profesional - this.json.especialidad     
	this.getLabel = function() {
		if (this.json.profesional)
			this.json.apellido = this.json.profesional;
		
		return "Turno Nro: <span class=\"negrita\" >" + this.json.numero+ "</span> " +
					" del dia <span class=\"negrita\" >"+ this.json.nombre+ " ("+ this.json.str_fecha + ")</span> " +
					" a las <span class=\"negrita\" >"+ this.json.str_hora + "</span> hs. "+ 
					" para: <span class=\"negrita\" >"+this.json.apellido+ "</span> con el servicio "+
					"<span class=\"negrita\" >"+this.json.servicio+ "</span>";
	};

	this.setBloqueTurno = function(bt){
		this.json.especialidad = bt.json.especialidad;
		this.json.apellido = bt.json.apellido;
	};
	
	this.equal = function(otroT) {
		return this.json.id == otroT.getId();
	};

	this.getClass = function() {
		return this.json.estado.nombre;
	};

	this.getHora = function() {
		return this.json.str_hora;
	};
	
	this.getNumero = function() {
		return this.json.numero;
	};

	this.getFrecuencia = function() {
		return this.json.frecuencia;
	};

	this.getPaciente = function() {
		return (this.estaTomado())?this.getUsuarioTomoTurno():"--";
	};

	this.getUsuarioTomoTurno = function() {
		return this.json.usuarioTomo;
	};
	
	this.parsearHTML = function() {

		var tr = document.createElement("tr");

		// <th>Hora</th>
		var td1 = document.createElement("td");
		var texto1 = document.createTextNode(this.getHora());
		td1.appendChild(texto1);
		td1.setAttribute("style", "font-size:2.5em; ");
		tr.appendChild(td1);

		// <th>NroOrden</th>
		var td2 = document.createElement("td");
		var texto2 = document.createTextNode(this.getNumero());
		td2.appendChild(texto2);
		td2.setAttribute("style", "font-size:2.5em; ");
		tr.appendChild(td2);

		// <th>Frecuencia</th>
		var td4 = document.createElement("td");
		var texto4 = document.createTextNode(this.getFrecuencia());
		td4.appendChild(texto4);
		tr.appendChild(td4);
		
		// <th>Estado</th>
		var td5 = document.createElement("td");
		var texto5 = document.createTextNode("Ocupado");
		if (this.puedeReservar()){
			texto5 = document.createTextNode("Disponible");
		}
		td5.appendChild(texto5);
		tr.appendChild(td5);

		// <th>Acciones</th>
		var td_acciones = document.createElement("td");

		if (this.puedeReservar()){
			td_acciones.appendChild(new OpcionTomarTurno(this.fila));
			
			tr.setAttribute("class", "libre");
//			tr.setAttribute("onclick", "javascript:tomarTurno(" + this.fila + ")");
			tr.style.cursor = "pointer";
		}else{
			tr.setAttribute("class", "ocupado");
		}

		tr.appendChild(td_acciones);

		return tr;

	};
	
	this.parsearHTMLExtendido = function(){
		var tr = document.createElement("tr");
		tr.setAttribute("id", this.fila);

		// <th>Fecha</th>
		var td1 = document.createElement("td");
		var texto1 = document.createTextNode(this.json.str_fecha);
		td1.appendChild(texto1);
		tr.appendChild(td1);
		
		//Nombre
		td1 = document.createElement("td");
		texto1 = document.createTextNode(this.json.nombre);
		td1.appendChild(texto1);
		tr.appendChild(td1);
		
		//Hora
		td1 = document.createElement("td");
		texto1 = document.createTextNode(this.json.str_hora);
		td1.appendChild(texto1);
		tr.appendChild(td1);
		
		// <th>NroOrden</th>
		td1 = document.createElement("td");
		texto1 = document.createTextNode(this.json.numero);
		td1.appendChild(texto1);
		tr.appendChild(td1);

		//Profesional
		td1 = document.createElement("td");
		texto1 = document.createTextNode(this.json.profesional);
		td1.appendChild(texto1);
		tr.appendChild(td1);
		
		// <th>Especialidad</th>
		td1 = document.createElement("td");
		texto1 = document.createTextNode(this.json.especialidad);
		td1.appendChild(texto1);
		tr.appendChild(td1);
		
		// <th>Acciones</th>
		var td_acciones = document.createElement("td");

		if (this.estaTomado()){
			if (this.puedeCancelar){
				//Si el paciente es el mismo que esta logueado, lo puiede cancelar
				td_acciones.appendChild(new OpcionCancelarTurno(this.fila));
			}
			
		}else{ 
			td_acciones.appendChild(new OpcionTomarTurno(this.fila));
		}

		tr.appendChild(td_acciones);

		return tr;
	};

	this.puedeReservar = function() {
		return this.json.libre;
	};

	this.estaPresente = function() {
		return this.getNombreEstado() == "Presente";
	};
	this.estaTomado = function() {
		return !this.json.libre;
	};

	this.getId = function() {
		return this.getNumero();
	};
}

// Boton para tomar un turno
var ico_tomar_turno = "/horus_fe/img/turnos/reservar_turno_28px.png";
function OpcionTomarTurno(fila) {
	this.a = document.createElement("a");
	imagen = document.createElement("img");
	imagen.setAttribute("src", ico_tomar_turno);
	this.a.setAttribute("value", "Tomar turno");
	imagen.setAttribute("class", "imagenEscalable");
	imagen.setAttribute("title", "Solicitar turno");
	imagen.setAttribute("alt", "ico_tomar_turno este turno");
	// La funciopn reservar turno esta implementada en el administracionTurnos
	this.a.setAttribute("onclick", "javascript:tomarTurno(" + fila + ");");
	this.a.appendChild(imagen);
	return this.a;
}

// Boton para cancelar un turno
var ico_cancelar_turno = "/horus_fe/img/turnos/cancelar_turno_28px.png";
function OpcionCancelarTurno(fila) {
	this.a = document.createElement("a");
	imagen = document.createElement("img");
	imagen.setAttribute("src", ico_cancelar_turno);
	this.a.setAttribute("value", "Cancelar turno");
	imagen.setAttribute("class", "imagenEscalable");
	imagen.setAttribute("title", "Cancelar turno");
	imagen.setAttribute("alt", "Cancela este turno");
	// La funciopn reservar turno esta implementada en el administracionTurnos
	this.a.setAttribute("onclick", "javascript:cancelarTurno(" + fila + ")");
	this.a.appendChild(imagen);
	return this.a;
}

// Boton para ver los datos del turno
var ico_ver_turno = "/horus_fe/img/turnos/ver_turno.png";
function OpcionDatosTurno(fila) {
	this.a = document.createElement("a");
	imagen = document.createElement("img");
	imagen.setAttribute("src", ico_ver_turno);
	this.a.setAttribute("value", "Ver datos del turno");
	imagen.setAttribute("class", "imagenEscalable");
	imagen.setAttribute("title", "Datos del turno");
	imagen.setAttribute("alt", "Datos del turno");
	this.a.setAttribute("onclick", "javascript:verInformacionDeTurno(" + fila
			+ ")");
	this.a.appendChild(imagen);
	return this.a;
}