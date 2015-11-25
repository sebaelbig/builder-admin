'use strict';
/**
 * TurnoProfesional Controller
 * 
 * Mansilla, Eduardo
 * Mat: 15704
 * 
 * 
 */
var TurnoProfesionalCtrl = function($scope, $rootScope, TurnoProfesionalService, ProfesionalService, PacienteService) {
	
	$rootScope.accionActual = "Reservas de consultorio";
	
	$scope.profesional = {};
	
	/*********************************************************************************************************/
	/**												Agrego la HC del Paciente								**/
	/*********************************************************************************************************/
	
	$scope.verHistorialDelPaciente= function(turno){		
		$rootScope.parametros.nroDocumento= turno.numeroDoc;
		$rootScope.parametros.tipoDocumento = turno.tipoDoc;
		$rootScope.parametros.backTo='/ver_turno_como_profesional';
		$rootScope.goTo("/ver_historial_PacienteTurno");
		
	};
	
	/*********************************************************************************************************/
	/**												Agrego los datos del Paciente							**/
	/*********************************************************************************************************/
	$scope.verDatosPacienteTurno= function(turno){
		
		PacienteService.datosDePaciente(turno.numeroDoc,turno.tipoDoc, function(
				response) {
			$scope.paciente = response;
			if(!$scope.paciente.fechaNacimiento){
				$scope.paciente.edad="";
			}
			$("#datosPacienteTurno").modal( "show" );

		}, $rootScope.manageError);
		
	};
	
	$scope.ocultarDatosPacienteTurno = function(){
		$("#datosPacienteTurno").modal( "hide" );
		
	};
	
	/*********************************************************************************************************/
	/**												TURNOS PROF												**/
	/*********************************************************************************************************/
	$scope.buscarPorProfesional = function(){
		$scope.bloqueTurnos = [];
	};
	
	/*
	 * Recupero los datos del asistidor
	 */
	$scope.recuperarDatosProfesionalAsistidor = function(){
		
		//VER QUE EL CODIGO ESTA HARDCODEADO!!!!!!
		if ($scope.loggedUser)
			$scope.rol_profesional = $scope.loggedUser.roles['MHE'];
		
		if ($scope.rol_profesional){
			
			//Recupero la info del profesional
			ProfesionalService.recuperarDatosProfesional(
					$scope.rol_profesional.valorTipoID, 
					$scope.seleccionoProfesional, 
					$scope.manejarExcepcionRemota);
			
			//Recupero la info de los bloque turnos del profesional
			TurnoProfesionalService.obtenerBloqueTurnosDeProfesional(
					$scope.rol_profesional.valorTipoID, 
					$scope.cargarInfoDeBloqueTurnos, 
					$scope.manejarExcepcionRemota);
		}
		
	};
	
	/*
	 * Se recupero el profesional desde el server
	 */
	$scope.seleccionoProfesional = function(json_paginador){
		
		$scope.refrescando = false;
		
		if (json_paginador.ok){
			
			$scope.profesional = json_paginador.paginador.elementos[0];
			$scope.profesional.matricula = $scope.rol_profesional.valorTipoID;
		}
		
	};
	
	$scope.cargarInfoDeBloqueTurnos = function( json_infoBloqueTurnos ){
		//Transformo la respuesta
		var resp = json_infoBloqueTurnos;
		
		//Desglozo la respuesta
		$scope.bloqueTurnos = resp.bts;
		
		//Me guardo las posibles prestaciones 
		$scope.prestacionesDelServicio = resp.prestaciones; 
		
		if ($scope.bloqueTurnos.length == 0){

			console.info("No hay turnos.");
			$scope.txt_actualizando = "No hay turnos";
			
			$scope.mensaje = resp.mensaje;
			
			//Actualizo la Vista
			$scope.show_textoInformativo = true;
			
//		if (json_bloqueTurnos.length == 0){
//			
//			var domTxtInfo = dojo.byId('txt_sinBTs');
//			domTxtInfo.innerHTML = "";
//			domTxtInfo.appendChild(document.createTextNode(resp.mensaje));
//			
//			//En caso de que NO busque por especialidad y que acepte lista de espera
//			if ( resp.aceptaListaDeEspera ){
//				
//				//Texto explicativo
//				var txt_sinBTs = dojo.byId('txt_sinBTs');
//				txt_sinBTs.innerHTML = "";
//				
//				var texto = resp.mensaje;//"El profesional seleccionado dispone de una lista de espera. Cuando este profesional vuelva a tener disponibilidad sera notificado.";
//				txt_sinBTs.appendChild(document.createTextNode(texto));
//				
//				//Muestro el boton
//				var btn_agregarListaDeEspera = dojo.byId('btn_agregarListaDeEspera');
//				btn_agregarListaDeEspera.setAttribute("onclick", "javascript:agregarAListaDeEspera('"+elem_paciente.getUsuario()+"',"+profesional.getMatricula()+");");
//				
//				//Muestro la ayuda
//				dojo.removeClass('agregarListaDeEspera', "oculto");
//			}
//			
//			dojo.removeClass(dojo.byId('textoInformativo'), "oculto");
//			
		}else{
			
			//Transformo los json en objetos JS
			$scope.primerBloqueTurno = resp.primerBloqueTurno;
			
			var bt;
			
			for (var i_bt=0; i_bt!=$scope.bloqueTurnos.length; i_bt++){
						
				bt = $scope.bloqueTurnos[i_bt];
				bt.indice = i_bt;
//				bt.clase = $scope.getClaseBT(bt);
				
				//Si el objeto JS es el que tiene el primer turno libre, me lo guardo en una variable aparte
				
				if ( $scope.primerBloqueTurno.str_diaProximoTurno == bt.str_diaProximoTurno /*&& 
						$scope.primerBloqueTurno.str_horaPrimerTurnoLibre == bt.str_horaPrimerTurnoLibre */){
					
					bt.resaltado = true;
				}		
				
			}
			
			//Cargo la lista en pantalla
//			admin_coleccion_idLista_bloque_turnos.cargarColeccion(bloqueTurnos, funcionColeccion_infoBloqueTurnos);

			//Muestro todos los BTs si es que no se estaba refrescando
//			if ( !$scope.refrescandoBTs )
//				$scope.verBts();
			
//			if ($scope.bloqueTurnoActual)
//				$scope.cargarBloqueTurnoActual();
//			else
//				$scope.btRosa = null;//No estaba en estos bts
			
			//Actualizo la Vista
			$scope.show_textoInformativo = false;
			$scope.show_actualizando = false;
			$scope.show_bloquesDeTurnos = $scope.bloqueTurnos.length>0;
			
			$scope.seleccionoBloqueTurno($scope.bloqueTurnos[0]);
		}
		
	};
	

	/*************************************************************************/
	$scope.getBloqueTurnoAnterior = function( bt ){
		var bts_size = $scope.bloqueTurnos.length;
		
		if (bt.indice == 0){
			return $scope.bloqueTurnos[ bts_size -1 ];
		}else{
			return $scope.bloqueTurnos[ bt.indice - 1 ];
		}
	};
	
	$scope.getBloqueTurnoSiguiente = function( bt ){
		var bts_size = $scope.bloqueTurnos.length;
		
		if ( (bt.indice + 1) == bts_size){
			return $scope.bloqueTurnos[ 0 ];
		}else{
			return $scope.bloqueTurnos[ bt.indice + 1 ];
		}
	};
	
	//Carga los turnos del bloqueTurnoActual
	$scope.cargarBTDeProfesional = function( bt, fecha ){

		$scope.bloqueTurnoActual = bt;
		
		var bt_anterior = $scope.getBloqueTurnoAnterior(bt);
		var bt_siguiente = $scope.getBloqueTurnoSiguiente(bt);
		
		//Numero de matricula del profesional involucrado
		var matricula = $scope.profesional.matricula;
		
		//Cargo los turnos del bloque turno seleccionado (definido en datosAdministrativos_paciente
		$scope.cargarTurnosDeBloqueTurno( bt_anterior, bt, bt_siguiente, matricula, fecha, 
					$scope.cargarInformacionDeTurnos, 
					$scope.manejarExcepcionRemota);
		
		$scope.resetBTClases();
		$scope.bloqueTurnoActual.clase = "btSeleccionado";
		
	};
	
	$scope.seleccionoBloqueTurno = function(btSeleccionado){
		var fecha = (btSeleccionado.str_diaProximoTurno)?btSeleccionado.str_diaProximoTurno:$rootScope.dateToString(new Date());
		$scope.cargarBTDeProfesional(btSeleccionado, fecha);
	};
	
	/*********************************************************************************************************/
	/**												Datos profesional										**/
	/*********************************************************************************************************/
	
	
	/*********************************************************************************************************/
	/**												NAVEGACION												**/
	/*********************************************************************************************************/
	$scope.diasNav = [];
	
	var path = "/he_fe/images/navegacion/flechas/";
	
	var images_ab =  path + "flecha_ab.png";
	var images_ab_dis =  path + "flecha_ab_disabled.png";
	var images_arr =  path + "flecha_arr.png";
	var images_arr_disabled =  path + "flecha_arr_disabled.png";
	var images_der =  path + "flecha_der.png";
	var images_der_dis =  path + "flecha_der_disabled.png";
	var images_izq =  path + "flecha_izq.png";
	var images_izq_disabled =  path + "flecha_izq_disabled.png";
	var images_calendario = "/he_fe/images/calendario.png";
	
	$scope.images = new Array(true, false);
	$scope.images[true] = [images_izq, images_arr, null, images_ab, images_der];
	$scope.images[false] = [images_izq_disabled, images_arr_disabled, images_calendario, images_ab_dis, images_der_dis];
	
	//Agrega las imagenes que corresponda
	$scope.cargarNavegacion = function() {
		
		var sinImagen = false, conImagen = true ; 
		
		/*Izquierda*/
		$scope.diasNav[0].imagen =  $scope.images[conImagen][0];
		$scope.diasNav[0].title = "Ctrl + Flecha Izq. ( <- )";
		$scope.diasNav[0].bloqueTurno = $scope.getBloqueTurnoAnterior($scope.bloqueTurnoActual);
		/*$scope.diasNav[0].imagen =  $scope.images[conImagen][0];
		$scope.diasNav[0].title = "Ctrl + Flecha Izq. (<-)";
		$scope.diasNav[0].bloqueTurno = $scope.bloqueTurnoActual;
		
		//Cheuqeo si solo tiene un dia
		if ($scope.diasNav[1].fecha==$scope.diasNav[2].fecha && 
				$scope.diasNav[1].hora==$scope.diasNav[2].hora){
			$scope.diasNav[1].imagen =  $scope.images[sinImagen][1];
		}else{
			$scope.diasNav[1].imagen =  $scope.images[conImagen][1];
			$scope.diasNav[1].title = "Ctrl + Flecha Arriba ( /\ )";
			$scope.diasNav[1].bloqueTurno = $scope.getBloqueTurnoAnterior($scope.bloqueTurnoActual);
		}*/
		
		//Dia actual (era 2)
		$scope.diasNav[1].imagen =  $scope.images[sinImagen][2];
		$scope.diasNav[1].bloqueTurno = $scope.bloqueTurnoActual;
		$scope.diasNav[1].actual = true;
		
		/*//Chequeo si solo tiene un dia
		if ($scope.diasNav[2].fecha==$scope.diasNav[3].fecha && 
			$scope.diasNav[2].hora==$scope.diasNav[3].hora){
			$scope.diasNav[3].imagen =  $scope.images[sinImagen][3];
		}else{
			$scope.diasNav[3].imagen =  $scope.images[conImagen][3];
			$scope.diasNav[3].title = "Ctrl + Flecha Abajo ( V )";
			$scope.diasNav[3].bloqueTurno = $scope.getBloqueTurnoSiguiente($scope.bloqueTurnoActual);
		}
		
		$scope.diasNav[4].imagen =  $scope.images[conImagen][4];
		$scope.diasNav[4].title = "Ctrl + Flecha Der. ( -> )";
		$scope.diasNav[4].bloqueTurno = $scope.bloqueTurnoActual;*/
		$scope.diasNav[2].imagen =  $scope.images[conImagen][4];
		$scope.diasNav[2].title = "Ctrl + Flecha Der. ( -> )";
		$scope.diasNav[2].bloqueTurno = $scope.getBloqueTurnoSiguiente($scope.bloqueTurnoActual);
	
	};
	
	$scope.navegar = function(diaNavegacion) {
		
		try{
			
			var fecha = diaNavegacion.fecha;
			
			$scope.cargarBTDeProfesional(diaNavegacion.bloqueTurno, fecha);
			
		}catch(e){
			
			$scope.show_turnos = false;
			
		}
	};
	
	/*******************************************************************************************/
	//Pide los turnos del bloque turno seleccionado, con las limitaciones al ser para un paciente
	/*******************************************************************************************/
	$scope.cargarTurnosDeBloqueTurno = function( bt_b, bt, bt_d, matricula, fecha ){
		
		var str_fecha = fecha.substr(0,10);
		
		var params = [bt_b, bt, bt_d, matricula, str_fecha, bt.servicio];
		
		TurnoProfesionalService.getTurnosDeBloqueTurnoParaUnaFecha( params, 
				$scope.cargarInformacionDeTurnos, function(err){console.log("Error ");} );
		
	};
	
	$scope.cargarInformacionDeTurnos = function(resp) {

		// Cargo la barra de navegacion
		$scope.diasNav = resp.diasNav;
		$scope.cargarNavegacion();
		
		// Lista de turnos a cargar
		$scope.turnos = resp.turnos.turnos;
		
		// Primer turno libre de la lista
		$scope.primerTurno = resp.primerTurnoLibre;
		
		// Mensaje desde el servidor
		$scope.mensajes = {mensaje:resp.mensaje, error: !resp.ok};
		
		$scope.show_textoInformativo = false;
		$scope.show_actualizando_turnos = false;
		$scope.show_datosBloqueTurno = false;
		
		$scope.show_mensajeTurnos = !resp.ok;
		$scope.show_turnos = resp.ok;
		
//		if (resp.ok){
			
//			if ($scope.turnos.length == 0) {
				//No hay turnos disponibles
//				mostrarCartel('No hay turnos', imagenInfo, msg);

//				$scope.mensaje = "No hay turnos";
				
//			} else {
				
//				dojo.addClass('informacionNoTurnos', 'oculto');
				
//				$scope.cargarTurnos();
//				$scope.show_turnos = true;
//				dojo.byId("datosBloqueTurno").style.display = 'block';
				//dojo.byId("body_tabla_navegacion_bts").style.display = 'block';
//				dojo.byId("tablaTurnos").style.display = 'block';
				
//			}
		
//		} else {
			
			//mostrarCartel('No hay mas turnos', imagenInfo, msg);
			// Limpio los turnos actualez
//			borrarTablaIE(document.getElementById("body_turnos"));
//			var informacionNoTurnos = document.getElementById("informacionNoTurnos");
//			informacionNoTurnos.innerHTML = "";
//			
//			var imagen = document.createElement("img");
//		    imagen.setAttribute("src", 	imagenAdvertencia);
//		    imagen.setAttribute("style","margin-right:5px;margin-top:10px;");
//		    informacionNoTurnos.appendChild(imagen);
//		    informacionNoTurnos.appendChild(document.createTextNode(msg));
//			
//		    dojo.removeClass('informacionNoTurnos', 'oculto');
//		    
//		    document.getElementById("tablaTurnos").style.display = "none";
//		    //document.getElementById("body_tabla_navegacion_bts").style.display = "none";
//			document.getElementById("datosBloqueTurno").style.display = "block";
			
//		}
		
	};
	
	/*********************************************************************************************************/
	/**												INIT   													**/
	/*********************************************************************************************************/
	$scope.rol_profesional;
	
	$scope.bloqueTurnos = [];
	$scope.primerBloqueTurno = null;
	$scope.bloqueTurnoActual = null;
	$scope.prestacionesDelServicio = [];
	
	var clases = new Array("lunes", "martes", "miercoles", "jueves", "viernes", "sabado");
	$scope.getClaseBT = function(bt){
		return clases[bt.numero_semana];
	};
	$scope.resetBTClases = function(){
		_.map($scope.bloqueTurnos, function(bt) { bt.clase = clases[bt.numero_semana]; });
//		var bt;
//		for (var i_bt=0; i_bt!=$scope.bloqueTurnos.length; i_bt++){
//			bt = $scope.bloqueTurnos[i_bt];
//			bt.clase = clases[bt.numero_semana];
//		}
	};
	
	
	$scope.show_textoDeInformacion = false;
	$scope.show_actualizando = true;
	$scope.txt_actualizando = "Obteniendo dias de atención ...";
	
	$scope.show_turnos = false;
	$scope.turnos = new Array();
	
	$scope.recuperarDatosProfesionalAsistidor();
};