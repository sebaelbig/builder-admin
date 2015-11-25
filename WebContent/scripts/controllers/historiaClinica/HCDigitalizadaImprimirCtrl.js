'use strict';
/**
 * PedidoCreate Controller
 */
var HCDigitalizadaImprimirCtrl = function($scope, $rootScope, $window, $filter, InternacionService) {

	/*************
	 * Si cancela vuelve a donde lo llamaron
	 * *************************************************/
	$scope.cancelar = function(){
		$rootScope.goTo($rootScope.parametros.urlBack);
	};

	if ($rootScope.parametros.idCarpeta !=null) {
		
		$scope.pdfURL = InternacionService.getHCDigitalizada( $rootScope.parametros.idCarpeta );
	}
	
	$scope.esIE = navigator.userAgent.indexOf("Trident/7")>0;
	
	
	/**************************************************************/
};