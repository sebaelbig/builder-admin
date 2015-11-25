/**
 * User Service
 */
var server = angular.module('services');

server.factory('UsuarioLDAPService', function(HorusService) {
	
	var fx_shared; 
	
	var URL = "/usuariosLDAP/seguro";
	
	return {
		username: null,
		goTo: HorusService.goTo,
//		buscar: function (params, successFn, errorFn) {
//			return HorusService.authGet('/usuariosLDAP/seguro/'+JSON.stringify(params), successFn, errorFn);
//		},
		listar: function (usuario, successFn, errorFn) {
			return HorusService.authGet(URL+'/listar/'+usuario, successFn, errorFn);
		},
		findById: function (id, successFn, errorFn) {
			return HorusService.authGet(URL+'/findById/'+id, successFn, errorFn);
		},
//		findById: function (id, successFn, errorFn) {
//			return HorusService.authGet('/usuariosLDAP/seguro/'+id, successFn, errorFn);
//		},
//		getRolesDeUsuario:function (usuario, successFn, errorFn) {
//			return HorusService.authPost(URL+'/getRolesDeUsuario', usuario, successFn, errorFn);
//		},
		getUsuarioPorUsername:function ( successFn, errorFn) {
			return HorusService.authPost(URL+'/getUsuarioPorUsername', this.username, successFn, errorFn);
		},
		getUsuarioRolesPorUsername:function ( successFn, errorFn) {
			return HorusService.authPost(URL+'/getUsuarioRolesPorUsername', this.username, successFn, errorFn);
		},
		setRolesDeUsuario:function (usuario, successFn, errorFn) {
			return HorusService.authPost(URL+'/setRolesDeUsuario', usuario, successFn, errorFn);
		},
		setFxAsignarRol: function(fx){
			fx_shared = fx;
		},
		getFxAsignarRol: function(){
			return fx_shared;
		},
		modificarFirma: function (params, successFn, errorFn) {
			return HorusService.authPut(URL+'/modificarFirma',params, successFn, errorFn);
		},
		crearFirma: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/crearFirma',params, successFn, errorFn);
		},
		recuperarFirma: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/recuperarFirma',params, successFn, errorFn);
		},
		recuperarFirmaDeUsuario: function (params, successFn, errorFn) {
			return HorusService.authGet(URL+'/recuperarFirmaDeUsuario/'+params.username, successFn, errorFn);
		},
		recuperarFirmaPorIdRol: function (params, successFn, errorFn) {
			return HorusService.authPost(URL+'/recuperarFirmaPorIdRol', params, successFn, errorFn);
		},
		

	};
});