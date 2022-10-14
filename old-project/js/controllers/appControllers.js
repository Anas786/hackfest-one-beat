/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

meterialAdmin
/*Admissions List*/
/*Login*/
.controller('loginCtrl', function($rootScope, $location, AuthenticationService){
	this.errors='';
    if ($rootScope.globals.currentUser) {
        AuthenticationService.ClearCredentials($rootScope.globals.currentUser.authdata);
    }
    else{
        AuthenticationService.ClearCredentials();   
    }

    this.formSubmitAction = function () {
        if (this.username && this.password)
        {
            AuthenticationService.Login(this.username, this.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.data);
                    $location.path('/app');
                } else {
                    this.errors = "Username and Password required";
                }
            });
        } else {
            this.errors = "Username and Password required";
        }
    }; 

    this.login = 1;
    this.register = 0;
    this.forgot = 0;
})

/*Admisssion List*/
.controller("admissionsCtrl", function ($scope, $http, $rootScope) {
    
    $scope.pagesToShow = 5;
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.recordsPerPage = 10;
	
	var serviceUrl = $rootScope.globals.serviceUrl+'admissions';
	$scope.searchText = undefined;
	$scope.selectedFaclity = undefined;
	var userObject = $rootScope.globals.currentUser.user;

	/*
	if(userObject.facilities.length){
		$scope.userFacilities = JSON.parse(JSON.stringify(userObject.facilities));
		$scope.userFacilities.push({id:"all", name: "All", created:"1"});
	}*/
	var facilitiesFilter = 'facilities?fields=id,name&filter={"search_category" : "real", "search_type" : "all_hf", "search_by" : "hf_type", "search_text" : "hl"}';
	$http.get($rootScope.globals.serviceUrl+facilitiesFilter).success(function(data, status, headers, config) { 
		$scope.userFacilities = data.data.records;
	});

	$scope.showPopover = function(id){
		$('#' + id).show();
	}
	
	$scope.hidePopover = function(id){
		$('#' + id).hide();
	}
	
	$scope.setPageToInitial = function(id){
		$scope.currentPage = 1;
		if( ($scope.searchText!= undefined && $scope.searchText != "" )){
			$scope.loadAdmissions();
		}
	}
	
	$scope.pageChanged = function() {
		if( ($scope.searchText!= undefined && $scope.searchText != "" )){
			var otherQuery = '&transaction_number='+ $scope.searchText;
			$scope.loadAdmissions(otherQuery);
		}else if ($scope.selectedFaclity != undefined){
			var otherQuery = '&sent_to_facility='+ $scope.selectedFaclity;
			$scope.loadAdmissions(otherQuery);
		}
		else{
			$scope.loadAdmissions();	
		}		
	}
	
	$scope.loadAdmissions = function(otherQuery = ''){
		var admissionsFilter = '?page=' + $scope.currentPage + '&limit=' + $scope.recordsPerPage;
		if(otherQuery == 'transaction_number'){
			admissionsFilter += '&filter={"transaction_number":"'+ $scope.searchText + '"}';
			$scope.selectedFaclity = undefined;
		}
		else if(otherQuery == 'sent_to_facility'){
			admissionsFilter += '&filter={"sent_to_facility":"'+ $scope.selectedFaclity +'"}';
		}
		$http.get(serviceUrl + admissionsFilter).success(function(data, status, headers, config) {
			$scope.admissions = data.data.records;
			$scope.totalItems = data.data.total_records;
		});
	}
	$scope.searchAdmission = function(){
		$scope.currentPage = 1;
		if( ($scope.searchText!= undefined && $scope.searchText != "" )){
			$scope.loadAdmissions('transaction_number');
		}else if ($scope.selectedFaclity != undefined){
			$scope.loadAdmissions('sent_to_facility');
		}
	}
	$scope.reloadAdmissions = function(){
		$scope.currentPage = 1;
		$scope.loadAdmissions();
	}

	$scope.loadAdmissions();
})
/*Admission Detail*/
.controller("viewAdmissionController", function ($scope, $http, $rootScope, $stateParams, $window) {
	var serviceUrl = $rootScope.globals.serviceUrl;
	var admissionId = $stateParams.id;
	var currentUser = $rootScope.globals.currentUser.user;
	var baseUrl = $rootScope.globals.baseUrl;
	
	$scope.viewAdmissionPageData = {};
	$scope.allMedRecordTypes = [];
	
	$scope.viewAdmissionPageData.admissionStatuses = [];
	$scope.qrcode = admissionId;
	$scope.viewAdmissionPageData.showOtherReason = false;
	$scope.viewAdmissionPageData.selectedDenialReason = 0;
	$scope.viewAdmissionPageData.selectedTemplate = '';
	$scope.viewAdmissionPageData.closeAdmissionTemplate = '';
	$scope.viewAdmissionPageData.showTakeAction = false;
	$scope.viewAdmissionPageData.oneAtATime = !0;
	$scope.viewAdmissionPageData.selectedCloseAdmissionReason = 0;
	$scope.viewAdmissionPageData.showGroups = false;
	$scope.viewAdmissionPageData.showPhysicianName = true;
	$scope.viewAdmissionPageData.hidePhysicianTransferMsg = false;
	$scope.viewAdmissionPageData.showPhysicians = false;
	
	$scope.viewAdmissionPageData.group = {};
	$scope.viewAdmissionPageData.groups = [];
	
	$scope.viewAdmissionPageData.physician = {};
	$scope.viewAdmissionPageData.physicians = [];
	
	$scope.viewAdmissionPageData.showTransferLinks = false;
	$scope.viewAdmissionPageData.showNoPhysiciansMsg = false;
	$scope.viewAdmissionPageData.showNoPhysiciansWithGroupSelectedMsg = false;
	$scope.viewAdmissionPageData.isGroupSelected = false;
	
	$scope.viewAdmissionPageData.showNoGroupMsg = false;
	
	$scope.viewAdmissionPageData.previousAdmittingPreferences = {};
	
	$scope.viewAdmissionPageData.medRecordType = undefined;
	$scope.viewAdmissionPageData.showSelectFiles = true;
	$scope.viewAdmissionPageData.disableMedRecordType = false;

	function selectIncludeTemplate(lastStatus){
		/*
		 * Select include template according to user role
		 */
		if(currentUser.category == "HL" && currentUser.role == 'BR' && lastStatus == 1) {
			$scope.viewAdmissionPageData.showTakeAction = true;
			$scope.viewAdmissionPageData.selectedTemplate = 'components/viewAdmission/takeAction-bed-availability.html';
		}

		else if( ( (currentUser.category == "HL" && currentUser.role == 'PN')
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& lastStatus == 2){
			$scope.viewAdmissionPageData.showTakeAction = true;
			$scope.viewAdmissionPageData.selectedTemplate = 'components/viewAdmission/takeAction-accept-deny.html';
		}
		else if( ( (currentUser.category == "HL" && currentUser.role == 'BR')
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& lastStatus == 4){
			$scope.viewAdmissionPageData.showTakeAction = true;
			$scope.viewAdmissionPageData.selectedTemplate = 'components/viewAdmission/takeAction-allocate-bed.html';
		}
		else if( ( (currentUser.category == "HL" && (currentUser.role == 'BR' || currentUser.role == 'AK'))
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& lastStatus == 6){
			$scope.viewAdmissionPageData.showTakeAction = true;
			$scope.viewAdmissionPageData.selectedTemplate = 'components/viewAdmission/takeAction-arrived-noshow.html';
			
		}
		else if( ( (currentUser.category == "HL" && (currentUser.role == 'BR' || currentUser.role == 'AK'))
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& lastStatus == 7){
			$scope.viewAdmissionPageData.showTakeAction = true;
			$scope.viewAdmissionPageData.selectedTemplate = 'components/viewAdmission/takeAction-discharged.html';
		}
		else{
			$scope.viewAdmissionPageData.selectedTemplate = '';
			$scope.viewAdmissionPageData.showTakeAction = false;
		}
		
		if($scope.viewAdmissionPageData.showTakeAction && currentUser.category == "HR" && 
				(currentUser.role == 'UR' || currentUser.role == 'AR') && (lastStatus >= 1 && lastStatus <= 4)){
			
			$scope.viewAdmissionPageData.closeAdmissionTemplate = 'components/viewAdmission/takeAction-close-admission.html';
		}
		else{
			$scope.viewAdmissionPageData.closeAdmissionTemplate = '';
		}




	}
	function showRevertTemplate(current_status){
		/*
		 * Show Revert Template if applicable
		 */
		$scope.viewAdmissionPageData.showRevertAction = false;
		
		if(currentUser.category == "HL" && currentUser.role == 'BR' && 
			(current_status != 1 && current_status != 4 && current_status != 5 && current_status != 9)) {
			$scope.viewAdmissionPageData.showRevertAction = true;
		}
		else if( ( (currentUser.category == "HL" && currentUser.role == 'PN')
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& (current_status == 4 || current_status == 5) ){
			$scope.viewAdmissionPageData.showRevertAction = true;
		}
		else if( ( (currentUser.category == "HL" && currentUser.role == 'BR')
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& current_status == 6){
			$scope.viewAdmissionPageData.showRevertAction = true;
		}
		else if( ( (currentUser.category == "HL" && (currentUser.role == 'BR' || currentUser.role == 'AK'))
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& current_status == 7){
			$scope.viewAdmissionPageData.showRevertAction = true;
		}
		else if( ( (currentUser.category == "HL" && (currentUser.role == 'BR' || currentUser.role == 'AK'))
				|| (currentUser.category == "HR" && (currentUser.role == 'UR' || currentUser.role == 'AR')) )
				&& current_status == 8){
			$scope.viewAdmissionPageData.showRevertAction = true;
		}

		if ($scope.viewAdmissionPageData.showRevertAction == true){
			$scope.viewAdmissionPageData.revertTemplate = 'components/viewAdmission/takeActionRevert.html';
		}else{
			$scope.viewAdmissionPageData.revertTemplate = '';
		}




	}
	
	$scope.viewAdmissionPageData.updateGroupAndPhysicianMsg = function(){
//                $scope.admissionDetail.group.name = $scope.viewAdmissionPageData.group.selected.name;
		$scope.admissionDetail.group = $scope.viewAdmissionPageData.group.selected;
		$scope.viewAdmissionPageData.showPhysicianName = false;
		$scope.viewAdmissionPageData.hidePhysicianTransferMsg = true;
		$scope.viewAdmissionPageData.showGroups = false;
		$scope.viewAdmissionPageData.isGroupSelected = true;
	}
	
	$scope.viewAdmissionPageData.hideGroupsDd = function(){
		$scope.viewAdmissionPageData.showGroups = false;
	}
	
	$scope.viewAdmissionPageData.updateGroup = function(){
		var groupObject = {admission_op: 'update_grp'};
		groupObject.group = $scope.admissionDetail.group.id != undefined ? 
										$scope.admissionDetail.group.id : 0;
		
		$http.put(serviceUrl+'admissions/'+admissionId, groupObject).success(function(response, status, headers, config) { 
			if(response.success == true){
//                        Move into particular method and call that method from here
				if($scope.admissionDetail.last_status == 3){
					$scope.admissionDetail.last_status = 1;
					selectIncludeTemplate($scope.admissionDetail.last_status);
					showRevertTemplate($scope.admissionDetail.last_status);
					$scope.admissionDetail.status_text = 'Initiated';
					$scope.admissionDetail.status_icon = 'initiated_admission.png';
//                        Update status log
					getStatusLog();
				}

//                        Update current admitting prefrences in admissionDetail Object
				$scope.admissionDetail.admitting_physician = {};
				$scope.admissionDetail.admitting_physician.first_name = 'N/A';
				$scope.admissionDetail.group.id = groupObject.group;
				$scope.admissionDetail.physician = 0;

//                        Update previous admitting preferences
				storeAdmittingPreferences($scope.admissionDetail.group, 
										$scope.admissionDetail.physician, 
										$scope.admissionDetail.admitting_physician);

//                        Clean up old values
				$scope.viewAdmissionPageData.groups = [];
				delete $scope.viewAdmissionPageData.group.selected;

				$scope.viewAdmissionPageData.hidePhysicianTransferMsg = false;
				$scope.viewAdmissionPageData.showPhysicianName = true;
				$scope.viewAdmissionPageData.showNoPhysiciansWithGroupSelectedMsg = false;
				$scope.viewAdmissionPageData.isGroupSelected = false;
				

			}
			
		});
	}
	
	$scope.viewAdmissionPageData.serviceUpdateGroupAndPhysician = function(){
		var groupAndPhysicianObject = {admission_op: 'update_grp_phy'};
		groupAndPhysicianObject.group = $scope.admissionDetail.group.id != undefined ? 
										$scope.admissionDetail.group.id : 0;
										
		groupAndPhysicianObject.physician = $scope.viewAdmissionPageData.physician.selected.id != undefined ?
											$scope.viewAdmissionPageData.physician.selected.id : 0;
		
		$http.put(serviceUrl+'admissions/'+admissionId, groupAndPhysicianObject).success(function(response, status, headers, config) { 
			if(response.success == true){
//                        Move into particular method and call that method from here
				if($scope.admissionDetail.last_status == 3){
					$scope.admissionDetail.last_status = 1;
					selectIncludeTemplate($scope.admissionDetail.last_status);
					showRevertTemplate($scope.admissionDetail.last_status);
					$scope.admissionDetail.status_text = 'Initiated';
					$scope.admissionDetail.status_icon = 'initiated_admission.png';
//                        Update status log
					getStatusLog();
				}

//                        Update current admitting prefrences in admissionDetail Object
				$scope.admissionDetail.admitting_physician.first_name = 
						$scope.viewAdmissionPageData.physician.selected.first_name;
				$scope.admissionDetail.admitting_physician.last_name = 
						$scope.viewAdmissionPageData.physician.selected.last_name;
				$scope.admissionDetail.group.id = groupAndPhysicianObject.group;
				$scope.admissionDetail.physician = groupAndPhysicianObject.physician;

//                        Update previous admitting preferences
				storeAdmittingPreferences($scope.admissionDetail.group, 
										$scope.admissionDetail.physician, 
										$scope.admissionDetail.admitting_physician);

				$scope.viewAdmissionPageData.groups = [];
				delete $scope.viewAdmissionPageData.group.selected;
				$scope.viewAdmissionPageData.physicians = [];
				delete $scope.viewAdmissionPageData.physician.selected;
				
				$scope.viewAdmissionPageData.showPhysicians = false;
				$scope.viewAdmissionPageData.showPhysicianName = true;
				
				$scope.viewAdmissionPageData.isGroupSelected = false;

			}
		});
	}
	
	$scope.viewAdmissionPageData.hidePhysicianDd = function(){
		$scope.viewAdmissionPageData.showPhysicians = false;
		if($scope.viewAdmissionPageData.clickReRoutePhysicianLink){
			$scope.viewAdmissionPageData.showPhysicianName = true;
		}
		else{
			$scope.viewAdmissionPageData.hidePhysicianTransferMsg = true;
		}
	}
	
	$scope.viewAdmissionPageData.getGroupsPhysician = function(msgFlag){
		if(msgFlag == 'clickHereLink'){
			$scope.viewAdmissionPageData.clickReRoutePhysicianLink = true;
		}
		else if(msgFlag == 'yesBtn'){
			$scope.viewAdmissionPageData.clickReRoutePhysicianLink = false;
		}
		$scope.viewAdmissionPageData.hidePhysicianTransferMsg = false;
//                $scope.viewAdmissionPageData.showPhysicians = true;
		var selectedGroupId = $scope.admissionDetail.group.id;
//                Remove already selected physician from admitting physician drop down
		$http.get(serviceUrl + 'groups/' + selectedGroupId + '?fields=id,name,on_call_users').success(function(data, status, headers, config){
			var list = data.data.on_call_users || [];
			$scope.viewAdmissionPageData.physicians = list;
			if($scope.admissionDetail.physician > 0){
				var previousSelectedPhysicianFound = _.findWhere(list, {id: $scope.admissionDetail.physician});
				if(previousSelectedPhysicianFound !=  undefined){
					list = _.without(list, previousSelectedPhysicianFound);
					$scope.viewAdmissionPageData.physicians = list;
				}
			}
			if(list.length == 0){
				if($scope.viewAdmissionPageData.isGroupSelected){
					$scope.viewAdmissionPageData.showNoPhysiciansWithGroupSelectedMsg = true;
				}
				else{
					$scope.viewAdmissionPageData.showNoPhysiciansMsg = true;
				}
				
			}
			else{
				$scope.viewAdmissionPageData.showPhysicians = true;
			}
			
		});
		
	}
	
	$scope.viewAdmissionPageData.getAffiliatedGroups = function(){
		var clincFacility = $scope.admissionDetail.sent_by_facility.id;
		$http.get(serviceUrl + 'facilities/' + clincFacility + '?fields=id,name,groups').success(function(data, status, headers, config){
			var list = data.data.groups || [];
			var previousSelectedGroupFound = _.findWhere(list, {id: $scope.admissionDetail.group.id});
			if(previousSelectedGroupFound !=  undefined){
				list = _.without(list, previousSelectedGroupFound);
			}
			if(list.length == 0){
				$scope.viewAdmissionPageData.showNoGroupMsg = true;
			}
			else{
				$scope.viewAdmissionPageData.showGroups = true;
			}
			$scope.viewAdmissionPageData.groups = list;
		});
	}
	
	$scope.viewAdmissionPageData.updateStatus = function(updateStatus){
		var updateStatusObj = {admission_id: admissionId, status: updateStatus};
		$http.post(serviceUrl+'admission-statuses',updateStatusObj).success(function(response, status, headers, config) {
			if(response.success){
				$scope.viewAdmissionPageData.showTransferLinks = currentUser.category == 'HR' && (updateStatus == 1 || updateStatus == 3);
				$scope.admissionDetail.status_icon = response.data.icon;
				$scope.admissionDetail.status_text = response.data.status_text;
				selectIncludeTemplate(updateStatus);
				showRevertTemplate(updateStatus);
				getStatusLog();
			}
		});
	}
	

	$scope.viewAdmissionPageData.checkDenialReason = function(value){
		if($scope.viewAdmissionPageData.selectedDenialReason == 4){
			$scope.viewAdmissionPageData.showOtherReason = true;
		}
		else{
			$scope.viewAdmissionPageData.showOtherReason = false;
		}
	}
	
	function getAdmissionDetail(){
		$http.get(serviceUrl + 'admissions/' + admissionId).success(function(data, status, headers, config) {
			$scope.admissionDetail = data.data;
			$scope.viewAdmissionPageData.showTransferLinks = currentUser.category == 'HR' && 
					($scope.admissionDetail.last_status == 1 || $scope.admissionDetail.last_status == 3);
			if($scope.admissionDetail.admitting_physician == null){
				$scope.admissionDetail.admitting_physician = {first_name: 'N/A'};
			}
			$scope.viewAdmissionPageData.previousAdmittingPreferences.group = $scope.admissionDetail.group;
			$scope.viewAdmissionPageData.previousAdmittingPreferences.physician = $scope.admissionDetail.physician;
			$scope.viewAdmissionPageData.previousAdmittingPreferences.admitting_physician = $scope.admissionDetail.admitting_physician;
			selectIncludeTemplate(data.data.last_status);
			showRevertTemplate(data.data.last_status);
			getStatusLog();
			if (data.data.last_status >= 6 &&  (currentUser.category == "CC" || currentUser.category == "AS" )){
				$scope.boardingPass = true;
			}
			else {
				$scope.boardingPass = false;
			}
		});
	}
	
	$scope.viewAdmissionPageData.toggleActionLog = function(){
		$('#action_log').toggle();
	}
	
	function getStatusLog(){
		$http.get(serviceUrl + 'admission-statuses/' + admissionId).success(function(data, status, headers, config) {
			$scope.viewAdmissionPageData.admissionStatuses = data.data || [];
		});
	}
	
	$scope.viewAdmissionPageData.hideNoPhysicianMsg = function(){
		$scope.viewAdmissionPageData.showNoPhysiciansMsg = false;
	}
	
	$scope.viewAdmissionPageData.revertToPreviousGroup = function(){
		$scope.admissionDetail.group = $scope.viewAdmissionPageData.previousAdmittingPreferences.group;
		$scope.admissionDetail.physician = $scope.viewAdmissionPageData.previousAdmittingPreferences.physician;
		$scope.admissionDetail.admitting_physician = $scope.viewAdmissionPageData.previousAdmittingPreferences.admitting_physician;
		
//                        Clean up old values
		$scope.viewAdmissionPageData.groups = [];
		delete $scope.viewAdmissionPageData.group.selected;
		$scope.viewAdmissionPageData.showPhysicianName = true;
		$scope.viewAdmissionPageData.showNoPhysiciansWithGroupSelectedMsg = false;
		$scope.viewAdmissionPageData.isGroupSelected = false;
	}
	
	$scope.viewAdmissionPageData.hideNoGroupMsg = function(){
		$scope.viewAdmissionPageData.showNoGroupMsg = false;
	}
	
	function storeAdmittingPreferences(groupObj, physicianId, admittingPhysicianObj){
		$scope.viewAdmissionPageData.previousAdmittingPreferences.group = groupObj;
		$scope.viewAdmissionPageData.previousAdmittingPreferences.physician = physicianId;
		$scope.viewAdmissionPageData.previousAdmittingPreferences.admitting_physician = admittingPhysicianObj;
	}
	/*
//            Get Medical Record Types
	$http.get(serviceUrl + 'med-record-types').success(function (medRecordTypes, status, headers, config) {
		$scope.allMedRecordTypes = medRecordTypes.data.records || [];
	});
	
	var uploader = $scope.viewAdmissionPageData.uploader = new FileUploader({
		url: baseUrl + 'files',
		headers : {Authorization : $http.defaults.headers.common.Authorization},
	});

	// FILTERS
//            Use this custom filter on html
	uploader.filters.push({
		name: 'customFilter',
		fn: function(item , options) {
			return this.queue.length < 5;
		}
	});
	
	
	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item , filter, options) {
//                console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
//                console.info('onAfterAddingFile', fileItem);
	};
	uploader.onAfterAddingAll = function(addedFileItems) {
//                console.info('onAfterAddingAll', addedFileItems);
		if($scope.viewAdmissionPageData.uploader.queue.length > 0 && 
				$scope.viewAdmissionPageData.disableMedRecordType == false &&
				$scope.viewAdmissionPageData.medRecordType != undefined){
			$scope.viewAdmissionPageData.disableMedRecordType = true;
		}
   };
	uploader.onBeforeUploadItem = function(item) {
//                console.info('onBeforeUploadItem', item);
		if($scope.viewAdmissionPageData.uploader.queue.length > 0 && 
				$scope.viewAdmissionPageData.medRecordType != undefined){
			item.formData.push({admission_id: admissionId, 
					record_type: $scope.viewAdmissionPageData.medRecordType });
			console.log(item.formData);
		}
	};
	uploader.onProgressItem = function(fileItem, progress) {
//                console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function(progress) {
//                console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
//                console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
//                console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function(fileItem, response, status, headers) {
//                console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function(fileItem, response, status, headers) {
//                uploader.removeFromQueue(0);
//                console.info('onCompleteItem', fileItem, response, status, headers);

	};
	uploader.onCompleteAll = function() {
//                console.info('onCompleteAll');
	};

	console.info('uploader', uploader);
	
	$scope.$watch('viewAdmissionPageData.uploader.queue.length',function(newValue, oldValue) {
		console.log('Watch called')
		if(newValue == 0){
//                    uploader.queue[0].formData = [];
			$scope.viewAdmissionPageData.disableMedRecordType = false;
			if($scope.viewAdmissionPageData.medRecordType == undefined){
				$scope.viewAdmissionPageData.showSelectFiles = true;
			}
			else{
				$scope.viewAdmissionPageData.showSelectFiles = false;
			}
			console.log('---Form Data: ', uploader.formData);
		}
	});
	
	$scope.viewAdmissionPageData.checkRecordType = function(){
		console.info('Med record type', $scope.viewAdmissionPageData.medRecordType == undefined);
		if($scope.viewAdmissionPageData.medRecordType == undefined){
			$scope.viewAdmissionPageData.showSelectFiles = true;
		}
		else{
			$scope.viewAdmissionPageData.showSelectFiles = false;
		}
		
	}
	
	$scope.viewAdmissionPageData.getDeleteIconState = function(fileUploadedByUser){
		return currentUser.id == fileUploadedByUser;
	}
	
	$scope.viewAdmissionPageData.deleteFile = function(fileName, rowId){
		var deleteFileObj = {file_name : fileName};
		var selectedValue = $scope.admissionDetail.files[rowId];
		$http.delete(baseUrl + 'files', {params: deleteFileObj}).success(function(response, status, headers, config) {
			if(response.success){
//                        On success fetch new files with ajax call
				var selectedValue = $scope.admissionDetail.files[rowId];
				$scope.admissionDetail.files = _.without( $scope.admissionDetail.files, selectedValue);
			}
			else{
				console.log('error');
			}
		});
	}
	
	$scope.viewAdmissionPageData.downloadFile = function(fileId){
		$http.get(baseUrl + 'files/' + fileId + '?admission_id=' + admissionId).success(function(response, status, headers, config){
			if(response.success){
				var furl = baseUrl + 'fetch-files?fid=' +response.data.fl
				console.log(furl);
				$window.location.href = furl;

			}
			else{
				console.log('Error fetching file')
			}
		});
		
	}
	*/
	
	
	
	getAdmissionDetail();
            
})
/*Create Admission*/
.controller("createAdmissionController", function ($scope, $stateParams, $http, $rootScope, $location) {
	var baseUrl = $rootScope.globals.baseUrl;
	var serviceUrl = $rootScope.globals.serviceUrl;
	var userObject = $rootScope.globals.currentUser.user;
	$scope.facility = {};
	$scope.tForm = {mode_of_tranportation: 0, bed_type: 0, patient_eta: 0, code_status: 0};
	$scope.month = 0;
	$scope.tForm.diagnosis = [];
	$scope.facilities = [];
	$scope.group = {};
	$scope.groups = [];
	$scope.insuranceDd = '0';
	$scope.showOtherInsurance = false;
	$scope.otherInsuranceText = undefined;
	$scope.icdDd = "icd9";
	$scope.icdDescText = undefined;
	$scope.icdOptionsDd = 'description';
	$scope.icdDescLabel = "ICD Diagnosis Description";
	$scope.selectedDiagnosisArray = [];
	$scope.admittingPhysician = {};
	$scope.physicians = [];
	$scope.allMedRecordTypes = [];
	$scope.tForm.doc_to_doc = 0;

	$scope.insurance = {};
	$scope.diagnosicOrders = {multipleBloodTests:{}, imagingTest:{}, urineTest:{}};
	$scope.medicalHistory = {Allergies:{}, Comorbidity:{}, Other_Allergies:'', Parient_Brief_Medical_Information:''};
	$scope.medicationOrders = {PRN_Meds:[]};
	$scope.specialtyConsult = {Consults:{}, Preferred_Consultant:'', Additional_Consults:'', Specialist_Consult_required_for_transfer:false};

	$scope.createAdmissionPageData = {};
	$scope.createAdmissionPageData.medRecordType = undefined;
	$scope.createAdmissionPageData.showSelectFiles = true;
	$scope.createAdmissionPageData.disableMedRecordType = false;
	
	$scope.createAdmissionPageData.filesArray = [];
	
	$scope.bloodTestsMulti = [
		{id:1, name: "CBC"},
		{id:2, name: "BMP"},
		{id:3, name: "LFT"},
		{id:4, name: "CMP"},
		{id:5, name: "TSH"},
		{id:6, name: "HGBAIC"},
		{id:7, name: "FLP"},
		{id:8, name: "Trop"},
		{id:9, name: "CKMB"},
		{id:10, name: "D Dimer"},
		{id:11, name: "PT"},
		{id:12, name: "PTT"},
		{id:13, name: "Blood CX"},
	];
	
	
	$scope.prnMedsMulti = [
		{id:1, name: "Tylenol 650 mg po q 6h prn fever/pain"},
		{id:2, name: "Ibuprofen 400 mg po q 6h prn fever/pain"},
		{id:3, name: "Zofran 4 mg iv q 4h prn n/v"},
		{id:4, name: "Phenergan 12.5 mg iv q 6hprn n/v"},
		{id:5, name: "Maalox 30 cc q 6h prn indigestion"},
		{id:6, name: "Ambien 5 mg po qhs prn insomnia"},
		{id:7, name: "Restoril 15 mg po qhs prn insomnia"},
		{id:8, name: "Albuterol 2.5 mg via Ben q6h prn sob"},
		{id:9, name: "Ativan 1 mg po/iv q6h prn agitation"},
		{id:10, name: "Ativan 1 mg po/iv q6h prn agitation"},
		{id:11, name: "Dilaudid 1 mg iv q4h prn pain scale 1-5"},
		{id:12, name: "Dilaudid 2 mg iv q4h prn pain scale 6-10"},
		{id:13, name: "Nicotine patch 21 mcg/hr q day"},
		{id:14, name: "Labetolol 10 mg iv q 2h prn SBP >= 160"},
		{id:15, name: "Hydalazine 10 mg iv q 2h prn SBP >= 160"},
		{id:16, name: "Clonidine 0.1 mg po q 6h prn SBP >= 160"},
		{id:17, name: "Electrolyte replacement protocol"},
		
	];
	
	$scope.insuranceDd = [
		{id:1, name: "BLUE CROSS"},
		{id:2, name: "CHAMPUS"},
		{id:3, name: "CHARITY"},
		{id:4, name: "COMMERCIAL"},
		{id:5, name: "FEDERAL PROGRAMS"},
		{id:6, name: "MEDICAID MANAGED CARE"},
		{id:7, name: "HMO NON-CAPITATED"},
		{id:8, name: "MEDICAID"},
		{id:9, name: "MEDICARE"},
		{id:10, name: "MEDICARE EXEMPT"},
		{id:11, name: "MANAGED MEDICARE"},
		{id:12, name: "PPO"},
		{id:13, name: "SELF-PAY"},
		{id:14, name: "STATE NON MEDICAID LOCAL"},
		{id:15, name: "WORKERS COMPENSATION"},
		{id:16, name: "Other"}

	];

	getUserFacilites();
	function getUserFacilites(){
		var facilitiesFilter = 'facilities?fields=id,name&filter={"search_category" : "real", "search_type" : "all_hf", "search_by" : "hf_type", "search_text" : "hl"}';
		$http.get(serviceUrl+facilitiesFilter).success(function(data, status, headers, config) { 
			$scope.facilities = data.data.records;
		});
	}
	
	$scope.onGroupSelect = function(model){
		$http.get(serviceUrl+'groups/' + model.id+ '?fields=on_call_users').success(function(data, status, headers, config) {
			$scope.physicians = data.data.on_call_users || [];
		});
	}

	$scope.onClinicSelect = function (model){
		$http.get(serviceUrl+'facilities/' + model.id + '?fields=id,groups').success(function(data, status, headers, config) {
				var groupIds = [];
				$scope.groups = [];
				for (var i = 0; i < data.data.groups.length; i++) {
					groupIds.push(data.data.groups[i].id);
				}
				$http.get(serviceUrl + 'groups/' + groupIds + '?fields=id,name,hospital_facility').success(function(data, status, headers, config) {
					if($.isArray(data.data)){
						for (var j = 0; j < data.data.length; j++) {
							if (data.data[j].facilities){
								$scope.groups.push({id: data.data[j].id, name: data.data[j].name, 
								 facilityName: data.data[j].facilities[0].name, facilityId: data.data[j].facilities[0].id});
							}
						}
					}
					else if (data.data.facilities){
						$scope.groups.push({id: data.data.id, name: data.data.name, 
								 facilityName: data.data.facilities[0].name, facilityId: data.data.facilities[0].id});
					}
				});
		});
	}
	
	$scope.changeInsurance = function(){
		$scope.insurance.otherInsuranceText = undefined;
		if($scope.insurance.insuranceDd == "16"){
			$scope.showOtherInsurance = true;
		}
		else{
			$scope.showOtherInsurance = false;
		}
	}
	
	$scope.submitTransferForm = function(){
		var postData = $scope.tForm;
		var errors_free_form = true;
		$scope.nameError = false;

		if (postData.patient_first_name == undefined || postData.patient_first_name == '' ) {
			errors_free_form = false;
			$scope.fnameError = true;
		}
		else if (postData.patient_last_name == undefined || postData.patient_last_name == '' ) {
			errors_free_form = false;
			$scope.lnameError = true;
		}
		else if ($scope.month == '0' || $scope.date == undefined || $scope.year == undefined || $scope.date > '31' || $scope.date < '01' || $scope.year.length != 4) {
			errors_free_form = false;
			$scope.dobError = true;
		}
		else if (postData.patient_gender == undefined) {
			errors_free_form = false;
			$scope.sexError = true;
		}
		else if (postData.patient_cell_number == undefined || postData.patient_cell_number.length < 10) {
			errors_free_form = false;
			$scope.cellError = true;
		}
		else if (postData.mode_of_tranportation == '0'){
			errors_free_form = false;
			$scope.motError = true;
		}
		else if (postData.code_status == '0'){
			errors_free_form = false;
			$scope.cstatusError = true;
		}
		else if (postData.bed_type == '0'){
			errors_free_form = false;
			$scope.btypeError = true;
		} 
		else if ( ($scope.selectedDiagnosisArray == undefined || $scope.selectedDiagnosisArray.length < 1 ) && (postData.otherDiagnostics == undefined || postData.otherDiagnostics == '')) {
			errors_free_form = false;
			$scope.icdError = true;
		}
		else if ($scope.facility.selected == undefined){
			errors_free_form = false;
			$scope.hlError = true;
		}
		else if ($scope.group.selected == undefined){
			errors_free_form = false;
			$scope.grpError = true;
		}
		else if ($scope.admittingPhysician.selected == undefined){
			errors_free_form = false;
			$scope.phyError = true;
		}
		else if (postData.patient_eta == '0'){
			errors_free_form = false;
			$scope.etaError = true;
		}
		

		if (errors_free_form){
			postData.sent_by_user = userObject.id;
			postData.patient_dob = $scope.month+'/'+$scope.date+'/'+$scope.year;
			postData.sent_by_facility = userObject.facilities[0].id;
			postData.physician = $scope.admittingPhysician.selected;
			if($scope.createAdmissionPageData.filesArray.length){
				postData.files = $scope.createAdmissionPageData.filesArray;
			}
			if($scope.selectedDiagnosisArray.length){
				postData.diagnosis = $scope.selectedDiagnosisArray;
			}
			
			if($scope.group.selected){
			   postData.group = $scope.group.selected.id;
			   postData.sent_to_facility = $scope.group.selected.facilityId;
			}
			else{
				postData.group = 0;
				postData.sent_to_facility = 0;
			}
			postData.insurance = $scope.insurance;
			postData.diagnosicOrders = $scope.diagnosicOrders;
			postData.medicalHistory = $scope.medicalHistory;
			postData.medicationOrders = $scope.medicationOrders;
			postData.specialtyConsult = $scope.specialtyConsult;
			
			
			$http.post(serviceUrl+'admissions',postData).success(function(response, status, headers, config) {
				if (response.success){
					$location.path('/app/admissions');				
				}
			});
		}                
	}

	$scope.showFilterOptions = function(){
		$scope.icdDescText = undefined;
		if($scope.icdOptionsDd != undefined && $scope.icdOptionsDd != "" && $scope.icdOptionsDd == "description"){
			$scope.icdDescLabel = "ICD Diagnosis Description";
		}
		else{
			$scope.icdDescLabel = "ICD Code";
		}
	}
	
	$scope.resetFilterOptions = function(){
		$scope.icdOptionsDd = 'description';
		$scope.selectedDiagnosisArray = [];
		$scope.showFilterOptions();
	}
	
	$scope.getIcdCodes = function(searchText) {
		var filterStr = '?filter={"search_type":"' + $scope.icdDd + '","search_by":"' + $scope.icdOptionsDd + '","search_text":"' + searchText +'"}'
		return $http.get(serviceUrl + 'icds' + filterStr).then(function(response){
		  return response.data.data.records;
		});
	};
	
	
	$scope.addDiagnosis = function(){
		var diagnosisArr = $scope.icdDescText.split(':');
		if(diagnosisArr.length == 2){
			diagnosisArr[0] = diagnosisArr[0].trim();
			diagnosisArr[1] = diagnosisArr[1].trim();
			$scope.selectedDiagnosisArray.push({code:diagnosisArr[0], desc:diagnosisArr[1]})
		}
		$scope.icdDescText = undefined;
	}
	
	$scope.removeDiagnosis = function(index){
		var selectedValue = $scope.selectedDiagnosisArray[index];
		$scope.selectedDiagnosisArray.splice(index, 1);
	}
	/*
//            Get Medical Record Types
	$http.get(serviceUrl + 'med-record-types').success(function (medRecordTypes, status, headers, config) {
		$scope.allMedRecordTypes = medRecordTypes.data.records || [];
	});
	
	var uploader = $scope.createAdmissionPageData.uploader = new FileUploader({
		url: baseUrl + 'files',
		headers : {Authorization : $http.defaults.headers.common.Authorization},
	});

	// FILTERS

	uploader.filters.push({
		name: 'customFilter',
		fn: function(item , options) {
			return this.queue.length < 5;
		}
	});
	
	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item , filter, options) {
//                console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
//                console.info('onAfterAddingFile', fileItem);
	};
	uploader.onAfterAddingAll = function(addedFileItems) {
//                console.info('onAfterAddingAll', addedFileItems);
		if($scope.createAdmissionPageData.uploader.queue.length > 0 && 
				$scope.createAdmissionPageData.disableMedRecordType == false &&
				$scope.createAdmissionPageData.medRecordType != undefined){
			$scope.createAdmissionPageData.disableMedRecordType = true;
		}
   };
	uploader.onBeforeUploadItem = function(item) {
//                console.info('onBeforeUploadItem', item);
		if($scope.createAdmissionPageData.uploader.queue.length > 0 && 
				$scope.createAdmissionPageData.medRecordType != undefined){
			item.formData.push({record_type: $scope.createAdmissionPageData.medRecordType });
		}
	};
	uploader.onProgressItem = function(fileItem, progress) {
//                console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function(progress) {
//                console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
//                console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
//                console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function(fileItem, response, status, headers) {
//                console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function(fileItem, response, status, headers) {
//                console.info('onCompleteItem', fileItem, response, status, headers);
		if(response.success && 
				$scope.createAdmissionPageData.medRecordType != undefined){
			$scope.createAdmissionPageData.filesArray.push({file_name: response.data.file, 
				record_type_text : response.data.record_type, 
				record_type : $scope.createAdmissionPageData.medRecordType});
		}

	};
	uploader.onCompleteAll = function() {
//                console.info('onCompleteAll');
	};

	console.info('uploader', uploader);
	
	
	$scope.$watch('createAdmissionPageData.uploader.queue.length',function(newValue, oldValue) {
		console.log('Watch called')
		if(newValue == 0){
//                    uploader.queue[0].formData = [];
			$scope.createAdmissionPageData.disableMedRecordType = false;
			if($scope.createAdmissionPageData.medRecordType == undefined){
				$scope.createAdmissionPageData.showSelectFiles = true;
			}
			else{
				$scope.createAdmissionPageData.showSelectFiles = false;
			}
		}
	});
	
	$scope.createAdmissionPageData.checkRecordType = function(){
		if($scope.createAdmissionPageData.medRecordType == undefined){
			$scope.createAdmissionPageData.showSelectFiles = true;
		}
		else{
			$scope.createAdmissionPageData.showSelectFiles = false;
		}
		
	}
	
	$scope.createAdmissionPageData.deleteFile = function(fileName, rowId){
		var deleteFileObj = {file_name : fileName};
		$http.delete(baseUrl + 'files', {params: deleteFileObj}).success(function(response, status, headers, config) {
			if(response.success){
				var selectedValue = $scope.createAdmissionPageData.filesArray[rowId];
				$scope.createAdmissionPageData.filesArray = _.without( $scope.createAdmissionPageData.filesArray, selectedValue);
			}
			else{
				console.log('error');
			}
		});
	}*/	
})
/*Users List*/
.controller("userListController", function ($scope, $http, $rootScope) {
	var baseServiceUrl = $rootScope.globals.serviceUrl;
	var serviceUrl = baseServiceUrl + 'users';
	var fields = "id,user_name,first_name,last_name,category,role,created,updated,facility";
	
//        Pagination configuration
	$scope.pagesToShow = 5;
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.recordsPerPage = 10;
	
	$scope.pageChanged = function() {
		$scope.searchUsers();
	};
	
	
	$scope.formData = {searchOption: "real", usersOptions: "all_users", searchBy: "all"};
	$scope.showSearchBtn = $scope.showNameField = $scope.showRoleField = $scope.showFacilityField = $scope.showGroupField = false;
	$scope.roleDisabled = true;
	$scope.nameFieldLabel = "";
	
	$scope.multipleFacilities = {};
	$scope.multipleFacilities.selectedFacility = [];
	$scope.facilitiesMulti = [];
	
	$scope.multipleGroups = {};
	$scope.multipleGroups.selectedGroups = [];
	$scope.groupsMulti = [];
	
	$http.get(baseServiceUrl + 'user-categories').success(function (categories, status, headers, config) {
		$scope.categories = categories.data.records;
	});
	
	$scope.getRoles = function () {
		
		if($scope.formData.category != undefined){
			var roleFilter = '?filter={"search_text":"' + $scope.formData.category + '"}';
			$http.get(baseServiceUrl + 'user-roles' + roleFilter).success(function (roles, status, headers, config) {
				$scope.roleDisabled = false;
				$scope.formData.role = '';
				$scope.roles = roles.data.records; 
			});
		}

	}
	
	$scope.$watch(function(scope) { return scope.formData.searchOption },
		  function(newValue, oldValue) {
			  if($scope.formData.searchBy == 'u_group'){
					$scope.multipleGroups.selectedGroups = [];
					var groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + newValue
										+ '","search_type" : "all_hg", "search_by" : "all"}';
					$http.get(baseServiceUrl+groupsFilter).success(function(data, status, headers, config) { 
						$scope.groupsMulti = data.data.records;
						$scope.showGroupField = true;
					});
			  }
		  }
	);

	$scope.$watch(function(scope) { return scope.formData.searchOption },
		  function(newValue, oldValue) {
			  if($scope.formData.searchBy == 'u_facility'){
					$scope.multipleFacilities.selectedFacility = [];
					var facilitiesFilter = 'facilities?fields=id,name,type&filter={"search_category" : "'+ newValue 
					+'", "search_type" : "all_hf", "search_by": "all"}';
					$http.get(baseServiceUrl+facilitiesFilter).success(function(data, status, headers, config) { 
						$scope.facilitiesMulti = data.data.records;
						$scope.showFacilityField = true;
					});
			  }
		  }
	);
	
	$scope.showFields = function(){
		var nameOptionsArr = ["u_name", "u_fname", "u_lname"];
		if(nameOptionsArr.indexOf($scope.formData.searchBy) > -1){ 
			$scope.showSearchBtn = true;
			$scope.showNameField = true;
			$scope.showRoleField = false;
			$scope.formData.category = undefined;
			$scope.formData.role = undefined;
			$scope.showFacilityField = false;
			$scope.showGroupField = false;
			$scope.multipleFacilities.selectedFacility = [];
			$scope.multipleGroups.selectedGroups = [];
			if($scope.formData.searchBy ==  "u_name"){
				$scope.nameFieldLabel = "User Name";
			}
			else if($scope.formData.searchBy ==  "u_fname"){
				$scope.nameFieldLabel = "First Name";
			}
			else if($scope.formData.searchBy ==  "u_lname"){
				$scope.nameFieldLabel = "Last Name";
			}
		}
		else if($scope.formData.searchBy == 'u_role'){
			$scope.formData.name = "";
			$scope.showSearchBtn = true;
			$scope.showNameField = false;
			$scope.showRoleField = true;
			$scope.showFacilityField = false;
			$scope.showGroupField = false;
			$scope.multipleFacilities.selectedFacility = [];
			$scope.multipleGroups.selectedGroups = [];
		}
		else if($scope.formData.searchBy == 'u_facility'){
			$scope.formData.name = "";
			$scope.showNameField = false;
			$scope.showRoleField = false;
			$scope.formData.category = undefined;
			$scope.formData.role = undefined;
			$scope.showGroupField = false;
			$scope.multipleFacilities.selectedFacility = [];
			var searchCategoryStr = $scope.formData.searchOption == 'real' ? "real" : "test"
			var facilitiesFilter = 'facilities?fields=id,name,type&filter={"search_category" : "'+ searchCategoryStr 
					+'", "search_type" : "all_hf", "search_by": "all"}';
			$http.get(baseServiceUrl+facilitiesFilter).success(function(data, status, headers, config) { 
				$scope.facilitiesMulti = data.data.records;
				$scope.showFacilityField = true;
				$scope.showSearchBtn = true;
			});
		}
		else if($scope.formData.searchBy == 'u_group'){
			$scope.formData.name = "";
			$scope.showNameField = false;
			$scope.showRoleField = false;
			$scope.formData.category = undefined;
			$scope.formData.role = undefined;
			$scope.showFacilityField = false;
			$scope.multipleFacilities.selectedFacility = [];
			var searchCategoryStr = $scope.formData.searchOption == 'real' ? "real" : "test"
			var groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr
					+ '","search_type" : "all_hg", "search_by" : "all"}';
			$http.get(baseServiceUrl+groupsFilter).success(function(data, status, headers, config) { 
				$scope.groupsMulti = data.data.records;
				$scope.showGroupField = true;
				$scope.showSearchBtn = true;
			});
		}
		else{
			$scope.showSearchBtn = false;
			$scope.showNameField = false;
			$scope.showRoleField = false;
			$scope.formData.category = undefined;
			$scope.formData.role = undefined;
			$scope.showFacilityField = false;
			$scope.showGroupField = false;
			$scope.formData.name = "";
			$scope.multipleFacilities.selectedFacility = [];
			$scope.multipleGroups.selectedGroups = [];
		}
	}
	
	$scope.setPageToInitial = function(id){
		$scope.currentPage = 1;
		if(id == "searchOption"){
			$scope.formData.searchBy = "all";
			$scope.showFields();
		}
		if($scope.formData.searchBy == "all"){
			$scope.searchUsers();
		}
		else if( ($scope.formData.name != undefined && $scope.formData.name != "" ) || 
				 ($scope.formData.category != undefined &&  
					$scope.formData.role != undefined && $scope.formData.role != null && $scope.formData.role != "") || 
						$scope.multipleFacilities.selectedFacility.length || 
						$scope.multipleGroups.selectedGroups.length){
			$scope.searchUsers();
		}
		
	}
	
	$scope.searchUsers = function (){
		var usersFilter = '?filter={"search_main_category" : "' + $scope.formData.searchOption + 
				'", "search_type" : "' + $scope.formData.usersOptions + '", "search_by" : "' + 
				$scope.formData.searchBy +'" ';
		if($scope.showNameField){
			usersFilter += ', "search_text": "' + $scope.formData.name + '"';
		}
		else if($scope.showRoleField){
			usersFilter += ', "search_sub_category": "' + $scope.formData.category + '", "search_role": "' + 
					$scope.formData.role + '"';
		}
		else if($scope.showGroupField){
			usersFilter += ', "search_text": "' + $scope.multipleGroups.selectedGroups + '"';
		}
		else if($scope.showFacilityField){
			usersFilter += ', "search_text": "' + $scope.multipleFacilities.selectedFacility + '"';
		}

		usersFilter += '}&fields=' + fields
		usersFilter += '&page=' + $scope.currentPage + '&limit=' + $scope.recordsPerPage;
		$http.get(serviceUrl + usersFilter).success(function(data, status, headers, config) {
			$scope.users = data.data.records;
			$scope.totalItems = data.data.total_records;
		});
	}
	
	$scope.searchUsers();

})
/*Create User*/
.controller("createUserController", function ($scope, $http, $location, $rootScope, $stateParams) {
	$scope.formData = {};
	var isReal = $stateParams.real;
	$scope.formData.isReal = isReal;
	var serviceUrl = $rootScope.globals.serviceUrl;
	var physicianDegrees = [];
	var nurseDegrees = [];
	var physicianAssistantDegrees = [];
	var bedCoordinatorDegrees = [];
	$scope.showFacilities = $scope.showdegree = $scope.showspecialty = false;
	
	$scope.multipleFacilities = {};
	$scope.multipleFacilities.selectedFacility = [];
	$scope.facilitiesMulti = [];
	
	$scope.multipleGroups = {};
	$scope.multipleGroups.selectedGroups = [];
	$scope.groupsMulti = [];
	
	var facilityGroups = {};
	
	$scope.populateFacilities = function($event){
		if ($event !== undefined && 
				$scope.formData.category != undefined && 
				$scope.formData.category != 'AS' && 
				$scope.formData.category != 'HR') {
			
			$scope.groupsMulti = [];
			$scope.multipleFacilities.selectedFacility = [];
			$scope.multipleGroups.selectedGroups = [];
			var checkbox = $event.target;
			var searchCategoryStr = checkbox.checked ? "real" : "test"
			var facilitiesFilter = 'facilities?fields=id,name,type&filter={"search_category": "' + searchCategoryStr  +'", "search_type":"active_hf","search_by":"hf_type","search_text":"' + $scope.formData.category + '"}';
			$http.get(serviceUrl + facilitiesFilter).success(function (data, status, headers, config) {
				$scope.facilitiesMulti = data.data.records || [];
			});
		}
		else{
			console.log('Error');
		}
	}
	
	$scope.onFacilitySelect = function (model){
		$scope.groupsMulti = [];
		facilityGroups=[];
		if(model.length){
			var category = $scope.formData.category;
			var role = $scope.formData.role;
			angular.forEach(model, function(item){
				if ( (category == 'HL' && role == 'PN') || (category == 'CC' && role == 'SN') ) {
					$http.get(serviceUrl + 'facilities/' + item).success(function (data, status, headers, config) {
						var groupsIds = [];
						for (var i = 0; i < data.data.groups.length; i++) {
							groupsIds.push(data.data.groups[i].id);
							$scope.groupsMulti.push(data.data.groups[i]);
						}
						if(groupsIds.length){
							facilityGroups[item] = groupsIds;
						}
					});
				}
			});
			
		}
	};

/*Get user categories*/
	$http.get(serviceUrl + 'user-categories').success(function (categories, status, headers, config) {
		$scope.categories = categories.data.records;
	});

//      Get degrees
	$http.get(serviceUrl + 'degrees').success(function (degrees, status, headers, config) {
		for (var i = 0; i < degrees.data.records.length; i++) {
			var degreeObj = degrees.data.records[i];
			if(degreeObj.value == 'DO' || degreeObj.value == 'MD'){
				physicianDegrees.push(degreeObj);
			}
			else if(degreeObj.value == 'NP' ){
				nurseDegrees.push(degreeObj);
				bedCoordinatorDegrees.push(degreeObj);
			}
			else if(degreeObj.value == 'PA' ){
				physicianAssistantDegrees.push(degreeObj);
				bedCoordinatorDegrees.push(degreeObj);
			}
			
		}
	});
//      Get specialties
	$http.get(serviceUrl + 'specialties').success(function (specialties, status, headers, config) {
		$scope.allspecialties = specialties.data.records;
	});
	
	$scope.getRoles = function () {
		var categoryVal = typeof $scope.formData.category === "undefined" ? "undefined" : $scope.formData.category;

//          Call category validation to show category error and also call role validation to show role error
		if(categoryVal === "undefined"){
			$scope.registerform.category.$invalid = true;
			$scope.categoryValidation();
			$scope.registerform.role.$invalid = true;
			$scope.roleValidation();
		}
		else{
			$scope.registerform.category.$invalid = false;
			$scope.categoryValidation();
		}
					
		var roleFilter = '?filter={"search_text":"' + categoryVal + '"}';
		$http.get(serviceUrl + 'user-roles' + roleFilter).success(function (roles, status, headers, config) {
			$scope.formData.role = '';
			$scope.roles = roles.data.records;
			
		});
		if ($scope.formData.category != 'AS' && $scope.formData.category != 'HR') {
			$scope.facilitiesMulti = [];
			$scope.multipleFacilities.selectedFacility = [];
			$scope.groupsMulti = [];
			$scope.multipleGroups.selectedGroups = [];
			$scope.showFacilities = true;
			if ( !( ($scope.formData.category == 'HL' && $scope.formData.role == 'PN') || 
					($scope.formData.category == 'CC' && $scope.formData.role == 'SN') ) ) {
				$scope.showgroups = false;
			}
			var searchCategory = $scope.formData.isReal == 'T' ? "real" : "test";
			var facilityFilter = '?fields=id,name&filter={"search_category": "' + searchCategory +'", "search_type":"active_hf","search_by":"hf_type","search_text":"' + categoryVal + '"}';
//                var facilityFilter = '?fields=id,name,type&filter={"search_category": "real", "search_type":"active_hf","search_by":"hf_type","search_text":"' + categoryVal + '"}';
			$http.get(serviceUrl + 'facilities' + facilityFilter).success(function (facilities, status, headers, config) {
//                    console.log(facilities.data.records);
				$scope.facilitiesMulti = facilities.data.records;
			});
		}
		else{
			$scope.facilitiesMulti = [];
			$scope.multipleFacilities.selectedFacility = [];
			$scope.groupsMulti = [];
			$scope.multipleGroups.selectedGroups = [];
			$scope.showFacilities = false;
			$scope.showgroups = false;
		}

	}
	
	$scope.getDegree = function () {
		var seleted_role = typeof $scope.formData.role === "undefined" ? "undefined" : $scope.formData.role;

//          Call Role validation to show role error
		$scope.registerform.role.$invalid = seleted_role === "undefined" ? true : false;
		$scope.roleValidation();
		$scope.showdegree = false;
		$scope.showspecialty = false;
		$scope.showgroups = false;

		if (seleted_role == 'PN' || seleted_role == 'SN') {
			$scope.alldegrees = physicianDegrees;
			$scope.showdegree = true;
		}
		else if (seleted_role == 'BR') {
			$scope.alldegrees = bedCoordinatorDegrees;
			$scope.showdegree = true;
		}
		else if (seleted_role == 'RE'){
			$scope.alldegrees = nurseDegrees;
			$scope.showdegree = true;
		}
		else if (seleted_role == 'PT') {
			$scope.alldegrees = physicianAssistantDegrees;
			$scope.showdegree = true;
		}

		if (seleted_role == 'PN' || seleted_role == 'SN') {
			$scope.showspecialty = true;
				if ( ($scope.formData.category == 'HL' && seleted_role == 'PN') ||
					 ($scope.formData.category == 'CC' && seleted_role == 'SN') ) {
				$scope.showgroups = true;
			}
		}


	}

	$scope.errors = {};
	$scope.createUser = function () {
		if ($scope.formData.category != 'AS' && $scope.formData.category != 'HR' && 
				$scope.multipleFacilities.hasOwnProperty('selectedFacility')) {
			$scope.formData.facility_id = $scope.multipleFacilities.selectedFacility;
		}
		
		if ( ( ($scope.formData.category == 'HL' && $scope.formData.role == 'PN') || 
				($scope.formData.category == 'CC' && $scope.formData.role == 'SN') ) &&
				$scope.multipleGroups.hasOwnProperty('selectedGroups') ) {
			$scope.formData.group_id = $scope.multipleGroups.selectedGroups;
		}
		$http.post(serviceUrl + 'users', $scope.formData).success(function (response, status, headers, config) {
			if (response.success) {
				$location.path('/app/users');
			}
			else {
				$scope.errors = response.errors;
				showServiceErrors(response.errors);
			}
		});
	}
	
//      Validation code is starting from here

	$scope.showFirstNameErr = false;
	$scope.firstNameErrorMsg = ""; 

	$scope.showLastNameErr = false;
	$scope.lastNameErrorMsg = ""; 

	$scope.showUserNameErr = false;
	$scope.userNameErrorMsg = ""; 

	$scope.showEmailErr = false;
	$scope.emailErrorMsg = ""; 

	$scope.showCellErr = false;
	$scope.cellErrorMsg = ""; 

	$scope.showCategoryErr = false;
	$scope.categoryErrorMsg = ""; 

	$scope.showRoleErr = false;
	$scope.roleErrorMsg = ""; 
	
	$scope.showDegreeErr = false;
	$scope.degreeErrorMsg = ""; 
	
	$scope.showNpiErr = false;
	$scope.npiErrorMsg = ""; 
	
	$scope.showSpecialtyErr = false;
	$scope.specialtyErrorMsg = ""; 
	
	$scope.showFacilityErr = false;
	$scope.facilityErrorMsg = "";
	
	$scope.showGroupErr = false;
	$scope.groupErrorMsg = "";
	
	
	function showServiceErrors(errors){
		if('first_name' in errors){
			$scope.showFirstNameErr = true;
			$scope.firstNameErrorMsg = $scope.errors['first_name'][0]; 
		}
		if('last_name' in errors){
			$scope.showLastNameErr = true;
			$scope.lastNameErrorMsg = $scope.errors['last_name'][0]; 
		}
		if('email' in errors){
			$scope.showEmailErr = true;
			$scope.emailErrorMsg = $scope.errors['email'][0]; 
		}
		
		if('user_name' in errors){
			$scope.showUserNameErr = true;
			$scope.userNameErrorMsg = $scope.errors['user_name'][0]; 
		}

		if('cell_phone' in errors){
			$scope.showCellErr = true;
			$scope.cellErrorMsg = $scope.errors['cell_phone'][0];
		}

		if('category' in errors){
			$scope.showCategoryErr = true;
			$scope.categoryErrorMsg = $scope.errors['category'][0]; 
		}
		
		
		if('role' in errors){
			$scope.showRoleErr = true;
			$scope.roleErrorMsg = $scope.errors['role'][0];
		}
		if('npi' in errors){
			$scope.showNpiErr = true;
			$scope.npiErrorMsg = $scope.errors['npi'][0]; 
		}

		if('degree' in errors){
			$scope.showDegreeErr = true;
			$scope.degreeErrorMsg = $scope.errors['degree'][0]; 
		}
		
		if('specialty' in errors){
			$scope.showSpecialtyErr = true;
			$scope.specialtyErrorMsg = $scope.errors['specialty'][0]; 
		}
		if('facilities' in errors){
			$scope.showFacilityErr = true;
			$scope.facilityErrorMsg = $scope.errors['facilities'][0]; 
		}

		if('groups' in errors){
			$scope.showGroupErr = true;
			$scope.groupErrorMsg = $scope.errors['groups'][0]; 
		}

	}
	
	
	$scope.firstNameValidation = function(eventName){
//            console.log('Required validation called');
		var pattern = /^[A-Za-z\s-'.,]+$/;
		if($scope.registerform.firstName.$invalid){
			$scope.showFirstNameErr = true;
			$scope.firstNameErrorMsg = "You cannot leave this field blank"; 
		}
		else if( (!pattern.test($scope.formData.first_name)) ){      
			$scope.showFirstNameErr = true;
			$scope.firstNameErrorMsg = "First name should contain alphabets and (-'.,)"; 
		}
		else{
			$scope.showFirstNameErr = false;
			$scope.firstNameErrorMsg = ""; 
		}
	};
	
	$scope.lastNameValidation = function(eventName){
//            console.log('Required validation called');
		var pattern = /^[A-Za-z\s-'.,]+$/;
		if($scope.registerform.lastName.$invalid){
			$scope.showLastNameErr = true;
			$scope.lastNameErrorMsg = "You cannot leave this field blank"; 
		}
		else if( (!pattern.test($scope.formData.last_name)) ){      
			$scope.showLastNameErr = true;
			$scope.lastNameErrorMsg = "Last name should contain alphabets and (-'.,)"; 
		}
		else{
			$scope.showLastNameErr = false;
			$scope.lastNameErrorMsg = ""; 
		}
	};
	
	$scope.userNameValidation = function(eventName){
//            console.log('Required validation called');
		var pattern = /^[^0-9.][a-z.]+[a-z0-9]+$/;
		if($scope.registerform.userName.$invalid){
			$scope.showUserNameErr = true;
			$scope.userNameErrorMsg = "You cannot leave this field blank"; 
		}
//          Check username is unique code goes here
		else if( (!pattern.test($scope.formData.user_name)) || 
				$scope.formData.user_name.length < 6 || 
				$scope.formData.user_name.length > 32){      
			$scope.showUserNameErr = true;
			$scope.userNameErrorMsg = "Username can contain at least 6 or at most 32 characters with periods or numbers"; 
		}
		else if(eventName == "blur" && $scope.formData.user_name != ""){
//              Send ajax call and verify facility name is unique
			var userUrl = serviceUrl+'users?fields=user_name&filter={"search_type" : "all_users",' +
					' "search_by" : "u_name", "search_text" : "'+ $scope.formData.user_name +'", "search_op" : "equal"}';
			var userRequest = $http.get(userUrl);
					userRequest.success(function(data, status, headers, config) { 
//                          console.log(data.data);
					if(data.data.records.length){
						$scope.showUserNameErr = true;
						$scope.userNameErrorMsg = "Please enter unique user name"; 
					}
			});

		}
		else{
			$scope.showUserNameErr = false;
			$scope.userNameErrorMsg = ""; 
		}
	};
	
	$scope.emailValidation = function(eventName){
//            console.log('Required validation called');
		var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
		if($scope.registerform.email.$invalid){
			$scope.showEmailErr = true;
			$scope.emailErrorMsg = "You cannot leave this field blank"; 
		}
		else if( !pattern.test($scope.formData.email)){      
			$scope.showEmailErr = true;
			$scope.emailErrorMsg = "Please enter a valid email address for the user"; 
		}
		else{
			$scope.showEmailErr = false;
			$scope.emailErrorMsg = ""; 
		}
	};
	
	$scope.cellPhoneValidation = function(eventName){
//            console.log('Required validation called');
		var pattern = /^[0-9]+$/;
		if($scope.registerform.cellPhone.$invalid){
			$scope.showCellErr = true;
			$scope.cellErrorMsg = "You cannot leave this field blank"; 
		}
		else if( !pattern.test($scope.formData.cell_phone) || 
				$scope.formData.cell_phone.length   !== 10 ){      
			$scope.showCellErr = true;
			$scope.cellErrorMsg = "Please enter a cell phonenumber for the user"; 
		}
		else{
			$scope.showCellErr = false;
			$scope.cellErrorMsg = ""; 
		}
	};
	
	$scope.categoryValidation = function(eventName){
//            console.log('category validation called');
//          Change input field name
		if($scope.registerform.category.$invalid){
			$scope.showCategoryErr = true;
			$scope.categoryErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showCategoryErr = false;
			$scope.categoryErrorMsg = "";
		}
	};
	
	$scope.roleValidation = function(eventName){
//            console.log('role validation called');
//            console.log($scope.registerform.role.$invalid);
//          Change input field name
		if($scope.registerform.role.$invalid){
			$scope.showRoleErr = true;
			$scope.roleErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showRoleErr = false;
			$scope.roleErrorMsg = ""; 
		}
	};
	
	$scope.degreeValidation = function(eventName){
//            console.log('degree validation called');
		if($scope.registerform.degree.$invalid){
			$scope.showDegreeErr = true;
			$scope.degreeErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showDegreeErr = false;
			$scope.degreeErrorMsg = ""; 
		}
	};
	
	$scope.specialtyValidation = function(eventName){
//            console.log('specialty validation called');
		if($scope.registerform.specialty.$invalid){
			$scope.showSpecialtyErr = true;
			$scope.specialtyErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showSpecialtyErr = false;
			$scope.specialtyErrorMsg = "";
		}
	};
	
	$scope.facilityValidation = function(eventName){
//            console.log('facility validation called');
		if($scope.registerform.facility.$invalid){
			$scope.showFacilityErr = true;
			$scope.facilityErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showFacilityErr = false;
			$scope.facilityErrorMsg = "";
		}
	};
	
	$scope.groupValidation = function(eventName){
//            console.log('group validation called');
		if($scope.registerform.group.$invalid){
			$scope.showGroupErr = true;
			$scope.groupErrorMsg = "You cannot leave this field blank"; 
		}
		else{
			$scope.showGroupErr = false;
			$scope.groupErrorMsg = "";
		}
	};
	
	$scope.npiValidation = function(eventName){
//            console.log('npi validation called');
		var pattern = /^[0-9]+$/;
		if($scope.registerform.npi.$invalid){
			$scope.showNpiErr = true;
			$scope.npiErrorMsg = "You cannot leave this field blank"; 
		}
		else if( !pattern.test($scope.formData.npi) || $scope.formData.npi.length !== 10 ){      
			$scope.showNpiErr = true;
			$scope.npiErrorMsg = "Please enter a valid 10 digit NPI for user"; 
		}
		else if(eventName == "blur" && $scope.formData.npi != ""){
//                  Send ajax call and verify npi is unique
			var userUrl = serviceUrl+'users?fields=npi&filter={"search_type" : "all_users",' + 
					' "search_by": "npi", "search_text": "' + $scope.formData.npi +'"}'
//                    console.log(facilityUrl);
			var userRequest = $http.get(userUrl);
					userRequest.success(function(data, status, headers, config) { 
//                          console.log(data.data);
					if(data.data.records.length){
						$scope.showNpiErr = true;
						$scope.npiErrorMsg = "Please enter unique NPI"; 
					}
			});

		}
		else{
			$scope.showNpiErr = false;
			$scope.npiErrorMsg = "";
		}
	};
        

})
/*User Edit*/
.controller("editUserController", function ($scope, $stateParams, $http, $rootScope, $state) {
        var user_id = $stateParams.id;
        var fields = '?fields=first_name,last_name,user_name,category,role,middle_name,email,cell_phone,degree,npi,specialty,notify,enable_two_step_verification,deactivate,time_zone,isReal';
        var serviceUrl = $rootScope.globals.serviceUrl;
        var userNameOld;
        var npiOld;
        var physicianDegrees = [];
        var nurseDegrees = [];
        var physicianAssistantDegrees = [];
        var bedCoordinatorDegrees = [];
        
        $scope.showFacilities = $scope.showdegree = $scope.showspecialty = false;
        $scope.isRealDisabled = false;
        
        $scope.multipleFacilities = {};
        $scope.multipleFacilities.selectedFacility = [];
        $scope.facilitiesMulti = [];

        $scope.multipleOnCallGroups = {};
        $scope.multipleOnCallGroups.selectedOnCallGroups = [];
        $scope.onCallGroupsMulti = [];

        $scope.multipleGroups = {};
        $scope.multipleGroups.selectedGroups = [];
        $scope.groupsMulti = [];
        
        var facilityGroups = {};
        
        $scope.populateFacilities = function($event){
            if ($event !== undefined && 
                    $scope.formData.category != undefined && 
                    $scope.formData.category != 'AS' && 
                    $scope.formData.category != 'HR') {
                
                $scope.groupsMulti = [];
                $scope.multipleFacilities.selectedFacility = [];
                $scope.multipleGroups.selectedGroups = [];
                var checkbox = $event.target;
                var searchCategoryStr = checkbox.checked ? "real" : "test"
                var facilitiesFilter = 'facilities?fields=id,name,type&filter={"search_category": "' + searchCategoryStr  +'", "search_type":"active_hf","search_by":"hf_type","search_text":"' + $scope.formData.category + '"}';

                $http.get(serviceUrl + facilitiesFilter).success(function (data, status, headers, config) {
                    $scope.facilitiesMulti = data.data.records || [];
                });
            }
            else{
                console.log('Error');
            }
        }
        
		$scope.onFacilitySelect = function (model){
			$scope.groupsMulti = [];
			facilityGroups=[];
			if(model.length){
				var category = $scope.formData.category;
				var role = $scope.formData.role;
				angular.forEach(model, function(item){
					if ( (category == 'HL' && role == 'PN') || (category == 'CC' && role == 'SN') ) {
						$http.get(serviceUrl + 'facilities/' + item).success(function (data, status, headers, config) {
							var groupsIds = [];
							for (var i = 0; i < data.data.groups.length; i++) {
								groupsIds.push(data.data.groups[i].id);
								$scope.groupsMulti.push(data.data.groups[i]);
							}
							if(groupsIds.length){
								facilityGroups[item] = groupsIds;
							}
						});
					}
				});
				
			}
		};
        
        $scope.onGroupSelect = function (items){
			$scope.onCallGroupsMulti = [];
			if(items.length){
				angular.forEach(items, function(item){
					angular.forEach($scope.groupsMulti, function(value, key){
						if (value.id === item){
							$scope.onCallGroupsMulti.push(value);
							
						}
						
					})
				})
			}
        }
        
        $scope.onGroupRemoved = function (item, model) {
            $scope.onCallGroupsMulti = _.without($scope.onCallGroupsMulti, _.findWhere($scope.onCallGroupsMulti, {id: model}));
            $scope.multipleOnCallGroups.selectedOnCallGroups = 
                    _.without($scope.multipleOnCallGroups.selectedOnCallGroups, model);

        }
        
        
        $http.get(serviceUrl + 'users/' + user_id + fields).success(function (data, status, headers, config) {
            $scope.formData = data.data;
            userNameOld = $scope.formData.user_name;
            npiOld = $scope.formData.npi;
            
            if($scope.formData.groups.length || $scope.formData.facilities.length){
                $scope.isRealDisabled = true;
            }

            $http.get(serviceUrl + 'user-categories').success(function (categories, status, headers, config) {
                $scope.categories = categories.data.records;
                if ($scope.formData.category != null && $scope.formData.category != 'AS' && $scope.formData.category != 'HR') {
                    var searchCategory = $scope.formData.isReal == 'T' ? "real" : "test";
                    var facilityFilter = '?fields=id,name&filter={"search_category": "' + searchCategory +'", "search_type":"active_hf","search_by":"hf_type","search_text":"' + $scope.formData.category + '"}';
                    $http.get(serviceUrl + 'facilities' + facilityFilter).success(function (facilities, status, headers, config) {
                        $scope.showFacilities = true;
                        $scope.facilitiesMulti = facilities.data.records;
                        var arr = [];
                        for (var k = 0; k < $scope.formData.facilities.length; k++) {
                            arr.push($scope.formData.facilities[k].id);
                        }
                        $scope.multipleFacilities.selectedFacility = arr;
                        
                        if ( ($scope.formData.category == 'HL' && $scope.formData.role == 'PN') || 
                                ($scope.formData.category == 'CC' && $scope.formData.role == 'SN') ) {
                            $http.get(serviceUrl + 'facilities/' + $scope.multipleFacilities.selectedFacility).success(function (data, status, headers, config) {
                                $scope.showgroups = true;
                                if($.isArray(data.data)){
                                    angular.forEach(data.data, function(facilityObj, index, facilityList){
                                        facilityGroups[facilityObj.id] = [];
                                        angular.forEach(facilityObj.groups, function(groupsObj, index, groupsList){
                                            $scope.groupsMulti.push(groupsObj);
                                            facilityGroups[facilityObj.id].push(groupsObj.id);
                                        });
                                    });
                                }
                                else{
                                    facilityGroups[data.data.id] = [];
                                    for (var groupsCount = 0; groupsCount < data.data.groups.length; groupsCount++) {
                                        $scope.groupsMulti.push(data.data.groups[groupsCount]);
                                        facilityGroups[data.data.id].push(data.data.groups[groupsCount].id)
                                    }
                                }
                                
                                var arr = [];
                                angular.forEach($scope.formData.groups, function(groupsObj, index, groupsList){
                                    arr.push(groupsObj.id);
                                    $scope.onCallGroupsMulti.push(groupsObj);
                                });
                                var onCallArr = [];
                                angular.forEach($scope.formData.on_call_groups, function(groupsObj, index, groupsList){
                                    onCallArr.push(groupsObj.group_id);
                                });
                                $scope.multipleOnCallGroups.selectedOnCallGroups = onCallArr;
                                $scope.multipleGroups.selectedGroups = arr;

                            });
                        }
                    });
                }

            });
            var filter_role = '?filter={"search_text":"' + $scope.formData.category + '"}';
            $http.get(serviceUrl + 'user-roles' + filter_role).success(function (userRoles, status, headers, config) {
                $scope.roles = userRoles.data.records;
            });
            $http.get(serviceUrl + 'specialties').success(function (specialties, status, headers, config) {
                $scope.allspecialties = specialties.data.records;
            });            
            $http.get(serviceUrl + 'degrees').success(function (degrees, status, headers, config) {
                    for (var i = 0; i < degrees.data.records.length; i++) {
                    var degreeObj = degrees.data.records[i];
                    if(degreeObj.value == 'DO' || degreeObj.value == 'MD'){
                        physicianDegrees.push(degreeObj);
                    }
                    else if(degreeObj.value == 'NP' ){
                        nurseDegrees.push(degreeObj);
                        bedCoordinatorDegrees.push(degreeObj);
                    }
                    else if(degreeObj.value == 'PA' ){
                        physicianAssistantDegrees.push(degreeObj);
                        bedCoordinatorDegrees.push(degreeObj);
                    }
                }
                
                if ($scope.formData.role == 'PN' || $scope.formData.role == 'SN') {
                    $scope.alldegrees = physicianDegrees;
                    $scope.showdegree = true;
                }
                else if ($scope.formData.role == 'BR') {
                    $scope.alldegrees = bedCoordinatorDegrees;
                    $scope.showdegree = true;
                }
                else if ($scope.formData.role == 'RE'){
                    $scope.alldegrees = nurseDegrees;
                    $scope.showdegree = true;
                }
                else if ($scope.formData.role == 'PT') {
                    $scope.alldegrees = physicianAssistantDegrees;
                    $scope.showdegree = true;
                }

            });
            
            if ($scope.formData.role == 'PN' || $scope.formData.role == 'SN') {
                    $scope.showspecialty = true;
                }


        });

        $scope.getRoles = function () {
            var categoryVal = typeof $scope.formData.category === "undefined" ? "undefined" : $scope.formData.category;
            if(categoryVal === "undefined"){
                $scope.registerform.category.$invalid = true;
                $scope.categoryValidation();
                $scope.registerform.role.$invalid = true;
                $scope.roleValidation();
            }
            else{
                $scope.registerform.category.$invalid = false;
                $scope.categoryValidation();
            }
                        
            var roleFilter = '?filter={"search_text":"' + categoryVal + '"}';
            $http.get(serviceUrl + 'user-roles' + roleFilter).success(function (roles, status, headers, config) {
                $scope.formData.role = '';
                $scope.roles = roles.data.records;
                
            });
            if ($scope.formData.category != 'AS' && $scope.formData.category != 'HR') {
                $scope.facilitiesMulti = [];
                $scope.multipleFacilities.selectedFacility = [];
                $scope.groupsMulti = [];
                $scope.multipleGroups.selectedGroups = [];
                $scope.showFacilities = true;
                if ( !( ($scope.formData.category == 'HL' && $scope.formData.role == 'PN') || 
                        ($scope.formData.category == 'CC' && $scope.formData.role == 'SN') ) ) {
                    $scope.showgroups = false;
                }
                var searchCategory = $scope.formData.isReal == 'T' ? "real" : "test";
                var facilityFilter = '?fields=id,name&filter={"search_category": "' + searchCategory +'", "search_type":"active_hf","search_by":"hf_type","search_text":"' + categoryVal + '"}';
                $http.get(serviceUrl + 'facilities' + facilityFilter).success(function (facilities, status, headers, config) {
                    $scope.facilitiesMulti = facilities.data.records;
                });
            }
            else{
                $scope.facilitiesMulti = [];
                $scope.multipleFacilities.selectedFacility = [];
                $scope.groupsMulti = [];
                $scope.multipleGroups.selectedGroups = [];
                $scope.showFacilities = false;
                $scope.showgroups = false;
            }

        }
        
        $scope.getDegree = function () {
            var seleted_role = typeof $scope.formData.role === "undefined" ? "undefined" : $scope.formData.role;

            $scope.registerform.role.$invalid = seleted_role === "undefined" ? true : false;
            $scope.roleValidation();
            $scope.showdegree = false;
            $scope.showspecialty = false;
            $scope.showgroups = false;

            if (seleted_role == 'PN' || seleted_role == 'SN') {
                $scope.alldegrees = physicianDegrees;
                $scope.showdegree = true;
            }
            else if (seleted_role == 'BR') {
                $scope.alldegrees = bedCoordinatorDegrees;
                $scope.showdegree = true;
            }
            else if (seleted_role == 'RE'){
                $scope.alldegrees = nurseDegrees;
                $scope.showdegree = true;
            }
            else if (seleted_role == 'PT') {
                $scope.alldegrees = physicianAssistantDegrees;
                $scope.showdegree = true;
            }

            if (seleted_role == 'PN' || seleted_role == 'SN') {
                $scope.showspecialty = true;
                    if ( ($scope.formData.category == 'HL' && seleted_role == 'PN') ||
                         ($scope.formData.category == 'CC' && seleted_role == 'SN') ) {
                    $scope.showgroups = true;
                }
            }


        }
             
        $scope.updateUser = function () {
            if ($scope.formData.category != 'AS' && $scope.formData.category != 'HR' && 
                    $scope.multipleFacilities.hasOwnProperty('selectedFacility')) {
                $scope.formData.facility_id = $scope.multipleFacilities.selectedFacility;
            }
            
            if ( ( ($scope.formData.category == 'HL' && $scope.formData.role == 'PN') || 
                    ($scope.formData.category == 'CC' && $scope.formData.role == 'SN') ) &&
                    $scope.multipleGroups.hasOwnProperty('selectedGroups') ) {
                
                $scope.formData.group_id = $scope.multipleGroups.selectedGroups;
                if($scope.multipleOnCallGroups.hasOwnProperty('selectedOnCallGroups') && 
                        $scope.multipleOnCallGroups.selectedOnCallGroups.length){
                    $scope.formData.on_call_group_ids = $scope.multipleOnCallGroups.selectedOnCallGroups;
                }
                
            }
            
            $http.put(serviceUrl + 'users/'+user_id, $scope.formData).success(function (response, status, headers, config) {
                if (response.success) {
                    $state.go('app.users');
                }
                else {
                    $scope.errors = response.errors;
                    showServiceErrors(response.errors);

                }
            });
        }
        
        $scope.IsChked = function($event, accept) {
            if ($event !== undefined) {
                var checkbox = $event.target;
                if (checkbox.checked) {
                    var ok = window.confirm('Are you sure to Accept this?');
                    if (!ok) {
                      checkbox.checked = false;
                    }
                }
            }
        };
        

        $scope.showFirstNameErr = false;
        $scope.firstNameErrorMsg = ""; 

        $scope.showLastNameErr = false;
        $scope.lastNameErrorMsg = ""; 

        $scope.showUserNameErr = false;
        $scope.userNameErrorMsg = ""; 

        $scope.showEmailErr = false;
        $scope.emailErrorMsg = ""; 

        $scope.showCellErr = false;
        $scope.cellErrorMsg = ""; 

        $scope.showCategoryErr = false;
        $scope.categoryErrorMsg = ""; 

        $scope.showRoleErr = false;
        $scope.roleErrorMsg = ""; 
        
        $scope.showDegreeErr = false;
        $scope.degreeErrorMsg = ""; 
        
        $scope.showNpiErr = false;
        $scope.npiErrorMsg = ""; 
        
        $scope.showSpecialtyErr = false;
        $scope.specialtyErrorMsg = ""; 
        
        $scope.showFacilityErr = false;
        $scope.facilityErrorMsg = "";
        
        $scope.showGroupErr = false;
        $scope.groupErrorMsg = "";
        
        function showServiceErrors(errors){
            if('first_name' in errors){
                $scope.showFirstNameErr = true;
                $scope.firstNameErrorMsg = $scope.errors['first_name'][0]; 
            }
            if('last_name' in errors){
                $scope.showLastNameErr = true;
                $scope.lastNameErrorMsg = $scope.errors['last_name'][0]; 
            }
            if('email' in errors){
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = $scope.errors['email'][0]; 
            }
            
            if('user_name' in errors){
                $scope.showUserNameErr = true;
                $scope.userNameErrorMsg = $scope.errors['user_name'][0]; 
            }

            if('cell_phone' in errors){
                $scope.showCellErr = true;
                $scope.cellErrorMsg = $scope.errors['cell_phone'][0];
            }

            if('category' in errors){
                $scope.showCategoryErr = true;
                $scope.categoryErrorMsg = $scope.errors['category'][0]; 
            }
            
            
            if('role' in errors){
                $scope.showRoleErr = true;
                $scope.roleErrorMsg = $scope.errors['role'][0];
            }
            if('npi' in errors){
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = $scope.errors['npi'][0]; 
            }

            if('degree' in errors){
                $scope.showDegreeErr = true;
                $scope.degreeErrorMsg = $scope.errors['degree'][0]; 
            }
            
            if('specialty' in errors){
                $scope.showSpecialtyErr = true;
                $scope.specialtyErrorMsg = $scope.errors['specialty'][0]; 
            }
            if('facilities' in errors){
                $scope.showFacilityErr = true;
                $scope.facilityErrorMsg = $scope.errors['facilities'][0]; 
            }

            if('groups' in errors){
                $scope.showGroupErr = true;
                $scope.groupErrorMsg = $scope.errors['groups'][0]; 
            }

        }
        
        $scope.firstNameValidation = function(eventName){
            var pattern = /^[A-Za-z\s-'.,]+$/;
            if($scope.registerform.firstName.$invalid){
                $scope.showFirstNameErr = true;
                $scope.firstNameErrorMsg = "You cannot leave this field blank"; 
            }
            else if( (!pattern.test($scope.formData.first_name)) ){      
                $scope.showFirstNameErr = true;
                $scope.firstNameErrorMsg = "First name should contain alphabets and (-'.,)"; 
            }
            else{
                $scope.showFirstNameErr = false;
                $scope.firstNameErrorMsg = ""; 
            }
        };
        
        $scope.lastNameValidation = function(eventName){
            var pattern = /^[A-Za-z\s-'.,]+$/;
            if($scope.registerform.lastName.$invalid){
                $scope.showLastNameErr = true;
                $scope.lastNameErrorMsg = "You cannot leave this field blank"; 
            }
            else if( (!pattern.test($scope.formData.last_name)) ){      
                $scope.showLastNameErr = true;
                $scope.lastNameErrorMsg = "Last name should contain alphabets and (-'.,)"; 
            }
            else{
                $scope.showLastNameErr = false;
                $scope.lastNameErrorMsg = ""; 
            }
        };
        
        $scope.userNameValidation = function(eventName){
            var pattern = /^[^0-9.][a-z.]+[a-z0-9]+$/;
            if($scope.registerform.userName.$invalid){
                $scope.showUserNameErr = true;
                $scope.userNameErrorMsg = "You cannot leave this field blank"; 
            }
			/*Check username is unique code goes here*/
            else if( (!pattern.test($scope.formData.user_name)) || 
                    $scope.formData.user_name.length < 6 || 
                    $scope.formData.user_name.length > 32){      
                $scope.showUserNameErr = true;
                $scope.userNameErrorMsg = "Username can contain at least 6 or at most 32 characters with periods or numbers"; 
            }
            else if(eventName == "blur" && $scope.formData.user_name != "" && $scope.formData.user_name != userNameOld){
				/*Send ajax call and verify facility name is unique*/
                var userUrl = serviceUrl+'users?fields=user_name&filter={"search_type" : "all_users",' +
                        ' "search_by" : "u_name", "search_text" : "'+ $scope.formData.user_name +'", "search_op" : "equal"}';
                    
                var userRequest = $http.get(userUrl);
                        userRequest.success(function(data, status, headers, config) { 
                        if(data.data.records.length){
                            $scope.showUserNameErr = true;
                            $scope.userNameErrorMsg = "Please enter unique user name"; 
                        }
                });

            }
            else{
                $scope.showUserNameErr = false;
                $scope.userNameErrorMsg = ""; 
            }
        };
        
        $scope.emailValidation = function(eventName){
            var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            if($scope.registerform.email.$invalid){
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.formData.email)){      
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = "Please enter a valid email address for the user"; 
            }
            else{
                $scope.showEmailErr = false;
                $scope.emailErrorMsg = ""; 
            }
        };
        
        $scope.cellPhoneValidation = function(eventName){
            var pattern = /^[0-9]+$/;
            if($scope.registerform.cellPhone.$invalid){
                $scope.showCellErr = true;
                $scope.cellErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.formData.cell_phone) || 
                    $scope.formData.cell_phone.length   !== 10 ){      
                $scope.showCellErr = true;
                $scope.cellErrorMsg = "Please enter a cell phonenumber for the user"; 
            }
            else{
                $scope.showCellErr = false;
                $scope.cellErrorMsg = ""; 
            }
        };
        
        $scope.categoryValidation = function(eventName){
            if($scope.registerform.category.$invalid){
                $scope.showCategoryErr = true;
                $scope.categoryErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showCategoryErr = false;
                $scope.categoryErrorMsg = "";
            }
        };
        
        $scope.roleValidation = function(eventName){
            if($scope.registerform.role.$invalid){
                $scope.showRoleErr = true;
                $scope.roleErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showRoleErr = false;
                $scope.roleErrorMsg = ""; 
            }
        };
        
        $scope.degreeValidation = function(eventName){
            if($scope.registerform.degree.$invalid){
                $scope.showDegreeErr = true;
                $scope.degreeErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showDegreeErr = false;
                $scope.degreeErrorMsg = ""; 
            }
        };
        
        $scope.specialtyValidation = function(eventName){
            if($scope.registerform.specialty.$invalid){
                $scope.showSpecialtyErr = true;
                $scope.specialtyErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showSpecialtyErr = false;
                $scope.specialtyErrorMsg = "";
            }
        };
        
        $scope.facilityValidation = function(eventName){
            if($scope.registerform.facility.$invalid){
                $scope.showFacilityErr = true;
                $scope.facilityErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showFacilityErr = false;
                $scope.facilityErrorMsg = "";
            }
        };
        
        $scope.groupValidation = function(eventName){
            console.log('specialty validation called');
            if($scope.registerform.group.$invalid){
                $scope.showGroupErr = true;
                $scope.groupErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showGroupErr = false;
                $scope.groupErrorMsg = "";
            }
        };
        
        $scope.npiValidation = function(eventName){
            var pattern = /^[0-9]+$/;
            if($scope.registerform.npi.$invalid){
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.formData.npi) || $scope.formData.npi.length !== 10 ){      
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = "Please enter a valid 10 digit NPI for user"; 
            }
            else if(eventName == "blur" && $scope.formData.npi != "" && $scope.formData.npi != npiOld){
				/*Send ajax call and verify npi is unique*/
                var userUrl = serviceUrl+'users?fields=npi&filter={"search_type" : "all_users",' + 
                        ' "search_by": "npi", "search_text": "' + $scope.formData.npi +'"}'
                var userRequest = $http.get(userUrl);
                        userRequest.success(function(data, status, headers, config) { 
                        if(data.data.records.length){
                            $scope.showNpiErr = true;
                            $scope.npiErrorMsg = "Please enter unique NPI"; 
                        }
                });
            }
            else{
                $scope.showNpiErr = false;
                $scope.npiErrorMsg = "";
            }
        };
})
/*Facility List*/
.controller("facilityListController", function ($scope, $http, $rootScope) {
        var baseServiceUrl = $rootScope.globals.serviceUrl;
        var serviceUrl = baseServiceUrl+'facilities';
        var fields = 'id,name,type,isReal,created,updated';

        $scope.pagesToShow = 5;
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.recordsPerPage = 10;
        
        $scope.pageChanged = function() {
            $scope.searchFacilities();
        };


        $scope.showSearchBtn = $scope.showNameField = $scope.showTypeField = $scope.showGroupField = false;

        $scope.facility = {};
        $scope.facility.selectedTypes = [];
        $scope.facilityTypes = [
            {value: "cc", name: "Clinic"},
            {value: "et", name: "Emergency Department"},
            {value: "ft", name: "FSED"},
            {value: "hl", name: "Hospital"},
        ];
        
        $scope.multipleGroups = {};
        $scope.multipleGroups.selectedGroups = [];
        $scope.groupsMulti = [];

        $scope.formData = {searchOption: "real", facilitiesOptions: "all_hf", searchBy: "all"};
        
        $scope.$watch(function(scope) { return scope.formData.searchOption },
              function(newValue, oldValue) {
                  if($scope.formData.searchBy == 'hg_name'){
                        $scope.multipleGroups.selectedGroups = [];
                        var groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + newValue
                                            + '","search_type" : "all_hg", "search_by" : "all"}';
                        $http.get(baseServiceUrl+groupsFilter).success(function(data, status, headers, config) { 
                            $scope.groupsMulti = data.data.records;
                            $scope.showGroupField = true;
                        });
                  }
              }
        );
        
        $scope.showFields = function (){
            if($scope.formData.searchBy == 'hf_name'){ 
                $scope.showSearchBtn = true;
                $scope.showNameField = true;
                $scope.showTypeField = false;
                $scope.showGroupField = false;
                $scope.multipleGroups.selectedGroups = [];
                $scope.facility.selectedTypes = [];
            }
            else if($scope.formData.searchBy == 'hf_type'){ 
                $scope.showSearchBtn = true;
                $scope.showTypeField = true;
                $scope.showNameField = false;
                $scope.showGroupField = false;
                $scope.multipleGroups.selectedGroups = [];
                $scope.formData.facilityName = undefined;
            }
            else if($scope.formData.searchBy == 'hg_name'){
                $scope.showNameField = false;
                $scope.showTypeField = false;
                $scope.facility.selectedTypes = [];
                $scope.formData.facilityName = undefined;
                var searchCategoryStr = $scope.formData.searchOption == 'real' ? "real" : "test"
                var groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr
                        + '","search_type" : "all_hg", "search_by" : "all"}';
                $http.get(baseServiceUrl+groupsFilter).success(function(data, status, headers, config) { 
                    $scope.groupsMulti = data.data.records;
                    $scope.showGroupField = true;
                    $scope.showSearchBtn = true;
                });
            }
            else{
                $scope.formData.facilityName = undefined;
                $scope.multipleGroups.selectedGroups = [];
                $scope.facility.selectedTypes = [];
                $scope.showNameField = false;
                $scope.showTypeField = false;
                $scope.showGroupField = false;
                $scope.showSearchBtn = false;
            }
            
        }
        
        $scope.setPageToInitial = function(id){
            $scope.currentPage = 1;
            if(id == "searchOption"){
                $scope.formData.searchBy = "all";
                $scope.showFields();
            }
            if($scope.formData.searchBy == "all"){
                $scope.searchFacilities();
            }
            else if( ($scope.formData.facilityName != undefined && $scope.formData.facilityName != "" ) || 
                            $scope.facility.selectedTypes.length || 
                            $scope.multipleGroups.selectedGroups.length){
                $scope.searchFacilities();
            }
            
        }
        
        $scope.searchFacilities = function(){
            var facilitiesFilter = '?filter={"search_category" : "' +  $scope.formData.searchOption + '","search_type" : "' + 
                                   $scope.formData.facilitiesOptions + '", "search_by" : "' + $scope.formData.searchBy + '" ';
            if($scope.showNameField){
                facilitiesFilter += ',"search_text": "' + $scope.formData.facilityName + '"';
            }
            else if($scope.showTypeField){
                facilitiesFilter += ',"search_text": "' + $scope.facility.selectedTypes + '"';

            }
            else if($scope.showGroupField){
                facilitiesFilter += ',"search_text": "' + $scope.multipleGroups.selectedGroups + '"';
            }

            facilitiesFilter += '}&fields=' + fields
            facilitiesFilter += '&page=' + $scope.currentPage + '&limit=' + $scope.recordsPerPage;
            $http.get(serviceUrl + facilitiesFilter).success(function(data, status, headers, config) { 
                $scope.facilities = data.data.records;
                $scope.totalItems = data.data.total_records;
            });
        };
        $scope.searchFacilities();
  	
})
/*Facility Create*/
.controller("createFacilityController", function ($scope, $http, $state, $rootScope, $stateParams) {
        var isReal = $stateParams.real;
        var serviceUrl = $rootScope.globals.serviceUrl;
        $scope.fields = {isReal: isReal};
        $scope.showHelpDiv = false;
        var searchSubAdminQuery = 'users?fields=id,user_name&filter={ "search_type" : "all_users", "search_by" : "u_role", "search_sub_category" : "as", "search_role": "sr"}';
        var quicareSupportQuery = 'users?fields=id,user_name&filter={ "search_type" : "all_users", "search_by" : "u_role", "search_sub_category" : "as", "search_role": "qt"}';
        
        $scope.person = {};
        $scope.people = [];
        $http.get(serviceUrl + searchSubAdminQuery).success(function (data, status, headers, config) {
            $scope.people = data.data.records || [];
            $http.get(serviceUrl + quicareSupportQuery).success(function (data, status, headers, config) {
                for (var i = 0; i < data.data.records.length; i++) {
                    $scope.people.push(data.data.records[i]);
                }
            });
        });
        
        
        
        $scope.reset = function(){
            delete $scope.person.selected;
        }
        
        $http.get(serviceUrl + 'facility-types').success(function (data, status, headers, config) {
            $scope.ftypes = data.data.records;
        });
        $http.get(serviceUrl + 'states').success(function (data, status, headers, config) {
            $scope.states = data.data.records;
        });
        
        $scope.multipleGroups = {};
//        $scope.multipleGroups.selectedGroups = [];
        $scope.groupsMulti = [];
        
        
        $scope.getGroups = function(){
            var searchCategoryStr = $scope.fields.isReal == 'T' ? "real" : "test"
            var groupsFilter = "";
//            For hospital Groups
            if($scope.fields.type == "HL"){
                groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + 
                        searchCategoryStr + '" ,"search_type" : "active_hg","search_by" : "hg_unused"}';
            }
//            For clinic Groups
            else if($scope.fields.type != undefined){
                groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + 
                        searchCategoryStr + '" ,"search_type" : "active_hg","search_by" : "all"}';
            }
            else{
                $scope.groupsMulti = [];
                $scope.multipleGroups.selectedGroups = [];
            }
            
            if($scope.fields.type != undefined){
                $http.get(serviceUrl + groupsFilter).success(function (data, status, headers, config) {
                    $scope.groupsMulti = data.data.records;
                });
            }
            
        }

        $scope.errors = {};
        $scope.createFacility = function () {
            $scope.fields.quicare_representative = $scope.person.hasOwnProperty('selected') ? $scope.person.selected : 0;
            $scope.fields.group_id = $scope.multipleGroups.hasOwnProperty('selectedGroups') ? $scope.multipleGroups.selectedGroups : [];
            $http.post(serviceUrl + 'facilities', $scope.fields).success(function (response, status, headers, config) {
                if (response.success == true) {
                    $state.go('app.facilities');
                }
                else {
                    $scope.errors = response.errors;
                    showServiceErrors(response.errors);
                }
            });

        };
        
        function showServiceErrors(errors){
            if('name' in errors){
                $scope.showNameErr = true;
                $scope.nameErrorMsg = $scope.errors['name'][0]; 
            }
            if('address1' in errors){
                $scope.showAddress1Err = true;
                $scope.address1ErrorMsg = $scope.errors['address1'][0]; 
            }
            if('city' in errors){
                $scope.showCityErr = true;
                $scope.cityErrorMsg = $scope.errors['city'][0]; 
                
            }
            
            if('email' in errors){
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = $scope.errors['email'][0]; 
            }
            
            if('groups' in errors){
                $scope.showGroupErr = true;
                $scope.groupErrorMsg = $scope.errors['groups'][0]; 
            }

            if('npi' in errors){
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = $scope.errors['npi'][0];
            }

            if('phone' in errors){
                $scope.showPhoneErr = true;
                $scope.phoneErrorMsg = $scope.errors['phone'][0]; 
            }
            
            
            if('representative_contact_number' in errors){
                $scope.showRepContactErr = true;
                $scope.repContactErrorMsg = $scope.errors['representative_contact_number'][0];
            }
            if('representative_email' in errors){
                $scope.showRepEmailErr = true;
                $scope.repEmailErrorMsg = $scope.errors['representative_email'][0]; 
            }

            if('representative_name' in errors){
                $scope.showRepNameErr = true;
                $scope.repNameErrorMsg = $scope.errors['representative_name'][0]; 
            }
            
            if('state' in errors){
                $scope.showStateErr = true;
                $scope.stateErrorMsg = $scope.errors['state'][0]; 
            }
            if('type' in errors){
                $scope.showFacililtyTypeErr = true;
                $scope.facililtyTypeErrorMsg = $scope.errors['type'][0]; 
            }

            if('zip_code' in errors){
                $scope.showZipCodeErr = true;
                $scope.zipCodeErrorMsg = $scope.errors['zip_code'][0]; 
            }

        }
        
        $scope.showNameErr = false;
        $scope.nameErrorMsg = ""; 
        
        $scope.showAddress1Err = false;
        $scope.address1ErrorMsg = ""; 
        
        $scope.showCityErr = false;
        $scope.cityErrorMsg = ""; 
        
        $scope.showZipCodeErr = false;
        $scope.zipCodeErrorMsg = ""; 
        
        $scope.showStateErr = false;
        $scope.stateErrorMsg = ""; 
        
        $scope.showFacililtyTypeErr = false;
        $scope.facililtyTypeErrorMsg = ""; 
        
        $scope.showNpiErr = false;
        $scope.npiErrorMsg = "";

        $scope.showPhoneErr = false;
        $scope.phoneErrorMsg = "";

        $scope.showEmailErr = false;
        $scope.emailErrorMsg = "";

        $scope.showRepNameErr = false;
        $scope.repNameErrorMsg = "";

        $scope.showRepContactErr = false;
        $scope.repContactErrorMsg = "";

        $scope.showRepEmailErr = false;
        $scope.repEmailErrorMsg = "";

        $scope.showGroupErr = false;
        $scope.groupErrorMsg = "";
        
        $scope.nameValidation = function(eventName){
                if($scope.qcForm.name.$invalid){
                    $scope.showNameErr = true;
                    $scope.nameErrorMsg = "You cannot leave this field blank"; 
                }
                else if(eventName == "blur" && $scope.fields.name != ""){
                    var facilityUrl = serviceUrl+'facilities?fields=name&filter={"search_type" : "all_hf",' + 
                            ' "search_by": "hf_name", "search_text": "' + $scope.fields.name + '", "search_op" : "equal"}';
                    var facilityRequest = $http.get(facilityUrl);
                            facilityRequest.success(function(data, status, headers, config) { 
                            if(data.data.records.length && data.data.records[0].name){
                                $scope.showNameErr = true;
                                $scope.nameErrorMsg = "Please enter unique health care facility name"; 
                            }
                    });
                    
                }
                else{
                    $scope.showNameErr = false;
                    $scope.nameErrorMsg = ""; 
                }
        };
        
        $scope.addressValidation = function(eventName){
            if($scope.qcForm.address1.$invalid){
                $scope.showAddress1Err = true;
                $scope.address1ErrorMsg = "You cannot leave this field blank"; 
            }
            else{
                $scope.showAddress1Err = false;
                $scope.address1ErrorMsg = ""; 
            }
        };

        
        
        $scope.cityValidation = function(eventName){
            var pattern = /^[A-Za-z\s.,0-9]+$/;
            if($scope.qcForm.city.$error.required){
                $scope.showCityErr = true;
                $scope.cityErrorMsg = "You cannot leave this field blank"; 
            }
            else if( (!pattern.test($scope.fields.city)) ){      
                $scope.showCityErr = true;
                $scope.cityErrorMsg = "City contains alphabets, periods, commas and numbers only"; 
            }
            else{
                $scope.showCityErr = false;
                $scope.cityErrorMsg = ""; 
            }
        };
        
        $scope.zipCodeValidation = function(eventName){
            var pattern = /^[0-9]+$/;
            if($scope.qcForm.zipCode.$error.required){
                $scope.showZipCodeErr = true;
                $scope.zipCodeErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.zip_code) || $scope.fields.zip_code.length !== 5 ){      
                $scope.showZipCodeErr = true;
                $scope.zipCodeErrorMsg = "Please enter a valid 5 digit zip code of the Healthcare Facility"; 
            }
            else{
                $scope.showZipCodeErr = false;
                $scope.zipCodeErrorMsg = ""; 
            }
        };
        
        $scope.stateValidation = function(eventName){
                if($scope.qcForm.state.$invalid){
                    $scope.showStateErr = true;
                    $scope.stateErrorMsg = "You cannot leave this field blank"; 
                }
                else{
                    $scope.showStateErr = false;
                    $scope.stateErrorMsg = ""; 
                }
        };
        
        $scope.facililtyTypeValidation = function(eventName){
                if($scope.qcForm.facilityType.$invalid){
                    $scope.showFacililtyTypeErr = true;
                    $scope.facililtyTypeErrorMsg = "You cannot leave this field blank"; 
                }
                else{
                    $scope.showFacililtyTypeErr = false;
                    $scope.facililtyTypeErrorMsg = ""; 
                }
        };
        
        $scope.npiValidation = function(eventName){
            var pattern = /^[0-9]+$/;
            if($scope.qcForm.npi.$invalid){
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.npi) || $scope.fields.npi.length !== 10 ){      
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = "Please enter a valid 10 digit NPI of the Healthcare Facility"; 
            }
            else if(eventName == "blur" && $scope.fields.npi != ""){
                var facilityUrl = serviceUrl+'facilities?fields=npi&filter={"search_type" : "all_hf",' + 
                        ' "search_by": "npi", "search_text": "' + $scope.fields.npi +'"}'
                var facilityRequest = $http.get(facilityUrl);
                        facilityRequest.success(function(data, status, headers, config) { 
                        if(data.data.records.length){
                            $scope.showNpiErr = true;
                            $scope.npiErrorMsg = "Please enter unique NPI"; 
                        }
                });

            }
            else{
                $scope.showNpiErr = false;
                $scope.npiErrorMsg = "";
            }
        };
        
        $scope.phoneValidation = function(eventName){
		
            var pattern = /^[0-9]+$/;
            if($scope.qcForm.phone.$invalid){
                $scope.showPhoneErr = true;
                $scope.phoneErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.phone) || $scope.fields.phone.length  !== 10 ){      
                $scope.showPhoneErr = true;
                $scope.phoneErrorMsg = "Please enter Healthcare Facility’s phone number"; 
            }
            else{
                $scope.showPhoneErr = false;
                $scope.phoneErrorMsg = "";
            }
        };
        
        
        
        $scope.emailValidation = function(eventName){
            var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            if($scope.qcForm.email.$error.required){
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.email)){      
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = "Please enter a Healthcare Facility’s email address"; 
            }
            else{
                $scope.showEmailErr = false;
                $scope.emailErrorMsg = "";
            }
        };
        
        $scope.repNameValidation = function(eventName){
            var pattern = /^[A-Za-z\s-'.,]+$/;
            if($scope.qcForm.representative_name.$invalid){
                $scope.showRepNameErr = true;
                $scope.repNameErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.representative_name)){      
                $scope.showRepNameErr = true;
                $scope.repNameErrorMsg = "Please enter a representative’s name at the Healthcare Facility"; 
            }
            else{
                $scope.showRepNameErr = false;
                $scope.repNameErrorMsg = "";
            }
        };
        
        $scope.repContactValidation = function(eventName){
            var pattern = /^[0-9]+$/;
            if($scope.qcForm.representative_contact_number.$invalid){
                $scope.showRepContactErr = true;
                $scope.repContactErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.representative_contact_number) || 
                    $scope.fields.representative_contact_number.length   !== 10 ){      
                $scope.showRepContactErr = true;
                $scope.repContactErrorMsg = "Please enter Facility Representative’s phone number"; 
            }
            else{
                $scope.showRepContactErr = false;
                $scope.repContactErrorMsg = "";
            }
        };
        
        $scope.repEmailValidation = function(eventName){
            var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            if($scope.qcForm.representative_email.$invalid){
                $scope.showRepEmailErr = true;
                $scope.repEmailErrorMsg = "You cannot leave this field blank"; 
            }
            else if( !pattern.test($scope.fields.representative_email)){      
                $scope.showRepEmailErr = true;
                $scope.repEmailErrorMsg = "Please enter Facility Representative’s email address"; 
            }
            else{
                $scope.showRepEmailErr = false;
                $scope.repEmailErrorMsg = "";
            }
        };
        
        $scope.groupValidation = function(eventName){
                if($scope.qcForm.group_id.$invalid){
                    $scope.showGroupErr = true;
                    $scope.groupErrorMsg = "You cannot leave this field blank"; 
                }
                else{
                    $scope.showGroupErr = false;
                    $scope.groupErrorMsg = "";
                }
        };
        
//        $scope.populateGroups = function($event){
//            if ($event !== undefined) {
//                var groupsFilter = "";
//                $scope.multipleGroups.selectedGroups = [];
//                var checkbox = $event.target;
//                var searchCategoryStr = checkbox.checked ? "real" : "test"
//                if ($scope.fields.type == "HL") {
//                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr + 
//                            '" ,"search_type" : "active_hg","search_by" : "hg_unused"}';
//                }
//                else if($scope.fields.type != undefined) {
//                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr + 
//                            '" ,"search_type" : "active_hg","search_by" : "all"}';
//                }
//                
////                console.log(serviceUrl + groupsFilter);
//                $http.get(serviceUrl + groupsFilter).success(function (data, status, headers, config) {
//                    $scope.groupsMulti = data.data.records || [];
//                });
//            }
//            else{
//                console.log('Error');
//            }
//
//        }
        
//        $scope.showHelp = function(){
//            $scope.showHelpDiv = true;
//            
//        }
//
//        $scope.hideHelp = function(){
//            $scope.showHelpDiv = false;
//        }
     
})
/*Facility Edit*/
.controller("editFacilityController", function ($scope, $http, $state, $rootScope, $stateParams) {
            var f_id = $stateParams.id;
            var serviceUrl = $rootScope.globals.serviceUrl;
            var facilityNameOld;
            var facilityNpiOld;
            $scope.showHelpDiv = false;
            
            var searchSubAdminQuery = 'users?fields=id,user_name&filter={ "search_type" : "all_users", "search_by" : "u_role", "search_sub_category" : "as", "search_role": "sr"}';
            var quicareSupportQuery = 'users?fields=id,user_name&filter={ "search_type" : "all_users", "search_by" : "u_role", "search_sub_category" : "as", "search_role": "qt"}';
        
            $scope.person = {};
            $scope.people = [];
            $http.get(serviceUrl + searchSubAdminQuery).success(function (data, status, headers, config) {
                $scope.people = data.data.records || [];
                $http.get(serviceUrl + quicareSupportQuery).success(function (data, status, headers, config) {
                    for (var i = 0; i < data.data.records.length; i++) {
                        $scope.people.push(data.data.records[i]);
                    }
                });
            });
            
            $scope.reset = function(){
                delete $scope.person.selected;
            }
            
            $scope.multipleGroups = {};
            $scope.multipleGroups.selectedGroups = [];
            $scope.groupsMulti = [];
            
            $scope.isRealDisabled = false;
            
            var fields='?fields=id,name,address1,address2,city,state,zip_code,type,npi,phone,email,representative_name,representative_contact_number,representative_email,isReal,deactivate,quicare_representative,groups,users';
            $http.get(serviceUrl+'facilities/'+f_id+fields).success(function(data, status, headers, config) {
                $scope.fields = data.data;
                facilityNameOld = $scope.fields.name;
                facilityNpiOld = $scope.fields.npi;
                
                if($scope.fields.groups.length || $scope.fields.users.length){
                    $scope.isRealDisabled = true;
                }
                
                var searchCategoryStr = $scope.fields.isReal == 'T' ? "real" : "test"
                var groupsFilter = "";
                if($scope.fields.type == "HL"){
                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + 
                            searchCategoryStr + '" ,"search_type" : "active_hg","search_by" : "hg_unused"}';
                }
                else if($scope.fields.type != undefined){
                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + 
                            searchCategoryStr + '" ,"search_type" : "active_hg","search_by" : "all"}';
                }
                $scope.groupsMulti = [];
                $http.get(serviceUrl + groupsFilter).success(function(data, status, headers, config) { 
                	angular.forEach(data.data.records, function(grp){
                		$scope.groupsMulti.push({id:grp.id , name : grp.name});
                	});
                });
                
                for (var i = 0; i < $scope.fields.groups.length; i++) {
                    if($scope.fields.type == "HL"){
                        $scope.groupsMulti.push({id:$scope.fields.groups[i].id , name : $scope.fields.groups[i].name});
                    }
                    $scope.multipleGroups.selectedGroups.push($scope.fields.groups[i].id);
                }
                
                $http.get(serviceUrl+'facility-types').success(function(data, status, headers, config) {
                    $scope.ftypes = data.data.records;
                });
                $http.get(serviceUrl+'states').success(function(data, status, headers, config) {
                    $scope.states = data.data.records;
                });
                
                if($scope.fields.quicare_representative != null ){
                    $scope.person.selected = $scope.fields.quicare_representative;
                }
                
            });
            $scope.IsChked = function($event, accept) {
                if ($event !== undefined) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        var ok = window.confirm('Are you sure to Accept this?');
                        if (!ok) {
                          checkbox.checked = false;
                        }
                    }
                }
            };
            $scope.errors = {};
            $scope.updateFacility = function () {
                if($scope.qcForm.$invalid){
                    return false;
                }
                $scope.fields.quicare_representative = $scope.person.hasOwnProperty('selected') ? $scope.person.selected : 0;
                $scope.fields.group_id = $scope.multipleGroups.hasOwnProperty('selectedGroups') ? $scope.multipleGroups.selectedGroups : [];

                $http.put(serviceUrl+'facilities/'+f_id, $scope.fields).success(function(response, status, headers, config) { 
                    
                    if(response.success == true){
                        $state.go('app.facilities');
                    }
                    else{
                        $scope.errors = response.errors;
                        showServiceErrors(response.errors);
                    }
                });
            };
            
            function showServiceErrors(errors){
            if('name' in errors){
                $scope.showNameErr = true;
                $scope.nameErrorMsg = $scope.errors['name'][0]; 
            }
            if('address1' in errors){
                $scope.showAddress1Err = true;
                $scope.address1ErrorMsg = $scope.errors['address1'][0]; 
            }
            if('city' in errors){
                $scope.showCityErr = true;
                $scope.cityErrorMsg = $scope.errors['city'][0]; 
                
            }
            
            if('email' in errors){
                $scope.showEmailErr = true;
                $scope.emailErrorMsg = $scope.errors['email'][0]; 
            }
            
            if('groups' in errors){
                $scope.showGroupErr = true;
                $scope.groupErrorMsg = $scope.errors['groups'][0]; 
            }

            if('npi' in errors){
                $scope.showNpiErr = true;
                $scope.npiErrorMsg = $scope.errors['npi'][0];
            }

            if('phone' in errors){
                $scope.showPhoneErr = true;
                $scope.phoneErrorMsg = $scope.errors['phone'][0]; 
            }
            
            
            if('representative_contact_number' in errors){
                $scope.showRepContactErr = true;
                $scope.repContactErrorMsg = $scope.errors['representative_contact_number'][0];
            }
            if('representative_email' in errors){
                $scope.showRepEmailErr = true;
                $scope.repEmailErrorMsg = $scope.errors['representative_email'][0]; 
            }

            if('representative_name' in errors){
                $scope.showRepNameErr = true;
                $scope.repNameErrorMsg = $scope.errors['representative_name'][0]; 
            }
            
            if('state' in errors){
                $scope.showStateErr = true;
                $scope.stateErrorMsg = $scope.errors['state'][0]; 
            }
            if('type' in errors){
                $scope.showFacililtyTypeErr = true;
                $scope.facililtyTypeErrorMsg = $scope.errors['type'][0]; 
            }

            if('zip_code' in errors){
                $scope.showZipCodeErr = true;
                $scope.zipCodeErrorMsg = $scope.errors['zip_code'][0]; 
            }

        }
        
            $scope.showNameErr = false;
            $scope.nameErrorMsg = ""; 

            $scope.showAddress1Err = false;
            $scope.address1ErrorMsg = ""; 

            $scope.showCityErr = false;
            $scope.cityErrorMsg = ""; 

            $scope.showZipCodeErr = false;
            $scope.zipCodeErrorMsg = ""; 

            $scope.showStateErr = false;
            $scope.stateErrorMsg = ""; 

            $scope.showFacililtyTypeErr = false;
            $scope.facililtyTypeErrorMsg = ""; 

            $scope.showNpiErr = false;
            $scope.npiErrorMsg = "";

            $scope.showPhoneErr = false;
            $scope.phoneErrorMsg = "";

            $scope.showEmailErr = false;
            $scope.emailErrorMsg = "";

            $scope.showRepNameErr = false;
            $scope.repNameErrorMsg = "";

            $scope.showRepContactErr = false;
            $scope.repContactErrorMsg = "";

            $scope.showRepEmailErr = false;
            $scope.repEmailErrorMsg = "";

            $scope.showGroupErr = false;
            $scope.groupErrorMsg = "";

            $scope.nameValidation = function(eventName){
                  if($scope.qcForm.name.$invalid){
                        $scope.showNameErr = true;
                        $scope.nameErrorMsg = "You cannot leave this field blank"; 
                    }
                    else if(eventName == "blur" && $scope.fields.name != "" && facilityNameOld != $scope.fields.name){

                        var facilityUrl = serviceUrl+'facilities?fields=name&filter={"search_type" : "all_hf",' + 
                                ' "search_by": "hf_name", "search_text": "' + $scope.fields.name + '", "search_op" : "equal"}';

                        var facilityRequest = $http.get(facilityUrl);
                                facilityRequest.success(function(data, status, headers, config) { 
                                if(data.data.records.length && data.data.records[0].name){
                                    $scope.showNameErr = true;
                                    $scope.nameErrorMsg = "Please enter unique health care facility name"; 
                                }
                        });

                    }
                    else{
                        $scope.showNameErr = false;
                        $scope.nameErrorMsg = ""; 
                    }
            };

            $scope.addressValidation = function(eventName){
                if($scope.qcForm.address1.$invalid){
                    $scope.showAddress1Err = true;
                    $scope.address1ErrorMsg = "You cannot leave this field blank"; 
                }
                else{
                    $scope.showAddress1Err = false;
                    $scope.address1ErrorMsg = ""; 
                }
            };



            $scope.cityValidation = function(eventName){
                var pattern = /^[A-Za-z\s.]+$/;
                if($scope.qcForm.city.$error.required){
                    $scope.showCityErr = true;
                    $scope.cityErrorMsg = "You cannot leave this field blank"; 
                }
                else if( (!pattern.test($scope.fields.city)) ){      
                    $scope.showCityErr = true;
                    $scope.cityErrorMsg = "City contains alphabets and periods only"; 
                }
                else{
                    $scope.showCityErr = false;
                    $scope.cityErrorMsg = ""; 
                }
            };

            $scope.zipCodeValidation = function(eventName){
                var pattern = /^[0-9]+$/;
                if($scope.qcForm.zipCode.$error.required){
                    $scope.showZipCodeErr = true;
                    $scope.zipCodeErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.zip_code) || $scope.fields.zip_code.length !== 5 ){      
                    $scope.showZipCodeErr = true;
                    $scope.zipCodeErrorMsg = "Please enter a valid 5 digit zip code of the Healthcare Facility"; 
                }
                else{
                    $scope.showZipCodeErr = false;
                    $scope.zipCodeErrorMsg = ""; 
                }
            };

            $scope.stateValidation = function(eventName){
                    if($scope.qcForm.state.$invalid){
                        $scope.showStateErr = true;
                        $scope.stateErrorMsg = "You cannot leave this field blank"; 
                    }
                    else{
                        $scope.showStateErr = false;
                        $scope.stateErrorMsg = ""; 
                    }
            };

            $scope.facililtyTypeValidation = function(eventName){
                    if($scope.qcForm.facilityType.$invalid){
                        $scope.showFacililtyTypeErr = true;
                        $scope.facililtyTypeErrorMsg = "You cannot leave this field blank"; 
                    }
                    else{
                        $scope.showFacililtyTypeErr = false;
                        $scope.facililtyTypeErrorMsg = ""; 
                    }
            };

            $scope.npiValidation = function(eventName){
                var pattern = /^[0-9]+$/;
                if($scope.qcForm.npi.$invalid){
                    $scope.showNpiErr = true;
                    $scope.npiErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.npi) || $scope.fields.npi.length !== 10 ){      
                    $scope.showNpiErr = true;
                    $scope.npiErrorMsg = "Please enter a valid 10 digit NPI of the Healthcare Facility"; 
                }
                else if(eventName == "blur" && $scope.fields.npi != "" && facilityNpiOld != $scope.fields.npi){
                    var facilityUrl = serviceUrl+'facilities?fields=npi&filter={"search_type" : "all_hf",' + 
                            ' "search_by": "npi", "search_text": "' + $scope.fields.npi +'"}'

                    var facilityRequest = $http.get(facilityUrl);
                            facilityRequest.success(function(data, status, headers, config) { 

                            if(data.data.records.length){
                                $scope.showNpiErr = true;
                                $scope.npiErrorMsg = "Please enter unique NPI"; 
                            }
                    });

                }
                else{
                    $scope.showNpiErr = false;
                    $scope.npiErrorMsg = "";
                }
            };

            $scope.phoneValidation = function(eventName){
                var pattern = /^[0-9]+$/;
                if($scope.qcForm.phone.$invalid){
                    $scope.showPhoneErr = true;
                    $scope.phoneErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.phone) || $scope.fields.phone.length  !== 10 ){      
                    $scope.showPhoneErr = true;
                    $scope.phoneErrorMsg = "Please enter Healthcare Facility’s phone number"; 
                }
                else{
                    $scope.showPhoneErr = false;
                    $scope.phoneErrorMsg = "";
                }
            };



            $scope.emailValidation = function(eventName){
                var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                if($scope.qcForm.email.$error.required){
                    $scope.showEmailErr = true;
                    $scope.emailErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.email)){      
                    $scope.showEmailErr = true;
                    $scope.emailErrorMsg = "Please enter a Healthcare Facility’s email address"; 
                }
                else{
                    $scope.showEmailErr = false;
                    $scope.emailErrorMsg = "";
                }
            };

            $scope.repNameValidation = function(eventName){
                var pattern = /^[A-Za-z\s-'.,]+$/;
                if($scope.qcForm.representative_name.$invalid){
                    $scope.showRepNameErr = true;
                    $scope.repNameErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.representative_name)){      
                    $scope.showRepNameErr = true;
                    $scope.repNameErrorMsg = "Please enter a representative’s name at the Healthcare Facility"; 
                }
                else{
                    $scope.showRepNameErr = false;
                    $scope.repNameErrorMsg = "";
                }
            };

            $scope.repContactValidation = function(eventName){
                var pattern = /^[0-9]+$/;
                if($scope.qcForm.representative_contact_number.$invalid){
                    $scope.showRepContactErr = true;
                    $scope.repContactErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.representative_contact_number) || 
                        $scope.fields.representative_contact_number.length   !== 10 ){      
                    $scope.showRepContactErr = true;
                    $scope.repContactErrorMsg = "Please enter Facility Representative’s phone number"; 
                }
                else{
                    $scope.showRepContactErr = false;
                    $scope.repContactErrorMsg = "";
                }
            };

            $scope.repEmailValidation = function(eventName){
                var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                if($scope.qcForm.representative_email.$invalid){
                    $scope.showRepEmailErr = true;
                    $scope.repEmailErrorMsg = "You cannot leave this field blank"; 
                }
                else if( !pattern.test($scope.fields.representative_email)){      
                    $scope.showRepEmailErr = true;
                    $scope.repEmailErrorMsg = "Please enter Facility Representative’s email address"; 
                }
                else{
                    $scope.showRepEmailErr = false;
                    $scope.repEmailErrorMsg = "";
                }
            };

            $scope.groupValidation = function(eventName){
                    if($scope.qcForm.group_id.$invalid){
                        $scope.showGroupErr = true;
                        $scope.groupErrorMsg = "You cannot leave this field blank"; 
                    }
                    else{
                        $scope.showGroupErr = false;
                        $scope.groupErrorMsg = "";
                    }
            };
            
            $scope.populateGroups = function($event){
            if ($event !== undefined) {
                var groupsFilter = "";
                $scope.multipleGroups.selectedGroups = [];
                var checkbox = $event.target;
                var searchCategoryStr = checkbox.checked ? "real" : "test"
                if ($scope.fields.type == "HL") {
                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr + 
                            '" ,"search_type" : "active_hg","search_by" : "hg_unused"}';
                }
                else if($scope.fields.type != undefined) {
                    groupsFilter = 'groups?fields=id,name&filter={"search_category" : "' + searchCategoryStr + 
                            '" ,"search_type" : "active_hg","search_by" : "all"}';
                }
                
                $http.get(serviceUrl + groupsFilter).success(function (data, status, headers, config) {
                    $scope.groupsMulti = data.data.records || [];
                });
            }
            else{
                console.log('Error');
            }

        }
        
		$scope.showHelp = function(){
			$scope.showHelpDiv = true;

		}

		$scope.hideHelp = function(){
			$scope.showHelpDiv = false;
		}

})
/*Groups List*/
.controller("groupListController", function ($scope, $http, $rootScope) {
            var serviceUrl = $rootScope.globals.serviceUrl+'groups';
            var fields = 'id,name,isReal,created,updated';
            $scope.formData = {searchOption: "real", groupsOptions: "all_hg", searchBy: "all"};
            
//        Pagination configuration
        $scope.pagesToShow = 5;
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.recordsPerPage = 10;
        
        $scope.pageChanged = function() {
            $scope.searchGroups();
        };
            
        $scope.showSearchBtn = $scope.showNameField = false;
            
            $scope.showFields = function(){
                if($scope.formData.searchBy == 'hg_name'){
                    $scope.showSearchBtn = true;
                    $scope.showNameField = true;
                }
                else{
                    $scope.showSearchBtn = false;
                    $scope.showNameField = false;
                    $scope.formData.groupName = "";
                }
            }
            
            $scope.setPageToInitial = function(id){
                $scope.currentPage = 1;
                if(id == "searchOption"){
                    $scope.formData.searchBy = "all";
                    $scope.showFields();
                }
                if($scope.formData.searchBy == "all"){
                    $scope.searchGroups();
                }
                else if( ($scope.formData.groupName != undefined && $scope.formData.groupName != "" ) ){
                    $scope.searchGroups();
                }

            }
            
            $scope.searchGroups = function(){
                var groupsFilter = '?filter={"search_category" : "' +  $scope.formData.searchOption + '","search_type" : "' + 
                        $scope.formData.groupsOptions + '", "search_by" : "' + $scope.formData.searchBy + '" ';
                if($scope.showNameField){
                    groupsFilter += ',"search_text": "' + $scope.formData.groupName + '"'
                }
                
                groupsFilter += '}&fields=' + fields
                groupsFilter += '&page=' + $scope.currentPage + '&limit=' + $scope.recordsPerPage;
                $http.get(serviceUrl + groupsFilter).success(function(data, status, headers, config) { 
                    $scope.groups = data.data.records;
                    $scope.totalItems = data.data.total_records;
                });
            };
            
            $scope.searchGroups();
  	
})
/*Group Create*/
.controller("createGroupController", function ($scope, $http, $state, $rootScope, $stateParams ) {
        $scope.errors = {};
        var serviceUrl = $rootScope.globals.serviceUrl;
        var isReal = $stateParams.real;
        $scope.fields = {isReal: isReal};
        $scope.createGroup = function () {
            
            $http.post(serviceUrl + 'groups', $scope.fields).success(function (response, status, headers, config) {
                if (response.success == true){
                    $state.go('app.groups');
                }
                else {
                    $scope.errors = response.errors;
                    showServiceErrors(response.errors);
                    
                }
            });

        };
        
        function showServiceErrors(errors){
            if('name' in errors){
                $scope.showNameErr = true;
                $scope.errorMsg = $scope.errors['name'][0]; 
            }
        }
        
        $scope.showNameErr = false;
        $scope.errorMsg = ""; 
         
        
        $scope.nameValidation = function(eventName){
                if($scope.qcForm.name.$error.required){
                    $scope.showNameErr = true;
                    $scope.errorMsg = "You cannot leave this field blank"; 
                }
                else if(eventName == "blur" && $scope.fields.name != ""){
                    var groupsUrl = serviceUrl+'groups?fields=name&filter={"search_type" : "all_hg", "search_by" : "hg_name",'
                            + ' "search_text": "' + $scope.fields.name +'", "search_op" : "equal"}';
                    var groupsRequest = $http.get(groupsUrl);
                            groupsRequest.success(function(data, status, headers, config) { 
                            if(data.data.records.length && data.data.records[0].name){
                                $scope.showNameErr = true;
                                $scope.errorMsg = "Please enter unique hospital group name"; 
                            }

                    });
                    
                }
                else{
                    $scope.showNameErr = false;
                    $scope.errorMsg = ""; 
                }
                        
            
        };
})
/*Group Edit*/
.controller("editGroupController", function ($scope, $http, $state, $rootScope, $stateParams) {
            var serviceUrl = $rootScope.globals.serviceUrl;
            var g_id = $stateParams.id;
            var groupOldValue;
            $scope.isRealDisabled = false;
            $http.get(serviceUrl+'groups/'+g_id+'?fields=id,name,isReal,deactivate,facility').success(function(data, status, headers, config) { 
                $scope.fields = data.data;
                groupOldValue = $scope.fields.name;
                if($scope.fields.facilities.length){
                    $scope.isRealDisabled = true;
                }
                
            });
            $scope.errors = {};
            $scope.updateGroup = function () {
                if($scope.qcForm.$invalid){
                    return false;
                }
                $http.put(serviceUrl+'groups/'+g_id, $scope.fields).success(function(response, status, headers, config) { 
                    if(response.success == true){
                        $state.go('app.groups');
                    }
                    else{
                        $scope.errors = response.errors;
                        showServiceErrors(response.errors);
                    }
                });
            };
            $scope.IsChked = function($event, accept) {
                if ($event !== undefined) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        var ok = window.confirm('Are you sure to Accept this?');
                        if (!ok) {
                          checkbox.checked = false;
                        }
                    }
                }
            };
            
            function showServiceErrors(errors){
                if('name' in errors){
                    $scope.showNameErr = true;
                    $scope.errorMsg = $scope.errors['name'][0]; 
                }
            }
            
            $scope.showNameErr = false;
            $scope.errorMsg = ""; 
            

            $scope.nameValidation = function(eventName){
                if($scope.qcForm.name.$invalid){
                    $scope.showNameErr = true;
                    $scope.errorMsg = "You cannot leave this field blank"; 
                }
                else if(eventName == "blur" && $scope.fields.name != "" && $scope.fields.name != groupOldValue){

                    var groupsUrl = serviceUrl+'groups?fields=name&filter={"search_type" : "all_hg", "search_by" : "hg_name",'
                            + ' "search_text": "' + $scope.fields.name +'", "search_op" : "equal"}';
                    var groupsRequest = $http.get(groupsUrl);
                            groupsRequest.success(function(data, status, headers, config) { 

                            if(data.data.records.length && data.data.records[0].name){
                                $scope.showNameErr = true;
                                $scope.errorMsg = "Please enter unique hospital group name"; 
                            }
                            
                    });

                }
                else{
                    $scope.showNameErr = false;
                    $scope.errorMsg = ""; 
                }


            };
})
.controller("activityLogListController", function ($scope, $http, $rootScope) {
	var baseServiceUrl = $rootScope.globals.serviceUrl;
	var serviceUrl = baseServiceUrl + 'activity-logs';
	
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

})