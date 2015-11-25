var InternadosProfesionalCtrl = function($scope, $rootScope, $routeParams,
		$filter, InternacionService, ServicioService, $window, Excel, $timeout) {
	// $scope.servicioActual = $rootScope.servicioActual;

	if ($rootScope.parametros.paginaActual) {
		$scope.paginaActual = $rootScope.parametros.paginaActual;
	} else {
		$scope.paginaActual = 1;
	}

	$scope.ver = function(e) {
		$rootScope.parametros.paginaActual = $scope.paginador.paginaActual;
		$rootScope.parametros.elem = e;
		$rootScope.parametros.backTo = '/internacion/pacientesPorProfesional';
		$rootScope.goTo("/internacion/ver_int_paciente");

	};

	$scope.verHistorialDelPaciente = function(e) {
		$rootScope.parametros.nroDocumento = e.dniPaciente;
		$rootScope.parametros.tipoDocumento = e.tipoDniPaciente;
		$rootScope.parametros.filtro = $scope.filtro;
		$rootScope.parametros.backTo = '/internacion/pacientesPorProfesional';
		$rootScope.goTo("/ver_historial_PacienteTurno");

	};

	$scope.volver = function() {
		$rootScope.parametros = {};
		$rootScope.parametros.paginaActual = $scope.paginaActual;
		$rootScope.goTo("/internacion/pacientesPorProfesional");
	};

	/** *********REFRESCAR**************** */
	$scope.consultar = function() {
		if ($scope.loggedUser) {
			$scope.rol_profesional = $scope.loggedUser.roles['MHE'];
			
			if ($scope.rol_profesional.valorTipoID) 
				$scope.matricula=$scope.rol_profesional.valorTipoID;

			InternacionService.pacientesPorProfesional($scope.matricula,function(response) {
				$rootScope.manageListCallback($scope, response);

				$scope.item = $scope.estadoActual;
				$scope.cant = $scope.paginador.getActuales().length;
				$scope.paginador.setPaginaActual($scope.paginaActual);
				/* Ordenar */
				$scope._ordenesOrdenacion['pieza'] = false;
				$scope.paginador.ordenarPor('pieza');
				$scope.paginador.actualizarLista();

			}, $rootScope.manageError);
		}

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
	$scope._ordenesOrdenacion['pieza'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['paciente'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['diagnostico'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['profCabecera'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['cantDias'] = $scope._ORDEN_REVERSO;

	$scope._criterioDeOrdenActual = 'pieza';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 8;

	/** ******* */
	if ($rootScope.parametros.elem) {

		$scope.elem = $rootScope.parametros.elem;

	} else {
		if ($scope.loggedUser) {
			$scope.rol_profesional = $scope.loggedUser.roles['MHE'];
			$scope.matricula=$scope.rol_profesional.valorTipoID;

			InternacionService.pacientesPorProfesional($scope.matricula,function(response) {
				$rootScope.manageListCallback($scope, response);

				$scope.item = $scope.estadoActual;
				$scope.cant = $scope.paginador.getActuales().length;
				$scope.paginador.setPaginaActual($scope.paginaActual);
				/* Ordenar */
				$scope._ordenesOrdenacion['pieza'] = false;
				$scope.paginador.ordenarPor('pieza');
				$scope.paginador.actualizarLista();

			}, $rootScope.manageError);
		}
	}
	;

};