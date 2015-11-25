'use strict';
/**
 * Propiedad Controller
 */
var PropiedadCtrl = function($scope, $rootScope, $routeParams, $filter, PropiedadService) {

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
		
		if ($scope.elemento.nombre && $scope.elemento.atributo){
			
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
		
		PropiedadService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError);
	};

	$scope.modificar = function () {

		PropiedadService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		PropiedadService.listar(
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
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['atributo'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'nombre';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'nombre': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la propiedad "+e.nombre;
		
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
		PropiedadService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
				},
				$rootScope.manageError);
	};
	/************************************************************/
	
	$scope.elementos = [];
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, ancho:100, margen:0};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.resetElemento();
	if (!$routeParams.idPropiedad){
		
		$scope.list();
		
	}else{
		PropiedadService.findById(
			$routeParams.idPropiedad, 
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