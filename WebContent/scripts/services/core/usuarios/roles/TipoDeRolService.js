/**
 * TipoDeRolService Service
 */
var server = angular.module('services');

server.factory('TipoDeRolService', function(HorusService) {
	
	var URL = "/core/usuarios/roles/tipoDeRoles/seguro";
	
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
		buscar: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+'/buscar/'+params, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+id, successFn, errorFn);
		}
	};
	
});