'use strict';
var app = angular.module('view1', ['angular-md5', "ngSanitize"]);

var url = "";
var platformInformation = "";
var login = "";
var sessionID = "";
var profiles = "";
var promise;
app.controller('View1Ctrl', function ($scope, $http, md5, $interval) {

    var digest = createDigest("getPlatformInformation", "111fa-IR");
    $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
        digest + "/client/getPlatformInformation?" +
        "locale=fa-IR&appVersion=1&deviceWidth=1&deviceHeight=1")
        .then(function (response) {
            platformInformation = response.data;
            $scope.platformInformation = platformInformation;
        });

    digest = createDigest("channels/list", "MPEG2fa-IR_2DHLSTV");
    $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
        digest + "/client/channels/list?" +
        "audioFormats=MPEG2&locale=fa-IR&pictureTypes=_2D&protocols=HLS&type=TV")
        .then(function (response) {
            $scope.list = response.data;
        });

    digest = createDigest("login", '{"username":"989378733393" , "password":"85491374" ' +
        ', "deviceName":"Linux-Chrome" , "locale":"fa-IR"}');
    $http({
        url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest + "/client/login",
        data: '{"username":"989378733393" , "password":"85491374" , "deviceName":"Linux-Chrome" , "locale":"fa-IR"}',
        method: "POST",
        headers: {"Content-Type": "application/json"}
    }).then(function (response) {
        login = response.data;
        $scope.login = login;
        sessionID = login.key;
        digest = createDigest("profiles/list", "fa-IR" + sessionID);
        $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
            digest + "/client/profiles/list?" +
            "locale=fa-IR&" + "sessionId=" + sessionID.toString())
            .then(function (response) {
                profiles = response.data;
                $scope.profiles = profiles;
                var profileGuid = ((profiles.profiles)[0]).guid;
                digest = createDigest("channels/linear/getUrl", '{ "channelType":"TV" , "playbackType":"LIVE" , "channelId": 8 , "locale":"fa-IR" , "protocols" ' +
                    ': ["HLS"] , "pictureTypes" : ["_2D"] , "audioFormats" : ["AAC"] , "delay" : 0 , "profileGuid" : "'
                    + profileGuid + '" , "sessionId" : "' + sessionID + '"}');
                $http({
                    url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest +
                    "/client/channels/linear/getUrl",
                    data: '{ "channelType":"TV" , "playbackType":"LIVE" , "channelId": 8 , "locale":"fa-IR" , "protocols" ' +
                    ': ["HLS"] , "pictureTypes" : ["_2D"] , "audioFormats" : ["AAC"] , "delay" : 0 , "profileGuid" : "'
                    + profileGuid + '" , "sessionId" : "' + sessionID + '"}',
                    method: "POST",
                    headers: {"Content-Type": "application/json"}
                }).then(function (response) {
                    var player = videojs('video');
                    url = response.data;
                    $scope.url = url.url;
                    // player.src({"type": "application/x-mpegURL", "src": url.url, "withCredentials": "true"});
                    player.src({"type": "application/x-mpegURL", "src": url.url, "withCredentials": "true"});
                    player.play();
                    //player.pause() ;
                    player.on('pause', function () {
                        player.src({"type": "application/x-mpegURL", "src": '', "withCredentials": "true"});
                        var s = '{ "contentId": 8 , "type":"TV" , "locale":"fa-IR" ' +
                            ', "profileGuid" : "' + profileGuid + '" , "sessionId" : "' + sessionID + '"}';
                        digest = createDigest("streams/stop", s);
                        $http({
                            url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest +
                            "/client/streams/stop",
                            data: s,
                            method: "POST",
                            headers: {"Content-Type": "application/json"}
                        }).then(function (response) {
                            console.log("response ok pause");
                            $interval.cancel(promise);
                        });
                        // Now the issue is that we need to hide it again if we start playing
                        // So every time we do this, we can create a one-time listener for play events.
                    });
                    player.on('play', function () {
                        var source = player.currentSrc();
                        if (source == '') {
                            digest = createDigest("channels/linear/getUrl", '{ "channelType":"TV" , "playbackType":"LIVE" , "channelId": 8 , "locale":"fa-IR" , "protocols" ' +
                                ': ["HLS"] , "pictureTypes" : ["_2D"] , "audioFormats" : ["AAC"] , "delay" : 0 , "profileGuid" : "'
                                + profileGuid + '" , "sessionId" : "' + sessionID + '"}');
                            $http({
                                url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest +
                                "/client/channels/linear/getUrl",
                                data: '{ "channelType":"TV" , "playbackType":"LIVE" , "channelId": 8 , "locale":"fa-IR" , "protocols" ' +
                                ': ["HLS"] , "pictureTypes" : ["_2D"] , "audioFormats" : ["AAC"] , "delay" : 0 , "profileGuid" : "'
                                + profileGuid + '" , "sessionId" : "' + sessionID + '"}',
                                method: "POST",
                                headers: {"Content-Type": "application/json"}
                            }).then(function (response) {
                                url = response.data;
                                console.log("recognized");
                                player.src({
                                    "type": "application/x-mpegURL",
                                    "src": url.url,
                                    "withCredentials": "true"
                                });
                                player.play();
                                console.log("response ok");
                                digest = createDigest("ping", '{"contentId" : 8 , "type" : "TV" , "delay" : 0 , ' +
                                    '"locale":"fa-IR","sessionId":' + sessionID.toString() + '}');
                                promise = $interval(function () {
                                    $http({
                                        url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest + "/client/ping",
                                        data: '{"contentId" : 8 , "type" : "TV" , "delay" : 0 , "locale":"fa-IR","sessionId":'
                                        + sessionID.toString() + '}',
                                        method: "POST",
                                        headers: {"Content-Type": "application/json"}
                                    }).then(function (response) {
                                        $scope.ping = response.data;
                                    });
                                }, platformInformation.pingRepeatFrom);
                            });
                        }
                    });
                });
            });

    });

    function createDigest(command, argument) {
        var string = "95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/" +
            command + argument;
        var digest = md5.createHash(string);
        return digest;
    }
});


