'use strict';
/**
 * Login Service
 */
var server = angular.module('services');

server.factory('TurnoProfesionalService', function(HorusService) { //$cookieStore,
	
	return {
		
		//Obtiene los bloque turnos del profesional
		obtenerBloqueTurnosDeProfesional: function (params, successFn, errorFn) {
			return HorusService.authGet('/turnos/seguro/obtenerBloqueTurnosDeProfesional/'+params, successFn, errorFn);
		},
		
		//Obtiene los turnos de un bloque turno
		getTurnosDeBloqueTurnoParaUnaFecha: function (params, successFn, errorFn) {
			
			var urlEspes = "/turnos/seguro/getTurnosDeBloqueTurnoParaUnaFecha";
			//bt_b, 
			urlEspes += "/"+params[0].numero_semana;
			urlEspes += "/"+params[0].str_horaInicio.split(":")[0];
			urlEspes += "/"+params[0].str_horaInicio.split(":")[1];
			//bt, 
			urlEspes += "/"+params[1].numero_semana;
			urlEspes += "/"+params[1].str_horaInicio.split(":")[0];
		    urlEspes += "/"+params[1].str_horaInicio.split(":")[1];
		    //bt_d, 
		    urlEspes += "/"+params[2].numero_semana;
		    urlEspes += "/"+params[2].str_horaInicio.split(":")[0];
		    urlEspes += "/"+params[2].str_horaInicio.split(":")[1];
		    //matricula, 
		    urlEspes += "/"+params[3];
		    //fecha
		    urlEspes += "/"+params[4];
		    //servicio
		    urlEspes += "/"+params[5];
			
			return HorusService.authGet(urlEspes, successFn, errorFn);
		}
	};
});