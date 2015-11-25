'use strict';
/**
 * Login Service
 */
var server = angular.module('services');

server.factory('UploadService', function(HorusService, $rootScope,  $location) { //$cookieStore,
	
	return {
		uploadFile: function (params, successFn, errorFn) {
			//login method does not requires the Authorization header to be present
			return HorusService.authPost('/uploadFile', params, successFn, errorFn);
		}
	};
});