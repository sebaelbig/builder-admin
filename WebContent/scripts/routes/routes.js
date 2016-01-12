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
			    
			    , {path: '/menu', template: 'views/layout/menubar.html', controller: MenuCtrl}
			    , {path: '/footer', template: 'views/layout/footer.html', controller: FooterCtrl}
 
	            //Usuarios 
			    , {path: '/ver_roles', template: 'views/core/usuarios/usuario_verRoles.html', controller: Usuario_VerRolesCtrl}
			    , {path: '/firmaMedico', template: 'views/core/usuarios/usuario_firmaMedico.html', controller: Usuario_FirmaCtrl}
			    , {path: '/listar_usuarios', template: 'views/core/usuarios/listar.html', controller: Usuario_ListCtrl}
			    , {path: '/asignar_rol_a_usuario', template: 'views/core/usuarios/usuario_administrarRoles.html', controller: Usuario_AdministrarRolesCtrl}
			    , {path: '/asignar_perfil_a_rol', template: 'views/core/usuarios/usuario_administrarPerfiles.html', controller: Usuario_AdministrarPerfilesCtrl}

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
			    
			    //Parametros
			    , {path: '/buscar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/crear_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/eliminar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    , {path: '/modificar_parametro', template: 'views/core/parametros/admin.html', controller: ParametroCtrl}
			    
			    //Funcion
//			    , {path: '/usuarios/funciones', template: 'views/usuarios/funciones/listar.html', controllper: FuncionCtrl}
//			    , {path: '/usuarios/funciones/crear', template: 'views/usuarios/funciones/crear.html', controller: FuncionCtrl}
//			    , {path: '/usuarios/funciones/editar/:idFuncion', template: 'views/usuarios/funciones/editar.html', controller: FuncionCtrl}
//			    , {path: '/usuarios/funciones/ver/:idFuncion', template: 'views/usuarios/funciones/ver.html', controller: FuncionCtrl}
			    
			    /**
			     * Aca empiezo con los paths de Builder Admin
			     */
			    , {path: '/listar_unidad_de_medida', template: 'views/unidadDeMedida/admin.html', controller: UnidadDeMedidaCtrl}
			    , {path: '/listar_designaciones', template: 'views/designacion/admin.html', controller: DesignacionCtrl}
			    , {path: '/listar_tipo_uni_funcionales', template: 'views/tipoUnidadFuncional/admin.html', controller: TipoUnidadFuncionalCtrl}
			    , {path: '/listar_unidades_funcionales', template: 'views/unidadFuncional/admin.html', controller: UnidadFuncionalCtrl}
			    , {path: '/listar_planificaciones', template: 'views/planificacion/admin.html', controller: PlanificacionCtrl}
			    
			    //Designacion , 
//			    , {path: '/buscar_designacion', template: 'views/designacion/admin.html', controller: DesignacionCtrl}
//			    , {path: '/crear_designacion', template: 'views/designacion/admin.html', controller: DesignacionCtrl}
//			    , {path: '/eliminar_designacion', template: 'views/designacion/admin.html', controller: DesignacionCtrl}
//			    , {path: '/modificar_designacion', template: 'views/designacion/admin.html', controller: DesignacionCtrl}
 				
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