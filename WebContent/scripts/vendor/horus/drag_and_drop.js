var dnd_object  = null;
var mouseOffset_dnd = null;

document.onmousemove = dnd_mouseMove; 
document.onmouseup   = dnd_mouseUp;

function getmouseOffset_dnd(target, ev){
	ev = ev || window.event;

	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function getPosition(e){
	var left = 0;
	var top  = 0;

	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}

	left += e.offsetLeft;
	top  += e.offsetTop;

	return {x:left, y:top};
}

function mouseCoords(ev){

	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	
	return {
			x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:ev.clientY + document.body.scrollTop  - document.body.clientTop
		};
}

function dnd_mouseMove(ev){
	ev           = ev || window.event;
	var mousePos = mouseCoords(ev);

	if(dnd_object){

		dnd_object.style.position = 'absolute';
		dnd_object.style.top      = (mousePos.y - mouseOffset_dnd.y) + "px";
		dnd_object.style.left     = (mousePos.x - mouseOffset_dnd.x) + "px";

		return false;
	}
}
function dnd_mouseUp(){
	dnd_object = null;
}

function hacerloMovible(item, itemAgarrable){
	
	if(!item) return;
	
	itemAgarrable.setAttribute("a_mover", item.id);
	
	itemAgarrable.onmousedown = function(ev){
		var id = this.getAttribute("a_mover");
		dnd_object  = document.getElementById(id);
		mouseOffset_dnd = getmouseOffset_dnd(this, ev);
		return false;
	};
	
}

function limpiarMovible(){
	
	if(dnd_object){
		dnd_object  = null;
	}

}


function  hookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.addEventListener)
    element.addEventListener(eventName, callback, false);
  else if(element.attachEvent)
    element.attachEvent("on" + eventName, callback);
}


function unhookEvent(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
    element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function getEventTarget(e)
{
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}