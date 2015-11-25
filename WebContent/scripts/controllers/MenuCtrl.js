/**
 * Menu Controller
 * 
 */
var MenuCtrl = 	function($scope, $rootScope, $location, $window, HorusService, LoginService) {

	$scope.goTo = function(subMenu){
		$scope.subMenuActual = subMenu.label;
		$rootScope.goTo( subMenu.url );
	};
	
//	$scope.urlActual = "/";
	$scope.showMenu = $rootScope.showMenu;
	
	$scope.subMenuActual = "";
	$scope.menuActual = "";
	
	$scope.accionActual = $rootScope.accionActual;
	$scope.acciones = $rootScope.acciones;
	
	/***** OLD ********************/
	
//	$scope.menuItems = [];
	$scope.loggedIn = $rootScope.loggedIn;	
	$scope.loggedUser = $rootScope.loggedUser;
	
	/**************************************************************************************/
	// WATCH's
	
//	
	$rootScope.$watch('loggedIn', function( newValue, oldValue) {
		$scope.loggedIn = newValue;
		
		if (!$scope.loggedIn)
			$rootScope.goTo("/login");
		 
	});

	$rootScope.$watch('loggedUser', function( newValue, oldValue) {
		
		if ($scope.loggedIn){
			
			$scope.loggedUser = newValue;
			
			$rootScope.procesarRoles();
//			$scope.updateFunciones();
			
//			if ($scope.loggedIn &&
//					$scope.loggedUser && 
//					$scope.loggedUser.roles )
//				$scope.updateFunciones();
			
		}else{
			$scope.loggedUser = {};
		}
	});
	
	$rootScope.$watch("funciones", function() {
		//Si se modifican las funciones,  actualizo el menu
		$scope.menues = $rootScope.menues;
		$scope.subMenues = $rootScope.subMenues;
	});
	
	/**************************************************************************************/

	$scope.menues = [];
	$scope.subMenues = [];
	
	$scope.verMenu = function(menuName) {
		$scope.menuActual = menuName;
		$scope.subMenu = $scope.subMenues[menuName];
	};
	

};