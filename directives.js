(function () {

    var commonDirectives = {};
    commonDirectives.infiniteScroll = function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {
                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    };
    commonDirectives.renderNewLine = function () {
        return {
            restrict: 'A',
            /*scope: {
            data: "=",
            },*/
            link: function (scope, element, attr) {
                // By default we will trim the value
                // If the attribute ng-trim exists we will avoid trimming
                // e.g. <input ng-model="foo" ng-trim="false">
                /*if (toBoolean(attr.ngTrim || 'T')) {
                value = trim(value);
                }*/
                return attr.renderNewLine.replace(/\n/g, '<br/>');
            }
        }
    }

    commonDirectives.watermark = function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var value;
                var watermark = function () {
                    element.css('color', 'Gray');
                    element.val(attr.watermark)

                };
                var unwatermark = function () {
                    element.css('color', 'Black');
                    element.val('');
                };

                //                scope.$watch(attr.ngModel, function (val) {
                //                    value = val || '';
                //                });

                element.bind('focus', function () {
                    value = element.val();

                    if (value == '' || value == attr.watermark)
                        unwatermark();
                });

                element.bind('blur', function () {
                    if (element.val() == '') watermark();
                });

                ctrl.$formatters.unshift(function (val) {
                    if (!val) {
                        watermark();
                        value = '';
                        return attr.watermark;
                    }
                    return val;
                });
            }
        };
    };
    commonDirectives.posttextbox = function ($compile, $rootScope) {
        return {
            scope: {
                commentText: "=ngModel",
                showAttachment: "="
            },
            link: function (scope, element, attr) {
                var template;
                var templateAdded = false;

                scope.cancelEdit = function () {
                    element[0].style.cssText = "height:auto;";
                    if (attr.watermark)
                        element[0].innerText = attr.watermark;
                    else
                        element[0].innerText = "";
                    template.remove();
                    templateAdded = false;
                    scope.showAttachment = false;
                    scope.$apply();
                };
                scope.$on('commentSuccess', function (scopeDetails, msgFromParent) {
                    scope.commentText = "";
                    scope.cancelEdit();
                })
                element.bind('focus', function (event) {
                    /*if (attr.ngTrim) {
                    value = trim(value);
                    }*/

                    if (!templateAdded) {
                        scope.showAttachment = true;

                        template = $compile('<div style="width:40%;margin:auto"><input type="button" class="btn btn-primary pull-right" value="Cancel" ng-click="cancelEdit()"/>' +
                    '<input type="button" class="btn btn-primary pull-right right-margin" style="margin-right:5px;" value="Post"ng-disabled ng-click="$parent.postComment($parent.post,commentText,$parent.$index)"/></div>')(scope);

                        element.parent().after(template);
                        templateAdded = true;
                    }
                    //event.stopImmediatePropagation();
                    this.style.cssText = "height:50px;";
                    scope.$apply();


                });
                //            element.bind('blur', function (event) {
                //                this.style.cssText = "height:auto;";
                //                //scope.$apply();
                //            });
            }
        }
    }

    commonDirectives.redirect = function ($location, $window, $rootScope) {
        return {

            link: function (scope, element, attrs) {
                element.on("click", function () {
                    if (!attrs.newwindow || attrs.newwindow == false) {
                        $location.path(attrs.redirect);
                        scope.$apply();
                    }
                    else {
                        //var baseUrl = $location.$$absUrl.toString().substring(0, $location.$$absUrl.toString().indexOf($location.$$path.toString(), $location.$$absUrl.toString().indexOf("#")) + 1) + attrs.redirect;
                        var baseUrl = $location.$$absUrl.toString().substring(0, decodeURIComponent($location.$$absUrl).toString().indexOf($location.$$path.toString(), $location.$$absUrl.toString().indexOf("#")) + 1) + attrs.redirect;
                        $window.open(baseUrl);
                    }
                });
            }
        }
    }
    videoApp.directive('mySharedScope', function () {
        return {

            link: function (scope, element, attrs) {
                element.bind('mouseenter', function () {

                    $('#hpPopover').css("display", "block");
                    $('#hpPopover').css("color", "red");

                });


            }
        };
    });
    videoApp.directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        }
        return fallbackSrc;
    });

    videoApp.directive('noCacheSrc', function ($window) {
        return {
            priority: 99,
            link: function (scope, element, attrs) {
                attrs.$observe('noCacheSrc', function (noCacheSrc) {
                    noCacheSrc += '?' + (new Date()).getTime();
                    attrs.$set('src', noCacheSrc);
                });
            }
        }
    });

    videoApp.directive('checkList', function () {
        return {
            scope: {
                list: '=checkList',
                value: '@'
            },
            link: function (scope, elem, attrs) {
                var handler = function (setup) {
                    var checked = elem.prop('checked');
                    var index = scope.list.indexOf(scope.value);

                    if (checked && index == -1) {
                        if (setup) elem.prop('checked', false);
                        else scope.list.push(scope.value);
                    } else if (!checked && index != -1) {
                        if (setup) elem.prop('checked', true);
                        else scope.list.splice(index, 1);
                    }
                };

                var setupHandler = handler.bind(null, true);
                var changeHandler = handler.bind(null, false);

                elem.bind('change', function () {
                    scope.$apply(changeHandler);
                });
                scope.$watch('list', setupHandler, true);
            }
        };
    });

    

    videoApp.directive('whenScrolled', function () {
        $window = angular.element($window);
        return function (scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };




    });
    
    videoApp.directive(commonDirectives);
})();

//-------------------directive for triggering a event after last repeater element gets binded------------------------//
angular.module('videoApp').directive('emitLastRepeaterElement', function () {
    return function (scope) {
        if (scope.$last) {
            scope.$emit('LastRepeaterElement');
        }
    };
});

