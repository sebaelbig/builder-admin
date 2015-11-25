'use strict';
/**
 * Home Controller
 */
var MapCtrl = function($scope, $rootScope, HorusService, FotoService) {
	
    $scope.fotos=[];
    $scope.foto={};
    $scope.listar = function(){

        //$scope.currentFunction = $scope.list;
        FotoService.listar(function(response) {
            if (response.ok) {
                $scope.fotos = response.data;

                var f, myLatlng, marca;
                for (var i = $scope.fotos.length - 1; i >= 0; i--) {
                    
                    f = $scope.fotos[i];
                    f.urlPublica = $scope.getUrlFoto(f);

                    myLatlng = $scope.getLatLng(f);

                    marca = new google.maps.Marker({
                      position: myLatlng,
                      animation: google.maps.Animation.DROP,
                      foto: f,
                      map: $scope.getGMap(),
                      showWindow: true
                    });
                    
                    google.maps.event.addListener(marca, 'click', function() {
                        $scope.onMarkerClicked(marca);
                    });

                };
            }
        }, function(err){console.error("ERROR AL LISTAR");console.error(err);});

    };

    $scope.getUrlFoto = function(f){
        return "uploads/fotos/"+f.autor._id+"/galeria/"+f.url;
    };
    $scope.getLatLng = function (foto) {
        return new google.maps.LatLng(foto.latitude, foto.longitude);
    };
    
	$scope.onMarkerClicked = function (marker, mapModel) {
        $scope.foto = marker.foto;
        $scope.$apply();
    };

    $scope.mapa = {
        center: { //La Plata
            latitude: -34.9337,
            longitude: -57.9581
        },
        zoom: 13,
        events: {
            click: $scope.clickOnMap
        },
        bounds: {
            northeast: {latitude:-34.8915, longitude:-57.8920},
            southwest: {latitude:-34.9759, longitude:-58.0242}
        },
        draggable: false,
        control: $scope
    }; //End of extends	

    $scope.listar();
};