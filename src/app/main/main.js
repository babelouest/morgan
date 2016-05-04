google.load("feeds", "1");

angular.module("morgan").controller("morganCtrl", [
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
        $scope.scrollList = [];
        $scope.horizontalScroll = "";
        
        function init() {
            morganFactory.getSource()
                .then(function(response) {
                    $scope.sourceList = response.data;
                    for (key in $scope.sourceList) {
                        sourceLoop($scope.sourceList[key]);
                    }
                    displayBlocks();
                });
                displayScroll();
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
                var scrollItem = Math.floor(Math.random()*$scope.scrollList.length);
                $scope.horizontalScroll = $scope.scrollList[scrollItem].content;
            }
            setInterval(function() {
                if ($scope.scrollList.length > 0) {
                    // Pick a random element in $scope.scrollList
                    var scrollItem = Math.floor(Math.random()*$scope.scrollList.length);
                    $scope.horizontalScroll = $scope.scrollList[scrollItem].content;
                }
            }, 30*1000);
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
                    getOpenWeatherData(source);
                    break;
                case "rss":
                    source.isVisible = false;
                    source.content = "rss";
                    source.pos = { top: 0, left: 0 };
                    getRss(source);
                    break;
            }
        }
        
        function getTimeData(source) {
            var currentDate = new Date();
            source.content = currentDate.toLocaleDateString(navigator.language, {weekday: "long", year: "numeric", month: "long", day: "numeric"}) + "<br>" +
                            (currentDate.getHours()<10?"0":"") + currentDate.getHours() + ":" + (currentDate.getMinutes()<10?"0":"") + currentDate.getMinutes();
        }
        
        function getOpenWeatherData(source) {
            morganFactory.getAnyUrl(source.url)
                .then(function(response) {
                    source.content = response.data.query.results.channel.location.city + "<br>" +
                                    response.data.query.results.channel.item.condition.temp + " °C" + "\n" + "<br>" +
                                    "<img src=\"http://l.yimg.com/a/i/us/we/52/" + response.data.query.results.channel.item.condition.code + ".gif\" alt=\"condition\">"
                                    
                });
        }
        
        function getRss(source) {
            var feed = new google.feeds.Feed(source.url);
			feed.setNumEntries(10);
			feed.load(function(result) {
                cleanScrolls(source.id);
                for (key in result.feed.entries) {
                    var entry = {};
                    entry.id = source.id;
                    entry.content = result.feed.entries[key].title;
                    $scope.scrollList.push(entry);
                    $scope.horizontalScroll = entry.content;
                }
			});
        }
        
        function cleanScrolls(id) {
            for (var i=$scope.scrollList.length-1; i>=0; i--) {
                if ($scope.scrollList[i].id === id) {
                    $scope.scrollList.splice(i, 1);
                }
            }
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

        function showAndHideBlock(element) {
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
        
        function scrollBlock(element) {
        }
        
        init();
    }
]);
