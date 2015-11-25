/**
 * Cirugias Service
 */
var server = angular.module('services');

server.factory('WSService', function() {
	
	var host = document.URL.substr(document.URL.indexOf("//") + 2, document.URL.indexOf(":8090") - 2);
	var wsURI = 'ws://' + host + '/horus_restfull/';
	
	 // Define a "getter" for getting customer data
	var ws;
    
    return {
    	disconnect: function (URL){
    		
    	},
    	connect: function (URL, connect_cb, onMessage_cb, onClose_cb){
    		
    		if ('WebSocket' in window) {
    			ws = new WebSocket(wsURI+URL);
    		} else if ('MozWebSocket' in window) {
    			ws = new MozWebSocket(wsURI+URL);
    		} else {
    			console.info('Tu navegador no soporta WebSockets');
//    			return;
    		}
    		
    		if (ws){
    			
    			ws.onopen = connect_cb;
    			ws.onmessage = onMessage_cb;
    			ws.onclose = function(){
    				
    				if (ws != null) {
    					ws.close();
    					ws = null;
    				}
    				
    				onClose_cb();
    			};
    		}    		
    		
    	},
    	connectOnlyMessage: function (URL, scope, onMessage_cb){
    		
    		var ws;
    		
    		if ('WebSocket' in window) {
    			ws = new WebSocket(wsURI+URL);
    		} else if ('MozWebSocket' in window) {
    			ws = new MozWebSocket(wsURI+URL);
    		} else {
    			console.info('Tu navegador no soporta WebSockets');
//    			return;
    		}
    		
    		if (ws){
    			
    			ws.onmessage = onMessage_cb;

//    			ws.onopen = function(c) {
//    				console.log(c);
//    			}
    				//scope.$apply();};
    			ws.onclose = function(){
    				
    				if (ws != null) {
    					ws.close();
    					ws = null;
    				}
    				
//    				scope.$apply();
    			};
    		}    		
    		
    		return ws;
    	}
    	
    	
    };
    
});