'use strict';
/**
 * TemplatePrivadoCreate Controller
 */
var TemplatePrivadoCreateCtrl = function($scope, $rootScope, $routeParams, $filter, TemplatePrivadoService, PerfilService) {
	$scope.hayMensajes = false;
	$scope.mensajes;	
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	
	$scope.cancelarConfirmado = function(){

		$scope.resetElemento();
		
		$rootScope.goTo("listar_template_privado");
	};
	
	/************************************************************/
	/*						Volver atrás(Modal)					*/
	/************************************************************/
	
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
	
	$scope.guardar = function () {
		
		$scope.hayMensajes = false;
		$scope.haciendo = true;
		
		//Obtengo la data del Editor
		$scope.elemento.texto = CKEDITOR.instances.editor1.getData();
		
		if (!$scope.modificando){
			$scope.crear();
		}else{
			$scope.modificar();
		}
		
//		$scope.modificando editandoPropiedad
	};
	
	$scope.crear = function () {
		TemplatePrivadoService.crear(
			$scope.elemento, 
			function(resp){
				$rootScope.manageSaveCallback($scope, resp);
				if(resp.ok){
					CKEDITOR.instances.editor1.setData();	
				}
			},
			$rootScope.manageError
		);

	};

	$scope.modificar = function () {

		TemplatePrivadoService.modificar(
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
	/*						Profesionales							*/
	/************************************************************/
	$scope.loadingMedicos = true;
	
	$scope.profesionales=[];
	$scope.haciendo = true;
	PerfilService.buscarMedicosDelServicioDelUsuario(
		    $rootScope.loggedUser.usuario,
			function(resp){
				if (resp.ok){
					
					$scope.profesionales =  resp.paginador.elementos; 
//					
//					if ($rootScope.rolActual.id == "MHE") {
//						
//						$scope.profFiltrados = [];
//						
//						for(var i=0;i<$scope.profesionales.length;i++) {	
//							$scope.profesional = $scope.profesionales[i];
//							$scope.prof = $scope.profesionales[i].usuario;
//							if ($scope.prof.usuario == $rootScope.loggedUser.usuario){
//								$scope.profFiltrados.push($scope.profesional);	
//							}
//						}
//						
//						$scope.profesionales= $scope.profFiltrados;
//					}
//					else {
//						$scope.profFiltrados = [];	
//						for(var i=0;i<$rootScope.perfiles.length;i++) {
//							    $scope.perfil = $rootScope.perfiles[i];
//							    for(var m=0;m<$scope.profesionales.length;m++) {
//							    	$scope.medico = $scope.profesionales[m];
//									if ($scope.perfil.idServicio == $scope.medico.servicio.id) {
//										$scope.profFiltrados.push($scope.medico);
//									}
//								}
//						}
//						$scope.profesionales= $scope.profFiltrados;
//					}

					$.each($scope.profesionales, function(ix, med){
						
						med.checked = false;
					});
					
					$("#listaMedicos").dropdown();
					$scope.loadingMedicos = false;
				}
			},
			function(err){console.error("Error al listar los médicos");}
	);
	
	$scope.seleccionoMedico = function(med){
		
		$scope.elemento.perfil = med.perfil;
		$scope.elemento.idPerfil = med.perfil.id;
		$scope.elemento.servicio =  med.servicio.nombre;
		$scope.elemento.nombreUsuario = med.usuario.usuario;
		$scope.elemento.usuario = med.usuario.nombreCompleto;
	//	$scope.elemento.idSrv = med.servicio.id;
		$("#listaMedicos").dropdown("set text", med.usuario.nombreCompleto + " (" + med.servicio.nombre + ")" );
		$("#listaMedicos").dropdown("hide");
		
	};
	
	
	/************************************************************/
	/*						INICIO	    						*/
	/************************************************************/
	$scope.elemento = {borrado:false, usuario:null, texto:''};

	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, usuario:null, texto:''};
		$scope.haciendo = false;
		$scope.modificando = false;
		
		if($scope.textoElementoViejo==undefined)
			$scope.textoElementoViejo = $scope.elemento.texto;
	};
	
	
	$scope.setElemento = function(elem){
		$scope.elemento = elem;
		$scope.textoElementoViejo = $scope.elemento.texto;
		
		$("#listaMedicos").dropdown();
		$("#listaMedicos").dropdown("set text",  $scope.elemento.usuario + " (" + $scope.elemento.nombreServicio + ")" );
		$("#listaMedicos").dropdown("hide");
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
	
	
	//if (!$routeParams.idTemplatePrivado){
	
	if (!TemplatePrivadoService.id){
		//No viene id por parametro, entonces esta Creando uno nuevo
			$scope.resetElemento();
		//	$scope.resetListaPropiedades();
				
	}else{
		
		$scope.modificando = true;
		$scope.haciendo = false;
		

		TemplatePrivadoService.findById(
			function(response) {				
				$scope.setElemento(response);
			},
			$rootScope.manageError
		);
	}
	
	/**************************************************************/
	
};