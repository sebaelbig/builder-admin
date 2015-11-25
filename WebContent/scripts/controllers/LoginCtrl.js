/**
 * Login Controller
 */
var LoginCtrl = function($scope, $rootScope, $route, LoginService, $location, $window, HorusService) {

	$scope.loading = false;
	
	$scope.userCredentials;
	$scope.rememberMe = null;

	$scope.hayMensajes = false;
	$scope.mensaje;
	
	$scope.processMessages = function(response) {
		$rootScope.mensaje = response.mensaje;
		$rootScope.hayMensajes = !response.ok;
	};
	
//	$scope.registrar = function() {
//		HorusService.goTo('/usuarios/registrar');
//	};

	$scope.login = function() {
		// $rootScope.dim();
		$scope.loading = true;
		$scope.hayMensajes = false;
		
		LoginService.login(
			$scope.userCredentials,
			function (response) {
				if (response.ok) {

					$rootScope.loggedUser = response.data;
					$rootScope.loggedIn = true;
					$scope.loggedIn = true;
	
					$window.sessionStorage.setItem("loggedUser", JSON.stringify($rootScope.loggedUser));
					$rootScope.permissions = $rootScope.generatePermissions($rootScope.loggedUser);
					
					if ($scope.rememberMe) {
						$window.sessionStorage.setItem("userCredentials", JSON.stringify($scope.userCredentials));
					} else {
						$window.sessionStorage.removeItem("userCredentials");
					}
					
					$rootScope.procesarRoles();
					//HorusService.goTo("/");
					$rootScope.horusDispacher();
					$scope.loading = false;

				}else{
					$scope.mensaje = response.mensaje;
					$scope.hayMensajes = true;
				}
//				 $rootScope.unDim();
				$scope.loading = false;
			}, 
			function (data, status, headers, config) {
		        // Erase the token if the user fails to log in
		        delete $window.sessionStorage.removeItem("token");

		        $scope.hayMensajes = true;
		        $rootScope.mensaje = "Error al autenticar, usuario o contraseña incorrecta.";
		        $scope.loading = false;
		        // Handle login errors here
				$rootScope.manejarExcepcionRemota(config);
		    });
	};
	
	$scope.show_login = false;
	$rootScope.$watch('loggedIn', function( newValue, oldValue) {
		$scope.show_login = !$rootScope.loggedIn;
	});

	$scope.enviarMail = function(){
		
		HorusService.testMail(
				function (resp){
					console.log(resp);
				}
		);
	};
	
};