angular.module('mean-sample',['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/users");
	$stateProvider
        .state('users', {
            url: "/users",
            templateUrl: "/templates/users.html",
            controller: 'UserListCtrl'
        })
        .state('showadduser', {
            url: "/showadduser",
            templateUrl: "/templates/adduser.html",
            controller: 'AddUserCtrl'
        })
		.state('adduser', {
            url: "/adduser",
            templateUrl: "/templates/adduser.html",
            controller: 'AddUserCtrl'
        })
        .state('getuserinfo', {
            url: "/getuserinfo/:id",
            templateUrl: "/templates/edituser.html",
            controller: 'EditUserCtrl'
        })
        .state('deleteuser', {
            url: "/deleteuser/:userid",
            controller: 'DeleteUserCtrl'
        });
})
.controller('UserListCtrl', function($scope, $rootScope, $http, $state) {
    $scope.users = [];
    $scope.getUsers = function() {
        $http.get('users')
        .then(function(resp) {
           $scope.users = resp.data; 
        });
    }
    $scope.getUsers();
	/*$rootScope.goToUserList = function(){
		$state.go('userlist', {});
	}	
	$rootScope.goToAddUser = function(){
		$state.go('adduser', {});
	}*/
    //var id = $stateParams.id;
})
.controller('AddUserCtrl', function($scope, $rootScope, $http, $state) {
    $scope.goToAdduser = function() {
		var data = {"name" : $scope.name,
                    "age" : $scope.age,
                    "email" : $scope.email,
                    "gender" : $scope.gender,
                    "dob" : $scope.dob
                    };
        $http.post('adduser', data)
        .success(function(data) {
           console.log('data '+data);
		   if(data.status == 'SUCCESS'){
				$state.go("users");
		   }else{
			   $scope.message = data.message;
		   }
           //$scope.message = data.status;
           //$scope.name = $scope.age = $scope.email = $scope.gender = $scope.dob = '';
        });
    }
    var options={
        format: 'mm/dd/yyyy',
    };
    $('#dob').datepicker(options);
})
.controller('EditUserCtrl', function($scope, $rootScope, $http, $state, $stateParams) {
    $scope.getUserInfo = function() {
        $scope.user = [];
		$http.get('getuserinfo/'+$stateParams.id)
        .success(function(resp) {
           $scope.user = angular.fromJson(resp.data);
        });
    }
     $scope.goToUpdateuser = function(user) {
		var data = {"id" : user.id,
                    "name" : user.name,
                    "age" : user.age,
                    "email" : user.email,
                    "gender" : user.gender,
                    "dob" : user.dob
                    };
        $http.post('updateuser', data)
        .success(function(data) {
           console.log('data '+data);
           $state.go("users");
        });
    }
	$scope.getUserInfo();
    var options={
        format: 'mm/dd/yyyy',
    };
    $('#dob').datepicker(options);
})
.controller('DeleteUserCtrl', function($scope, $rootScope, $http, $state, $stateParams) {
    $scope.goToDeleteuser = function() {
        $http.delete('deleteuser/'+$stateParams.userid).success(function(resp) {
           $state.go("users");
        });
    }
    $scope.goToDeleteuser();
});