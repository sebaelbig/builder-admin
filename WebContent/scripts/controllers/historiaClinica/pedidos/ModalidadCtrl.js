'use strict';
/**
 * Modalidad Controller
 */
var ModalidadCtrl = function($scope,$rootScope,$routeParams,$filter,ModalidadService) {
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		
		$('html, body').animate({scrollTop : 0},800);
		
		$scope.setElemento(e);
		$scope.hayMensajes = false;
		$scope.modificando = true;
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
	};
	
	$scope.guardar = function () {
		
		if ($scope.elemento.codigo ){ //&& $scope.elemento.descripcion
			
			$scope.hayMensajes = false;
			$scope.haciendo = true;
			
			if (!$scope.modificando){
				$scope.crear();
			}else{
				$scope.modificar();
			}
		}
		
//		$scope.modificando = false;
	};
	
	$scope.crear = function () {
		
		ModalidadService.crear(
				$scope.elemento, 
				function(resp){$rootScope.manageSaveCallback($scope, resp);},
				$rootScope.manageError);
	};
	
	$scope.modificar = function () {
		
		ModalidadService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};
	
	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		ModalidadService.listar(
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
	$scope._ordenesOrdenacion['codigo'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['descripcion'] = $scope._ORDEN_REVERSO;
	
	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'descripcion';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'descripcion': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la modalidad "+e.descripcion;
		
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
		ModalidadService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
				},
				$rootScope.manageError);
	};
	
	/************************************************************/
	
	$scope.elementos = [];
	
	$scope.setElemento = function(elemento){
		
		$scope.elemento = elemento;
		
		$scope.haciendo = false;
	};
	
	$scope.resetElemento = function(){
		$scope.elemento = {};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.resetElemento();
	if (!$routeParams.idModalidad){
		
		$scope.list();
		
	}else{
		ModalidadService.findById(
				$routeParams.idModalidad, 
				function(response) {
					if (response.ok) {
						$scope.setElemento(response.data);
						$scope.modificando = true;
					}
				},
				$rootScope.manageError
		);
	}
	
	/**************************************************************/
};