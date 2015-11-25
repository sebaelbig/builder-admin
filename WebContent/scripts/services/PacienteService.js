/**
 * Paciente Service
 */
var server = angular.module('services');

server.factory('PacienteService', function(HorusService) {
	
	var URL = "/pacientes";
	var URLepisodio = "/episodioPaciente";
	
	return {
		
		goTo: HorusService.goTo,
		datosDePaciente: function (nroDoc,tipoDoc,successFn, errorFn) {
			return HorusService.authGet(URL+'/datosDePaciente/'+nroDoc+"/"+ tipoDoc, successFn, errorFn);
		},
	
		historialDePaciente: function (nroDoc,tipoDoc,successFn, errorFn) {
			return HorusService.authGet(URLepisodio+'/historialDePaciente/'+nroDoc+"/"+ tipoDoc, successFn, errorFn);
		},
		buscarPaciente: function(apellido,nombre,nroDoc,successFn,errorFn){
			return HorusService.authGet(URL+'/buscarPaciente/'+apellido+"/"+nombre+"/"+ nroDoc, successFn, errorFn);
		}
		
	};
});