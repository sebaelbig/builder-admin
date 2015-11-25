'use strict';
/**
 * TipoDeRol Controller
 */
var TipoDeRolCtrl = function($scope, $rootScope, $routeParams, $filter, TipoDeRolService, TipoDeIDService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		
		$('html, body').animate({scrollTop : 0},800);
		$scope.hayMensajes = false;
		$scope.elemento = e;
		$scope.modificando = true;
		
		if ($scope.elemento.codigoID_x_default){
			
			var tipo = $scope.tipos[e.codigoID_x_default.toLowerCase()];
			
			//Selecciono el tipo por default y lo seteo en la vista si tiene alguno establecido x default
			$scope.seleccionoTipo(tipo);
			
		}else{
			
			$("#listaTipos").dropdown("set text", "Elija tipo ID");
			
		}
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
		
		$("#listaTipos").dropdown("set text", "Elija tipo ID");
	};
	
	$scope.guardar = function () {
		
		$scope.hayMensajes = false;
		$scope.haciendo = true;
		
		if (!$scope.modificando){
			$scope.crear();
		}else{
			$scope.modificar();
		}
		
		$scope.modificando = false;
	};
	
	$scope.crear = function () {
		$scope.elemento.codigo = $scope.elemento.id_rol;
		TipoDeRolService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError);
	};

	$scope.modificar = function () {

		$scope.elemento.codigo = $scope.elemento.id_rol;
		TipoDeRolService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				},  
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		TipoDeRolService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};

	/**************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el tipo de rol "+e.nombre;
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
		TipoDeRolService.eliminar(
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
	//Tipos de ID
	/***********************************************************************/
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoTipo = function(tipo){

		$scope.elemento.idTipoID = tipo.id;
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
			}, function(err){console.error("ERROR AL LISTAR TIPOS DE ID");}
	);
	
	
	/************************************************************/
	/*						Estados							*/
	/************************************************************/
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
	//codigo, nombre, area 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['sitio'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['prioridad'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'nombre';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'nombre': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/**************************************************************/
	$scope.elementos = [];
	$scope.estados = ["ACTIVO", "INACTIVO"];
	
	$scope.resetElemento = function(){
		$scope.haciendo = false;
		$scope.modificando = false;
		$scope.elemento = {borrado:false, estado: $scope.estados[0], login: $rootScope.loggedUser.usuario};
	};
	
	$scope.resetElemento();
	if (!$routeParams.idTipoDeRol){
		$scope.list();
	}else{
		TipoDeRolService.findById(
			$routeParams.idTipoDeRol, 
			function(response) {
				if (response.ok) {

					var elemento = response.data;
					$scope.elemento = elemento;
				}
			},
			$rootScope.manageError
		);
	}
	/**************************************************************/
	
};