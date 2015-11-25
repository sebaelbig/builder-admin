/**
 * Internacion Service
 */
var server = angular.module('services');

server.factory('InternacionService', function(HorusService) {
	
	var URL = "/internacion";
	var URL_UNSECURE = "/internacion/epicrisis";
	
	return {
		
		goTo: HorusService.goTo,
		controlDiasInt: function (successFn, errorFn) {
			return HorusService.authGet(URL+'/control_dias', successFn, errorFn);
		},
		/*Listado de internados segun matricula*/
		pacientesPorProfesional: function (matricula,successFn, errorFn) {
			return HorusService.authPost(URL+'/pacientesInternadosDeProfesional',matricula, successFn, errorFn);
		},
		datosIntPaciente: function (param,successFn, errorFn) {
			return HorusService.authGet(URL+'/datosInternacionPaciente/'+param, successFn, errorFn);
		},
		/**
		 * Epicrisis
		 */
		carpetasPorFiltro: function (param,successFn, errorFn) {
			return HorusService.authPost(URL+'/seguro/carpetasPorFiltro',param, successFn, errorFn);
		},
		actualizarAltaCarpeta: function (param,successFn, errorFn) {
			return HorusService.authPost(URL+'/seguro/actualizarAltaMedicaCarpeta',param, successFn, errorFn);
		},
		guardarEpicrisis: function (param,successFn, errorFn) {
			return HorusService.authPost(URL+'/epicrisis/seguro/guardarEpicrisis',param, successFn, errorFn);
		},
		/*Recibo nro carpeta y devuelvo la epicrisis*/
		getEpicrisis: function (param,successFn, errorFn) {
			return HorusService.authPost(URL+'/epicrisis/seguro/getEpicrisis',param, successFn, errorFn);
		},
		/*Recibo nro carpeta y devuelvo la epicrisis si esta cerrada*/
		getEpicrisisCerrada: function (param,successFn, errorFn) {
			return HorusService.authPost(URL+'/epicrisis/seguro/getEpicrisisCerrada',param, successFn, errorFn);
		},
		/*Recibo id carpeta y id epicrisis y devuelve la url del pdf*/
		getURLPdf: function (idCarpeta, idEpicrisis) {
			return HorusService.getURLHost()+ URL_UNSECURE + "/imprimir/pdf/"+idCarpeta+"/"+idEpicrisis+"/"+new Date().getTime();
		},
		/*Cierro la epicrisis*/
		cerrarEpicrisis: function (carpeta,successFn, errorFn) {
			return HorusService.authPost(URL_UNSECURE+'/seguro/cerrarEpicrisis',carpeta, successFn, errorFn);
		},
		/*get pdf HC Digitalizada*/
		getHCDigitalizada: function (param,successFn, errorFn) {
			return HorusService.getURLHost()+ URL_UNSECURE +'/getHCDigital/'+param;
		},
		
	};
});