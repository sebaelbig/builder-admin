function JSON_ProfesionalBloqueTurnoPrimerTurno(json_p, fila_p) {

	this.json = json_p;

	this.fila = fila_p;

	this._resaltado = false;

	this.setResaltado = function(bool) {
		this._resaltado = bool;
	}

	var propiedadesEntidad = new Array('nombre', 'horaDesde', 'horaHasta',
			'diaPrimerTurnoLibre', 'horaPrimerTurnoLibre', 'str_horaDesde',
			'str_horaHasta', 'str_diaPrimerTurnoLibre',
			'str_horaPrimerTurnoLibre');

	// Carga los datos
	this.cargarDatos = function() {
		for (i = 0; i != propiedadesEntidad.length; i++) {
			try {
				document.getElementById(propiedadesEntidad[i]).value = this.json[propiedadesEntidad[i]];
			} catch (e) {}
		}
	}

	// Toma los datos
	this.tomarDatos = function() {
		for (i = 0; i != propiedadesEntidad.length; i++) {
			try {
				this.json[propiedadesEntidad[i]] = document
						.getElementById(propiedadesEntidad[i]).value;
			} catch (e) {}
		}
	}

	this.toString = function() {
		return dojo.toJson(this.json);
	}

	this.parsearHTML = function() {
		var tr = document.createElement("tr");
		return tr;
	}

	this.getLabel = function() {
		return "<span class=\"negrita\" >" + this.json.nombre 
			+ " de " + this.json.str_horaDesde+ "</span>"
			+ " a <span class=\"negrita\" >"+ this.json.str_horaHasta + "</span>"
			+ " (1T: <span class=\"negrita\" >" + this.json.str_diaPrimerTurnoLibre+ "</span>"
			+ " a las <span class=\"negrita\" >"+ this.json.str_horaPrimerTurnoLibre+ "</span>)";
	}

	this.getTitle = function(){
		return this.json.nombre + " de " +this.json.str_horaDesde+ " a "+ this.json.str_horaHasta 
								+" (1T:" + this.json.str_diaPrimerTurnoLibre+ +" a las "+ this.json.str_horaPrimerTurnoLibre+")";
	}
	
	//Debe estar en distinto BT para mostrarsee
	this.equal = function(otroBT) {
		return (this.json.nombre == otroBT.json.nombre)
				&& (this.json.str_horaDesde == otroBT.json.str_horaDesde);
	}

	this.getClass = function() {

		var resul = this.json.nombre;

		if (this._resaltado) {
			resul += " itemListaDistinguido";
		}

		return resul;
	}

	this.getFechaTurno = function() {
		return this.json.str_diaPrimerTurnoLibre;
	}
	this.getHoraTurno = function() {
		return this.json.str_horaPrimerTurnoLibre;
	}
	
	this.getStr_horaInicioBloqueTurno = function() {
		return this.json.str_horaDesde;
	}
	this.getStr_horaFinBloqueTurno = function() {
		return this.json.str_horaHasta;
	}
	
	this.getNumeroTurno = function() {
		return this.json.numeroTurno;
	}
	
	this.getIdBloqueTurno = function() {
		return this.fila;
	}
	
	this.equal = function(otroBT){
		return otroBT.getIdBloqueTurno() == this.getIdBloqueTurno();
	}
}