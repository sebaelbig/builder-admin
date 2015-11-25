'use strict';
/**
 * PedidoCreate Controller
 */
var PedidoPacienteImprimirCtrl = function($scope, $rootScope, $routeParams, $filter, $sce, $http, $timeout, PedidoService, TemplateService) {

	
	$scope.cancelar = function(){
		/*if($rootScope.parametros.urlBack=="/listar_pedidos_paciente"){
			$rootScope.parametros.idPedido=null;
		}*/
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
	/*$scope.servicioActual = $rootScope.servicioActual;
	
	//insertar(p)
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = true;
	$scope.generandoPDF = true;
	
	/**************************************************************
	$scope.cancelar = function(){
		//	$rootScope.goTo("/listar_pedidos_paciente");
		$rootScope.cancelar();		
	};
	
	
	$scope.generarPDF = function(){
	       
       $scope.haciendo = false;
		window.print();
	};
	
	//Esta funcion solo se utiliza en los Controllers que tembien listan
	$scope.list = function () {};
	
	/************************************************************
	/*						INICIO	    						*
	/************************************************************
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false};
		$scope.haciendo = false;
	};
	
	$scope.setElemento = function(elem){
		$scope.elemento = elem;
		
		TemplateService.buscar(
				$scope.elemento.nombreServicio,
				function(resp){
					if (resp.ok){
						
						if ( resp.paginador.elementos.length == 0){
							
							$scope.haciendo = false;
							
							$scope.hayMensajes = true;
							$scope.mensajes = {mensaje:"ERROR, no se puede imprimir, NO hay una plantilla asociada al servicio: "+$scope.elemento.nombreServicio, error:true} ;
							
						}else{
							
							$scope.template = resp.paginador.elementos[0];
							var propTemp, item;
							
							$scope.listaAImprimir = [];
							for ( var ix_propTemp = 0; ix_propTemp < $scope.template.propiedades.length; ix_propTemp++) {
								
								propTemp = $scope.template.propiedades[ix_propTemp];
								
								//Obtengo el atributo que figura en el template
								item = { estilo: {"width": propTemp.ancho+"%"},
										label : propTemp.contenido,
										valor : $scope.elemento[propTemp.propiedad.atributo]
								};
								
								$scope.listaAImprimir.push(item); //Le meto TimeOut para que renderice las propiedades
							}
							
							
							$scope.haciendo = false;
							
							$timeout($scope.generarPDF, 0);
							
						}
					}
				},
				function(err){console.error("Error al recuperar el template del serivico.");}
		);
		
	};
	
	$scope.haciendo = true;
	
	if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio !=null) {
		//Es un estudio por pedido
		PedidoService.findByIdByEstudio(
			$rootScope.parametros,
			function(response) {
				$scope.setElemento(response);
			},
			$rootScope.manageError
		);
			
	}else{
		if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio ==null) {
		//if (PedidoService.id != null && PedidoService.idEstudio ==null) {
			//Se edita el pedido solamente
			
			PedidoService.findById(
				$rootScope.parametros,
				function(response) {
					$scope.setElemento(response);
				},
				$rootScope.manageError
			);
		}
	}
	
	
	/**************************************************************/
};