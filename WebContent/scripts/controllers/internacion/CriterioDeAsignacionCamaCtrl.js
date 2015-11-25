var CriterioDeAsignacionCamaCtrl = function($scope, $rootScope, $routeParams,
		$filter, CriterioDeCamasService, $window,  $timeout) {

//	$scope.criterio = {};
//	$scope.modificar = false;
//	$scope.tarea = "Guardar";

	$scope.modificarCriterio = function(c) {
		$scope.criterio.codigo = c.codigo;
		$scope.criterio.id=c.id;
		$scope.criterio.descripcion=c.descripcion;
		document.getElementById('codigo').readOnly = true;
		$scope.modificar = true;
		$scope.hayMensajes = false;
		$scope.tarea = "Modificar";
	};

	$scope.cancelar = function() {
		$scope.criterio = {};
		$scope.hayMensajes = false;
		$scope.modificar = false;
		document.getElementById('codigo').readOnly = false;
		$scope.tarea = "Guardar";
	};

	$scope.eliminarCriterio = function(c) {
		CriterioDeCamasService.eliminarCriteriosDeAsignacion(c, function(
				response) {
			$scope.refresh();
			$scope.hayMensajes = true;
			$scope.mensajes = {
				mensaje : response.mensaje,
				error : !response.ok
			};
		}, $rootScope.manageError);
	};

	$scope.guardarCriterio = function() {
		if ($scope.modificar) {
			CriterioDeCamasService.modificarCriteriosDeAsignacion(
					$scope.criterio, function(response) {
						$scope.refresh();
						$scope.hayMensajes = true;
						$scope.mensajes = {
							mensaje : response.mensaje,
							error : !response.ok
						};
					}, $rootScope.manageError);
		} else {
			if ($scope.criterio.codigo && $scope.criterio.descripcion
					&& $scope.criterio.codigo != ""
					&& $scope.criterio.descrpcion != "") {
				CriterioDeCamasService.guardarCriteriosDeAsignacion(
						$scope.criterio, function(response) {
							$scope.refresh();
							$scope.hayMensajes = true;
							$scope.mensajes = {
								mensaje : response.mensaje,
								error : !response.ok
							};
						}, $rootScope.manageError);
			} else {
				$scope.hayMensajes = true;
				$scope.mensajes = {
					mensaje : "Debe completar los campos",
					error : true
				};
			}
		}
	};

	$scope.refresh = function() {
		$scope.criterio = {};
		$scope.modificar = false;
		$scope.hayMensajes = false;
		$scope.tarea = "Guardar";
		/* Traigo todos los criterios de asignacion de cama */
		CriterioDeCamasService.getCriteriosDeAsignacion(function(response) {
			$rootScope.manageListCallback($scope, response);
		}, $rootScope.manageError);
	};

	$scope.refresh();

};