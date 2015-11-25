/***/
function onlyNumber(event) {
	keyPress = event.keyCode ? event.keyCode : event.which ? event.which
			: event;
	if (keyPress == 8 || keyPress == 9)
		return true;
	patron = /[0-9.-]/;
	test = String.fromCharCode(keyPress);
	return patron.test(test);
}

var EpicrisisCtrl = function($scope, $rootScope, $routeParams, $filter,
		InternacionService, ServicioService, $window) {

	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.carpeta = "";
	$scope.nombre = "";
	$scope.dni = "";
	// $scope.fechaok=true;
	// $scope.fechaEgreso = $rootScope.dateToString(new Date());

	/** ********Crear*************** */
	$scope.escribir = function(carpeta) {
		$scope.filtrosJS = $scope.cargarFiltrosDeVista();
		$rootScope.filtrosCarpeta = $scope.filtrosJS;
		$rootScope.parametros.idCarpeta = carpeta;
		$rootScope.goTo("/escribir_epicrisis");

	};

	$scope.imprimir = function(carpeta) {

		InternacionService
				.getEpicrisis(
						carpeta,
						function(response) {
							if (response.ok) {
								if (response.paginador.elementos
										&& response.paginador.elementos[0] != null) {
									$scope.epicrisis = response.paginador.elementos[0];
									$scope.epicrisis.carpeta = $rootScope.parametros.idCarpeta;
									$scope.epicrisis.tipoDocumento = $scope.carpeta.tipoDniPaciente;
									$scope.epicrisis.numeroDocumento = $scope.carpeta.dniPaciente;
									$rootScope.parametros.idEpicrisis = $scope.epicrisis.id;
									$rootScope.parametros.idCarpeta = carpeta;
									$scope.filtrosJS = $scope
											.cargarFiltrosDeVista();
									$rootScope.filtrosCarpeta = $scope.filtrosJS;
									$rootScope.parametros.urlBack = "/epicrisis";
									$rootScope.goTo("/imprimir_epicrisis");
								} else {
									console.log("No esta cargada la Epicrisis");
								}

							} else {
								$scope.mensajes = {
									mensaje : response.mensaje,
									error : true
								};
							}
						}, $rootScope.manageError);

	};
	
	/***************************************************************************
	 * Listar por fecha /
	 * 
	 * 
	 * $scope.obtenerCarpetasPorFecha = function(fechaSeleccionada) {
	 * $scope.paginador.filtrarPor({ 'fechaEgreso' : fechaSeleccionada }); };
	 **************************************************************************/

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};

	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	// codigo, nombre, sucursal
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['carpeta'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['paciente'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['dniPaciente'] = $scope._ORDEN_REVERSO;
	// $scope._ordenesOrdenacion['fechaEgreso'] = $scope._ORDEN_REVERSO;

	$scope._criterioDeOrdenActual = 'carpeta';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 10;

	/*
	 * $scope.changeFechaOk= function(){ $scope.fechaok=!$scope.fechaok; }
	 */

	$scope.cargarFiltrosDeVista = function() {

		$scope.carpeta = $("#carpeta").val();
		$scope.nombre = $("#nombre").val();
		$scope.dni = $("#dni").val();

		// Armo el filtro segun la vista
		return {
			'carpeta' : $scope.carpeta,
			'paciente' : $scope.nombre,
			'dniPaciente' : $scope.dni

		};

	};

	// FILTRO
	$scope.filtrar = function(elementScope) {
		if (elementScope.nombreBusqueda) {
			$scope.paginador.setActuales($filter('filter')(
					$scope.paginador.getTodos(), elementScope.nombreBusqueda));
			$scope.paginador.paginaActual = 1;
			$scope.paginador.actualizarLista();
		}
	};

	/** ***buscarPorFiltrosDeVista()*** */
	$scope.buscarPorFiltrosDeVista = function() {
		$scope.filtrosJS = $scope.cargarFiltrosDeVista();
		$scope.filtrosJS = JSON.stringify($scope.filtrosJS);
		InternacionService.carpetasPorFiltro($scope.filtrosJS, function(
				response) {
			$rootScope.manageListCallback($scope, response);
			$scope.datos = response.paginador.elementos;

		}, $rootScope.manageError);
	};

	/** **Internacion Service*** */
	if ($rootScope.filtrosCarpeta != null) {
		$scope.filtrosJS = $rootScope.filtrosCarpeta;
		$rootScope.filtrosCarpeta = null;
		// $scope.filtrosJS= JSON.parse($scope.filtrosJS);
		$scope.carpeta = $scope.filtrosJS.carpeta;
		$scope.nombre = $scope.filtrosJS.paciente;
		$scope.dni = $scope.filtrosJS.dniPaciente;

		InternacionService.carpetasPorFiltro($scope.filtrosJS, function(
				response) {
			$rootScope.manageListCallback($scope, response);
			$scope.datos = response.paginador.elementos;
		}, $rootScope.manageError);
	} else {
		$scope.filtrosJS = $scope.cargarFiltrosDeVista();
		// $scope.filtrosJS = JSON.stringify($scope.filtrosJS);
	}

};