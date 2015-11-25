/**
 * Cirugias Service
 */
var server = angular.module('services');

server.factory('CirugiaService', function(HorusService) {
	
	return {
		goTo: HorusService.goTo,
		
		obtenerCirugiasDeQuirofanoParaUnaFecha: function (params, successFn, errorFn) {
			
			var fechaDate = params[0];
			var nroSala = params[1];
			
			var urlEspes = "/cirugias/seguro/obtenerCirugiasDeQuirofanoParaUnaFecha";
			urlEspes += "/"+fechaDate[0];
		    urlEspes += "/"+fechaDate[1];
		    urlEspes += "/"+fechaDate[2];
		    urlEspes += "/"+nroSala;
			
			return HorusService.authGet(urlEspes, successFn, errorFn);
		},
		guardar: function (params, successFn, errorFn) {
			return HorusService.authPost('/cirugias/seguro', params, successFn, errorFn);
		},
		actualizar: function (params, successFn, errorFn) {
			return HorusService.authPut('/cirugias/seguro', params, successFn, errorFn);
		},
		borrar: function (params, successFn, errorFn) {
			return HorusService.authPost('/cirugias/seguro/', params, successFn, errorFn);
		},
		buscar: function (params, successFn, errorFn) {
			return HorusService.authGet('/cirugias/seguro/'+JSON.stringify(params), successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet('/cirugias/seguro', successFn, errorFn);
		},
		deleteAll: function (successFn, errorFn) {
			return HorusService.authGet('/cirugias/seguro/deleteAll', successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet('/cirugias/seguro/'+id, successFn, errorFn);
		}

	};
});