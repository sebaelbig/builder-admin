/**
 * Unidad de medida Service
 */
var server = angular.module('services');

server.factory('UnidadFuncionalService', function(HorusService) {
	
	var URL = "/unidad_funcional";
	
	return {
		goTo: HorusService.goTo,
		crear: function (params, successFn, errorFn) {
			return HorusService.post(URL+"/guardar", params, successFn, errorFn);
		},
		modificar: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+"/modificar", params, successFn, errorFn);
		},
		eliminar: function (params, successFn, errorFn) {
			return HorusService.authDelete(URL+'/eliminar', params, successFn, errorFn);
		},
		listar: function (p,successFn, errorFn) {
			return HorusService.post(URL+"/listarUnidadesFuncionales",p, successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.get(URL+'/findById/'+id, successFn, errorFn);
		}
	};
	
});