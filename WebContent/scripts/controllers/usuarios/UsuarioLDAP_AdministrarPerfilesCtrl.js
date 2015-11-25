'use strict';
/**
 * Usuario LDAP Controller
 */
var UsuarioLDAP_AdministrarPerfilesCtrl = function($scope, $rootScope, $routeParams, RolService, PerfilService, TipoDePerfilService, ServicioService, FuncionService) {
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.modificando = false;
	$scope.haciendo = true;
	
	$scope.volver = function(){
		$rootScope.goTo("/asignar_rol_a_usuario");
	};
	
	$scope.guardar = function(){
		
		//Limpiar las funciones del elemento
		$scope.elemento.funciones = [];
		
		//Asignarle las funciones marcadas
		$.each($scope.funciones, function(ix, fx){
			if (fx.enPerfil ){
				$scope.elemento.funciones.push(fx);
			}
		});
		
		if ($scope.rol!=null && $scope.elemento.idRol ==null)
			$scope.elemento.idRol = $scope.rol.id;
		
		if ($scope.validar())
		{
			$scope.haciendo = true;
			
			//Lo agrego o reemplazo de la coleccion de perfiles del rol
			if ($scope.modificando){
				
				var indicePerfil = _.findIndex($scope.rol.perfiles, function(perfil) {
					return perfil.id == $scope.elemento.id;
				});
				
				$scope.rol.perfiles[indicePerfil] = $scope.elemento;
				
			}else{
				$scope.rol.perfiles.push($scope.elemento);
			}
			
			$scope.modificarRol();
			
		}else{
			$scope.hayMensajes = true;
			$scope.mensajes = {mensaje: "Falta ingresar datos obligatorios del perfil.", error: true};
		}
		
		
	};
	
	$scope.validar = function(){
		return $scope.elemento.tipoPerfil !=null 
				&& $scope.elemento.idServicio !=null
				&& $scope.elemento.codigo !=null
				&& $scope.elemento.idRol !=null;
	};
	
	$scope.modificarRol = function(){
		
		//Mando a modificar el ROL
		RolService.modificar(
			$scope.rol, 
			function(response){
				
				$scope.haciendo = false;
				$scope.hayMensajes = true;
				
				if (response.ok) {
					
					//Hubo datos de vuelta
					if (response.paginador.elementos &&
							response.paginador.elementos.length >= 0){
						
						//Si maneja colecciones, lo agrego
						$scope.rol = response.paginador.elementos[0];
						
						$scope.elementos = $scope.rol.perfiles;
						$scope.resetElemento();
						
						$scope.haciendo = false;
						
						var mensaje = "El perfil se agregó/modificó correctamente";
						if ($scope.borrando != null){
							$('#modalEliminar').dimmer('hide');
							$scope.borrando.btnLoading = false;
							mensaje = "El perfil se eliminó correctamente";
						}
						
						//No hubo datos de vuelta -> errores
						$scope.mensajes = {mensaje: mensaje, error:false} ;
					}else{
						$scope.mensajes = {mensaje:response.mensaje, error:true} ;
					}
					
				}else{
					$scope.mensajes = {mensaje:response.mensaje, error:true} ;
				}
				
				$("#listaPerfiles").dropdown("set text", "Elija Perfil");
				$("#listaServicios").dropdown("set text", "Elija Servicio");
			},
			$rootScope.manageError
		);
	};
	
	
	$scope.editar = function(perfil){
		
		$scope.elemento = perfil;
		$scope.modificando = true;
		
		$scope.seleccionoTipoPerfil(perfil.tipoPerfil);
		$scope.seleccionoServicio({nombre: perfil.nombreServicio, id: perfil.idServicio});
		
	};
	
	/***********************************************************************/
	//Tipos de Perfil
	/***********************************************************************/
	$scope.tiposDePerfil=[];
	
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoTipoPerfil = function(tipoPerfil){
		
		//Me guardo en el elemento el tipo perfil seleccionado
		$scope.elemento.tipoPerfil = tipoPerfil;
		$scope.elemento.nombre = tipoPerfil.nombre;
		$scope.elemento.codigo = tipoPerfil.codigo;
		
		//Marco las funciones del tipo de perfil en mi coleccion de TODAS las funciones
		$scope.marcarFunciones(tipoPerfil.funciones, ($scope.modificando)?$scope.elemento.funciones:[]);

		//Se marcan los menues una vez q se marcaron las funciones grales
		$scope.marcarMenues(); 
		
		$("#listaPerfiles").dropdown("set text", tipoPerfil.nombre);
		$("#listaPerfiles").dropdown("hide");
		
	};
	
	$scope.listarTiposDePerfil = function(tipoRolSeleccionado){
		
		TipoDePerfilService.buscarPorRol(
				tipoRolSeleccionado.id,
				function(response) 
				{
					
					if (response.ok) {
						//Tomo los datos del paginador
						
						if (response.paginador.elementos.length == 0){
							//El tipo de rol del rol seleccionado NO tiene ningun tipo de perfil que le haga referencia, 
							//deberá crearse primero algun tipo de perfil de ese tipo de rol para poder asignarle un perfil
							
							$scope.hayMensajes = true;
							$scope.mensajes = {mensaje:"El tipo de rol del rol seleccionado NO tiene ningun tipo de perfil que le haga referencia, deberá crearse primero algun tipo de perfil de ese tipo de rol para poder asignarle un perfil.", error:true} ;
							
						}else{
								
							$scope.tiposDePerfil = response.paginador.elementos;
							
							$("#listaPerfiles").dropdown();
							$("#listaPerfiles").dropdown("set text", "Elija Perfil"); 
							
						}
						
					}
					
				}, function(err){}
		);
	};
	
	/************************************************************/
	/*						Servicios							*/
	/************************************************************/
	$scope.servicios=[];
	
	$scope.listarServicios = function(){
		
		try{ $("#listaServicios").dropdown("set text", "Elija Servicio"); }catch(e){}
		ServicioService.listar(
				function(resp){
					if (resp.ok){
						$scope.servicios = resp.paginador.elementos;
						
						$("#listaServicios").dropdown();
					}
				},
				function(err){console.error("Error al listar los servicios");}
		);
	};
	
	$scope.seleccionoServicio = function(srv){
		
		if ($scope.modificando){
			//Estoy editando un perfil, solo establezco el servidcio del perfil para seleccionar en el combo
			$scope.servicios = [];
			$scope.servicios.push(srv);
			
		}
		
		$scope.elemento.servicio = srv;
		$scope.elemento.nombreServicio = srv.nombre;
		$scope.elemento.idServicio = srv.id;
		
		$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		
	};
	
	/************************************************************/
	/*						Funciones							*/
	/************************************************************/
	$scope._funciones=[]; //Almacena todas las funcinoes
	$scope.funciones=[]; //Arreglo que se usa para la edicion
	
	$scope.menues = [];
	$scope.subMenues = [];
	
	$scope.subMenuesVista = [];
	$scope.funcionesVista = [];
	
	$scope.menuSeleccionado="";
	$scope.subMenuSeleccionado="";
	
	/**
	 * Agrupa las funciones primero por nombreMenu y luego por nombreSubMenu
	 */
	$scope.agruparFunciones = function(){
		
		var nombreMenu, nombreSubMenu, fx, indiceSubMenu, idMenu, idSubMenu;
		
		//Recorro las funciones
		for (var ix=0; ix<$scope.funciones.length; ix++){
			
			fx = $scope.funciones[ix];
			
			/////////////////Menu
			nombreMenu = fx.nombreMenu;
			idMenu = $scope.idealizarString(nombreMenu);
			if ( !_.some($scope.menues, {id:idMenu}) ){
				//Sino contiene el menu, lo agrego
				$scope.menues.push({'label': nombreMenu, 'id': idMenu, 'enPerfil': false, 'enTipoPerfil':false});
				
				//Inicio el arreglo de submenues para este menu
				$scope.subMenues[nombreMenu] = [];
				
			}
			
			/////////////////Sub Menu
			nombreSubMenu = fx.nombreSubMenu;
			idSubMenu = $scope.idealizarString(nombreSubMenu);
			indiceSubMenu = _.findIndex($scope.subMenues[nombreMenu], function(subMenuItem) {
				return subMenuItem.label == fx.nombreSubMenu;
			});
			if ( indiceSubMenu == -1) {
				//Sino contiene el subMenu, lo agrego
				$scope.subMenues[nombreMenu].push({  'label':nombreSubMenu, 'menu':nombreMenu, 'id':  idSubMenu, 'enPerfil': false, 'enTipoPerfil':false});
			}
			
			/////////////////Funcion
			//Inicializo el estado
			fx.enTipoPerfil = false;
			fx.enPerfil = false;
			
			//Armo una hash de funciones segun la URL
			$scope.funciones[fx.url] = fx;
			
		}
		
		//Marco los actual
		$scope.seleccionoMenu($scope.menues[0]);
		$scope.seleccionoSubMenu($scope.subMenues[$scope.menuSeleccionado]);
	};
	
	$scope.idealizarString = function (string){
		return string.replace(/\s+/g, '');
	};
	
	/**
	 * Seteo los submenues del menu seleccionado
	 */
	$scope.seleccionoMenu = function(menuName) {
		$scope.menuSeleccionado = menuName.label;
		$scope.subMenuesVista = $scope.subMenues[menuName.label];
		$scope.funcionesVista = [];
	};
	
	/**
	 * Listo las funciones del subMenu y menu seleccionado
	 */
	$scope.seleccionoSubMenu = function(subMenu) {
		
		$scope.subMenuSeleccionado = subMenu.label;
		
		//Filtro las funciones por el menu y subMenu seleccionado
		$scope.funcionesVista = _.filter($scope.funciones, 
				function(fx) { 
					return fx.nombreMenu == subMenu.menu 
							&& fx.nombreSubMenu == subMenu.label;
				}
		);
		
	};

	/**
	 * Selecciono una funcion 
	 */
	$scope.seleccionoFuncion = function(fxDeVista){
		
		fxDeVista.enPerfil = !fxDeVista.enPerfil;
		
		//Marco las funciones
		var indiceFuncion = _.findIndex($scope.funciones, function(funGral) {
			return funGral.url == fxDeVista.url;
		});
		
		if (indiceFuncion>-1){
			$scope.funciones[indiceFuncion].enPerfil = fxDeVista.enPerfil;
			
			//Me fijo si la funcion que cambio de esta en el Tipo de Perfil
			indiceFuncion = _.findIndex($scope.elemento.tipoPerfil.funciones , function(funEnTipoPerfil) {
				return funEnTipoPerfil.url == fxDeVista.url;
			});
			
			if (indiceFuncion>-1)
				fxDeVista.enTipoPerfil = true;
			else
				fxDeVista.enTipoPerfil = false;
		}
		
		
		//Me fijo si no hay funciones visibles seleccionadas, deselecciono el SubMenu
		var hayEnSubmenu = _.some($scope.funcionesVista, 'enPerfil');
		if (!hayEnSubmenu){
			
			//Marco el sub menu que esta en el perfil
			var indiceSubMenu = _.findIndex($scope.subMenues[fxDeVista.nombreMenu], function(subMenuItem) {
				return subMenuItem.label == fxDeVista.nombreSubMenu;
			});
			$scope.subMenues[fxDeVista.nombreMenu][indiceSubMenu].enPerfil = false;
			
			var subMenuesDeFuncion = $scope.subMenues[fxDeVista.nombreMenu];
			var hayEnMenu = _.some(subMenuesDeFuncion, 'enPerfil');
			
			if (!hayEnMenu){
				
				//Marco el menu que esta en el perfil
				var indiceMenu = _.findIndex($scope.menues, function(menuItem) {
					return menuItem.label == fxDeVista.nombreMenu;
				});
				$scope.menues[indiceMenu].enPerfil = false;
				
			}
			
		}
		$scope.marcarMenues();
		
	};
	
	
	/**
	 * Resetea las listas de las funciones
	 */
	$scope.resetListaFunciones = function(){
		
		$scope.funciones = _.clone($scope._funciones, true);
		
		$scope.subMenuesVista = [];
		$scope.funcionesVista = [];
		
		$scope.menuSeleccionado="";
		$scope.subMenuSeleccionado="";
		
		$scope.agruparFunciones();
		
	};
	
	$scope.listarFunciones = function(){
		FuncionService.listar(
				function(resp){
					if (resp.ok){
						
						$scope._funciones = resp.paginador.elementos;
						
						$scope.resetListaFunciones();
						
					}
				},
				function(err){console.error("Error al listar las funciones");}
		);
	};
	
	/**
	 * Marca las funciones
	 */
	$scope.marcarMenues = function(){
		
		var fx,indiceMenu,indiceSubMenu;
		
		//Recorro los menu
		for (var ix=0; ix< $scope.funciones.length; ix++){
			
			fx = $scope.funciones[ix];
			
			//Marco el menu que esta en el perfil
			indiceMenu = _.findIndex($scope.menues, function(menuItem) {
				return menuItem.label == fx.nombreMenu;
			});
			$scope.menues[indiceMenu].enPerfil = ($scope.menues[indiceMenu].enPerfil || fx.enPerfil);
			
			//Marco el sub menu que esta en el perfil
			indiceSubMenu = _.findIndex($scope.subMenues[fx.nombreMenu], function(subMenuItem) {
				return subMenuItem.label == fx.nombreSubMenu;
			});
			$scope.subMenues[fx.nombreMenu][indiceSubMenu].enPerfil = ($scope.subMenues[fx.nombreMenu][indiceSubMenu].enPerfil || fx.enPerfil );
			
		}
		
	};
	
	/**
	 * Desmarcar funciones
	 */
	$scope.desmarcarFunciones = function(){
		for (var ix=0; ix< $scope.funciones.length; ix++){
			$scope.funciones[ix].enPerfil = false;
			$scope.funciones[ix].enTipoPerfil = false;
		}
	};
	
	/**
	 * Marco las funciones grales si la funcion esta en la coleccion pasada como parametro
	 */
	$scope.marcarFunciones = function( fxsTipoPerfil, fxsPerfil ){
		
		var fx, indiceFuncion;
		
		//Recorro todas las funciones
		for (var ix=0; ix< $scope.funciones.length; ix++){
			
			fx = $scope.funciones[ix];
			
			//Marco las funciones de los tipo de perfil
			indiceFuncion = _.findIndex(fxsTipoPerfil, function(funParametro) {
				return funParametro.url == fx.url;
			});
			
			if (indiceFuncion>-1){
				fx.enTipoPerfil = true;
				if(!$scope.modificando){
					fx.enPerfil = true;
				}
			}
			
			//Marco las funciones de los perfiles
			indiceFuncion = _.findIndex(fxsPerfil, function(funParametro) {
				return funParametro.url == fx.url;
			});
			
			if (indiceFuncion>-1)
				fx.enPerfil = true;
		}
		
	};
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	$scope.confirmarEliminar = function(e){
		
		$scope.borrando = e;
		$scope.borrando._cartel = " el perfil "+e.nombre;
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
		
		//Lo agrego o reemplazo de la coleccion de perfiles del rol
		var indicePerfil = _.findIndex($scope.rol.perfiles, function(perfil) {
			return perfil.id == $scope.borrando.id;
		});
			
		$scope.rol.perfiles[indicePerfil].borrado = true;
		$scope.borrando.btnLoading = true;
		
		$scope.modificarRol();
	};
	/************************************************************/
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
//	$scope.userLogged = $rootScope.loggedUser.usuario;
	$scope.estados = ["ACTIVO", "INACTIVO"];
	$scope.elementos = [];
	
	$scope.resetListas = function(){
		//El listar los tipos de perfil, depende del tipo de rol del rol
		$scope.listarServicios();
		$scope.listarFunciones();
	};
	
	
	/************************************************************/
	$scope.list = function(){
		$scope.inicializarElemento();
	};
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado: false, funciones:[], tipoPerfil:{}};
		
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
		
		$("#listaServicios").dropdown();
		$("#listaServicios").dropdown("set text", rolAEditar.nombreServicio);
		$("#listaServicios").dropdown("hide");
		
	};
	
	$scope.inicializarElemento = function(){
		$scope.resetElemento();
		
		RolService.findById(
			function(resp) {
				
				$scope.rol = resp;
				$scope.elementos = $scope.rol.perfiles;
				$scope.elemento.idRol = $scope.rol.id;
				$scope.elemento.nombreRol = $scope.rol.nombre;
				
				$scope.listarTiposDePerfil($scope.rol.tipoRol);
				
				$scope.haciendo = false;
				
			},
			function(resp){
				$scope.recuperandoRoles = false;
				$rootScope.manageError(resp);
			}
		);
	};
	
	$scope.recuperandoRoles = false;
	if (!RolService.id){
		
		 $rootScope.goTo("/asignar_rol_a_usuario");
		
	}else{
		
		$scope.inicializarElemento();
		$scope.resetListas();
		
	}
	
	/**************************************************************/
	
};