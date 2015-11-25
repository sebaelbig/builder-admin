/**
 * User Service
 */
var server = angular.module('services');

server.factory('PerfilService', function(HorusService) {
	var URL = "/core/usuarios/perfiles/seguro";
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
		buscarPorServicio: function (idServicio, successFn, errorFn) {
			return HorusService.authGet(URL+'/buscarPorServicio/'+idServicio, successFn, errorFn);
		},
		buscarProfPorServicio: function (idPerfil, successFn, errorFn) {
			return HorusService.authGet(URL+'/buscarProfPorServicio/'+idPerfil, successFn, errorFn);
		},
		buscarMedicosDelServicioDelUsuario: function (user, successFn, errorFn) {
			return HorusService.authGet(URL+'/buscarMedicosDelServicioDelUsuario/'+user, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+id, successFn, errorFn);
		}
	};
});