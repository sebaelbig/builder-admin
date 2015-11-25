'use strict';
/**
 * Parameter Controller
 */
var ParameterCtrl = function($scope, $rootScope, ParameterService) {

	$scope.parameter = {};
	$scope.parameters = [];
	$scope.editing = false;
	$rootScope.messages = [];
	$rootScope.areErrorMessages = false;
	
	$scope.parameterTypes = [];
	
	var paginationHelper;
	
	ParameterService.listTypes(function(response) {
		if (response.ok) {
			var types = JSON.parse(response.data);
			$.each(types, function() {
				var type = {label: i18n.t('parameter.type.' + this.toLowerCase()), value: this};
				$scope.parameterTypes.push(type);
		    });
		}
	}, $rootScope.manageError);

	$scope.create = function() {
		ParameterService.create($scope.parameter, function(response) {
			if (response.ok) {
				// parameter successfully created
				var par = JSON.parse(response.data);

				$scope.parameters.push(par);
			}
		}, $scope.errorManager);
	};

	$scope.list = function(pagination) {
		$scope.currentFunction = $scope.list;
		ParameterService.list(pagination, function(response) {
			if (response.ok) {
				var responseObject = JSON.parse(response.data);
				
				if (responseObject.page) {
					$scope.parameters = responseObject.items;
					paginationHelper.extendCallback(responseObject);
				} else {
					$scope.parameters = responseObject;
				}	
			}
		}, $rootScope.manageError);
	};

	$scope.edit = function(parameter) {
		$scope.editing = true;
		$scope.parameter = $rootScope.snapshot(parameter);
		$scope.parameters.splice($scope.parameters.indexOf(parameter), 1);
	};

	$scope.modify = function() {
		ParameterService.modify($scope.parameter.unSnapshot(), function(response) {
			if (response.ok) {
				// parameter successfully edited
				var par = JSON.parse(response.data);

				$scope.parameters.push(par);
				$scope.editing = false;
			}
		}, $rootScope.manageError);
	};

	$scope.clean = function() {
		$scope.parameter = {};
	};

	$scope.cancel = function() {
		$scope.parameters.push($scope.parameter.rollback());
		$scope.parameter = null;
		$scope.editing = false;
	};

	$scope.remove = function(parameter) {
		ParameterService.remove(parameter, function(response) {
			if (response.ok) {
				$scope.parameters.splice($scope.parameters.indexOf(parameter), 1);
			}
		}, $rootScope.manageError);
	};

	$scope.search = function(pagination) {
		var data;
		
		if (pagination) {
			pagination.vo = $scope.parameter;
			data = pagination;
		} else {
			data = $scope.parameter;
		}
		
		ParameterService.search(data, function(response) {
			if (response.ok) {
				var responseObject = JSON.parse(response.data);
				
				if (responseObject.page) {
					$scope.parameters = responseObject.items;
					paginationHelper.extendCallback(responseObject);
				} else {
					$scope.parameters = responseObject;
				}
			}
		}, $rootScope.manageError);
	};
	
	//add pagination capability
	paginationHelper = PaginationHelper($scope, 'parameterNameSpace', true);
	
	if ($rootScope.canAccess('/configuration/parameter:listParameter')) {
		$scope.list();
	}
};