'use strict';
/**
 * TipoDePerfilList Controller
 */
var TipoDePerfilListCtrl = function($scope, $rootScope, $routeParams, $filter, TipoDePerfilService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = true;
	
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		TipoDePerfilService.id = e.id;
		$rootScope.goTo("/modificar_tipo_perfil");
	};
	
	$scope.crear = function () {
		TipoDePerfilService.id = null;
		$rootScope.goTo("/crear_tipo_perfil");
	};


	$scope.list = function () {
		TipoDePerfilService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, sucursal 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['codigo'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['tipoRol.nombre'] = $scope._ORDEN_REVERSO;

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
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el tipo de perfil "+e.nombre;
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
		TipoDePerfilService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
					$scope.borrando.btnLoading = false;
				},
				$rootScope.manageError);
	};
	
	/************************************************************/
	$scope.elementos = [];
	
	if (!$routeParams.id){
		
		$scope.list();
		
	}else{
		$scope.editar({'id':$routeParams.id});	
	}
	
	/**************************************************************/
};