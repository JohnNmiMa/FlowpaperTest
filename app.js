angular.module('flowpaperTestApp', ['ngAnimate'])
.controller('appController', function($scope) {

    $scope.documentUrl = 'KLSR.pdf';
    $scope.documentId = 'documentViewer';

    $scope.showDocument = false;
    $scope.displayDocument = function() {
        $scope.showDocument = !$scope.showDocument;
    }
})

.directive('documentViewer', ['DocumentViewingService', function(viewerSvc) {
    return {
        restrict: 'E',
        scope: {
            docUrl: '=',
            docId: '@'
        },
        replace: true,
        templateUrl: './newton-viewer.html',
        link: function(scope, element, attrs) {
            viewerSvc.displayDocument(scope.docId, scope.docUrl);

            scope.$on('$destroy', function() {
                viewerSvc.destroyViewer(scope.docId);
            })
        }
    }
}])

.factory("DocumentViewingService", ['$http', '$location', function ($http, $location) {
    var newtonDocViewer;

    var displayDocument = function(docId, pdfFile) {
        var flowpaperRootDir = $location.protocol() + "://" + $location.host() + ':' + $location.port() + "/flowpaper_3.0.1_c/",
            toolbarUrl = window.isTouchScreen ? flowpaperRootDir + 'UI_flowpaper_mobile_flat.html' :
                         flowpaperRootDir + 'UI_flowpaper_desktop_flat.html',
            flowpaperConfig =
                {
                    key: '@95ab8d7b0b08c8ade3f$fd203332deebe9414df',
                    PDFFile: pdfFile,
                    RenderingOrder: 'html5',
                    FitWidthOnLoad: false,
                    WMode: 'opaque',
                    localeChain: 'en_US',
                    ViewModeToolsVisible: true,
                    ZoomToolsVisible: true,
                    NavToolsVisible: true,
                    CursorToolsVisible: true,
                    SearchToolsVisible: true,
                    FullScreenAsMaxWindow: true,
                    jsDirectory: flowpaperRootDir + 'js/',
                    localeDirectory: flowpaperRootDir + 'locale/'
                };
                // InitViewMode: 'Portrait',
                // FitWidthOnLoad: true,

        $http.get(toolbarUrl).then(function(toolbarTemplate) {
            flowpaperConfig.Toolbar = toolbarTemplate.data;
            // $('#documentViewer').FlowPaperViewer({config: flowpaperConfig});
            $('#'+docId).FlowPaperViewer({config: flowpaperConfig});
        })
    };

    var destroyViewer = function(docId) {
        window.getDocViewer(docId).dispose();
    };

    return {
        displayDocument: displayDocument,
        destroyViewer: destroyViewer
    }
}]);

