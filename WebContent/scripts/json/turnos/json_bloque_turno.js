function JSON_BloqueTurno(json_p, fila_p) {

	this.json = json_p;

	this.json.id = fila_p;

	this._resaltado = false;

	this.setResaltado = function(bool) {
		this._resaltado = bool;
	};

	var propiedadesEntidad = new Array('id', 'nombre', 'numero_semana',
			'horaDesde', 'horaHasta', 'diaPrimerTurnoLibre',
			'horaPrimerTurnoLibre', 'str_horaDesde', 'matricula',
			'str_horaHasta', 'str_diaPrimerTurnoLibre', 'frecuencia',
			'numero', 'str_horaPrimerTurnoLibre', 'apellido','especialidad',
			'vigenciaDesde', 'str_vigenciaDesde', 'servicio');

	// Carga los datos
	this.cargarDatos = function() {
		for (var i = 0; i != propiedadesEntidad.length; i++) {
			try {
				document.getElementById(propiedadesEntidad[i]).value = this.json[propiedadesEntidad[i]];
			} catch (e) {
			}
		}
	};

	// Toma los datos
	this.tomarDatos = function() {
		for (var i = 0; i != propiedadesEntidad.length; i++) {
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

	this.parsearHTML = function() {
		var tr = document.createElement("tr");
		return tr;
	};

	
	this.getInformacion = function() {
		if (busquedaPorEspecialidad) {
			return "<span class=\"negrita\" >" + this.json.apellido + ", "
					+ this.json.matricula + "</span>";
		}
	};
	
	this.getLabel = function() {
		
		if (this.json.str_diaPrimerTurnoLibre){
			
			if (!busquedaPorEspecialidad) {
				//Es un profesional, ya se conoce el apellido y matricula
				
				resul = "<span class=\"negrita\" >" + this.json.nombre + "</span>"
					+ ", de <span class=\"negrita\" >"+ this.json.str_horaDesde +"</span>"
					+ " a <span class=\"negrita\" >"+ this.json.str_horaHasta +"</span>";
					
				
				if (this.json.str_diaPrimerTurnoLibre){
					
					resul += " (Primer turno libre:<span class=\"negrita\" >"
						+ this.json.str_diaPrimerTurnoLibre+ "</span>"
						+ " aprox: <span class=\"negrita\" >"
						+ this.json.str_horaPrimerTurnoLibre + "</span> hs.) ";						
					
				}else{
					resul += " (No posee turnos libres para este dia/hora)";
				}
				
				resul += "(Desde el:<span class=\"negrita\" >"+ this.json.str_vigenciaDesde +"</span>)"
						+ "(Srv.: <span class=\"negrita\" >"+ this.json.servicio +"</span>)";
				
			} else {
				//Es una especialidad
				
				resul = "<span class=\"negrita\" >" + this.json.apellido + "("
						+ this.json.matricula + "</span>) "
						+ "los <span class=\"negrita\" >"+ this.json.nombre + "</span>"
						+ " desde las <span class=\"negrita\" >"+ this.json.str_horaDesde + "</span> ";
				
				if (this.json.str_diaPrimerTurnoLibre){
					
					resul += " (Primer turno libre:<span class=\"negrita\" >"
						+ this.json.str_diaPrimerTurnoLibre+ "</span>"
						//+ " Nro. <span class=\"negrita\" >"+ this.json.numero + "</span>";
					+ " aprox:<span class=\"negrita\" >"
					+ this.json.str_horaPrimerTurnoLibre + "</span> hs.)";
				}else{
					resul += 	" (No posee turnos libres para este dia/hora)";
				}
				
				resul += "(Desde el:<span class=\"negrita\" >"+ this.json.str_vigenciaDesde +"</span>)"
						+ "(Srv.:<span class=\"negrita\" >"+ this.json.servicio +"</span>)";
			}
			
		}else{
			
		}

		return resul;
	};

	this.getTitle = function() {
		return this.json.nombre + " de " + this.json.str_horaDesde + " a "
				+ this.json.str_horaHasta + " (1T:"
				+ this.json.str_diaPrimerTurnoLibre + +" a las "
				+ this.json.str_horaPrimerTurnoLibre + ")";
	};

	this.getClass = function() {

		var resul = this.json.nombre;

		if (this._resaltado) {
			resul += " itemListaDistinguido";
		}

		return resul;
	};

	this.getFechaTurno = function() {
		return this.json.str_diaPrimerTurnoLibre;
	};
	this.getHoraTurno = function() {
		return this.json.str_horaPrimerTurnoLibre;
	};

	this.getStr_horaInicioBloqueTurno = function() {
		return this.json.str_horaDesde;
	};
	this.getStr_horaFinBloqueTurno = function() {
		return this.json.str_horaHasta;
	};

	this.getNumero = function() {
		return this.json.numero;
	};

	this.getIdBloqueTurno = function() {
		return this.fila;
	};

	this.equal = function(otroBT) {
		//if (otroBT.getIdBloqueTurno()==null){
			return (this.json.nombre == otroBT.json.nombre)	&& (this.json.str_horaDesde == otroBT.json.str_horaDesde);
		//}else {
			//return otroBT.getIdBloqueTurno() == this.getIdBloqueTurno();
		//}
	};
}