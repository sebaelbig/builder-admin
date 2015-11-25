'use strict';
/**
 * Home Controller
 */
var HomeCtrl = function($scope, $rootScope, HorusService, $window) {
	
	$scope.redirectForwardh=function(){
		if($window.sessionStorage.lastURL=="/cirugias/reservas" || $window.sessionStorage.lastURL=="/turnos/reservasProfesional"){
			$window.history.forward();	
		}
	};
	
	//Si viene desde las consultas de cirugias o turnos, hace un forward para que no pueda volver para atrás al home
	if(($window.sessionStorage.lastURL=="/cirugias/reservas" || $window.sessionStorage.lastURL=="/turnos/reservasProfesional")&&($window.sessionStorage.showMenu=="false")){
		$rootScope.redirectForward();
	};
	
	$scope.acciones = $rootScope.acciones;
	
	$scope.ir = function(accion){
		console.log("Ir a :"+accion);
		HorusService.goTo(accion);
	};
	
	$scope.orightml = '<p></p>';
	$scope.htmlcontent = $scope.orightml;
	$scope.disabled = false;
	
	
};