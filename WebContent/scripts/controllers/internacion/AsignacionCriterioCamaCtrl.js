var AsignacionCriterioCamaCtrl = function($scope, $rootScope, $routeParams,
		$filter, CriterioDeCamasService, $window, $timeout) {

	/** *********FILTRO********* */
	$scope.filtrar = function(elementScope) {
		if (elementScope.nombreBusqueda) {
			$scope.paginador._elementos = $filter('filter')
					($scope.paginador.getActuales(),
							elementScope.nombreBusqueda);
			$scope.paginador.paginaActual = 1;
			$scope._ordenesOrdenacion['pieza'] = false;
			$scope.paginador.ordenarPor('pieza');
			$scope.paginador.actualizarLista();
		} else {
			$scope.paginador._elementos = $scope.paginador.getTodos();
			$scope._ordenesOrdenacion['pieza'] = false;
			$scope.paginador.ordenarPor('pieza');
			$scope.paginador.actualizarLista();
		}
	};

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};
	$scope.paginaActual = 1;

	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	// codigo, nombre, sucursal
	$scope._ordenesOrdenacion = [];
	// $scope._ordenesOrdenacion['carpeta'] = $scope._ORDEN_REVERSO;
	// $scope._ordenesOrdenacion['fechaIngreso'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['pieza'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['cama'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['criterio'] = $scope._ORDEN_REVERSO;

	$scope._criterioDeOrdenActual = 'pieza';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 10;

	$("#listarCriterios").dropdown();

	$scope.modificarCriterio = function(cama) {
		$scope.cama = cama;
		$scope.hayMensajes = false;
		$scope.paginaActual = $scope.paginador.paginaActual;
		if (cama.codigoCriterioDeAsignacion != "") {
			$("#listarCriterios").dropdown("set text",
					cama.criterioDeAsignacion);
		} else {
			$("#listarCriterios").dropdown("set text",
					"La cama no tiene criterio asignado");
		}
	};

	$scope.seleccionoCriterio = function(criterio) {
		if ($scope.cama) {
			$scope.cama.codigoCriterioDeAsignacion = criterio.codigo;
			$scope.cama.criterioDeAsignacion = '';
			$scope.hayMensajes = false;
		}
	};

	$scope.guardarModificacion = function() {
		CriterioDeCamasService.setCamaCriterio($scope.cama, function(response) {
			$scope.cargarCamas();
			$scope.hayMensajes = true;
			$scope.mensajes = {
				mensaje : response.mensaje,
				error : !response.ok
			};
		}, $rootScope.manageError);
	};

	$scope.cargarCamas = function() {
		/* Traigo todos los criterios de asignacion de cama */
		CriterioDeCamasService.getCamas(function(response) {
			$rootScope.manageListCallback($scope, response);
			$scope._ordenesOrdenacion['pieza'] = false;
			$scope.paginador.ordenarPor('pieza');
			$scope.paginador.setPaginaActual($scope.paginaActual);
			$scope.paginador.actualizarLista();
		}, $rootScope.manageError);
	};

	$scope.cancelar = function() {
		$scope.cama = {};
		$scope.hayMensajes = false;
		$("#listarCriterios").dropdown("set text", "Seleccione el criterio");
	};

	CriterioDeCamasService.getCriteriosDeAsignacion(function(response) {
		$scope.criterios = response.paginador.elementos;
	}, $rootScope.manageError);

	$scope.cargarCamas();

};