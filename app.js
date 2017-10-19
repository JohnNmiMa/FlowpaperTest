angular.module('flowpaperTestApp', ['ngAnimate'])
.controller('appController', function($scope) {

    $scope.documentUrl = 'BusserOL.pdf';
    $scope.documentPreviewUrl = 'KLSR.pdf';
    $scope.documentViewerId = 'documentViewer';
    $scope.documentPreviewerId = 'documentPreviewer';

    $scope.showFixedDocument = false;
    $scope.displayDocument = function(isFixedSize) {
        if (isFixedSize) {
            $scope.showFixedDocument = !$scope.showFixedDocument;
        }
        else {
            $scope.showFlexibleDocument = !$scope.showFlexibleDocument;
        }
    }
})

.directive('documentViewer', ['DocumentViewingService', '$window', function(viewerSvc, $window) {
    return {
        restrict: 'E',
        scope: {
            docUrl: '=',
            docId: '@'
        },
        templateUrl: './newton-viewer.html',
        link: function(scope, element, attrs) {
            var debounceResize = _.debounce(resizeDocument, 50, {'trailing':true});

            viewerSvc.displayDocument(scope.docId, scope.docUrl);

            angular.element($window).on("resize", debounceResize);
            function resizeDocument() {
                viewerSvc.resizeViewer(scope.docId);
            }

            scope.$on('$destroy', function() {
                angular.element($window).off("resize", debounceResize);
                viewerSvc.destroyViewer(scope.docId);
            });
        }
    }
}])

.factory("DocumentViewingService", ['$http', '$location', '$timeout', function ($http, $location, $timeout) {
    var newtonDocViewer,
        FIT_WIDTH = "Fit Width", FIT_HEIGHT = "Fit Height", FIT_NONE = "Fit None",
        fitMode = {};

    var displayDocument = function(docId, pdfFile) {
        var flowpaperRootDir = $location.protocol() + "://" + $location.host() + ':' + $location.port() + "/js/flowpaper_3.0.1_c/",
            toolbarHtml = (docId === 'documentPreviewer') ? 'UI_flowpaper_desktop_flat_preview.html' : 'UI_flowpaper_desktop_flat.html',
            toolbarMobileHtml = (docId === 'documentPreviewer') ? 'UI_flowpaper_mobile_flat_preview.html' : 'UI_flowpaper_mobile_flat.html',
            toolbarUrl = window.isTouchScreen ? flowpaperRootDir + toolbarMobileHtml : flowpaperRootDir + toolbarHtml,
            flowpaperConfig =
                {
                    key: '@95ab8d7b0b08c8ade3f$fd203332deebe9414df',
                    PDFFile: pdfFile,
                    RenderingOrder: 'html5',
                    FitWidthOnLoad: false,
                    WMode: 'opaque',
                    InitViewMode: 'Portrait',
                    SearchMatchAll: true,
                    ProgressiveLoading: false,
                    MaxZoomSize: 3,

                    ViewModeToolsVisible: true,
                    ZoomToolsVisible: true,
                    NavToolsVisible: true,
                    CursorToolsVisible: true,
                    SearchToolsVisible: true,
                    FullScreenAsMaxWindow: true,
                    jsDirectory: flowpaperRootDir + 'js/',

                    localeChain: 'en_US',
                    localeDirectory: flowpaperRootDir + 'locale/'
                };

        if (docId === 'documentPreviewer') {
            setFitMode(docId, FIT_WIDTH);
        } else if (docId === 'documentViewer') {
            setFitMode(docId, FIT_WIDTH);
        }
        flowpaperConfig.FitWidthOnLoad = (getFitMode(docId) === FIT_WIDTH);
        flowpaperConfig.FitPageOnLoad = (getFitMode(docId) === FIT_HEIGHT);

        $http.get(toolbarUrl).then(function(toolbarTemplate) {
            bindDocumentLoaded(docId);

            flowpaperConfig.Toolbar = toolbarTemplate.data;
            $('#'+docId).FlowPaperViewer({config: flowpaperConfig});
        })
    };

    var resizeViewer = function(docId) {
        window.getDocViewer(docId).resize();
        $timeout(function() {
            var fitMode = getFitMode(docId);
            if (fitMode === FIT_WIDTH) {
                window.getDocViewer(docId).fitWidth();
            } else if (fitMode === FIT_HEIGHT) {
                window.getDocViewer(docId).fitHeight();
            }
        }, 150);
    };

    var destroyViewer = function(docId) {
        window.getDocViewer(docId).dispose();
        delete fitMode[docId];
    };

    // Utils

    function getFitMode(docId) {
        return fitMode[docId];
    }
    function setFitMode(docId, mode) {
        fitMode[docId] = mode;
    }

    function bindDocumentLoaded(docId) {
        // Notify when document is completely loaded
        $('#'+docId).bind('onDocumentLoaded', function(e, totalPages) {
            initClickHandlers(docId);
        });
    }

    function initClickHandlers(docId) {
        document.getElementById('toolbar_'+docId).getElementsByClassName('flowpaper_bttnFitWidth')[0].onclick = function(e) {
            setFitMode(docId, FIT_WIDTH);
            window.getDocViewer(docId).fitWidth();
        };
        document.getElementById('toolbar_'+docId).getElementsByClassName('flowpaper_bttnFitHeight')[0].onclick = function(e) {
            setFitMode(docId, FIT_HEIGHT);
            window.getDocViewer(docId).fitHeight();
        };
        document.getElementById('toolbar_'+docId).getElementsByClassName('flowpaper_tbzoomout')[0].onclick = function(e) {
            setFitMode(docId, FIT_NONE);
            window.getDocViewer(docId).ZoomOut();
        };
        document.getElementById('toolbar_'+docId).getElementsByClassName('flowpaper_tbzoomin')[0].onclick = function(e) {
            setFitMode(docId, FIT_NONE);
            window.getDocViewer(docId).ZoomIn();
        };
    }

    return {
        displayDocument: displayDocument,
        resizeViewer: resizeViewer,
        destroyViewer: destroyViewer
    }
}]);

