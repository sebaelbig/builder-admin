'use strict';
/**
 * Login Service
 */
var server = angular.module('services');

server.factory('EmailService', function(HorusService, $rootScope,  $location) { //$cookieStore,
	
	return {
		send: function (params, successFn, errorFn) {
			//login method does not requires the Authorization header to be present
			return HorusService.authPost('/mail/send', params, successFn, errorFn);
		}
	};
});