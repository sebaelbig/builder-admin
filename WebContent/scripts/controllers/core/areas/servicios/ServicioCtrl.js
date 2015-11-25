'use strict';
/**
 * Servicio Controller
 */
var ServicioCtrl = function($scope, $rootScope, $routeParams, $filter, ServicioService, AreaService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	$scope.editar = function (e) {
		$('html, body').animate({scrollTop : 0},800);
		$scope.hayMensajes = false;
		$scope.modificando = true;
		
		$scope.elemento = e;
		$scope.seleccionoServicioHE({'nombre': $scope.elemento.nombre});
		
		var ar = $scope.areas[$scope.elemento.area.nombre.toLowerCase()];
		
		//Selecciono el tipo por default y lo seteo en la vista si tiene alguno establecido x default
		$scope.seleccionoArea(ar);
	};
	
	$scope.cancelar = function(){
		$scope.resetElemento();
		$scope.list();
	};
	
	$scope.guardar = function () {
		
		if($scope.elemento.codigo && $scope.elemento.nombre && $scope.elemento.area.codigo){
			
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
		
		ServicioService.crear(
				$scope.elemento, 
				function(resp){$rootScope.manageSaveCallback($scope, resp);},
				$rootScope.manageError);
	};

	$scope.modificar = function () {

		$scope.currentFunction = $scope.actualizar;
		ServicioService.modificar(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};

	$scope.list = function () {
		
		$scope.currentFunction = $scope.list;
		ServicioService.listar(
			function(resp){$rootScope.manageListCallback($scope, resp);},
			$rootScope.manageError);
	};
	
	$scope.toggleMultiplicidad = function() {
//		var ixMulti = $scope.multiplicidades.indexOf($scope.elemento.estado);
//		$scope.elemento.multiplicidad = $scope.multiplicidades[ (ixMulti+1)%2 ];
		$scope.elemento.unEstudioPorPedido = !$scope.elemento.unEstudioPorPedido;
	};
	
	/************************************************************/
	/*						Eliminar							*/
	/************************************************************/
	// 1 Pide confirmacion
	$scope.confirmarEliminar = function(e){
		$scope.borrando = e;
		$scope.borrando._cartel = " el servicio "+e.nombre;
		
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
		ServicioService.eliminar(
				$scope.borrando, 
				function(resp){
					$rootScope.manageDeleteCallback($scope, resp);
					$('#modalEliminar').dimmer('hide');
				},
				$rootScope.manageError);
	};
	/************************************************************/
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, area 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['codigo'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombre'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['area.nombre'] = $scope._ORDEN_REVERSO;

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
	
	/***********************************************************************/
	/*							Areas									   */
	/***********************************************************************/
	/**
	 * Presiona sobre un rol disponible
	 */
	$scope.seleccionoArea = function(area){
		
		$scope.elemento.area = area;
		
		$("#listaArea").dropdown("set text", area.nombre);
		$("#listaArea").dropdown("hide");
		
	};
	
	//Obtengo las areas 
	$scope.loadingAreas= true;
	AreaService.listar(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.areas = response.paginador.elementos;
					
					$.each($scope.areas, function(ix, area){
						$scope.areas[area.nombre.toLowerCase()] = area;
						area.checked = false;
					});
					
					$("#listaArea").dropdown();
					
					$scope.loadingAreas= false;
				}
			},
			$rootScope.manageError
	);
	
	/**************************************************************/
	/***********************************************************************/
	/*							Servicios del HE						   */
	/***********************************************************************/
	$scope.seleccionoServicioHE = function(srv){

		$scope.elemento.nombre = srv.nombre;
		
		$("#listaServiciosHE").dropdown("set text", srv.nombre);
		$("#listaServiciosHE").dropdown("hide");
		
	};
	
	//Obtengo los servicios HE 
	$scope.loadingServicios = true;
	ServicioService.listarServiciosHE(
			function(response) {
				if (response.ok) {
					//Tomo los datos del paginador
					$scope.servicios = response.paginador.elementos;
					
					$("#listaServiciosHE").dropdown();
					
					$scope.loadingServicios = false;
				}
			},
			$rootScope.manageError
	);
	
	
	/**************************************************************/
	$scope.elementos = [];
	$scope.multiplicidades = ["No", "Sí"];
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, area:{codigo:null}, unEstudioPorPedido: false, multiplicidad: $scope.multiplicidades[0]};
		$scope.haciendo = false;
		$scope.modificando = false;
		$("#listaArea").dropdown("set text", "Elija una área");
	};
	
	$scope.resetElemento();
	if (!$routeParams.idServicio){
		
		$scope.list();
		
	}else{
		ServicioService.findById(
			$routeParams.idServicio, 
			function(response) {
				if (response.ok) {

					$scope.elemento = response.data;
					$scope.seleccionoServicioHE({'nombre': $scope.elemento.nombre});
				}
			},
			$rootScope.manageError
		);
	}
	
	/**************************************************************/
};