'use strict';
/**
 * Sucursal Controller
 */
var SucursalCtrl = function($scope, $rootScope, $routeParams, $filter, SucursalService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		$('html, body').animate({scrollTop : 0},800);
		$scope.hayMensajes = false;
		$scope.elemento = e;
		$scope.modificando = true;
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
	};
	
	$scope.guardar = function () {
		
		if($scope.elemento.codigo && $scope.elemento.nombre && $scope.elemento.telefono){
			
			$scope.hayMensajes = false;
			$scope.haciendo = true;
			
			if (!$scope.modificando){
				$scope.crear();
			}else{
				$scope.modificar();
			}
			
			$scope.modificando = false;
		}
	};
	
	$scope.crear = function () {
		
		SucursalService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError);
	};

	$scope.modificar = function () {

		$scope.currentFunction = $scope.actualizar;
		SucursalService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				},  
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		SucursalService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};

	/**************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la sucursal "+e.nombre;
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
		SucursalService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
					$scope.borrando.btnLoading = false;
				},
				$rootScope.manageError);
	};
	/************************************************************/
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, area 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['codigo'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'codigo';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'nombre': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/**************************************************************/
	$scope.elementos = [];
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.resetElemento();
	if (!$routeParams.idSucursal){
		$scope.list();
	}else{
		SucursalService.findById(
			$routeParams.idSucursal, 
			function(response) {
				if (response.ok) {

					var elemento = response.data;
					$scope.elemento = elemento;
				}
			},
			$rootScope.manageError
		);
	}
	/**************************************************************/
	
};