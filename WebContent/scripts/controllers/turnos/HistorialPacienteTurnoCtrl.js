var HistorialPacienteTurnoCtrl = function($scope, $rootScope, $routeParams,
		$filter, PacienteService, InternacionService, $window, Excel, $timeout) {
	/**
	 * Carlalu
	 */

	$scope.cargando = true;
	$scope.ocultarPopUpEipicrisis = function() {
		$("#noHayEpicrisis").modal("hide");

	};

	/* Volver */
	$scope.cancelar = function() {
		$rootScope.goTo($rootScope.parametros.backTo);
	};
	
	/*Ver HC Digitalizada*/
	$scope.verHCDigital= function(e){
		$rootScope.parametros.idCarpeta=e.idEpisodio;
		$rootScope.parametros.urlBack = "/ver_historial_PacienteTurno";
		$rootScope.goTo("/imprimir_hcdigital");
	};
	
	/* Abro la epicrisis */
	$scope.verEpicrisis = function(e) {
		/* ver caso q no hay epicrisis */
		InternacionService
				.getEpicrisisCerrada(
						e.idEpisodio,
						function(response) {
							$rootScope.manageListCallback($scope, response);
							if (response.ok && response.paginador.elementos
									&& response.paginador.elementos[0] != null) {

									$rootScope.parametros.idEpicrisis = response.paginador.elementos[0].id;
									$rootScope.parametros.idCarpeta = e.idEpisodio;
									$rootScope.parametros.urlBack = "/ver_historial_PacienteTurno";
									$rootScope.goTo("/imprimir_epicrisis");
							} else {
								$("#noHayEpicrisis").modal("show");
							}
						}, $rootScope.manageError);

	};

	/* ver pedido */
	$scope.verPedido = function(e) {
		$rootScope.parametros.idPedido = e.idEpisodio;
		/*
		 * if (e.unEstudioPorPedido){ //Si es un estudio por pedido, seteo el id
		 * del estudio a ser modificado $rootScope.parametros.idEstudio =
		 * e.estudiosPaciente[0].id; }
		 * 
		 * $scope.desconectarWSs();
		 */
		$rootScope.parametros.urlBack = "/ver_historial_PacienteTurno";
		// $scope.actualizarFiltro();
		$rootScope.goTo("/ver_informe");
	};

	/* Imprimir Pedido */
	$scope.imprimirPedido = function(e) {
		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.idEpisodio;
		/*
		 * if (e.unEstudioPorPedido){ //Si es un estudio por pedido, seteo el id
		 * del estudio a ser modificado $rootScope.parametros.idEstudio =
		 * e.estudiosPaciente[0].id; }
		 * 
		 * $scope.desconectarWSs();
		 */
		$rootScope.parametros.urlBack = "/ver_historial_PacienteTurno";
		// $scope.actualizarFiltro();
		$rootScope.goTo("/imprimir_informe");
	};

	/** *********FILTRO********* */
	$scope.filtrar = function(elementScope) {
		if (elementScope.nombreBusqueda) {
			$scope.paginador._elementos = $filter('filter')(
					$scope.paginador._todosLosElementos,
					elementScope.nombreBusqueda);
			$scope.paginador.paginaActual = 1;
			$scope.paginador.actualizarLista();
		}
	};

	/** *********************************************** */
	/* refresh */
	$scope.refresh = function() {
		PacienteService
				.datosDePaciente(
						$rootScope.parametros.nroDocumento,
						$rootScope.parametros.tipoDocumento,
						function(response) {
							$scope.paciente = response;
							if (!$scope.paciente.fechaNacimiento) {
								$scope.paciente.edad = "";
							}
					}, $rootScope.manageError);
		PacienteService
		.historialDePaciente(
				$rootScope.parametros.nroDocumento,
				$rootScope.parametros.tipoDocumento,
				function(response) {
					$rootScope.manageListCallback(
							$scope, response);
					$scope.paginador.ordenesOrdenacion['fechast'] = true;
					$scope.paginador.ordenarPorFecha('fechast');
				}, $rootScope.manageError);
	};

	/** ********************************************** */

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};

	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;

	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['idEpisodio'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['fechast'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombreProfesional'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['especialidadAtencion'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['observacion'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['tipoEpisodio'] = $scope._ORDEN_REVERSO;

	$scope._criterioDeOrdenActual = 'fechast';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 6;

	if ($rootScope.parametros.nroDocumento
			&& $rootScope.parametros.tipoDocumento) {
		// $rootScope.parametros.urlBack="/ver_turno_como_profesional";
		PacienteService.datosDePaciente($rootScope.parametros.nroDocumento,
				$rootScope.parametros.tipoDocumento, function(response) {
					$scope.paciente = response;
					if (!$scope.paciente.fechaNacimiento) {
						$scope.paciente.edad = "";
					}
				}, $rootScope.manageError);
		PacienteService.historialDePaciente($rootScope.parametros.nroDocumento,
				$rootScope.parametros.tipoDocumento, function(response) {
					$rootScope.manageListCallback($scope, response);
					$scope.cargando = false;
					$scope.paginador.ordenesOrdenacion['fechast'] = true;
					$scope.paginador.ordenarPorFecha('fechast');
										
				}, $rootScope.manageError);

	}
};