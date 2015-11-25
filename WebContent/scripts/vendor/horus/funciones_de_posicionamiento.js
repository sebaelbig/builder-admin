function findPosX(obj){

	var curleft = 0;
	
	if (obj.offsetParent){
	
		while (obj = obj.offsetParent){
			curleft += obj.offsetLeft;
			//obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
		
	return curleft;
}

function findPosY(obj){

	var curtop = 0;
	
	if (obj.offsetParent){
	
		while (obj = obj.offsetParent){
			curtop += obj.offsetTop;
			//obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
		
	return curtop;
}

function encontrarOffset(){
	do {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	} while (obj = obj.offsetParent)
}

function centrarElemento(domElem){

	var anchoContenedor = document.width;
	var altoContenedor = document.height;

	var anchoElemento = domElem.width;
	var altoElemento = domElem.height;
	
	var posX = findPosX(domElem) - (anchoContenedor / 2) - ( anchoElemento / 2);
	var posY = findPosY(domElem) - (altoContenedor / 2) - ( altoElemento / 2);
	
	domElem.style.left = posX;
	domElem.style.top = posY;
}

function  absoluteCursorPosition(eventObj){
	// IE
	if(window.event){ eventObj = window.event; }

	var resul; 
	
	if(isNaN(window.scrollX))
    	resul= {
    		X:eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
	      	Y:eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop
	      	};
	      	
 	else
    	resul= {
	      X: eventObj.clientX + window.scrollX,
	      Y: eventObj.clientY + window.scrollY
	      };
	      
 	return resul;
}