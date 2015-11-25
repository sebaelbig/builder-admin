/*
Funciones que otorga este administrador:

	- cargarColeccion = function(coleccion): 
		Dada una coleccion de Objetos JS @1 (JSON_XXX.js que tienen definido el metodo "getLabel()" y "equals(JSObject)") 
		se guarda la coleccion
		
	- agregar = function(objeto):
		Agrega un objeto @1 a la coleccion
	
	- eliminar = function(id):
		Quita un elemento de la coleccion dado su id @1
	
	- size = function():
		Retorna la cantidad de elementos que hay en la coleccion
		
	- toJson = function():
		Retorna los elementos de la coleccion en un objeto Json (String)
	
	- get = function(posicion):
		Dada una posicion, si es valida en la coleccion, se retorna el objeto de esa posicion 

	- getObject = function(nodoDOM):
		Dado un nodo DOM perteneciente a la coleccion, se retorna el objeto JS correspondiente 
	
	- getObjects = function():
		Devuelve los elementos JS de la lista
	
	- contiene = function(objeto);	
		Dado un objeto devuelve si esta contenido en la coleccion o no
		
Requiere:
	Incorporar:
		-dojo
		-dialogo
		
	Variables definidas en la pagina que se pasan en el constructor:
 		-La variable JS que este definida en la pagina se debe llamar "admin_coleccion_IdLISTA"
 		-En caso de llamar a una funcion externa, se debe definir una funcion, la cual sera pasada como parametro
 	
 	Instanciamiento:
 		-idLista : id del nodo DOM que contendra la lista
 		-acciones : Arreglo de acciones que estaran disponibles 
 		-funcionExterna : funcion que sera llamada en caso de utilizar la accion externa  
 		-iconoFuncionExterna : en caso de utilizar la funcion externa, establecer que icono mostrar para representar su funcionalidad
 		-objetoManejadorExterno: Objeto al que se le llamara la accion externa pasada como parametro (si es que se suministra)
 		
 		Ejemplos:
 			var admin_coleccion_idLista_productos = new Admin_Colecciones("idLista_productos", "eliminar");
 			var admin_coleccion_idLista_contratos = new Admin_Colecciones("idLista_productos", ["externo", "eliminar"], funcionExterna, iconoFuncionExterna);
 				
 	Acciones:
 		-"agregar"  : La accion asociada a la coleccion sera la de agregar	 
 		-"eliminar" : Al cargar una coleccion se le debe indicar que accion realizará
 		-"externo"	: Llama a una funcion externa en donde se le pasa el elemento seleccionado
 		
		A todas las funciones se le puede exigir una confirmacion antes de realizar la accion, 
 		Para esto se le debe agregar al nombre de la accion la palabra clave "Confirmando".
 		Por ejemplo, si queremos que antes de eliminar de la coleccion confirme la accion deberiamos
 		instanciar el administrador de la siguiente manera:
 		
 			var admin_coleccion_idLista_productos = new Admin_Colecciones("idLista_productos", "eliminarConfirmando");
 		
 	
 	
 	HTML:
	 	<div id="idLista">
		    
		    <div class="itemLista #{(indice.index%2 == 0)?'fondoPar':'fondoImpar'}" 
		    		indiceColeccion=""
		    		id="idItemLista">
		    	
				<img />
				<div class="textoItem"/>
				<div class="linkItem"><img></div>
				
			</div>
			
		</div>	
		
*/
function Admin_Colecciones(idLista, acciones, funcionExterna, iconoFuncionExterna, objetoManejadorExterno){
	
	//Valores del administrador de colecciones
	this._id = idLista;
	this._lista = document.getElementById(idLista);
	dojo.addClass(idLista, "adminColeccion");
	
	this._coleccionActual;
	
	this._acciones  = acciones;
	
	this._funcionExterna = funcionExterna;
	this._iconoFuncionExterna = iconoFuncionExterna;
	this._objetoManejadorExterno = objetoManejadorExterno;
	 
	this._indiceInterno = 0;
	
	//Limpia la coleccion administrada
	this.limpiarColeccion = function(){
		this._lista.innerHTML = "";
		
		this._indiceInterno = 0;
		
		this._coleccionActual = {};
	};

	//Dada una coleccion de Objetos JS: JSON_XXX (que tienen definido el metodo "getLabel()") se le cargan a la coleccion
	this.cargarColeccion = function(coleccion){
      	
		this.limpiarColeccion();
      	
      	for (var c_i=0; c_i!=coleccion.length; c_i++ ){
      		
      		this.agregar( coleccion[c_i] );
      		
      	}
      	
     };    
      
    //Devuelve un id sin usar para los items de la lista
    this.getFreshID = function() {
    	
    	var resul = this._id+"_item_"+this._indiceInterno;
    	
    	this._indiceInterno ++;
    	
    	return resul;
    	
   	};
      
    //Agrega un valor con un determinado id y con una determinada acciones  
    this.agregar = function(objeto){
    
    	//Obtengo el label que se visualizara en la lista
		var valor = objeto.getLabel();
		
		//Obtengo el indice del elemento a agregar, para ver si esta o no en la coleccion
		var indice = this.indiceDe(objeto);
		
		if (indice < 0 && !!valor){		
			//El elemento no esta en la coleccion
			var id = this.getFreshID();
			
			//<img />
			var imgItem = document.createElement("img");
			imgItem.setAttribute("src", "/horus_fe/img/comun/item_lista.gif");
			
			//<div class="textoItem"/>			
			var textoItem = document.createElement("div");
			textoItem.innerHTML = valor;
			textoItem.setAttribute("class", "textoItem");
			
			//<div class="linkItem"><img></div>
			var linkItem  = document.createElement("div");
			linkItem.setAttribute("class", "linkItem");
			
			//<div class="itemLista indiceColeccion="" id="idItemLista">
			var itemLista = document.createElement("div");
			itemLista.setAttribute("valor", valor);
			itemLista.setAttribute("id", id);
			itemLista.setAttribute("posicion", this._indiceInterno);
			try{itemLista.setAttribute("title", objeto.getTitle());}catch(e){};
			itemLista.setAttribute("style", "cursor:pointer; opacity:0;");
			itemLista.appendChild(imgItem);
			itemLista.appendChild(textoItem);
			
			//El objeto puede definir su clase
			itemLista.setAttribute("class","itemLista");
			if (objeto.getClass){
				dojo.addClass(itemLista, objeto.getClass());
			}
			
			itemLista.funcion = this._funcionExterna[0];
			itemLista.onclick = function(){
				this.funcion(itemLista);
			}; 
			
			//Agrego la imagen al item
			itemLista.appendChild(linkItem);
			
			//Agrego el item nuevo a la lista JS
			this._lista.appendChild(itemLista);
			
			//Por ultimo agrego la coleccion a la coleccion de objetos interna 
			this._coleccionActual[this._indiceInterno] = objeto;
			
			dojo.fadeIn({node:id}).play();
			
		}else{
			//No posee el elemento
			try{
				console.write("El elemento: "+valor+" ya esta en la coleccion por lo que no se agrego");
			}catch(e){
				
			}
		}			
	} ;
	
	//Quita un elemento de la coleccion
	this.eliminar = function(id){
	
		//Obtengo el nodo a eliminar
    	var nodo = document.getElementById(id);
    	
    	//Lo elimino de la vista
    	dojo.fadeOut({node:id, onEnd: function(nodo){nodo.parentNode.removeChild(nodo);}}).play();
    					
    	//Obtengo el indice del elemento cuyo valor es el pasado como parametro dentro de la coleccion
		var posicion = nodo.getAttribute("posicion");    	
    	
    	//Lo elimino del modelo
    	delete this._coleccionActual[posicion];
    	
	};
	
	//Indica el indice de la posicion en donde se encuentra el objeto pasado como parametro (<0 si no esta)
	this.indiceDe = function(objetoContra){
		return indiceDeObjeto(this._coleccionActual, objetoContra);		
   	};
   	
   	this.contiene = function(objetoContra){
   		return this.indiceDe(objetoContra) >= 0;
   	};
   	   	
	//Si el manejador es un adminColecciones
	this.funcionAdminColecciones = function( eventoOnClick ){
		this.externo( eventoOnClick.currentTarget );
	};
	
   	//Llama a una funcion definida en la pagina que se utiliza
   	this.externo = function(nodoElemento){
   		
   		//var posFx = nodoElemento.getAttribute("idFx");
   		
      	//Obtengo el nodo implicado
    	var nodoFx = document.getElementById(nodoElemento.getAttribute("idItemLista"));
    	
   		this._funcionExterna[posFx](nodoFx, this._objetoManejadorExterno);
   	};
   	
   	this.setObjetoManejadorExterno = function( objeto ) {
   		this._objetoManejadorExterno = objeto;	
   	};
	
	//Indica cuantos elementos posee la coleccion
	this.size = function(){
		return Object.keys(this._coleccionActual).length;
	} ;  	
	
	//Retorna los elementos de la coleccion en un objeto Json (String)
	this.toJson = function(){
		
		return dojo.toJson( this.getJson() );
	};
	
	this.getJson = function(){
		var arreglo = new Array();
		var objeto;
		
		//for (var c_i=0; c_i!=this._coleccionActual.length; c_i++ ){
		for (c_i in this._coleccionActual ){
	
      		objeto = this._coleccionActual[c_i];
      		
      		arreglo.push(objeto.json);
      		
      	}
      	
      	return arreglo;
	} ;
 
 	//Dada una posicion, si es valida en la coleccion, se retorna el objeto de esa posicion
 	this.get = function(posicion){
 		
 		if (this._coleccionActual[posicion] ){
 			
 			return this._coleccionActual[posicion];
 			
 		}else{
 		
 			return null;
 		}
	} ;
	
	//Dado un nodo DOM perteneciente a la coleccion, se retorna el objeto JS correspondiente
	this.getObject = function( nodoDom ){
		
		var pos = eval(nodoDom.getAttribute("posicion"));
		
		return this.get(pos);
		
	};
	
	this.distinguirObjetoAnterior = function(){
		//Obtengo el elemento que esta seleccionado
		var nodoDom = dojo.query(".elementoColeccionSeleccionado")[0];
		
		//Elemento a distinguir
		var nodoDistinguir = nodoDom.previousSibling;
		if (nodoDistinguir == undefined){
			//Sino hay siguiente, tomo el primer elemento de la lista 
			nodoDistinguir = this._lista.childNodes[(this._lista.childNodes.length-1)];
		}
		
		this.distinguirObjeto(nodoDistinguir);
	};
	
	this.distinguirObjetoSiguiente = function(){
		//Obtengo el elemento que esta seleccionado
		var nodoDom = dojo.query(".elementoColeccionSeleccionado")[0];
		
		//Elemento a distinguir
		var nodoDistinguir = nodoDom.nextSibling;
		if (nodoDistinguir == undefined){
			//Sino hay siguiente, tomo el primer elemento de la lista 
			nodoDistinguir = this._lista.childNodes[0];
		}
		
		this.distinguirObjeto(nodoDistinguir);
	};
	
	this.distinguirObjeto = function(nodoDOM){
		
		this._desdistinguirObjectos();
		
		dojo.addClass(nodoDOM, "elementoColeccionSeleccionado");
	};
	
	this._desdistinguirObjectos = function(){
		for (var c_i=0; c_i!=this._lista.childNodes.length; c_i++ ){
      		dojo.removeClass(this._lista.childNodes[c_i], "elementoColeccionSeleccionado");
      	};
	};
	
	this.getObjects = function(){
		return this._coleccionActual;
	};
	
}
 
//Funcion publica para reuperar el indice en un arreglo de un objeto ( el ojeto debe implementar el equals o el getLabel()
function indiceDeObjeto(arreglo, objetoContra){
	var objetoCol;
	var i = -1;
	
	//for (var c_i=0; c_i!= arreglo.length; c_i++ ){
	for (c_i in arreglo ){
	
   		objetoCol = arreglo[c_i];
   		
   		//Si tiene declarada la funcion equal, utiliza ese criterio
   		if (objetoContra.equal){
   			
   			if (objetoCol.equal(objetoContra)){
      			i = c_i;
    		};
   			
   		}else{
   			
      		if (objetoCol.getLabel() == objetoContra.getLabel()){
      			i = c_i;
    		};
    		
   		};
   		
   	}
    	
   	return i;
	
};