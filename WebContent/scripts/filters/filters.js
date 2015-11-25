'use strict';
/**
 * Custom Filters Module
 */
angular.module('filters', [])

	.filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}])
	
	//i18n
	.filter('translate', function() {
		return function(text) {
			if (text)
				return i18n.t(text);
			else
				return "i18 - NOT FOUND";
		};
	})
	
	//Add zero's to the beginning of a number
	.filter('twoFrontZeros' , function(){
		return function(number){
			return (number < 10)?(
					(!(parseInt(number/10)))? 
							"00"+number 
							: "0"+number
			): number;
		};
	})

	//iif filter
	.filter('iif', function () {
	   return function(input, trueValue, falseValue) {
	        return input ? trueValue : falseValue;
	   };
	})

	//date format filter
	.filter('dateFormat', function() {
		return function (input, format, addSeconds, addMilliseconds) {
			
			var auxDate = input;
			if (typeof input == "string") {
				auxDate = DateFormatHelper.stringToDateTime(input);
			}
			
			switch (format) {
				case "date":
					return DateFormatHelper.dateToString(auxDate);
					break;
				case "time":
					return DateFormatHelper.timeToString(auxDate, addSeconds, addMilliseconds);
					break;
				case "dateTime":
					return DateFormatHelper.dateTimeToString(auxDate, addSeconds, addMilliseconds);
					break;
				default:
					return "no-format-selected";
					break;
			}
		};	
	})
	
	//replace filter
	.filter('replace', function() {
		return function (input, regexp, regexpmodifiers, replacement) {
			return input.replace(new RegExp(regexp, regexpmodifiers), replacement);
		};	
	})
	
	//Pone un String html como HTML 
	.filter('rawHtml', ['$sce', function($sce){
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	}]
	);
	//servicio filter
//	.filter('servicio', function() {
//		return function (input, servicio) {
//			var plantillasPrivadasFiltradas = [];
//			angular.forEach(input, function(pp) {
//				if(pp.idServicio == servicio.id){
//					plantillasPrivadasFiltradas.push(pp);
//				}
//			});
//			return plantillasPrivadasFiltradas;
//		};	
//	});
;