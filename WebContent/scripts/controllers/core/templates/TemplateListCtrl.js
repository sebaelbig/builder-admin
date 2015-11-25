'use strict';
/**
 * TemplateList Controller
 */
var TemplateListCtrl = function($scope, $rootScope, $routeParams, $filter, TemplateService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = true;
	
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
//		$rootScope.goTo("/template/editar/"+e.id);
		TemplateService.id = e.id;
		$rootScope.goTo("/_modificar_template");
	};
	
	$scope.crear = function () {
		TemplateService.id = null;
		$rootScope.goTo("/_crear_template");
	};


	$scope.list = function () {
		
		TemplateService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};
	
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, sucursal 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['nombreServicio'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'nombreServicio';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'nombreServicio': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el template de serivico "+e.nombreServicio;
		$scope.borrando.btnLoading = false;
		
		e.borrado = true;
		$('#modalEliminar').dimmer({closable:false}).dimmer('show');
	};
	
	// 1.1 Cancela
	$scope.cancelarEliminar = function(){
		$('#modalEliminar').dimmer('hide');
		$scope.borrando.borrado = false;
		$scope.borrando = null;
		
	};
	//1.2 Confirma
	$scope.eliminar = function () {
		$scope.borrando.btnLoading = true;
		TemplateService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
					$scope.borrando.btnLoading = false;
				},
				$rootScope.manageError);
	};
	
	/************************************************************/
	$scope.elementos = [];
	
	if (!$routeParams.idTemplate){
		
		$scope.list();
		
	}else{
//		TemplateService.goTo("/template/editar/"+$routeParams.idTemplate);	
		TemplateService.id = $routeParams.idTemplate;
		TemplateService.goTo("/modificar_template");	
	}
	
	/**************************************************************/
};