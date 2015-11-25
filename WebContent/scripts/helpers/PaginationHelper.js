/**
 * Adds pagination capability to a scope in a certain namespace.
 * 
 * Requires that the scopes has the 'list' and 'search' methods defined.
 */
var PaginationHelper = function(scope, nameSpace, fetchTotal) {
	
	//creates the namespace object in the scope
	scope[nameSpace] = {};
	
	//assumes there are 'list' and 'search' functions in the scope
	scope[nameSpace].name = nameSpace;
	scope[nameSpace].page = 1;
	scope[nameSpace].total = 0;
	scope[nameSpace].pageTotal = 0;
	scope[nameSpace].itemsPerPage = 10;
	scope[nameSpace].currentFunction = scope.list;
	scope[nameSpace].fetchTotal = fetchTotal;
	
	scope._list = scope.list;
	scope._search = scope.search;
	
	//we wrap the list function in a paginated list function
	scope.list = function (paginationObject) {
		scope[nameSpace].currentFunction = scope.list;
		if (!paginationObject) {
			paginationObject = {page:1, fetchTotal: fetchTotal};
		}
		scope._list(paginationObject);
	};
	
	//we wrap the list function in a paginated list function
	scope.search = function (paginationObject) {
		scope[nameSpace].currentFunction = scope.search;
		if (!paginationObject) {
			paginationObject = {page:1, fetchTotal: fetchTotal};
		}
		scope._search(paginationObject);
	};
	
	return {
		extendCallback: function(responseObject) {
			scope[nameSpace].page = responseObject.page;
			scope[nameSpace].total = responseObject.totalItems;
			scope[nameSpace].pageTotal = responseObject.items.length;
			scope[nameSpace].itemsPerPage = responseObject.itemsPerPage;
		}
	};
};