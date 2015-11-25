var EpicrisisCrearCtrl = function($scope, $rootScope, $routeParams, $filter,
		InternacionService, ProfesionalService, ServicioService, $window) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	$scope.epicrisis = {};

	$scope.condicionesAlta = [ {
		'nombre' : 'Alta Medica',
		'enum' : 'ALTA_MEDICA'
	}, {
		'nombre' : 'Obito',
		'enum' : 'OBITO'
	}, {
		'nombre' : 'Traslado',
		'enum' : 'TRASLADO'
	}, {
		'nombre' : 'Retiro Voluntario',
		'enum' : 'RETIRO_VOLUNTARIO'
	}, {
		'nombre' : 'Internado',
		'enum' : 'INTERNADO'
	} ];

	$("#listaConddicionesAlta").dropdown();
	$scope.profesionales = "";
	$("#listaProfesionales").dropdown("set text", "Prueba");
	$("#listaProfesionales").dropdown();

	$scope.seleccionarFecha = function(fechaSeleccionada) {
		$scope.fechaAltaMedica = fechaSeleccionada;
		$scope.carpeta.fechaAltaMedica = fechaSeleccionada;
	};

	$scope.seleccionoCondicionAlta = function(condicionAlta) {
		$scope.carpeta.condicionAlta = condicionAlta.enum;
		// $("#listaConddicionesAlta").dropdown("set text", condicionAlta.nombre
		// );
		// $("#listaConddicionesAlta").dropdown("hide");
	};

	$scope.imprimir = function() {
		if ($scope.epicrisis) {
			$rootScope.parametros.idEpicrisis = $scope.epicrisis.id;
			$rootScope.parametros.idCarpeta;
			// $rootScope.filtrosCarpeta;
			$rootScope.parametros.urlBack = "/escribir_epicrisis";
			$rootScope.goTo("/imprimir_epicrisis");
		} else {
			$scope.hayMensajes = true;
			$scope.mensajes = {
				mensaje : 'Primero debe Guardar',
				error : true
			};
		}

	};
	$scope.cancelar = function() {
		$rootScope.parametros = {};
		$rootScope.goTo("/epicrisis");
	};

	/* Keypress */
	$scope.buscarProfesional = function(parametro) {
		$scope.carpeta.matProfCabecera = "";
		if (parametro.length > 3) {
			$scope.profesionales = "";
			$("#listaProfesionales").dropdown("set text", "");
			ProfesionalService.buscarProfesionalesPor(parametro, function(
					response) {
				$rootScope.manageListCallback($scope, response);
				// $scope.profesionales=JSON.stringify(response.profesionales);
				$scope.profesionales = response.profesionales;
				$("#listaProfesionales").dropdown("set text",
						$scope.profesionales);
				$("#listaProfesionales").dropdown();
				$scope.hayMensajes = false;
				$scope.mensajes = {
					mensaje : response.mensaje,
					error : false
				};

			}, $rootScope.manageError);

		}
	};

	$scope.selectProfesional = function(prof) {
		$scope.carpeta.profCabecera = prof.apellido;
		$scope.carpeta.matProfCabecera = prof.nroMatricula;
	};

	/* Cerrar */
	$scope.cerrarEpicrisis = function() {
		$scope.hayMensajes = true;
		InternacionService.cerrarEpicrisis($scope.carpeta.carpeta, function(response) {
			if (response.ok) {
				$scope.mensajes = {
					mensaje : response.mensaje,
					error : false
				};
				$rootScope.parametros = {};
				$rootScope.goTo("/epicrisis");

			} else {
				$scope.mensajes = {
					mensaje : response.mensaje,
					error : true
				};
			}
		}, $rootScope.manageError);
		
	};

	$scope.guardar = function() {
		$scope.hayMensajes = true;
		if ($scope.carpeta.matProfCabecera == "") {
			$scope.mensajes = {
				mensaje : "Debe seleccionar el profesional de Cabecera",
				error : true
			};
		} else {
			$scope.cargarTextoEditores();
			if (($scope.epicrisis)
					&& (($scope.epicrisis.enfermedadActual != "")
							|| ($scope.epicrisis.evolucion != "")
							|| ($scope.epicrisis.estudiosComplementarios != "")
							|| ($scope.epicrisis.tratamiento != "") || ($scope.epicrisis.indicacionesAlta != ""))) {
				$scope.epicrisis.carpeta = $rootScope.parametros.idCarpeta;
				$scope.epicrisis.tipoDocumento = $scope.carpeta.tipoDniPaciente;
				$scope.epicrisis.numeroDocumento = $scope.carpeta.dniPaciente;
				// $scope.cargarTextoEditores();
				InternacionService
						.guardarEpicrisis(
								$scope.epicrisis,
								function(response) {
									// $rootScope.manageListCallback($scope,response);

									if (response.ok) {
										$scope.mensajes = {
											mensaje : response.mensaje,
											error : false
										};

										/*
										 * Actualizo los datos de la Carpeta en
										 * sybase
										 */
										InternacionService
												.actualizarAltaCarpeta(
														$scope.carpeta,
														function(response) {
															// $rootScope.manageListCallback($scope,
															// response);
															if (response.ok) {
																console
																		.log("Se actualizo la carpeta correctamente");
																// $scope.mensajes
																// =
																// {mensaje:response.mensaje,
																// error:false}
																// ;
															} else {
																$scope.mensajes = {
																	mensaje : response.mensaje,
																	error : true
																};
															}
														},
														$rootScope.manageError);

										/* Recupero la epicrisis con su id */
										InternacionService
												.getEpicrisis(
														$scope.epicrisis.carpeta,
														function(response) {
															$rootScope
																	.manageListCallback(
																			$scope,
																			response);
															if (response.ok) {
																if (response.paginador.elementos
																		&& response.paginador.elementos[0] != null) {
																	$scope.epicrisis = response.paginador.elementos[0];
																	;
																	$scope.epicrisis.carpeta = $rootScope.parametros.idCarpeta;
																	// Actualizo
																	// el editor
																	// con el
																	// texto
																	// $scope.refreshTextoCKEditor($scope.epicrisis);
																}
																// $scope.mensajes
																// =
																// {mensaje:response.mensaje,
																// error:false}
																// ;
															} else {
																$scope.mensajes = {
																	mensaje : response.mensaje,
																	error : true
																};
															}
														},
														$rootScope.manageError);

									} else {
										$scope.mensajes = {
											mensaje : response.mensaje,
											error : true
										};
									}
									$scope.modificando = true;
								}, $rootScope.manageError);
			} else {
				$scope.mensajes = {
					mensaje : "Debe completar la Epicrisis para guardar",
					error : true
				};
			}
		}

	};

	/**
	 * Funcion llamada por: La directiva cuando se termina de crear el editor o
	 * Cuando se recupero el pedido
	 */
	$scope.refreshTextoCKEditor = function() {
		if ($scope.epicrisis) {
			if (CKEDITOR.instances.enfermedadActual) {
				CKEDITOR.instances.enfermedadActual
						.setData($scope.epicrisis.enfermedadActual);
			}
			if (CKEDITOR.instances.evolucion) {
				CKEDITOR.instances.evolucion
						.setData($scope.epicrisis.evolucion);
			}
			if (CKEDITOR.instances.estudiosComplementarios) {
				CKEDITOR.instances.estudiosComplementarios
						.setData($scope.epicrisis.estudiosComplementarios);
			}
			if (CKEDITOR.instances.tratamiento) {
				CKEDITOR.instances.tratamiento
						.setData($scope.epicrisis.tratamiento);
			}
			if (CKEDITOR.instances.indicacionesAlta) {
				CKEDITOR.instances.indicacionesAlta
						.setData($scope.epicrisis.indicacionesAlta);
			}
		}
	};
	$scope.cargarTextoEditores = function() {
		$scope.epicrisis.enfermedadActual = CKEDITOR.instances.enfermedadActual
				.getData();
		$scope.epicrisis.evolucion = CKEDITOR.instances.evolucion.getData();
		$scope.epicrisis.estudiosComplementarios = CKEDITOR.instances.estudiosComplementarios
				.getData();
		$scope.epicrisis.tratamiento = CKEDITOR.instances.tratamiento.getData();
		$scope.epicrisis.indicacionesAlta = CKEDITOR.instances.indicacionesAlta
				.getData();
	};

	if ($rootScope.parametros.idCarpeta) {

		InternacionService
				.datosIntPaciente(
						$scope.parametros.idCarpeta,
						function(response) {
							$rootScope.manageListCallback($scope, response);
							if (response.ok) {
								if (response.paginador.elementos
										&& response.paginador.elementos.length >= 0) {
									$scope.carpeta = response.paginador.elementos[0];

									if ($scope.carpeta.fechaAltaMedica == null) {
										$scope.fechaAltaMedica = $rootScope
												.dateToString(new Date());
									} else {
										$scope.fechaAltaMedica = $scope.carpeta.fechaAltaMedica;
									}
									if ($scope.carpeta.condicionAlta != null) {
										$("#listaConddicionesAlta").dropdown(
												"set text",
												$scope.carpeta.condicionAlta);
									}
									$("#listaProfesionales").dropdown(
											"set text",
											$scope.carpeta.profCabecera);
									$("#listaProfesionales").dropdown();

								}
								InternacionService
										.getEpicrisis(
												$scope.parametros.idCarpeta,
												function(response) {
													$rootScope
															.manageListCallback(
																	$scope,
																	response);
													if (response.ok) {
														if (response.paginador.elementos
																&& response.paginador.elementos[0] != null) {
															$scope.epicrisis = response.paginador.elementos[0];
															$scope.epicrisis.carpeta = $rootScope.parametros.idCarpeta;
															$scope.epicrisis.tipoDocumento = $scope.carpeta.tipoDniPaciente;
															$scope.epicrisis.numeroDocumento = $scope.carpeta.dniPaciente;
															// Actualizo el
															// editor con el
															// texto
															// $scope.refreshTextoCKEditor($scope.epicrisis);

														}
														$scope.mensajes = {
															mensaje : response.mensaje,
															error : false
														};
													} else {
														$scope.mensajes = {
															mensaje : response.mensaje,
															error : true
														};
													}
												}, $rootScope.manageError);

								$scope.mensajes = {
									mensaje : response.mensaje,
									error : false
								};
							} else {
								$scope.mensajes = {
									mensaje : response.mensaje,
									error : true
								};
							}
						}, $rootScope.manageError);

	}
};