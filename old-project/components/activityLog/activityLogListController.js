(function() {
    'use strict';

    angular
        .module('app.userList')
		.controller("activityLogListController", ["$scope", "$http", "$rootScope", activityLogListController])
		
    function activityLogListController($scope, $http, $rootScope) {
        var baseServiceUrl = $rootScope.globals.serviceUrl;
        var serviceUrl = baseServiceUrl + 'activity-logs';
        
//        Pagination configuration
        $scope.pagesToShow = 5;
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.recordsPerPage = 10;
        
        $scope.multipleActions = {};
        $scope.multipleActions.selectedAction = [];
        $scope.actionsMulti = [];
        
        $scope.orderby = 'created_on';
        $scope.sort = 'desc'
        
        $scope.createdOnClass = 'fa fa-sort-desc';
        $scope.userNameClass = $scope.actionClass = '';
        var prevSortField = 'created_on';
        
        $scope.pageChanged = function() {
            $scope.searchActivities();
        };
        
        
        $scope.formData = {searchBy: "all"};
        $scope.showSearchBtn = $scope.showNameField = $scope.showActionsField = false;
        $scope.nameFieldLabel = "";
        
        $http.get(baseServiceUrl+'log-actions').success(function(data, status, headers, config) { 
            $scope.actionsMulti = data.data.records;
        });
        
        
        $scope.showFields = function(){
            var nameOptionsArr = ["u_name", "u_ip"];
            if(nameOptionsArr.indexOf($scope.formData.searchBy) > -1){ 
                $scope.showSearchBtn = true;
                $scope.showNameField = true;
                $scope.showActionsField = false;
                if($scope.formData.searchBy ==  "u_name"){
                    $scope.nameFieldLabel = "User Name";
                }
                else if($scope.formData.searchBy ==  "u_ip"){
                    $scope.nameFieldLabel = "IP Address";
                }
                
            }
            else if($scope.formData.searchBy == 'u_action'){
                $scope.formData.name = "";
                $scope.showSearchBtn = true;
                $scope.showNameField = false;
                $scope.showActionsField = true;
            }
            else{
                $scope.showSearchBtn = false;
                $scope.showNameField = false;
                $scope.showActionsField = false;
                $scope.multipleActions.selectedAction = [];
                $scope.formData.name = "";
            }
        }
        
        $scope.setPageToInitial = function(id){
            $scope.currentPage = 1;
//            if(id == "searchOption"){
//                $scope.formData.searchBy = "all";
//                $scope.showFields();
//            }
            if($scope.formData.searchBy == "all"){    
                $scope.showFields();
                $scope.searchActivities();
            }
            else if( ($scope.formData.name != undefined && $scope.formData.name != "" ) || 
                            $scope.multipleActions.selectedAction.length){
                $scope.searchActivities();
            }
            
        }
        
        $scope.searchActivities = function (){
            var logsFilter = '?filter={"search_by" : "'   + $scope.formData.searchBy +'" ';
            if($scope.showNameField){
                logsFilter += ', "search_text": "' + $scope.formData.name + '"';
            }
            else if($scope.showActionsField){
                logsFilter += ', "search_text": "' + $scope.multipleActions.selectedAction + '"';
            }

            logsFilter += '}&page=' + $scope.currentPage + '&limit=' + $scope.recordsPerPage;
            logsFilter += '&orderby=' + $scope.orderby + '&sort=' + $scope.sort;
            console.log(logsFilter);            
//            console.log(serviceUrl + usersFilter);
            $http.get(serviceUrl + logsFilter).success(function(data, status, headers, config) {
                $scope.logs = data.data.records;
                console.log($scope.logs );
                $scope.totalItems = data.data.total_records;
            });
        }
        
        function changeSortIcon(requestSortField){
            if(requestSortField == 'created_on'){
                $scope.createdOnClass = 'fa fa-sort-' + $scope.sort;
                $scope.userNameClass = $scope.actionClass = '';
            }
            else if(requestSortField == 'user_name'){
                $scope.userNameClass = 'fa fa-sort-' + $scope.sort;
                $scope.createdOnClass = $scope.actionClass = '';
            }
            else if(requestSortField == 'action'){
                $scope.actionClass = 'fa fa-sort-' + $scope.sort;
                $scope.createdOnClass = $scope.userNameClass = '';
            }
        }
        
        $scope.toggleSort = function(requestSortField){
            $scope.orderby = requestSortField;
            if(prevSortField == requestSortField){
                $scope.sort = $scope.sort == 'desc' ? 'asc' : 'desc';
            }
            else{
                prevSortField = requestSortField;
                $scope.sort = 'desc'
            }
            changeSortIcon(requestSortField);
            $scope.searchActivities();
        }
        
        $scope.searchActivities();

    }

})();
