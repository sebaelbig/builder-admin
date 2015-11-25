/**
 * Templates de descripcion - Service
 */
var server = angular.module('services');

server.factory('InformeService', function(HorusService) {
	
	var URL = "/historiaClinica/informes/seguro";
	
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
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		eliminar: function (params, successFn, errorFn) {
			return HorusService.authDelete(URL+'/eliminar', params, successFn, errorFn);
		},			
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+this.id, successFn, errorFn);
		}
	};
});