'use strict';
/**
 * Footer Controller
 */
var FooterCtrl = function($scope, $rootScope) {

	$rootScope.messages = [];
	$rootScope.areErrorMessages = false;
	$scope.contact = {};
	
	$scope.credits = "Horus";
	$scope.version = "0.0.14";
	$scope.copyright = "2014";
				
};