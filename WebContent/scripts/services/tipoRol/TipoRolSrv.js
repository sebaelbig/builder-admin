/**
 * TipoRol Service
 */
var server = angular.module('services');

server.factory('TipoRolService', function(HorusService) {
	return {
		goTo: HorusService.goTo,
		guardar: function (params, successFn, errorFn) {
			return HorusService.post('/tipoRol/', params, successFn, errorFn);
		},
		actualizar: function (params, successFn, errorFn) {
			return HorusService.put('/tipoRol', params, successFn, errorFn);
		},
		borrar: function (params, successFn, errorFn) {
			return HorusService.post('/tipoRol/', params, successFn, errorFn);
		},
		buscar: function (params, successFn, errorFn) {
			return HorusService.get('/tipoRol/'+JSON.stringify(params), successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.get('/tipoRol', successFn, errorFn);
		},
		deleteAll: function (successFn, errorFn) {
			return HorusService.get('/tipoRol/deleteAll', successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.get('/tipoRol/'+id, successFn, errorFn);
		}

	};
});