'use strict';
/**
 * PedidoMensajesCtrl Controller
 */
var PedidoMensajesCtrl = function($scope, $rootScope, PedidoService) {
	
	$scope.haciendo = true;
	
	/************************************************************/
	/*						Volver atrás(Modal)					*/
	/************************************************************/
	
	$scope.cancelarConfirmado = function(){
		//PedidoService.id = null;
		$rootScope.parametros.idPedido=null;
		PedidoService.cancelando = false;
		
		//$rootScope.goTo("/anular_pedido");
		$rootScope.goTo($rootScope.parametros.urlBack);
	};
	
	$scope.cancelar = function(){
		if($scope.textoElementoViejo != $scope.mensaje.texto){
			$scope.fxAccion = $scope.cancelarConfirmado;
			$scope.modalAccion = "#modalConfirmarAccion";
			
			$scope.confirmarAccion=$scope.elemento;
			$scope.confirmarAccion._cartel = " volver atrás (no se guardarán los cambios)";
			$scope.confirmarAccion._preCartel="";
			$scope.confirmarAccion._postCartel="";
			$scope.confirmarAccion.btnLoading = false;
			
			$($scope.modalAccion).dimmer({closable:false}).dimmer('show');
		}else{
			$scope.cancelarConfirmado();
		}
	};
	
	// 1.1 Cancela
	$scope.cancelarAccion = function(){
		$($scope.modalAccion).dimmer('hide');
		$scope.confirmarAccion = null;
		$scope.haciendo = false;
	};
	
	//3 Ejecuta la accion
	$scope.ejecutarAccion = function () {
		
		$scope.confirmarAccion.btnLoading = true;
		$scope.haciendo = true;

		if($scope.fxAccion.length>0){
			$scope.fxAccion(
					$scope.confirmarAccion, 
					function(response){
						$scope.haciendo = false;
						$scope.hayMensajes = true;
						
						if (response.ok) {
							
							//Hubo datos de vuelta
							if (response.paginador.elementos &&
									response.paginador.elementos.length >= 0){
								
								//Me guardo elemento actualizado
								for (var ix=0; ix<response.paginador.elementos.length; ix++){
									if ($scope.elemento.numero == response.paginador.elementos[ix].numero){
										$scope.elemento = response.paginador.elementos[ix];
										break;
									}
								}
								
								$scope.mensajes = {mensaje:response.mensaje, error:false} ;
								$($scope.modalAccion).dimmer({closable:false}).dimmer('hide');
								//No hubo datos de vuelta -> errores
							}else{
								$scope.mensajes = {mensaje:response.mensaje, error:true} ;
							}
							
						}else{
							$scope.mensajes = {mensaje:response.mensaje, error:true} ;
						}
						$scope.modificando = true;//Si paso algo, ok es falso, asi que seguimos modificando
					}, 
					$rootScope.manageError);
		}else{
			$scope.fxAccion();
		}
		
	};
	/**************************************************************/
	
	//Esta funcion solo se utiliza en los Controllers que tembien listan
	
	$scope.list = function () {};
	
	$scope.guardar = function(){
		
		if ($scope.cancelando){
			$scope.cancelarPedido();
		}else{
			$scope.guardarMensaje();
		}
		$scope.cancelando = false;
	};
	
	/************************************************************/
	/*							Cancelar						*/
	/************************************************************/
	
	$scope.cancelarPedido = function(){
		
		$scope.haciendo = true;
		
		//Saco el motivo de cancelacion del texto del mensaje
		$scope.elemento.motivo = $scope.mensaje.texto;
		
		PedidoService.cancelar(
				$scope.elemento, 
				function(response){
					
					$scope.cargarMensajes();
						
					$scope.mensaje = {usuario: $rootScope.loggedUser.usuario};
					
					$scope.cancelando = false;
					PedidoService.cancelando = false;
				}, 
				$rootScope.manageError);
		
	};
	
	/************************************************************/
	/*							Mensajes						*/
	/************************************************************/
	$scope.cargarMensajes = function(){
		
		PedidoService.getMensajes(
			$scope.elemento.numero,
			function(response) {
				
				if (response.ok)
					$scope.mensajes = response.paginador.elementos;
				else
					$scope.mensajes = [];
					
				$scope.haciendo = false;
				
			},
			$rootScope.manageError
		);
		
	};
	
	
	$scope.guardarMensaje = function(){

		$scope.mensaje.nroPedido = $scope.elemento.numero;
		$scope.haciendo = true;
		
		PedidoService.agregarMensaje(
				$scope.mensaje,
				function(response) {
					
					if (response.ok){
						$scope.mensajes = response.paginador.elementos;
						$scope.mensaje = {usuario: $rootScope.loggedUser.usuario};						
					}
					
					$scope.cancelando = false;
					PedidoService.cancelando = false;
					$scope.haciendo = false;
				},
				$rootScope.manageError
			);
			
	};
	
	/************************************************************/
	/*						INICIO	    						*/
	/************************************************************/
	$scope.cancelando = PedidoService.cancelando;
	$scope.mensaje = {usuario: $rootScope.loggedUser.usuario};
	$scope.textoElementoViejo = $scope.mensaje.texto;
	
	//if (PedidoService.id ) {
	if ( $rootScope.parametros.idPedido ) {
		//Se edita el pedido solamente
		
		PedidoService.findById(
				$rootScope.parametros,
				function(response) {
					
					$scope.elemento = response;
					
					if (!$scope.elemento.texto){$scope.elemento.texto ="";}
					if (!$scope.elemento.firmaEfector){$scope.elemento.firmaEfector = "--";}
					
					$scope.cargarMensajes();
					
				},
				$rootScope.manageError
			);
		
		
		
	}
	/**************************************************************/
};