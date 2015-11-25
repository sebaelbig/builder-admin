var _Z_BASE_DIALOGOS = 1000;

var K_ENTER = 13;

var K_FLECHA_IZQ = 37;
var K_FLECHA_ARR = 38;
var K_FLECHA_DER = 39;
var K_FLECHA_ABA = 40;

function borrarTablaIE(body){
	var tamano = body.rows.length;
	
	for (var i=0; i<tamano; i++){
		body.deleteRow(body.rows[0]);
	}
}

function capLock(e){
  kc=e.keyCode?e.keyCode:e.which;
  
  sk=e.shiftKey?e.shiftKey:((kc==16)?true:false);
  
  if(((kc>=65&&kc<=90)&&!sk)||((kc>=97&&kc<=122)&&sk))
	  document.getElementById('caplockActivado').style.visibility = 'visible';
  else 
	  document.getElementById('caplockActivado').style.visibility = 'hidden';
}

/*--------------------Funciones de fechas----------------------*/
/**
 * Dado el nro del mes, devuelve el nombre
 * 
 * @param nroMes Numero del mes (1=Enero)
 * @returns nombre del mes segun su indice
 */
function getNombreMes(i){
	var aux;
	switch (i){
		case 1: aux = "Enero"; break;
		case 2: aux = "Febrero"; break;
		case 3: aux = "Marzo"; break;
		case 4: aux = "Abril"; break;
		case 5: aux = "Mayo"; break;
		case 6: aux = "Junio"; break;
		case 7: aux = "Julio"; break;
		case 8: aux = "Agosto"; break;
		case 9: aux = "Septiembre"; break;
		case 10: aux = "Octubre"; break;
		case 11: aux = "Noviembre"; break;
		case 12: aux = "Diciembre"; break;
		}
	return aux;
}