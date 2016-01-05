'use strict';
/**
 * Unidad de medida Controller
 */
var UnidadDeMedidaCtrl = function($scope, $rootScope, $routeParams, $filter,
		UnidadDeMedidaService) {

	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.haciendo = false;
	$scope.modificando = false;

	/** *********************************************************** */
	$scope.editar = function(e) {
		$('html, body').animate({
			scrollTop : 0
		}, 800);
		$scope.hayMensajes = false;
		$scope.modificando = true;

		$scope.elemento = e;
		$scope.seleccionoServicioHE({
			'nombre' : $scope.elemento.nombre
		});

		var ar = $scope.areas[$scope.elemento.area.nombre.toLowerCase()];

		// Selecciono el tipo por default y lo seteo en la vista si tiene alguno
		// establecido x default
		$scope.seleccionoArea(ar);
	};

	$scope.cancelar = function() {
		$scope.resetElemento();
		$scope.list();
	};

	$scope.guardar = function() {

		if ($scope.elemento.codigo && $scope.elemento.nombre
				&& $scope.elemento.area.codigo) {

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

		ServicioService.crear($scope.elemento, function(resp) {
			$rootScope.manageSaveCallback($scope, resp);
		}, $rootScope.manageError);
	};

	$scope.modificar = function() {

		$scope.currentFunction = $scope.actualizar;
		ServicioService.modificar($scope.elemento, function(resp) {
			$rootScope.manageSaveCallback($scope, resp);
			$scope.modificando = !resp.ok;// Si paso algo, ok es
			// falso, asi que seguimos
			// modificando
		}, $rootScope.manageError);
	};

	// 1.2 Confirma
	$scope.eliminar = function() {
		ServicioService.eliminar($scope.borrando, function(resp) {
			$rootScope.manageDeleteCallback($scope, resp);
			$('#modalEliminar').dimmer('hide');
		}, $rootScope.manageError);
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

	UnidadDeMedidaService.listar(function(response) {
		if (response.ok) {
			$scope.elementos = response.paginador.elementos;
		}
	}, $rootScope.manageError);

	/** *********************************************************** */
};