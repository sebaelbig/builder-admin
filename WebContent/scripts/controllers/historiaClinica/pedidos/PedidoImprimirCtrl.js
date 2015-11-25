'use strict';
/**
 * PedidoCreate Controller
 */
var PedidoImprimirCtrl = function($scope, $rootScope, $window, $filter, PedidoService) {

	/*************
	 * Si cancela vuelve a donde lo llamaron
	 * *************************************************/
	$scope.cancelar = function(){
		if($rootScope.parametros.urlBack=="/anular_informe"){
			$rootScope.parametros.idPedido=null;
		}
		$rootScope.goTo($rootScope.parametros.urlBack);
	};

	if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio !=null) {
		
		$scope.pdfURL = PedidoService.getURLPdf($rootScope.parametros.idPedido, $rootScope.parametros.idEstudio);
	}else{
		if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio ==null) {
			//Se edita el pedido solamente
			$scope.pdfURL = PedidoService.getURLPdf($rootScope.parametros.idPedido, $rootScope.parametros.idPedido);
		}
	}
	
	$scope.esIE = navigator.userAgent.indexOf("Trident/7")>0;
	
	
	/**************************************************************/
};