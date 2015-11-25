'use strict';

/** Descarga Excel* */

var guardar = angular.module('sabeExcel', []);
guardar
		.factory(
				'Excel',
				function($window) {
					var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function(
							s) {
						return $window.btoa(unescape(encodeURIComponent(s)));
					}, format = function(s, c) {
						return s.replace(/{(\w+)}/g, function(m, p) {
							return c[p];
						});
					};
					return {
						tableToExcel : function(tableId, worksheetName) {
							var table = $(tableId), ctx = {
								worksheet : worksheetName,
								table : table.html()
							}, href = uri + base64(format(template, ctx));
							return href;
						}
					};
				});
/***/

/**
 * control dias de internacion Controller
 */
var ControlDiasCtrl = function($scope, $rootScope, $routeParams, $filter,
		InternacionService, ServicioService, $window, Excel, $timeout) {
	// $scope.servicioActual = $rootScope.servicioActual;
	
	
	if($rootScope.parametros.paginaActual){
		$scope.paginaActual=$rootScope.parametros.paginaActual;
	}else{
		$scope.paginaActual=1;
	}
	
	/* Filtro camas */
	$scope.estadoCamas = [ {
		'estado' : 'Totales',
		'num' : '0'
	}, {
		'estado' : 'Libres',
		'num' : '1'
	}, {
		'estado' : 'Ocupadas',
		'num' : '2'
	}, {
		'estado' : 'Bloqueadas',
		'num' : '3'
	} ];
	// $("#listaEstadosCamas").dropdown();

	$scope.seleccionoEstado = function(e) {
		if (e.num == '0') {
			$scope.paginador._elementos = $scope.paginador.getTodos();
			$scope.estadoActual = $scope.estadoCamas[0];
		} else {
			$scope.paginador.filtrarPor({
				'estado' : e.num
			});
			$scope.estadoActual = e;
		}
//		$scope.datos = $scope.paginador._elementos;
//		$scope._ordenesOrdenacion['pieza'] = false;
//		$scope.paginador.ordenarPor('pieza');
//		//$scope.paginador.setPaginaActual($rootScope.parametros.paginaActual);
//		$scope.paginador.actualizarLista();
//		$scope.cant = $scope.paginador.getActuales().length;
		$scope.datos = $scope.paginador._elementos;
		$scope._ordenesOrdenacion['pieza'] = false;
		$scope.paginador.ordenarPor('pieza');
		$scope.paginador.paginaActual = 1;
		$scope.paginador.actualizarLista();
		$scope.cant = $scope.paginador.getActuales().length;
	};

	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.haciendo = false;
	$scope.modificando = false;

	$scope.ver = function(e) {
		$rootScope.parametros.paginaActual=$scope.paginador.paginaActual;
		$rootScope.parametros.elem = e;
		$rootScope.parametros.backTo="/internacion/controlDias";
		$rootScope.goTo("/internacion/ver_int_paciente");

	};
	
	$scope.verHistorialDelPaciente = function(e) {
		$rootScope.parametros.nroDocumento = e.dniPaciente;
		$rootScope.parametros.tipoDocumento = e.tipoDniPaciente;
		$rootScope.parametros.paginaActual=$scope.paginador.paginaActual;
		$rootScope.parametros.filtro = $scope.filtro;
		$rootScope.parametros.backTo = '/internacion/controlDias';
		$rootScope.goTo("/ver_historial_PacienteTurno");

	};

	$scope.volver = function() {
		$rootScope.parametros = {};
		$rootScope.parametros.paginaActual=$scope.paginaActual;
		$rootScope.goTo($scope.urlBack);
	};

	/** *********REFRESCAR**************** */
	$scope.consultar = function() {
		InternacionService.controlDiasInt(function(response) {
			$rootScope.manageListCallback($scope, response);
			$scope._ordenesOrdenacion['pieza'] = false;
			$scope.paginador.ordenarPor('pieza');
			/*
			 * $scope.datos=response.paginador.elementos;
			 * $scope.estadoActual=$scope.estadoCamas[2];
			 * $scope.item=$scope.estadoActual;
			 * $scope.cant=response.paginador.elementos.length;
			 */
			$scope.seleccionoEstado($scope.estadoActual);
			$scope.paginador.setPaginaActual($scope.paginaActual);
			$scope.paginador.actualizarLista();

		}, $rootScope.manageError);

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
			if ($scope.estadoActual.num == 0) {
				$scope.paginador._elementos = $scope.paginador.getTodos();
			} else {
				$scope.paginador.filtrarPor({
					'estado' : $scope.estadoActual.num
				});
			}
			
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
		/*
		 * InternacionService.datosIntPaciente($scope.parametros.idCarpeta,
		 * function(response) { $rootScope.manageListCallback($scope, response);
		 * $scope.elem=response; }, $rootScope.manageError);
		 */
		$scope.urlBack=$rootScope.parametros.backTo;
		$scope.elem = $rootScope.parametros.elem;

	} else {
		InternacionService.controlDiasInt(function(response) {
			$rootScope.manageListCallback($scope, response);
			/* Filtro Por Ocupadas */

			$scope.paginador.filtrarPor({
				'estado' : '2'
			});
			$scope.estadoActual = $scope.estadoCamas[2];

			$scope.item = $scope.estadoActual;
			$scope.cant = $scope.paginador.getActuales().length;
			$scope.datos = response.paginador.elementos;
			$scope.paginador.setPaginaActual($scope.paginaActual);
			/* Ordenar */
			$scope._ordenesOrdenacion['pieza'] = false;
			$scope.paginador.ordenarPor('pieza');
			$scope.paginador.actualizarLista();

		}, $rootScope.manageError);
	}

	/** *Generacion excel** */

	$scope.exportToExcel = function(tableId) { // ex: '#my-table'
		$scope.exportHref = Excel.tableToExcel(tableId, 'Internados');
		$timeout(function() {
			location.href = $scope.exportHref;
		}, 100); // trigger download
	};

};