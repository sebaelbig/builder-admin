'use strict';
/**
 * TemplatePrivadoListCtrl Controller
 */
var TemplatePrivadoListCtrl = function($scope, $rootScope, $routeParams, $filter, TemplatePrivadoService,ServicioService) {

		$scope.hayMensajes = false;
		$scope.mensajes;
		
		$scope.haciendo = true;
		
		$scope.modificando = false;
		
		/**************************************************************/
		$scope.editar = function (e) {

			TemplatePrivadoService.id = e.id;
			$rootScope.goTo("_modificar_template_privado");

		};
		
		$scope.crear = function () {
			TemplatePrivadoService.id = null;
			$rootScope.goTo("_crear_template_privado");

		};


		$scope.list = function () {
			$scope.haciendo = true;
		    
			TemplatePrivadoService.listarServiciosDeUsuario(
				function(response){

					if (response.ok) {
						
						//Hubo datos de vuelta
						if (response.paginador.elementos &&
								response.paginador.elementos.length >= 0){
							
							//Si esta definido el paginador, es porque lo utiliza, asi que delega la logica al paginador
							 var filtrados = [];
							 if ($rootScope.rolActual.id == "MHE") {
							  								
							  $.each(response.paginador.elementos, function(ix, templatePrivados){
								
								if (templatePrivados.nombreUsuario == $rootScope.loggedUser.usuario){
									filtrados.push(templatePrivados);
								}

							  });
							
							  $scope.paginador.setTodos(filtrados);
	                      	}
							else { //secretaria, los templates ya vienen filtrados considerando sus servicios
								var templateFiltrados = [];	
								var templatesPrivados = response.paginador.elementos;							
								$.each(templatesPrivados, function(t, template){
									templateFiltrados.push(template);
								});		

								//setea la lista en el paginador
								$scope.paginador.setTodos(templateFiltrados);

							}  
							 
							// agarra todos los elems y los pagina
							$scope.paginador.actualizarLista();
							
							//if ($scope.nombreBusqueda)
							//	$scope.nombreBusqueda = "";
								
							
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
					
//					try{
						$scope.haciendo = false;
//					}catch(e){console.info("no hay dimmer");}

				},
				$rootScope.manageError
			);
		};
		
		
		/************************************************************/
		/*						Paginador							*/
		/************************************************************/
		$scope.paginador={};
		
		/////////////////////// ORDENO
		$scope._ORDEN_REVERSO = false;

		$scope._ordenesOrdenacion = [];
		$scope._ordenesOrdenacion['titulo'] = $scope._ORDEN_REVERSO;
		$scope._ordenesOrdenacion['usuario'] = $scope._ORDEN_REVERSO;
		$scope._ordenesOrdenacion['nombreServicio'] = $scope._ORDEN_REVERSO;
		//Ordeno con el primero por default
		$scope._criterioDeOrdenActual = 'titulo';
		
		$rootScope.paginadorBase($scope, $filter, $scope.paginador, $scope._ordenesOrdenacion, $scope._criterioDeOrdenActual);
		
	// FILTRO
	/*	$scope.$watch('nombreBusqueda', function() {
			$scope.paginador.filtrarPor({'titulo': $scope.nombreBusqueda});
		});
    */
		
		/************************************************************/
		
		/************************************************************/
		/*						Eliminar							*/
		/************************************************************/
		// 1 Pide confirmacion
		$scope.confirmarEliminar = function(e){
			$scope.borrando = e;
			$scope.borrando._cartel = " la plantilla privada "+e.titulo;
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
			TemplatePrivadoService.eliminar(
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
		//console.info($rootScope.perfiles);
		if (!$routeParams.idTemplate){
			$scope.list();
			
		}else{
			TemplatePrivadoService.id = $routeParams.idTemplate;
			TemplatePrivadoService.goTo("/modificar_template_privado");
			//TemplatePrivadoService.goTo("/historiaClinica/templates/privado/editar/"+$routeParams.idTemplate);	
		}
		
		/************************************************************/
		/*					Filtro de Servicios						*/
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
							
							$("#listaServicios").dropdown();
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
			
			if(srv.nombre=='Todos'){
				$scope.paginador.filtrarPor(undefined);
			}else{
				$scope.paginador.filtrarPor({'idServicio':srv.id},true);
			}
			
			//Importante dejar este orden
			$scope.haciendo = false;
			
		};
		
		$scope.listarServicios();
		/**************************************************************/
	};