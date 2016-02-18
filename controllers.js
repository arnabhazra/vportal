
videoApp.controller('homeController', function ($scope, $rootScope, $location, coursePublishService, $q) {
    window.scroll(0, 0);
    $rootScope.showSearchHeader = true;
    $rootScope.pageTitle = "Digital Tutor";
    angular.element('#searchBox').val('');
    var carouselIndex = 0;
    $('.carousel').carousel({
        interval: 10000, // Time interval of carousel
        pause: "hover",
        wrap: true
    })

    // For color changing of Carousel
    $('#videoCarousel').bind('slide.bs.carousel', function (e) {
        carouselIndex++;
        if (carouselIndex % 5 == 0) {

            $('.featuredVideoContainer').css("background-color", "#3c5c9d");
        }

        if (carouselIndex % 5 == 1) {
            $('.featuredVideoContainer').css("background-color", "#583bae");

        }

        if (carouselIndex % 5 == 2) {
            $('.featuredVideoContainer').css("background-color", "#f15b5b");

        }
        if (carouselIndex % 5 == 3) {
            $('.featuredVideoContainer').css("background-color", "#6fb636");

        }
        if (carouselIndex % 5 == 4) {
            $('.featuredVideoContainer').css("background-color", "#11988d");

        }

    });

    $scope.showLoading = true;
    $rootScope.showAllVideo = true;
    var arrayLength = $rootScope.mainVideoList.length;
    var trackArrayLength = $rootScope.videoTracks.length;
    var startIndexForVideo = 0;
    var startIndexForTrack = 0;
    var popularVideoSize = 3;
    $scope.videoList = [];
    $scope.tracks = [];
    $rootScope.trackNameArray = [];
    $scope.hidePrev = true;
    $scope.hidePrevForTrack = true;
    var displayCount = 3; //  how many videos/tracks to display at once in a row of a page 

    for (i = 0; i < displayCount; i++) {
        $scope.videoList.push($rootScope.mainVideoList[i]);
        $scope.tracks.push($rootScope.videoTracks[i]);
    }

    $scope.previous = function (value) {
        if (value == "video") {
            $scope.hideNext = false;
            $scope.videoList.length = 0;
            var limit = startIndexForVideo;
            for (i = startIndexForVideo - displayCount; i < limit; i++) {
                if (startIndexForVideo > -1) {
                    --startIndexForVideo;
                    $scope.videoList.push($rootScope.mainVideoList[i]);
                }
            }
            if (startIndexForVideo == 0) {

                $scope.hidePrev = true;

            }
        }


        else {
            $scope.hideNextForTrack = false;
            $scope.tracks.length = 0;
            var limit = startIndexForTrack;
            for (i = startIndexForTrack - displayCount; i < limit; i++) {
                if (startIndexForTrack > -1) {
                    --startIndexForTrack;
                    $scope.tracks.push($rootScope.videoTracks[i]);
                }
            }
            if (startIndexForTrack == 0) {

                $scope.hidePrevForTrack = true;

            }


        }
    }


    $scope.next = function (value) {
        if (value == "video") {
            $scope.hidePrev = false;
            startIndexForVideo = startIndexForVideo + displayCount;
            $scope.videoList.length = 0;
            for (i = startIndexForVideo; i < startIndexForVideo + displayCount; i++) {

                if (i < arrayLength) {

                    $scope.videoList.push($rootScope.mainVideoList[i]);

                    //  currentIndex = i;
                }

                else {
                    $scope.hideNext = true;
                    break;
                }
            }

            if (i == arrayLength) {
                $scope.hideNext = true;

            }
        }

        else {

            $scope.hidePrevForTrack = false;
            startIndexForTrack = startIndexForTrack + displayCount;
            $scope.tracks.length = 0;
            for (i = startIndexForTrack; i < startIndexForTrack + displayCount; i++) {

                if (i < trackArrayLength) {

                    $scope.tracks.push($rootScope.videoTracks[i]);

                    //  currentIndex = i;
                }

                else {
                    $scope.hideNextForTrack = true;
                    break;
                }
            }

            if (i == trackArrayLength) {
                $scope.hideNextForTrack = true;

            }

        }
    }


    $scope.videoRedirect = function (videoId) {
        var url = "/video/" + videoId;
        $location.path(url);



    }

    $scope.trackRedirect = function (trackId) {
        var url = "/courses/" + trackId;
        $location.path(url);
    }
    $scope.videoCount = function () { // For populating course and video count in 'All Video' popover

        for (i = 0; i < $rootScope.trackNameArray.length; i++) {
            var deferred = $q.defer();
            var filter = {
                "Name": "TrackFilter",
                "Values": [],
                "Type": 0,
                "Operation": 0
            };

            filter.Values.push($rootScope.trackNameArray[i].trackId);
            var courseFetchRequest = {
                "Page": 1,
                "Size": 10,
                "Filters": []
            };

            courseFetchRequest.Filters.push(filter);
            coursePublishService.fetchCourses(courseFetchRequest,
    {
        successCallback: function (data) {
            var videoCount = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].Modules.length; j++) {
                    videoCount += data[i].Modules[j].Videos.length;
                }
            }
            for (i = 0; i < $rootScope.trackNameArray.length; i++) {

                if ($rootScope.trackNameArray[i].trackId == data[0].Track.Id)
                    $rootScope.trackNameArray[i].videoCount = videoCount;
            }
            if (i == $rootScope.trackNameArray.length) {
                $scope.showLoading = false;
            }
        },
        errorCallback: function (data, status) {
            var a = "f";
        }
    });
        }
    }

    // Fetching popular videos

    coursePublishService.fetchPopularVideos(popularVideoSize, {

        successCallback: function (data, status) {
            $scope.videoList = data;

        },
        errorCallback: function (status) {

            var a = "f";
        }



    });



    $scope.categories = [{
       type:"Technology",
       url:""

   }, { type: "Domain",
       url: ""
   }, { type: "Process",
       url: ""
   }];

    // Ends here

    //For  removing elements from breadcrumb
    if ($rootScope.breadcrumb.length > 1) {
        $rootScope.breadcrumb.splice(1, $rootScope.breadcrumb.length);
    }




});
videoApp.controller('videosController', function ($scope, $rootScope, postService, communityService, $location, $routeParams, coursePublishService) {
    window.scroll(0, 0);
    $rootScope.showSearchHeader = true;
    angular.element('#searchBox').val('');
    $rootScope.isVideo = false;
    var track = $routeParams.id;
    $rootScope.showAllVideo = true;
    $scope.playlistName = "";
    $scope.description = "";
    var videoArray = new Array();
    $scope.trackOwners = [];
    $scope.videoList = [];
    $scope.courses = [];
    $scope.expertModules = [];
    var trackOwnerMapping = [
    { "id": "1",
        "name": "Archana S rao",
        "empid": "9608"
    },
    { "id": "3",
        "name": "Shubha Bellave",
        "empid": "36699"
    },
    { "id": "4",
        "name": "Sangeetha S",
        "empid": "18165"
    },


    { "id": "5",
        "name": "Anubhav Pradhan",
        "empid": "31560"
    },

    { "id": "6",
        "name": "Seema Acharya",
        "empid": "30736"
    },
        {
            "id": "7",
            "name": "Meenakshi Sahasranaman",
            "empid": "77414"

        },
    {
        "id": "8",
        "name": "Amrita Deo",
        "empid": "11959"
    },

    {
        "id": "2",
        "name": "Ajit Ravindran Nair",
        "empid": "27529"
    },

    {
        "id": "9",
        "name": "Shyam Sundar M G",
        "empid": "30938"
    },
    {
        "id": "11",
        "name": "Bhargava Chandrasekara Sastry Kugur",
        "empid": "24172"
    },
    {
        "id": "13",
        "name": "Amandeep Kaur",
        "empid": "620572"
    },
    {
        "id": "13",
        "name": "Vidya Kp Rao",
        "empid": "179488"
    },
    {
        "id": "14",
        "name": "Sasank Nayak",
        "empid": "20913"
    },
    {
        "id": "15",
        "name": "Ravi Ganapathy",
        "empid": "62637"
    },
    {
        "id": "16",
        "name": "Dr. Manoj Manuja",
        "empid": "30803"
    }];

    var filter = {
        "Name": "TrackFilter",
        "Values": [],
        "Type": 0,
        "Operation": 0

    };

    filter.Values.push(track);
    var courseFetchRequest = {
        "Page": 1,
        "Size": 10,
        "Filters": []
    };

    courseFetchRequest.Filters.push(filter);
    videoPortalLoader('show', ' Fetching topics...');
    coursePublishService.fetchCourses(courseFetchRequest,
    {
        successCallback: function (data) {
            videoPortalLoader('hide', '');
            if (data.length > 0) {
                $scope.trackDescription = data[0].Track.Description;
                $scope.trackName = data[0].Track.Name;
                $rootScope.pageTitle = $scope.trackName + " Track (DT)";
            }
            for (var i = 0; i < data.length; i++) {
                $scope.courses.push(data[i]);
            }
            for (var i = 0; i < $scope.courses.length; i++) {
                $scope.courses[i].totalVideoCount = 0;
                $scope.courses[i].totalDuration = 0;
                for (var j = 0; j < $scope.courses[i].Modules.length; j++) {
                    if (!$scope.courses[i].Modules[j].IsExpert) {
                        $scope.courses[i].totalVideoCount += $scope.courses[i].Modules[j].Videos.length;
                        for (var k = 0; k < $scope.courses[i].Modules[j].Videos.length; k++) {
                            $scope.courses[i].totalDuration += parseInt($scope.courses[i].Modules[j].Videos[k].Duration);
                        }

                    }

                    else {
                        $scope.courses[i].Modules[j].courseId = $scope.courses[i].Id; // Getting all expert modules in a course
                        $scope.expertModules.push($scope.courses[i].Modules[j]);
                    
                    }
                }
            }


            $scope.expertModules.sortOn('PopularityIndex', false, true); // Sorting expert modules based on popularity index
            //--------------for breadcrumb---------------------//
            var breadcrumbObj = new Array();
            breadcrumbObj = [{ id: 1, name: $scope.trackName, url: '/courses/' + data[0].Track.Id}];
            createBreadcrumb(breadcrumbObj, $rootScope);
            //breadcrumb(1, data[0].Track.Name, $location.$$url, $rootScope);
            //---------------End----------------------------//
        },
        errorCallback: function (data, status) {
            videoPortalLoader('hide', '');
            var a = "f";

        }

    });

    $scope.redirectToModule = function (courseIndex) {
        var url = "";
        url = "/modules/" + track + "/" + courseIndex;
        $location.path(url);



    }
    for (i = 0; i < trackOwnerMapping.length; i++) {
        if (trackOwnerMapping[i].id == track) {

            $scope.trackOwners.push(trackOwnerMapping[i]);

        }


    }


});

