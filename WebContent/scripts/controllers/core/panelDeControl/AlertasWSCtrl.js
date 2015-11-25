'use strict';
/**
 * Email Controller
 */
var AlertasWSCtrl = function($scope, WSService) {

	var _CANAL_ALERTAS = "alertas";
	
	$scope.conectado = false;
	$scope.conectando = false;
	
	$scope.alertas = [];
	
	$scope.onClose = function() {
		$scope.conectado = false;
		$scope.conectando = false;
		
		$scope.$apply();
	};
	
	$scope.onConnect = function(){  
		console.log("Conexion exitosa!");
		
		$scope.conectando = false;
		$scope.conectado = true;
		
		$scope.$apply();
	};
	
	$scope.onMessage = function(message) {
    	console.log("Alerta recibida!");
    	
    	var str_data = JSON.parse(message.data);
        console.log(str_data);  
        
        var respuesta = JSON.parse(str_data);
		
        $scope.alertas.push(respuesta.Alerta);
        
        $scope.$apply();
        
    };
    
	$scope.conectar = function(){
		
		$scope.conectando = true;
		
		WSService.connect(_CANAL_ALERTAS, $scope.onConnect, $scope.onMessage, $scope.onClose);
	};

};