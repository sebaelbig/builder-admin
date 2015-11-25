'use strict';
/**
 * TemplatePublicoCreate Controller
 */
var TemplatePublicoCreateCtrl = function($scope, $rootScope, $routeParams, $filter, $timeout, TemplatePublicoService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	$scope.editor; 
	
	/************************************************************/
	/*						Volver atrás(Modal)					*/
	/************************************************************/
	$scope.cancelarConfirmado = function(){
		$scope.resetElemento();
		
		$rootScope.goTo("/listar_template_publico");//Lista los templates
	};
	
	$scope.cancelar = function(){
		if($scope.textoElementoViejo != $scope.elemento.texto){
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
	/************************************************************/
	
	
	$scope.validar = function(){
		
		return $scope.elemento.titulo;
		
		
	};
	
	$scope.guardar = function () {
		
		if ($scope.validar()){
			
			$scope.hayMensajes = false;
			$scope.haciendo = true;
			
			//Obtengo la data del Editor
			$scope.elemento.texto = CKEDITOR.instances.editor1.getData();
			
			if (!$scope.modificando){
				$scope.crear();
			}else{
				$scope.modificar();
			}
		
		}
		
	};
	
	$scope.crear = function () {
		
		TemplatePublicoService.crear(
			$scope.elemento, 
			function(resp){
				$rootScope.manageSaveCallback($scope, resp);
				CKEDITOR.instances.editor1.setData("");
			},
			$rootScope.manageError
		);
	};

	$scope.modificar = function () {

		TemplatePublicoService.modificar(
				$scope.elemento, 
				function(response){
//					$rootScope.manageSaveCallback($scope, resp);
//					$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
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
	};

	//Esta funcion solo se utiliza en los Controllers que tembien listan
	$scope.list = function () {};
	/************************************************************/
	/*						Servicios							*/
	/************************************************************/
	$scope.servicios=[];
	
	$scope.haciendo = true;
	$scope.loadingServicios = true;
	
	$scope.listarServicios = function(){
		
		TemplatePublicoService.listarServiciosDeUsuario(
				function(resp){
					if (resp.ok){
						$scope.servicios = resp.paginador.elementos;
						
						$.each($scope.servicios, function(ix, srv){
							srv.checked = false;
						});
						
						$("#listaServicios").dropdown();
						
						$scope.loadingServicios = false;
					}
				},
				function(err){console.error("Error al listar los servicios");}
		);
	
	};
	
	$scope.seleccionoServicio = function(srv){
		
		$scope.elemento.servicio = srv;
		$scope.elemento.nombreServicio = srv.nombre;
		$scope.elemento.idServicio = srv.id;
		
		$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		
	};
	
	/************************************************************/
	/*						INICIO	    						*/
	/************************************************************/
	$scope.elemento = {borrado:false, servicio:null, texto:""};
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, servicio:null, texto: ""};
		$scope.haciendo = false;
		$scope.modificando = false;
		
		if($scope.textoElementoViejo==undefined)
			$scope.textoElementoViejo = "";
		
		$("#listaServicios").dropdown("set text", "Elija servicio");
		
//		$scope.refreshTextoCKEditor();
			
	};
	
	$scope.setElemento = function(elem){
		$scope.elemento = elem;
		
		$scope.textoElementoViejo = $scope.elemento.texto;
		
		$("#listaServicios").dropdown();
		$("#listaServicios").dropdown("set text", elem.nombreServicio);
		$("#listaServicios").dropdown("hide");
		
		$scope.refreshTextoCKEditor();
	};
	
	/**
	 * Funcion llamada por:
	 * La directiva cuando se termina de crear el editor
	 * o
	 * Cuando se recupero el pedido
	 */
	$scope.refreshTextoCKEditor = function(){
		if (CKEDITOR.instances.editor1 && $scope.elemento && $scope.elemento.id )
			CKEDITOR.instances.editor1.setData($scope.elemento.texto);
	};
	
	if (!TemplatePublicoService.id){
		//No viene id por parametro, entonces esta Creando uno nuevo
		$scope.resetElemento();
		$scope.listarServicios();
		
	}else{
		
		$scope.modificando = true;
		$scope.haciendo = false;
		
		$scope.listarServicios();
		
		TemplatePublicoService.findById(
			function(response) {
				
				$scope.setElemento(response);
				
			},
			$rootScope.manageError
		);
	}
	/**************************************************************/
	
};