videoApp.controller('videoController', function ($scope, $rootScope, $routeParams, $location, communityService, postService, commonServices, coursePublishService, mmsLoggerService) {
    window.scroll(0, 0);
    //document.title = "111";
    $rootScope.pageTitle = "digital Tutor";
    var courseIndex = $routeParams.courseIndex;
    var moduleIndex = $routeParams.moduleIndex;
    $scope.videoIndex = $routeParams.videoIndex;
    var playListId = "";
    $scope.showPostButton = false;
    $scope.playListVideos = [];
    $scope.recommendedVideos = [];
    var pageNumber = 0;
    var load = false;
    $rootScope.isVideo = true;
    $scope.showLoading = true;
    $scope.posts = [];
    $rootScope.showAllVideo = false;
    $scope.width = 900;
    $scope.height = 580;
    $scope.autoplay = true;
    $scope.vUrl = "";
    $scope.selectedIndex = 0;
    var videoUrl = "";
    var activeImageUrl = "";
    $scope.tutors = [];
    var videos = new Array();
    var trackId = "";
    var konnectPostIdForVideo = "";
    var timeStamp = new Date();
    var postCounts = 10;
    timeStamp = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1) + "-" + timeStamp.getDate() + "T" + timeStamp.getHours() + ":" + timeStamp.getMinutes() + ":" + timeStamp.getSeconds() + ".000";
    $scope.videoDetails = { id: "", liked: false, likeCount: "" };
    videoPortalLoader('show', 'Loading...');

    coursePublishService.fetchModules(courseIndex, {

        successCallback: function (data) {
            $scope.fullModuleName = data.Modules[moduleIndex].Title;
            trackId = data.Track.KonnectCommunitySId;
            $scope.trackName = data.Track.Name;
            $scope.playListVideos = data.Modules[moduleIndex].Videos;
            videoUrl = data.Modules[moduleIndex].Videos[$scope.videoIndex].URL;
            $scope.description = data.Modules[moduleIndex].Videos[$scope.videoIndex].Description;
            konnectPostIdForVideo = data.Modules[moduleIndex].Videos[$scope.videoIndex].KonncectPostId;
            $scope.videoDetails.id = konnectPostIdForVideo;
            $scope.title = data.Modules[moduleIndex].Videos[$scope.videoIndex].Title;
            // getting SMEs
            for (j = 0; j < $rootScope.tracksTutorMapping.length; j++) {
                if ($rootScope.tracksTutorMapping[j].id == data.Track.Id) {
                    $scope.tutors.push($rootScope.tracksTutorMapping[j]);
                }
            }


            // ends here
            videoPortalLoader('hide', '');

            if (($rootScope.browserInfo.name.toLowerCase() == "ie" || $rootScope.browserInfo.name.toLowerCase() == "msie") && parseInt($rootScope.browserInfo.version) <= 9) {
                $("#videoPlayer").html('<object type="application/x-shockwave-flash" name="StrobeMediaPlayback" data="http://infytv/_controltemplates/InfyTv20/Player/StrobeMediaPlayback.swf" width="100%" height="100%" id="player" style="visibility: visible;">' +
                                            '<param name="allowFullScreen" value="true">' +
                                            '<param name="flashvars" value="id=1&amp;src=' + videoUrl + '&amp;autoPlay=' + $scope.autoplay + '">' +
                                            '</object>');
            }
            else {
                // Create a StrobeMediaPlayback configuration
                var parameters = {
                    src: videoUrl,
                    //ads_preroll: "http://mediapm.edgesuite.net/osmf/content/test/manifest-files/progressive.f4m",
                    ads_preroll: 'rtmp://INDBLRPK2ITVEDG/vod/mp4:widgets/ETA/Digital_Tutor_Title/Digital_Tutor_Title',
                    autoPlay: true,
                    controlBarAutoHide: true,
                    plugin_ads: "../StrobeMediaPlayback/AdvertisementPlugin.swf",
                    enableStageVideo: true,
                    javascriptCallbackFunction: "onJavaScriptBridgeCreated"
                };
                // Embed the player SWF:
                swfobject.embedSWF("../StrobeMediaPlayback/StrobeMediaPlayback.swf"
			    , "strobeMediaPlayback"
			    , '100%'
			    , '100%'
			    , "10.0.0"
			    , {}
			    , parameters
			    , { allowFullScreen: "true" }
			    , { name: "strobeMediaPlayback" });
            }

            function onCurrentTimeChange(time, playerId) {
                document.getElementById("currentTime").innerHTML = time;
            }

            function onDurationChange(time, playerId) {
                document.getElementById("duration").innerHTML = time;
            }
            var player = null;
            function onJavaScriptBridgeCreated(playerId) {
                if (player == null) {
                    player = document.getElementById(playerId);

                    // Add event listeners that will update the
                    player.addEventListener("currentTimeChange", "onCurrentTimeChange");
                    player.addEventListener("durationChange", "onDurationChange");
                }
            }
            getVideoLikeCount(konnectPostIdForVideo);

            // Calling breadcrumb function

            breadcrumb(3, data.Modules[moduleIndex].Videos[$scope.videoIndex].Title, $location.$$url, $rootScope);
            //

            //----logging for view Video---------------------//
            var logObj = {
                EmpNo: $rootScope.personDetails.PersonSId,
                TxtLogOnUser: $rootScope.personDetails.MailId,
                DtDateTime: timeStamp,
                ActivityName: "View Content",
                assetid: konnectPostIdForVideo,
                recipients: trackId
            };
            logActivity(logObj, mmsLoggerService);

        },
        errorCallback: function (data, status) {
            var a = "f";
        }


    });

    function getVideoLikeCount(konnectPostId) {
        var kbPostIds = [konnectPostId];
        var request = {
            PostIds: kbPostIds
        };
        postService.getVoteupCount(request, {
            successCallback: function (data) {
                $scope.videoDetails.liked = data.d.PostMarkAsAnswers.PostQualityRatingCount[0].IsRatedByLoggedInUser;
                $scope.videoDetails.likeCount = data.d.PostMarkAsAnswers.PostQualityRatingCount[0].CountOfQualityRating;
            },
            errorCallback: function (data, status) {
                var a = "f";

            }
        });
    }


    // Changing Video from playlist -- Starts Here
    $scope.changeVideoFromPlaylist = function (index) {
        $location.path("/video/" + courseIndex + "/" + moduleIndex + "/" + index);

    }

    // Ends Here


    // method for fetching discussion for videos
    $scope.fetchPosts11 = function () {
        $scope.showLoading = true;
        pageNumber++;

        if (postCounts == 10) {
            var fetchRequest = {

                actorSId: $rootScope.personDetails.PersonSId,
                filters: [],
                pageSize: 10,
                pageNumber: pageNumber,
                store: 'PublicTimeline'

            };


            fetchRequest.filters.push({
                name: 'PostLastUpdatedFilter',
                values: [timeStamp],
                type: 'INCLUDE',
                op: 'OR'


            }
                );

            fetchRequest.filters.push({
                name: 'PostSubjectIdFilter',
                values: [konnectPostIdForVideo],
                type: 'INCLUDE',
                op: 'OR'


            });

            fetchRequest.filters.push({
                name: 'PostKindFilter',
                values: ['Query'],
                type: 'INCLUDE',
                op: 'OR'


            });
            fetchRequest.filters.push({
                name: 'PostHiddenFilter',
                values: ['true'],
                type: 'INCLUDE',
                op: 'OR'


            });


            postService.fetchPosts(fetchRequest, {
                successCallback: function (data) {

                    postCounts = data.d.result.hits.length;
                    if (data.d.operationResponse.status == 0) {
                        $scope.showLoading = false;
                        if ($scope.posts.length == 0 && data.d.result.hits.length == 0) {
                            $scope.postCount = 0;

                        }

                        $scope.fetchedPosts = data.d.result.hits;



                        for (i = 0; i < $scope.fetchedPosts.length; i++) {
                            $scope.fetchedPosts[i].postTime = commonServices.formatTimeAgo($scope.fetchedPosts[i].meta.postdate);
                            $scope.fetchedPosts[i].liked = $scope.fetchedPosts[i].meta.isvotedup;
                            $scope.fetchedPosts[i].likeCount = $scope.fetchedPosts[i].meta.voteupcount;
                            $scope.fetchedPosts[i].meta.comments = new Array();
                            $scope.fetchedPosts[i].meta.commentcount = 0;
                            $scope.fetchedPosts[i].hasRepliesLoaded = false;
                            $scope.posts.push($scope.fetchedPosts[i]);
                        }
                    }
                    else {

                    }

                },

                errorCallback: function (data, status) {

                    var a = "f";


                }


            });
        }

        else {

            $scope.showLoading = false;
        }
    }


    // ends here

    // For posting question

    $scope.addKonnectPost = function (postData, postTitle) {
        videoPortalLoader('show', 'Posting your question...');
        var postRecpArray = [];
        var recpAction = "Operate";
        var recipient1 = {
            RecipientSId: trackId,
            RecipientEntityType: "Community"
        }


        postRecpArray.push(recipient1);
        var tagsArray = [];
        //        tagsArray.push(tags);
        var tagAction = "DonotOpearte";
        var postAttr = [{

            Attribute: "PostSource",
            Value: "VideoPortal",
            Sequence: 1


        }];

        var postAttachmentArray = [];
        var attachmentAction = "DonotOpearte";
        var requestObj = {
            PostKind: 'Query',
            ParentPostId: $scope.playListVideos[$scope.videoIndex].KonncectPostId,
            PostStatus: 'OpenQuery',
            PostRecipients: postRecpArray,
            PostRecipientsAction: recpAction,
            PostTags: tagsArray,
            PostTagsAction: tagAction,
            PostAssetAttachments: postAttachmentArray,
            PostAssetAttachmentsAction: attachmentAction,
            PostContent: { PostTitle: postTitle, PostAbstract: "", PostData: postData },
            PostContentAction: 'Operate',
            PostAttributes: postAttr,
            PostAttributesAction: 'Operate'
        };
        postService.addPost(requestObj, {

            successCallback: function (data) {

                if (data.d.OperationResponse.status == 0) {
                    videoPortalLoader('hide', '');
                    //  pageNumber = 0;
                    //  $scope.posts.length = 0;
                    $scope.hidePostButtonMethod();
                    //pushing post data
                    var postStruct = {
                        id: data.d.PostId,
                        vis: 'Public',
                        actornid: $rootScope.personDetails.PersonNId,
                        actorsid: $rootScope.personDetails.PersonSId,
                        actorname: $rootScope.personDetails.FirstName,
                        title: postTitle,
                        summary: "",
                        data: postData,
                        postkind: 'Query',
                        postdate: new Date(),
                        lcdate: null,
                        ludate: new Date(),
                        lcedate: null,
                        lrdate: new Date(),
                        pubdate: new Date(),
                        commentcount: 0,
                        repostcount: 0,
                        source: "",
                        status: 'OpenQuery',
                        hidden: false,
                        recps: postRecpArray,
                        tags: tagsArray,
                        attachments: null,
                        reviewer: null,
                        polloptions: null,
                        contribs: null,
                        repostors: null,
                        comments: null,
                        atts: null,
                        voteupcount: 0

                    }

                    var completePostStruct = {
                        "meta": postStruct,
                        "postTime": 'Just Now',
                        "rankField": null,
                        "sequenceNumber": '1',
                        "likeCount": 0,
                        'liked': false



                    }
                    //ends here
                    $scope.posts.unshift(completePostStruct);

                    //  $scope.fetchPosts11();
                }

                else {
                    videoPortalLoader('show', 'Unable to post your question');
                    setTimeout(function () {
                        videoPortalLoader('hide', "");
                    }, 2000);

                }


            },
            errorCallback: function (data, status) {

                videoPortalLoader('show', 'Some error occurred while posting your question');
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 2000);


            }




        });


    }

    // For posting question -- this method calls addKonnectPost method
    $scope.sendPost = function () {
        var postData = $("#postForVideo").val();
        var postSubject = $("#subjectForVideo").val();
        if (postData.length == 0 && postSubject.length == 0) {
            videoPortalLoader('show', 'Please enter some question');
            setTimeout(function () {
                videoPortalLoader('hide', "");
            }, 2000);
        }

        else {
            $scope.addKonnectPost(postData, postSubject);

        }
    }

    $scope.postComment = function (post, commentTxt) {
        if (commentTxt) {
            // Attachment processing
            var postAttachmentArr = [];
            var attachmentAction = "DonotOpearte"
            var attachmentStruct = [];
            var commentPostKind = "QueryReply";
            var postAttributesArr = [];
            var postAttributesAction = "DonotOpearte";

            commentTxt = commonServices.escapeHTML(commentTxt);
            var request = {
                ParentPostId: post.meta.id,
                PostKind: commentPostKind, //QueryReply
                PostStatus: 'ActivePost', //OpenQuery
                PostContent: {
                    PostData: commentTxt
                },
                PostContentAction: 'Operate',
                PostAssetAttachments: postAttachmentArr,
                PostAssetAttachmentsAction: attachmentAction,
                PostAttributes: postAttributesArr,
                PostAttributesAction: postAttributesAction
            }
            postService.addPost(request, {
                successCallback: function (data) {


                    if (data.d.OperationResponse.status == 0) {
                        var a = "s";

                        var commentStruct = {
                            id: data.d.PostId,
                            actornid: $scope.personDetails.PersonNId,
                            actorsid: $scope.personDetails.PersonSId,
                            actorname: $scope.personDetails.FirstName,
                            title: "",
                            summary: "",
                            data: request.PostContent.PostData,
                            date: new Date(),
                            ledate: null,
                            postkind: request.PostKind,
                            commentcount: 0,
                            source: "",
                            commentPic: $scope.personDetails.CommentPhotoUri,
                            timeUpdated: commonServices.formatTimeAgo(new Date()),
                            liked: false,
                            likeCount: 0,
                            status: request.PostStatus,
                            attachments: attachmentStruct,
                            voteupcount: 0,
                            VotedUp: false
                        }
                        if (post.meta.comments == null) {
                            post.meta.comments = [];
                            post.meta.commentcount = post.meta.commentcount + 1;
                        }

                        post.meta.comments.push(commentStruct);
                        $scope.$apply();
                        $scope.$broadcast('commentSuccess', {})


                    }
                    else {
                        alert('Error in post Success');
                    }

                },
                errorCallback: function (data) {
                    // angular.element(".loaderDiv").scope().acticvateLoader = true;
                    commonServices.displayConfirmation("There was some error while posting. Please try after some time. If issue persisits, please contact <a href='mailto:konnect@infosys.com'>konnect@infosys.com</a>");
                }
            });
        }
        else {
            commonServices.displayConfirmation("Please provide text for the comment");


        }
    }

    $scope.fetchMoreComments = function (post, index) {
        try {
            var pageSizeForComment = 0;
            if (post.meta.commentcount - post.meta.comments.length >= 10) {
                pageSizeForComment = 10;
            }

            else {
                pageSizeForComment = post.meta.commentcount - post.meta.comments.length + 1;
            }
            var commentFilter = [{
                name: 'PostConversationIndex',
                values: [post.meta.id],
                type: 'INCLUDE',
                op: 'OR'
            }];
            var postFetchRequest = {
                pageNumber: Math.ceil((post.meta.commentcount) / 10),
                pageSize: pageSizeForComment,
                filters: commentFilter,
                timeline: 'Conversation'
            };
            $scope.acticvateLoader = true;
            postService.fetchPosts(postFetchRequest, {
                successCallback: function (data) {
                    // angular.element(".loaderDiv").scope().acticvateLoader = false;
                    $scope.acticvateLoader = false;
                    if (data.d.operationResponse.status == 0) {
                        var i = 0;
                        var comments = data.d.result.posts[0].meta.comments;

                        // Pushing comments 

                        for (i = comments.length - 1; i >= 0; i--) {
                            $scope.posts[index].meta.comments.push(comments[i]);
                        }

                        $scope.$apply();
                    }
                    else {
                        alert("Status : " + data.d.operationResponse.status);
                        pageNumber--;
                    }
                },
                errorCallback: function (data) {
                    $scope.moreCommentsClicked = false;
                    angular.element(".loaderDiv").scope().acticvateLoader = false;
                }
            });
        }
        catch (e) {
        }
    }
    $scope.toggleLike = function (post, type) {
        if (type == "comment") {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.id.toString()
                }
            };
        }
        else if (type == "video") {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.id.toString()
                }
            };
        }
        else {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.meta.id.toString()
                }
            };
        }
        if (!post.liked) {
            postService.like(data, {
                successCallback: function (data) {
                    if (data.d.OperationResponse.status == 0) {
                        if (type == 'video') {
                            $scope.videoDetails.likeCount = $scope.videoDetails.likeCount + 1;
                            $scope.videoDetails.liked = true;
                            // Logging for video like by - Sabareesh--------------------//
                            var logObj = {
                                EmpNo: $rootScope.personDetails.PersonSId,
                                TxtLogOnUser: $rootScope.personDetails.MailId,
                                DtDateTime: timeStamp,
                                ActivityName: "Like",
                                assetid: konnectPostIdForVideo,
                                recipients: trackId
                            };
                            logActivity(logObj, mmsLoggerService);
                        }
                        else {
                            post.likeCount = post.likeCount + 1;
                            post.liked = true;
                        }

                    }
                },
                errorCallback: function (data, status) {
                    var abc = 10;
                }
            });

        }
        else {
            postService.unlike(data, {
                successCallback: function (data) {
                    if (data.d.OperationResponse.status == 0) {
                        if (type == 'video') {
                            $scope.videoDetails.likeCount = $scope.videoDetails.likeCount - 1;
                            $scope.videoDetails.liked = false;
                        }
                        else {
                            post.likeCount = post.likeCount - 1;
                            post.liked = false;
                        }
                    }
                },
                errorCallback: function (data, status) {
                    var abc = 10;
                }
            });
        }
    }
    $scope.fetchComments = function (post, index) {
        try {
            if (!post.hasRepliesLoaded) {
                pageSizeForComment = 10;
            }
            else {
                if (post.meta.commentcount - post.meta.comments.length >= 10) {
                    pageSizeForComment = 10;
                }
                else {
                    //pageSizeForComment = post.meta.commentcount - post.meta.comments.length + 1;
                    pageSizeForComment = 10;
                }
            }
            var request = new Object();
            request = {
                actorsid: $rootScope.personDetails.PersonSId,
                filters: [
                {
                    name: "PostConversationIndex",
                    values: [post.meta.id],
                    type: "INCLUDE",
                    op: "OR"
                }],
                rankfields: [],
                properties: [],
                pageSize: pageSizeForComment,
                pageNumber: Math.ceil((post.meta.comments.length) / 10) + 1,
                store: "Conversation"
            }
            postService.fetchPosts(request, {
                successCallback: function (data) {
                    if (data.d.operationResponse.status == 0) {
                        var i = 0;
                        if (!$scope.posts[index].hasRepliesLoaded)
                            $scope.posts[index].meta.commentcount = data.d.result.hits[0].meta.commentcount;

                        $scope.posts[index].hasRepliesLoaded = true;
                        var comments = data.d.result.hits[0].meta.comments;

                        // Pushing comments 

                        for (i = 0; i < comments.length; i++) {
                            $scope.posts[index].meta.comments.push(comments[i]);
                        }

                        $scope.$apply();
                    }
                    else {
                        alert("Status : " + data.d.operationResponse.status);
                        pageNumber--;
                    }
                },
                errorCallback: function (data) {
                    $scope.moreCommentsClicked = false;
                    angular.element(".loaderDiv").scope().acticvateLoader = false;
                }
            });
        }
        catch (e) {
        }
    }

    //
    $scope.askQuestion = function () {
        window.scroll(500, 500);
        $('#subjectForVideo').focus();
        if ($scope.showPostButton)
            $scope.showPostButton = true;
        else
            $scope.showPostButton = false;
    }
    //Initilization of JQ editor
    $('#postForVideo').jqte({ placeholder: "Your Question goes here.....", source: false });
    //


    $scope.showPostButtonMethod = function () {
        $("#sliderRTE").slideDown("slow");
    }


    $scope.hidePostButtonMethod = function () {
        $('#postForVideo').jqteVal("");
        $('#postForVideo').val('');
        $('#subjectForVideo').val('');
        $("#sliderRTE").slideUp("slow");
    }

    $scope.changeVideoDimension = function () {
        $('.slimScrollDiv').css("display", "none");
        $('.changeVideoDimensionIcon').css("display", "none");
        $('.expandPlaylist').css("display", "inline-block");
        $('.videoPlayerDiv').css("width", "1200px");




    }


    $scope.reduceVideoDimension = function () {
        $('.slimScrollDiv').css("display", "block");
        $('.changeVideoDimensionIcon').css("display", "block");
        $('.expandPlaylist').css("display", "none");
        $('.videoPlayerDiv').css("width", "910px");


    }


});


