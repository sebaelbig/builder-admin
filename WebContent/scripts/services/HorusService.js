var server = angular.module('services', []);
/**
 * Main Horus Service Facade
 */

server.factory('HorusService', function($http, $rootScope, $location, $route, $window){

//    var host = "127.0.0.1";
	var host = document.URL.substr(document.URL.indexOf("//") + 2, document.URL.indexOf(":8080") - 7);
	var horusServiceUrl = "http://" + 'localhost' + ":8090/builder-admin-backend/api";
	
    //Si el usuario esta en las cookies, entonces lo recupero
    var loggedUser = $window.sessionStorage.getItem("loggedUser");
    if (loggedUser){

        $rootScope.loggedUser = loggedUser;
        $rootScope.loggedIn = true;
        // $rootScope.permissions = $rootScope.generatePermissions($rootScope.loggedUser);
    }

    return {
        goTo: function(newUrl) {
            if (newUrl == $location.path()) {
                $route.reload();
            } else {
                $location.path(newUrl);
            }
        },
        getURLHost: function(){
        	return horusServiceUrl;
        },
    	//File
        fileUpload: function(url, params , successFn, errorFn) {
            $http({method: 'POST', url: horusServiceUrl+url, data: params}).
                success(successFn).
                error(errorFn); 
        },
        //Save
        post: function(url, params , successFn, errorFn) {
        	$http({method: 'POST', url: horusServiceUrl+url, data: params,
        		headers: {
        			'Content-Type': 'application/json;charset=utf8',
        			'Accept':'application/json;charset=utf8'}}).
        			success(successFn).
        			error(errorFn); 
        },
        //Get
        get: function(url, params , successFn, errorFn) {
        	$http({method: 'GET', url: horusServiceUrl+url, data: params,
        		headers: {
        			'Content-Type': 'application/json;charset=utf8',
        			'Accept':'application/json;charset=utf8'}}).
        			success(successFn).
        			error(errorFn); 
        },
        //Get PDFs
        pdfGet: function(url , successFn, errorFn) {
            $http({method: 'GET', 
            	url: horusServiceUrl+url,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Accept':'application/pdf'}}).
                success(successFn).
                error(errorFn); 
        },
        //Get sin validacion
        httpGet: function(url, successFn, errorFn) {
            $http({
            		method: 'GET', 
            		url: horusServiceUrl+url,
            		headers: {'Accept':'text/plain'}
            	 }).
            	 success(successFn).
            	 error(errorFn); 
        },
      //Externo
        extGet: function(url, successFn, errorFn) {
            $http({
            		method: 'GET', 
            		url: url,
            		headers: {'Accept':'text/plain'}
            	 }).
            	 success(successFn).
            	 error(errorFn); 
        },
//        //Update
//    	put: function(url, params , successFn, errorFn) {
//        	$http({method: 'PUT', url: horusServiceUrl+url, data: params,
//        		headers: {
//        			'Content-Type': 'application/json;charset=utf8',
//        			'Accept':'application/json;charset=utf8'}}).
//        		success(successFn).
//        		error(errorFn);	
//        },
//        //Delete
    	authDelete: function(url, params , successFn, errorFn) {
            $http({method: 'DELETE', url: horusServiceUrl+url, data: params,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Accept':'application/json;charset=utf8',
                    'Authorization': $rootScope.loggedUser.token}}).
                success(successFn).
                error(errorFn);    
        },
//        //List / Search
//        get: function(url, successFn, errorFn) {
//        	$http({method: 'GET', url: horusServiceUrl+url ,
//        		headers: {
//        			'Content-Type': 'application/json;charset=utf8',
//        			'Accept':'application/json;charset=utf8'}}).
//        		success(successFn).
//        		error(errorFn);	
//        },

        authPost: function(url, params , successFn, errorFn) {
            $http({method: 'POST', url: horusServiceUrl+url, data: params,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Accept':'application/json;charset=utf8',
                    'Authorization': $rootScope.loggedUser.token}}).
                success(successFn).
                error(errorFn);    
        },

        authGet: function(url, successFn, errorFn) {
            $http({method: 'GET', url: horusServiceUrl+url,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Accept':'application/json;charset=utf8',
                    'Authorization': $rootScope.loggedUser.token}}).
                success(successFn).
                error(errorFn);    
        },

        authPut: function(url, params , successFn, errorFn) {
            $http({method: 'PUT', url: horusServiceUrl+url, data: params,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Accept':'application/json;charset=utf8',
                    'Authorization': $rootScope.loggedUser.token}}).
                success(successFn).
                error(errorFn);    
        } 

    };
});