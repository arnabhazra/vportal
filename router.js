

videoApp.config(function ($routeProvider) {
    $routeProvider

    // route for the home page
            .when('/', {
                templateUrl: 'pages/home.htm',
                controller: 'homeController',
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })
            .when('/courses/:id', {
                templateUrl: 'pages/videos.htm',
                controller: 'videosController',
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })
    // route for the about page
            .when('/publish', {
                templateUrl: 'pages/publish.htm',
                controller: 'publishController',
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })


            .when('/video/:courseIndex/:moduleIndex/:videoIndex', {
                title:'Digital Tutor',
                templateUrl: 'pages/VideoPlayer.htm',   
                controller: 'videoPlayerController',   
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })

            .when('/createCourse', {
                templateUrl: 'pages/publishCourse.htm',
                controller: 'createCourseNewCtrl',
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })
            .when('/modules/:track/:courseIndex', {
                templateUrl: 'pages/learningPath.htm',
                controller: 'showModulesController',
                resolve: {
                    appInitialize: videoAppCtrl.initializeAppData
                }

            })
             .when('/search/:keyword', {
                 templateUrl: 'pages/search.htm',
                 controller: 'searchController',
                 resolve: {
                     appInitialize: videoAppCtrl.initializeAppData
                 }

             })
             .when('/search/', {
                 templateUrl: 'pages/search.htm',
                 controller: 'searchController',
                 resolve: {
                     appInitialize: videoAppCtrl.initializeAppData
                 }
             })
             .when('/expertVideos/', {
                 templateUrl: 'pages/AllExpertVideos.htm',
                 controller: 'allExpertVideoController',
                 resolve: {
                     appInitialize: videoAppCtrl.initializeAppData
                 }

             })
            .otherwise({
            redirectTo:'/'

            }
            )


            ;

});