'use strict';
/**
 * Firma Controller
 */
var FirmaCtrl = function($scope, $rootScope, $routeParams, $filter, UsuarioLDAPService, PerfilService) {
	$scope.hayMensajes = false;
	$scope.mensajes;	
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	$scope.cancelarConfirmado = function(){

		$scope.resetElemento();
		
		$rootScope.goTo("/");
	};
	
	/************************************************************/
	/*						Volver atrás (Modal)				*/
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
		
		if (!$scope.modificando){
			$scope.crear();
		}else{
			$scope.modificar();
		}
		
	};
	
	$scope.crear = function () {
		UsuarioLDAPService.crearFirma(
			$scope.elemento, 
			function(resp){$rootScope.manageSaveCallback($scope, resp);},
			$rootScope.manageError
		);

	};

	$scope.modificar = function () {

		UsuarioLDAPService.modificarFirma(
				$scope.elemento, 
				function(resp){
					$rootScope.manageSaveCallback($scope, resp);
					$scope.modificando = !resp.ok; //Si paso algo, ok es falso, asi que seguimos modificando
				}, 
				$rootScope.manageError);
	};
	
	//Esta funcion solo se utiliza en los Controllers que tambien listan
	$scope.list = function () {};
	
	
	/************************************************************/
	/*						Tipo de Matricula					*/
	/************************************************************/
	
	$scope.tiposDeMatriculas=[{'nombre':'Matricula Provincial','enum':'MATRICULA_PROVINCIAL'},{'nombre':'Matricula Nacional','enum':'MATRICULA_NACIONAL'}];
	$scope.tiposDeMatriculas['MATRICULA_PROVINCIAL']={'nombre':'Matricula Provincial','enum':'MATRICULA_PROVINCIAL'};
	$scope.tiposDeMatriculas['MATRICULA_NACIONAL']={'nombre':'Matricula Nacional','enum':'MATRICULA_NACIONAL'};
	
	$("#listaTipoMatricula").dropdown();
	
	$scope.seleccionoTipoMatricula = function(tipoMatricula){
		$scope.elemento.firma.tipoDeMatricula =  tipoMatricula.enum;
		$("#listaTipoMatricula").dropdown("set text", tipoMatricula.nombre );
		$("#listaTipoMatricula").dropdown("hide");
	};
		
	/************************************************************/
	/*						Profesionales						*/
	/************************************************************/
	$scope.loadingMedicos = true;
	
	$scope.profesionales=[];
	$scope.haciendo = true;
	
	PerfilService.buscarMedicosDelServicioDelUsuario(
			
		    $rootScope.loggedUser.usuario,
			function(resp){
				if (resp.ok){
					
					$scope.profesionales =  resp.paginador.elementos; 
					
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
		//Selecciono el medico en la vista
		$("#listaMedicos").dropdown("set text", med.usuario.nombreCompleto + " (" + med.servicio.nombre + ")" );
		$("#listaMedicos").dropdown("hide");
		
		//Busco la firma del medico
		$scope.buscarFirma( med.perfil.idRol );
	};
	
	/************************************************************/
	/*						Firmas								*/
	/************************************************************/
	
	$scope.buscarFirma=function(idRol){
		
		UsuarioLDAPService.recuperarFirmaPorIdRol(idRol,
			function(response){
				if(response.ok){
					
					$scope.modificando = response.paginador.elementos.length>0;
					
					if($scope.modificando){
						$scope.setElemento(response.paginador.elementos[0]);
						$scope.elemento.idRol = idRol;
					}
				}else{
					$scope.modificando = false;
				}
			},$rootScope.manageError);
	};
	
	
	
	/************************************************************/
	/*						INICIO	    						*/
	/************************************************************/

	$scope.resetElemento = function(){
//		borrado:false
		$scope.elemento = {firma:{especialidad_renglon:"",especialidad:"", email:""}};
		$scope.haciendo = false;
		$scope.modificando = false;
	};
	
	
	$scope.setElemento = function(elem){
		
		$scope.resetElemento();
		
		$scope.elemento.firma = elem;
		
		$("#listaMedicos").dropdown();
		$("#listaMedicos").dropdown("set text",  $scope.elemento.firma.nombreApellido + " (" + $rootScope.servicioActual.nombre+ ")" );
		$("#listaMedicos").dropdown("hide");

		if($scope.elemento.firma.tipoDeMatricula!="UNDEFINED"){
			$("#listaTipoMatricula").dropdown();
			$("#listaTipoMatricula").dropdown("set text", $scope.tiposDeMatriculas[$scope.elemento.firma.tipoDeMatricula].nombre);
			$("#listaTipoMatricula").dropdown("hide");
		}
	};
	
//	$scope.resetElemento();
//		
	$scope.modificando = false;
	$scope.haciendo = false;
	
	$scope.resetElemento();
	
	var idRol = null;
	if($rootScope.loggedUser.roles['MEX']){
		idRol=$rootScope.loggedUser.roles['MEX'].id;
	}else if($rootScope.loggedUser.roles['MHE']){
		idRol=$rootScope.loggedUser.roles['MHE'].id;
	}
	
	$scope.buscarFirma(idRol);
	
	/**************************************************************/
	
};