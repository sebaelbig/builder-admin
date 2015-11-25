/**
 * Routes Definitions Module
 */
angular.module('routes', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {

			//routes definitions
			var routes = [
			    
			              //General
			    {path: '/', template: 'views/home.html', controller: HomeCtrl}
			    , {path: '/login', template: 'views/login.html', controller: LoginCtrl}
			    , {path: '/404', template: 'views/404.html', controller: HomeCtrl}
			    , {path: '/layout', template: 'views/layout/footer.html', controller: FooterCtrl}

			    //Panel de control
			    , {path: '/alertas', template: 'views/core/panelDeControl/alertas_ws.html', controller: AlertasWSCtrl}
			    //Estudios de pedidos Angra
			    , {path: '/listar_pedidos_angra', template: 'views/core/panelDeControl/pedidosAngra/listar.html', controller: EstudioDePedidoAngraCtrl}
			    , {path: '/ver_pedidos_angra', template: 'views/core/panelDeControl/pedidosAngra/ver.html', controller: EstudioDePedidoAngraCtrl}
			    
			    , {path: '/menu', template: 'views/layout/menubar.html', controller: MenuCtrl}
			    , {path: '/footer', template: 'views/layout/footer.html', controller: FooterCtrl}
 
			    //Templates , core/templates
			    , {path: '/listar_templates', template: 'views/core/templates/admin.html', controller: TemplateListCtrl}
			    , {path: '/eliminar_template', template: 'views/core/templates/admin.html', controller: TemplateListCtrl}
			    , {path: '/crear_template', template: 'views/core/templates/admin.html', controller: TemplateListCtrl}
			    , {path: '/modificar_template', template: 'views/core/templates/admin.html', controller: TemplateListCtrl}
			    , {path: '/_crear_template', template: 'views/core/templates/crear.html', controller: TemplateCreateCtrl}
			    , {path: '/_modificar_template', template: 'views/core/templates/crear.html', controller: TemplateCreateCtrl}

			    //Templates de descripcion (Plantillas)
			    //Publico
			    , {path: '/listar_template_publico', template: 'views/historiaClinica/templates/listarPublicos.html', controller: TemplatePublicoListCtrl}
			    , {path: '/eliminar_template_publico', template: 'views/historiaClinica/templates/listarPublicos.html', controller: TemplatePublicoListCtrl}
			    , {path: '/crear_template_publico', template: 'views/historiaClinica/templates/listarPublicos.html', controller: TemplatePublicoListCtrl}
			    , {path: '/modificar_template_publico', template: 'views/historiaClinica/templates/listarPublicos.html', controller: TemplatePublicoListCtrl}
			    
			    , {path: '/_crear_template_publico', template: 'views/historiaClinica/templates/crearPublico.html', controller: TemplatePublicoCreateCtrl}
			    , {path: '/_modificar_template_publico', template: 'views/historiaClinica/templates/crearPublico.html', controller: TemplatePublicoCreateCtrl}
			    //Privado
			    , {path: '/listar_template_privado', template: 'views/historiaClinica/templates/listarPrivados.html', controller: TemplatePrivadoListCtrl}
			    , {path: '/eliminar_template_privado', template: 'views/historiaClinica/templates/listarPrivados.html', controller: TemplatePrivadoListCtrl}
			    , {path: '/crear_template_privado', template: 'views/historiaClinica/templates/listarPrivados.html', controller: TemplatePrivadoListCtrl}
			    , {path: '/modificar_template_privado', template: 'views/historiaClinica/templates/listarPrivados.html', controller: TemplatePrivadoListCtrl}
			    
			    , {path: '/_crear_template_privado', template: 'views/historiaClinica/templates/crearPrivado.html', controller: TemplatePrivadoCreateCtrl}
			    , {path: '/_modificar_template_privado', template: 'views/historiaClinica/templates/crearPrivado.html', controller: TemplatePrivadoCreateCtrl}

			    //Informes
			    , {path: '/listarPedidos', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/anular_informe', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/cerrar_informe', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/ver_informe', template: 'views/historiaClinica/pedidos/ver.html', controller: PedidoCtrl}
			    , {path: '/ver_informe_solicitado', template: 'views/historiaClinica/pedidos/solicitados/ver.html', controller: PedidoSolicitanteCtrl}
			    , {path: '/ver_informe_paciente', template: 'views/historiaClinica/pedidos/solicitados/ver.html', controller: VerPedidoPacienteCtrl}
			    , {path: '/ver_informe_de_paciente', template: 'views/historiaClinica/pedidos/pacientes/ver.html', controller: PedidoDePacienteCtrl}
			    
			    
			    //Pedidos
			    , {path: '/escribir_informe', template: 'views/historiaClinica/pedidos/crear.html', controller: PedidoCreateCtrl}
			    , {path: '/ver_pedido', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/anular_pedido', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/listar_pedidos', template: 'views/historiaClinica/pedidos/admin.html', controller: PedidoCtrl}
			    , {path: '/cancelar_pedido', template: 'views/historiaClinica/pedidos/mensajes.html', controller: PedidoMensajesCtrl}
			    , {path: '/mensajes_pedidos', template: 'views/historiaClinica/pedidos/mensajes.html', controller: PedidoMensajesCtrl}
			    //Pedidos de paciente
			    , {path: '/listarPedidos_DePaciente', template: 'views/historiaClinica/pedidos/pacientes/admin.html', controller: PedidoDePacienteCtrl}
			    
			    
			    , {path: '/imprimir_informe_DePaciente', template: 'views/historiaClinica/pedidos/pacientes/imprimir.html', controller: PedidoDePacienteImprimirCtrl}
			    , {path: '/imprimir_informe', template: 'views/historiaClinica/pedidos/imprimir.html', controller: PedidoImprimirCtrl}
			    , {path: '/imprimir_informe_solicitado', template: 'views/historiaClinica/pedidos/solicitados/imprimir.html', controller: PedidoSolicitanteImprimirCtrl}
			    , {path: '/imprimir_informe_paciente', template: 'views/historiaClinica/pedidos/solicitados/imprimir_paciente.html', controller: PedidoPacienteImprimirCtrl}
			    /*Pantalla para pasar pedidos en contingencia*/
			    , {path: '/listar_pedidos_ctg', template: 'views/historiaClinica/pedidos/listarCtg.html', controller: PedidosCtgCtrl}
			    
			    //Pedidos medico solicitante
			    , {path: '/ver_pedido_solicitante', template: 'views/historiaClinica/pedidos/solicitados/adminSolicitante.html', controller: PedidoSolicitanteCtrl}
			    , {path: '/listar_pedidos_solicitante', template: 'views/historiaClinica/pedidos/solicitados/adminSolicitante.html', controller: PedidoSolicitanteCtrl}
			    , {path: '/listar_pedidos_paciente', template: 'views/historiaClinica/pedidos/solicitados/listarPedidosPaciente.html', controller: PedidoPacienteCtrl}
			    
			    //Buscar Pedidos
			    , {path: '/buscarpedidos_de_pacientes', template: 'views/historiaClinica/pedidos/buscarPedidoDePaciente.html', controller: BuscarPedidosPacienteCtrl}
			    
			    //Sucursal , 
			    , {path: '/buscar_sucursal', template: 'views/core/areas/sucursales/admin.html', controller: SucursalCtrl} 
			    , {path: '/crear_sucursal', template: 'views/core/areas/sucursales/admin.html', controller: SucursalCtrl}
			    , {path: '/eliminar_sucursal', template: 'views/core/areas/sucursales/admin.html', controller: SucursalCtrl} 
			    , {path: '/modificar_sucursal', template: 'views/core/areas/sucursales/admin.html', controller: SucursalCtrl}
			    
			    //Areas , 
			    , {path: '/buscar_area', template: 'views/core/areas/admin.html', controller: AreaCtrl}
			    , {path: '/crear_area', template: 'views/core/areas/admin.html', controller: AreaCtrl}
			    , {path: '/eliminar_area', template: 'views/core/areas/admin.html', controller: AreaCtrl}
			    , {path: '/modificar_area', template: 'views/core/areas/admin.html', controller: AreaCtrl}
			    
			    //Servicios , 
			    , {path: '/asignar_prestacion_servicio', template: 'views/core/areas/servicios/admin.html', controller: ServicioCtrl}
			    , {path: '/buscar_servicio', template: 'views/core/areas/servicios/admin.html', controller: ServicioCtrl}
			    , {path: '/crear_servicio', template: 'views/core/areas/servicios/admin.html', controller: ServicioCtrl}
			    , {path: '/eliminar_servicio', template: 'views/core/areas/servicios/admin.html', controller: ServicioCtrl}
			    , {path: '/modificar_servicio', template: 'views/core/areas/servicios/admin.html', controller: ServicioCtrl}

	            //Usuarios LDAP
			    , {path: '/ver_roles', template: 'views/core/usuarios/usuario_verRoles.html', controller: UsuarioLDAP_VerRolesCtrl}
			    , {path: '/firmaMedico', template: 'views/core/usuarios/usuario_firmaMedico.html', controller: UsuarioLDAP_FirmaCtrl}
			    , {path: '/listar_usuarios_ldap', template: 'views/core/usuarios/listarLDAP.html', controller: UsuarioLDAP_ListCtrl}
			    , {path: '/asignar_rol_a_usuario', template: 'views/core/usuarios/usuario_administrarRoles.html', controller: UsuarioLDAP_AdministrarRolesCtrl}
			    , {path: '/asignar_perfil_a_rol', template: 'views/core/usuarios/usuario_administrarPerfiles.html', controller: UsuarioLDAP_AdministrarPerfilesCtrl}

			    //TipoRol , 
			    , {path: '/buscar_tipo_rol', template: 'views/core/usuarios/roles/tiposDeRol/admin.html', controller: TipoDeRolCtrl}
			    , {path: '/crear_tipo_rol', template: 'views/core/usuarios/roles/tiposDeRol/admin.html', controller: TipoDeRolCtrl}
			    , {path: '/eliminar_tipo_rol', template: 'views/core/usuarios/roles/tiposDeRol/admin.html', controller: TipoDeRolCtrl}
			    , {path: '/modificar_tipo_rol', template: 'views/core/usuarios/roles/tiposDeRol/admin.html', controller: TipoDeRolCtrl}
			    
			    //TipoDePerfil , 
			    , {path: '/crear_tipo_perfil', template: 'views/core/usuarios/perfiles/tiposDePerfil/crear.html', controller: TipoDePerfilCreateCtrl}
			    , {path: '/modificar_tipo_perfil', template: 'views/core/usuarios/perfiles/tiposDePerfil/crear.html', controller: TipoDePerfilCreateCtrl}
			    , {path: '/eliminar_tipo_perfil', template: 'views/core/usuarios/perfiles/tiposDePerfil/admin.html', controller: TipoDePerfilListCtrl}
			    , {path: '/listar_tipo_perfil', template: 'views/core/usuarios/perfiles/tiposDePerfil/admin.html', controller: TipoDePerfilListCtrl}
			    
			    //Tipos de ID , core/usuarios/tiposDeID_he
			    , {path: '/crear_tipo_id', template: 'views/core/usuarios/tiposDeID/adminTiposDeID.html', controller: TipoDeIDCtrl}
			    , {path: '/eliminar_tipo_id', template: 'views/core/usuarios/tiposDeID/adminTiposDeID.html', controller: TipoDeIDCtrl}
			    , {path: '/modificar_tipo_id', template: 'views/core/usuarios/tiposDeID/adminTiposDeID.html', controller: TipoDeIDCtrl}
			    
			    //Propiedades del template
			    , {path: '/crear_propiedad_de_template', template: 'views/core/templates/propiedades/admin.html', controller: PropiedadCtrl}
			    , {path: '/eliminar_propiedad_de_template', template: 'views/core/templates/propiedades/admin.html', controller: PropiedadCtrl}
			    , {path: '/modificar_propiedad_de_template', template: 'views/core/templates/propiedades/admin.html', controller: PropiedadCtrl}
			    
			    //Parametros
			    , {path: '/buscar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/crear_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/eliminar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/modificar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    
			    //Firmas Médico
			    , {path: '/modificar_firma_medico', template: 'views/historiaClinica/firmaMedico/modificar.html', controller: FirmaCtrl}
			    
			    //Funcion
//			    , {path: '/usuarios/funciones', template: 'views/usuarios/funciones/listar.html', controllper: FuncionCtrl}
//			    , {path: '/usuarios/funciones/crear', template: 'views/usuarios/funciones/crear.html', controller: FuncionCtrl}
//			    , {path: '/usuarios/funciones/editar/:idFuncion', template: 'views/usuarios/funciones/editar.html', controller: FuncionCtrl}
//			    , {path: '/usuarios/funciones/ver/:idFuncion', template: 'views/usuarios/funciones/ver.html', controller: FuncionCtrl} 
 				
			    //Cirugia
			    , {path: '/cirugias/reservas', template: 'views/cirugias/reservas.html', controller: CirugiaCtrl}
			    , {path: '/agenda_quirofanos', template: 'views/cirugias/reservas.html', controller: CirugiaCtrl}
			    
			    //Turnos
			    , {path: '/turnos/reservasProfesional', template: 'views/turnos/reservasProfesional.html', controller: TurnoProfesionalCtrl}
			    , {path: '/ver_turno_como_profesional', template: 'views/turnos/reservasProfesional.html', controller: TurnoProfesionalCtrl}
			    , {path: '/ver_historial_PacienteTurno', template: 'views/turnos/verHistorialPacienteTurno.html', controller: HistorialPacienteTurnoCtrl}
			    
			    //Pacientes
			    , {path: '/identificacion_de_pacientes', template: 'views/pacientes/identificacionDePaciente.html', controller: HistorialPacienteCtrl}
			    , {path: '/imprimir_hcdigital', template: 'views/historiaClinica/imprimirHCDigitalizada.html', controller: HCDigitalizadaImprimirCtrl}
			    
			    /**Internacion**/
			    //Internados (listado de cantidad de dias)
			    , {path: '/internacion/controlDias', template: 'views/internacion/admin.html', controller: ControlDiasCtrl}
			    , {path: '/internacion/ver_int_paciente', template: 'views/internacion/ver.html', controller: ControlDiasCtrl}
			    , {path: '/internacion/pacientesPorProfesional', template: 'views/internacion/internadosPorProfesional.html', controller: InternadosProfesionalCtrl}
			    
			    //Camas
			    , {path: '/internacion/criterio_de_asignacion', template: 'views/internacion/adminCriterioDeCamas.html', controller: CriterioDeAsignacionCamaCtrl}
			    , {path: '/internacion/asignacion_criteriocama', template: 'views/internacion/asignacion_criteriocama.html', controller: AsignacionCriterioCamaCtrl}
			    
			    //Epicrisis
			    , {path: '/epicrisis', template: 'views/internacion/epicrisis/admin.html', controller: EpicrisisCtrl}
			    , {path: '/escribir_epicrisis', template: 'views/internacion/epicrisis/crear.html', controller: EpicrisisCrearCtrl}
			    , {path: '/imprimir_epicrisis', template: 'views/internacion/epicrisis/imprimir.html', controller: EpicrisisImprimirCtrl}
			    
			  //Modalidades
			    , {path: '/buscar_modalidad', template: 'views/historiaClinica/pedidos/modalidades/admin.html', controller: ModalidadCtrl}
			    , {path: '/crear_modalidad', template: 'views/historiaClinica/pedidos/modalidades/admin.html', controller: ModalidadCtrl}
			    , {path: '/eliminar_modalidad', template: 'views/historiaClinica/pedidos/modalidades/admin.html', controller: ModalidadCtrl}
			    , {path: '/modificar_modalidad', template: 'views/historiaClinica/pedidos/modalidades/admin.html', controller: ModalidadCtrl}
			    
			    //Alma
			    , {path: '/abrir_alma', template: 'views/abrirAlma.html', controller: AbrirAlmaCtrl}
			    
			    //Ant_routes
		    ];

			//for every route definition in the array, creates an Angular route definition
			$.each(routes, function() {
				var newPath = {
					templateUrl: this.template,
					controller: this.controller
				};
				if (this.resolve) {
					newPath.resolve = this.resolve;
				}
				
				$routeProvider.when(this.path, newPath);
		    });
			//in any other case, redirects to the main view
			$routeProvider.otherwise({redirectTo:'/404'});

		}]
	);