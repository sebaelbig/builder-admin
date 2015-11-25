/**

} * Templates de descripcion - Service
 */
var server = angular.module('services');

server.factory('PedidoService', function(HorusService) {
	
	var URL = "/historiaClinica/pedidos/seguro";
	var URL_UNSECURE = "/historiaClinica/pedidos";
	
	return {
		
		id: null,
		idEstudio: null,
		
		cancelando: false,
		goTo: HorusService.goTo,
		
		buscar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/buscar/'+params, successFn, errorFn);
		},
		listar: function (successFn, errorFn) {
			return HorusService.authGet(URL+"/listAll", successFn, errorFn);
		},
		findByNro: function ( params,successFn, errorFn) {
			return HorusService.authGet(URL+'/findByNro/'+params.idPedido, successFn, errorFn);
		},
		findById: function ( params, successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+ params.idPedido, successFn, errorFn);
		},
		findByIdByEstudio: function ( params, successFn, errorFn) {
			return HorusService.authGet(URL+'/findByIdByEstudio/'+params.idPedido+"/"+params.idEstudio, successFn, errorFn);
		},
		findByIdBloqueante: function ( params, successFn, errorFn) {
			return HorusService.authGet(URL+'/findByIdBloqueante/'+ params.idPedido, successFn, errorFn);
		},
		findByIdByEstudioBloqueante: function ( params, successFn, errorFn) {
			return HorusService.authGet(URL+'/findByEstudioBloqueante/'+params.idPedido+"/"+params.idEstudio, successFn, errorFn);
		},
		informar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/informar", params, successFn, errorFn);
		},
		cancelar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/cancelar", params, successFn, errorFn);
		},
		confirmar: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/confirmar", params, successFn, errorFn);
		},
		imprimirPdf: function (idPedido, idEstudio, successFn, errorFn) {
			return HorusService.pdfGet(URL_UNSECURE + "/imprimir/pdf/"+idPedido+"/"+idEstudio, successFn, errorFn);
		},
		getURLPdf: function (idPedido, idEstudio) {
			return HorusService.getURLHost()+ URL_UNSECURE + "/imprimir/pdf/"+idPedido+"/"+idEstudio+"/"+new Date().getTime();
		},
		ver: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/ver", params, successFn, errorFn);
		},
		reabrir: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/reabrir", params, successFn, errorFn);
		},
		desbloquear: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+'/desbloquear', params, successFn, errorFn);
		},
		
		listarDeServicioDeUsuario: function (usuario, successFn, errorFn) {
			return HorusService.authGet(URL+"/listarDeServicioDeUsuario", successFn, errorFn);
		},
		
		listarDeServicio: function (servicio, successFn, errorFn) {
			return HorusService.authPost(URL+"/listarDeServicio", servicio, successFn, errorFn);
		},
		listarDePaciente: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+"/listarDePaciente/"+params.idPedido,  successFn, errorFn);
		},
		/* traigo tipo+nroDni del pacienteLogeado */
		getDatosDePacienteWeb: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/getDatosDePacienteWeb", params, successFn, errorFn);
		},
		listarPedidosPorFiltro: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/listarPedidosPorFiltro", params, successFn, errorFn);
		},
		getMensajes: function (numero, successFn, errorFn) {
			return HorusService.authGet(URL+"/mensajes/"+numero,  successFn, errorFn);
		},
		agregarMensaje: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/mensajes/", params,  successFn, errorFn);
		},
		encontrarUltimoEstudio: function ( params, successFn, errorFn) {
			return HorusService.authPost(URL+'/ultimo/',params, successFn, errorFn);
		},
		estados: function ( successFn, errorFn) {
			return HorusService.get(URL_UNSECURE+'/estados','', successFn, errorFn);
		},
		modalidades: function ( successFn, errorFn) {
			return HorusService.get(URL_UNSECURE+'/modalidades','', successFn, errorFn);
		},
		listarPedidosEnCtg: function (fecha, successFn, errorFn) {
			return HorusService.authPost(URL_UNSECURE+'/getPedidosCtg',fecha, successFn, errorFn);
		},
		setEstadoPedidoEna: function (nroPedido, successFn, errorFn) {
			return HorusService.authPost(URL_UNSECURE+'/setPedidoEnAtencion',nroPedido, successFn, errorFn);
		},
		registrarNuevoPedido: function (nroPedido, successFn, errorFn)  {
			return HorusService.httpGet(URL_UNSECURE + '/registrarNuevoPedido/'+nroPedido, successFn, errorFn);
		}
		
	};
});