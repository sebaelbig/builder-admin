/**
 * Unidad de medida Service
 */
var server = angular.module('services');

server.factory('UnidadDeMedidaService', function(HorusService) {
	
	var URL = "/unidadDeMedida";
	
	return {
		goTo: HorusService.goTo,
		crear: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/crear", params, successFn, errorFn);
		},
		modificar: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+"/modificar", params, successFn, errorFn);
		},
		eliminar: function (params, successFn, errorFn) {
			return HorusService.authDelete(URL+'/eliminar', params, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.get(URL+"/listarDeUnidadesDeMedida", successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.get(URL+'/findById/'+id, successFn, errorFn);
		}
	};
	
});