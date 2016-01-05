'use strict';
/**
 * Usuario  Controller
 */
var Usuario_AdministrarRolesCtrl = function($scope, $rootScope, $routeParams, UsuarioService, TipoDeRolService, RolService, TipoDeIDService) {
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.modificando = false;
	
	$scope.volver = function(){
		UsuarioService.username = null;
		$rootScope.goTo("/listar_usuarios_");
	};
	
	$scope.administrarPerfiles = function(rol){
		RolService.id = rol.id;
		$rootScope.goTo("/asignar_perfil_a_rol");
	};
	
	$scope.guardar = function(){
		
		if ($scope.modificando){
			$scope.modificar();
		}else{
			//Esta creando un rol/perfil nuevo
			$scope.crear();
		}
		
	};
	
	$scope.validar = function(){
		
		var resul = {ok:true, mensaje:'Todo ok'};
		
		if (!$scope.modificando){
			
			//YA tiene un rol con ese nombre    
			if (_.filter($scope.elementos, { 'nombre': $scope.elemento.nombre}).length>0){
				
				resul.ok = false;
				resul.mensaje = "Ya posee un rol de ese tipo.";
			}
			
			//Ingreso un tipo de ID
			if ($scope.elemento.tipoId == null ){
				resul.ok = false;
				resul.mensaje = "Debe seleccionar un tipo de ID";
				
			}
		}
		try{
			$scope.elemento.valorTipoID = Number.parseInt($scope.elemento.valorTipoID);
		}catch(e){}
		
		//Ingreso un valor en numeros
		if ($scope.elemento.valorTipoID == null || 
				$scope.elemento.valorTipoID == '' ||
				typeof($scope.elemento.valorTipoID) !="number"){
			
			resul.ok = false;
			resul.mensaje = "Debe ingresar SOLO números como valor de ID";
		}
		
		return resul;
		
	};
	
	$scope.modificar = function(){
		
		var validacion = $scope.validar();
		if (validacion.ok)
		{
			$scope.haciendo = true;
			RolService.modificar(
					$scope.elemento, 
					function(resp){
						$rootScope.manageSaveCallback($scope, resp);
						$("#listaRoles").dropdown("set text", "Elija rol");
						$("#listaTipos").dropdown("set text", "Elija tipo");
					},
					$rootScope.manageError);
		}else{
			$scope.hayMensajes = true;
			$scope.mensajes = {mensaje: validacion.mensaje, error: true};
		}	
		
	};
	$scope.crear = function(){
		
		var validacion = $scope.validar();
		if (validacion.ok)
		{
			$scope.haciendo = true;
			RolService.crear(
					$scope.elemento, 
					function(resp){
						$rootScope.manageSaveCallback($scope, resp);
						$("#listaRoles").dropdown("set text", "Elija rol");
						$("#listaTipos").dropdown("set text", "Elija tipo");
					},
					$rootScope.manageError);
		}else{
			$scope.hayMensajes = true;
			$scope.mensajes = {mensaje: validacion.mensaje, error: true};
		}	
		
	};
	
	/***********************************************************************/
	//Tipos de Rol
	/***********************************************************************/
	$scope.tiposDeRol=[];
	
	
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoTipoRol = function(tipoRol){
		
		tipoRol.seleccionada = true;
		
		$scope.elemento.tipoRol = tipoRol;
		$scope.elemento.nombre = tipoRol.nombre;
		$scope.elemento.codigo = tipoRol.codigo;
		
		$("#listaRoles").dropdown("set text", tipoRol.nombre);
		$("#listaRoles").dropdown("hide");
		
	};
	
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.editar = function(rol){

		$scope.modificando = true;
		
		$scope.elemento = rol;
		
		$("#listaRoles").dropdown("set text", rol.tipoRol.nombre);
		$("#listaRoles").dropdown("hide");
		
		//Selecciono el tipo por default y lo seteo en la vista si tiene alguno establecido x default
		$scope.seleccionoTipo( rol.tipoId );
		
	};
	
	$scope.listarTiposDeRol = function(){
		
		try{ $("#listaRoles").dropdown("set text", "Elija Rol"); }catch(e){}
		TipoDeRolService.listar(
				function(response) {
					if (response.ok) {
						//Tomo los datos del paginador
						$scope.tiposDeRol = response.paginador.elementos;
//						$.each($scope.tiposDeRol, function(ix, tipoRol){
//							$scope.tiposDeRol[tipoRol.nombre] = tipoRol;
//						});
						
						$("#listaRoles").dropdown();
						
					}
				}, function(err){console.error("ERROR AL LISTAR LOS TIPOS DE ROLES");}
		);
	};
	
	/************************************************************/
	/*						Tipos de ID							*/
	/************************************************************/
	//Tipos Hash
	$scope.tiposDeID=[];
	
	
	$scope.listarTiposID = function () {
		
		try{ $("#listaTipos").dropdown("set text", "Elija tipo"); }catch(e){}
		TipoDeIDService.listar(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.tiposDeID = response.paginador.elementos;
//					$.each($scope.tiposDeID, function(ix, tipoID){
//						$scope.tiposDeID[tipoID.tipoID] = tipoID;
//					});
//					
					$("#listaTipos").dropdown();
					
				}
			}, function(err){console.error("ERROR AL LISTAR TIPOS DE ID");}
		);
	};
	
	/**
	 * Presiona sobre un Tipo de ID disponible
	 */
	$scope.seleccionoTipo = function(tipo){

		$scope.elemento.tipoId = tipo;
		$scope.elemento.codigoID_x_default = tipo.id_tipoId;
		
		$("#listaTipos").dropdown("set text", tipo.tipoID);
		$("#listaTipos").dropdown("hide");
		
	};
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	$scope.confirmarEliminar = function(e){
		
		$scope.borrando = e;
		$scope.borrando._cartel = " el rol "+e.nombre;
		$scope.borrando.btnLoading = false;
		
		e.borrado = true;
		$('#modalEliminar').dimmer({closable:false}).dimmer('show');
	};
	
	// 1.1 Cancela
	$scope.cancelarEliminar = function(){
		$('#modalEliminar').dimmer('hide');
		$scope.borrando.borrado = false;
		$scope.borrando = null;
		
		$scope.mensajes = {};	
		
	};
	//1.2 Confirma
	$scope.eliminar = function () {
		
		$scope.borrando.btnLoading = true;
		
		RolService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
					$scope.borrando.btnLoading = false;
				},
				$rootScope.manageError
		);
	};
	/************************************************************/
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
//	$scope.userLogged = $rootScope.loggedUser.usuario;
	$scope.estados = ["ACTIVO", "INACTIVO"];
	$scope.elementos = [];
	
	$scope.usuarioAAsignar= {roles : []};
	
	$scope.resetListas = function(){
		
		$scope.listarTiposDeRol();
		$scope.listarTiposID();
	};
	$scope.resetListas();
	
	/************************************************************/
	
	$scope.resetElemento = function(){
//		$scope.elemento = {borrado:false, propiedades:[], servicio:null};
		
//		$scope.usuario = {roles: []};
		$scope.elemento = {estado: $scope.estados[0], borrado: false, tipoRol:{}, perfiles:[], valorTipoID:''};
		
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	//Cancela la asignación del rol
	$scope.cancelar = function(){
		
		$scope.resetElemento();
		$scope.resetListas();
		
	};
	
	$scope.setElemento = function(rolAEditar){
		$scope.modificando = true;
		$scope.elemento = elem;
		
		$scope.setRol(rolAEditar);
		$("#listaServicios").dropdown();
		$("#listaServicios").dropdown("set text", rolAEditar.nombreServicio);
		$("#listaServicios").dropdown("hide");
		
	};
	
	$scope.list = function(){
		$scope.inicializarElemento();
	};
	
	$scope.inicializarElemento = function(){
		$scope.resetElemento();
		
		$scope.haciendo = true;
		UsuarioService.getUsuarioRolesPorUsername(
			function(resp) {
				
				if (resp.ok){
					
					$scope.usuario = resp.paginador.elementos[0];
					$scope.elementos = $scope.usuario.roles;
					$scope.elemento.usuario = $scope.usuario;
					
				}else{
					$scope.hayMensajes = true;
					$scope.mensajes = {error:true, mensaje:resp.mensaje};
				}
				
				$scope.haciendo = false;
				
			},
			function(resp){
				$scope.recuperandoRoles = false;
				$rootScope.manageError(resp);
			}
		);
	};
	
	$scope.recuperandoRoles = false;
	if (!UsuarioService.username){
		
		$rootScope.goTo("/listar_usuarios_");
		
	}else{
		
		$scope.inicializarElemento();
		
	}
	
	/**************************************************************/
	
};