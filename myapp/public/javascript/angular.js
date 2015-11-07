var app = angular.module('app',[]);


app.controller('ContentCtr',function($scope){
    $scope.mouseMode=false;
});

app.controller('FormCtr',function($scope){
    $scope.action=function(){
        window.open("https://youtu.be/bAXXhFbhBw4?t=33s");
    };
});