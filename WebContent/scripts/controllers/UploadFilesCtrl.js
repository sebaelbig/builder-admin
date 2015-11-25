
//function($scope, $rootScope, $upload, HorusService) {

//HorusService
var UploadFilesCtrl = [ '$scope', '$http', '$timeout', '$upload',  function($scope, $http, $timeout, $upload) {

    $scope.goTo = function(url) {
        console.info('Llendo a :'+url)
        //HorusService.goTo(url);
    };

    $scope.readablizeBytes = function (bytes) {
		var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    };

    $scope.secondsToStr = function  (temp) {
      function numberEnding (number) {
        return (number > 1) ? 's' : '';
      }
      var years = Math.floor(temp / 31536000);
      if (years) {
        return years + ' year' + numberEnding(years);
      }
      var days = Math.floor((temp %= 31536000) / 86400);
      if (days) {
        return days + ' day' + numberEnding(days);
      }
      var hours = Math.floor((temp %= 86400) / 3600);
      if (hours) {
        return hours + ' hour' + numberEnding(hours);
      }
      var minutes = Math.floor((temp %= 3600) / 60);
      if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
      }
      var seconds = temp % 60;
      return seconds + ' second' + numberEnding(seconds);
    };
    /*
    $scope.onFileSelect = function($files) {
	    
	    //$files: an array of files selected, each file has name, size, and type.
	    
	    for (var i = 0; i < $files.length; i++) {
      		var file = $files[i];
      		$scope.upload = $upload.upload({

		        url: '/upload', //upload.php script, node.js route, or servlet url
		        method: POST, //or PUT,
		        // headers: {'headerKey': 'headerValue'},
		        // withCredentials: true,
		        data: {myObj: $scope.myModelObj},
		        file: file,
		        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
		        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
		        //fileFormDataName: miArchivo, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
		        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
		        //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
/*
	      	}).progress(function(evt) {
	        	console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	      	}).success(function(data, status, headers, config) {
	        	// file is uploaded successfully
	        	console.log(data);
	      	});
	      	//.error(...)
	      	//.then(success, error, progress); 
	    }

	    // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers. 
	};
	*/
	$scope.fileReaderSupported = window.FileReader != null;
	$scope.uploadRightAway = true;
	$scope.changeAngularVersion = function() {
		window.location.hash = $scope.angularVersion;
		window.location.reload(true);
	};
	$scope.hasUploader = function(index) {
		return $scope.upload[index] != null;
	};
	$scope.abort = function(index) {
		$scope.upload[index].abort(); 
		$scope.upload[index] = null;
	};
	$scope.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.2.0';
	$scope.onFileSelect = function($files) {
		$scope.selectedFiles = [];
		$scope.progress = [];
		if ($scope.upload && $scope.upload.length > 0) {
			for (var i = 0; i < $scope.upload.length; i++) {
				if ($scope.upload[i] != null) {
					$scope.upload[i].abort();
				}
			}
		}
		$scope.upload = [];
		$scope.uploadResult = [];
		$scope.selectedFiles = $files;
		$scope.dataUrls = [];
		for ( var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			if (window.FileReader && $file.type.indexOf('image') > -1) {
			  	var fileReader = new FileReader();
		        fileReader.readAsDataURL($files[i]);
		        function setPreview(fileReader, index) {
		            fileReader.onload = function(e) {
		                $timeout(function() {
		                	$scope.dataUrls[index] = e.target.result;
		                });
		            }
		        }
		        setPreview(fileReader, i);
			}
			$scope.progress[i] = -1;
			if ($scope.uploadRightAway) {
				$scope.start(i);
			}
		}
	};
	
	$scope.start = function(index) {
		$scope.progress[index] = 0;
		if ($scope.howToSend == 1) {
			$scope.upload[index] = $upload.upload({
				url : 'upload',
				method: $scope.httpMethod,
				headers: {'myHeaderKey': 'myHeaderVal'},
				data : {
					myModel : $scope.myModel
				},
				/* formDataAppender: function(fd, key, val) {
					if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
				}, */
				file: $scope.selectedFiles[index],
				fileFormDataName: 'myModel'
			}).then(function(response) {
				$scope.uploadResult.push(response.data);
			}, null, function(evt) {
				$scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
			});
		} else {
			var fileReader = new FileReader();
            fileReader.onload = function(e) {
		        $scope.upload[index] = $upload.http({
		        	url: 'upload',
					headers: {'Content-Type': $scope.selectedFiles[index].type},
					data: e.target.result
				}).then(function(response) {
					$scope.uploadResult.push(response.data);
				}, null, function(evt) {
					// Math.min is to fix IE which reports 200% sometimes
					$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
            }
	        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);

		}
	};
}];