videoApp.controller('showModulesController', function ($scope, $rootScope, $routeParams, $location, communityService, postService, commonServices, coursePublishService) {
    window.scroll(0, 0);
    $rootScope.showSearchHeader = true;
    angular.element('#searchBox').val('');
    var track = $routeParams.track;
    var courseIndex = $routeParams.courseIndex;
    $rootScope.videoModules = [];
    $rootScope.showAllVideo = true;
    videoPortalLoader('show', ' Fetching modules...');
    coursePublishService.fetchModules(courseIndex, {
        successCallback: function (data) {
            videoPortalLoader('hide', '');
            $scope.courseTitle = data.Title;
            $scope.courseDescription = data.Description;
            $scope.trackId = data.Track.Id;
            $rootScope.pageTitle = $scope.courseTitle;
            for (i = 0; i < data.Modules.length; i++) {
                $rootScope.videoModules.push(data.Modules[i]);
            }
            //breadcrumb(2, data.Title, $location.$$url, $rootScope);
            var breadcrumbObj = new Array();
            breadcrumbObj = [{ id: 1, name: data.Track.Name, url: "/courses/" + $scope.trackId }, { id: 2, name: $scope.courseTitle, url: '/modules/' + $scope.trackId + "/" + courseIndex}];
            createBreadcrumb(breadcrumbObj, $rootScope);
        },
        errorCallback: function (data, status) {
            var a = "f";
        }
    });
    // Ends here

    //Redirecting to video page
    $scope.redirectToVideo = function (moduleId, videoIndex) {
        var url = "/video/" + courseIndex + "/" + moduleId + "/" + videoIndex;
        $location.path(url);
    }

    // For navigating to modules
    $scope.NavigateToModule = function (moduleLocId) {
        var id = 'Module_' + moduleLocId;
        var top1 = $('#' + id).offset().top
        $('html, body').animate({
            scrollTop: top1 - 20
        }, 2000);
    }
});

