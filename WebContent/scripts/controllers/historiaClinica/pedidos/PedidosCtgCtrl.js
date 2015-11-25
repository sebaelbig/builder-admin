/*******************************************************************************
 * Pasar Pedidos que quedaron en contingencia en idear /
 ******************************************************************************/

var PedidosCtgCtrl = function($scope, $rootScope, $routeParams, $filter,
		PedidoService, ServicioService, $window) {

	$scope.haciendo = false;

	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, sucursal 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['id'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['paciente'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['solicitante'] = $scope._ORDEN_REVERSO;
	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'id';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 8;
	
	/************************************************************/
	
	
	$scope.buscarPedidosEnCtg = function() {
		PedidoService.listarPedidosEnCtg('01/10/2015', function(response) {

			$rootScope.manageListCallback($scope, response);
		}, $rootScope.manageError);
	};

	$scope.registrarPedido = function(e) {
		$scope.haciendo = true;
		PedidoService.registrarNuevoPedido(e.id, function(response) {
			$scope.haciendo = false;
			$scope.hayMensajes = true;
			if (response == 'Pedido recibido correctamente.') {
				$scope.mensajes = {
					mensaje : response,
					error : false
				};
				PedidoService.setEstadoPedidoEna(e.id, function(response) {
					if (!response.ok) {
						$scope.mensajes = {
							mensaje : response.mensaje,
							error : !response.ok
						};
					}
				}, $rootScope.manageError);
			} else {
				$scope.mensajes = {
					mensaje : response,
					error : true
				};
			}
			$scope.buscarPedidosEnCtg();
		}, $rootScope.manageError);

	};

	$scope.buscarPedidosEnCtg();

};