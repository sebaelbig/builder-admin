'use strict';
/** 
 * Custom Directives Module 
 */
var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
var INTEGER_REGEXP = /^\-?\d+$/;

angular.module('directives', [])

	.directive('ngEnter', function() {
		
	    return function(scope, elm, attrs) {
	        elm.bind('keypress', function(e) {
	            if (e.charCode === 13) scope.$apply(attrs.ngEnter);
	            else if (e.keyCode === 13) scope.$apply(attrs.ngEnter);
	        });
	    };
    })
    
    .directive('ngPaginator', function() {
	    return {
    		templateUrl: "views/layout/pagination.html",
    		replace: true,
    		scope: {
    			pagElements: "=elements",
    			pagNameSpace: "=nameSpace"
    		},
    		link: function(scope, elm, attrs) {
    			scope.pagNameSpace.pages = 5;
    			scope.pagNameSpace.inputPage = scope.pagNameSpace.page;
    			
    			scope.$watch(function(){return scope.pagNameSpace.inputPage;}, function() {
    				var min = 20;
    				var valString = "" + scope.pagNameSpace.inputPage;
    				var newWidth = (valString.length + 1) * 8;
    				newWidth = newWidth < min ? min : newWidth;
    				$("#" + scope.pagNameSpace.name + 'InputId').css("width", newWidth + "px");
    			});
    			
    			scope.$watch(function(){return scope.pagNameSpace.page;}, function() {
    				scope.pagNameSpace.inputPage = scope.pagNameSpace.page;
    			});
    			
    			scope.$watch(function(){return scope.pagNameSpace.total;}, function() {
    				var pages;
    				pages = Math.ceil(scope.pagNameSpace.total / scope.pagNameSpace.itemsPerPage);
    				if (isNaN(pages)) {
    					pages = 5; //TODO: parametize
    				}
    				scope.pagNameSpace.pages = pages;
    			});
    			
    			scope.goToPage = function(pageNumber) {
    				scope.pagNameSpace.currentFunction({page: pageNumber, fetchTotal: scope.pagNameSpace.fetchTotal});
    			};
    			
    			scope.next = function() {
    				scope.goToPage(scope.pagNameSpace.page + 1);
    			};
    			
    			scope.previous = function() {
    				scope.goToPage(scope.pagNameSpace.page - 1);
    			};
    			
    			scope.first = function() {
    				scope.goToPage(1);
    			};
    			
    			scope.last = function() {
    				scope.goToPage(scope.pagNameSpace.pages);
    			};
    			
    			scope.enterPage = function() {
    				scope.goToPage(scope.pagNameSpace.inputPage);
    			};
    			
    			scope.blurInput = function() {
    				scope.pagNameSpace.inputPage = scope.pagNameSpace.page;
    			};
	    	}
    	};
    })
    
    .directive('currencyInput', function() {
	    return {
	        restrict: 'A',
	        scope: {
	            field: '='
	        },
	        replace: true,
	        template: '<input type="text" ng-model="field" ng-class="{positive : (field >0), negative: (field< 0) }"></input>',
	        
	        link: function(scope, element, attrs) {
	
	            $(element).bind('keyup', function(e) {
	                var input = element.find('input');
	                var inputVal = input.val();
	
	                //clearing left side zeros
	                while (scope.field.charAt(0) == '0') {
	                    scope.field = scope.field.substr(1);
	                }
	
	                scope.field = scope.field.replace(/[^\d.\',']/g, '');
	
	                var point = scope.field.indexOf(".");
	                if (point >= 0) {
	                    scope.field = scope.field.slice(0, point + 3);
	                }
	
	                var decimalSplit = scope.field.split(".");
	                var intPart = decimalSplit[0];
	                var decPart = decimalSplit[1];
	
	                intPart = intPart.replace(/[^\d]/g, '');
	                if (intPart.length > 3) {
	                    var intDiv = Math.floor(intPart.length / 3);
	                    while (intDiv > 0) {
	                        var lastComma = intPart.indexOf(",");
	                        if (lastComma < 0) {
	                            lastComma = intPart.length;
	                        }
	
	                        if (lastComma - 3 > 0) {
	                            intPart = intPart.splice(lastComma - 3, 0, ",");
	                        }
	                        intDiv--;
	                    }
	                }
	
	                if (decPart === undefined) {
	                    decPart = "";
	                }
	                else {
	                    decPart = "." + decPart;
	                }
	                var res = intPart + decPart;
	
	                scope.$apply(function() {scope.field = res});
	
	            });
	
	        }
	    };
	})
	
	.directive('ngDatepicker', function($parse) {
		return function(scope, element, attrs) {
			element.datepicker({
				inline: true,
				dateFormat: 'dd/mm/yy',
				onSelect: function(dateText) {
//				//Ejecuta la funcion que se establece en la directiva
					scope[attrs.ngDatepicker](dateText);
				}
			}).datepicker('widget').wrap('<div class="ll-skin-latoja"/>');
		};
	})
	
  .directive('removeLater', [ '$timeout', function($timeout) {
	  var def = {
		  restrict : 'A',
		  link : function(scope, element, attrs) {
			  if (scope.$last === true) {				  
				  $timeout(function() {
					  $(".removeLater").each(function(idx, elm) {
						  $(elm).parent().append($(elm).children());
					  });
					  $(".removeLater").remove();
					  
					  $(".divider").each(function(idx, elm) {
						  var next = $(elm).next();
						  next = next.size() == 0 ? null : next.get(0);
						  
						  if (next == null || $(next).hasClass("divider")) {
							  $(elm).remove();
						  }
					  });					  
				  }, 0);
			  }
		  }
	  };
	  return def;
  }])
  .directive('ngBlur', function() {
		return function( scope, elem, attrs ) {
		  elem.bind('blur', function() {
			  scope.$apply(attrs.ngBlur);
		  });
	  };
  })
  .directive("contenteditable", function() {
	  return {
		    restrict: "A",
		    require: "ngModel",
		    link: function(scope, element, attrs, ngModel) {

		      function read() {
		        ngModel.$setViewValue(element.html());
		      }

		      ngModel.$render = function() {
		        element.html(ngModel.$viewValue || "");
		      };

		      element.bind("blur keyup change", function() {
		        scope.$apply(read);
		      });
		    }
	  };
  })
  .directive('smartFloat', function() {
  		return {
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
			      ctrl.$parsers.unshift(function(viewValue) {
			        if (FLOAT_REGEXP.test(viewValue)) {
			          ctrl.$setValidity('float', true);
			          return parseFloat(viewValue.replace(',', '.'));
			        } else {
			          ctrl.$setValidity('float', false);
			          return undefined;
			        }
			      });
		    }
  		};
	})
