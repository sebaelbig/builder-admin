'use strict';
/**
 * Template Controller
 */
var TemplateCreateCtrl = function($scope, $rootScope, $routeParams, $filter, $timeout, TemplateService, PropiedadService, ServicioService) {

	$scope.hayMensajes = false;
	$scope.mensajes;
	
	$scope.haciendo = false;
	$scope.modificando = false;
	
	/**
	 * Funcion llamada por:
	 * La directiva cuando se termina de crear el editor
	 * o
	 * Cuando se recupero el pedido
	 */
	$scope.refreshTextoCKEditor = function(texto){
//		if (CKEDITOR.instances!=null && texto!=null)
		if (CKEDITOR.instances !=null && texto)
			CKEDITOR.instances.editor1.setData(texto);
	};
	
	/**************************************************************/
	$scope.cancelar = function(){

		$scope.resetElemento();
		
		$rootScope.goTo("/listar_templates");
	};
	
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
		
		TemplateService.crear(
			$scope.elemento, 
			function(resp){
//				$rootScope.manageSaveCallback($scope, resp);
//				$scope.modificando = !resp.ok;//Si paso algo, ok es falso, asi que seguimos modificando
//				if (resp.ok){
					
//					var elem = resp.paginador.elementos[0];
//					$scope.setElemento(elem);
					
					
					$scope.editarTemplate(resp.paginador.elementos[0].id);
					
//				}
				$scope.mensajes={'mensaje': resp.mensaje, 'error': !resp.ok};
				$scope.hayMensajes = true;
				
				$scope.modificando = true;
				$scope.haciendo = false;
				
			},
			$rootScope.manageError
		);
	};

	$scope.modificar = function () {
		
		
		TemplateService.modificar(
				$scope.elemento, 
				function(resp){
					
//					var elem = resp.paginador.elementos[0];
					
					$scope.editarTemplate(resp.paginador.elementos[0].id);
					
//					$rootScope.manageSaveCallback($scope, resp);
//					
					$scope.modificando = true;//pase lo que pase, sigo viendo la plantilla guardada
					
//						
//					var elem = resp.paginador.elementos[0];
//					$scope.setElemento(elem);
						
					$scope.mensajes={'mensaje': resp.mensaje, 'error': !resp.ok};
					$scope.hayMensajes = true;
					$scope.haciendo = false;
				}, 
				$rootScope.manageError);
	};

	$scope.list = function () {
	};
	
	
	/************************************************************/
	/*						Servicios							*/
	/************************************************************/
	$scope.servicios=[];
	
	$scope.haciendo = true;
	$scope.loadingServicios = true;
	
	ServicioService.listar(
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
	
	
	$scope.seleccionoServicio = function(srv){
		
		$scope.loadingServicios = true;
		
		TemplateService.findByServicio(
				srv.id,
				function(resp){
					
					
					if (resp.ok){
						var template =  resp.paginador.elementos[0];
						$scope.editarTemplate(template.id);
					}else{
						$scope.resetElemento();
					}
					
					$scope.loadingServicios = false;
					$scope.haciendo = false;
					
					
				},
				function(err){console.error("Error al listar los servicios");}
		);
		
		$scope.elemento.servicio = srv;
		$scope.elemento.nombreServicio = srv.nombre;
		$scope.elemento.idServicio = srv.id;
		
		$("#listaServicios").dropdown("set text", srv.nombre);
		$("#listaServicios").dropdown("hide");
		
		$scope.haciendo = true;
		$scope.hayMensajes = false;
	};
	
	/************************************************************/
	
	/************************************************************/
	/*						Header & Footer						*/
	/************************************************************/
	$scope.editandoPropiedad = false;
	$scope.editandoHeader = false;
	$scope.editandoFooter = false;
	
	$scope.seleccionoHeader = function(){
		
		$scope.editandoHeader = !$scope.editandoHeader; 
		
		if ($scope.editandoHeader){
			$scope._headerPanelEdicion = "Editando el encabezado";
			$scope.elementoEnTextEditor = {texto: $scope.elemento.encabezado};
			$scope.refreshTextoCKEditor($scope.elemento.encabezado);
		}
		
		$scope.editandoPropiedad = false;
		$scope.editandoFooter = false;
		
	};
	
	$scope.seleccionoFooter = function(){
		
		$scope.editandoFooter = !$scope.editandoFooter;
		
		if ($scope.editandoFooter){
			$scope._headerPanelEdicion = "Editando el pié de página";
			$scope.elementoEnTextEditor = {texto: $scope.elemento.pie};
			$scope.refreshTextoCKEditor($scope.elemento.pie);
		}
		
		$scope.editandoPropiedad = false;
		$scope.editandoHeader = false;
		
	};
	
	/************************************************************/
	/*						Propiedades							*/
	/************************************************************/
	$scope._propiedades=[]; //Almacena todas las propieades
	$scope.propiedades=[]; //Arreglo que se usa para la edicion
	
	$scope.FLOAT_DERECHA = "right"; 	//float:right;
	$scope.FLOAT_IZQUIERDA = "left"; 	//float:left;
	
	$scope.ANCHO_MEDIA_PAGINA = 47; 	// width: 47%
	$scope.ANCHO_PAGINA = 97; 	//width: 97%;
	
	$scope.propiedadTemplate = {ancho: $scope.ANCHO_PAGINA, margen: $scope.FLOAT_IZQUIERDA, borrado: false, propiedad: {}};
	
	$scope._headerPanelEdicion = "Seleccione una propiedad para editar";

	$scope.elementoEnTextEditor = {texto:""};
	
	/**
	 * Resetea las listas de las propiedades
	 */
	$scope.resetListaPropiedades = function(){
		
		$scope.propiedades = [];
		
		//Itero sobre todas las propiedades y les reseteo el editando
		$.each($scope._propiedades, function(ix, prop){
			$scope.propiedades.push(prop);
			$scope.propiedades[prop.nombre] = prop;
			$scope.propiedades[prop.nombre].editando = false;
			$scope.propiedades[prop.nombre].enTemplate = false;
		});
		
		//Itero sobre las propiedades del template, y marco las que Ya estan en el template
		if($scope._propiedades.length > 0
			&&  $scope.elemento 
			&&	$scope.elemento.propiedades)
			
			$.each($scope.elemento.propiedades, function(ix, propTemplate){
				//Esta solos si no esta borrado
				if (!propTemplate.borrado){
					$scope.propiedades[propTemplate.propiedad.nombre].enTemplate = true; 
					$scope.propiedades[propTemplate.propiedad.nombre].texto = propTemplate.contenido;
				}
				
			});
		
	};
	
	/**
	 * Lista todas las propiedades
	 */
	
	PropiedadService.listar(
		function(resp){
			if (resp.ok){
				
				$scope._propiedades = resp.paginador.elementos;
				
				$scope.resetListaPropiedades();
				
				$scope.haciendo = false;
			}
		},
		function(err){console.error("Error al listar los templates");}
	);

	/**
	 * 
	 */
	$scope.quitarPropiedad = function(propView){
		
//		$scope.cancelarEdicion();
		
		//Lista de propiedades de sidebar (izq)
		$scope.propiedades[propView.nombre].editando = false;
		$scope.propiedades[propView.nombre].enTemplate = false;
		
		//Preview de template (der)
		for (var ip=0; ip< $scope.elemento.propiedades.length; ip++){
			if ($scope.elemento.propiedades[ip].propiedad.id == propView.id)
				$scope.elemento.propiedades[ip].borrado = true;
		}
		
//		Elimina todas las porpiedades que cumplen con la condicion 
//		_.remove($scope.elemento.propiedades, function(propElem) {
//			return propElem.propiedad.id == propView.id;
//		});		
		
	};
	
	/**
	 * Selecciono una propiedad 
	 */
	$scope.seleccionoPropiedad = function(prop){
		
		if (!$scope.editandoPropiedad){
			
			$scope.cancelarEdicion();
			$scope.hayMensajes = false;
			
			if (!prop.editando){
				
				$scope.editandoPropiedad = true;
				prop.editando = true;
				
				$scope.propiedadTemplate.propiedad = prop;
				
				$scope.elementoEnTextEditor = $scope.propiedadTemplate;
				
				$scope.elementoEnTextEditor.texto = (prop.texto)?prop.texto:" ";
				$scope.refreshTextoCKEditor($scope.elementoEnTextEditor.texto);
				
				$scope._headerPanelEdicion = "Propiedad "+prop.nombre;
				
//		}else{
//			Se estaba editando una, y se presiono sobre otra 
//			$scope.refreshTextoCKEditor('');
			}
		}else{
			$scope.mensajes={'mensaje': 'Por favor, finalice la edición de la propiedad '+$scope.propiedadTemplate.propiedad.nombre, 'error': true};
			$scope.hayMensajes = true;
		}
		
	};
	
	/**
	 * 
	 */
	$scope.resetPropiedadEnEdicion = function(){
		
		$scope.editandoPropiedad = false;
		$scope.editandoHeader = false;
		$scope.editandoFooter = false;
		
		$scope._headerPanelEdicion = "Seleccione una propiedad para editar";
		$scope.elementoEnTextEditor.texto = "";
		$scope.refreshTextoCKEditor($scope.elementoEnTextEditor.texto);
		
		$scope.propiedadTemplate = {ancho: $scope.ANCHO_PAGINA, margen:$scope.FLOAT_IZQUIERDA, borrado: false, propiedad: {}};
		
		$scope.hayMensajes = false;
	};
	
	/**
	 * Guarda la propiedad que esta siendo editada
	 */
	$scope.guardarEdicion = function(){
		
		var contenidoHTML = CKEDITOR.instances.editor1.getData();
		if ($scope.editandoHeader){
			//Estaba editando el encabezado
//			$scope.elemento.encabezado = $scope.elementoEnTextEditor.texto;
			$scope.elemento.encabezado =  contenidoHTML;
		}else{
			if ($scope.editandoPropiedad){
				//Estaba editando una propiedad
				
				//Agrego la propiedad en la lista de propiedades del template
				var indicePropiedad = _.findIndex($scope.elemento.propiedades, function(prop) {
					return prop.propiedad.id == $scope.propiedadTemplate.propiedad.id;
				});
				
				if (indicePropiedad>-1){
					$scope.elemento.propiedades[indicePropiedad].contenido = contenidoHTML;
					//La propiedad ya esta, reemplazo su contenido
					//Tomo el HTML
				}else{
					//La propiedad NO estaba, la agrego
					$scope.propiedadTemplate.contenido = contenidoHTML;
					$scope.elemento.propiedades.push($scope.propiedadTemplate);
				}
				
			}else{
				//Estaba editando el pie
//				$scope.elemento.pie = $scope.elementoEnTextEditor.texto;
				$scope.elemento.pie =  contenidoHTML;
			}
		}
		
		//Reseto la parte de configuracion
		$scope.cancelarEdicion();
	};
	
	/**
	 * Cancela la edicion de la propiedad
	 */
	$scope.cancelarEdicion = function(){
		
		$scope.resetPropiedadEnEdicion();
		$scope.resetListaPropiedades();
		
		$scope.hayMensajes = false;
		
	};

	$scope.toggleAncho = function(){
		if ($scope.propiedadTemplate.ancho  == $scope.ANCHO_PAGINA){
			//El elemento ocupara solo media pagina
			$scope.elementoEnTextEditor.ancho = $scope.ANCHO_MEDIA_PAGINA;
		}else{
			//El elemento ocupará TO DO el ancho de la pagina, por lo tanto
			$scope.elementoEnTextEditor.ancho = $scope.ANCHO_PAGINA;
			$scope.elementoEnTextEditor.ancho = $scope.FLOAT_IZQUIERDA;
		}	
	};
	
	$scope.toggleMargen = function(){
		$scope.elementoEnTextEditor.ancho = $scope.ANCHO_MEDIA_PAGINA;
		if ($scope.propiedadTemplate.margen  == $scope.FLOAT_IZQUIERDA)
			//El elemento ocupara la mitad DERECHA
			$scope.elementoEnTextEditor.margen = $scope.FLOAT_DERECHA;
		else
			$scope.elementoEnTextEditor.margen = $scope.FLOAT_IZQUIERDA;
	};
	
	/************************************************************/
	$scope.elementos = [];
	
	$scope.resetElemento = function(){
		$scope.elemento = {borrado:false, propiedades:[], servicio:null, texto:''};
		$scope.haciendo = false;
		$scope.modificando = false;
		
		$scope.resetListaPropiedades();
	};
	
	$scope.setElemento = function(elem){
		$scope.elemento = elem;
		
		$("#listaServicios").dropdown();
		$("#listaServicios").dropdown("set text", elem.nombreServicio);
		$("#listaServicios").dropdown("hide");
		
		$scope.refreshTextoCKEditor($scope.elemento.texto);
		
		$scope.resetListaPropiedades();
	};
	
	
	$scope.editarTemplate = function(id){
		TemplateService.id = id;
		$scope.modificando = true;
		
		TemplateService.findById(
			function(response) {
				
				$scope.setElemento(response);
			},
			$rootScope.manageError
		);
	};
	
	if (!TemplateService.id){
		
		$scope.resetElemento();
		
	}else{
		
		$scope.editarTemplate(TemplateService.id);
	}
	
	/**************************************************************/
};
