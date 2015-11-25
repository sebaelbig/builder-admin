'use strict';
/**
 * Pedido Controller
 */
var PedidoSolicitanteCtrl = function($scope, $rootScope, $routeParams, $filter,
		PedidoService, ServicioService, $window) {

	$scope.servicioActual = $rootScope.servicioActual;

	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.haciendo = false;
	$scope.modificando = false;
	
	
	/***
	 * Historial de Paciente
	 */
	$scope.verHistorialDelPaciente= function(e){
		$rootScope.parametros.nroDocumento = e.nroDniPaciente;
		$rootScope.parametros.tipoDocumento = e.tipoDniPaciente;
		$rootScope.parametros.backTo = '/ver_pedido_solicitante';
		$rootScope.goTo("/ver_historial_PacienteTurno");
	};

	/** *********************************************************** */

	$scope.informar = function(e) {
		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.id;
		if (e.unEstudioPorPedido) {
			// Si es un estudio por pedido, seteo el id del estudio a ser
			// modificado
			// PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}

		$rootScope.goTo("/escribir_informe");
	};

	$scope.imprimir = function(e) {
		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.id;
		if (e.unEstudioPorPedido) {
			// Si es un estudio por pedido, seteo el id del estudio a ser
			// modificado
			// PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}
		$rootScope.parametros.urlBack="/ver_pedido_solicitante";
		$rootScope.goTo("/imprimir_informe_solicitado");
	};

	$scope.ver = function(e) {

		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.id;
		if (e.unEstudioPorPedido) {
			// Si es un estudio por pedido, seteo el id del estudio a ser
			// modificado
			// PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}

		//$rootScope.goTo("/ver_informe_solicitado");
		
		$rootScope.parametros.urlBack="/ver_pedido_solicitante";
		//$scope.actualizarFiltro();
		$rootScope.goTo("/ver_informe_solicitado");

	};

	$scope.verPedidosPaciente = function(e) {
		$rootScope.parametros.idPedido = e.id;
		// PedidoService.id = e.id;
		$rootScope.parametros.urlBack="/ver_pedido_solicitante";
		$rootScope.goTo("/listar_pedidos_paciente");

	};

	$scope.listar = function(e) {
		$rootScope.parametros.idPedido = null;
		// PedidoService.id = null;
		$rootScope.goTo("/listar_pedidos_solicitante");

	};

	$scope.list = function() {
		$scope.buscarPorFiltros();
		$scope.paginador.filtrarPor({
			'paciente' : ''
		});
	};

	$scope.cancelar = function() {
		$rootScope.parametros.idPedido = null;
		// PedidoService.id = null;
		// $rootScope.goTo("/anular_pedido");
		$rootScope.cancelar();
	};

	/** ********************************************************* */
	$scope.fxAccion = PedidoService.confirmar;

	// 1 Pide confirmacion
	$scope.reabrir = function(e) {
		$scope.fxAccion = PedidoService.reabrir;

		$scope.confirmarAccion = e;
		$scope.confirmarAccion._cartel = " reabrir el pedido número: "
				+ e.numero;
		$scope.confirmarAccion._preCartel = "";
		$scope.confirmarAccion._postCartel = "";
		$scope.confirmarAccion.btnLoading = false;

		$('#modalConfirmarAccion').dimmer({
			closable : false
		}).dimmer('show');
	};

	// 1 Pide confirmacion
	$scope.cancelar = function(e) {

		$scope.fxAccion = PedidoService.cancelar;

		$scope.confirmarAccion = e;
		$scope.confirmarAccion._cartel = " cancelar el pedido número: "
				+ e.numero;
		$scope.confirmarAccion._preCartel = "";
		$scope.confirmarAccion._postCartel = "";
		$scope.confirmarAccion.btnLoading = false;

		$('#modalConfirmarAccion').dimmer({
			closable : false
		}).dimmer('show');

	};

	// 1 Pide confirmacion
	$scope.confirmar = function(e) {

		$scope.fxAccion = PedidoService.confirmar;

		$scope.confirmarAccion = e;
		$scope.confirmarAccion._cartel = " confirmar el pedido número: "
				+ e.numero;
		$scope.confirmarAccion._preCartel = "";
		$scope.confirmarAccion._postCartel = "";
		$scope.confirmarAccion.btnLoading = false;

		$('#modalConfirmarAccion').dimmer({
			closable : false
		}).dimmer('show');

	};

	// 1.1 Cancela
	$scope.cancelarAccion = function() {
		$('#modalConfirmarAccion').dimmer('hide');
		$scope.confirmarAccion = null;
	};

	// 3 Ejecuta la accion
	$scope.ejecutarAccion = function() {

		$scope.confirmarAccion.btnLoading = true;
		$scope.haciendo = true;

		$scope.fxAccion($scope.confirmarAccion, function(resp) {
			$rootScope.manageSaveCallback($scope, resp);
			$scope.cancelarAccion();
		}, $rootScope.manageError);

	};
	/***************************************************************************
	 * Listar por fecha /
	 **************************************************************************/

	$scope.obtenerPedidosPorFecha = function(fechaSeleccionada) {
		$scope.paginador.filtrarPor({
			'fecha' : fechaSeleccionada
		});
	};

	/** ********************************************************* */
	/* Estados */
	/** ********************************************************* */
	$scope.estados = [ 'En Atención', 'Atendido', 'Informado', 'Cancelado' ];
	$scope.estadoSeleccionado = 'Informado';

	$scope.listarEstados = function() {

		$("#listaEstados").dropdown();
		$("#listaEstados").dropdown("set text", $scope.estadoSeleccionado);
		$scope.seleccionoEstado($scope.estadoSeleccionado);
	};

	$scope.seleccionoEstado = function(est) {
		$scope.estadoSeleccionado = est;
	};

	/** ********************************************************* */
	/* Servicios */
	/** ********************************************************* */
	$scope.servicios = [];
	$scope.servicioseleccionado = 'Todos';

	if ($rootScope.loggedUser) {
		ServicioService.listar(function(resp) {
			if (resp.ok) {
				$scope.servicios = resp.paginador.elementos;

				$("#listaServicios").dropdown("set text",
						$scope.servicioseleccionado);
				$("#listaServicios").dropdown();
				$scope.listarEstados();

				if ($scope.servicios.lenght == 1)
					$scope.seleccionoServicio($scope.servicios[0]);
			}
		}, function(err) {
			console.error("Error al listar los servicios");
		});
	}

	$scope.seleccionoServicio = function(srv) {

		$scope.haciendo = true;
		$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		$scope.servicioseleccionado = srv.nombre;

		// Importante dejar este orden
		$scope.haciendo = false;

	};

	/** ********************************************************* */
	/* Paginador */
	/** ********************************************************* */
	$scope.paginador = {};

	// ///////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	// codigo, nombre, sucursal
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['numero'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['paciente'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['solicitante'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['fecha'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['estudios'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombreServicio'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['estado'] = $scope._ORDEN_REVERSO;

	// Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'paciente';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 5;

	// ///////////////////// FILTRO
	// $scope.$watch('nombreBusqueda', function() {
	// if ($scope.nombreBusqueda){
	// $scope.paginador.filtrarPor({'paciente': $scope.nombreBusqueda});
	// }
	// });
	/** ********************************************************* */
	/* Cargar filtros */
	/** ********************************************************* */
	$scope.cargarFiltros = function() {
		var obj = JSON.parse($scope.filtros);
		if (obj.servicio != null) {
			$scope.servicioseleccionado = obj.nombreServicio;
			$scope.idServicioSeleccionado = obj.servicio;
			$("#listaServicios").dropdown("set text",
					$scope.servicioseleccionado);
			$("#listaServicios").dropdown();
		} else
			$scope.idServicioSeleccionado = 'Todos';
		if (obj.estado != null) {
			$scope.estadoSeleccionado = obj.estado;
			$scope.listarEstados();
		} else
			$scope.estadoSeleccionado = 'Todos';

		$scope.fechaActual = obj.fechaDesde;
		$scope.fechaHasta = obj.fechaHasta;

	};
	/** ***************************************************************** */
	/* Busqueda por filtros (servicio, estado, fechaDesde,fechaHasta) */
	/** ***************************************************************** */

	$scope.buscarPorFiltros = function() {

		$scope.haciendo = true;
		// Verifico que estado y servicio <> 'todos'
		if ($scope.servicioseleccionado == 'Todos') {
			$scope.idServicioSeleccionado = null;
		} else {
			// obtengo el id del servicio
			for ( var ix = 0; ix < $scope.servicios.length; ix++) {
				if ($scope.servicios[ix].nombre == $scope.servicioseleccionado) {
					$scope.idServicioSeleccionado = $scope.servicios[ix].codigo;
					break;
				}
			}
		}

		if ($scope.estadoSeleccionado != 'Todos'
				&& $scope.estadoSeleccionado != '') {
			$scope.estadoFiltro = $scope.estadoSeleccionado;
		} else {
			$scope.estadoFiltro = null;
		}

		if ($("#fechaDesde").val())
			$scope.fechaActual = $("#fechaDesde").val();
		if ($("#fechaHasta").val())
			$scope.fechaHasta = $("#fechaHasta").val();

		$scope.filtros = {
			'servicio' : $scope.idServicioSeleccionado,
			'nombreServicio' : $scope.servicioseleccionado,
			'estado' : $scope.estadoFiltro,
			'fechaDesde' : $scope.fechaActual,
			'fechaHasta' : $scope.fechaHasta
		/* ,'tipoDoc':0,'nroDoc':35947878 */};

		$window.sessionStorage.setItem("filtros", JSON
				.stringify($scope.filtros));

		PedidoService
				.listarPedidosPorFiltro(
						$scope.filtros,
						function(response) {
							if (response.ok) {
								// Hubo datos de vuelta
								if (response.paginador.elementos
										&& response.paginador.elementos.length >= 0) {

									var filtrados = [];
									$
											.each(
													response.paginador.elementos,
													function(ix, pedido) {
														if (pedido.matriculaProfesionalSolicitante == $rootScope.matricula) {
															filtrados
																	.push(pedido);
														}
													});

									$scope.paginador.setTodos(filtrados);
									// agarra todos los elems y los pagina
									$scope.paginador.actualizarLista();
									if (!$scope.hayMensajes)
										$scope.mensajes = {
											mensaje : response.mensaje,
											error : false
										};

									// No hubo datos de vuelta -> errores
								} else {

									$scope.mensajes = {
										mensaje : response.mensaje,
										error : true
									};

									// Habilito los mensajes si es que no hay
									// mostrandose otro
									if (!$scope.hayMensajes)
										$scope.hayMensajes = true;
								}

							} else {
								$scope.mensajes = {
									mensaje : response.mensaje,
									error : true
								};
								$scope.hayMensajes = true;
							}

							$scope.haciendo = false;

						}, $rootScope.manageError);
	};

	/** *********************************************************** */
	$scope.filtros = $window.sessionStorage.getItem("filtros");
	$scope.elementos = [];
	$scope.elemento = {};
	
	var hoy=new Date();
	hoy=hoy.setTime(hoy.getTime() - (7 * 24 * 60 * 60 * 1000));
	$scope.fechaActual=$rootScope.dateToString(new Date(hoy));
	$scope.fechaHasta = $rootScope.dateToString(new Date());

	$scope.resetElemento = function() {
		$scope.elemento = {
			borrado : false
		};
		$scope.haciendo = false;
		$scope.modificando = false;
	};

	$scope.resetElemento();

	if ($rootScope.parametros.idPedido != null) {

		// Viene un id como parametro, cargo el episodio para ver en detalle
		$scope.haciendo = true;

		if ($rootScope.parametros.idPedido != null
				&& $rootScope.parametros.idEstudio != null) {
			// Es un estudio por pedido
			PedidoService.findByIdByEstudio($rootScope.parametros, function(
					response) {

				$scope.elemento = response;

				if (!$scope.elemento.texto) {
					$scope.elemento.texto = "";
				}

				if (!$scope.elemento.firmaEfector) {
					$scope.elemento.firmaEfector = "--";
				}
				$scope.haciendo = false;
			}, $rootScope.manageError);

		} else {

			if ($rootScope.parametros.idPedido != null
					&& $rootScope.parametros.idEstudio == null) {
				// Se edita el pedido solamente

				PedidoService.findById($rootScope.parametros,
						function(response) {

							$scope.elemento = response;

							if (!$scope.elemento.texto) {
								$scope.elemento.texto = "";
							}

							if (!$scope.elemento.firmaEfector) {
								$scope.elemento.firmaEfector = "--";
							}
							$scope.haciendo = false;
						}, $rootScope.manageError);
			}
		}
	}

	else {
		// Listo los pedidos
		if ($scope.filtros) {
			$scope.cargarFiltros();
			$scope.buscarPorFiltros();
		} else
			$scope.list();

	}

	/** *********************************************************** */
};