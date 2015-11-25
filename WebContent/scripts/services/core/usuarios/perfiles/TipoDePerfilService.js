/**
 * TipoDePerfilService Service
 */
var server = angular.module('services');

server.factory('TipoDePerfilService', function(HorusService) {
	
	var URL = "/core/usuarios/perfiles/tipoDePerfiles/seguro";
	
	return {
		id: null,
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
		buscarPorRol: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+'/buscarPorRol/'+params, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		findById: function ( successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+this.id, successFn, errorFn);
		}
	};
	
});