/**
 * User Service
 */
var server = angular.module('services');

server.factory('UsuarioService', function(HorusService) {
	
	var URL = "/core/usuarios";
	
	return {
		goTo: HorusService.goTo,
		guardar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/seguro/guardar', params, successFn, errorFn);
		},
		registrar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/seguro/registrar', params, successFn, errorFn);
		},
		actualizar: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+'/seguro', params, successFn, errorFn);
		},
		borrar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/seguro', params, successFn, errorFn);
		},
		buscar: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+'/seguro/'+JSON.stringify(params), successFn, errorFn);
		},
		getLoggedUser: function (params, successFn, errorFn) {
			return HorusService.authPost('/login/seguro/getLoggedUser', params, successFn, errorFn);
		},
		listar: function (params,successFn, errorFn) {
			return HorusService.authGet(URL+'/seguro/listar/', successFn, errorFn);
		},
		deleteAll: function (successFn, errorFn) {
			return HorusService.authGet(URL+'/seguro/deleteAll', successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet(URL+'/seguro/'+id, successFn, errorFn);
		},
		getUsuarioAlfresco: function (host, successFn, errorFn) {
			return HorusService.post(URL+'/seguro/getUsuarioAlfresco',host, successFn, errorFn);
		}

	};
});