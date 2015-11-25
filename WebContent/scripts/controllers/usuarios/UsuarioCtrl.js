'use strict';
/**
 * Home Controller

 $timeout y $upload son para el avatar
 */
var UsuarioCtrl = function($scope, $rootScope, $routeParams, $timeout, $upload, UsuarioService) {

	$scope.registrar = function () {
		$scope.hayMensajes = false;
		UsuarioService.registrar(
			$scope.usuario, 
			function(response) {
				if (response.ok) {
					$scope.usuario = response.data;
					$scope.login();
				}else{
					$scope.hayMensajes = true;
					$scope.mensajes = response.mensajes;
				}
			}, 
			$rootScope.manageError);
	};
	
	$scope.guardar = function () {
		// $scope.currentFunction = $scope.save;
		//Email validation
		//      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		UsuarioService.guardar(
			$scope.usuario, 
			function(response) {
				if (response.ok) {
					$scope.usuario = response.data;

					if ($scope.usuario.tieneAvatar){
						$scope.saveAvatar(0, $scope.usuario._id, function(response) {
							$scope.uploadResult.push(response.data);
							$scope.ver($scope.usuario);
						});
					}

				}
			}, 
			$rootScope.manageError);
	};

	$scope.actualizar = function () {

		$scope.currentFunction = $scope.actualizar;
		UsuarioService.actualizar(
			$scope.usuario, 
			function(response) {
				if (response.ok) {
					$scope.usuario = response.data;
					
					if ($scope.usuario.tieneAvatar){
						$scope.saveAvatar(0, $scope.usuario._id, function(response) {
							$scope.uploadResult.push(response.data);
							$scope.ver($scope.usuario);
						});
					}

				}
			}, 
			$rootScope.manageError);
	};

	$scope.list = function () {

		$scope.currentFunction = $scope.list;
		UsuarioService.listar(function(response) {
			if (response.ok) {

				$scope.usuarios = response.data;

				/*
				$.each(usuarios, function() {
					//var type = {label: i18n.t('parameter.type.' + this.toLowerCase()), value: this};
					$scope.parameterTypes.push(type);
			    });
	*/
			}
		}, function(err){console.error("ERROR AL LISTAR");console.error(err);});
	};

	$scope.eliminarTodo = function() {

		UsuarioService.deleteAll(
			function(succes){
				$scope.list();
			},
			function(err){console.error(err)}
		);

	};

	$scope.hayMensajes = false;
	$scope.mensajes;

	if (!$routeParams.id){
		$scope.usuario = {trabaja: true, dni: 30281651, tieneAvatar: false};
		$scope.list();
	}else{
		UsuarioService.findById(
			$routeParams.id, 
			function(response) {
				if (response.ok) {

					var usuario = response.data;
					$scope.usuario = usuario;
				}
			},
			$rootScope.manageError
		);
	}

	/************************************************************/
	/************************ AVATAR ****************************/
	$scope.avatar = null;
	$scope.onFileSelect = function($files) {

		$scope.selectedFiles = [];
		$scope.progress = [];
		//Si esta inyectado el upload, y tiene cargas pendientes, las aborto
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

		// Recorro los archivos que seleccione, muestra el preview e inicializo el proceso de carga
		for ( var i = 0; i < $files.length; i++) {

			var $file = $files[i];
			//Si mi navegador soporta HTML5, y el archivo seleccionado es una imagen
			if (window.FileReader && $file.type.indexOf('image') > -1) {

				//Uso la API File para leer el archivo y mostrarlo
			  	var fileReader = new FileReader();
		        fileReader.readAsDataURL($files[i]);
		        $scope.setPreview(fileReader, i);
			}

			//Una vez cargadas las preview, 
			$scope.progress[i] = -1;
		}
	};

	$scope.setPreview = function (fileReader, index) {
        fileReader.onload = function(e) {
            $timeout(function() {
            	$scope.dataUrls[index] = e.target.result;
            	$scope.usuario.tieneAvatar = true;
            });
        }
    }
	//Comienza el upload de la imagen
	$scope.saveAvatar = function(index, idUsuario, callback) {

		//Inicializo el progreso
		$scope.progress[index] = 0;
		
		$scope.upload[index] = $upload.upload
		({
			url : URL_BASE+'/avatar',
			method: $scope.httpMethod,
			data : {
				avatar : $scope.avatar,
				usuario_id: idUsuario
			},
			file: $scope.selectedFiles[index],
			fileFormDataName: 'avatar',
			headers: {'Content-Type': $scope.selectedFiles[index].type}
		})
		.then ( //success, error, progress
			callback, 
			function(err) {
				console.error(err);
			}, 
			function(evt) {
				$scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			}
		);

	};
	/************************************************************/
	var URL_BASE = "/usuarios";
	/************************************************************/
	//Login
	$scope.login = function() {
		UsuarioService.goTo("/login");
	};
	//Crear
	$scope.crear = function(url) {
		UsuarioService.goTo(URL_BASE+"/crear");
	};
	//Update
	$scope.editar = function(u) {
		UsuarioService.goTo(URL_BASE+"/editar/"+u._id);
	};
	//View
	$scope.ver = function(u) {
		UsuarioService.goTo(URL_BASE+"/ver/"+u._id);
	};
	//Cancelar
	$scope.cancelar = function() {
		UsuarioService.goTo(URL_BASE);
	};
	//Listar
	$scope.listar = function() {
		UsuarioService.goTo(URL_BASE);
	};
	/************************************************************/

};