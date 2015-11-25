'use strict';
/** 
 * Custom Directives Module 
 */
var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
var INTEGER_REGEXP = /^\-?\d+$/;

angular.module('horusApp', [])

	.config(function($provide){
	    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
	        // $delegate is the taOptions we are decorating
	        // register the tool with textAngular
	        taRegisterTool('colourRed', {
	            iconclass: "fa fa-square red",
	            action: function(){
	                this.$editor().wrapSelection('forecolor', 'red');
	            }
	        });
	        // add the button to the default toolbar definition
	        taOptions.toolbar[1].push('colourRed');
	        return taOptions;
	    }]);
	})
;