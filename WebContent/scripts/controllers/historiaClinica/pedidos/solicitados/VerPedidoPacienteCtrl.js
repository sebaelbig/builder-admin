'use strict';
/**
 * Pedido Controller
 */
var VerPedidoPacienteCtrl = function($scope, $rootScope, $routeParams, $filter, PedidoService, ServicioService, $window) {

	$scope.servicioActual = $rootScope.servicioActual;
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/

	$scope.informar = function (e) {
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			//Si es un estudio por pedido, seteo el id del estudio a ser modificado
			//PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio= e.estudiosPaciente[0].id;
		}
		
		$rootScope.goTo("/escribir_informe");
	};
	
	$scope.imprimir = function (e) {
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			//Si es un estudio por pedido, seteo el id del estudio a ser modificado
			//PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio= e.estudiosPaciente[0].id;
		}
		
		$rootScope.goTo("/imprimir_informe_paciente");
		
	};
	
	$scope.ver = function(e){
		
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			$rootScope.parametros.idEstudio= e.estudiosPaciente[0].id;
			//PedidoService.idEstudio = e.estudiosPaciente[0].id;
		}
		
		$rootScope.goTo("/ver_informe_paciente");
		
		
	};
	
	$scope.verPedidosPaciente = function(e){		
		
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;	
		$rootScope.goTo("/listar_pedidos_paciente");
		
		
	};
	
	$scope.listar = function(){
		//PedidoService.id = e.id;
		//$rootScope.parametros.idPedido= null;
		$rootScope.goTo("/listar_pedidos_paciente");
		
	};
	
    $scope.todosLosPedidos  = function () {
    		$scope.haciendo = true;
    	    
    		PedidoService.listarDePaciente(
    			$rootScope.parametros,
    			function(response){

    				if (response.ok) {
    					
    					//Hubo datos de vuelta
    					if (response.paginador.elementos &&
    							response.paginador.elementos.length >= 0){
    					 
    						if ($rootScope.rolActual.id == "MHE") {     						  								   						  					
    						   $scope.paginador.setTodos(response.paginador.elementos );
    				     	}
    						// agarra todos los elems y los pagina
    						$scope.paginador.actualizarLista();
    						
    						if (!$scope.hayMensajes)
    							$scope.mensajes = {mensaje:response.mensaje, error:false} ;
    						
    					//No hubo datos de vuelta -> errores
    					}else{
    						
    						$scope.mensajes = {mensaje:response.mensaje, error:true} ;
    						
    						//Habilito los mensajes si es que no hay mostrandose otro
    						if (!$scope.hayMensajes)
    							$scope.hayMensajes = true;
    					}
    					
    				}else{
    					$scope.mensajes = {mensaje:response.mensaje, error:true} ;
    					$scope.hayMensajes = true;
    				}
    				
    				$scope.haciendo = false;
    			},
    			$rootScope.manageError
    		);
    		$scope.paginador.filtrarPor({'estudios':''});	
    };


	/************************************************************/
	$scope.fxAccion = PedidoService.confirmar;
	
	
	// 1.1 Cancela
	$scope.cancelarAccion = function(){
		$('#modalConfirmarAccion').dimmer('hide');
		$scope.confirmarAccion = null;
	};
	
	//3 Ejecuta la accion
	$scope.ejecutarAccion = function () {
		
		$scope.confirmarAccion.btnLoading = true;
		$scope.haciendo = true;
		
		$scope.fxAccion(
				$scope.confirmarAccion, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.cancelarAccion();
				}, 
				$rootScope.manageError);
		
	};

	
	/************************************************************/
	/*						Servicios							*/
	/************************************************************/
	$scope.servicios=[];
	$scope.servicioseleccionado='Todos';
	
	if ($rootScope.loggedUser){
		ServicioService.listar(
				function(resp){
					if (resp.ok){
						$scope.servicios = resp.paginador.elementos;
						
						$("#listaServicios").dropdown();						
						if ($scope.servicios.lenght == 1)
							$scope.seleccionoServicio($scope.servicios[0]);
					}
				},
				function(err){console.error("Error al listar los servicios");}
		);
	}
	
	
	$scope.seleccionoServicioTodos = function(){
		$scope.haciendo = true;
				
					$("#listaServicios").dropdown("set text", "Todos");
					$("#listaServicios").dropdown("hide");
					
					$scope.servicioseleccionado = 'Todos';
					$scope.todosLosPedidos();
					
					$scope.haciendo = false;
		
	};
	
	$scope.seleccionoServicio = function(srv){
		
		$scope.haciendo = true;
    	$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		$scope.servicioseleccionado = srv.nombre;
		if (srv.nombre != 'Todos') {
			$scope.paginador.filtrarPor({'nombreServicio':srv.nombre});
		}	
		else
			$scope.seleccionoServicioTodos();
		$scope.haciendo = false;
		
	};
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['numero'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['paciente'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['solicitante'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['fecha'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['estudios'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['nombreServicio'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['estado'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'paciente';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	
	$scope.filtrarMisPedidos = function () {
		$scope.haciendo = true;
	    
		PedidoService.listarDePaciente(
			$rootScope.parametros,
			function(response){
            // el id del Pedido se setea en PedidoService.id
				if (response.ok) {
					
					//Hubo datos de vuelta
					if (response.paginador.elementos &&
							response.paginador.elementos.length >= 0){
						
						// guardo los filtros
					//	$scope.filtros ={'nropedido':$scope.pedido,'nombreServicio':$scope.servicioseleccionado};						
					//	$window.sessionStorage.setItem("filtros",  JSON.stringify( $scope.filtros));
						
						// obtengo el nombre del paciente
						$scope.paciente = response.paginador.elementos[0].paciente;
						
						var filtrados = [];				  								
						$.each(response.paginador.elementos, function(ix, pedido){
							//matriculaProfesionalSolicitante
							if (pedido.matriculaProfesionalActuante == $rootScope.matricula){
								filtrados.push(pedido);
							}

						  });
						  					
						  $scope.paginador.setTodos(filtrados);
						 
						// agarra todos los elems y los pagina
						$scope.paginador.actualizarLista();
						
						if (!$scope.hayMensajes)
							$scope.mensajes = {mensaje:response.mensaje, error:false} ;
						
					//No hubo datos de vuelta -> errores
					}else{
						
						$scope.mensajes = {mensaje:response.mensaje, error:true} ;
						
						//Habilito los mensajes si es que no hay mostrandose otro
						if (!$scope.hayMensajes)
							$scope.hayMensajes = true;
					}
					
				}else{
					$scope.mensajes = {mensaje:response.mensaje, error:true} ;
					$scope.hayMensajes = true;
				}

					$scope.haciendo = false;

			},
			$rootScope.manageError
		);
	};
	
	/*********** Filtros ***************************/
	
	$scope.cargarFiltros = function () {
		var obj = JSON.parse( $scope.filtros);
		if (obj.servicio != null) {
		  $scope.servicioseleccionado= obj.nombreServicio;
		  $("#listaServicios").dropdown("set text", $scope.servicioseleccionado);
		  $("#listaServicios").dropdown();
		}
		if (obj.nropedido != null) {
			//PedidoService.id=obj.nropedido;
			$rootScope.parametros.idPedido=obj.nropedido;
		}
	};
	
	/*********  Servicios  *************************/
	$scope.seleccionoListado = function(opt){
		
		$scope.haciendo = true;
    	$("#tiposListados").dropdown("set text", opt);
		$("#tiposListados").dropdown("hide");
		$scope.listadoSeleccionado = opt;
		if (opt == "Todos los pedidos"){
			$scope.todosLosPedidos();
		}
		else {
			$scope.filtrarMisPedidos();
		}
	//	$scope.paginador.filtrarPor({'estado':est});
		$scope.haciendo = false;
		
	};
	
	/************************************************************/
	/*						Tipo de listado 					*/
	/************************************************************/
	$scope.tiposListados=['Mis pedidos', 'Todos los pedidos'];
	$scope.listadoSeleccionado='Mis pedidos';
	

	/********************************************************************/
	
	/************************init **************************************/
	$scope.elementos = [];
	$scope.elemento = {};
	$scope.fechaActual = $rootScope.dateToString(new Date());
	$scope.rol=$rootScope.rolActual.id;
		
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false};
		$scope.haciendo = false;
		$scope.modificando = false;
		$("#tiposListados").dropdown();
		$("#tiposListados").dropdown("hide");
	};
	
	$scope.resetElemento();
	
	//if (PedidoService.id != null){
	if ($rootScope.parametros.idPedido != null) {	
		//Viene un id como parametro, cargo el episodio para ver en detalle 
		$scope.haciendo = true;
		if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio !=null) {
		//if (PedidoService.id != null && PedidoService.idEstudio !=null) {
			//Es un estudio por pedido
			PedidoService.findByIdByEstudio(
				$rootScope.parametros,	
				function(response) {
						
					$scope.elemento = response;
					
					if (!$scope.elemento.texto){$scope.elemento.texto ="";}
					
					if (!$scope.elemento.firmaEfector){$scope.elemento.firmaEfector = "--";}
					$scope.haciendo = false;
				},
				$rootScope.manageError
			);
				
		}else{
			if ($rootScope.parametros.idPedido != null && $rootScope.parametros.idEstudio ==null) {
		//	if (PedidoService.id != null && PedidoService.idEstudio ==null) {
				//Se edita el pedido solamente
				
				PedidoService.findById(
					$rootScope.parametros,
					function(response) {
						
						$scope.elemento = response;
						
						if (!$scope.elemento.texto){$scope.elemento.texto ="";}
						
						if (!$scope.elemento.firmaEfector){$scope.elemento.firmaEfector = "--";}
						$scope.haciendo = false;
					},
					$rootScope.manageError
				);
			}
		}
		
	}
	
	
	/**************************************************************/
};