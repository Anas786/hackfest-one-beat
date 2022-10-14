meterialAdmin

.factory('AuthenticationService', function (Base64, $http, $cookies, $rootScope, $timeout, $location) {
    var service = {};
    var isRemote = false;
    var serviceBaseUrl;
    var apiVersionUrl;
    if(isRemote){
        serviceBaseUrl = 'http://ec2-54-201-247-126.us-west-2.compute.amazonaws.com/beta/api/web/index.php/api/';
        apiVersionUrl = serviceBaseUrl + 'v1/';
    }
    else{
        serviceBaseUrl = 'api/web/index.php/api/';
        apiVersionUrl = serviceBaseUrl + 'v1/';
    }

    service.Login = function (username, password, callback) {

        /* Use this for real authentication
         ----------------------------------------------*/
        $http.post(serviceBaseUrl+'login', { user_name: Base64.encode(username), password: Base64.encode(password) })
           .success(function (response) {
               callback(response);
           });

    };

    service.SetCredentials = function (data) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + data.auth_token; // jshint ignore:line                    	
        $http.get(serviceBaseUrl + 'user-menu')
        .success(function (response) {
            var menus = response.data;
            var authToken = data.auth_token;
            $http.get(apiVersionUrl + 'users/' + data.id)
            .success(function (data) {
                $rootScope.globals = {
                    currentUser: {authdata: authToken,user: data.data},
                    serviceUrl: apiVersionUrl,
                    menues : menus
                };
                $cookies.credentials =  angular.toJson($rootScope.globals);
                if(data.data.category == 'AS'){
                    $location.path('/app/home');    
                }else {
                    $location.path('/app/admissions');
                }

                
            });

        });
    };

    service.ClearCredentials = function (token) {
        if (token) {
            $http.post(serviceBaseUrl+'logout', { token: token});
            $rootScope.globals = {};
            $cookies.credentials = "{}";
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    };

    return service;
})
.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
})
.factory('AdmissionService', function($q, $http, $rootScope) {
    var serviceUrl = $rootScope.globals.serviceUrl+'admissions';
    return {
        getData : function(admissionsFilter){
            var defer = $q.defer();
            $http.get(serviceUrl + admissionsFilter).success(function(data) {
                defer.resolve(data);
            });
            // Return the promise to the controller
            return defer.promise;
        }
    }
})
.directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
})
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })
.directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      element.bind('blur', function() {
        console.log('blur')
        scope.$apply(model.assign(scope, false));
      })
    }
  };
})
.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                var table = e.target.nextElementSibling;
                //var table = $('#exportCSV');
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){
                        csvString = csvString + rowData[j].innerHTML + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'Admissions.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
})