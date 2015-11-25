/**
 * Criterio de Camas Service
 */
var server = angular.module('services');

server.factory('CriterioDeCamasService', function(HorusService) {

	var URL = "/criterio_de_camas";
	var URLcamas = "/camas";

	return {

		goTo : HorusService.goTo,
		getCriteriosDeAsignacion : function(successFn, errorFn) {
			return HorusService.authGet(URL + '/getCriteriosDeAsignacion',
					successFn, errorFn);
		},
		guardarCriteriosDeAsignacion : function(param,successFn, errorFn) {
			return HorusService.authPost(URL + '/guardarCriterioDeAsignacion',
					param, successFn, errorFn);
		},
		modificarCriteriosDeAsignacion : function(param,successFn, errorFn) {
			return HorusService.authPost(URL + '/modificarCriterioDeAsignacion',
					param, successFn, errorFn);
		},
		eliminarCriteriosDeAsignacion : function(param,successFn, errorFn) {
			return HorusService.authPost(URL + '/eliminarCriterioDeAsignacion',
					param,successFn, errorFn);
		},
		/*Camas*/
		getCamas : function(successFn, errorFn) {
			return HorusService.authGet(URLcamas + '/getCamas',
					successFn, errorFn);
		},
		setCamaCriterio : function(param,successFn, errorFn) {
			return HorusService.authPost(URLcamas + '/setCriterioACama',
					param, successFn, errorFn);
		}

	};
});