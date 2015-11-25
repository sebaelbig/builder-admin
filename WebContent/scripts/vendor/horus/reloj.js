function updateClock ( ){
  	
  	var currentTime = new Date ( );

	var hora = calcularHora(currentTime);
	
	var dia  = calcularDia( currentTime );
	
	// Update the time display
	document.getElementById("valoReloj").innerHTML = dia +" - "+hora;
}

function calcularHora(fecha){

	var currentHours   = fecha.getHours ( );
	var currentMinutes = fecha.getMinutes ( );
	var currentSeconds = fecha.getSeconds ( );
	
	// Pad the minutes and seconds with leading zeros, if required
	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
	currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
	currentHours   = ( currentHours   < 10 ? "0" : "" ) + currentHours;
	
	return currentHours + ":" + currentMinutes + ":" + currentSeconds;
}

function calcularDia(fecha){

	var currentDia = fecha.getDate();
	var currentMes = fecha.getMonth()+1;
	var currentAno = fecha.getFullYear();
	
	// Pad the minutes and seconds with leading zeros, if required
	currentDia = ( currentDia < 10 ? "0" : "" ) + currentDia;
	currentMes = ( currentMes < 10 ? "0" : "" ) + currentMes;
	
	return currentDia + "/" + currentMes + "/" + currentAno;
}

updateClock(); 
setInterval('updateClock()', 1000 );