//	.directive('smartFloat', function() {
//  		return {
//		    require: 'ngModel',
//		    link: function(scope, elm, attrs, ctrl) {
//		      ctrl.$parsers.unshift(function(viewValue) {
//		        if (INTEGER_REGEXP.test(viewValue)) {
//		          // it is valid
//		          ctrl.$setValidity('integer', true);
//		          return viewValue;
//		        } else {
//		          // it is invalid, return undefined (no model update)
//		          ctrl.$setValidity('integer', false);
//		          return undefined;
//		        }
//		      });
//		    }
//	  	};
//	})
	.directive('selectOnClick', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.on('click', function () {
					this.select();
				});
			}
		};
	})
	
	.directive("horusEditorModelPedidos", [ '$timeout', '$parse', function($timeout, $parse) {
		
		
		var link = function(scope, element, attr, ctrl) {
			
			$timeout(function() {
//				
				//Instancio el editor
				CKEDITOR.replace( 'editor1',{
					disableNativeSpellChecker: false
				});
				
				scope.editorHTML = CKEDITOR.instances.editor1;
//				
				//Llamo a una funcion del scope que refresque el texto del editor ya que está ahora disponible
				if (scope.refreshTextoCKEditor)
					scope.refreshTextoCKEditor();
				
			},500);
		};
		  
		return {
			restrict: 'A',
			link: link
		};
		
	}])

	.directive("horusEditorModel", [ '$timeout', '$parse', function($timeout, $parse) {
		//require: '?ngModel';
		var link = function($scope, elm, attr, ngModel) {
			
			$timeout(function() {
		/*return {
	        require: '?ngModel',
	        link: function ($scope, elm, attr, ngModel) {*/

	            var ck = CKEDITOR.replace(elm[0]);
	            
	            /*ck.on('pasteState', function () {
	                $scope.$apply(function () {
	                    ngModel.$setViewValue(ck.getData());
	                });
	            });*/
	           /* ck.on('dataReady', updateModel);
	            function updateModel() {
	                $scope.$apply(function() {
	                    if ( ck.getData().length ) {
	                        ngModel.$setViewValue(ck.getData());
	                    }
	                });
	            };*/

	            /*ngModel.$render = function (value) {
	                ck.setData(ngModel.$modelValue);
	            };*/
	           // scope.editorHTML = CKEDITOR.instances[elm[0]];
//				
				//Llamo a una funcion del scope que refresque el texto del editor ya que está ahora disponible
				if ($scope.refreshTextoCKEditor)
					$scope.refreshTextoCKEditor();
	    	},500);
		};
		  
		return {
			restrict: 'A',
			link: link
		};
		
	}])
;