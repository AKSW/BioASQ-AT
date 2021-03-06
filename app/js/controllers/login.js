angular.module('bioasq-at.controllers.login', [])
.controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $modal, $cookies, Questions) {
    $scope.login = function () {
        $scope.messages = [];
        if (!$scope.email) {
            $scope.messages.push({
                type: 'error',
                text: 'Email address required'
            });
            return;
        }
        if (!$scope.password) {
            $scope.messages.push({
                type: 'error',
                text: 'Password required'
            });
            return;
        }

        $http.post('/backend/login', { email: $scope.email, password: $scope.password })
        .success(function (data) {
            $rootScope.$emit('signin');
            $rootScope.user = {
                name: data.username,
                id:   data.usermail
            };
            $location.path('questions');
        })
        .error(function (data, status) {
            $rootScope.$emit('signin');
            delete $rootScope.user;

            if (status === 401 || status === 403) {
                $scope.messages.push({
                    type: 'error',
                    text: 'Invalid credentials!'
                });
            } else {
                $scope.messages.push({
                    type: 'error',
                    text: 'Could not sign in (' + status + ')'
                });
            }
        });
    };

    $scope.logout = function () {
        delete $rootScope.user;
        $rootScope.$emit('signout');
        $http.get('/backend/logout')
        .then(function () {
            $location.path('/');
        });
    };

    $scope.resetPassword = function () {
        $scope.messages = [];
        if (!$scope.email) {
            $scope.messages.push({
                type: 'error',
                text: 'Email address required'
            });
            return;
        }
        $http.get('/backend/resetPassword', { params: { email: $scope.email } })
        .success(function () {
            $scope.messages.push({
                type: 'success',
                text: 'Password reset email sent.'
            });
        })
        .error(function (data, status) {
            $scope.messages.push({
                type: 'error',
                text: 'Could not send reset email.'
            });
        });
    };

    $scope.register = function () {
        $scope.account = {};
        $modal.open({
            templateUrl: '/views/partials/register.html',
            scope: $scope
        });
    };

    $scope.createAccount = function (form) {
        $scope.registrationMessages = [];
        if (form.$valid) {
            if ($scope.account.password1 !== $scope.account.password2) {
                $scope.registrationMessages.push({
                    type: 'error',
                    text: 'Passwords must match!'
                });
                return;
            }
            var regExp = new RegExp('^.*(?=.{8,})(?=.*[\\d])(?=.*[\\W]).*$', 'g');
            if (regExp.test($scope.account.password1) === false) {
                $scope.registrationMessages.push({
                    type: 'error',
                    text: 'Password does not meet criteria. Must be at least 8 characters long, 1 digit and 1 symbol'
                });
                return;
            }
            $http.post('/backend/register', {
                email: $scope.account.email,
                name:  $scope.account.name,
                password: $scope.account.password1
            })
            .success(function () {

            })
            .error(function (data, status) {
                $scope.registrationMessages.push({
                    type: 'error',
                    text: data
                });
            });
        } else {
            $scope.registrationMessages.push({
                type: 'error',
                text: 'Please fill in all fields.'
            });
        }
    };
});
