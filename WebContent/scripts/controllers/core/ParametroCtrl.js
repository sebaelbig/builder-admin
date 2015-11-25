'use strict';
/**
 * Parametro Controller
 */
var ParametroCtrl = function($scope, $rootScope, $routeParams, $filter, ParametroService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		
		$('html, body').animate({scrollTop : 0},800);
		
		$scope.setElemento(e);
		$scope.hayMensajes = false;
		$scope.modificando = true;
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
	};
	
	$scope.guardar = function () {
		
		if ($scope.elemento.nombre && $scope.elemento.grupo && $scope.elemento.valor){
			
			if (!$scope.elemento.type)
				$scope.elemento.type = $("#listaTipos").dropdown("get text");
			
			$scope.hayMensajes = false;
			$scope.haciendo = true;
			
			if (!$scope.modificando){
				$scope.crear();
			}else{
				$scope.modificar();
			}
		}
		
//		$scope.modificando = false;
	};
	
	$scope.crear = function () {
		
		ParametroService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError);
	};

	$scope.modificar = function () {

		ParametroService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		ParametroService.listar(
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
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['valor'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['type'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['grupo'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'grupo';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusqueda', function() {
		if ($scope.nombreBusqueda){
			$scope.paginador.filtrarPor({'grupo': $scope.nombreBusqueda});
		}
	});
	/************************************************************/
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " la propiedad "+e.nombre;
		
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
		ParametroService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
				},
				$rootScope.manageError);
	};
	
	/***********************************************************************/
	//Tipoes
	/***********************************************************************/
	$scope.tipoSeleccionado = {nombre:'STRING'};
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoTipo = function(tipo){

		$scope.elemento.type = tipo.nombre;
		$scope.tipoSeleccionado = tipo;
		
		$("#listaTipos").dropdown("set text", tipo.nombre);
		$("#listaTipos").dropdown("hide");
		
	};
	
	//Obtengo las tipos 
	$scope.loadingTipos = true;
	ParametroService.listarTipos(
			function(tipos) {
				$scope.tipos = tipos;
				
				$("#listaTipos").dropdown();
				if ($scope.elemento.type)
					$("#listaTipos").dropdown("set text", $scope.elemento.type);
				else
					$("#listaTipos").dropdown("set text", $scope.tipos[0].nombre);
				
				$scope.loadingTipos = false;
			},
			$rootScope.manageError
	);
	
	/************************************************************/
	
	$scope.elementos = [];
	
	$scope.setElemento = function(elemento){
		
		$scope.tipoSeleccionado = {nombre:elemento.type};
		
		$scope.elemento = elemento;
		
		$("#listaTipos").dropdown("set text", elemento.type);
		
		$scope.haciendo = false;
	};
	
	$scope.resetElemento = function(){
		$scope.elemento = {type:''};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.resetElemento();
	if (!$routeParams.idParametro){
		
		$scope.list();
		
	}else{
		ParametroService.findById(
			$routeParams.idParametro, 
			function(response) {
				if (response.ok) {
					$scope.setElemento(response.data);
					$scope.modificando = true;
				}
			},
			$rootScope.manageError
		);
	}
	
	/**************************************************************/
};