//--------------------------------------------------------------------------------------------------------------------------------//
videoApp.controller('createCourseNewCtrl', function ($scope, $rootScope, postService, coursePublishService, $location, $http) {
    $rootScope.showSearchHeader = true;
    var now = new Date();
    var timeStamp = now.getFullYear() + "-" + getTimeString(10, (now.getMonth() + 1)) + "-" + getTimeString(10, now.getDate()) + "T";
    timeStamp += getTimeString(10, now.getHours()) + ":" + getTimeString(10, now.getMinutes()) + ":" + getTimeString(10, now.getSeconds()) + ".000Z";
    var currentModuleIndex = null;
    var thumbnailType = null;
    $scope.disableCourseSubmission = false;
    $scope.tracks = [{ Name: "Microsoft", Id: 1 }, { Name: "Mobility", Id: 2 },
    { Name: "IVS", Id: 3 }, { Name: "Java", Id: 4 }, { Name: "Digital Academy", Id: 5 },
     { Name: "Business Intelligence", Id: 6 },
      { Name: "Agile", Id: 7 },
      { Name: "Oracle", Id: 8 },
      { Name: "CIS Academy", Id: 9 },
      { Name: "Expert", Id: 10 },
      { Name: "Mainframes", Id: 11 },
      { Name: 'Miscellaneous', Id: 12 },
      { Name: 'Cloud', Id: 13 },
      { Name: 'Databases', Id: 14 },
      { Name: 'OpenSystems', Id: 15 },
      { Name: 'BigData', Id: 16 }
    ];
    $scope.courseData = new Object();
    $scope.moduleData = new Object();
    $scope.videoData = new Object();
    $scope.disableIsModular = false;
    $scope.savedMode = false;
    $scope.loadKeywords = function ($query) {
        aUrl = $rootScope.videoServicePath + 'keyword/_autocomplete/' + $query;
        return $http.get(aUrl).then(function (response) {
            var keywords = response.data;
            return keywords;
        });
    }
    $scope.loadModerators = function ($query) {
        var request = {
            request: {
                actorSId: $rootScope.personDetails.PersonSId,
                pattern: $query
            }
        };
        var url = $rootScope.hostName + '/CPM/Post/PostFetchWS.asmx/PostFetchRecipientAutocomplete';
        return $http({ method: 'POST', url: url, data: JSON.stringify(request) }).then(function (response) {
            var moderators = response.data.d.result.hits;
            return moderators;
        });
    }
    var course = {
        Title: "",
        Description: "",
        Creator: $rootScope.personDetails.PersonNId,
        CreationDate: timeStamp,
        Duration: 30,
        ThumbnailUrl: "",
        Status: "Active",
        Track: {},
        Keywords: [],
        Moderators: [],
        Modules: []
    }

    $scope.addedModules = course.Modules;
    $scope.addModule = function () {
        $scope.modalTemplate = "addModuleTemplate";
        $("#modalPopupTemplate").css("display", "block");
    }
    $scope.deleteModule = function (index) {
        course.Modules.splice(index, 1);
    }
    $scope.addVideo = function (index) {
        currentModuleIndex = index;
        $scope.modalTemplate = "addVideoTemplate";
        $("#modalPopupTemplate").css("display", "block");
    }
    $scope.closeModal = function (container_id) {
        $scope.resetForm(container_id);
        $("#modalPopupTemplate").css("display", "none");
    }
    $scope.resetForm = function (container_id) {
        $('#' + container_id).find('input:text, input:password, input:file, select, textarea')
        .each(function () {
            $(this).val('');
        });
        $('#' + container_id).find('input:radio, input:checkbox').each(function () {
            $(this).removeAttr('checked');
            $(this).removeAttr('selected');
        });
        if (container_id = "moduleForm")
            $scope.moduleData = new Object();
        if (container_id = "videoForm")
            $scope.videoData = new Object();
    }
    $scope.finishModuleCreation = function (container_id) {
        var Module = new Object();
        Module.Status = "Active";
        Module.Title = $scope.moduleData.title;
        Module.Description = $scope.moduleData.desc;
        Module.Creator = $rootScope.personDetails.PersonNId;
        Module.CreationDate = timeStamp;
        Module.Duration = 25;
        Module.Videos = [];
        Module.Keywords = $scope.moduleData.keywords;
        course.Modules.push(Module);
        $scope.closeModal(container_id);
        $scope.disableIsModular = true;
    }
    $scope.finishVideoAdd = function (container_id) {
        $scope.disableIsModular = true;
        var Video = new Object();
        Video.Title = $scope.videoData.title;
        Video.Description = $scope.videoData.desc;
        Video.CreationDate = timeStamp;
        Video.Creator = $rootScope.personDetails.PersonNId;
        Video.Duration = $scope.videoData.duration;
        Video.Status = "Active";
        Video.ThumbnailURL = $scope.videoData.thumbnailUrl;
        //Video.URL = parseURL($scope.videoData.videoUrl);
        Video.URL = $scope.videoData.videoUrl.trim();
        Video.TrackId = $scope.courseData.track.Id;
        Video.Keywords = $scope.videoData.keywords;

        $scope.disableCourseSubmission = false;
        if (!$scope.courseData.isModular) {
            if (course.Modules.length <= 0) {
                var Module = new Object();
                Module.Status = "Active";
                Module.Title = $scope.courseData.title;
                Module.Description = $scope.courseData.desc;
                Module.Creator = $rootScope.personDetails.PersonNId;
                Module.CreationDate = timeStamp;
                Module.Duration = 25;
                Module.Videos = [];
                course.Modules.push(Module);
                if (Video.URL != "" && typeof (Video.URL) != 'undefined') {
                    course.Modules[0].Videos.push(Video);
                    $scope.videoData.videoUrlValid = false;
                }
                else {
                    $scope.videoData.videoUrlValid = true;
                }

            }
            else {
                if (Video.URL != "" && typeof (Video.URL) != 'undefined') {
                    course.Modules[0].Videos.push(Video);
                    $scope.videoData.videoUrlValid = false;
                }
                else {
                    $scope.videoData.videoUrlValid = true;
                }
            }
        }
        else {
            if (Video.URL != "" && typeof (Video.URL) != 'undefined') {
                course.Modules[currentModuleIndex].Videos.push(Video);
                $scope.videoData.videoUrlValid = false;
            }
            else {
                $scope.videoData.videoUrlValid = true;
            }

        }
        if (!$scope.videoData.videoUrlValid) {
            $scope.closeModal(container_id);
        }
    }
    $scope.submitCourse = function () {
        videoPortalLoader('show', 'Creating your course...');
        course.Title = $scope.courseData.title;
        course.Description = $scope.courseData.desc;
        course.ThumbnailUrl = $scope.courseData.thumbnail;
        course.Track = $scope.courseData.track;
        course.Keywords = $scope.courseData.keywords;
        for (i = 0; i < $scope.courseData.moderators.length; i++) {
            var Moderator = {
                Status: "Active",
                Person: { Id: $scope.courseData.moderators[i].nid }
            }
            course.Moderators.push(Moderator);
        }
        coursePublishService.addCourse(course, {
            successCallback: function (data) {
                videoPortalLoader('show', 'Your course has been created successfully.');
                $scope.savedMode = true;
                //$scope.courseData = data;
                $scope.courseTitle = data.Title;
                $scope.courseDescription = data.Description;
                $scope.videoModules = [];
                for (i = 0; i < data.Modules.length; i++) {
                    $scope.videoModules.push(data.Modules[i]);
                }
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 1000);
            },

            errorCallback: function (data) {
                var msg = "Unable to create your course.<br> Please contact administrator for further issues.";
                videoPortalLoader('show', msg);
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 2000);
            }
        });
    }
    $(document).ready(function () {
        $(document).on('change', '.btn-file :file', function () {
            var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            var id = $(this).attr("id");
            uploadFile(id);
            var input1 = $(this).parents('.input-group').find(':text');
            if (input1.length) {
                input1.val(label);
            } else {
                if (label) alert(label);
            }
        });
    });

    function uploadFile(id) {
        videoPortalLoader('show', 'Uploading your file...');
        var data = new FormData();
        var files = $('#' + id).get(0).files;
        if (id == 'courseThumbnailUpload') {
            thumbnailType = 'C';
        }
        else if (id == 'videoThumbnailUpload') {
            thumbnailType = 'V';
        }
        else {
        }
        if (files.length > 0) {
            var file = files[0];
            var size = file.size / 1024;
            if (size < 520) {
                data.append("UploadedFile", files[0]);
                data.append("fileType", "image");
            }
            else {
                videoPortalLoader('show', "Image file should be at max 500KB.");
                setTimeout(function () { videoPortalLoader('hide', ""); }, 20000);
                return false;
            }
        }
        else { return false; }


        var url = "/FileUpload.aspx";
        var ajaxRequest = $.ajax({
            type: "POST",
            url: url,
            contentType: false,
            processData: false,
            data: data
        });

        ajaxRequest.done(function (response, textStatus, jqXHR) {
            if (response.indexOf("SUCCESS") == 0 && textStatus == 'success') {
                response = response.substring(8).trim();
                var fileUrl = $rootScope.fileUploadPath + response;
                //var photoUpload = $('#' + id).parent().find(".photoUpload");
                //                photoUpload.html('');
                //                photoUpload.css("background", "url(" + fileUrl + ") no-repeat");
                //                photoUpload.css("background-size", "contain");
                if (thumbnailType == 'C') {
                    $scope.courseData.thumbnail = fileUrl;
                }
                else if (thumbnailType == 'V') {
                    $scope.videoData.thumbnailUrl
                }

                videoPortalLoader('show', 'Your file has been uploaded successfully.');
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 1000);

            }
            else {
                if (response == 'Image is too large.') {
                    videoPortalLoader('show', "Image file should be at max 500KB.");
                }
                else {
                    var msg = "Unable to upload your file. Please make sure you adhere to specified size limit of files.<br> Please contact administrator for further issues.";
                    videoPortalLoader('show', msg);
                }

                if (window.console) {
                    window.console.log("Error while uploading your file.");
                }

                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 2000);
            }
        });
    }
    function parseURL(url) {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);
        var finalURL = ""
        if (req.status == 200) {
            var text = $(req.responseText).find('script').eq(0).text();
            var parsedURL = text.substring(text.indexOf("src:") + 4, text.length);
            var commaIndex = parsedURL.indexOf(',');
            var urlAfterRemovingComma = parsedURL.substring(0, commaIndex);
            var semiFinalURL = urlAfterRemovingComma.trim();
            finalURL = semiFinalURL.replace(/"/g, "");
            finalURL.trim();
        }
        if (finalURL.startsWith("http://") && finalURL.endsWith(".f4m")) {
            finalURL = fetchRTMPUrl(finalURL);
        }
        return finalURL;
    }
    function fetchRTMPUrl(url) {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
        var abc = new XMLSerializer().serializeToString(xmlDoc.documentElement);
        var parsedURL = abc.substring(abc.indexOf('<media bitrate="100"') + 26, abc.length);
        var commaIndex = parsedURL.indexOf('<media bitrate="256"');
        var urlAfterRemovingComma = parsedURL.substring(0, commaIndex - 4);
        var semiFinalURL = urlAfterRemovingComma.trim();
        var finalURL = semiFinalURL.replace(/"/g, "");
        finalURL.trim();
        return finalURL;
    }
});

