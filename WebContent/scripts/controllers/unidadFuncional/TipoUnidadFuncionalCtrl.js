'use strict';
/**
 * Unidad de medida Controller
 */
var TipoUnidadFuncionalCtrl = function($scope, $rootScope, $routeParams, $filter, TipoUnidadFuncionalService) {

	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.haciendo = false;
	$scope.modificando = false;
	$scope.elemento={};
	$scope.elemento.nombre="Prueba";
	/** *********************************************************** */
	$scope.editar = function(e) {
		$('html, body').animate({
			scrollTop : 0
		}, 800);
		$scope.hayMensajes = false;
		$scope.modificando = true;

		$scope.elemento = e;
	
	};

	$scope.cancelar = function() {
		$scope.resetElemento();
		$scope.list();
	};

	$scope.guardar = function() {

		if ($scope.elemento.descripcion && $scope.elemento.nombre) {

			$scope.hayMensajes = false;
			$scope.haciendo = true;

			if (!$scope.modificando) {
				$scope.crear();
			} else {
				$scope.modificar();
			}
		}
	};

	$scope.crear = function() {

		TipoUnidadFuncionalService.crear($scope.elemento, function(resp) {
			$scope.mensajes = {
					mensaje : resp.mensaje,
					error : !resp.ok
				};
			$rootScope.manageSaveCallback($scope, resp);
		}, $rootScope.manageError);
	};

	$scope.modificar = function() {

		$scope.currentFunction = $scope.actualizar;
		TipoUnidadFuncionalService.modificar($scope.elemento, function(resp) {
			$rootScope.manageSaveCallback($scope, resp);
			$scope.modificando = !resp.ok;// Si paso algo, ok es
			// falso, asi que seguimos
			// modificando
		}, $rootScope.manageError);
	};
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el servicio "+e.nombre;
		
		e.borrado = true;
		$('#modalEliminar').dimmer({closable:false}).dimmer('show');
	};
	
	// 1.1 Cancela
	$scope.cancelarEliminar = function(){
		$('#modalEliminar').dimmer('hide');
		$scope.borrando.borrado = false;
		$scope.borrando = null;
		
	};

	// 1.2 Confirma
	$scope.eliminar = function() {
		TipoUnidadFuncionalService.eliminar($scope.borrando, function(resp) {
			$rootScope.manageDeleteCallback($scope, resp);
			$('#modalEliminar').dimmer('hide');
		}, $rootScope.manageError);
	};
	
	$scope.resetElemento = function(){
		$scope.elemento = {};
		$scope.haciendo = false;
		$scope.modificando = false;
	
	};
	/** ********************************************************* */

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};

	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	// codigo, nombre, area
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['id'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['descripcion'] = $scope._ORDEN_REVERSO;

	// Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'codigo';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	/** ********************************************************* */

	TipoUnidadFuncionalService.listar("", function(response) {
		$rootScope.manageListCallback($scope, response);
		$scope.elementos = response.paginador.elementos;
	}, $rootScope.manageError);
	
	$scope.list=function(){
		TipoUnidadFuncionalService.listar("", function(response) {
			$rootScope.manageListCallback($scope, response);
			$scope.elementos = response.paginador.elementos;
		}, $rootScope.manageError);

	};

	/** *********************************************************** */
};