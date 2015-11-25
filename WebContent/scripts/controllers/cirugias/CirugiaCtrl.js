'use strict';
/**
 * Cirugias Controller
 */
var CirugiaCtrl = function($scope, $rootScope, CirugiaService) {

	/*************************************************************************************/
	/**         						LLAMADA AL SRV									 */
	/*************************************************************************************/
	//Para evitar mas de un pedido al server 
	$scope.pedidos = [null, false, false, false, false, false];

	$scope.resetearPedidos = function(){
		$scope.pedidos = [null, false, false, false, false, false];
	};
	
	/**
	 * Recupera las reservas de un dia
	 * 
	 * 	evtDate* Opcional, si viene como evento, sin parametros se toma el dia actual
	 * 
	 */
	$scope.obtenerReservas = function(fechaSeleccionada){
		
		$("#cargandoPagina").dimmer({closable:false}).dimmer('show');
		
		var strDate;
		if (fechaSeleccionada){
			strDate = fechaSeleccionada;
		}else{
			strDate = $scope.fechaActual;
		}
		
		$scope.crearSalas();
		$scope.salasSinReservas = [{show:false},{show:false},{show:false},{show:false},{show:false},{show:false}]; 
		
//		for (var nroSala=1; nroSala <= $scope.NRO_SALAS; nroSala++){
		if (!$scope.pedidos[1]){ 
			$scope.pedidos[1] = true;
			CirugiaService.obtenerCirugiasDeQuirofanoParaUnaFecha([strDate.split("/"), 1], 
				function(respuesta){ respuesta.nroSala = 1; $scope.cargarQuirofano(respuesta);}, 
				$scope.error);
		}
		if (!$scope.pedidos[2]){ 
			$scope.pedidos[2] = true;
			CirugiaService.obtenerCirugiasDeQuirofanoParaUnaFecha([strDate.split("/"), 2], 
				function(respuesta){ respuesta.nroSala = 2; $scope.cargarQuirofano(respuesta);}, 
				$scope.error);
		}
		if (!$scope.pedidos[3]){ 
			$scope.pedidos[3] = true;
			CirugiaService.obtenerCirugiasDeQuirofanoParaUnaFecha([strDate.split("/"), 3], 
				function(respuesta){ respuesta.nroSala = 3; $scope.cargarQuirofano(respuesta);}, 
				$scope.error);
		}
		if (!$scope.pedidos[4]){ 
			$scope.pedidos[4] = true;
			CirugiaService.obtenerCirugiasDeQuirofanoParaUnaFecha([strDate.split("/"), 4], 
				function(respuesta){ respuesta.nroSala = 4; $scope.cargarQuirofano(respuesta);}, 
				$scope.error);
		}
		if (!$scope.pedidos[5]){ 
			$scope.pedidos[5] = true;
			CirugiaService.obtenerCirugiasDeQuirofanoParaUnaFecha([strDate.split("/"), 5], 
				function(respuesta){ respuesta.nroSala = 5; $scope.cargarQuirofano(respuesta);}, 
				$scope.error);
		}
			
//		}
		
	};
	
	
	$scope.error = function(err){

		var respuesta = { ok: true,  quirofanos: {reservas:[]}};
		
		$scope.cargarQuirofano( respuesta );
	};
	
	/*************************************************************************************/
	/**         						SALAS											 */
	/*************************************************************************************/
	$scope.NRO_SALAS =5;
	
	//Crea las grillas de las salas
	$scope.crearSalas = function(){
		
//		$scope.crearSala(i);
		var hora;
		
		//Creo el modelo
		for (var nroSala=0; nroSala <= $scope.NRO_SALAS; nroSala++){
			
			$scope.salas[nroSala] = {};
			
			for (var i=0; i < 48; i++){
				
				hora = $rootScope.convertirEnHora(i);
				
				$scope.salas[nroSala][hora] = null;
				
			}
			
		}
		
		//Reseteo el contador de quirofanos cargados
		$scope.quirofanosCargados = 0;
		
	};
	
	/*************************************************************************************/
	/**         						CIRUGIAS										 */
	/*************************************************************************************/
	$scope.cargarQuirofano = function( respuesta ){
		
		if (respuesta.ok){ 
			
			$scope.cargarReservas( respuesta.reservas );
			
		}else{
			
			$scope.salasSinReservas[respuesta.nroSala] = {
				sala: respuesta.nroSala,
				mensaje: respuesta.mensaje,
				show: true
			};
				
			$scope.mensaje = "";
		}
		
		$scope.quirofanosCargados++;
		
		//Actualizo la barra de progreso
		$scope.progreso = $scope.quirofanosCargados * (100 / $scope.NRO_SALAS);
		$("#barraProgreso_cargando")[0].style.width = $scope.progreso+"%";
		
		//Actualizo las vistas si llego toda la info
		if ($scope.quirofanosCargados ==  $scope.NRO_SALAS){
			
			$scope.filas = [];
			
			$scope.crearVistaSalas();
			
			$scope.resetearPedidos();
			
			$scope.hayMensajes = $scope.salasSinReservas.length>0; 
//			if ($scope.salasSinReservas.length==0){
//				
//				//Sino hay salas sin reservas oculto el cartel
//				dojo.addClass("mensaje", "oculto");
//				dojo.removeClass("bodySalas", "oculto");
//			
//				document.getElementById('mensaje').innerHTML = "";
//				
//			}else{
//				
				//Si aluna sala no tuvo reservas, muestro el cartel
//				dojo.removeClass("mensaje", "oculto");
//				
//				for (indice in $scope.salasSinReservas){
//					document.getElementById('mensaje').innerHTML += " (Sala: "+indice+")"+$scope.salasSinReservas[indice];
//				}			
//
//				if ($scope.salasSinReservas.length==NRO_SALAS)
//					dojo.addClass("bodySalas", "oculto");
//				else
//					dojo.removeClass("bodySalas", "oculto");
//
//			}
			
			$("#cargandoPagina").dimmer('hide');
			$("#barraProgreso_cargando")[0].style.width = "0%";
			
		}
	};
	
	$scope.campos = ["horaInicio","horaFin","paciente","habitacion","numero","sala","fechaReservaSala","cirugiaProgramada","profesional","anestesista","instrumentista","patologo","pediatra"];

	$scope.resaltarCirugia = function(celda){
		
		var cantHI = $rootScope.convertirEnInt(celda.cirugia.horaInicio) -16;
		var cantHF = $rootScope.convertirEnInt(celda.cirugia.horaFin) -16;
		
		for (var i=cantHI; i<cantHF; i++ ){
			
			var fila_i = $scope.filas[i];
			
			fila_i.celdas[0].clase += celda.clase;
		}

	};

	$scope.desresaltarCirugia = function(celda){
		
		var cantHI = $rootScope.convertirEnInt(celda.cirugia.horaInicio);
		var cantHF = $rootScope.convertirEnInt(celda.cirugia.horaFin);
		
		for (var i=cantHI; i<cantHF; i++ ){
			
			var fila_i = $scope.filas[i-16];
			
			//Tomo la primer celda que es la de la hora
			fila_i.celdas[0].clase = "celdaHora"; 
		}

	};
	
	$scope.ocultarCirugia = function(){
		$("#informacionDeLaReserva").modal( "hide" );
		
	};

	$scope.mostrarCirugia = function(celda){
		
		if (celda.cirugia){
			
			$scope.cirugiaSeleccionada = celda.cirugia;
			
			$("#informacionDeLaReserva").modal( "show" );
		}
	};
	
	
	
	/*************************************************************************************/
	/**         						RESERVAS										 */
	/*************************************************************************************/
	$scope.filas = [];
	
	//Cargo los datos del bt actual al bt pasado como parametro
	$scope.cargarReservas = function( reservas ){
		
		var cirugia, sala;
		
		for (var i=0; i<reservas.length; i++){
			
			cirugia = reservas[i];
			sala = parseInt(cirugia.sala);
			
			$scope.salas[sala][cirugia.horaInicio] = cirugia;
			
		}
		
	};
	
	//Crea una sala vacia (VISTA)
	$scope.crearVistaSalas = function(){
		
		var tr, td, 
			defaultRowspans=[0,1,1,1,1,1];
		
		for (var h=16; h < 44; h++){
			
			//Crear fila
			tr = { 
				id: h,
				hora: h,
				celdas: []
			};
			
			//Crear celda de hora
			td ={
				id: h.toString()+"0",
				hora: h.toString(),
				sala: "0",
				label: $rootScope.convertirEnHora(h),
				clase: "celdaHora",
				style: {'text-align':'center'}
			};
			
			tr.celdas.push( td );
			
			for (var s=1; s <= $scope.NRO_SALAS; s++){
				
				//Crear celda SOLO si no hay un rowspan mayor que uno para esta sala
				if( defaultRowspans[s] > 1 ){
					
					defaultRowspans[s] --;
					
				}else{
					
					//Crear celda de reserva
					td ={
						id: h.toString()+"_"+s.toString(),
						hora: h.toString(),
						sala: s.toString(),
						clase: "",
						parametroMarca: h.toString()+"0",
						fila: tr
					};
					
					var hi_vista = $rootScope.convertirEnHora(h);
					td.hi_vista = hi_vista;
					
					var cirugia = $scope.salas[s][hi_vista];
					
					td.tieneCirugia = cirugia!=null;
					if ( cirugia ){
						
						//Me guardo la cirugia en la reserva
						td.cirugia = cirugia;
						
						var rowspan = $rootScope.convertirEnInt(cirugia.horaFin) - $rootScope.convertirEnInt(cirugia.horaInicio); 
						td.rowspan = rowspan;
						defaultRowspans[s] = rowspan;
						
						td.clase += " celdaCirugia reservaCirugia_"+$scope.idFondo[s];
						
						//Recorrido circular de los fondos
						$scope.idFondo[s] = ($scope.idFondo[s] + 1) % $scope.NRO_SALAS; 
						
					}else{
						td.label = " ";
					}
					
					//Agregar celda a la fila
					tr.celdas.push(td);				
				}
			}
			
			$scope.filas.push( tr );
			
		}
	};
	
	
	$scope.resaltarHora = function(celda){
		
		//La celda pertenece a una cirugia
		if (celda.cirugia)
			$scope.resaltarCirugia( celda);
			
	};
	
	$scope.desresaltarHora = function(celda){
		
		//La celda pertenece a una cirugia
		if (celda.cirugia)
			$scope.desresaltarCirugia( celda);

	};
	
	/*************************************************************************************/
	$scope.quirofanosCargados = 0;
	$scope.progreso = 0;
	
	$scope.salas = {}; 
	$scope.salasSinReservas = [{show:false},{show:false},{show:false},{show:false},{show:false},{show:false}]; 
	$scope.hayMensajes = false;

	$scope.fondos = ["#C6E6F1", "#EBE5D3", "#E79F8C", "#82B2C5", "#EBCE9D"]; 
	$scope.idFondo = [0,0,0,0,0,0]; //El id del fondo es por sala

	$scope.fechaActual = $rootScope.dateToString(new Date());
	
	$scope.mensaje = "";
	
	$rootScope.accionActual = "Reserva de Salas Quir\u00fargicas";
	
	$scope.obtenerReservas();
};