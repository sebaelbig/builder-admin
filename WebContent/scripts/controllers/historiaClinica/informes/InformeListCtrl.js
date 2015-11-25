'use strict';
/**
 * InformeListCtrl Controller
 */
var InformeListCtrl = function($scope, $rootScope, $routeParams, $filter, InformeService) {

	$scope.servicioActual = $rootScope.servicioActual;
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = true;
	
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		InformeService.id = e.id;
		$rootScope.goTo("/editar_informe");
	};
	
	$scope.crear = function () {
		InformeService.id = null;
		$rootScope.goTo("/crear_informe");
	};


	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		InformeService.listar(
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
	$scope._ordenesOrdenacion['titulo'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'titulo';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'titulo': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la plantilla pública "+e.titulo;
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
		InformeService.eliminar(
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
	
	if (!$routeParams.idInforme){
		
		$scope.list();
		
	}else{
		InformeService.id = $routeParams.idInforme;
		InformeService.goTo("/editar_informe");	
	}
	
	/**************************************************************/
};