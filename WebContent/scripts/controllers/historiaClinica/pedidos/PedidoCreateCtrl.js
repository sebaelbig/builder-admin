'use strict';
/**
 * PedidoCreate Controller
 */
var PedidoCreateCtrl = function($scope, $rootScope, $routeParams, $filter,$timeout, PedidoService, ServicioService, TemplatePublicoService,TemplatePrivadoService) {

	$scope.servicioActual = $rootScope.servicioActual;
	
	//insertar(p)
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/************************************************************/
	/*						Volver atrás(Modal)					*/
	/************************************************************/
	$scope.cancelarConfirmado = function(){
		$scope.resetElemento();
		
		$rootScope.parametros.idPedido=null;
		
		$scope.haciendo = true;
		PedidoService.desbloquear($scope.elemento, 
				function(e){
					$rootScope.goTo("/anular_informe");
					$scope.haciendo = true;
				},
				function(e){console.error("Pedido no se pudo desbloquear");});
	};
	
	$scope.cancelar = function(){
		if($scope.textoElementoViejo != $scope.elemento.texto && !$scope.gu){
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
	
	/**************************************************************/
	$scope.fxAccion = PedidoService.confirmar;
	$scope.modalAccion = "#modalConfirmarAccion";
	$scope.confirmarAccion;
	
	$scope.confirmar = function () {
		
		$scope.fxAccion = PedidoService.confirmar;
		$scope.modalAccion = '#modalConfirmarAccion';
		
		$scope.confirmarAccion = $scope.elemento;
		$scope.confirmarAccion._cartel = " confirmar el pedido número: "+$scope.elemento.numero;
		$scope.confirmarAccion._preCartel="";
		$scope.confirmarAccion._postCartel="";
		$scope.confirmarAccion.btnLoading = false;
		
		$($scope.modalAccion).dimmer({closable:false}).dimmer('show');
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
										$scope.setElemento(response.paginador.elementos[ix]);
										break;
									}
								}
								
								$scope.mensajes = {mensaje:response.mensaje, error:false} ;
								$($scope.modalAccion).dimmer().dimmer('hide');
								$scope.haciendo = false;
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
	/************************************************************/
	
	$scope.imprimir = function () {
		
		//Obtengo la data del Editor
		$scope.elemento.texto = $scope.editorHTML.getData();
		
		$rootScope.parametros.idPedido= $scope.elemento.id;
		
		if ($scope.elemento.unEstudioPorPedido){
			//Si es un estudio por pedido, seteo el id del estudio a ser modificado
			$rootScope.parametros.idEstudio = $scope.elemento.estudiosPaciente[0].id;
		}
		$rootScope.parametros.urlBack="/escribir_informe";
		$rootScope.goTo("/imprimir_informe");
		
	};
	/************************************************************/
	$scope.informar = function () {

		$scope.haciendo = true;
		$rootScope.parametros.idePedido= $scope.elemento.id;
		
		//Obtengo la data del Editor
		$scope.elemento.texto =$scope.editorHTML.getData();
		
		//PedidoService.id = $scope.elemento.id;
		PedidoService.informar(
				$scope.elemento, 
				function(response){
					$scope.haciendo = false;
					$scope.hayMensajes = true;
					
					if (response.ok) {
						
						//Hubo datos de vuelta
						if (response.paginador.elementos &&
								response.paginador.elementos.length >= 0){
							
							//Me guardo el elemento
							for (var ix=0; ix<response.paginador.elementos.length; ix++){
								if ($scope.elemento.numero == response.paginador.elementos[ix].numero){
									$scope.setElemento(response.paginador.elementos[ix]);
									break;
								}
							}
							
							$scope.mensajes = {mensaje:response.mensaje, error:false} ;
							$($scope.modalAccion).dimmer().dimmer('hide');
							$scope.haciendo = false;
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
	};

	//Esta funcion solo se utiliza en los Controllers que tembien listan
	$scope.list = function () {};
	/************************************************************/
	/*						Plantillas							*/
	/************************************************************/
	$scope._plantillas = [];
	$scope.plantillas = [];
	$scope.agregandoPlantilla = false;
	$scope.pedidoPrevio=null;
	$scope.mismosEstudiosPedidoPrevio=true;
	
	$scope.insertar = function(planti){
		if (!$scope.elemento.texto)
			$scope.elemento.texto = "";
		
		//Obtengo la data del Editor le concateno la plantilla
		var html = CKEDITOR.instances.editor1.getData() + planti.texto;
		
		$scope.elemento.texto = html;

		//Refresco el editor
		$scope.refreshTextoCKEditor();
		
		$scope.nombreBusquedaPlantilla = "";	
		$("#listaPLantillas").dropdown("set text", "Agregar plantilla");
	};
	
/////////////////////// FILTRO
	$scope.$watch('nombreBusquedaPlantilla', function() {
		if (!$scope.nombreBusquedaPlantilla)
			$scope.nombreBusquedaPlantilla = "";
		
		$scope.plantillas = $filter('filter')($scope._plantillas, {'titulo':$scope.nombreBusquedaPlantilla} );
	});
	
	
	$scope.buscarUltimoInforme = function(){
		$scope.idEstudios = [];
		$scope.elemento.estudiosPaciente.forEach(function(element){
			$scope.idEstudios.push(element.idEstudio);
		});
		PedidoService.encontrarUltimoEstudio(
			{"idEstudio":$scope.idEstudios,
			"numeroDniPaciente":$scope.elemento.nroDniPaciente,
			"tipoDniPaciente":$scope.elemento.tipoDniPaciente,
			"numeroPedido":$scope.elemento.numero
			},function(response){
				if(response && response.id){
					$scope.pedidoPrevio=response;
				}
			},function(err){console.error("Error al buscar el último informe de este estudio.");});
	};
	
	$scope.reemplazarTextoPorInformePrevio=function(){
		$scope.mismosEstudiosPedidoPrevio = true;
		if($scope.pedidoPrevio.estudiosPaciente.length != $scope.idEstudios.length ){
			$scope.mismosEstudiosPedidoPrevio=false;
		}
		var i = 0;
		while($scope.mismosEstudiosPedidoPrevio && i<$scope.pedidoPrevio.estudiosPaciente.length && i<$scope.idEstudios.length){
			if($.inArray($scope.pedidoPrevio.estudiosPaciente[i].idEstudio, $scope.idEstudios)== -1){
				$scope.mismosEstudiosPedidoPrevio=false;
			}
			i++;
		};
		if($scope.mismosEstudiosPedidoPrevio){
			$scope.confirmarReemplazarTextoPorInformePrevio();
		}else{
			$scope.fxAccion = $scope.confirmarReemplazarTextoPorInformePrevio;
			$scope.modalAccion = "#modalConfirmarAccion";
			
			$scope.confirmarAccion=$scope.elemento;
			$scope.confirmarAccion._preCartel = "Los estudios del pedido actual no coinciden exactamente con los estudios del último pedido. ";
			$scope.confirmarAccion._cartel = " agregar el último informe al informe actual";
			$scope.confirmarAccion._postCartel="";
			$scope.confirmarAccion.btnLoading = false;
			
			$($scope.modalAccion).dimmer({closable:false}).dimmer('show');
		}
	};
	
	$scope.confirmarReemplazarTextoPorInformePrevio=function(){
		$scope.elemento.texto = $scope.editorHTML.getData()+$scope.pedidoPrevio.texto; 
		
		if($scope.confirmarAccion){
			$scope.haciendo = false;
			$scope.confirmarAccion.btnLoading = false;
			$($scope.modalAccion).dimmer().dimmer('hide');
		};
		$scope.refreshTextoCKEditor();
	};
	
	/************************************************************/
	/*						INICIO	    						*/
	/************************************************************/
	$scope.ESTADO_NUEVO = "Nuevo";
	$scope.ESTADO_ABIERTO = "Abierto";
	$scope.ESTADO_CERRADO = "Cerrado";
	
	$scope.elemento={'texto':''};
	
	$scope.resetElemento = function(){
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.buscarPlantillas = function(elem){
		
		$scope.haciendo = true;
		
		$scope._plantillas = [];
		$scope.loadingPlantillas = true;
		
		TemplatePublicoService.buscar(
				elem,
				function(resp){
					if (resp.ok){
						
						//$scope._plantillas para el filtro de busqueda
						for (var ix=0; ix < resp.paginador.elementos.length; ix++ ){
							$scope._plantillas.push(resp.paginador.elementos[ix]);
						}
						
						$scope.haciendo = false;
						$scope.loadingPlantillas = false;
						$scope.plantillas = $scope._plantillas;
						
						$("#listaPLantillas").dropdown({action: 'hide'});
						$("#listaPLantillas").dropdown("set text", "Agregar plantilla");
						
					}
				},
				function(err){console.error("Error al listar las plantillas.");}
		);
		
		TemplatePrivadoService.buscarPorMatricula(
				elem.matriculaProfesionalActuante,
				function(resp){
					if (resp.ok){
						
						for (var ix=0; ix < resp.paginador.elementos.length; ix++ ){
							$scope._plantillas.push(resp.paginador.elementos[ix]);
						}
						
						$scope.haciendo = false;
						$scope.loadingPlantillas = false;
						$scope.plantillas = $scope._plantillas;
						
					}
				},
				function(err){console.error("Error al listar las plantillas.");}
		);
	};
	
	/**
	 * Funcion llamada por:
	 * La directiva cuando se termina de crear el editor
	 * o
	 * Cuando se recupero el pedido
	 */
	$scope.refreshTextoCKEditor = function(){
		if ($scope.editorHTML && $scope.elemento && $scope.elemento.id )
			$scope.editorHTML.setData($scope.elemento.texto);
	};
	
	$scope.setElemento = function(pedido){
		
		if (!pedido.unEstudioPorPedido 
				&& pedido.bloqueado 
				&& pedido.usuarioAccion == $rootScope.loggedUser.usuario){
			//El pedido NO es un estudio por pedido y esta bloqueado por el usuario actual
			
			$scope.elemento = pedido;
			
			if($scope.elemento.texto==null || $scope.elemento.texto==undefined){
				$scope.elemento.texto='';
			} 
			
			$scope.textoElementoViejo = $scope.elemento.texto;
			
			$scope.refreshTextoCKEditor();
			
		}else{
			
			var estudio = pedido.estudiosPaciente[0];
			
			if (pedido.unEstudioPorPedido 
					&& estudio.bloqueado 
					&& estudio.usuarioAccion == $rootScope.loggedUser.usuario){
				//El pedido es un estudio por pedido, me fijo si el estudio esta bloqueado por el usuario actual
				$scope.elemento = pedido;
				
				if(estudio.texto==null || estudio.texto==undefined){
					estudio.texto='';
					$scope.elemento.texto = '';
				} else{
					$scope.elemento.texto = estudio.texto;
				}
				
				$scope.textoElementoViejo = $scope.elemento.texto;
				
				$scope.refreshTextoCKEditor();
				
			}else{
				//Esta entrando otro que no es el que lo bloqueó
				
				$scope.fxAccion = $scope.cancelarConfirmado;
				$scope.modalAccion = '#modalConfirmarAccion';
				
				$scope.confirmarAccion = elem;
				$scope.confirmarAccion._preCartel="";
				$scope.confirmarAccion._cartel = "El pedido número: "+elem.numero+ " NO está disponible para su edición, está siendo editado por "+elem.usuarioAccion;
				$scope.confirmarAccion._postCartel="";
				$scope.confirmarAccion.soloConfirmar = true;
				$scope.confirmarAccion.btnLoading = false;
				
				$($scope.modalAccion).dimmer({closable:false}).dimmer('show');
				
			}
		}
		
	};
	
	$scope.procesarRespuesta = function(response) {
		$timeout(function(){
			
			if (response["id"]!=undefined){
				
				$scope.setElemento(response);
				
				//Llenos los combos
				$scope.buscarPlantillas($scope.elemento);
				
				$scope.buscarUltimoInforme();
			}else{
				$("#modalErrorConcurrente").dimmer({closable:false}).dimmer('show');
			}
			
		});
	};
	
	$scope.cancelarModalErrorConcurrente = function(){
		$scope.haciendo = false;
		$rootScope.goTo("/anular_informe");
	};
	
	//
	$scope.manageWebSocketError = function(err){
		//Ocurrio un error al querer bloquear el pedido
		
		$("#modalErrorConcurrente").dimmer({closable:false}).dimmer('show');
	};
	
	//if (!PedidoService.id){
	if (!$rootScope.parametros.idPedido) {
		//No viene id del pedido, algo le erro, volvemos al listar
		$rootScope.goTo("/anular_pedido");
		
	}else{
		
		$scope.modificando = true;
		$scope.haciendo = true;
		
		if ($rootScope.parametros.idPedido  != null && $rootScope.parametros.idEstudio !=null) {
			//if (PedidoService.id != null && PedidoService.idEstudio !=null) {
				//Es un estudio por pedido
				PedidoService.findByIdByEstudioBloqueante(
						$rootScope.parametros,
						$scope.procesarRespuesta,
						$scope.manageWebSocketError
				);
					
		}else{
			if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio ==null) {
				//Se edita el pedido solamente
				
				PedidoService.findByIdBloqueante(
						$rootScope.parametros,
						$scope.procesarRespuesta,
						$scope.manageWebSocketError
				);
			}
		}
	};
	
	
	
	/**************************************************************/
};