/**
 * Templates de descripcion - Service
 */
var server = angular.module('services');

server.factory('EstudioDePedidoService', function(HorusService) {
	
	var URL = "/historiaClinica/estudioDePedidos/seguro";
	
	return {
		id:null,
		goTo: HorusService.goTo,
		
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		findById: function ( successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+this.id, successFn, errorFn);
		},
		informar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/informar", params, successFn, errorFn);
		},
		cancelar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/cancelar", params, successFn, errorFn);
		},
		atender: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/atender", params, successFn, errorFn);
		},
	};
});