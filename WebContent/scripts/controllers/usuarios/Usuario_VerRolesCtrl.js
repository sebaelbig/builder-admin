'use strict';
/**
 * Usuario  Controller
 */
var Usuario_VerRolesCtrl = function($scope, $rootScope, $routeParams, UsuarioService, TipoDeRolService, RolService, PerfilService, TipoDeIDService, TipoDePerfilService, ServicioService, FuncionService) {
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
	$scope.usuario;
	
	//Cancela la asignación del rol
	$scope.volver = function(){
		$rootScope.goTo("/listar_usuarios_");
	};
	
	$scope.setElemento = function(rolAEditar){
		$scope.modificando = true;
		$scope.elemento = elem;
		
		$scope.setRol(rolAEditar);
		$("#listaServicios").dropdown();
		$("#listaServicios").dropdown("set text", rolAEditar.nombreServicio);
		$("#listaServicios").dropdown("hide");
		
	};
	
	$scope.inicializarElemento = function(){
//		$scope.resetElemento();
		
//		$scope.recuperandoRoles = true;
		UsuarioService.getUsuarioPorUsername(
			function(resp) {
				
//				$scope.cancelar();
				
				$scope.usuario = resp.paginador.elementos[0];
//				$scope.rol.usuario = {id: $scope.usuario.id};
				
//				$scope.recuperandoRoles = false;
				
			},
			function(resp){
//				$scope.recuperandoRoles = false;
				$rootScope.manageError(resp);
			}
		);
	};
	
	$scope.recuperandoRoles = false;
	if (!UsuarioService.username){
		
		$rootScope.goTo("/listar_usuarios");
		
	}else{
		
		$scope.inicializarElemento();
		
	}
	
	/**************************************************************/
	
};