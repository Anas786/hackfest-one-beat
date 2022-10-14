(function() {
    'use strict';

    angular
        .module('app.controllers')
		.controller("mainController", ["$scope", "$location", mainController])
		
		function mainController($scope, $location) {
            return $scope.isSpecificPage = function() {
                var path;
                return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/signin", "/pages/reset_password", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/forgot", "/pages/lock-screen"], path)
            },
            $scope.main = {brand:"SynAppTicS"}
        }

})();
