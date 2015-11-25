/**
 * Templates de descripcion - Service
 */
var server = angular.module('services');

server.factory('TemplatePublicoService', function(HorusService) {
	
	var URL = "/templatesDeDescripcion/publicos/seguro";
	
	return {
		id:null,
		goTo: HorusService.goTo,
		
		crear: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/crear', params, successFn, errorFn);
		},
		
		modificar: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+'/modificar', params, successFn, errorFn);
		},
		
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL, successFn, errorFn);
		}, 
		listarDeServicioDeUsuario: function ( successFn, errorFn) {
			return HorusService.authGet(URL+"/listarDeServicioDeUsuario", successFn, errorFn);
		}, 
		listarServiciosDeUsuario: function ( successFn, errorFn) {
			return HorusService.authGet(URL+"/listarServiciosDeUsuario", successFn, errorFn);
		}, 
		eliminar: function (params, successFn, errorFn) {
			return HorusService.authDelete(URL+'/eliminar', params, successFn, errorFn);
		},			
		buscar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/buscar', params, successFn, errorFn);
		},
		findById: function (successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+this.id, successFn, errorFn);
		}
	};
});