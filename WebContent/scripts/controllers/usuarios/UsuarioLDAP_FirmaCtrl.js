'use strict';
/**
 * Usuario LDAP Controller
 */
var UsuarioLDAP_FirmaCtrl = function($scope, $rootScope, $filter, UsuarioLDAPService) {
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.elementos = [];
	
	/************************************************************/
	
	//Cancela la asignación del rol
	$scope.volver = function(){
		$rootScope.goTo("/listar_usuarios_ldap");
	};
	
	/************************************************************/
	/*						Firma del medico					*/
	/************************************************************/
	$scope.firma = {texto:""};
	
	// 1 Pide confirmacion
	$scope.guardar = function(){

		$scope.haciendo = true;
		
		var fx = ($scope.modificando)?UsuarioLDAPService.modificarFirma:UsuarioLDAPService.crearFirma;
		fx($scope.firma, 
				function(resp){
					
					$scope.haciendo = false;

					if (resp.ok){
						$scope.firma = resp.paginador.elementos[0]; 
					}else{
						$scope.firma = null;
					}
					
					$scope.hayMensajes = true;
					$scope.mensajes = {mensaje: resp.mensaje, error: !resp.ok};
				},
			$rootScope.manageError
		);
		
	};
	
	// 1.1 Cancela
	$scope.cancelarFirmar = function(){
		$scope.firma = {texto:""};
		$scope.haciendo = false;
	};
	
	/************************************************************/
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
	$scope.userLogged = $rootScope.loggedUser.usuario;
	
	$scope.modificando = false;
	$scope.haciendo = true;
	$scope.invalido = false;
	UsuarioLDAPService.recuperarFirmaDeUsuario(
			$rootScope.parametros,
			function(resp){
				
				if (resp.ok){
					
					$scope.firma = resp.paginador.elementos[0]; 
					$scope.modificando = true;
					
				}else{
					
					$scope.modificando = false;
					$scope.hayMensajes = true;
					$scope.mensajes = {mensaje: resp.mensaje, error: !resp.ok};
					$scope.invalido = true;
				}
				
				$scope.firma.usuario = $rootScope.parametros.username;
				
				$scope.haciendo = false;
			},
			$rootScope.manageError
	);
};