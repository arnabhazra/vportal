//Authentication Service -- Starts here
videoApp.factory('securityService', function ($http, $rootScope, $q) {
    return {

        getUserInfo: function (callback) {
            var deferred = $q.defer();
            var url = $rootScope.hostName + '/SMS/Authenticate/AuthenticateWS.asmx/KonnectAuthentication';
            $http({ method: 'POST', url: url, data: {} }).success(callback.successCallback).error(callback.errorCallback);
            return deferred.promise;
        }
//        myNinjaSrvice: function (callback) {

//            $http({ method: 'POST', url: 'https://myninja.infosysapps.com/TraineeAppWrapper/Wrapper/TraineeForum/TraineeForum.asmx/GetMemberPerson', data: JSON.stringify({ imei: "358094052811917", empId: "159235" }) }).success(callback.successCallback).error(callback.errorCallback);
//         
//                  
//        
//        
//        
//         }



    }



}

);

    // Ends Here


//Post Service -- Starts here
videoApp.factory('postService', function ($http, $rootScope) {
    return {

        addPost: function (data, callback) {


            var request = {
                postRequest: {
                    ActorSId: $rootScope.personDetails.PersonSId,
                    ParentPostId: null,
                    PostKind: null,
                    PostStatus: null,
                    Action: 'Operate',
                    PostRecipients: [],
                    PostRecipientsAction: 'DonotOpearte',
                    PostAttributes: [],
                    PostAttributesAction: 'DonotOpearte',
                    PostTags: [],
                    PostTagsAction: 'DonotOpearte',
                    PostAssetAttachments: [],                     //{AssetId}
                    PostAssetAttachmentsAction: 'DonotOpearte',
                    PostContent: [],                              // { PostTitle, PostAbstract,PostData},
                    PostContentAction: 'DonotOpearte'
                }
            };

            var url = $rootScope.altoHostName + '/Post/PostWS.asmx/AddKonnectPost';
            // var url = "http://kmserver28:7234/Alto/CPM/PostNew/AltoPostWS.asmx/AddKonnectPost";
            angular.extend(request.postRequest, data);
            var d = JSON.stringify(request);
            $http({ method: 'POST', url: url, data:d }).success(callback.successCallback).error(callback.errorCallback);

        },

        fetchPosts: function (data, callback, syn) {
            var request = {
                request: {
                    actorSId: $rootScope.personDetails.PersonSId,
                    filters: [],
                    pageSize: 10,
                    pageNumber: 1,
                    store: 'PublicTimeline'
                }
            };
            angular.extend(request.request, data);
            var url = $rootScope.altoHostName + '/Post/PostFetchWS.asmx/FetchPosts';

            if (syn && syn == true) { // For making a Sync Call.
                webServiceCall.jsonCall({
                    url: url,
                    data: JSON.stringify(request),
                    dataType: "json",
                    successCallback: callback.successCallback,
                    errorCallback: callback.errorCallback,
                    asyn: false
                });
            }
            else {
                $http({ method: 'POST', url: url, data: JSON.stringify(request) }).success(callback.successCallback).error(callback.errorCallback);
            }
        },

        like: function (data, callback) {
            var request = {
                entityAttributeStructs: [{
                    QmsPrimaryEntity: { instance: null }, //postId
                    QmsSecondaryEntity: { instance: -1 },
                    QmsAttribute: { InstanceEntityType: "Attribute",
                        InstanceValues: ["nMarkAsAnswer", "Post"]
                    },
                    AttributeSeq: 0,
                    QmsMember: { instance: $rootScope.personDetails.MemberId },
                    MemberSeq: 1,
                    IsSecondaryEntityIdValid: false,
                    DateRated: new Date(),
                    DateRatingModified: new Date(),
                    IsPublic: true,
                    Action: "Operate"
                }]
            };

            angular.extend(request.entityAttributeStructs[0], data);
            var d = JSON.stringify(request);
            var url = $rootScope.hostName + '/CAD/QMS/CADQualityEntityAttributeWS.asmx/AddEntityAttributes';
            $http({ method: 'POST', url: url, data: JSON.stringify(request) }).success(callback.successCallback).error(callback.errorCallback);
        },

        unlike: function (data, callback) {
            var request = {
                entityAttributeStructs: [{
                    QmsPrimaryEntity: {
                        instance: "" //Post Id
                    },
                    QmsSecondaryEntity: { instance: -1 },
                    QmsAttribute: {
                        InstanceEntityType: "Attribute",
                        InstanceValues: ["nMarkAsAnswer", "Post"]
                    },
                    AttributeSeq: 0,
                    QmsMember: { instance: $rootScope.personDetails.MemberId },
                    MemberSeq: 1,
                    IsSecondaryEntityIdValid: false,
                    IsPublic: true,
                    Action: "Operate"
                }]
            };
            angular.extend(request.entityAttributeStructs[0], data);
            var d = JSON.stringify(request);
            var url = $rootScope.hostName + '/CAD/QMS/CADQualityEntityAttributeWS.asmx/DeleteEntityAttributes';
            $http({ method: 'POST', url: url, data: JSON.stringify(request) }).success(callback.successCallback).error(callback.errorCallback);
        },

        getVoteupCount: function (data, callback) {
            var request = {
                postQualityRatingCountRequest: {
                    PostIds: [],
                    QmsAttributes: [{
                        InstanceEntityType: "Attribute",
                        InstanceValues: ["nMarkAsAnswer", "Post"]
                    }
                                 ],
                    MemberId: $rootScope.personDetails.MemberId
                }
            };
            angular.extend(request.postQualityRatingCountRequest, data);
            var url = $rootScope.altoHostName + '/Rating/RatingWS.asmx/GetPostQualityRatingCount';
            $http({ method: 'POST', url: url, data: JSON.stringify(request) }).success(callback.successCallback).error(callback.errorCallback);
        }


    };


}
);


    //Ends Here


