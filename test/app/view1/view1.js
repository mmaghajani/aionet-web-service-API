'use strict';
var app = angular.module('view1', ['angular-md5', "ngSanitize"]);
//
// "com.2fdevs.videogular",
//     "com.2fdevs.videogular.plugins.controls",
//     "com.2fdevs.videogular.plugins.overlayplay",
//     "com.2fdevs.videogular.plugins.poster"
var url = "";

// function loadStream() {
//     var $vid_obj = videojs("example_video_1");
//     $vid_obj.src(url.url);
//     $vid_obj.on('loadstart',function(){
//         $vid_obj.play();
//     });
// }

app.controller('View1Ctrl', function ($scope, $http, md5, $sce) {

    var digest = md5.createHash("95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/getPlatformInformation111fa-IR");
    $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
        digest + "/client/getPlatformInformation?" +
        "locale=fa-IR&appVersion=1&deviceWidth=1&deviceHeight=1")
        .then(function (response) {
            $scope.platformInformation = response.data;
        });

    digest = md5.createHash("95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/channels/listMPEG2fa-IR_2DHLSTV");
    $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
        digest + "/client/channels/list?" +
        "audioFormats=MPEG2&locale=fa-IR&pictureTypes=_2D&protocols=HLS&type=TV")
        .then(function (response) {
            $scope.list = response.data;
        });
    var login = "";
    var sessionID = "";
    var profiles = "";

    digest = md5.createHash("95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/login" + '{"username":"989378733393" , "password":"85491374" , "deviceName":"Linux-Chrome" , "locale":"fa-IR"}');
    $http({
        url: "https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" + digest + "/client/login",
        data: '{"username":"989378733393" , "password":"85491374" , "deviceName":"Linux-Chrome" , "locale":"fa-IR"}',
        method: "POST",
        headers: {"Content-Type": "application/json"}
    }).then(function (response) {
        login = response.data;
        $scope.login = login;
        sessionID = login.key;
        var s = "95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/profiles/listfa-IR" + sessionID;
        digest = md5.createHash(s);
        $http.get("https://tv.aionet.ir/Catherine/api/5.4/json/7743461522282941752/" +
            digest + "/client/profiles/list?" +
            "locale=fa-IR&" + "sessionId=" + sessionID.toString())
            .then(function (response) {
                profiles = response.data;
                $scope.profiles = profiles;

                var profileGuid = ((profiles.profiles)[0]).guid
                digest = md5.createHash("95d58639-24c0-4b72-80a5-e124f41d7af95.4json7743461522282941752client/channels/" +
                    "linear/getUrl" + '{ "channelType":"TV" , "playbackType":"LIVE" , "channelId": 8 , "locale":"fa-IR" , "protocols" ' +
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
                    $scope.url = url;
                    var player = videojs('video');
                    player.on('pause', function() {
                        player.bigPlayButton.show();

                        // Now the issue is that we need to hide it again if we start playing
                        // So every time we do this, we can create a one-time listener for play events.
                        player.on('play', function() {
                            player.bigPlayButton.hide();
                        });
                    });
                    player.src({"type": "application/x-mpegURL", "src": url.url, "withCredentials": "true"});
                    player.play();

                });
            });

    });


    // videojs("example_video_1",  { "controls": true, "autoplay": false, "preload": "auto" } , function(){
    //     var myPlayer = videojs('example_video_1');
    //     myPlayer.src({"type":"video/mp4", "src":"http://solutions.brightcove.com/bcls/assets/videos/Bird_Titmouse.mp4"});
    //     myPlayer.play() ;
    // });

    // $scope.mediaToggle = {
    //     sources: [
    //         {
    //             src: 'images/happyfit2.mp4',
    //             type: 'video/mp4'
    //         },
    //         {
    //             src: 'images/happyfit2.webm',
    //             type: 'video/webm'
    //         }
    //     ],
    //     tracks: [
    //         {
    //             kind: 'subtitles',
    //             label: 'English subtitles',
    //             src: 'assets/subtitles.vtt',
    //             srclang: 'en',
    //             default: true
    //         }
    //     ],
    //     poster: 'images/screen.jpg'
    // };
    //
    // //listen for when the vjs-media object changes
    // $scope.$on('vjsVideoMediaChanged', function (e, data) {
    //     console.log('vjsVideoMediaChanged event was fired');
    // });
});

