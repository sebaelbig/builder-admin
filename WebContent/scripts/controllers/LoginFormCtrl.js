/**
 * Login Controller
 */
var LoginFormCtrl = function($scope, $element) {

	$scope.userCredentials = {};

	var registrationForm = $($element);

	$scope.isInvalid = function() {
		return !registrationForm.form('validate form');
	};

}