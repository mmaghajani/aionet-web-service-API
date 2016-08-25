'use strict';
var app = angular.module('myApp', ['ngRoute', 'view1']);
app.config(function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
});
