'use strict';
/**
 * Usuario LDAP Controller
 */
var UsuarioLDAP_VerRolesCtrl = function($scope, $rootScope, $routeParams, UsuarioLDAPService, TipoDeRolService, RolService, PerfilService, TipoDeIDService, TipoDePerfilService, ServicioService, FuncionService) {
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
	$scope.usuario;
	
	//Cancela la asignación del rol
	$scope.volver = function(){
		$rootScope.goTo("/listar_usuarios_ldap");
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
		UsuarioLDAPService.getUsuarioPorUsername(
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
	if (!UsuarioLDAPService.username){
		
		$rootScope.goTo("/listar_usuarios_ldap");
		
	}else{
		
		$scope.inicializarElemento();
		
	}
	
	/**************************************************************/
	
};