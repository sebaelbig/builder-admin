var HistorialPacienteCtrl = function($scope, $rootScope, $routeParams, $filter,
		PacienteService, $window, Excel, $timeout) {
	/**
	 * Carlalu
	 */

	$scope.dni = '';
	$scope.nombre = '';

	$scope.changeApellido = function() {
		if (($scope.filtro.apellido != "")
				&& (!$scope.filtro.nombre || $scope.filtro.nombre == '')) {
			document.getElementById("nombre").className += " error";
		} else {
			if($scope.filtro.apellido == "" && $scope.filtro.nombre == ""){
				document.getElementById("apellido").className = "ui input";
				document.getElementById("nombre").className = "ui input";
			}else{
				if($scope.filtro.apellido == "" && $scope.filtro.nombre != ""){
					document.getElementById("apellido").className = " error";
				}else{
					document.getElementById("nombre").className = "ui input";
				}
			}

		}
	};
	$scope.changeNombre = function() {
		if (($scope.filtro.nombre != "")
				&& (!$scope.filtro.apellido || $scope.filtro.apellido == '')) {
			document.getElementById("apellido").className += " error";
		} else {
			if($scope.filtro.apellido == "" && $scope.filtro.nombre == ""){
				document.getElementById("apellido").className = "ui input";
				document.getElementById("nombre").className = "ui input";
			}else{
				if($scope.filtro.apellido != "" && $scope.filtro.nombre == ""){
					document.getElementById("nombre").className = " error";
				}else{
					document.getElementById("apellido").className = "ui input";
				}
			}
		}
	};

	/** ***buscarPaciente()*** */
	$scope.buscarPaciente = function() {
		if ($scope.filtro) {
			if ($scope.filtro.dni != ''
					|| (($scope.filtro.nombre != '') && ($scope.filtro.apellido != ''))) {
				$scope.bapellido = $scope.filtro.apellido;
				$scope.bnombre = $scope.filtro.nombre;
				$scope.buscardni = $scope.filtro.dni;
				if (!$scope.filtro.dni || $scope.filtro.dni == '') {
					$scope.buscardni = -1;
				}
				if ((!$scope.filtro.nombre) || (!$scope.filtro.apellido)
						|| ($scope.filtro.nombre == '')
						&& ($scope.filtro.apellido == '')) {
					$scope.bnombre = -1;
					$scope.bapellido = -1;
				}
				PacienteService.buscarPaciente($scope.bapellido,
						$scope.bnombre, $scope.buscardni, function(response) {
							$rootScope.manageListCallback($scope, response);

						}, $rootScope.manageError);
			} else {
				$scope.elementos = [];
			}
		} else {
			$scope.elementos = [];
		}
	};

	$scope.verHistorialDelPaciente = function(e) {
		$rootScope.parametros.nroDocumento = e.nroDocumento;
		$rootScope.parametros.tipoDocumento = e.tipoDocumento;
		$rootScope.parametros.filtro = $scope.filtro;
		$rootScope.parametros.backTo = '/identificacion_de_pacientes';
		$rootScope.goTo("/ver_historial_PacienteTurno");

	};
	
	/** *********FILTRO********* */
	$scope.filtrar = function(elementScope) {
		if (elementScope.nombreBusqueda) {
			$scope.paginador._elementos = $filter('filter')
					($scope.paginador.getActuales(),
							elementScope.nombreBusqueda);
			$scope.paginador.paginaActual = 1;
			$scope.paginador.actualizarLista();
		} else {
			$scope.paginador._elementos = $scope.paginador.getTodos();
			$scope.paginador.actualizarLista();
		}
	};

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};
	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	// codigo, nombre, sucursal
	$scope._ordenesOrdenacion = [];
	// $scope._ordenesOrdenacion['carpeta'] = $scope._ORDEN_REVERSO;
	// $scope._ordenesOrdenacion['fechaIngreso'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['apellido'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['fechaNacimiento'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nroDocumento'] = $scope._ORDEN_REVERSO;

	$scope._criterioDeOrdenActual = 'apellido';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 6;

	if ($rootScope.parametros.filtro) {
		$scope.filtro = $rootScope.parametros.filtro;
		$scope.buscarPaciente();
	}
};