'use strict';
/**
 * TemplatePublicoListCtrl Controller
 */
var TemplatePublicoListCtrl = function($scope, $rootScope, $routeParams, $filter, TemplatePublicoService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = true;
	
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.cancelar = function(){

		$scope.resetElemento();
		
		$rootScope.goTo("listar_template_privado");
	};
	
	$scope.editar = function (e) {
		TemplatePublicoService.id = e.id;
		$rootScope.goTo("_modificar_template_publico");
	};
	
	$scope.crear = function () {
		TemplatePublicoService.id = null;
		$rootScope.goTo("_crear_template_publico");
	};


	$scope.list = function () {
		
		TemplatePublicoService.listarDeServicioDeUsuario(
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
	$scope._ordenesOrdenacion['titulo'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'titulo';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	/*$scope.$watch('nombreBusqueda', function() {
		$scope.paginador.filtrarPor({'titulo': $scope.nombreBusqueda});
	});*/
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la plantilla pública "+e.titulo;
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
		TemplatePublicoService.eliminar(
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
	
	if (!$routeParams.idTemplate){
		
		$scope.list();
		
	}else{
		TemplatePublicoService.id=$routeParams.idTemplate;
		TemplatePublicoService.goTo("/modificar_template_publico");	
	}
	
	/**************************************************************/
};