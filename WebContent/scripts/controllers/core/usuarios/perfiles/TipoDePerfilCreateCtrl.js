'use strict';
/**
 * TipoDePerfil Controller
 */
var TipoDePerfilCreateCtrl = function($scope, $rootScope, $routeParams, $filter, TipoDePerfilService, FuncionService,TipoDeRolService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	$scope.aplicarActuales = false;
	
	/**************************************************************/
	$scope.toggleAplicar = function(){
		$scope.aplicarActuales = !$scope.aplicarActuales;
	};
	/**************************************************************/
	$scope.cancelar = function(){

		$scope.resetElemento();
		
		$rootScope.goTo("/listar_tipo_perfil");
	};
	
	$scope.guardar = function () {
		
		$scope.elemento.funciones = [];
		
		$.each($scope.funciones, function(ix, fx){
			if (fx.enTipoDePerfil ){
				$scope.elemento.funciones.push(fx);
			}
		});
		
		
		$scope.hayMensajes = false;
		$scope.haciendo = true;
		
		if (!$scope.modificando){
			$scope.crear();
		}else{
			$scope.modificar();
		}
		
//		$scope.modificando editandoPropiedad
	};
	
	$scope.crear = function () {
		
		TipoDePerfilService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError
		);
	};

	$scope.modificar = function () {
		$scope.elemento.aplicarActuales = $scope.aplicarActuales;
		TipoDePerfilService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
					
				}, 
				$rootScope.manageError);
	};

	//Solo para coincidir con el comun
	$scope.list = function () {	};
	
	/***********************************************************************/
	//Tipos de Rol
	/***********************************************************************/
	$scope.roles=[];
	
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoRol = function(rol){

		$scope.elemento.tipoRol = rol;
		
		$("#listaRoles").dropdown("set text", rol.nombre);
		$("#listaRoles").dropdown("hide");
		
	};
	
	TipoDeRolService.listar(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.roles = response.paginador.elementos;
					$.each($scope.roles, function(ix, rol){
						$scope.roles[rol.nombre] = rol;
					});
					
					$("#listaRoles").dropdown();
				}
			}, function(err){console.error("ERROR AL LISTAR LOS TIPOS DE ROLES");console.error(err);}
	);
	
	
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
		
		var nombreMenu, nombreSubMenu, fx, indiceFX, indiceSubMenu, idMenu, idSubMenu,subMenuItem;
		
		//Recorro los menu
		for (var ix=0; ix<$scope.funciones.length; ix++){
			
			fx = $scope.funciones[ix];
			
			/////////////////Menu
			nombreMenu = fx.nombreMenu;
			idMenu = $rootScope.idealizarString(nombreMenu);
			if ( !_.some($scope.menues, {id:idMenu}) ){
				//Sino contiene el menu, lo agrego
				$scope.menues.push({'label': nombreMenu, 'id': idMenu, 'enPerfil': false});
				
				//Inicio el arreglo de submenues para este menu
				$scope.subMenues[nombreMenu] = [];
				
			}
			
			/////////////////Sub Menu
			nombreSubMenu = fx.nombreSubMenu;
			idSubMenu = $rootScope.idealizarString(nombreSubMenu);
			indiceSubMenu = _.findIndex($scope.subMenues[nombreMenu], function(subMenuItem) {
				return subMenuItem.label == fx.nombreSubMenu;
			});
			if ( indiceSubMenu == -1) {
				$scope.subMenues[nombreMenu].push({  'label':nombreSubMenu, 'menu':nombreMenu, 'id':  idSubMenu, 'enPerfil': false});
			}
			
			/////////////////Funcion
			//Marco la funcion si es que esta entre los elementos
			indiceFX = -1;
			if ($scope.elemento){
				indiceFX = _.findIndex($scope.elemento.funciones, function(fxElemento) {
					return fxElemento.url == fx.url;
				});
			}
			
			fx.enTipoDePerfil = indiceFX > -1;
			fx.enPerfil = indiceFX > -1;
			$scope.funciones[fx.url] = fx;
			
		}
		
		//Marco los actual
		$scope.seleccionoMenu($scope.menues[0]);
		$scope.seleccionoSubMenu($scope.subMenues[$scope.menuSeleccionado]);
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
	$scope.seleccionoFuncion = function(fx){
		/* Cambio a enPerfil porque sino no seleccionaba, si se vuelve a cambiar van a dejar de andar otras cosas  */
		fx.enTipoDePerfil = !fx.enTipoDePerfil;
//		fx.enPerfil = !fx.enPerfil;
		
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
	
	/************************************************************/
	
	
	/************************************************************/
	$scope.setElemento = function(elem){
		$scope.elemento = elem;
		//Una vez q tengo el elemento, listo las funciones
		$scope.seleccionoRol(elem.tipoRol);
		
		$scope.listarFunciones();
		
	};
	
	$scope.resetElemento = function(){
		$scope.haciendo = false;
//		$scope.modificando = false;
		
		if (!$scope.modificando)
			$scope.setElemento({borrado:false, funciones:[], tipoRol:{}});
	};
	
	if (!TipoDePerfilService.id){
		
		$scope.resetElemento();
		
	}else{
		
		$scope.modificando = true;
		
		TipoDePerfilService.findById(
			function(response) {
				
				$scope.setElemento(response);
			},
			$rootScope.manageError
		);
	}
	
	/**************************************************************/
};