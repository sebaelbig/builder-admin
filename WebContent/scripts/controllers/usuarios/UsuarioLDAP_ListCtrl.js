'use strict';
/**
 * Usuario LDAP Controller
 */
var UsuarioLDAP_ListCtrl = function($scope, $rootScope, $filter, UsuarioLDAPService) {
	
	$scope.list = function () {
		
		$scope.haciendo = true;
		
		UsuarioLDAPService.listar(
			$scope.userLogged,
			function(response) {
				
				if (response.ok) {
	
					$scope.paginador.setTodos(response.paginador.elementos);
					$scope.paginador.actualizarLista();
					
					//Extraigo el grupo asi queda mas limpia la tabla
					var ix_start, ix_end;  
//					$.each(response.paginador.elementos, function(ix, usr){
//						
//						ix_start 	= usr.memberOf.indexOf("OU=") + 3;
//						ix_end 		= usr.memberOf.indexOf(",DC");
//						
//						usr.memberOf = usr.memberOf.slice(ix_start, ix_end);
//						
//					});
					
				}else{
					$scope.hayMensajes = true;
					$scope.mensajes = {error:true, mensaje:response.mensaje};
					               
				}
				
				$scope.haciendo = false;
				
			}, function(err){
				console.error("ERROR AL LISTAR");console.error(err);
				$scope.haciendo = false;
			}
		);
	};

	$scope.hayMensajes = false;
	$scope.mensajes = {error:false, mensajes: ""};
	
	$scope.elementos = [];
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	
	//nombreCompleto,usuario,email,memberOf 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['nombreCompleto'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['usuario'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['email'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['memberOf'] = $scope._ORDEN_REVERSO;
	
	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'nombreCompleto';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
	/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'nombreCompleto': $scope.nombreBusqueda});
		}
	});
	
	/************************************************************/
	var URL_BASE = "/listar_usuarios_ldap";
	/************************************************************/
	//Listar
	$scope.listar = function() {
		UsuarioLDAPService.goTo(URL_BASE);
	};
	
	$scope.administrarRoles = function(usr){
		UsuarioLDAPService.username = usr.usuario;
		$rootScope.goTo("/asignar_rol_a_usuario");
	};
	
	$scope.verRoles = function(usr){
		UsuarioLDAPService.username = usr.usuario;
		$rootScope.goTo("/ver_roles");
	};
	
	/************************************************************/
	/*						Firma del medico					*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.configurarFirma = function(usr){
		$rootScope.parametros = {username : usr.usuario};
		$rootScope.goTo("/firmaMedico");
	};
	
	/************************************************************/
	
	/************************************************************/
	/** INIT **/
	/************************************************************/
	$scope.userLogged = $rootScope.loggedUser.usuario;
	
	$scope.list();
	
};