//Cummunity Service -- Starts Here
videoApp.factory('communityService', function ($http, $rootScope) {
    return {

        getCommunity: function (data, callback) { //Community
            var d = JSON.stringify(data);
            var url = $rootScope.hostName + '/DMS/Community/CommunitiesFetchWS.asmx/FetchCommunities';
            $http({ method: 'POST', url: url, data: d }).success(callback.successCallback).error(callback.errorCallback);


        },
        addCommunity: function (d, callback) {

            var request = {
                altoCommunityRequest: {
                    CommunitySId: null,
                    CommunityName: null,
                    Description: null,
                    CommunityStatus: 'Active',
                    PhotoURL: null,
                    CommunityType: null,
                    InitiatorSId: $rootScope.personDetails.PersonSId,
                    CreationDate: null,
                    securityInfo: { "AccessRestriction": false,
                        "LockOwner": $rootScope.personDetails.PersonSId,
                        "Actor": $rootScope.personDetails.PersonNId.toString()
                    },
                    Action: 'Operate'
                }
            };
            angular.extend(request.altoCommunityRequest, d);
            var url = $rootScope.altoHostName + '/CAD/DMS/Community_New/CommunityWS_New.asmx/AddKonnectCommunity';


            var data1 = JSON.stringify(request);
            $http({ method: 'POST', url: url, data: data1 }).success(callback.successCallback).error(callback.errorCallback);
        },
        getCommunityDetails: function (data,callback) {

                var d = JSON.stringify(data);
                var url = $rootScope.hostName + '/CAD/DMS/Community/CADCommunityWS.asmx/getCommunity';
                $http({ method: 'POST', url: url, data: d }).success(callback.successCallback).error(callback.errorCallback);



        }

    };
}

);

//Ends Here

//--------------------------Video publish service starts here------------------------//
videoApp.factory('coursePublishService', function ($http, $rootScope,$q) {
    return {
        addCourse: function (data, callback) {
            var d = JSON.stringify(data);
            var url = $rootScope.videoServicePath + 'course/_add';
            $http({ method: 'PUT', url: url, data: d, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);
        },

        fetchVideo: function (community, callback) {
            // var d = JSON.stringify(data);
            var url = $rootScope.videoServicePath +'video/_fetch/' + community;
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);
        },

        fetchVideos: function (community, callback) {
            // var d = JSON.stringify(data);
            var url = $rootScope.videoServicePath+'module/_fetch/' + community;
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);
        },


        fetchCourses: function (track, callback) {
            var d = JSON.stringify(track);
            var url = $rootScope.videoServicePath+'course/_fetch';
            $http({ method: 'POST', url: url, data: d, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);
          
        },
        fetchTracks: function (callback) {

            var url = $rootScope.videoServicePath +'track/_fetch'; // url to get all track related info 
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

        },
        fetchModules: function (course, callback) {
            //var d = JSON.stringify(track);
            var url = $rootScope.videoServicePath +'course/_fetch/' + course;
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

        },

        search: function (request, callback) {
            var d = JSON.stringify(request);
            var url = $rootScope.videoServicePath + 'search/_search';        
            $http({ method: 'POST', url: url, data:d, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

        },
          fetchPopularVideos: function (size,callback) { 
            //var d = JSON.stringify(track);
            var url = $rootScope.videoServicePath +'video/_fetchpopularvideos/'+size;
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

        },
        fetchExpertVideos: function (size, callback) {
            //var d = JSON.stringify(track);
            var url = $rootScope.videoServicePath + 'video/_fetchpopularvideos/' + size;
            $http({ method: 'GET', url: url, data: {}, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

        }

    }
});


videoApp.factory('mmsLoggerService', function ($http, $rootScope) {
    return {
        logActivity: function (loggerData, callback) {
            try {
                /*Initialize*/
                var featureIndex = 0;
                var usergroupIndex = 0;
                var request = {
                    EmpNo: 999999,
                    TxtLogOnUser: "",
                    DtDateTime: "",
                    ActivityName: "",
                    AttributeValues: [

                                { Key: "Feature",
                                    Values: ["KB(Public)"]
                                }
                            ,
                                {
                                    Key: "User Group",
                                    Values: ["Public"]
                                }
                                ,
                                {
                                    Key: "Content",
                                    Values: ["Thread"]
                                }
                                ,
                                {

                                    Key: "KArea",
                                    Values: []
                                }
                                ,
                                {

                                    Key: "Asset ID",
                                    Values: []
                                }

                           ]

                };
                angular.extend(request, loggerData);
                var url = $rootScope.videoServicePath + 'logger/_log';
                var jsonReq = JSON.stringify(request);
                $http({ method: 'POST', url: url, data: jsonReq, contentType: 'application/json; charset=utf-8', dataType: "json", headers: { 'X-Konnect-Person-Id': $rootScope.personDetails.PersonNId} }).success(callback.successCallback).error(callback.errorCallback);

            } catch (e) {
                console.log.error(e);
            }
        }
    }
});




