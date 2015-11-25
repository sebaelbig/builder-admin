'use strict';
/**
 * Pedido Controller
 */
var PedidoPacienteCtrl = function($scope, $rootScope, $routeParams, $filter, PedidoService, ServicioService, $window) {

	$scope.servicioActual = $rootScope.servicioActual;
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**************************************************************/
	
	$scope.volver= function(){
		if($rootScope.parametros.urlBack=="/ver_pedido_solicitante"){
			$rootScope.parametros.idPedido=null;
		}
		$rootScope.goTo($rootScope.parametros.urlBack);
	};
	
	$scope.cancelar = function(){
		/*//PedidoService.id = null;
		$rootScope.parametros.idPedido= null;
		//$rootScope.goTo("/anular_pedido");
		$rootScope.cancelar();	*/
		if($rootScope.parametros.urlBack=="/ver_pedido_solicitante"){
			$rootScope.parametros.idPedido=null;
		}
		$rootScope.goTo($rootScope.parametros.urlBack);
	}; 
	
	$scope.informar = function (e) {
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			//PedidoService.idEstudio = e.estudiosPaciente[0].id;
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}
		
		$rootScope.goTo("/escribir_informe");
	};
	
	$scope.imprimir = function (e) {
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			//Si es un estudio por pedido, seteo el id del estudio a ser modificado
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}
		$rootScope.parametros.urlBack="/listar_pedidos_paciente";
		$rootScope.goTo("/imprimir_informe_paciente");
		
	};
	
	$scope.ver = function(e){
		
		//PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;
		if (e.unEstudioPorPedido){
			//Si es un estudio por pedido, seteo el id del estudio a ser modificado
			$rootScope.parametros.idEstudio = e.estudiosPaciente[0].id;
		}
		
		$rootScope.goTo("/ver_informe_paciente");
		
		
	};
	
	$scope.verPedidosPaciente = function(e){		
		
	//	PedidoService.id = e.id;
		$rootScope.parametros.idPedido= e.id;	
		$rootScope.goTo("/listar_pedidos_paciente");
		
		
	};
	
	$scope.listar = function(e){
		$rootScope.parametros.idPedido= null;
		//PedidoService.id = null;
		$rootScope.goTo("/listar_pedidos_paciente");
		
	};
	
   // $scope.list = function () {
    $scope.todosLosPedidos  = function () {
    		$scope.haciendo = true;
    	    
    		PedidoService.listarDePaciente(
    			$rootScope.parametros,	
    			function(response){

    				if (response.ok) {
    					
    					//Hubo datos de vuelta
    					if (response.paginador.elementos &&
    							response.paginador.elementos.length >= 0){
    					 
    					//	if ($rootScope.rolActual.id == "MHE") {   
    						if ($rootScope.loggedUser.roles["MHE"]){
    						   $scope.paginador.setTodos(response.paginador.elementos );
    				     	}
    						
    						//Agrego el nombre del paciente
    						$scope.paciente = response.paginador.elementos[0].paciente;
    						
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
	$scope.paginador.cantPorPagina = 5;
	
	/*No lo uso*/
	$scope.filtrarMisPedidos = function () {
		$scope.haciendo = true;
		$rootScope.parametros.urlBack="/ver_pedido_solicitante";
		PedidoService.listarDePaciente(
			$rootScope.parametros,
			function(response){
            // el id del Pedido se setea en PedidoService.id
				if (response.ok) {
					
					//Hubo datos de vuelta
					if (response.paginador.elementos &&
							response.paginador.elementos.length >= 0){
						
						// guardo los filtros
						// $scope.filtros ={'nropedido':$scope.pedido,'nombreServicio':$scope.servicioseleccionado};						
					    // $window.sessionStorage.setItem("filtros",  JSON.stringify( $scope.filtros));
						
						// obtengo el nombre del paciente
						$scope.paciente = response.paginador.elementos[0].paciente;
						
						var filtrados = [];				  								
						$.each(response.paginador.elementos, function(ix, pedido){
							//matriculaProfesionalSolicitante
							if (pedido.matriculaProfesionalSolicitante == $rootScope.matricula){
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
			$rootScope.parametros.id=nropedido;
			//PedidoService.id=obj.nropedido;
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
//	$scope.filtros= $window.sessionStorage.getItem("filtros");
	$scope.elementos = [];
	$scope.elemento = {};
	$scope.fechaActual = $rootScope.dateToString(new Date());
	$scope.rol=$rootScope.rolActual.id;
	//$scope.pedido=PedidoService.id;
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false};
		$scope.haciendo = false;
		$scope.modificando = false;
		$("#tiposListados").dropdown();
		$("#tiposListados").dropdown("hide");
	};
	
	$scope.resetElemento();
	

//	if ($scope.filtros) 
//			$scope.cargarFiltros();	    
	
	//$scope.filtrarMisPedidos();		
	$scope.todosLosPedidos();
		
	/**************************************************************/
};