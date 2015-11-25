'use strict';
/**
 * PedidoCreate Controller
 */
var PedidoDePacienteImprimirCtrl = function($scope, $rootScope, $routeParams, $filter, $sce, $http, $timeout, PedidoService, TemplateService) {

	/*************
	 * 
	 * *************************************************/
	$scope.cancelar = function(){
		$rootScope.parametros.idPedido=null;
		//PedidoService.id = null;
		$rootScope.goTo("/listarPedidos_DePaciente");
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
	
};

/**************************************************************/
//$scope.cancelar = function(){
//	$rootScope.parametros={};
//	$rootScope.goTo("/listarPedidos_DePaciente");
//};
//
//
//$scope.generarPDF = function(){
//	
////	var host = document.URL.substr(document.URL.indexOf("//") + 2, document.URL.indexOf(":8090") - 7);
////	var horusServiceUrl = "http://" + host + ":8090/horus_restfull/api";
////	var post = horusServiceUrl+"/historiaClinica/pedidos/imprimir";
////
////	var htmlAImprimir 	 = "<html><body>"; 
////	var htmlAImprimir 	= $("#impresion").html(); 
////	htmlAImprimir 		+= "</body></html>"; 
////	
////	$http.post(post,
////			htmlAImprimir,
////			{responseType:'arraybuffer'}
////	
////	).success(function (response) {
////	       var file = new Blob([response], {type: 'application/pdf'});
////	       var fileURL = URL.createObjectURL(file);
////	       
////	       $scope.pdf = $sce.trustAsResourceUrl(fileURL);
////	       
//	       $scope.haciendo = false;
////	       $scope.generandoPDF = false;
////	});
//	
////	PedidoService.imprimir(
////			,
////			function(resp){
////				console.info(resp)
////			}
////			);
//	       
//	       //IMPRIME
////	window.print();
//};
//
////Esta funcion solo se utiliza en los Controllers que tembien listan
//$scope.list = function () {};
//
///************************************************************/
///*						INICIO	    						*/
///************************************************************/
//$scope.resetElemento = function(){
//	$scope.elemento = {borrado:false};
//	$scope.haciendo = false;
//};
//
//$scope.setElemento = function(elem){
//	$scope.elemento = elem;
//	
//	TemplateService.buscar(
//			$scope.elemento.nombreServicio,
//			function(resp){
//				if (resp.ok){
//					
//					if ( resp.paginador.elementos.length == 0){
//						
//						$scope.haciendo = false;
//						
//						$scope.hayMensajes = true;
//						$scope.mensajes = {mensaje:"ERROR, no se puede imprimir, NO hay una plantilla asociada al servicio: "+$scope.elemento.nombreServicio, error:true} ;
//						
//					}else{
//						
//						$scope.template = resp.paginador.elementos[0];
//						var propTemp, item;
//						
//						$scope.listaAImprimir = [];
//						for ( var ix_propTemp = 0; ix_propTemp < $scope.template.propiedades.length; ix_propTemp++) {
//							
//							propTemp = $scope.template.propiedades[ix_propTemp];
//							
//							//Obtengo el atributo que figura en el template
//							item = { estilo: {"width": propTemp.ancho+"%"},
//									label : propTemp.contenido,
//									valor : $scope.elemento[propTemp.propiedad.atributo]
//							};
//							
//							$scope.listaAImprimir.push(item); //Le meto TimeOut para que renderice las propiedades
//						}
//						
//						
//						$scope.haciendo = false;
//						
//						$timeout($scope.generarPDF, 0);
//						
//					}
//				}
//			},
//			function(err){console.error("Error al recuperar el template del serivico.");}
//	);
//	
//};
//
//$scope.haciendo = true;
//
///*if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio !=null) {
////if ($rootScope.parametros != null) {	
//	//Es un estudio por pedido
//	PedidoService.findByIdByEstudio(
//		$rootScope.parametros,
//		function(response) {
//			$scope.setElemento(response);
//		},
//		$rootScope.manageError
//	);
//}else{
//	if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio ==null) {
//		//Se edita el pedido solamente
//		
//		PedidoService.findById(
//			$rootScope.parametros,
//			function(response) {
//				$scope.setElemento(response);
//			},
//			$rootScope.manageError
//		);
//	}
//}*/
//
//if ($rootScope.parametros.idPedido) {	
//	PedidoService.findById(
//		$scope.parametros,
//		function(response) {
//			$scope.setElemento(response);
//		},
//		$rootScope.manageError
//	);
//}
//


