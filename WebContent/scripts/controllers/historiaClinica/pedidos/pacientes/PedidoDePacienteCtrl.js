'use strict';
/**
 * Pedido De Paciente Controller
 */
/**
 * author:carlalu
 */
var PedidoDePacienteCtrl = function($scope, $rootScope, $routeParams, $filter,
		PedidoService, ServicioService, $window) {

	/** ***************************************************************** */
	/* Busqueda por filtros (servicio, estado, fechaDesde,fechaHasta) */
	/** ***************************************************************** */
	//
	// $scope.buscarPorFiltros = function() {
	//
	// $scope.haciendo = true;
	// // Verifico que estado y servicio <> 'todos'
	// if ($scope.servicioseleccionado == 'Todos') {
	// $scope.idServicioSeleccionado = null;
	// } else {
	// // obtengo el id del servicio
	// for ( var ix = 0; ix < $scope.servicios.length; ix++) {
	// if ($scope.servicios[ix].nombre == $scope.servicioseleccionado) {
	// $scope.idServicioSeleccionado = $scope.servicios[ix].codigo;
	// break;
	// }
	// }
	// }
	//
	// if ($scope.estadoSeleccionado != 'Todos'
	// && $scope.estadoSeleccionado != '') {
	// $scope.estadoFiltro = $scope.estadoSeleccionado;
	// } else {
	// $scope.estadoFiltro = null;
	// }
	//
	// if ($("#fechaDesde").val())
	// $scope.fechaActual = $("#fechaDesde").val();
	// if ($("#fechaHasta").val())
	// $scope.fechaHasta = $("#fechaHasta").val();
	//		
	// $scope.filtros = {
	// 'servicio' : $scope.idServicioSeleccionado,
	// 'nombreServicio' : $scope.servicioseleccionado,
	// 'estado' : $scope.estadoFiltro,
	// 'fechaDesde' : $scope.fechaActual,
	// 'fechaHasta' : $scope.fechaHasta,
	// 'tipoDoc' : $scope.tipoDoc,
	// 'nroDoc' : $scope.nroDoc
	// };
	//
	//		
	// PedidoService.getDatosDePacienteWeb($rootScope.loggedUser.usuario,
	// function(response) {
	// if (response != null) {
	// // console.log(response);
	// var paciente = JSON.parse(response);
	// $scope.tipoDoc = paciente.tipoDocumento;
	// $scope.nroDoc = paciente.nroDocumento;
	// $scope.nombre= paciente.nombre;
	// //$scope.filtros.tipoDoc = paciente.tipoDocumento;
	// //$scope.filtros.nroDoc = paciente.nroDocumento;
	//
	// $scope.filtros = {
	// 'servicio' : $scope.idServicioSeleccionado,
	// 'nombreServicio' : $scope.servicioseleccionado,
	// 'estado' : $scope.estadoFiltro,
	// 'fechaDesde' : $scope.fechaActual,
	// 'fechaHasta' : $scope.fechaHasta,
	// 'tipoDoc' : $scope.tipoDoc,
	// 'nroDoc' : $scope.nroDoc,
	// 'orden' : 'dt_fecha'
	// };
	//
	// $window.sessionStorage.setItem("filtros", JSON
	// .stringify($scope.filtros));
	//						
	// PedidoService.listarPedidosPorFiltro($scope.filtros,
	// function(response) {
	// $rootScope.manageListCallback($scope,
	// response);
	// }, $rootScope.manageError);
	//						
	// };
	//					
	// }, $rootScope.manageError);
	//		
	//
	// };
	/** *********************************************************** */

	$scope.paciente=$rootScope.parametros.paciente;
	$scope.hayMensajes = false;
	$scope.mensajes;

	$scope.haciendo = false;
	$scope.modificando = false;
	$scope.usarioLogueado = $rootScope.loggedUser.usuario;

	/** *********************************************************** */

	$scope.imprimir = function(e) {
		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.id;
		if (e.unEstudioPorPedido) {
			// Si es un estudio por pedido, seteo el id del estudio a ser
			// modificado
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}

		$rootScope.parametros.urlBack = "/listarPedidos_DePaciente";
		$scope.actualizarFiltro();
		$rootScope.goTo("/imprimir_informe_DePaciente");
	};
	
	$scope.volver = function(){
		$rootScope.parametros.tipoDocumento="";
		$rootScope.parametros.nroDocumento="";
		//Seteo los filtros denuevo
		$scope.filtros = $scope.reStartFiltros();
		$window.sessionStorage.setItem("filtros", JSON
				.stringify($scope.filtros));
		$rootScope.goTo("/buscarpedidos_de_pacientes");
	};

	$scope.ver = function(e) {

		// PedidoService.id = e.id;
		$rootScope.parametros.idPedido = e.id;
		if (e.unEstudioPorPedido) {
			// Si es un estudio por pedido, seteo el id del estudio a ser
			// modificado
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}

		$rootScope.parametros.urlBack = "/listarPedidos_DePaciente";
		$scope.actualizarFiltro();
		$rootScope.goTo("/ver_informe_de_paciente");

	};

	$scope.verMensajes = function(e) {

		$rootScope.parametros.idPedido = e.id;
		//$rootScope.parametros.tipoDocumento,
		//$rootScope.parametros.nroDocumento
		$rootScope.parametros.urlBack = "/listarPedidos_DePaciente";
		$scope.actualizarFiltro();
		$rootScope.goTo("/mensajes_pedidos");
	};

	$scope.listar = function(e) {

		$rootScope.parametros.idPedido = null;
		// $rootScope.goTo("/listarPedidos");
		$rootScope.goTo($rootScope.parametros.urlBack);

	};

	$scope.list = function() {
		$scope.buscarPorFiltros();
		$scope.paginador.filtrarPor({
			'paciente' : ''
		});
	};

	/** ********************************************************* */
	$scope.fxAccion = PedidoService.confirmar;
	$scope.modalAccion = "#modalConfirmarAccion";

	
	// 1.1 Cancela
	$scope.cancelarAccion = function() {
		$($scope.modalAccion).dimmer('hide');
		$scope.confirmarAccion = null;
		// $scope.haciendo = false;
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
	$scope.estados = [];
	$scope.estadoSeleccionado = 'Todos';
	$scope.loadingEstados = true;

	$scope.listarEstados = function() {

		PedidoService.estados(function(resp) {
			if (resp.ok) {

				$scope.estados = resp.paginador.elementos;

				$scope.loadingEstados = false;

				// Sigo la cadena
				// $scope.actualizarLista();
				$scope.listarModalidades();

			}
		}, function(err) {
			console.error("Error al listar los estados");
		});
	};

	$scope.seleccionoEstado = function(est) {
		$scope.estadoSeleccionado = est.nombre;
	};

	/** ********************************************************* */
	/* Servicios */
	/** ********************************************************* */
	$scope.servicios = [];
	$scope.servicioseleccionado = 'Todos';
	$scope.loadingServicios = true;

	$scope.listarServicios = function() {
		ServicioService.listar(function(resp) {
			if (resp.ok) {

				$scope.servicios = resp.paginador.elementos;

				$scope.loadingServicios = false;

				// Sigo la cadena
				$scope.listarEstados();

			}
		}, function(err) {
			console.error("Error al listar los servicios");
		});
	};

	$scope.seleccionoServicio = function(srv) {

		$scope.haciendo = true;
		$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		$scope.servicioseleccionado = srv.nombre;

		// Importante dejar este orden
		$scope.haciendo = false;

	};

	/** ********************************************************* */
	/* Modalidades */
	/** ********************************************************* */
	$scope.modalidades = [];
	$scope.modalidadseleccionada = {
		descripcion : 'Todas',
		codigo : null
	};
	$scope.loadingModalidades = true;

	$scope.listarModalidades = function() {
		PedidoService.modalidades(function(resp) {
			if (resp.ok) {
				$scope.modalidades = resp.paginador.elementos;

				$scope.loadingModalidades = false;
				$("#listaModalidades").dropdown();

				// Sigo la cadena
				$scope.actualizarLista();
			}
		}, function(err) {
			console.error("Error al listar las modalidades");
		});
	};

	$scope.seleccionoModalidad = function(mod) {

		$scope.haciendo = true;
		$("#listaModalidades").dropdown("set text",
				(mod.codigo) ? mod.codigo + " - " + mod.descripcion : 'Todas');
		$("#listaModalidades").dropdown("hide");
		$scope.modalidadseleccionada = mod;

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
	// $scope._ordenesOrdenacion['estadoEstudio'] = $scope._ORDEN_REVERSO;

	// Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'paciente';

	$rootScope.paginadorBase($scope, $filter, $scope.paginador,
			$scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 8;

	/** ********************************************************* */
	/* Cargar filtros */
	/** ********************************************************* */
	/**
	 * Actualizo el filtro de la sesion ante cada modificacion (cambio de
	 * página, nombre busqueda)
	 */
	$scope.actualizarFiltro = function() {

		$scope.filtros = JSON.parse($window.sessionStorage.getItem("filtros"));

		$scope.filtros.pagina = $scope.paginador.getPaginaActual();
		$scope.filtros.nombreBusqueda = $("#input_nombreBusqueda").val();

		$window.sessionStorage.setItem("filtros", JSON
				.stringify($scope.filtros));
	};

	/**
	 * Pongo los filtros en 0
	 */
	$scope.reStartFiltros = function() {

		$scope.servicioseleccionado = 'Todos';
		var hoy=new Date();
		hoy=hoy.setTime(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
		$scope.fechaDesde=$rootScope.dateToString(new Date(hoy));
		$scope.fechaHasta = $rootScope.dateToString(new Date());
		$scope.paginador.setPaginaActual(1);
	
		return {
			'pagina' : 1,
			'nombreBusqueda' : '',
			'servicio' : null,
			'nombreServicio' : $scope.servicioseleccionado,
			'estado' : null,
			'fechaDesde' : $scope.fechaDesde,
			'fechaHasta' : $scope.fechaHasta,
			'modalidad' : null,
			'tipoDoc' : $scope.tipoDocumento,
			'nroDoc' : $scope.nroDocumento
		};
	};
	
	/**
	 * Armo el filtro con los datos ingresados de la vista
	 */
	$scope.getFiltrosDeVista = function() {

		// Servicio (se necesita el id)
		var idSrv;
		if ($scope.servicioseleccionado == 'Todos') {
			idSrv = null;
		} else {
			// obtengo el id del servicio
			for ( var ix = 0; ix < $scope.servicios.length; ix++) {
				if ($scope.servicios[ix].nombre == $scope.servicioseleccionado) {
					idSrv = $scope.servicios[ix].codigo;
					break;
				}
			}
		}

		// Estado
		var estadoFiltro = ($scope.estadoSeleccionado != 'Todos') ? $scope.estadoSeleccionado
				: null;

		// Fechas
		if ($("#fechaDesde").val()) {
			$scope.fechaDesde = $("#fechaDesde").val();
		} else {
			var hoy=new Date();
			hoy=hoy.setTime(hoy.getTime() - (30 * 24 * 60 * 60 * 1000));
			$scope.fechaDesde=$rootScope.dateToString(new Date(hoy));
		}

		if ($("#fechaHasta").val()) {
			$scope.fechaHasta = $("#fechaHasta").val();
		} else {
			$scope.fechaHasta = $rootScope.dateToString(new Date());
		}

		// Si se busca desde el boton, se limpian estas configuraciones
		// Reseteo el paginador
		$scope.paginador.setPaginaActual(1);
		// filtro de la busqueda
		$scope.nombreBusqueda = $("#input_nombreBusqueda").val();

		// Armo el filtro segun lo guardado en el storage
		return {
			'pagina' : 1,
			'nombreBusqueda' : $scope.nombreBusqueda,
			'servicio' : idSrv,
			'nombreServicio' : $scope.servicioseleccionado,
			'estado' : estadoFiltro,
			'fechaDesde' : $scope.fechaDesde,
			'fechaHasta' : $scope.fechaHasta,
			'modalidad' : $scope.modalidadseleccionada.codigo,
			'tipoDoc' : $scope.tipoDocumento,
			'nroDoc' : $scope.nroDocumento
		};
	};

	/**
	 * Cargo el modelo con los datos guardados en el storage
	 */
	$scope.cargarFiltros = function() {

		// Parse lo guardado en el sessionStorage
		// var obj = JSON.parse( $scope.filtros);

		// Actualizo el servicio
		var idSrv;
		if ($scope.filtros.servicio != null) {
			idSrv = $scope.filtros.servicio;
			$scope.seleccionoServicio({
				'nombre' : $scope.filtros.nombreServicio
			});
		} else {
			idSrv = null;
			$scope.seleccionoServicio({
				'nombre' : 'Todos'
			});
		}
		// $("#listaServicios").dropdown();

		// Actualizo el estado
		if ($scope.filtros.estado != null) {
			$scope.seleccionoEstado({
				'nombre' : $scope.filtros.estado
			});
			$("#listaEstados").dropdown("set text", $scope.estadoSeleccionado);
		} else {
			$scope.estadoSeleccionado = null;
			$("#listaEstados").dropdown("set text", 'Todos');
		}
		$("#listaEstados").dropdown();

		// Fechas
		if ($scope.filtros.fechaDesde && $scope.filtros.fechaHasta) {

			$scope.fechaDesde = $scope.filtros.fechaDesde;
			$scope.fechaHasta = $scope.filtros.fechaHasta;

			$("#fechaDesde").val($scope.fechaDesde);
			$("#fechaHasta").val($scope.fechaHasta);

		}

		// Pagina del paginador
		var pagina = $scope.paginador.getPaginaActual();

		// filtro de la busqueda
		$scope.nombreBusqueda = $scope.filtros.nombreBusqueda;

		// Actualizo la modalidad
		if ($scope.filtros.modalidad != null) {
			var mod;
			angular.forEach($scope.modalidades, function(m) {
				if (m.codigo == $scope.filtros.modalidad) {
					mod = m;
				}
			});
			$scope.modalidadseleccionada = mod;
		} else {
			$scope.modalidadseleccionada = {
				descripcion : 'Todas',
				codigo : null
			};
		}
		$scope.seleccionoModalidad($scope.modalidadseleccionada);

		// Armo el filtro segun lo guardado en el storage
		return {
			'pagina' : pagina,
			'nombreBusqueda' : $scope.nombreBusqueda,
			'servicio' : idSrv,
			'nombreServicio' : $scope.servicioseleccionado,
			'estado' : $scope.estadoSeleccionado,
			'fechaDesde' : $scope.fechaDesde,
			'fechaHasta' : $scope.fechaHasta,
			'modalidad' : $scope.modalidadseleccionada.codigo,
			'tipoDoc' : $scope.tipoDocumento,
			'nroDoc' : $scope.nroDocumento
		};

	};

	/** ***************************************************************** */
	/* Busqueda por filtros (modalidad,servicio, estado, fechaDesde,fechaHasta) */
	/** ***************************************************************** */

	/**
	 * Busca utilizando como filtro los parametros establecidos en la vista
	 */
	$scope.buscarPorFiltrosDeVista = function() {
		$scope.filtros = $scope.getFiltrosDeVista();
		$scope.buscarPorFiltros();
	};

	/**
	 * Refresco la pagina
	 */
	$scope.refrescarLaPagina = function() {

		var pagina = $scope.paginador.getPaginaActual();
		var nombreBusqueda = $("#input_nombreBusqueda").val();

		$scope.filtros = $scope.getFiltrosDeVista();
		$scope.filtros.pagina = pagina;
		$scope.filtros.nombreBusqueda = nombreBusqueda;
		$scope.buscarPorFiltros();
	};

	/**
	 * Busca utilizando como filtro los parametros guardados en el session
	 * storage
	 */
	$scope.buscarPorFiltros = function() {

		// Me guardo en el storage los parametros de busqueda
		$window.sessionStorage.setItem("filtros", JSON
				.stringify($scope.filtros));

		$scope.haciendo = true;
		PedidoService.listarPedidosPorFiltro($scope.filtros,
				function(response) {

					// Vuelve de la busqueda, cargo la lista segun el resultado
					$rootScope.manageListCallback($scope, response);

					// Recupero los parametros de busqueda
					// var filtros = JSON.parse(
					// $window.sessionStorage.getItem("filtros")
					// );

					// Si ingresaron algo en el nombre de busqueda, se filtra el
					// resultado
					$("#input_nombreBusqueda").val("");
					if ($scope.filtros.nombreBusqueda
							&& $scope.filtros.nombreBusqueda.length > 0) {

						// Filtro el resultado segun los parametros de busqueda,
						// posiciona
						// en la página
						$scope.paginador.filtrarPor({
							'paciente' : $scope.filtros.nombreBusqueda
						});
						$("#input_nombreBusqueda").val(
								$scope.filtros.nombreBusqueda);
					}

					// Se posiciona en la pagina que estaba
					$scope.paginador.setPaginaActual($scope.filtros.pagina);
					$scope.paginador.actualizarLista();

					// Refresco la vista con los datos del filtro
					$scope.cargarFiltros();

					$scope.haciendo = false;
				}, $rootScope.manageError);

	};

	$scope.actualizarLista = $scope.buscarPorFiltros;

	/** *********************************************************** */
	$scope.filtros = ($window.sessionStorage.getItem("filtros")) ? JSON
			.parse($window.sessionStorage.getItem("filtros")) : $scope
			.getFiltrosDeVista();

	$scope.elementos = [];
	$scope.elemento = {};
//	$scope.fechaDesde = $rootScope.dateToString(new Date());
//	$scope.fechaHasta = $scope.fechaDesde;

	$scope.resetElemento = function() {
		$scope.elemento = {
			borrado : false
		};
		$scope.haciendo = false;
		$scope.modificando = false;
	};

	$scope.resetElemento();
	
	if($rootScope.parametros.nroDocumento && $rootScope.parametros.tipoDocumento){
		$scope.nroDocumento=$rootScope.parametros.nroDocumento;
		$scope.tipoDocumento=$rootScope.parametros.tipoDocumento;
		$scope.filtros.tipoDoc= $scope.tipoDocumento;
		$scope.filtros.nroDoc= $scope.nroDocumento;
		//$scope.filtros = $scope.getFiltrosDeVista();
	}
	
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

	} else {
		// //Listo los servicios, luego los estados y por ultimo busco por
		// filtro
		$scope.haciendo = true;

		$scope.listarServicios();

	}

	/** *********************************************************** */

};