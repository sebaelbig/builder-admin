'use strict';
/**
 * PedidoCreate Controller
 */
var EpicrisisImprimirCtrl = function($scope, $rootScope, $window, $filter, InternacionService) {

	/*************
	 * Si cancela vuelve a donde lo llamaron
	 * *************************************************/
	$scope.cancelar = function(){
		$rootScope.goTo($rootScope.parametros.urlBack);
	};

	if ($rootScope.parametros.idEpicrisis != null && $rootScope.parametros.idCarpeta !=null) {
		
		$scope.pdfURL = InternacionService.getURLPdf( $rootScope.parametros.idCarpeta, $rootScope.parametros.idEpicrisis);
	}
	
	$scope.esIE = navigator.userAgent.indexOf("Trident/7")>0;
	
	
	/**************************************************************/
};