//For breadcrumb
function breadcrumb(id, name, url, $rootScope) {
    var currentState = {
        id: id,
        name: name,
        url: url
    };

    for (i = 0; i < $rootScope.breadcrumb.length; i++) {
        if ($rootScope.breadcrumb[i].id == id) {
            $rootScope.breadcrumb.splice(i, $rootScope.breadcrumb.length);
            break;
        }
    }
    $rootScope.breadcrumb.push(currentState);
}

videoApp.controller('searchController', function ($scope, $rootScope, postService, coursePublishService, $location, $http, $routeParams) {
    $rootScope.showSearchHeader = true;
    window.scroll(0, 0);
    if ($routeParams.keyword) {
        $scope.searchString = $routeParams.keyword;
        $scope.searchKeyExists = true;
        //createBreadcrumb([2, 'Search( ' + $scope.searchString+')', $location.$$url, $rootScope]);
        createBreadcrumb([{ id: 1, name: 'Search', url: '/search/' }, { id: 2, name: $routeParams.keyword, url: $location.$$url}], $rootScope);
    }
    else {
        $scope.searchString = "";
        $scope.searchKeyExists = false;
        angular.element('#searchBox').val('');
        createBreadcrumb([{ id: 1, name: 'All Videos', url: $location.$$url}], $rootScope);
    }

    var videoFetchCount = 0;
    var colorCount = 8;
    var pageNumber = 0;
    $scope.appliedFilters = [];
    $scope.searchResults = [];
    // $scope.appliedFilters.push($scope.searchString);
    $scope.showLoading = false;
    var trackFilter = { "Name": "TrackFilter", Values: [], "Type": 0, "Operation": 0 };
    var categoryFilter = { "Name": "CategoryFilter", Values: [], "Type": 0, "Operation": 0 };
    var topicFilter = { "Name": "TopicFilter", Values: [], "Type": 0, "Operation": 0 };
    var typeFilter = { "Name": "VideoTypeFilter", Values: [], "Type": 0, "Operation": 0 };
    $scope.fetchVideos = function () {
        var request = {
            "Page": ++pageNumber,
            "Size": 9,
            "Filters": [],
            "Query": $scope.searchString
        };
        if (trackFilter.Values.length > 0) {
            request.Filters.push(trackFilter);
        }

        if (topicFilter.Values.length > 0) {
            request.Filters.push(topicFilter);
        }
        if (typeFilter.Values.length > 0) {
            request.Filters.push(typeFilter);
        }

        if (categoryFilter.Values.length > 0) {
             request.Filters.push(categoryFilter);
        }

        
        if (pageNumber == 1) {
            videoPortalLoader("show", "Fetching search results");
        }
        else {
            $scope.showLoading = true;
        }
        if (request.Filters.length > 0 || $routeParams.keyword) {
            $scope.searchKeyExists = true;
        }
        else {
            $scope.searchKeyExists = false;
        }
        $scope.appliedFilters = request.Filters;
        coursePublishService.search(request, {
            successCallback: function (data) {
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 500);
                $scope.showLoading = true;
                $scope.resultCount = data.TotalHits;
                if (data.Hits.length < 9) {

                    $scope.showLoading = false;
                }
                for (i = 0; i < data.Hits.length; i++) {
                    $scope.searchResults.push(data.Hits[i]);
                }
                if (request.Filters.length == 0) {
                    $scope.facets = data.Facets;
                    for (i = 0; i < $scope.facets.length; i++) {
                        $scope.facets[i].length = $scope.facets[i].Values.length;
                        for (j = 0; j < $scope.facets[i].Values.length; j++) {
                            $scope.facets[i].Values[j].isSelected = false;
                        }
                    }
                }

            },
            errorCallback: function (data, status) {

                var a = "f";

            }


        });
    }

    //

    $scope.search = function () {
        var searchString = $scope.searchString;
        $location.path("/search/" + searchString);
    }

    $scope.applyFilter = function (filterType, value) {
        $scope.filterApplied = true;

        if (filterType == "Tracks") {
            var filterExist = false;
            var filterLength = trackFilter.Values.length;
            if (trackFilter.Values.length == 0) {
                trackFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (trackFilter.Values[i] == value.Name) {
                        trackFilter.Values.splice(i, 1);
                        filterExist = true;
                    }

                }
            }


            if (!filterExist) {
                trackFilter.Values.push(value.Name);
                value.isSelected = true;


            }
        }


        if (filterType == "Type") {

            var filterExist = false;
            var filterLength = typeFilter.Values.length;
            if (typeFilter.Values.length == 0) {
                typeFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (typeFilter.Values[i] == value.Name) {
                        typeFilter.Values.splice(i, 1);
                        filterExist = true;
                    }

                }
            }


            if (!filterExist) {
                typeFilter.Values.push(value.Name);
                value.isSelected = true;


            }


        }


        if (filterType == "Topics") {

            var filterExist = false;
            var filterLength = topicFilter.Values.length;
            if (topicFilter.Values.length == 0) {
                topicFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
                // for showing applied filters




            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (topicFilter.Values[i] == value.Name) {
                        topicFilter.Values.splice(i, 1);
                        filterExist = true;
                    }

                }
            }


            if (!filterExist) {
                topicFilter.Values.push(value.Name);
                value.isSelected = true;


            }

        }

        if (filterType == "Categories") {

            var filterExist = false;
            var filterLength = categoryFilter.Values.length;
            if (categoryFilter.Values.length == 0) {
                categoryFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
                // for showing applied filters




            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (categoryFilter.Values[i] == value.Name) {
                        categoryFilter.Values.splice(i, 1);
                        filterExist = true;
                    }

                }
            }


            if (!filterExist) {
                categoryFilter.Values.push(value.Name);
                value.isSelected = true;


            }

        }
        pageNumber = 0
        $scope.searchResults = new Array();
        $scope.fetchVideos();
    } // For selecting checkbox

    $scope.removeFilter = function (filterType, value) {

        if (filterType.Name == "TopicFilter") {

            for (i = 0; i < topicFilter.Values.length; i++) {
                if (topicFilter.Values[i] == value) {
                    topicFilter.Values.splice(i, 1);
                    break;
                }

            }


            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Topics") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }

        }

        if (filterType.Name == "VideoTypeFilter") {
            for (i = 0; i < typeFilter.Values.length; i++) {
                if (typeFilter.Values[i] == value) {
                    typeFilter.Values.splice(i, 1);
                    break;
                }

            }


            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Type") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }
        }

        if (filterType.Name == "TrackFilter") {

            for (i = 0; i < trackFilter.Values.length; i++) {
                if (trackFilter.Values[i] == value) {
                    trackFilter.Values.splice(i, 1);
                    break;
                }

            }

            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Tracks") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }

        }




        if (filterType.Name == "CategoryFilter") {

            for (i = 0; i < categoryFilter.Values.length; i++) {
                if (categoryFilter.Values[i] == value) {
                    categoryFilter.Values.splice(i, 1);
                    break;
                }

            }

            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Categories") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }

        }

        pageNumber = 0
        $scope.searchResults = new Array();
        $scope.fetchVideos();
    } // For removing filters


    $scope.pushFilters = function (type, name) {
    }

    //



});

