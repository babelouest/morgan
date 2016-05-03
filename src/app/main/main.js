angular.module("morgan").controller("mainCtrl", [
    "$scope",
    "$timeout",
    "$interval",
    "Fullscreen",
    "morganFactory",
    function($scope, $timeout, $interval, Fullscreen, morganFactory) {
        
        $scope.isVisible = false;
        $scope.fullscreen = false;
        $scope.hideScroll = false;
        
        $scope.sourceList = [];
        $scope.elementList = [];
        /*[
            {isVisible: false, content: "Element 1", pos : {top: 0, left: 0}, type: "block"},
            {isVisible: false, content: "Element 2", pos : {top: 0, left: 0}, type: "block"},
            {isVisible: false, content: "Element 3", pos : {top: 0, left: 0}, type: "block"},
            {isVisible: false, content: "Element 4", pos : {top: 0, left: 0}, type: "scroll"}
        ]*/
        
        function init() {
          morganFactory.getSource()
            .then(function(response) {
              for (key in response.data) {
                var source = angular.copy(response.data[key]);
                source.data = [];
                $scope.sourceList.push(source);
                var interval = $interval(getData(source), source.refresh*1000);
              }
            });
        }
        
        function getData(source) {
          switch (source.type) {
            case "time":
              getTimeData(source);
              break;
            case "openWeather":
              getOpenWeatherData(source);
              break;
            case "rss":
              getRss(source);
              break;
          }
        }
        
        function cleanElement(id) {
          for (key in $scope.elementList) {
            if ($scope.elementList[key].id === id) {
              $scope.elementList.splice(key, 1);
            }
          }
        }
        
        function getTimeData(source) {
          cleanElement(source.id);
          var currentdate = new Date();
          var element = {isVisible: false, content: currentdate.getDay() + "/" + currentdate.getMonth() + "/" + currentdate.getFullYear() + " - " + currentdate.getHours() + ":" + currentdate.getMinutes(), pos : {top: 0, left: 0} };
        }
        
        function getOpenWeatherData(source) {
        }
        
        function getRss(source) {
        }
        
        $scope.goFullscreen = function () {
            if (Fullscreen.isFullscreen()) {
                $scope.fullscreen = false;
                Fullscreen.cancel();
            } else {
                $scope.fullscreen = true;
                Fullscreen.all();
            }
        }

        /*$interval(function() {
            $scope.hideScroll = false;
            for (key in $scope.elementList) {
                showAndHideElement($scope.elementList[key]);
            }
        //}, 20000);
        }, 5000);*/
        
        function showAndHideElement(element) {
            if (element.type === "block") {
                var showTimeout = Math.floor((Math.random()*6)+1)*1000;
                var hideTimeout = Math.floor((Math.random()*6)+1)*1000;
                var posX = Math.floor((Math.random()*90));
                var posY = Math.floor((Math.random()*90));
                
                element.pos.top = posX;
                element.pos.left = posY;
                $timeout(function() {
                    element.isVisible = true;
                    $timeout(function() {
                        element.isVisible = false;
                    }, showTimeout);

                }, hideTimeout);
            } else if (element.type === "scroll") {
                $scope.hideScroll = true;
            }
        }
        
        init();
    }
]);
