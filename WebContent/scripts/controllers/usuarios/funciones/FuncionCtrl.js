'use strict';
/**
 * Funcion Funcion
 */
var FuncionCtrl = function($scope, $rootScope, $routeParams, FuncionService) {

	/***********************************************************************/
	var URL_BASE = "/usuarios/funciones";
	//Crear
	$scope.crear = function() {
		FuncionService.goTo(URL_BASE+"/crear");
	};
	//Actualizar
	$scope.editar = function(u) {
		FuncionService.goTo(URL_BASE+"/editar/"+u._id);
	};
	//Cancelar
	$scope.cancelar = function() {
		FuncionService.goTo(URL_BASE);
	};
	//Ver
	$scope.ver = function(u) {
		FuncionService.goTo(URL_BASE+"/ver/"+u._id);
	};
	//Listar
	$scope.listar = function() {
		FuncionService.goTo(URL_BASE);
	};
	/***********************************************************************/

	$scope.guardar = function () {

		$scope.currentFunction = $scope.guardar;
		FuncionService.guardar(
			$scope.funcion, 
			function(response) {
				if (response.ok) {
					$scope.funcion = response.data;
					$scope.ver($scope.funcion);
				}
			}, 
			$rootScope.manageError);
	};

	$scope.actualizar = function () {

		$scope.currentFunction = $scope.actualizar;
		FuncionService.actualizar(
			$scope.funcion, 
			function(response) {
				if (response.ok) {
					$scope.funcion = response.data;
					$scope.ver($scope.funcion);
				}
			}, 
			$rootScope.manageError);
	};

	$scope.list = function () {

		$scope.currentFunction = $scope.list;
		FuncionService.listar(function(response) {
			if (response.ok) {

				$scope.funcions = response.data;

			}
		}, function(err){console.error("ERROR AL LISTAR");console.error(err);});
	};

	$scope.eliminarTodo = function() {

		FuncionService.deleteAll(
			function(succes){
				$scope.list();
			},
			function(err){console.error(err)}
		);

	};


	/***********************************************************************/
	//Inicio
	/***********************************************************************/
	if (!$routeParams.id){
		$scope.funcion = {};
		$scope.list();
	}else{
		FuncionService.findById(
			$routeParams.id, 
			function(response) {
				if (response.ok) {

					var funcion = response.data;
					$scope.funcion = funcion;
				}
			},
			$rootScope.manageError
		);
	}

};