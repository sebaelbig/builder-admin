/**
 * User Service
 */
var server = angular.module('services');

server.factory('UsuarioService', function(HorusService) {
	
	return {
		goTo: HorusService.goTo,
		guardar: function (params, successFn, errorFn) {
			return HorusService.authPost('/usuarios/seguro', params, successFn, errorFn);
		},
		registrar: function (params, successFn, errorFn) {
			return HorusService.authPost('/usuarios/seguro/registrar', params, successFn, errorFn);
		},
		actualizar: function (params, successFn, errorFn) {
			return HorusService.authPut('/usuarios/seguro', params, successFn, errorFn);
		},
		borrar: function (params, successFn, errorFn) {
			return HorusService.authPost('/usuarios/seguro', params, successFn, errorFn);
		},
		buscar: function (params, successFn, errorFn) {
			return HorusService.authGet('/usuarios/seguro/'+JSON.stringify(params), successFn, errorFn);
		},
		getLoggedUser: function (params, successFn, errorFn) {
			return HorusService.authPost('/login/seguro/getLoggedUser', params, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet('/usuarios/seguro', successFn, errorFn);
		},
		deleteAll: function (successFn, errorFn) {
			return HorusService.authGet('/usuarios/seguro/deleteAll', successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet('/usuarios/seguro/'+id, successFn, errorFn);
		},
		getUsuarioAlfresco: function (host, successFn, errorFn) {
			return HorusService.post('/usuariosLDAP/getUsuarioAlfresco',host, successFn, errorFn);
		}

	};
});