'use strict';
/**
 * Pedidos Angra Controller
 */
var EstudioDePedidoAngraCtrl = function($scope, $rootScope, $routeParams, $filter, EstudioDePedidoAngraService, ServicioService, $window, WSService) {

	$scope.servicioActual = $rootScope.servicioActual;
	
	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.usarioLogueado = $rootScope.loggedUser.usuario;
	/**************************************************************/

	$scope.desconectarWSs = function(){
		try{
			wsDesbloquear.close();
			wsBloquear.close();
		}catch(e){}
	};
	
	$scope.ver = function(e){
		
		//EstudioDePedidoAngraService.id = e.id;
		$rootScope.parametros.accesionNumber= e.accesionNumber;
		
		$scope.desconectarWSs();
		$rootScope.parametros.urlBack="/listar_pedidos_angra";
		$scope.actualizarFiltro();
		$rootScope.goTo("/ver_pedidos_angra");
		
		
	};
	
	
	$scope.listar = function(e){
		
		$rootScope.parametros.accesionNumber= null;
		$rootScope.goTo("/listar_pedidos_angra");
		
	};
	
	$scope.list = function () {
		$scope.buscarPorFiltros();
		$scope.paginador.filtrarPor({'accesionNumber':''});
	};

	/************************************************************
	                        Listar por fecha
    /************************************************************/

    $scope.obtenerPedidosPorFecha = function(fechaSeleccionada){
    	//$scope.paginador.filtrarPor({'str_fecha':fechaSeleccionada});
    };
	  
	/************************************************************/
	/*						Servicios							*/
	/************************************************************/
	$scope.servicios=[];
	$scope.servicioseleccionado='Todos';
	$scope.loadingServicios = true;
	
	$scope.listarServicios=function(){
		ServicioService.listar(
				function(resp){
					if (resp.ok){

						$scope.servicios = resp.paginador.elementos;
						
						$scope.loadingServicios = false;
						
						$scope.actualizarLista();
						$scope.haciendo = false;
					}
				},
				function(err){console.error("Error al listar los servicios");}
			);
	};
	
	$scope.seleccionoServicio = function(srv){
		
		$scope.haciendo = true;
    	$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		$scope.servicioseleccionado = srv.nombre;
		
		//Importante dejar este orden
		$scope.haciendo = false;
		
	};
	
	/************************************************************/
	/*						Paginador							*/
	/************************************************************/
	$scope.paginador={};
	
	/////////////////////// ORDENO
	$scope._ORDEN_REVERSO = false;
	//codigo, nombre, sucursal 
	$scope._ordenesOrdenacion = [];
	$scope._ordenesOrdenacion['numeroPedido'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['accesionNumber'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['str_fecha'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['str_fechaRespuesta'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['status'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['correcto'] = $scope._ORDEN_REVERSO;
	$scope._ordenesOrdenacion['detalle'] = $scope._ORDEN_REVERSO;

	//Ordeno con el primero por default
	$scope._criterioDeOrdenActual = 'accesionNumber';
	
	$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
	$scope.paginador.cantPorPagina = 10;
	
//	FILTRO
	$scope.filtrar=function(elementScope){
		if (elementScope.nombreBusqueda){
			$scope.nombreBusqueda = elementScope.nombreBusqueda;
			$scope.paginador.setActuales( $filter('filter')($scope.paginador.getTodos(), elementScope.nombreBusqueda) );
			//$scope.paginador.paginaActual=1;
			$scope.paginador.actualizarLista();
		}
	};
	
	
	/************************************************************/
	/*          Cargar filtros                                  */
	/************************************************************/
	/**
	 * Actualizo el filtro de la sesion ante cada modificacion (cambio de página, nombre busqueda)
	 */
	$scope.actualizarFiltro = function(){
		
		$scope.filtros = JSON.parse( $window.sessionStorage.getItem("filtros") );
		
		$scope.filtros.pagina = $scope.paginador.getPaginaActual();
		$scope.filtros.nombreBusqueda = $scope.nombreBusqueda; 
			
		$window.sessionStorage.setItem("filtros",  JSON.stringify( $scope.filtros ));
	};
	
	/**
	 * Armo el filtro con los datos ingresados de la vista
	 */
	$scope.getFiltrosDeVista = function () {
		
        // Servicio (se necesita el id)
		var idSrv;
		if ($scope.servicioseleccionado == 'Todos' ) {
			idSrv=null;						
		}else {
			// obtengo el id del servicio
			for ( var ix = 0; ix < $scope.servicios.length; ix++) {
				if ($scope.servicios[ix].nombre == $scope.servicioseleccionado){
					idSrv=$scope.servicios[ix].codigo;
					break;
				}
			}		
		}
		
		//Estado
		var accesionNumber = ($scope.nroPedido != '')?$scope.nroPedido:null;
		
		//Fechas
		if ($("#fechaDesde").val()){
			$scope.fechaDesde = $("#fechaDesde").val();
		}else{
			$scope.fechaDesde = $rootScope.dateToString(new Date());;
		}
		
		if ($("#fechaHasta").val()){
			$scope.fechaHasta = $("#fechaHasta").val();
		}else{
			$scope.fechaHasta = $rootScope.dateToString(new Date());;
		}
		

		//Si se busca desde el boton, se limpian estas configuraciones
		//Reseteo el paginador
		$scope.paginador.setPaginaActual(1);
		//filtro de la busqueda
		$scope.nombreBusqueda = '';
			
		//Armo el filtro segun lo guardado en el storage
		return {
			'pagina': 1,
			'nombreBusqueda': $scope.nombreBusqueda,
			'servicio':idSrv,
			'nombreServicio':$scope.servicioseleccionado,
			'accesionNumber': accesionNumber,
			'fechaDesde':$scope.fechaDesde,
			'fechaHasta':$scope.fechaHasta
		};
		
	};
	
	/**
	 * Cargo el modelo con los datos guardados en el storage
	 */
	$scope.cargarFiltros = function () {
		
		//Parse lo guardado en el sessionStorage
//		var obj = JSON.parse( $scope.filtros);
		
		//Actualizo el servicio
		var idSrv;
		if ($scope.filtros.servicio != null) {
			idSrv=$scope.filtros.servicio;
			$scope.seleccionoServicio({'nombre':$scope.filtros.nombreServicio});
		} else{
			idSrv = null;
			$scope.seleccionoServicio({'nombre':'Todos'});
		} 
		//$("#listaServicios").dropdown();
		
		//Actualizo el accesionNumber
		$scope.accesionNumber = $scope.filtros.accesionNumber; 
		$scope.nroPedido = $scope.filtros.accesionNumber; 

		//Fechas
		if ( $scope.filtros.fechaDesde && $scope.filtros.fechaHasta){
			
			$scope.fechaDesde = $scope.filtros.fechaDesde;
			$scope.fechaHasta = $scope.filtros.fechaHasta;
			
			$("#fechaDesde").val($scope.fechaDesde);
			$("#fechaHasta").val($scope.fechaHasta);
			
		}
		
		//Pagina del paginador
		var pagina = $scope.paginador.getPaginaActual();
		
		//filtro de la busqueda
		$scope.nombreBusqueda = $scope.filtros.nombreBusqueda; 
			
		//Armo el filtro segun lo guardado en el storage
		return {
			'pagina': pagina,
			'nombreBusqueda': $scope.nombreBusqueda,
			'servicio':idSrv,
			'nombreServicio':$scope.servicioseleccionado,
			'accesionNumber': $scope.accesionNumber,
			'fechaDesde':$scope.fechaDesde,
			'fechaHasta':$scope.fechaHasta
		};
		
	};
	
	
	/********************************************************************/
	/* Busqueda por filtros (servicio, estado, fechaDesde,fechaHasta)  	*/
	/********************************************************************/
	
	/**
	 * Busca utilizando como filtro los parametros establecidos en la vista
	 */
	$scope.buscarPorFiltrosDeVista = function () {
		$scope.filtros = $scope.getFiltrosDeVista();
		$scope.buscarPorFiltros(  );
	};
	
	/**
	 * Busca utilizando como filtro los parametros guardados en el session storage
	 */
	$scope.buscarPorFiltros = function () {
		
		//Me guardo en el storage los parametros de busqueda
		$window.sessionStorage.setItem("filtros",  JSON.stringify( $scope.filtros));

		$scope.haciendo=true;
		EstudioDePedidoAngraService.listarPedidosPorFiltro(
				$scope.filtros,
				function(response){
					
					//Vuelve de la busqueda, cargo la lista segun el resultado
					$rootScope.manageListCallback($scope, response);
					
					//Recupero los parametros de busqueda
//					var filtros = JSON.parse( $window.sessionStorage.getItem("filtros") );  

					//Si ingresaron algo en el nombre de busqueda, se filtra el resultado
					if ($scope.filtros.nombreBusqueda && $scope.filtros.nombreBusqueda.length>0 ){
						
						//Filtro el resultado segun los parametros de busqueda, posiciona en la página 
						$scope.paginador.filtrarPor({'accesionNumber':$scope.filtros.nombreBusqueda});
						
					}
							
					//Se posiciona en la pagina que estaba
					$scope.paginador.setPaginaActual($scope.filtros.pagina);
					$scope.paginador.actualizarLista();
					
					//Refresco la vista con los datos del filtro
					$scope.cargarFiltros();
					
					$scope.haciendo=false;
				},
				$rootScope.manageError
		);
			
	};
	
	$scope.actualizarLista = $scope.buscarPorFiltros;

	/**************************************************************/
	$scope.filtros= ($window.sessionStorage.getItem("filtros"))?
					JSON.parse($window.sessionStorage.getItem("filtros")):
					$scope.getFiltrosDeVista();
					
	$scope.elementos = [];
	$scope.elemento = {};
	$scope.fechaDesde = $rootScope.dateToString(new Date());
	$scope.fechaHasta = $scope.fechaDesde;
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	$scope.resetElemento();
	
	if ($rootScope.parametros.accesionNumber != null) {	
		//Viene un id como parametro, cargo el episodio para ver en detalle 
		$scope.haciendo = true;
		
		//Es un estudio por pedido
		EstudioDePedidoAngraService.findByAccessionNumber(
			$rootScope.parametros,
			function(response) {
					
				$scope.elemento = response;
				
				$scope.haciendo = false;
				
			},
			$rootScope.manageError
		);
		
	}else{
		//Listo los servicios, luego los estados y por ultimo busco por filtro
		$scope.haciendo = true;
		
		$scope.listarServicios(); 
	}
	
	/**************************************************************/
	/***   Web Socket - Bloquear pedidos ***/
	/**************************************************************/
//	var _CANAL_PEDIDOS = "pedidos/bloquear";
	
//	$scope.ws_cambioEstado = function(message) {
//    	
//		console.log("Se bloqueó/desbloqueó un pedido concurrentemente.");
//    	try{
//    		
//    		var respuesta = JSON.parse(message.data);
//    		
//    		//Obtengo el elemento de la vista y lo marco como bloqueado
////    		var pedidoBloqueado = _.filter( $scope.elementos, { 'id': respuesta.pedido.id })[0];
//    		var ixPedido = _.findIndex( $scope.elementos, { 'id': respuesta.pedido.id });
//    		if (ixPedido>-1){
//    			//Esta en mis elementos
//    			$scope.elementos[ixPedido] = respuesta.pedido;
//    			
//    			$scope.$apply();
//    			$('#'+respuesta.pedido.id)
//    				.transition({animation:'flash', duration:"500ms", allowRepeat: true})
//    				.transition('flash').transition('flash');
//    		}
//    		
//    	}catch(e){
//    		
//    		if (message.data == ""){
//    			//Si el mensaje me vino vacio (BUG) refresco el listado
////    			$scope.buscarPorFiltros();
//    			$scope.actualizarLista();
//    		}
//    	}
//        
//    };
//    
//    try{
//    	$scope.wsBloquear = WSService.connectOnlyMessage("pedidos/bloquear", $scope, $scope.ws_cambioEstado);
//    	$scope.wsDesbloquear = WSService.connectOnlyMessage("pedidos/desbloquear", $scope, $scope.ws_cambioEstado);
//    }catch(e){
//    	console.log("Error al querer conectarse con websockets");
//    }
	/**************************************************************/
};