// Sabareesh

// For showing and hiding loader
function videoPortalLoader(display, msg) {

    var loader = $('#loaderOverlay');

    if (display == 'show') {
        if (loader.length)
            loader.find('p').html('<img src="/img/video/bb-loader1.gif" />' + msg);
        else
            $('body').append('<div id="loaderOverlay" class="add-loader-section-overlay"><p><img src="/img/video/bb-loader1.gif" />  ' + msg + '</p></div>');
    }
    else {
        if (loader.length) {
            loader.remove();
        }
    }
}

//To format time for calling webservices
function getTimeString(max, val) {
    var returnVal = "";
    if (parseInt(val) < max)
        returnVal = "0" + val.toString();
    else
        returnVal = val.toString();
    return returnVal;
}

//--prototypes of string "startsWith()" and "endsWith()"----------------------//
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return str.length > 0 && this.substring(0, str.length).toUpperCase() === str.toUpperCase();
    }
};

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return str.length > 0 && this.substring(this.length - str.length, this.length).toUpperCase() === str.toUpperCase();
    }
};
//--------------end of string prototypes---------------------------//

// For looging activities
function logActivity(logObject, logService) {
    var log = {
        EmpNo: logObject.EmpNo,
        TxtLogOnUser: logObject.TxtLogOnUser,
        DtDateTime: logObject.DtDateTime,
        ActivityName: logObject.ActivityName,
        AttributeValues: [
            {
                "Key": "Feature",
                "Values": [
                  logObject.recipients
                ]
            },
              {
                  "Key": "User Group",
                  "Values": [
                  logObject.recipients
                ]
              },
              {
                  "Key": "Content",
                  "Values": [
                  "Thread"
                ]
              },
              {
                  "Key": "KArea",
                  "Values": [
                  "VideoPortal"
                ]
              },
              {
                  "Key": "Asset ID",
                  "Values": [
                  logObject.assetid
                ]
              }

    ]
    };
    logService.logActivity(log, {
        successCallback: function (data) {
            var a = 5;
        },
        errorCallback: function (data, status) {
            var a = 5;
        }
    });

}
$(window).scroll(function () {
    if ($(this).scrollTop()) {
        $('#backToTopDiv:hidden').stop(true, true).fadeIn();
    } else {
        $('#backToTopDiv').stop(true, true).fadeOut();
    }
});

function getBackToTop() {
    $('body,html').animate({
        scrollTop: 0
    }, 'slow');
}


//-------------------------------------------New Design---------------//



