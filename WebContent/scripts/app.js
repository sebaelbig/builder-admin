'use strict';

function registrarTools( taOptions, taRegisterTool, toolsExtras, indiceToolbar){
	var tool;
	
	for ( var iTool = 0; iTool < toolsExtras.length; iTool++) {
		
		tool = toolsExtras[iTool];

		//Registro la accion
		taRegisterTool(tool.nombre, {
			iconclass: tool.clase,
			action: function(){ this.$editor().wrapSelection(tool.cmd, tool.cmdVal); }
		});
		
		// add the button to the default toolbar definition
		taOptions.toolbar[indiceToolbar].push(tool.nombre);
	
	}
}

/**
 * Main App Module. Includes all other modules.
 * 
 *  , 'pdf'
 *  , 'ngSanitize', 'textAngular'
 */
angular.module('horusApp', ['filters', 'directives', 'routes', 'services', 'sabeExcel'])
	.config(['$routeProvider', '$provide',  function($routeProvider, $provide) {}])
	.run(function ($rootScope, $filter,$window, $location, UsuarioService, HorusService, LoginService) 
	{
		$rootScope.cantidadParametros = 0;
		$rootScope.showMenu = true;
		
		/**
		 * Obtiene los parametros pasados por GET
		 */
		$rootScope.tomarParametrosDeGet = function(){

			$rootScope.parametrosURL = [];

			for (var parametro in $location.$$search) {
				
				$rootScope.parametrosURL[parametro] = $location.$$search[parametro];
		        delete $location.$$search[parametro];
		        $rootScope.cantidadParametros ++;
		    }
			
		    $location.$$compose();

		};
		
		//
		$rootScope.dim = function() {
//			$("#processing").css("display", "block");
//			$("#processing").modal("show");
		};

		$rootScope.unDim = function() {
//			$("#processing").css("display", "none");
//			$("#processing").modal("hide");
//			$("#cargandoPagina").dimmer().dimmer('hide');
			$rootScope.cargandoPagina = false;
		};

		$rootScope.manejarExcepcionRemota = function(err){
			console.info(err);
		};
		
		/*******************************************************************************/
		/*  FooterCtrl  */
		/*******************************************************************************/
		$rootScope.credits = "Horus";
		$rootScope.version = "1.1.40";

		$rootScope.copyright = "2014-2015";
		
		/*******************************************************************************/
		/*  MenuCtrl  */
		/*******************************************************************************/
		$rootScope.menues = [];
		$rootScope.subMenues = [];
		
		$rootScope.subMenuActual = "";
		$rootScope.menuActual = "";
		
		$rootScope.actualizarHistorial = function(url) {
			var urlColeccion = $window.sessionStorage.getItem("lastURL");
			$window.sessionStorage.setItem("lastURL", url);
		};
		
		$rootScope.goTo = function(url) {
			
			//Actualiza el historial de nacvegacion
			$rootScope.actualizarHistorial(url);
			
			var itemsMenu = $("a.item");
			if (itemsMenu.length>0)
				$.each(itemsMenu, function( index, value ) {
					value.classList.remove('active');
				});
			
			var itemsActivo = document.getElementById(url);
			if (itemsActivo)
				itemsActivo.classList.add('active');
			
			//Obtengo el perfil de la funcion
			try{
				//Trato de obtener el servicio asociado al perfil de la funcion
				//if ($rootScope.servicioActual == "") {
				if ($rootScope.fxPerfiles[url] != undefined) {
				   $rootScope.servicioActual = {
						id: $rootScope.fxPerfiles[url].idServicio,
						nombre: $rootScope.fxPerfiles[url].nombreServicio
				  };
			   
				//if ($rootScope.rolActual == "") {		
				  $rootScope.rolActual = {
						id: $rootScope.fxPerfiles[url].tipoPerfil.tipoRol.codigo,
						nombre: $rootScope.fxPerfiles[url].tipoPerfil.tipoRol.nombre
				  };
			    }  
			}catch(e){
//				console.log("NO se pudo obtener el servicio del perfil asociado a la funcion: "+url);
			}
			
			HorusService.goTo(url);
		};
		
		$rootScope.verMenu = function(menuName) {
			$rootScope.menuActual = menuName;
			$rootScope.subMenu = $rootScope.subMenues[menuName];
		};
		
		$rootScope.verSubMenu = function(subMenu){
			$rootScope.subMenuActual = subMenu.label;
			//cuando se clickea en el menu borra los filtros
			delete $window.sessionStorage.removeItem("filtros");
			//se inicializan los parametros globales
			$rootScope.parametros={};
			$rootScope.goTo( subMenu.url );
		};
		/*******************************************************************************/

		
		$rootScope.generatePermissions = function(user) {
			
			var nombreMenu, nombreSubMenu,  indiceSubMenu, idMenu, idSubMenu;
			
			var rol, per, fx;
			$rootScope.perfiles = [];
			
			//Recorro los roles
			for (var ir=0; ir< user.roles.length; ir++){

				rol = user.roles[ir];
				
				//Recorro los perfiles
				for (var ip=0; ip< rol.perfiles.length; ip++){

					per = rol.perfiles[ip];
					
					$rootScope.perfiles.push(per);
					
					//Recorro las funciones
					for (var ifx=0; ifx< per.funciones.length; ifx++){

						fx = per.funciones[ifx];
						
						//Dejo registro del perfil de la funcion
//						nomAccion = $rootScope.idealizarString(fx.nombre_accion);
//						$rootScope.funciones[nomAccion] = fx;
						$rootScope.funciones.push(fx);
						
						//Asocio la funcion con el perfil
						$rootScope.fxPerfiles[fx.url] = per;
				
						/////////////////Menu
						nombreMenu = fx.nombreMenu;
						idMenu = $rootScope.idealizarString(nombreMenu);
						
						if ( !_.some($rootScope.menues, {id:idMenu}) ){
							//Sino contiene el menu, lo agrego
							$rootScope.menues.push({'label': nombreMenu, 'id': idMenu, 'url':fx.url});
							
							//Inicio el arreglo de submenues para este menu
							//Si esta sin inicializar o si el menu NO tiene algun submenu ya cargado
							if (!$rootScope.subMenues[nombreMenu] ||
									$rootScope.subMenues[nombreMenu].length == 0)
								$rootScope.subMenues[nombreMenu] = [];
							
						}
						
						/////////////////Sub Menu
//						nombreSubMenu = fx.nombreSubMenu +" ("+per.nombreServicio.substr(0, 3).toLocaleLowerCase()+")" ;
						nombreSubMenu = fx.nombreSubMenu;
						
						idSubMenu = $rootScope.idealizarString(nombreSubMenu);
						
						indiceSubMenu = _.findIndex($rootScope.subMenues[nombreMenu], function(subMenuItem) {
							return subMenuItem.nombreSubMenu == fx.nombreSubMenu;
						});
						
						if ( indiceSubMenu == -1) {
							$rootScope.subMenues[nombreMenu].push({  'label':nombreSubMenu, 'nombreSubMenu': fx.nombreSubMenu,'menu':nombreMenu, 'id':  idSubMenu, 'url':fx.url});
						}
						
						/////////////////Funcion
						//Marco la funcion si es que esta entre los elementos
//						indiceFX = -1;
//						if ($scope.perfil){
//							indiceFX = _.findIndex($scope.perfil.funciones, function(fxElemento) {
//								return fxElemento.url == fx.url;
//							});
//						}
						
					}
				}
			}
			
			//Ordeno el menu
			$rootScope.menues = _.sortBy($rootScope.menues, function(menu) { return menu.label; });
			//Ordeno cada sub-menu
			var index;
			for (nombreMenu in $rootScope.menues){
				
				index = $rootScope.menues[nombreMenu].label;
				
				$rootScope.subMenues[index] = _.sortBy($rootScope.subMenues[index], function(subMenu) { return subMenu.label; });
			}
			
		};
		
		$rootScope.encontrarPerfil = function(rol,perfil){
			if($rootScope.loggedUser.roles[rol]!=null && $rootScope.loggedUser.roles[rol]!=undefined){
				var perfilesEncontrados= $.grep($rootScope.loggedUser.roles[rol].perfiles,function(e){return e.codigo = perfil});
				if(perfilesEncontrados.length>0)
					return perfilesEncontrados[0]	
			}
			return null;
		}
	
		$rootScope.parametros = {}; 
		
		
		$rootScope.messages = [];
		$rootScope.hayMensajes = false;
		$rootScope.keepMessages = false;
		
		$rootScope.funciones = [];
		$rootScope.fxPerfiles = [];
		
		$rootScope.loggedIn = false;
		
		$rootScope.accionActual = "";
		$rootScope.servicioActual = "";
		$rootScope.rolActual = "";

//		$rootScope.acciones = [];
//		$rootScope.acciones["fx_verReservasQuirofanos"] = "Reserva de Salas Quirúrgicas";
//		$rootScope.acciones["fx_verTurnosReservados"] = "Reserva de turnos del profesional";
		
		/********************************/
		/*		      init 	     		*/
		/********************************/
		
		var strUsr = $window.sessionStorage.getItem("loggedUser");
		
		//Cargo los parametros pasados por GET
		$rootScope.tomarParametrosDeGet();
		
		$rootScope.cargandoPagina = true;
		$rootScope.showMenu = true;
		
		
		if (strUsr && strUsr!="undefined"){
			//Hay usuario en sesion, revalido la sesion mandando a validar el token
			
			if (typeof strUsr == 'string')
				$rootScope.loggedUser = JSON.parse(strUsr);
			else
				$rootScope.loggedUser =  strUsr;
				
 			UsuarioService.getLoggedUser(
				$rootScope.loggedUser.token,
 				function(response){

 					console.info("[app][getLoggedUser] ");
 					if (response.ok) {

						$rootScope.loggedIn = true;
						$rootScope.loggedUser = response.data;
						
						$rootScope.procesarRoles();
						
						$window.sessionStorage.setItem("loggedUser", JSON.stringify($rootScope.loggedUser));
						$rootScope.permissions = $rootScope.generatePermissions($rootScope.loggedUser);
						
						$rootScope.horusDispacher();
						
					}else{

 						console.info("Error, datos incorrectos.");
						
						$rootScope.loggedIn = false;
						$rootScope.loggedUser = null;

						$window.sessionStorage.removeItem("loggedUser");

 					}
 					
// 					$("#cargandoPagina").dimmer('hide');
 					$rootScope.cargandoPagina = false;
 					},
 				function(err){
 					console.info("[app.js][UsuarioService.getLoggedUser] No hay registro de un usuario logueado");
 					
					$rootScope.loggedIn = false;
					$rootScope.loggedUser = null;
					
 					$window.sessionStorage.removeItem("loggedUser");
 					$window.sessionStorage.removeItem("showMenu");
 					
 					$rootScope.cargandoPagina = false;
 					$rootScope.goTo("/login");
				}
			);
		
		}else{
		
			//No hay usuario en sesion, me fijo si viene de alfresco
			
			//Por cuestiones de autorizacion y seguridad de Alfresco, se recibe el usuario por get
			var alf_user = null;
			if ($rootScope.cantidadParametros > 0 &&
					$rootScope.parametrosURL['alf_user']){
				
				//No tenia un parametro por get para ir a un sitio
				alf_user = $rootScope.parametrosURL['alf_user'];
				
			}
			
			if (alf_user){
				//Viene de Alfresco
				
				LoginService.secureLogin(
						alf_user,
						function (response) {
							
							if (response.ok) {
								
								$rootScope.loggedUser = response.data;
								$rootScope.permissions = $rootScope.generatePermissions($rootScope.loggedUser);
								$rootScope.loggedIn = true;
								
								//$window.sessionStorage.setItem("loggedUser", JSON.stringify($rootScope.loggedUser));
								$rootScope.permissions = $rootScope.generatePermissions($rootScope.loggedUser);
								
								$rootScope.procesarRoles();
								
								$rootScope.horusDispacher();
								
							}else{
								$rootScope.mensaje = response.mensaje;
								$rootScope.hayMensajes = true;
							}
							
							$rootScope.cargandoPagina = false;
						}, 
						function (data, status, headers, config) {
							
							// Erase the token if the user fails to log in
							delete $window.sessionStorage.removeItem("token");
							delete $window.sessionStorage.removeItem("loggedUser");
							delete $window.sessionStorage.removeItem("showMenu");
							
							// Handle login errors here
							$rootScope.manejarExcepcionRemota(data);
							$rootScope.cargandoPagina = false;
							
						}
				);
			}else{
				//No esta en sesion, ni viene de Alfresco
				delete $window.sessionStorage.removeItem("token");
				delete $window.sessionStorage.removeItem("loggedUser");
				delete $window.sessionStorage.removeItem("showMenu");
				
				$rootScope.cargandoPagina = false;
				
				$rootScope.goTo("/login");
			}
			
				
		}
		
		/**
		 * Procesa los roles del usuario 
		 */
		$rootScope.matricula = null;
		$rootScope.procesarRoles = function (scope, response) {
			
			if ($rootScope.loggedUser &&
					$rootScope.loggedUser.roles.length > 0){
				
				//Indexo los roles segun su codigo
				$.each($rootScope.loggedUser.roles, function(ix,elem){
					// Obtengo la matricula si es medico
//					if ((elem.codigo == "MHE")  || (elem.codigo == "MEX") && ($rootScope.matricula ==null)) {
//						$rootScope.matricula=elem.valorTipoID;
//					}
					$rootScope.loggedUser.roles[elem.codigo] = elem;
				});
				
			}
		};
		
		$rootScope.cancelar = function(){
			
			//var lastUrl = $window.sessionStorage.getItem("lastURL");
			//$rootScope.goTo(lastUrl);
			$window.history.back();	

		};
		
		/**
		 * Maneja el callback tipico de listar elementos
		 */
		$rootScope.manageListCallback = function (scope, response) {
			
			if (response.ok) {
				
				//Hubo datos de vuelta
				if (response.paginador.elementos &&
						response.paginador.elementos.length >= 0){
					
					if (scope.paginador){
						//Si esta definido el paginador, es porque lo utiliza, asi que delega la logica al paginador
						scope.paginador.setTodos(response.paginador.elementos);
						//Me paro en la pagina del paginador
						scope.paginador.paginaActual = (response.paginador.paginaActual==0)?1:response.paginador.paginaActual;

						scope.paginador.actualizarLista();
						
						if (scope.nombreBusqueda)
							scope.nombreBusqueda = "";
						
					}else{
						//No tiene paginador, directamente le pone los elementos
						scope.elementos = response.paginador.elementos;
					}
					
					if (!scope.hayMensajes)
						scope.mensajes = {mensaje:response.mensaje, error:false} ;
					
				//No hubo datos de vuelta -> errores
				}else{
					
					scope.mensajes = {mensaje:response.mensaje, error:true} ;
					
					//Habilito los mensajes si es que no hay mostrandose otro
					if (!scope.hayMensajes)
						scope.hayMensajes = true;
				}
				
			}else{
				scope.mensajes = {mensaje:response.mensaje, error:true} ;
				scope.hayMensajes = true;
			}
			
			try{
				scope.haciendo = false;
			}catch(e){console.info("no hay dimmer");}
		};
		
		/**
		 *	Realiza las funcionalidades basica a la vuelta de un save
		 */ 
		$rootScope.manageSaveCallback = function (scope, response) {
			
			scope.haciendo = false;
			scope.hayMensajes = true;
			
			if (response.ok) {
				
				//Hubo datos de vuelta
				if (response.paginador.elementos &&
						response.paginador.elementos.length >= 0){
					
					//Si maneja colecciones, lo agrego
					if (scope.elementos){
						//Obtengo el elemento de la vista y lo marco como bloqueado
			    		var ixPedido = _.findIndex( scope.elementos, { 'id': response.paginador.elementos[0].id });
			    		if (ixPedido>-1){
			    			//Esta en mis elementos
			    			scope.elementos[ixPedido] = response.paginador.elementos[0];
			    			
			    		}else{
			    			scope.elementos.push( response.paginador.elementos[0]);
			    		}
					};
					
					scope.mensajes = {mensaje:response.mensaje, error:false} ;
					
					scope.resetElemento();
					scope.list();
					
					//No hubo datos de vuelta -> errores
				}else{
					scope.mensajes = {mensaje:response.mensaje, error:true} ;
				}
				
			}else{
				scope.mensajes = {mensaje:response.mensaje, error:true} ;
			}
		};
		/**
		 *	Realiza las funcionalidades basica a la vuelta de un delete
		 */ 
		$rootScope.manageDeleteCallback = function (scope, response) {
				
			scope.haciendo = false;
			scope.hayMensajes = true;
			
			if (response.ok) {
				
				//Hubo datos de vuelta
				if (response.paginador.elementos &&
						response.paginador.elementos.length >= 0){
					
					scope.mensajes = {mensaje:response.mensaje, error:false} ;
					
					scope.list();
					
				//No hubo datos de vuelta -> errores
				}else{
					scope.mensajes = {mensaje:response.mensaje, error:true} ;
					scope.borrando.borrado = false;
				}
				
			}else{
				scope.mensajes = {mensaje:response.mensaje, error:true} ;
				scope.borrando.borrado = false;
			}
		};
		
		$rootScope.manageError = function () {
			$rootScope.unDim();
			if (!$rootScope.messages) {
				$rootScope.messages = [];
			}
//			$rootScope.messages.push(i18n.t('default.server.error'));
			$rootScope.hayMensajes = true;
		};
		
		/**
		 *  Despacha a la pagina especifica si hay un parametro "site"
		 */
		$rootScope.horusDispacher = function(uri) {
		
			if ($rootScope.cantidadParametros > 0 &&
					$rootScope.parametrosURL['site']){
				
				//Aunque venga de alfresco, solo escondo el menu si va a una consulta especifica
				$rootScope.showMenu = false;
				$window.sessionStorage.setItem("showMenu", false);
				
				//No tenia un parametro por get para ir a un sitio
				$rootScope.goTo($rootScope.parametrosURL['site']);
			}else{
				//
//				var url = $window.sessionStorage.getItem("lastURL");
//				if (url){
//					$rootScope.goTo(url);
//				}else{
				if ($rootScope.loggedUser){
					$rootScope.goTo("/");
				}
				else
					$rootScope.goTo("/login");
//				}
			}
			
		};
		
		$rootScope.canAccess = function(uri) {
			//return $rootScope.permissions.indexOf(uri) != -1;
			return true;
		};
		
		/**
		 * Filters from given input text
		 */
		$rootScope.filtrar=function(elementScope,paginador){
			if (elementScope.nombreBusqueda!=undefined){
//				$scope.nombreBusqueda = elementScope.nombreBusqueda;
				paginador.setActuales( $filter('filter')(paginador.getTodos(), elementScope.nombreBusqueda) );
				//$scope.paginador.paginaActual=1;
				paginador.actualizarLista();
			}
		};
		
		/**
		 * Adds functionality to the object to be able to rollback it's status 
		 */
		$rootScope.snapshot = function(ob) {
			ob._snapshot = {};
			ob._snapshot = angular.copy(ob, ob._snapshot);
			
			ob.rollback = function() {
				ob = ob._snapshot;
				
				return ob;
			};
			
			ob.unSnapshot = function() {
				delete ob['_snapshot'];
				return ob;
			};
			
			return ob;
		};
		
		/********************************/
		/*		      Fechas y dias		*/
		/********************************/
		var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
		var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
		
		var hoy = new Date();
		
		$rootScope.nro_dia = dias[hoy.getDay()]+" "+hoy.getDate();
		$rootScope.nombre_dia = "de "+meses[hoy.getMonth()]+" de "+hoy.getFullYear();
		
		
		/**
		 * Formats the Time part of a Date Object to the formats
		 * 
		 * HH:mm
		 * HH:mm:ss
		 * HH:mm:ss.SSS
		 * 
		 * addSeconds and addMilliseconds controls the precision of the formatting.
		 * 
		 */
		$rootScope.timeToString = function(date, addSeconds, addMilliseconds) {
			return DateFormatHelper.timeToString(date, addSeconds, addMilliseconds);
		};
		
		/**
		 * Formats the date part of a Date Object to the format: dd/MM/yyyy
		 */
		$rootScope.dateToString = function (date) {
			return DateFormatHelper.dateToString(date);
		};
		
		/**
		 * Formats the Date and the Time part of a Date Object to the formats:
		 * 
		 * HH:mm
		 * HH:mm:ss
		 * HH:mm:ss.SSS
		 * 
		 * addSeconds and addMilliseconds controls the precision of the formatting.
		 */
		$rootScope.dateTimeToString = function (date, addSeconds, addMilliseconds) {
			return DateFormatHelper.dateTimeToString(date, addSeconds, addMilliseconds);
		};
		
		/**
		 * Formats the Date and the Time part of a Date Object to the format: HH:mm:ss.SSS.
		 */
		$rootScope.fullDateTimeToString = function(date) {
			return DateFormatHelper.fullDateTimeToString(date);
		};
		
		/**
		 * Parses a Date string of any of the formats:
		 * 
		 * HH:mm
		 * HH:mm:ss
		 * HH:mm:ss.SSS
		 * 
		 *  (in this case the date part is set to 01/01/1970)
		 * 
		 * into a Date Object
		 */
		$rootScope.stringToTime = function(timeString) {
			return DateFormatHelper.stringToTime(timeString);
		};
		
		
//		//Dada una cantidad devuelve el String de la hora
		$rootScope.convertirEnHora = function( cantHora ){
			var resul = cantHora / 2;

			resul = resul.toString().split(".")[0];
			
			if (resul.length == 1){
				resul = "0"+resul;
			}
			
			//Parte de atras
			if (cantHora % 2 != 0){
				resul += ":30";
			}else{
				resul += ":00";
			}
					
			return resul;			
		};
		
		$rootScope.idealizarString = function (string){
			return string.replace(/\s+/g, '');
		};
		
		//Dada una cantidad devuelve el String de la hora
		$rootScope.convertirEnInt = function( strHora ){

			var resul = strHora.split(":");

			var hora = parseInt( resul[0] );
			var min  = parseInt( resul[1] );
			
			return hora*2 + parseInt((min==30)?1:0);			
		};
		
		/**
		 * Parses a Date string of the format:
		 * 
		 * dd/MM/yyyy (in this case the time part is set to 00:00:00.000)
		 * 
		 * into a Date object
		 */
		$rootScope.stringToDate = function(dateString) {
			return DateFormatHelper.stringToDate(dateString);
		};
		
		/**
		 * Parses a Date string of any of the formats:
		 * 
		 * dd/MM/yyyy (in this case the time part is set to 00:00:00.000)
		 * HH:mm (in this case the date part is set to 01/01/1970)
		 * HH:mm:ss (in this case the date part is set to 01/01/1970)
		 * HH:mm:ss.SSS (in this case the date part is set to 01/01/1970)
		 * dd/MM/yyyy HH:mm
		 * dd/MM/yyyy HH:mm:ss
		 * dd/MM/yyyy HH:mm:ss.SSS
		 * 
		 * into a Date Object.
		 */
		$rootScope.stringToDateTime = function (dateTimeString) {
			return DateFormatHelper.stringToDateTime(dateTimeString);
		};
		
		
		/**
		 * 
		 */
		$rootScope.paginadorBase = function(scope, filtro, paginador, ordenesOrdenacion, criterioDeOrden){
			
			paginador.paginaActual=1;
			paginador.cantPorPagina= 10;
			
			paginador.totalPaginas= 0;
			paginador.hayPaginaAnterior= false;
			paginador.hayPaginaSiguiente= false;
			
			//Guarda todos los elementos
			paginador._elementos= [];
			
			//Guarda los elementos que se muestran
			paginador.elementos= [];
			
			paginador.mensaje="";
			
			paginador.scope = scope;
			
			//Ordenacion
			paginador.filter = filtro;
			paginador.ordenesOrdenacion= ordenesOrdenacion;
			paginador.criterio= criterioDeOrden;
			
			this._todosLosElementos=[];
			
			paginador.setTodos = function (todosLosElementos){
				this._todosLosElementos = todosLosElementos;
				paginador._elementos = todosLosElementos;
			};
			
			paginador.paginaAnterior= function(){
				
				if (this.hayPaginaAnterior){
					this.paginaActual--;
					
					this.actualizarLista();
				}
				
			};
			
			paginador.paginaSiguiente=function(){
				
				if (this.hayPaginaSiguiente){
				
					this.paginaActual++;

					this.actualizarLista();
				}
				
			};
			
			/*Actualiza la lista segun los parametros que tiene configurados*/
			paginador.actualizarLista = function(){
				
				var start = (this.paginaActual-1)  * this.cantPorPagina;
				var end = start + this.cantPorPagina;
				
				this.elementos = this._elementos.slice(start,end);
				this.scope.elementos = this.elementos;//Actualizo los elementos del scope
				
				this.hayPaginaAnterior = start > 0;
				this.hayPaginaSiguiente = this._elementos.slice(end,end+1).length > 0;
			};

			paginador.claseOrdenacion = function(criterio){
				if (criterio == this.criterio){
					//Si el criterio es el que se está usando actualmente, chequeo el orden
					if (this.ordenesOrdenacion[criterio]){
						return "descending";
					}else{
						return "ascending";
					}
				}else{
					return "--";
				}
				
			};
		
			paginador.ordenarPor = function(criterio){
				
				this.criterio = criterio;
				
				//Ordeno todos los elementos por un criterio
				this._elementos = this.filter('orderBy')(this._elementos, criterio, this.ordenesOrdenacion[criterio]);
				
				//Actualizo la lista, muestro solo los del rango actual
				this.actualizarLista();
				
				//Doy vuelta el orden
				this.ordenesOrdenacion[criterio] = !this.ordenesOrdenacion[criterio];
				
				$('#th_'+criterio).transition('pulse');
			};
			
			/**/
			paginador.ordenarPorFecha = function(criterio){
				
				this.criterio = criterio;
				//Ordeno todos los elementos por un criterio
				//this._elementos = this.filter('orderBy')(this._elementos, criterio, this.ordenesOrdenacion[criterio]);
				if(!this.ordenesOrdenacion[criterio]){
					this._elementos.sort(function(a,b){
						//var c =moment(a.fechast, "DD/MM/YYYY"); 
						//var d = moment(b.fechast, "DD/MM/YYYY");
						var parts = a.fechast.split("/");
						var c = new Date(parseInt(parts[2], 10),
						                  parseInt(parts[1], 10) -1,
						                  parseInt(parts[0], 10));
						var parts = b.fechast.split("/");
						var d = new Date(parseInt(parts[2], 10),
						                  parseInt(parts[1], 10) -1,
						                  parseInt(parts[0], 10));
					
						return c-d;
						
					});
				}else{
					this._elementos.sort(function(a,b){
						//var c = a.fechast;
						//var d = b.fechast;
						var parts = a.fechast.split("/");
						var c = new Date(parseInt(parts[2], 10),
						                  parseInt(parts[1], 10) -1,
						                  parseInt(parts[0], 10));
						var parts = b.fechast.split("/");
						var d = new Date(parseInt(parts[2], 10),
						                  parseInt(parts[1], 10) -1,
						                  parseInt(parts[0], 10));
						return d-c;
						
					});
				}
				
					
				//Actualizo la lista, muestro solo los del rango actual
				this.actualizarLista();
				
				//Doy vuelta el orden
				this.ordenesOrdenacion[criterio] = !this.ordenesOrdenacion[criterio];
				
				$('#th_'+criterio).transition('pulse');
			};
			/**/
			paginador.filtrarPor = function(criterio,comparator){
				if (this._todosLosElementos){
					if(comparator){
						this._elementos = this.filter('filter')(this._todosLosElementos, criterio,comparator);
					}else{
						this._elementos = this.filter('filter')(this._todosLosElementos, criterio );
					}
					this.paginaActual = 1; //Me paro en la primer pagina siempre que filtro
					this.actualizarLista();
				}
			};
			
			paginador.getTodos = function(){
				return this._todosLosElementos;
			};
			paginador.setActuales = function( elems ){
				this._elementos = elems;
			};
			paginador.getActuales = function(){
				return this._elementos;
			};
			paginador.getVisibles = function(){
				return this._elementos;
			};
			paginador.getPaginaActual = function(){
				return this.paginaActual;
			};
			paginador.setPaginaActual = function(pag){
				this.paginaActual = pag;
			};
		};
		
		
		$rootScope.isBrowserCompatibility = function(){
			if (navigator.userAgent.indexOf("Trident/7")>0){
				//Es IE
				try{
					return true;
					//return parseInt(navigator.userAgent.split("rv:")[1].substring(0, 2))>=11;
				}catch(e){return false;}
			}else if (navigator.userAgent.toLowerCase().indexOf("chrome")>0){
				//Chrome
				try{
					return parseInt(navigator.userAgent.split("Chrome/")[1].substring(0, 2)) >= 30;
				}catch(e){return false;}
			}else{
				return false;
			}
		};
		
		$rootScope.redirectForward=function(){
			$window.history.forward();	
		};
      
	}
);

