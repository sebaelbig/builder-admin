'use strict';
/**
 * Login Service
 */
var server = angular.module('services');

server.factory('LoginService', function(HorusService, $rootScope, $window, $location) { 
	
	function _logout() {
		$rootScope.permissions = [];
		$rootScope.loggedUser = null;

		$window.sessionStorage.remove("loggedUser");
		$window.sessionStorage.remove("userCredentials");

		//we redirect to the /login
		$rootScope.unDim();
		$location.path("/login");
	};

	return {
		login: function (params, successFn, errorFn) {
			//login method does not requires the Authorization header to be present
			return HorusService.post('/login/doLogin', params, successFn, errorFn);
		},
		secureLogin: function (params, successFn, errorFn) {
			//login method does not requires the Authorization header to be present
			return HorusService.post('/login/doSecureLogin', params, successFn, errorFn);
		},
		ping: function (params, successFn, errorFn) {
			//login method does not requires the Authorization header to be present
			return HorusService.post('/ping', {user:'Llego'}, successFn, errorFn);
		},
		logout: function (params, successFn, errorFn) {
			//logout
			return HorusService.authPost('/seguro/logout', params, successFn, errorFn);
		},
		changePassword: function (params, successFn, errorFn) {
			return HorusService.authPost('/seguro/login/changePassword', params, successFn, errorFn);
		}
	};
});