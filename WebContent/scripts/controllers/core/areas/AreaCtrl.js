'use strict';
/**
 * Area Controller
 */
var AreaCtrl = function($scope, $rootScope, $routeParams, $filter, AreaService, SucursalService) {

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
		
		var sucu = $scope.sucursales[$scope.elemento.sucursal.nombre.toLowerCase()];
		
		//Selecciono el tipo por default y lo seteo en la vista si tiene alguno establecido x default
		$scope.seleccionoSucursal(sucu);
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
	};
	
	$scope.guardar = function () {
		
		if($scope.elemento.codigo && $scope.elemento.nombre && $scope.elemento.sucursal.codigo){
			
			$scope.hayMensajes = false;
			$scope.haciendo = true;
			
			if (!$scope.modificando){
				$scope.crear();
			}else{
				$scope.modificar();
			}
			
		}
	};
	
	$scope.crear = function () {
		
		AreaService.crear(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError);
	};

	$scope.modificar = function () {

		$scope.currentFunction = $scope.actualizar;
		AreaService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		AreaService.listar(
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
	$scope._ordenesOrdenacion['sucursal.nombre'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'codigo';
	
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
		$scope.borrando._cartel = " el área "+e.nombre;
		
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
		AreaService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
				},
				$rootScope.manageError);
	};
	/************************************************************/
	
	/***********************************************************************/
	//Sucursales
	/***********************************************************************/
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoSucursal = function(sucursal){

		$scope.elemento.sucursal = sucursal;
		
		$("#listaSucursal").dropdown("set text", sucursal.nombre);
		$("#listaSucursal").dropdown("hide");
		
	};
	
	//Obtengo las sucursales 
	$scope.loadingSucursales = true;
	SucursalService.listar(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.sucursales = response.paginador.elementos;
					
					$.each($scope.sucursales, function(ix, sucursal){
						$scope.sucursales[sucursal.nombre.toLowerCase()] = sucursal;
						sucursal.checked = false;
					});
					
					$("#listaSucursal").dropdown();
					
					$scope.loadingSucursales = false;
				}
			},
			$rootScope.manageError
	);
	
	/**************************************************************/
	$scope.elementos = [];
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, sucursal:{codigo:null}};
		$scope.haciendo = false;
		$scope.modificando = false;
		$("#listaSucursal").dropdown("set text", "Elija una sucursal");
	};
	
	$scope.resetElemento();
	if (!$routeParams.idArea){
		
		$scope.list();
		
	}else{
		AreaService.findById(
			$routeParams.idArea, 
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