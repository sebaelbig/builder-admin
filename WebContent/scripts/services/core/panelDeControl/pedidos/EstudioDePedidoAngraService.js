/**

 * Templates de descripcion - Service
 */
var server = angular.module('services');

server.factory('EstudioDePedidoAngraService', function(HorusService) {
	
	var URL = "/panelDeControl/pedidos/seguro";
	
	return {
		
		findByAccessionNumber: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+"/findByAccessionNumber/"+ params.accesionNumber, successFn, errorFn);
		},
		
		listarPedidosPorFiltro: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+"/listarPedidosPorFiltro", params, successFn, errorFn);
		}
		
	};
});