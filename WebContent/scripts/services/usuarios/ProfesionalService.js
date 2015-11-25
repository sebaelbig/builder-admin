'use strict';
/**
 * Profesional Service
 */
var server = angular.module('services');

server.factory('ProfesionalService', function(HorusService, $rootScope ) { //$cookieStore,
	
	return {
		recuperarDatosProfesional: function (nroMatricula, successFn, errorFn) {
			return HorusService.authGet('/profesionales/seguro/recuperarDatosProfesional/'+nroMatricula , successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet("/profesionales/seguro/listAll", successFn, errorFn);
		},
		usuariosPorRol: function (id, successFn, errorFn) {
			return HorusService.authGet('/core/usuarios/roles_he/seguro/usuariosPorRol/'+id, successFn, errorFn);
		},
		buscarProfesionalesPor: function ( successFn, errorFn) {
			return HorusService.authPost('/profesionales/seguro/buscarProfesionalesPor', successFn, errorFn);
		}
	};
});