videoApp.controller('videoPlayerController', function ($scope, $rootScope, $routeParams, $location, communityService, postService, commonServices, coursePublishService, mmsLoggerService) {
    $rootScope.showSearchHeader = false;
    window.scroll(0, 0);
    angular.element('#searchBox').val('');
    var courseIndex = $routeParams.courseIndex;
    var moduleIndex = $routeParams.moduleIndex;
    $scope.videoIndex = $routeParams.videoIndex;
    $scope.playListVideos = [];
    $scope.fullModulename = "";
    var timeStamp = new Date();
    var postCounts = 10;
    var pageNumber = 0;
    $scope.posts = [];
    $scope.tutors = [];
    $scope.videoDetails = { id: "", liked: false, likeCount: "" };
    $scope.showPlaylist = true;
    timeStamp = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1) + "-" + timeStamp.getDate() + "T" + timeStamp.getHours() + ":" + timeStamp.getMinutes() + ":" + timeStamp.getSeconds() + ".000";
    videoPortalLoader('show', 'Loading...');
    coursePublishService.fetchModules(courseIndex, {
        successCallback: function (data) {
            $scope.fullModuleName = data.Modules[moduleIndex].Title;
            trackId = data.Track.KonnectCommunitySId;
            $scope.trackLogoName = getTrackPetname(data.Track.Id);
            $scope.trackName = data.Track.Name;
            $scope.trackNId = data.Track.Id;
            videoUrl = data.Modules[moduleIndex].Videos[$scope.videoIndex].URL;
            $scope.description = data.Modules[moduleIndex].Videos[$scope.videoIndex].Description;
            $scope.title = data.Modules[moduleIndex].Videos[$scope.videoIndex].Title;
            $scope.playListVideos = data.Modules[moduleIndex].Videos;
            videoPortalLoader('hide', '');
            loadPlayer(videoUrl);
            konnectPostIdForVideo = data.Modules[moduleIndex].Videos[$scope.videoIndex].KonncectPostId;
            $scope.videoDetails.id = konnectPostIdForVideo;
            getVideoLikeCount(konnectPostIdForVideo);
            $rootScope.pageTitle = $scope.title;
            $scope.$on('LastRepeaterElement', function () {
                populatePlaylist();
            });

            for (j = 0; j < $rootScope.tracksTutorMapping.length; j++) {
                if ($rootScope.tracksTutorMapping[j].id == data.Track.Id) {
                    $scope.tutors.push($rootScope.tracksTutorMapping[j]);
                }
            }
            if ($scope.playListVideos.length > 1) {
                $scope.showPlaylist = true;
            }
            else {
                $scope.showPlaylist = false;
            }


            //----------for breadcrumb---------------------------------------------//
            var breadcrumbObj = new Array();
            breadcrumbObj = [{ id: 1, name: $scope.trackName, url: "/courses/" + $scope.trackNId + "/" },
                            { id: 2, name: data.Title, url: "/modules/" + $scope.trackNId + "/" + courseIndex + "/"}];

            createBreadcrumb(breadcrumbObj, $rootScope);
            //---------------End---------------------------------------------------//


            //----logging for view Video---------------------//
            var logObj = {
                EmpNo: $rootScope.personDetails.PersonSId,
                TxtLogOnUser: $rootScope.personDetails.MailId,
                DtDateTime: timeStamp,
                ActivityName: "View Content",
                assetid: konnectPostIdForVideo,
                recipients: trackId
            };
            logActivity(logObj, mmsLoggerService);
        },
        errorCallback: function (data, status) {
            var a = "f";
        }
    });
    function getVideoLikeCount(konnectPostId) {
        var kbPostIds = [konnectPostId];
        var request = {
            PostIds: kbPostIds
        };
        postService.getVoteupCount(request, {
            successCallback: function (data) {
                $scope.videoDetails.liked = data.d.PostMarkAsAnswers.PostQualityRatingCount[0].IsRatedByLoggedInUser;
                $scope.videoDetails.likeCount = data.d.PostMarkAsAnswers.PostQualityRatingCount[0].CountOfQualityRating;
            },
            errorCallback: function (data, status) {
                var a = "f";

            }
        });
    }
    function loadPlayer(videoUrl) {
        if (($rootScope.browserInfo.name.toLowerCase() == "ie" || $rootScope.browserInfo.name.toLowerCase() == "msie") && parseInt($rootScope.browserInfo.version) <= 9) {
            $("#videoPlayer").html('<object type="application/x-shockwave-flash" name="StrobeMediaPlayback" data="http://infytv/_controltemplates/InfyTv20/Player/StrobeMediaPlayback.swf" width="100%" height="100%" id="player" style="visibility: visible;">' +
                                            '<param name="allowFullScreen" value="true">' +
                                            '<param name="flashvars" value="id=1&amp;src=' + videoUrl + '&amp;autoPlay=true' + '">' +
                                            '</object>');
        }
        else {
            // Create a StrobeMediaPlayback configuration
            var parameters = {
                src: videoUrl,
                ads_preroll: 'rtmp://INDBLRPK2ITVEDG/vod/mp4:widgets/ETA/Digital_Tutor_Title/Digital_Tutor_Title',
                autoPlay: true,
                controlBarAutoHide: true,
                plugin_ads: "../StrobeMediaPlayback/AdvertisementPlugin.swf",
                enableStageVideo: false,
                javascriptCallbackFunction: "onJavaScriptBridgeCreated"
            };
            // Embed the player SWF:
            swfobject.embedSWF("../StrobeMediaPlayback/StrobeMediaPlayback.swf"
			    , "strobeMediaPlayback"
			    , '100%'
			    , '100%'
			    , "10.0.0"
			    , {}
			    , parameters
			    , { allowFullScreen: "true" }
			    , { name: "strobeMediaPlayback" });
        }
    }
    $scope.toggleLike = function (post, type) {
        if (type == "comment") {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.id.toString()
                }
            };
        }
        else if (type == "video") {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.id.toString()
                }
            };
        }
        else {
            var data = {
                QmsPrimaryEntity: {
                    instance: post.meta.id.toString()
                }
            };
        }
        if (!post.liked) {
            postService.like(data, {
                successCallback: function (data) {
                    if (data.d.OperationResponse.status == 0) {
                        if (type == 'video') {
                            $scope.videoDetails.likeCount = $scope.videoDetails.likeCount + 1;
                            $scope.videoDetails.liked = true;
                            // Logging for video like by - Sabareesh--------------------//
                            var logObj = {
                                EmpNo: $rootScope.personDetails.PersonSId,
                                TxtLogOnUser: $rootScope.personDetails.MailId,
                                DtDateTime: timeStamp,
                                ActivityName: "Like",
                                assetid: konnectPostIdForVideo,
                                recipients: trackId
                            };
                            logActivity(logObj, mmsLoggerService);
                        }
                        else {
                            post.likeCount = post.likeCount + 1;
                            post.liked = true;
                        }

                    }
                },
                errorCallback: function (data, status) {
                    var abc = 10;
                }
            });

        }
        else {
            postService.unlike(data, {
                successCallback: function (data) {
                    if (data.d.OperationResponse.status == 0) {
                        if (type == 'video') {
                            $scope.videoDetails.likeCount = $scope.videoDetails.likeCount - 1;
                            $scope.videoDetails.liked = false;
                        }
                        else {
                            post.likeCount = post.likeCount - 1;
                            post.liked = false;
                        }
                    }
                },
                errorCallback: function (data, status) {
                    var abc = 10;
                }
            });
        }
    }
    $scope.fetchPosts = function () {
        $scope.showLoading = true;
        pageNumber++;
        if (postCounts == 10) {
            var fetchRequest = {
                actorSId: $rootScope.personDetails.PersonSId,
                filters: [],
                pageSize: 10,
                pageNumber: pageNumber,
                store: 'PublicTimeline'
            };
            fetchRequest.filters.push({
                name: 'PostLastUpdatedFilter',
                values: [timeStamp],
                type: 'INCLUDE',
                op: 'OR'
            });

            fetchRequest.filters.push({
                name: 'PostSubjectIdFilter',
                values: [konnectPostIdForVideo],
                type: 'INCLUDE',
                op: 'OR'
            });

            fetchRequest.filters.push({
                name: 'PostKindFilter',
                values: ['Query'],
                type: 'INCLUDE',
                op: 'OR'
            });
            fetchRequest.filters.push({
                name: 'PostHiddenFilter',
                values: ['true'],
                type: 'INCLUDE',
                op: 'OR'
            });

            postService.fetchPosts(fetchRequest, {
                successCallback: function (data) {
                    postCounts = data.d.result.hits.length;
                    if (data.d.operationResponse.status == 0) {
                        $scope.showLoading = false;
                        if ($scope.posts.length == 0 && data.d.result.hits.length == 0) {
                            $scope.postCount = 0;
                        }
                        $scope.fetchedPosts = data.d.result.hits;
                        for (i = 0; i < $scope.fetchedPosts.length; i++) {
                            $scope.fetchedPosts[i].postTime = commonServices.formatTimeAgo($scope.fetchedPosts[i].meta.postdate);
                            $scope.fetchedPosts[i].liked = $scope.fetchedPosts[i].meta.isvotedup;
                            $scope.fetchedPosts[i].likeCount = $scope.fetchedPosts[i].meta.voteupcount;
                            $scope.fetchedPosts[i].meta.comments = new Array();
                            $scope.fetchedPosts[i].meta.commentcount = 0;
                            $scope.fetchedPosts[i].hasRepliesLoaded = false;
                            $scope.posts.push($scope.fetchedPosts[i]);
                        }
                    }
                    else {
                    }
                },
                errorCallback: function (data, status) {

                    var a = "f";
                }
            });
        }

        else {
            $scope.showLoading = false;
        }
    }
    $scope.fetchComments = function (post, index) {
        try {
            if (!post.hasRepliesLoaded) {
                pageSizeForComment = 10;
            }
            else {
                if (post.meta.commentcount - post.meta.comments.length >= 10) {
                    pageSizeForComment = 10;
                }
                else {
                    //pageSizeForComment = post.meta.commentcount - post.meta.comments.length + 1;
                    pageSizeForComment = 10;
                }
            }
            var request = new Object();
            request = {
                actorsid: $rootScope.personDetails.PersonSId,
                filters: [
                {
                    name: "PostConversationIndex",
                    values: [post.meta.id],
                    type: "INCLUDE",
                    op: "OR"
                }],
                rankfields: [],
                properties: [],
                pageSize: pageSizeForComment,
                pageNumber: Math.ceil((post.meta.comments.length) / 10) + 1,
                store: "Conversation"
            }
            postService.fetchPosts(request, {
                successCallback: function (data) {
                    if (data.d.operationResponse.status == 0) {
                        var i = 0;
                        if (!$scope.posts[index].hasRepliesLoaded && data.d.result.hits.length > 0)
                            $scope.posts[index].meta.commentcount = data.d.result.hits[0].meta.commentcount;

                        $scope.posts[index].hasRepliesLoaded = true;
                        if (data.d.result.hits.length > 0) {
                            var comments = (data.d.result.hits[0].meta.comments == null) ? (new Array()) : data.d.result.hits[0].meta.comments;
                            // Pushing comments 
                            for (i = 0; i < comments.length; i++) {
                                comments[i].timeUpdated = commonServices.formatTimeAgo(comments[i].date);
                                $scope.posts[index].meta.comments.push(comments[i]);
                            }
                        }
                        //$scope.$apply();
                    }
                    else {
                        alert("Status : " + data.d.operationResponse.status);
                        pageNumber--;
                    }
                },
                errorCallback: function (data) {
                    $scope.moreCommentsClicked = false;
                    angular.element(".loaderDiv").scope().acticvateLoader = false;
                }
            });
        }
        catch (e) {
        }
    }

    // For posting question
    $scope.addKonnectPost = function (postData, postTitle) {
        videoPortalLoader('show', 'Posting your question...');
        var postRecpArray = [];
        var recpAction = "Operate";
        var recipient1 = {
            RecipientSId: trackId,
            RecipientEntityType: "Community"
        }
        postRecpArray.push(recipient1);
        var tagsArray = [];
        //        tagsArray.push(tags);
        var tagAction = "DonotOpearte";
        var postAttr = [{
            Attribute: "PostSource",
            Value: "VideoPortal",
            Sequence: 1
        }];
        var postAttachmentArray = [];
        var attachmentAction = "DonotOpearte";
        var requestObj = {
            PostKind: 'Query',
            ParentPostId: $scope.playListVideos[$scope.videoIndex].KonncectPostId,
            PostStatus: 'OpenQuery',
            PostRecipients: postRecpArray,
            PostRecipientsAction: recpAction,
            PostTags: tagsArray,
            PostTagsAction: tagAction,
            PostAssetAttachments: postAttachmentArray,
            PostAssetAttachmentsAction: attachmentAction,
            PostContent: { PostTitle: postTitle, PostAbstract: "", PostData: postData },
            PostContentAction: 'Operate',
            PostAttributes: postAttr,
            PostAttributesAction: 'Operate'
        };
        postService.addPost(requestObj, {
            successCallback: function (data) {
                videoPortalLoader('hide', '');
                //  pageNumber = 0;
                //  $scope.posts.length = 0;
                $scope.hidePostButtonMethod();
                //pushing post data
                var postStruct = {
                    id: data.d.PostId,
                    vis: 'Public',
                    actornid: $rootScope.personDetails.PersonNId,
                    actorsid: $rootScope.personDetails.PersonSId,
                    actorname: $rootScope.personDetails.FirstName,
                    title: postTitle,
                    summary: "",
                    data: postData,
                    postkind: 'Query',
                    postdate: new Date(),
                    lcdate: null,
                    ludate: new Date(),
                    lcedate: null,
                    lrdate: new Date(),
                    pubdate: new Date(),
                    commentcount: 0,
                    repostcount: 0,
                    source: "",
                    status: 'OpenQuery',
                    hidden: false,
                    recps: postRecpArray,
                    tags: tagsArray,
                    attachments: null,
                    reviewer: null,
                    polloptions: null,
                    contribs: null,
                    repostors: null,
                    comments: null,
                    atts: null,
                    voteupcount: 0
                }
                var completePostStruct = {
                    "meta": postStruct,
                    "postTime": 'Just Now',
                    "rankField": null,
                    "sequenceNumber": '1',
                    "likeCount": 0,
                    'liked': false
                }
                //ends here
                $scope.posts.unshift(completePostStruct);
                //  $scope.fetchPosts11();
            },
            errorCallback: function (data, status) {
                videoPortalLoader('show', 'Some error occurred while posting your question');
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 2000);
            }
        });
    }
    // For posting question -- this method calls addKonnectPost method

    //---Add answer to a posted question--------------/

    $scope.postComment = function (post, commentTxt, index) {
        if (commentTxt) {
            var postAttachmentArr = [];
            var attachmentAction = "DonotOpearte"
            var attachmentStruct = [];
            var commentPostKind = "QueryReply";
            var postAttributesArr = [];
            var postAttributesAction = "DonotOpearte";
            commentTxt = commonServices.escapeHTML(commentTxt);
            var request = {
                ParentPostId: post.meta.id,
                PostKind: commentPostKind, //QueryReply
                PostStatus: 'ActivePost', //OpenQuery
                PostContent: {
                    PostData: commentTxt
                },
                PostContentAction: 'Operate',
                PostAssetAttachments: postAttachmentArr,
                PostAssetAttachmentsAction: attachmentAction,
                PostAttributes: postAttributesArr,
                PostAttributesAction: postAttributesAction
            }
            postService.addPost(request, {
                successCallback: function (data) {
                    if (data.d.OperationResponse.status == 0) {
                        var commentStruct = {
                            id: data.d.PostId,
                            actornid: $scope.personDetails.PersonNId,
                            actorsid: $scope.personDetails.PersonSId,
                            actorname: $scope.personDetails.FirstName,
                            title: "",
                            summary: "",
                            data: request.PostContent.PostData,
                            date: new Date(),
                            ledate: null,
                            postkind: request.PostKind,
                            commentcount: 0,
                            source: "",
                            commentPic: $scope.personDetails.CommentPhotoUri,
                            timeUpdated: commonServices.formatTimeAgo(new Date()),
                            liked: false,
                            likeCount: 0,
                            status: request.PostStatus,
                            attachments: attachmentStruct,
                            voteupcount: 0,
                            VotedUp: false
                        }
                        if (post.meta.comments == null) {
                            $scope.posts[index].meta.comments = [];
                            $scope.posts[index].meta.commentcount = 0 + 1;
                        }
                        $scope.posts[index].meta.comments.push(commentStruct);
                        $scope.posts[index].meta.commentcount = post.meta.commentcount + 1;
                        $scope.$apply();
                        $scope.$broadcast('commentSuccess', {})
                    }
                    else {
                        alert('Error in post Success');
                    }

                },
                errorCallback: function (data) {
                    // angular.element(".loaderDiv").scope().acticvateLoader = true;
                    commonServices.displayConfirmation("There was some error while posting. Please try after some time. If issue persisits, please contact <a href='mailto:konnect@infosys.com'>konnect@infosys.com</a>");
                }
            });
        }
        else {
            commonServices.displayConfirmation("Please provide text for the comment");


        }
    }

    //---------------------End-----------------------/
    $scope.sendPost = function () {
        var postData = $("#postForVideo").val();
        var postSubject = $("#subjectForVideo").val();
        $scope.addKonnectPost(postData, postSubject);
    }
    $scope.changeVideoFromPlaylist = function (index) {
        $location.path("/video/" + courseIndex + "/" + moduleIndex + "/" + index);
    }
    //----code for simple playlist scroll--//
    function populatePlaylist() {
        $('#my-list').hoverscroll({
            fixedArrows: false,
            rtl: false,
            width: '100%',
            height: '100%'
        });
        //$('#my-list').width($scope.playListVideos.length * 298)
        $("#my-list")[0].scrollToPlayItem($scope.videoIndex);

    }
    //---------------End--------------------//
    //Initilization of JQ editor
    $('#postForVideo').jqte({ placeholder: "Your Question goes here.....", source: false });
    //

    $scope.askQuestion = function () {
        $('html, body').animate({
            scrollTop: 500
        }, 1000);
        $('#subjectForVideo').focus();
        if ($scope.showPostButton)
            $scope.showPostButton = true;
        else
            $scope.showPostButton = false;
    }
    $scope.showPostButtonMethod = function () {
        $("#sliderRTE").slideDown("slow");
    }
    $scope.hidePostButtonMethod = function () {
        $('#postForVideo').jqteVal("");
        $('#postForVideo').val('');
        $('#titleForVideo').val('');
        $("#sliderRTE").slideUp("slow");
    }
});


