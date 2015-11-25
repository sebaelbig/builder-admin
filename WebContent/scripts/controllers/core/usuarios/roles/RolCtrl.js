
/**
 * Rol HE Ctrl
 */
var RolCtrl = function($scope, $rootScope, $routeParams, RolService, TipoDeIDService) {
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	$scope.guardar = function () {
		
		if (!$scope.modificando){
			$scope.crear();
		}else{
			$scope.modificar();
		}
		
		$scope.modificando = false;
	};
	
	
	$scope.crear = function () {
		
		$scope.hayMensajes = false;
		$scope.haciendo = true;

		
	$scope.elemento.login = $rootScope.loggedUser.usuario;
	
	//$scope.currentFunction = $scope.guardar;
	RolService.crear(
		$scope.elemento, 
		function(response) {
			
			$scope.haciendo = false;
			$scope.hayMensajes = true;
			
			if (response.ok) {
				
				if (response.paginador.elementos.length>=0){
					//Hubo datos de vuelta
					$scope.elementos.push( response.data );
					$scope.mensajes = {mensaje:response.mensaje, error:false} ;
					
					$scope.elemento = {estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
					$scope.list();
				}else{
					//No hubo datos de vuelta -> errores
					$scope.mensajes = {mensaje:response.mensaje, error:true} ;
				}
				
			}else{
				$scope.mensajes = {mensaje:response.mensaje, error:true} ;
			}
		}, 
		$rootScope.manageError);
	};

	$scope.modificar = function () {
		
		//$scope.currentFunction = $scope.actualizar;
		$scope.elemento.login= $rootScope.loggedUser.usuario;
		
		
		RolService.modificar(
			$scope.elemento, 
			function(response) {
				$scope.haciendo = false;
				
				$scope.hayMensajes = true;
				if (response.ok) {
					
					if (response.paginador.elementos.length>=0){
						//Hubo datos de vuelta
						$scope.elementos.push( response.data );
						$scope.mensajes = {mensaje:response.mensaje, error:false} ;
						
						$scope.elemento = {estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
						$scope.list();
						
					}else{
						//No hubo datos de vuelta -> errores
						$scope.mensajes = {mensaje:response.mensaje, error:true} ;
					}
					
				}else{
					$scope.mensajes = {mensaje:response.mensaje, error:true} ;
				}
			}, 
			$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		RolService.listar(
				function(response) {
					if (response.ok) {
						//Tomo los datos del paginador
						$scope.elementos = response.paginador.elementos;
						
					}
				}, function(err){console.error("ERROR AL LISTAR");console.error(err);});
	};
	
	$scope.buscar= function () {

		$scope.currentFunction = $scope.list;
		RolService.buscar(
			$scope.elemento,	
			function(response) {
			if (response.ok) {

				//Tomo los datos del paginador
				$scope.elementos = response.paginador.elementos;

			}
		}, function(err){console.error("ERROR AL LISTAR");console.error(err);});
	};

	$scope.toggleEstado = function() {
		var ixEstado = $scope.estados.indexOf($scope.elemento.estado);
		$scope.elemento.estado = $scope.estados[ (ixEstado+1)%2 ];
	};
	
	/***********************************************************************/
	//Tipos de ID
	/***********************************************************************/
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoTipo = function(tipo){

		$scope.elemento.id_tipoId = tipo.id_tipoId;
		$scope.elemento.tipoID = tipo.tipoID;
		$scope.elemento.codigoID_x_default = tipo.id_tipoId;
		
		$("#listaTipos").dropdown("set text", tipo.tipoID);
		$("#listaTipos").dropdown("hide");
		
	};
	
	TipoDeIDService.listar(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.tipos = response.paginador.elementos;
					$.each($scope.tipos, function(ix, tipo){
						$scope.tipos[tipo.tipoID.toLowerCase()] = tipo;
					});
					
					$("#listaTipos").dropdown();
				}
			}, function(err){console.error("ERROR AL LISTAR");console.error(err);}
	);
	
	/***********************************************************************/
	//INIT
	/***********************************************************************/
	$scope.estados = ["ACTIVO", "INACTIVO"];
	$scope.elemento = {estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
	
	
	if (!$routeParams.id){
		
		//Listando
		$scope.list();
		
	}else{
		
		//Editando
		RolService.findById(
				$routeParams.id, 
				function(response) {
					
					if (response.ok) {
						//Recupero el tipo de rol corerctamente
						$scope.elemento = response.data;
					}
					
				},$rootScope.manageError);
	}
	
	/***********************************************************************/
	//Crear
	//Actualizar
	$scope.editar = function(u) {
		$scope.elemento = u;
		$scope.modificando = true;
		
		if ($scope.elemento.codigoID_x_default){
			
			var tipo = $scope.tipos[$scope.elemento.codigoID_x_default.toLowerCase()];
			
			//Selecciono el tipo por default y lo seteo en la vista si tiene alguno establecido x default
			$scope.seleccionoTipo(tipo);
			
		}else{
			
			$("#listaTipos").dropdown("set text", "Elija tipo ID");
			
		}
		
	};
	//Cancelar
	//Ver
	$scope.ver = function(u) {
		$scope.elemento = u;
		$scope.modificando = true;
	};
	$scope.cancelar = function() {

		$scope.hayMensajes = false;
		$scope.mensajes;
		
		$scope.haciendo = false;
		$scope.modificando = false;
		
		$scope.elemento = {estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
		$scope.list();
		
		$("#listaTipos").dropdown("set text", "Elija tipo ID");
	};
	//Listar
	$scope.listar = function() {
		$scope.list();
	};
	/***********************************************************************/
};