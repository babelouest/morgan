//google.load("feeds", "1");

angular.module("morgan").controller("morganCtrl", [
    "$scope",
    "$q",
    "$timeout",
    "$interval",
//    "Fullscreen",
    "morganFactory",
    function($scope, $q, $timeout, $interval/*, Fullscreen*/, morganFactory) {
        
        $scope.isVisible = false;
        $scope.fullscreen = false;
        $scope.showScroll = false;
        
        $scope.config = {};
        $scope.sourceList = [];
        $scope.scrollList = [];
        $scope.horizontalScroll = "";
        
        $scope.showButton = true;
        
        function init() {
            loadSources();
            refreshConfig();
        }
        
        function loadSources() {
            $q.all([
                morganFactory.getSource(),
                morganFactory.getConfig()
            ])
            .then(function (response) {
                $scope.sourceList = response[0].data;
                $scope.config = response[1].data;
                for (key in $scope.sourceList) {
                    sourceLoop($scope.sourceList[key]);
                }
                displayBlocks();
                displayScroll();
            });
        }
        
        function refreshConfig() {
            // Refresh config every hour and reload sources if config.lastupdate has changed
            setInterval(function() {
                morganFactory.getConfig()
                    .then(function (response) {
                        if (!!response.data.lastupdate && response.data.lastupdate > $scope.config.lastupdate) {
                            $scope.config = response.data;
                            morganFactory.getSource()
                                .then(function (sourceResponse) {
                                    $scope.sourceList = sourceResponse.data;
                                        for (key in $scope.sourceList) {
                                            sourceLoop($scope.sourceList[key]);
                                        }
                                        displayBlocks();
                                        displayScroll();
                                });
                        }
                    });
            }, 1000*60*60);
        }
        
        function displayBlocks() {
            for (index in $scope.sourceList) {
                if ($scope.sourceList[index].display === "block") {
                    displayBlock(index);
                }
            }
        }
        
        function displayScroll() {
            if ($scope.scrollList.length > 0) {
                // Pick a random element in $scope.scrollList
                var displayOrNot = Math.floor(Math.random()*2);
                if (displayOrNot === 0) {
                    var scrollItem = Math.floor(Math.random()*$scope.scrollList.length);
                    $scope.horizontalScroll = $scope.scrollList[scrollItem].content;
                } else {
                    $scope.horizontalScroll = "";
                }
            } else {
                $scope.horizontalScroll = "";
            }
            setInterval(function() {
                if ($scope.scrollList.length > 0) {
                    // Pick a random element in $scope.scrollList
                    var displayOrNot = Math.floor(Math.random()*2);
                    if (displayOrNot === 0) {
                        var scrollItem = Math.floor(Math.random()*$scope.scrollList.length);
                        $scope.horizontalScroll = $scope.scrollList[scrollItem].content;
                    } else {
                        $scope.horizontalScroll = "";
                    }
                }
            }, 20*1000);
        }
        
        function displayBlock(sourceIndex) {
            var showTimeout = Math.floor((Math.random()*20)+5)*1000;
            var hideTimeout = Math.floor((Math.random()*10)+5)*1000;
            var posX = Math.floor((Math.random()*60)+20);
            var posY = Math.floor((Math.random()*60)+20);
            
            $scope.sourceList[sourceIndex].pos.top = posX;
            $scope.sourceList[sourceIndex].pos.left = posY;
            setTimeout(function() {
                $scope.sourceList[sourceIndex].isVisible = true;
                $scope.$apply();
                setTimeout(function() {
                    $scope.sourceList[sourceIndex].isVisible = false;
                    $scope.$apply();
                    displayBlock(sourceIndex)
                }, hideTimeout);

            }, showTimeout);
        }
        
        function sourceLoop(source) {
            if (source.refresh) {
                getData(source);
                setInterval(function() {
                    getData(source);
                }, source.refresh*1000);
            } else {
                getData(source);
            }
        }
        
        function getData(source) {
            switch (source.type) {
                case "time":
                    source.isVisible = false;
                    source.content = "";
                    source.pos = { top: 0, left: 0 };
                    getTimeData(source);
                    break;
                case "yahooWeather":
                    source.isVisible = false;
                    source.content = "meteo";
                    source.pos = { top: 0, left: 0 };
                    getYahooWeatherData(source);
                    break;
                case "openWeather":
                    source.isVisible = false;
                    source.content = "meteo";
                    source.pos = { top: 0, left: 0 };
                    getOpenWeatherData(source);
                    break;
                /*case "rss":
                    source.isVisible = false;
                    source.content = "rss";
                    source.pos = { top: 0, left: 0 };
                    getRss(source);
                    break;*/
            }
        }
        
        function getTimeData(source) {
            var currentDate = new Date();
            source.content = currentDate.toLocaleDateString($scope.config.lang, {weekday: "long", year: "numeric", month: "long", day: "numeric"}) + "<br>" +
                            (currentDate.getHours()<10?"0":"") + currentDate.getHours() + ":" + (currentDate.getMinutes()<10?"0":"") + currentDate.getMinutes();
        }
        
        function getYahooWeatherData(source) {
            morganFactory.getAnyUrl(source.url)
                .then(function(response) {
                    source.content = response.data.query.results.channel.location.city + "<br>" +
                                    response.data.query.results.channel.item.condition.temp + " °C" + "<br>" +
                                    "<img src=\"http://l.yimg.com/a/i/us/we/52/" + response.data.query.results.channel.item.condition.code + ".gif\" alt=\"condition\">";
                                    
                });
        }
        
        function getOpenWeatherData(source) {
          if (!!source.id && !!$scope.config.openweatherAppId) {
              var url = "http://api.openweathermap.org/data/2.5/weather?id=" + source.locationId + "&appId=" + $scope.config.openweatherAppId;
              var units = " °C";
              if (!!$scope.config.units) {
                  url += "&units=" + $scope.config.units;
                  if ($scope.config.units === "imperial") {
                      units = " °F";
                  }
              }
              if (!!$scope.config.lang) {
                  url += "&lang=" + $scope.config.lang;
              }
              morganFactory.getAnyUrl(url)
                  .then(function(response) {
                      var sunrise = new Date();
                      var sunset = new Date();
                      sunrise.setUTCSeconds(response.data.sys.sunrise);
                      sunset.setUTCSeconds(response.data.sys.sunset);
                      
                      source.content = response.data.name + "<br>" +
                                        response.data.weather[0].description + "<br>" +
                                        response.data.main.temp + units + "<br/>" +
                                        "<i class=\"owf owf-" + response.data.weather[0].id + " owf-3x\">";
                  });
            }
        }
        
        /*function getRss(source) {
            $scope.showScroll = false;
            var feed = new google.feeds.Feed(source.url);
                feed.setNumEntries(10);
                feed.load(function(result) {
                    cleanScrolls(source.id);
                    for (key in result.feed.entries) {
                        var entry = {};
                        entry.id = source.id;
                        entry.content = result.feed.entries[key].title;
                        $scope.scrollList.push(entry);
                    }
                    $scope.showScroll = true;
                });
        }*/
        
        function cleanScrolls(id) {
            for (var i=$scope.scrollList.length-1; i>=0; i--) {
                if ($scope.scrollList[i].id === id) {
                    $scope.scrollList.splice(i, 1);
                }
            }
        }
        
        /*$scope.goFullscreen = function () {
            Fullscreen.toggleAll();
            $scope.showButton = !$scope.showButton;
        }*/

        function showAndHideBlock(element) {
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
        }
        
        init();
    }
]);
