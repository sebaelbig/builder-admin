'use strict';
/**
 * Email Controller
 */
var EmailCtrl = function($scope, $rootScope, EmailService, HorusService) {

	$scope.email = {};

	$scope.home = function () {
		HorusService.goTo("/");
	};

	$scope.enviar = function () {
		EmailService.send($scope.email);
	};
};