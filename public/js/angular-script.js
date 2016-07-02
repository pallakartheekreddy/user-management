angular.module('mean-sample',['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/login");
	$stateProvider
        .state('login', {
            url: "/login",
            templateUrl: '/templates/login.html',
            controller: 'LoginCtrl',
        })
        .state('logout', {
            url: "/logout",
            controller: 'LogoutCtrl',
        })
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
					"username" : $scope.username,
					"password" : $scope.password,
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
})
.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $location) {
    $scope.user = {};
	// Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0'){
			$state.go('users');
        } else {
			$rootScope.message = 'You need to log in.';
			// Register the login() function
			$scope.login = function(){
				$http.post('/login', {
				  username: $scope.user.username,
				  password: $scope.user.password,
				})
				.success(function(user){
					// No error: authentication OK
					$rootScope.message = 'Authentication successful!';
					$state.go('users');
				})
				.error(function(){
					// Error: authentication failed
					$rootScope.message = 'Authentication failed.';
					//$location.url('/login');
					$state.go('login');
				});
			};
        }
    });
})
.controller('LogoutCtrl', function($scope, $rootScope, $http, $state, $stateParams) {
    $scope.message = '';
    // Logout function is available in any pages
    $scope.goToLogout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout').success(function(users){
		$state.go('login');  
	  });
    };
    $scope.goToLogout();
});