function getTrackPetname(trackname) {
    switch (trackname) {
        case 1:
            return "MS";
            break;
        case 2:
            return "Mob";
            break;
        case 3:
            return "IVS";
            break;
        case 4:
            return "Java";
            break;
        case 5:
            return "DA";
            break;
        case 6:
            return "BI";
            break;
        case 7:
            return "AGL";
            break;
        case 8:
            return "ORC";
            break;
        case 9:
            return "CIS";
            break;
        case 10:
            return "EXP";
            break;
        case 11:
            return "MF";
            break;
        case 12:
            return "MSC";
            break;
        case 13:
            return "CC";
            break;
        case 14:
            return "DB";
            break;
        case 15:
            return "OSS";
            break;
        case 16:
            return "BDA";
            break;

    }
}

function createBreadcrumb(breadcrumbObj, $rootScope) {
    $rootScope.breadcrumb.splice(1, $rootScope.breadcrumb.length);
    for (i = 0; i < breadcrumbObj.length; i++) {
        $rootScope.breadcrumb.push(breadcrumbObj[i]);
    }
}

//-----------------------------------------------------------------------------

videoApp.controller('allExpertVideoController', function ($scope, $rootScope, postService, coursePublishService, $location, $http, $routeParams) {
    $rootScope.showSearchHeader = true;
    window.scroll(0, 0);
    if ($routeParams.keyword) {
        $scope.searchString = $routeParams.keyword;
        $scope.searchKeyExists = true;
        //createBreadcrumb([2, 'Search( ' + $scope.searchString+')', $location.$$url, $rootScope]);
        createBreadcrumb([{ id: 1, name: 'Search', url: '/search/' }, { id: 2, name: $routeParams.keyword, url: $location.$$url}], $rootScope);
    }
    else {
        $scope.searchString = "";
        $scope.searchKeyExists = false;
        angular.element('#searchBox').val('');
        createBreadcrumb([{ id: 1, name: 'All Videos', url: $location.$$url}], $rootScope);
    }
    var videoFetchCount = 0;
    var colorCount = 8;
    var pageNumber = 0;
    $scope.appliedFilters = [];
    $scope.searchResults = [];
    // $scope.appliedFilters.push($scope.searchString);
    $scope.showLoading = false;
    var trackFilter = { "Name": "TrackFilter", Values: [], "Type": 0, "Operation": 0 };
    var keywordFilter = { "Name": "KeywordFilter", Values: [], "Type": 0, "Operation": 0 };
    var topicFilter = { "Name": "TopicFilter", Values: [], "Type": 0, "Operation": 0 };
    var typeFilter = { "Name": "VideoTypeFilter", Values: ["Expert Talks"], "Type": 0, "Operation": 0 };
    $scope.fetchVideos = function () {
        var request = {
            "Page": ++pageNumber,
            "Size": 9,
            "Filters": [],
            "Query": $scope.searchString
        };
        if (trackFilter.Values.length > 0) {
            request.Filters.push(trackFilter);
        }
        //        if (keywordFilter.Values.length > 0) {
        //            request.Filters.push(keywordFilter);
        //        }

        if (topicFilter.Values.length > 0) {
            request.Filters.push(topicFilter);
        }
        if (typeFilter.Values.length > 0) {
            request.Filters.push(typeFilter);
        }
        if (pageNumber == 1) {
            videoPortalLoader("show", "Fetching search results");
        }
        else {
            $scope.showLoading = true;
        }
        if (request.Filters.length > 0 || $routeParams.keyword) {
            $scope.searchKeyExists = true;
        }
        else {
            $scope.searchKeyExists = false;
        }
        $scope.appliedFilters.length = 0; // remove previous filters before adding

        for (i = 0; i < request.Filters.length; i++) {
            if (request.Filters[i].Name != 'VideoTypeFilter')
                $scope.appliedFilters.push(request.Filters[i]);
        }
        coursePublishService.search(request, {
            successCallback: function (data) {
                setTimeout(function () {
                    videoPortalLoader('hide', "");
                }, 500);
                $scope.showLoading = true;
                $scope.resultCount = data.TotalHits;
                if (data.Hits.length < 9) {

                    $scope.showLoading = false;
                }
                for (i = 0; i < data.Hits.length; i++) {
                    $scope.searchResults.push(data.Hits[i]);
                }
                if (request.Filters.length == 1) {
                    $scope.facets = data.Facets;
                    for (i = 0; i < $scope.facets.length; i++) {
                        $scope.facets[i].length = $scope.facets[i].Values.length;
                        for (j = 0; j < $scope.facets[i].Values.length; j++) {
                            $scope.facets[i].Values[j].isSelected = false;
                        }
                        if ($scope.facets[i].Name == "Type") {
                            $scope.facets.splice(i, 1);
                        }
                    }
                }

            },
            errorCallback: function (data, status) {

                var a = "f";

            }


        });
    }
    //
    $scope.search = function () {
        var searchString = $scope.searchString;
        $location.path("/search/" + searchString);
    }
    $scope.applyFilter = function (filterType, value) {
        $scope.filterApplied = true;
        if (filterType == "Tracks") {
            var filterExist = false;
            var filterLength = trackFilter.Values.length;
            if (trackFilter.Values.length == 0) {
                trackFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (trackFilter.Values[i] == value.Name) {
                        trackFilter.Values.splice(i, 1);
                        filterExist = true;
                    }
                }
            }
            if (!filterExist) {
                trackFilter.Values.push(value.Name);
                value.isSelected = true;
            }
        }
        if (filterType == "Type") {
            var filterExist = false;
            var filterLength = typeFilter.Values.length;
            if (typeFilter.Values.length == 0) {
                typeFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (typeFilter.Values[i] == value.Name) {
                        typeFilter.Values.splice(i, 1);
                        filterExist = true;
                    }
                }
            }
            if (!filterExist) {
                typeFilter.Values.push(value.Name);
                value.isSelected = true;
            }
        }
        if (filterType == "Topics") {
            var filterExist = false;
            var filterLength = topicFilter.Values.length;
            if (topicFilter.Values.length == 0) {
                topicFilter.Values.push(value.Name);
                value.isSelected = true;
                filterExist = true;
                // for showing applied filters
            }
            else {
                for (i = 0; i < filterLength; i++) {
                    if (topicFilter.Values[i] == value.Name) {
                        topicFilter.Values.splice(i, 1);
                        filterExist = true;
                    }

                }
            }


            if (!filterExist) {
                topicFilter.Values.push(value.Name);
                value.isSelected = true;


            }

        }
        pageNumber = 0
        $scope.searchResults = new Array();
        $scope.fetchVideos();
    } // For selecting checkbox

    $scope.removeFilter = function (filterType, value) {

        if (filterType.Name == "TopicFilter") {

            for (i = 0; i < topicFilter.Values.length; i++) {
                if (topicFilter.Values[i] == value) {
                    topicFilter.Values.splice(i, 1);
                    break;
                }

            }


            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Topics") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }

        }

        if (filterType.Name == "VideoTypeFilter") {
            for (i = 0; i < typeFilter.Values.length; i++) {
                if (typeFilter.Values[i] == value) {
                    typeFilter.Values.splice(i, 1);
                    break;
                }

            }


            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Type") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }
        }

        if (filterType.Name == "TrackFilter") {

            for (i = 0; i < trackFilter.Values.length; i++) {
                if (trackFilter.Values[i] == value) {
                    trackFilter.Values.splice(i, 1);
                    break;
                }

            }

            for (i = 0; i < $scope.facets.length; i++) {

                if ($scope.facets[i].Name == "Tracks") {
                    for (j = 0; j < $scope.facets[i].Values.length; j++) {

                        if ($scope.facets[i].Values[j].Name == value) {
                            $scope.facets[i].Values[j].isSelected = false;

                        }
                    }

                }

            }

        }

        pageNumber = 0
        $scope.searchResults = new Array();
        $scope.fetchVideos();
    } // For removing filters


    $scope.pushFilters = function (type, name) {
    }

    //



});
