/**
 * TipoRol TipoRol
 */
var TipoDeIDCtrl = function($scope, $rootScope, $routeParams, $filter, TipoDeIDService) {
	
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
		
		TipoDeIDService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError
		);
	};

	$scope.modificar = function () {

		TipoDeIDService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};


	$scope.list = function () {
		
		TipoDeIDService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};
	
	
	$scope.buscar= function () {

		TipoDeIDService.buscar(
			$scope.elemento.tipoID,	
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
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, sucursal 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['tipoID'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'tipoID';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'tipoID': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el tipo de ID "+e.tipoID;
		$scope.borrando.btnLoading = false;
		
		e.borrado = true;
		$('#modalEliminar').dimmer({closable:false}).dimmer('show');
	};
	
	// 1.1 Cancela
	$scope.cancelarEliminar = function(){
		$('#modalEliminar').dimmer('hide');
		$scope.borrando.borrado = false;
		$scope.borrando = null;
		
	};
	//1.2 Confirma
	$scope.eliminar = function () {
		$scope.borrando.btnLoading = true;
		TipoDeIDService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
					$scope.borrando.btnLoading = false;
				},
				$rootScope.manageError);
	};
	
	/************************************************************/
	
	/***********************************************************************/
	//INIT
	/***********************************************************************/
	$scope.estados = ["ACTIVO", "INACTIVO"];
	$scope.elemento = {};
	
	//Necesario para el global
	$scope.resetElemento= function(){
		$scope.elemento = {
				estado: $scope.estados[0], 
				login: $rootScope.loggedUser.usuario
		};
	};
	
	
	if (!$routeParams.id){
		
		//Listando
		$scope.list();
		
	}else{
		
		//Editando
		TipoDeIDService.findById(
				$routeParams.id, 
				function(response) {
					
					if (response.ok) {
						//Recupero el tipo de tipoDeID corerctamente
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
	};
	
	//Cancelar
	$scope.cancelar = function() {

		$scope.hayMensajes = false;
		$scope.mensajes;
		
		$scope.haciendo = false;
		$scope.modificando = false;
		$scope.elemento = {estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
		
		$scope.list();
	};
	
	//Listar
	$scope.listar = function() {
		$scope.list();
	};
	/***********************************************************************/
};