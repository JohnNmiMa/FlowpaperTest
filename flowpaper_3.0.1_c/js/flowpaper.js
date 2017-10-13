/**
 █▒▓▒░ The FlowPaper Project

 This file is part of FlowPaper.

 For more information on FlowPaper please see the FlowPaper project
 home page: https://flowpaper.com
 */

/**
*
* FlowPaper helper function for retrieving a active FlowPaper instance
*
*/ 
window.$FlowPaper = window.getDocViewer = window["$FlowPaper"] = function(id){
	var instance = (id==="undefined")?"":id;

    if (window['ViewerMode'] == 'flash') {
		return window["FlowPaperViewer_Instance"+instance].getApi();
	}else if(window['ViewerMode'] == 'html'){
		return window["FlowPaperViewer_Instance"+instance];
	}
};  



/**
 *
 * FlowPaper embedding (name of placeholder, config)
 *
 */
window.FlowPaperViewerEmbedding = window.$f = function(id, args) {
    this.id = id;

    var userAgent = navigator.userAgent.toLowerCase();
    var browser = window["eb.browser"] = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: (/webkit/.test(userAgent) || /applewebkit/.test(userAgent)) && !(/chrome/.test(userAgent)),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
        seamonkey: /seamonkey/.test(userAgent),
        chrome: /chrome/.test(userAgent)
    };

    browser.detected = browser.safari || browser.opera || browser.msie || browser.mozilla || browser.seamonkey || browser.chrome;

    // assume Chrome version 500 if we couldnt detect it
    if(!browser.detected || !browser.version){
        browser.chrome = true; browser.version = "500.00";
    }

    var platform = window["eb.platform"] = {
        win:/win/.test(userAgent),
        mac:/mac/.test(userAgent),
        touchdevice : (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })(),
        android : (userAgent.indexOf("android") > -1),
        ios : ((userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)) || (userAgent.match(/ipad/i))),
        iphone : (userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)),
        ipad : (userAgent.match(/ipad/i)),
        winphone : userAgent.match(/Windows Phone/i),
        blackberry : userAgent.match(/BlackBerry/i) || userAgent.match(/BB10/i),
        webos : userAgent.match(/webOS/i)
    };

    platform.touchonlydevice = platform.touchdevice && (platform.android || platform.ios || platform.winphone || platform.blackberry || platform.webos);

    var config = args.config;
    var _SWFFile,_PDFFile,_IMGFiles,_SVGFiles,_IMGFiles_thumbs="",_IMGFiles_highres="",_JSONFile  = "",_jsDirectory="",_cssDirectory="",_localeDirectory="";_WMode = (config.WMode!=null||config.wmode!=null?config.wmode||config.WMode:"direct");
    var _uDoc = ((config.DOC !=null)?unescape(config.DOC):null);
    var instance = "FlowPaperViewer_Instance"+((id==="undefined")?"":id);
    var _JSONDataType = (config.JSONDataType!=null)?config.JSONDataType:"json";

    if (_uDoc != null) {
        _SWFFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"swf");
        _PDFFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"pdf");
        _JSONFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,_JSONDataType);
        _IMGFiles 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"jpg");
        _SVGFiles           = FLOWPAPER.translateUrlByFormat(_uDoc,"svg");
        _IMGFiles_thumbs    = FLOWPAPER.translateUrlByFormat(_uDoc,"jpg");
        _IMGFiles_highres   = FLOWPAPER.translateUrlByFormat(_uDoc,"jpgpageslice");
    }

    _SWFFile  			= (config.SwfFile!=null?config.SwfFile:_SWFFile);
    _SWFFile  			= (config.SWFFile!=null?config.SWFFile:_SWFFile);
    _PDFFile 			= (config.PDFFile!=null?config.PDFFile:_PDFFile);
    _IMGFiles 			= (config.IMGFiles!=null?config.IMGFiles:_IMGFiles);
    _IMGFiles 			= (config.PageImagePattern!=null?config.PageImagePattern:_IMGFiles);
    _SVGFiles 			= (config.SVGFiles!=null?config.SVGFiles:_SVGFiles);
    _IMGFiles_thumbs    = (config.ThumbIMGFiles!=null?config.ThumbIMGFiles:_IMGFiles_thumbs);
    _IMGFiles_highres   = (config.HighResIMGFiles!=null?config.HighResIMGFiles:_IMGFiles_highres);
    _JSONFile 			= (config.JSONFile!=null?config.JSONFile:_JSONFile);
    _jsDirectory 		= (config.jsDirectory!=null?config.jsDirectory:FLOWPAPER.detectjsdir());
    _cssDirectory 		= (config.cssDirectory!=null?config.cssDirectory:FLOWPAPER.detectcssdir());
    _localeDirectory 	= (config.localeDirectory!=null?config.localeDirectory:"locale/");
    if(_SWFFile!=null && _SWFFile.indexOf("{" )==0 && _SWFFile.indexOf("[*," ) > 0 && _SWFFile.indexOf("]" ) > 0){_SWFFile = escape(_SWFFile);} // split file fix

    // overwrite StartAtPage with anything off the hash
    if(FLOWPAPER.getLocationHashParameter){
        var pageFromHash = FLOWPAPER.getLocationHashParameter('page');
        if(pageFromHash!=null){
            config.StartAtPage = pageFromHash;
        }
    }

    if(FLOWPAPER.getLocationHashParameter){
        var previewModeFromHash = FLOWPAPER.getLocationHashParameter('PreviewMode');
        if(previewModeFromHash!=null){
            config.PreviewMode = previewModeFromHash;
        }
    }

    if(config.PreviewMode == "FrontPage" && ((_IMGFiles!=null && _IMGFiles.length>0) || (_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0))){
        FLOWPAPER.initFrontPagePreview(id,args,(_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0)?_IMGFiles_thumbs:_IMGFiles);
        return;
    }

    window[instance] = flashembed(id, {
        src						    : _jsDirectory+"../FlowPaperViewer.swf",
        version					    : [11, 0],
        expressInstall			    : "js/expressinstall.swf",
        wmode					    : _WMode
    },{
        ElementId               : id,
        SwfFile  				: _SWFFile,
        PdfFile  				: _PDFFile,
        IMGFiles  				: _IMGFiles,
        SVGFiles  				: _SVGFiles,
        JSONFile 				: _JSONFile,
        ThumbIMGFiles           : _IMGFiles_thumbs,
        HighResIMGFiles         : _IMGFiles_highres,
        useCustomJSONFormat 	: config.useCustomJSONFormat,
        JSONPageDataFormat 		: config.JSONPageDataFormat,
        JSONDataType 			: _JSONDataType,
        Scale 					: (config.Scale!=null)?config.Scale:0.8,
        ZoomTransition 			: (config.ZoomTransition!=null)?config.ZoomTransition:'easeOut',
        ZoomTime 				: (config.ZoomTime!=null)?config.ZoomTime:0.5,
        ZoomInterval 			: (config.ZoomInterval)?config.ZoomInterval:0.1,
        TouchZoomInterval       : (config.TouchZoomInterval)?config.TouchZoomInterval:1.5,
        FitPageOnLoad 			: (config.FitPageOnLoad!=null)?config.FitPageOnLoad:false,
        FitWidthOnLoad 			: (config.FitWidthOnLoad!=null)?config.FitWidthOnLoad:false,
        FullScreenAsMaxWindow 	: (config.FullScreenAsMaxWindow!=null)?config.FullScreenAsMaxWindow:false,
        ProgressiveLoading 		: (config.ProgressiveLoading!=null)?config.ProgressiveLoading:false,
        MinZoomSize 			: (config.MinZoomSize!=null)?config.MinZoomSize:0.2,
        MaxZoomSize 			: (config.MaxZoomSize!=null)?config.MaxZoomSize:5,
        SearchMatchAll 			: (config.SearchMatchAll!=null)?config.SearchMatchAll:false,
        SearchServiceUrl 		: config.SearchServiceUrl,
        InitViewMode 			: config.InitViewMode,
        DisableOverflow         : config.DisableOverflow,
        DisplayRange            : config.DisplayRange,
        TouchInitViewMode       : config.TouchInitViewMode,
        PreviewMode             : config.PreviewMode,
        PublicationTitle        : config.PublicationTitle,
        LoaderImage             : config.LoaderImage,
        MixedMode               : config.MixedMode,
        EnableWebGL             : config.EnableWebGL,
        AutoDetectLinks         : config.AutoDetectLinks,
        ImprovedAccessibility   : config.ImprovedAccessibility,
        BitmapBasedRendering 	: (config.BitmapBasedRendering!=null)?config.BitmapBasedRendering:false,
        StartAtPage 			: (config.StartAtPage!=null&&config.StartAtPage.toString().length>0&&!isNaN(config.StartAtPage))?config.StartAtPage:1,
        FontsToLoad             : config.FontsToLoad,
        PrintPaperAsBitmap		: (config.PrintPaperAsBitmap!=null)?config.PrintPaperAsBitmap:((browser.safari||browser.mozilla)?true:false),
        PrintFn                 : config.PrintFn,
        AutoAdjustPrintSize		: (config.AutoAdjustPrintSize!=null)?config.AutoAdjustPrintSize:true,
        EnableSearchAbstracts   : ((config.EnableSearchAbstracts!=null)?config.EnableSearchAbstracts:true),
        EnableCornerDragging 	: ((config.EnableCornerDragging!=null)?config.EnableCornerDragging:true), // FlowPaper Zine parameter
        BackgroundColor 		: config.BackgroundColor, // FlowPaper Zine parameter
        PanelColor 				: config.PanelColor, // FlowPaper Zine parameter
        BackgroundAlpha         : config.BackgroundAlpha, // FlowPaper Zine parameter
        UIConfig                : config.UIConfig,  // FlowPaper Zine parameter
        PageIndexAdjustment     : config.PageIndexAdjustment,
        SharingUrl              : config.SharingUrl,
        BrandingLogo            : config.BrandingLogo,
        BrandingUrl             : config.BrandingUrl,

        ViewModeToolsVisible 	: ((config.ViewModeToolsVisible!=null)?config.ViewModeToolsVisible:true),
        ZoomToolsVisible 		: ((config.ZoomToolsVisible!=null)?config.ZoomToolsVisible:true),
        NavToolsVisible 		: ((config.NavToolsVisible!=null)?config.NavToolsVisible:true),
        CursorToolsVisible 		: ((config.CursorToolsVisible!=null)?config.CursorToolsVisible:true),
        SearchToolsVisible 		: ((config.SearchToolsVisible!=null)?config.SearchToolsVisible:true),
        AnnotationToolsVisible  : ((config.AnnotationToolsVisible!=null)?config.AnnotationToolsVisible:true), // Annotations viewer parameter

        StickyTools				: config.StickyTools,
        UserCollaboration       : config.UserCollaboration,
        CurrentUser             : config.CurrentUser,
        Toolbar                 : config.Toolbar,
        BottomToolbar           : config.BottomToolbar,
        DocSizeQueryService 	: config.DocSizeQueryService,

        RenderingOrder 			: config.RenderingOrder,

        TrackingNumber          : config.TrackingNumber,
        localeChain 			: (config.localeChain!=null)?config.localeChain:"en_US",
        jsDirectory 			: _jsDirectory,
        cssDirectory 			: _cssDirectory,
        localeDirectory			: _localeDirectory,
        signature               : config.signature,
        key 					: config.key
    });

    // add TrackingNumber to the data collection for easier use in events later
    if(config.TrackingNumber && config.TrackingNumber.length>0){

        var _trackSWFFile = _SWFFile; if(_trackSWFFile){_trackSWFFile = (_trackSWFFile.indexOf("/")>0?_trackSWFFile.substr(_trackSWFFile.lastIndexOf("/")+1):_trackSWFFile); _trackSWFFile = _trackSWFFile.replace("_[*,0]",""); _trackSWFFile = _trackSWFFile.replace(".swf",".pdf"); _trackSWFFile = (_trackSWFFile.indexOf("}")>0?_trackSWFFile.substr(0,_trackSWFFile.lastIndexOf(",")):_trackSWFFile);}
        var _trackPDFFile = _PDFFile; if(_trackPDFFile){_trackPDFFile = (_trackPDFFile.indexOf("/")>0?_trackPDFFile.substr(_trackPDFFile.lastIndexOf("/")+1):_trackPDFFile); _trackPDFFile = _trackPDFFile.replace("_[*,0]","").replace("_[*,2]","");}
        var _trackJSONFile = _JSONFile; if(_JSONFile){_trackJSONFile = (_trackJSONFile.indexOf("/")>0?_trackJSONFile.substr(_trackJSONFile.lastIndexOf("/")+1):_trackJSONFile); _trackJSONFile = _trackJSONFile.replace("{page}",""); _trackJSONFile = _trackJSONFile.replace(".js",".pdf");}

        jQuery('#'+id).data('TrackingDocument',(_trackPDFFile || _trackSWFFile || _trackJSONFile));
        jQuery('#'+id).data('TrackingNumber',config.TrackingNumber);
    }
};

(function() {
    if(!window.FLOWPAPER){window.FLOWPAPER = {};}

    FLOWPAPER.detectjsdir = function(){
        if(jQuery('script[src$="flowpaper.js"]').length>0){
            return jQuery('script[src$="flowpaper.js"]').attr('src').replace('flowpaper.js','');
        }else{
            return "js/"
        }
    };

    FLOWPAPER.detectcssdir= function(){
        if(jQuery('link[href$="flowpaper.css"]').length>0){
            return jQuery('link[href$="flowpaper.css"]').attr('href').replace('flowpaper.css','');
        }else{
            return "css/"
        }
    };

    FLOWPAPER.getLocationHashParameter = function(param){
        var hash = location.hash.substr(1);

        if(hash.indexOf(param+'=')>=0){
            var value = hash.substr(hash.indexOf(param+'='))
                .split('&')[0]
                .split('=')[1];

            return value;
        }

        return null;
    };

    FLOWPAPER.translateUrlByFormat = function(url,format){
        if(url.indexOf("{") == 0 && format != "swf"){ // loading in split file mode
            url = url.substring(1,url.lastIndexOf(","));

            if(format!="pdf"){
                url = url.replace("[*,0]","{page}")
                url = url.replace("[*,2]","{page}")
            }
        }else if(format == "swf" && url.indexOf("{") != 0){
            url = url.replace("{page}", "");
            url = url.replace(/&/g, '%26');
            url = url.replace(/ /g, '%20');
        }

        if(format =="jpgpageslice"){
            url = url + "&sector={sector}";
        }

        url = (url!=null && url.indexOf('{format}') > 0 ? url.replace("{format}", format):null);
        return url;
    };

    FLOWPAPER.translateUrlByDocument = function(url,document){
        return (url!=null && url.indexOf('{doc}') > 0 ? url.replace("{doc}", document):null);
    };

    FLOWPAPER.animateDenyEffect = function(obj,margin,time,cycles,dir) {
        window.setTimeout(function(){
            var speed = time / ((2*cycles)+1);
            var margRat = 1 + (60/(cycles*cycles)); jQuery(obj).stop(true,true);
            for (var i=0; i<=cycles; i++) {
                for (var j=-1; j<=1; j+=2)
                    jQuery(obj).animate({marginLeft: (i!=cycles)*j*margin},{duration:speed, queue:true});

                margin/=margRat;
            }
        },500);
    };

    FLOWPAPER.initFrontPagePreview = function initFrontPagePreview(viewerid,args,IMGFiles){
        var animate = true;
        jQuery(document.body).css('background-color',jQuery('#'+viewerid).css('background-color'));

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                "<div id='flowpaper_frontpagePreview_"+viewerid+"'>"+
                    "<form class='flowpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>350)?"50px auto":"0px auto")+";padding-bottom:0px;'>"+
                    "<div class='flowpaper_preview_container flowpaper_publications flowpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;margin: -25px -25px 0px;padding: 15px 25px 20px 25px;'>"+
                    "<div class='flowpaper_publication flowpaper_publication_csstransforms3d' style='cursor:pointer;margin-bottom:20px;'>"+
                    "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                    "</div>"+
                    ((args.config.PublicationTitle!=null && args.config.PublicationTitle.length>0)?"<h1 class='flowpaper_htmldialog-title' style='margin-bottom:0px;'>"+args.config.PublicationTitle+"</h1>":"")+
                    "</div>"+
                    "</form>"+
                    "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 260;

            jQuery('.flowpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flowpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                var preview_container = jQuery('#flowpaper_frontpagePreview_'+viewerid);
                var container_width = preview_container.find('.flowpaper_preview_container').width();
                var container_height = preview_container.find('.flowpaper_preview_container').height();

                preview_container.find('.flowpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication
                preview_container.find('.flowpaper_preview_container').append("<div class='flowpaper_frontpagePreview_play' style='position:absolute;left:"+(container_width/2)+"px;top:"+(container_height/2-((args.config.PublicationTitle!=null)?50:25))+"px;width:0px;height:0px;border-bottom:50px solid transparent;border-top:50px solid transparent;border-left:50px solid #AAAAAA;'></div>");

                var playbutton = preview_container.find('.flowpaper_frontpagePreview_play');

                playbutton.css({opacity : 0.85, 'cursor' : 'pointer'});
                preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mouseover",function(e){
                    jQuery(playbutton).css({
                        'border-left'	: '50px solid #FFFFFF',
                        opacity : 0.85
                    });
                });

                preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mouseout",function(e){
                    jQuery(playbutton).css({
                        'border-left'	: '50px solid #AAAAAA'
                    });
                });

                preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mousedown",function(e){
                    jQuery('#flowpaper_frontpagePreview_'+viewerid).remove();
                    args.config.PreviewMode=null;
                    jQuery('#'+viewerid).FlowPaperViewer(args);
                });

                jQuery('.flowpaper_publication').animate({opacity:1},{
                    step : function(now,fx){
                        var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                        jQuery('.flowpaper_publication').css({
                            '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                            '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                            'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                        });
                    },
                    duration:anim_duration
                });

            }});

        });
        img.src = (IMGFiles.replace("{page}",1));
    };

    FLOWPAPER.initLoginForm = function initLoginForm(IMGFiles,animate){
        jQuery(document.body).css('background-color','#dedede');

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                    "<div id='loginForm'>"+
                    "<form class='flowpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>500)?"50px auto":"0px auto")+"'>"+
                    "<div class='flowpaper_publications flowpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;background: #f7f7f7;margin: -25px -25px 0px;padding: 15px 25px 0px 25px;'>"+
                    "<div class='flowpaper_publication flowpaper_publication_csstransforms3d' id='flowpaper_publication1'>"+
                    "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                    "</div>"+

                    "<h1 class='flowpaper_htmldialog-title'>password protected publication</h1>"+
                    "<input type='password' id='txt_flowpaper_password' name='txt_flowpaper_password' class='flowpaper_htmldialog-input' placeholder='Enter password'>"+
                    "<input type='submit' value='Submit' class='flowpaper_htmldialog-button'>"+
                    "</div>"+
                    "</form>"+
                    "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 400;

            jQuery('.flowpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flowpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                jQuery('.flowpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication

                jQuery('.flowpaper_publication').animate({opacity:1},{
                    step : function(now,fx){
                        var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                        jQuery('.flowpaper_publication').css({
                            '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                            '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                            'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                        });
                    },
                    duration:anim_duration
                });

            }});

        });
        img.src = (IMGFiles.replace("{page}",1));
    };

    FLOWPAPER.blockedNewWindow = function(poppedWindow){
        var result = false;

        try {
            if (typeof poppedWindow == 'undefined') {
                // Safari with popup blocker... leaves the popup window handle undefined
                result = true;
            }
            else if (poppedWindow && poppedWindow.closed) {
                // This happens if the user opens and closes the client window...
                // Confusing because the handle is still available, but it's in a "closed" state.
                // We're not saying that the window is not being blocked, we're just saying
                // that the window has been closed before the test could be run.
                result = false;
            }
            else if (poppedWindow && poppedWindow.document) {
                // This is the actual test. The client window should be fine.
                result = false;
            }
            else {
                // Else we'll assume the window is not OK
                result = true;
            }

        } catch (err) {
            //if (console) {
            //    console.warn("Could not access popup window", err);
            //}
        }

        return result;
    };
})();

/**
 * 
 * FlowPaper embedding functionality. Based on FlashEmbed
 *
 */

(function() {
    var  ua = navigator.userAgent.toLowerCase();
	var  IE = document.all,
		 URL = 'http://www.adobe.com/go/getflashplayer',
		 JQUERY = typeof jQuery == 'function', 
		 RE = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/,
         INMETRO = /msie/.test(ua) && (function(){try {return !!new ActiveXObject("htmlfile");} catch (e) {return false;} })() && navigator.platform == "Win64" && (document.documentElement.clientWidth == screen.width),
         MOBILE = (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })() || ua.match(/touch/i),
         MOBILEOS = ((ua.indexOf("android") > -1) || ((ua.match(/iphone/i)) || (ua.match(/ipod/i)) || (ua.match(/ipad/i))) || ua.match(/Windows Phone/i) || ua.match(/BlackBerry/i) || ua.match(/webOS/i)),
		 GLOBAL_OPTS = { 
			// very common opts
			width: '100%',
			height: '100%',		
			id: "_" + ("" + Math.random()).slice(9),
			
			// flashembed defaults
			allowfullscreen: true,
			allowscriptaccess: 'always',
			quality: 'high',
            allowFullScreenInteractive : true,
			
			// flashembed specific options
			version: [10, 0],
			onFail: null,
			expressInstall: null, 
			w3c: false,
			cachebusting: false  		 		 
	};

    window.isTouchScreen = MOBILE && (MOBILEOS || INMETRO);

	if (window.attachEvent) {
		window.attachEvent("onbeforeunload", function() {
			__flash_unloadHandler = function() {};
			__flash_savedUnloadHandler = function() {};
		});
	}
	
	// simple extend
	function extend(to, from) {
		if (from) {
			for (var key in from) {
				if (from.hasOwnProperty(key)) {
					to[key] = from[key];
				}
			}
		} 
		return to;
	}

    // used by Flash to dispatch a event properly
    window.dispatchJQueryEvent = function (elementId,eventName,args){

        // make sure escaped flash backslash characters are normalized
        if(args.length>0 && args[0].note){
            args[0].note = args[0].note.replace(/%22/g, "\"")
                                       .replace(/%5c/g, "\\")
                                       .replace(/%26/g, "&")
                                       .replace(/%25/g, "%");
        }

        jQuery('#'+elementId).trigger(eventName,args);
    }

	// used by asString method	
	function map(arr, func) {
		var newArr = []; 
		for (var i in arr) {
			if (arr.hasOwnProperty(i)) {
				newArr[i] = func(arr[i]);
			}
		}
		return newArr;
	}

	window.flashembed = function(root, opts, conf) {
		// root must be found / loaded	
		if (typeof root == 'string') {
			root = document.getElementById(root.replace("#", ""));
		}
		
		// not found
		if (!root) { return; }
		
		root.onclick = function(){return false;}
		
		if (typeof opts == 'string') {
			opts = {src: opts};	
		}

		return new Flash(root, extend(extend({}, GLOBAL_OPTS), opts), conf); 
	};	
	
	// flashembed "static" API
	var f = extend(window.flashembed, {
		
		conf: GLOBAL_OPTS,
	
		getVersion: function()  {
			var fo, ver;
			
			try {
				ver = navigator.plugins["Shockwave Flash"].description.slice(16); 
			} catch(e) {
				
				try  {
					fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
					ver = fo && fo.GetVariable("$version");
					
				} catch(err) {
                try  {
                    fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    ver = fo && fo.GetVariable("$version");  
                } catch(err2) { } 						
				} 
			}
			
			ver = RE.exec(ver);
			return ver ? [ver[1], ver[3]] : [0, 0];
		},
		
		asString: function(obj) { 

			if (obj === null || obj === undefined) { return null; }
			var type = typeof obj;
			if (type == 'object' && obj.push) { type = 'array'; }
			
			switch (type){  
				
				case 'string':
					obj = obj.replace(new RegExp('(["\\\\])', 'g'), '\\$1');
					
					// flash does not handle %- characters well. transforms "50%" to "50pct" (a dirty hack, I admit)
					obj = obj.replace(/^\s?(\d+\.?\d+)%/, "$1pct");
					return '"' +obj+ '"';
					
				case 'array':
					return '['+ map(obj, function(el) {
						return f.asString(el);
					}).join(',') +']'; 
					
				case 'function':
					return '"function()"';
					
				case 'object':
					var str = [];
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop)) {
							str.push('"'+prop+'":'+ f.asString(obj[prop]));
						}
					}
					return '{'+str.join(',')+'}';
			}
			
			// replace ' --> "  and remove spaces
			return String(obj).replace(/\s/g, " ").replace(/\'/g, "\"");
		},
		
		getHTML: function(opts, conf) {

			opts = extend({}, opts);
			opts.id = opts.id + (" " + Math.random()).slice(9);
			
			/******* OBJECT tag and it's attributes *******/
			var html = '<object width="' + opts.width + 
				'" height="' + opts.height + 
				'" id="' + opts.id + 
				'" name="' + opts.id + '"';
			
			if (opts.cachebusting) {
				opts.src += ((opts.src.indexOf("?") != -1 ? "&" : "?") + Math.random());		
			}			
			
			if (opts.w3c || !IE) {
				html += ' data="' +opts.src+ '" type="application/x-shockwave-flash"';		
			} else {
				html += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';	
			}
			
			html += '>'; 
			
			/******* nested PARAM tags *******/
			if (opts.w3c || IE) {
				html += '<param name="movie" value="' +opts.src+ '" />'; 	
			} 
			
			// not allowed params
			opts.width = opts.height = opts.id = opts.w3c = opts.src = null;
			opts.onFail = opts.version = opts.expressInstall = null;
			
			for (var key in opts) {
				if (opts[key]) {
					html += '<param name="'+ key +'" value="'+ opts[key] +'" />';
				}
			}	
		
			/******* FLASHVARS *******/
			var vars = "";
			
			if (conf) {
				for (var k in conf) {
                    if ((typeof conf[k] != "undefined") && (typeof conf[k] != "unknown") && k!='Toolbar' && k!='BottomToolbar') {
						var val = conf[k];
                        if(k=="JSONFile"){val = escape(val);}
						vars += k +'='+ (/function|object/.test(typeof val) ? f.asString(val) : val) + '&';
					}
				}
				vars = vars.slice(0, -1);
				html += '<param name="flashvars" value=\'' + vars + '\' />';
			}
			
			html += "</object>";	
			
			return html;				
		},
		
		isSupported: function(ver) {
			return VERSION[0] > ver[0] || VERSION[0] == ver[0] && VERSION[1] >= ver[1];			
		}		
		
	});
	
	var VERSION = f.getVersion(); 
	
	function Flash(root, opts, conf) {
        var browser = window["eb.browser"];
            browser.version = browser.version?browser.version:"";

        var platform = window["eb.platform"];

        var supportsHTML4   = (browser.mozilla && browser.version.split(".")[0] >= 3) ||
            (browser.chrome) ||
            (browser.msie && browser.version.split(".")[0] >= 8) ||
            (browser.safari) ||
            (browser.opera);

        var supportsCanvasDrawing 	= 	(browser.mozilla && browser.version.split(".")[0] >= 4 && !browser.seamonkey) ||
                                        (browser.chrome) ||
                                        (browser.msie && browser.version.split(".")[0] >= 9) ||
                                        (browser.safari && browser.version.split(".")[0] >= 535 /*&& !platform.ios*/);

        // Default to a rendering mode if its not set
        if(!conf.RenderingOrder && conf.SwfFile !=  null){conf.RenderingOrder = "flash";}
        if(!conf.RenderingOrder && conf.JSONFile !=  null && conf.JSONFile){conf.RenderingOrder = "html";}
        if(!conf.RenderingOrder && conf.PdfFile !=  null){conf.RenderingOrder = "html5";}

        // mobile preview removes flash from the rendering order
        if(FLOWPAPER.getLocationHashParameter && FLOWPAPER.getLocationHashParameter('mobilepreview')){
            conf.RenderingOrder     = conf.RenderingOrder.replace(/flash/g, 'html');
            platform.mobilepreview  = true;
        }

        // if a iOS device but not touch then user is clearly faking user agent. Assume mobile preview.
        if(!platform.touchdevice && platform.ios){
            conf.RenderingOrder = conf.RenderingOrder.replace(/flash/g, 'html');
        }

        if(platform.ios){
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if(v!=null && v.length>1){
                platform.iosversion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)][0];
            }
        }

        var viewerId = jQuery(root).attr('id');
        var instance = "FlowPaperViewer_Instance"+((viewerId==="undefined")?"":viewerId);

        // version is ok
		if ((conf.RenderingOrder.indexOf('flash') == 0 || (conf.RenderingOrder.indexOf('flash')>0 &&!supportsHTML4) || (conf.RenderingOrder.indexOf('flash')>0 && conf.RenderingOrder.indexOf('html5')>=0 && !supportsCanvasDrawing)) && f.isSupported(opts.version)) {
            if(conf.Toolbar){
                var wrapper = jQuery(root).wrap("<div class='flowpaper_toolbar_wrapper' style='"+jQuery(root).attr('style')+"'></div>").parent();
                wrapper.prepend(jQuery(conf.Toolbar));
                
                jQuery(root).css({
                    left : '0px',
                    top: '0px',
                    position : 'relative',
                    width : '100%',
                    height : ((1 - jQuery(wrapper).find('.flowpaper_toolbar').height() / jQuery(root).parent().height()) * 100) + '%'
                }).addClass('flowpaper_viewer');
            }

			window['ViewerMode'] = 'flash';

            if(conf.BottomToolbar && conf.AnnotationToolsVisible!=false){
                jQuery.get(conf.BottomToolbar,function(toolbarData){
                    wrapper.append(toolbarData);
                    
                    jQuery(root).css({
                        height : jQuery(root).height() - jQuery(wrapper).find('.flowpaper_bottomToolbar').height()
                    });
                });
            }

            if(conf.Toolbar){
                // initialize event handlers for flash
                jQuery.getScript(conf.jsDirectory+'flowpaper_flashhandlers_htmlui.js', function() {
                    FLOWPAPER.bindFlashEventHandlers(root);

                    root.innerHTML = f.getHTML(opts, conf);
                    root.firstChild["dispose"] = function(){
                        if(conf.Toolbar){
                            jQuery($FlowPaper('documentViewer')).parent().parent().remove();
                        }else{
                            $FlowPaper(viewerId).remove();
                        }
                    }
                });
            }else{
                root.innerHTML = f.getHTML(opts, conf);
                root.firstChild["dispose"] = function(){
                    if(conf.Toolbar){
                        jQuery($FlowPaper('documentViewer')).parent().parent().remove();
                    }else{
                        $FlowPaper(viewerId).remove();
                    }
                }
            }

		// express install
		} else if ((conf.RenderingOrder.indexOf('flash') == 0) && opts.expressInstall && f.isSupported([6, 65])) {
			window['ViewerMode'] = 'flash';

            if(conf.Toolbar){
                var wrapper = jQuery(root).wrap("<div class='flowpaper_toolbar_wrapper' style='"+jQuery(root).attr('style')+"'></div>").parent();
                jQuery(root).css({
                    left : '0px',
                    top: '0px',
                    position : 'relative',
                    width : '100%',
                    height : ((1 - jQuery(wrapper).find('.flowpaper_toolbar').height() / jQuery(root).parent().height()) * 100) + '%'
                }).addClass('flowpaper_viewer');

                wrapper.prepend(jQuery(conf.Toolbar));
            }

            if(conf.BottomToolbar && conf.AnnotationToolsVisible!=false){
                jQuery.get(conf.BottomToolbar,function(toolbarData){
                    wrapper.append(toolbarData);
                    
                    jQuery(root).css({
                        height : jQuery(root).height() - jQuery(wrapper).find('.flowpaper_bottomToolbar').height()
                    });
                });
            }

            if(conf.Toolbar){
                // initialize event handlers for flash
                jQuery.getScript(conf.jsDirectory+'flowpaper_flashhandlers_htmlui.js', function() {
                    FLOWPAPER.bindFlashEventHandlers(root);

                    root.innerHTML = f.getHTML(extend(opts, {src: opts.expressInstall}), {
                        MMredirectURL: location.href,
                        MMplayerType: 'PlugIn',
                        MMdoctitle: document.title
                    });

                    root.firstChild["dispose"] = function(){
                        if(conf.Toolbar){
                            jQuery($FlowPaper('documentViewer')).parent().parent().remove();
                        }else{
                            $FlowPaper(viewerId).remove();
                        }
                    }
                });
            }else{
                root.innerHTML = f.getHTML(extend(opts, {src: opts.expressInstall}), {
                    MMredirectURL: location.href,
                    MMplayerType: 'PlugIn',
                    MMdoctitle: document.title
                });

                root.firstChild["dispose"] = function(){
                    if(conf.Toolbar){
                        jQuery($FlowPaper('documentViewer')).parent().parent().remove();
                    }else{
                        $FlowPaper(viewerId).remove();
                    }
                }
            }

		} else { //use html viewer or die
			window['ViewerMode'] = 'html';
			//jQuery.noConflict();
			if(true){
				jQuery(document).ready(function() {
                    if(conf.Toolbar){jQuery.fn.showFullScreen = function(){$FlowPaper(jQuery(this).attr('id')).openFullScreen();}}

                    // Enable cache of scripts. You can disable this if you want to force FlowPaper to use a non-cached version every time.
                    jQuery.ajaxSetup({
                        cache: true
                    });

                    var scriptPromise = new jQuery.Deferred();

                    if(!window["FlowPaperViewer_HTML"]){
                        jQuery.getScript(conf.jsDirectory+'FlowPaperViewer.js').then(function(){scriptPromise.resolve();}).fail(function(){
                                if(arguments[0].readyState==0){
                                    console.log("failed to load FlowPaperViewer.js. Check your resources");
                                }else{
                                    //script loaded but failed to parse
                                    console.log(arguments[2].toString());
                                }
                        });
                    }else{
                        scriptPromise.resolve();
                    }

                    if(scriptPromise.then(function(){
                        // If rendering order isnt set but the formats are supplied then assume the rendering order.
                        if(!conf.RenderingOrder){
                            conf.RenderingOrder = "";
                            if(conf.PdfFile!=null){conf.RenderingOrder = "html5";}
                            if(conf.SwfFile!=null){conf.RenderingOrder += (conf.RenderingOrder.length>0?",":"")+"flash"}
                        }

                        // add fallback for html if not specified
                        if(conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0){
                            if((browser.safari /*&& (platform.iosversion<8 && platform.ipad)*/) || platform.android || (browser.msie && browser.version <=9) || platform.mobilepreview){ // ios should use html as preferred rendering mode if available.
                                conf.RenderingOrder = "html" + (conf.RenderingOrder.length>0?",":"") + conf.RenderingOrder;
                            }else{
                                conf.RenderingOrder += (conf.RenderingOrder.length>0?",":"")+"html";
                            }
                        }

                        var oRenderingList 	        = conf.RenderingOrder.split(",");
                        var pageRenderer 	        = null;
                        var usingFlattenedPDF       = conf.FontsToLoad && conf.FontsToLoad.length>0;

                        // if PDFJS isn't supported and the html formats are supplied, then use these as primary format
                        if(oRenderingList && oRenderingList.length==1 && conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0 && !supportsCanvasDrawing){
                            oRenderingList[1] = conf.RenderingOrder[0];
                            oRenderingList[0] = 'html';
                        }

                        if(!usingFlattenedPDF && conf.PdfFile!=null && conf.PdfFile.length>0 && conf.RenderingOrder.split(",").length>=1 && supportsCanvasDrawing && (oRenderingList[0] == 'html5' || (oRenderingList.length > 1 && oRenderingList[0] == 'flash' && oRenderingList[1] == 'html5'))){
                            pageRenderer = new CanvasPageRenderer(viewerId,conf.PdfFile,conf.jsDirectory,
                                {
                                    jsonfile                : conf.JSONFile,
                                    pageImagePattern        : conf.IMGFiles,
                                    pageThumbImagePattern   : conf.ThumbIMGFiles,
                                    compressedJSONFormat    : !conf.useCustomJSONFormat,
                                    JSONPageDataFormat      : conf.JSONPageDataFormat,
                                    JSONDataType            : conf.JSONDataType,
                                    MixedMode               : conf.MixedMode,
                                    signature               : conf.signature,
                                    PageIndexAdjustment     : conf.PageIndexAdjustment,
                                    DisableShadows          : conf.DisableOverflow,
                                    DisplayRange            : conf.DisplayRange
                                });
                        }else{
                            pageRenderer = new ImagePageRenderer(
                                viewerId,
                                {
                                    jsonfile                : conf.JSONFile,
                                    pageImagePattern        : conf.IMGFiles,
                                    pageThumbImagePattern   : conf.ThumbIMGFiles,
                                    pageHighResImagePattern : conf.HighResIMGFiles,
                                    pageSVGImagePattern     : conf.SVGFiles,
                                    compressedJSONFormat    : !conf.useCustomJSONFormat,
                                    JSONPageDataFormat      : conf.JSONPageDataFormat,
                                    JSONDataType            : conf.JSONDataType,
                                    SVGMode                 : conf.RenderingOrder.toLowerCase().indexOf('svg')>=0,
                                    MixedMode               : conf.MixedMode,
                                    signature               : conf.signature,
                                    PageIndexAdjustment     : conf.PageIndexAdjustment,
                                    DisableShadows          : conf.DisableOverflow,
                                    DisableOverflow         : conf.DisableOverflow,
                                    DisplayRange            : conf.DisplayRange,
                                    FontsToLoad             : conf.FontsToLoad
                                },
                                conf.jsDirectory);
                        }

                        var flowpaper_html = window[instance] = new FlowPaperViewer_HTML({
                            rootid 		    : viewerId,
                            Toolbar 	    : ((conf.Toolbar!=null)?conf.Toolbar:null),
                            BottomToolbar   : ((conf.BottomToolbar!=null)?conf.BottomToolbar:null),
                            instanceid 	: instance,
                            document: {
                                SWFFile 				: conf.SwfFile,
                                IMGFiles 				: conf.IMGFiles,
                                ThumbIMGFiles           : conf.ThumbIMGFiles,
                                JSONFile 				: conf.JSONFile,
                                PDFFile 				: conf.PdfFile,
                                Scale 					: conf.Scale,
                                FitPageOnLoad 			: conf.FitPageOnLoad,
                                FitWidthOnLoad 			: conf.FitWidthOnLoad,
                                FullScreenAsMaxWindow   : conf.FullScreenAsMaxWindow,
                                MinZoomSize 			: conf.MinZoomSize,
                                MaxZoomSize 			: conf.MaxZoomSize,
                                SearchMatchAll 			: conf.SearchMatchAll,
                                InitViewMode 			: conf.InitViewMode,
                                DisableOverflow         : conf.DisableOverflow,
                                DisplayRange            : conf.DisplayRange,
                                TouchInitViewMode       : conf.TouchInitViewMode,
                                PreviewMode             : conf.PreviewMode,
                                MixedMode               : conf.MixedMode,
                                LoaderImage             : conf.LoaderImage,
                                SharingUrl              : conf.SharingUrl,
                                BrandingLogo            : conf.BrandingLogo,
                                BrandingUrl             : conf.BrandingUrl,
                                EnableWebGL             : conf.EnableWebGL,
                                StartAtPage 			: conf.StartAtPage,
                                RenderingOrder 			: conf.RenderingOrder,
                                useCustomJSONFormat 	: conf.useCustomJSONFormat,
                                JSONPageDataFormat 		: conf.JSONPageDataFormat,
                                JSONDataType 			: conf.JSONDataType,
                                ZoomTime     			: conf.ZoomTime,
                                ZoomTransition          : conf.ZoomTransition,
                                ZoomInterval 			: conf.ZoomInterval,
                                TouchZoomInterval       : conf.TouchZoomInterval,
                                ViewModeToolsVisible 	: conf.ViewModeToolsVisible,
                                ZoomToolsVisible 		: conf.ZoomToolsVisible,
                                NavToolsVisible 		: conf.NavToolsVisible,
                                CursorToolsVisible 		: conf.CursorToolsVisible,
                                SearchToolsVisible 		: conf.SearchToolsVisible,
                                AnnotationToolsVisible  : conf.AnnotationToolsVisible,
                                StickyTools 			: conf.StickyTools,
                                AutoDetectLinks         : conf.AutoDetectLinks,
                                ImprovedAccessibility   : conf.ImprovedAccessibility,
                                PrintPaperAsBitmap 		: conf.PrintPaperAsBitmap,
                                PrintFn                 : conf.PrintFn,
                                AutoAdjustPrintSize 	: conf.AutoAdjustPrintSize,
                                EnableSearchAbstracts   : conf.EnableSearchAbstracts,
                                EnableCornerDragging	: conf.EnableCornerDragging,
                                UIConfig                : conf.UIConfig,
                                BackgroundColor			: conf.BackgroundColor, // FlowPaper Zine parameter
                                PanelColor				: conf.PanelColor, // FlowPaper Zine parameter

                                localeChain 			: conf.localeChain
                            },
                            renderer 			: pageRenderer,
                            key 				: conf.key,
                            jsDirectory 		: conf.jsDirectory,
                            localeDirectory 	: conf.localeDirectory,
                            cssDirectory 		: conf.cssDirectory,
                            docSizeQueryService : conf.DocSizeQueryService,
                            UserCollaboration   : conf.UserCollaboration,
                            CurrentUser         : conf.CurrentUser
                        });

                        flowpaper_html.initialize();
                        flowpaper_html.bindEvents();

                        flowpaper_html['load'] = flowpaper_html.loadFromUrl;
                        flowpaper_html['loadDoc'] = flowpaper_html.loadDoc;
                        flowpaper_html['fitWidth'] = flowpaper_html.fitwidth;
                        flowpaper_html['fitHeight'] = flowpaper_html.fitheight;
                        flowpaper_html['gotoPage'] = flowpaper_html.gotoPage;
                        flowpaper_html['getCurrPage'] = flowpaper_html.getCurrPage;
                        flowpaper_html['getTotalPages'] = flowpaper_html.getTotalPages;
                        flowpaper_html['nextPage'] = flowpaper_html.next;
                        flowpaper_html['prevPage'] = flowpaper_html.previous;
                        flowpaper_html['setZoom'] = flowpaper_html.Zoom;
                        flowpaper_html['Zoom'] = flowpaper_html.Zoom;
                        flowpaper_html['ZoomIn'] = flowpaper_html.ZoomIn;
                        flowpaper_html['ZoomOut'] = flowpaper_html.ZoomOut;
                        flowpaper_html['openFullScreen'] = flowpaper_html.openFullScreen;
                        flowpaper_html['sliderChange'] = flowpaper_html.sliderChange;
                        flowpaper_html['searchText'] = flowpaper_html.searchText;
                        flowpaper_html['resize'] = flowpaper_html.resize;
                        flowpaper_html['rotate'] = flowpaper_html.rotate;
                        flowpaper_html['addLink'] = flowpaper_html.addLink;
                        flowpaper_html['addImage'] = flowpaper_html.addImage;
                        flowpaper_html['addVideo'] = flowpaper_html.addVideo;

                        //flowpaper_html['nextSearchMatch'] = flowpaper_html.nextSearchMatch; //TBD
                        //flowpaper_html['prevSearchMatch'] = flowpaper_html.nextSearchMatch; //TBD
                        flowpaper_html['switchMode'] = flowpaper_html.switchMode;
                        flowpaper_html['printPaper'] = flowpaper_html.printPaper;
                        flowpaper_html['highlight'] = flowpaper_html.highlight;
                        flowpaper_html['getCurrentRenderingMode'] = flowpaper_html.getCurrentRenderingMode;
                        //flowpaper_html['postSnapshot'] = flowpaper_html.postSnapshot; //TBD
                        flowpaper_html['setCurrentCursor'] = flowpaper_html.setCurrentCursor;
                        flowpaper_html['showFullScreen'] = flowpaper_html.openFullScreen;

                        pageRenderer.initialize(function(){
                            flowpaper_html.document.numPages = pageRenderer.getNumPages();
                            flowpaper_html.document.dimensions = pageRenderer.getDimensions();
                            flowpaper_html.show();
                            window[instance] = flowpaper_html;
                        },{
                            StartAtPage : conf.StartAtPage,
                            MixedMode : conf.MixedMode
                        });
                    }));
				});
			}else{
				// fail #2.1 custom content inside container
				if (!root.innerHTML.replace(/\s/g, '')) {
					var pageHost = ((document.location.protocol == "https:") ? "https://" :	"http://");
					
					root.innerHTML = 
						"<h2>Your browser is not compatible with FlowPaper</h2>" +
						"<h3>Upgrade to a newer browser or download Adobe Flash Player 10 or higher.</h3>" + 
						"<p>Click on the icon below to download the latest version of Adobe Flash" + 
						"<a href='http://www.adobe.com/go/getflashplayer'><img src='" 
											+ pageHost + "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>";
																							
					if (root.tagName == 'A') {	
						root.onclick = function() {
							location.href = URL;
						};
					}				
				}
				
				// onFail
				if (opts.onFail) {
					var ret = opts.onFail.call(this);
					if (typeof ret == 'string') { root.innerHTML = ret; }	
				}		
			}	
		}

        // bind a listener to the hash change event and change page if the user changes the page hash parameter
        jQuery(window).bind('hashchange',(function() {
            var page = FLOWPAPER.getLocationHashParameter('page');
            if(page){
                $FlowPaper(viewerId).gotoPage(page);
            }
        }));
		
		// http://flowplayer.org/forum/8/18186#post-18593
		if (IE) {
			window[opts.id] = document.getElementById(opts.id);
		}

		// API methods for callback
		extend(this, {

			getRoot: function() {
				return root;
			},

			getOptions: function() {
				return opts;
			},


			getConf: function() {
				return conf;
			},

			getApi: function() {
				return root.firstChild;
			}

		});
	}

	// setup jquery support
	if (JQUERY) {
		jQuery.fn.flashembed = function(opts, conf) {
			return this.each(function() { 
				jQuery(this).data("flashembed", flashembed(this, opts, conf));
			});
		};

        jQuery.fn.FlowPaperViewer = function(args){
            jQuery('#'+this.attr('id')).empty();

            var embed = new FlowPaperViewerEmbedding(this.attr('id'),args);
            this.element = jQuery('#'+embed.id);
            return this.element;
        };
	}else{
        throw new Error("jQuery missing!");
    }
})();
function getIEversion()
// Returns the version of Internet Explorer or a -1. 
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}


// Initializing PDFJS global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

window.unsupportedPDFJSieversion = getIEversion()>0 && getIEversion()<9;

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
        Uint8Array.prototype.subarray = function subarray(start, end) {
          return new Uint8Array(this.slice(start, end));
        };
        Float32Array.prototype.subarray = function subarray(start, end) {
          return new Float32Array(this.slice(start, end));
        };
    }

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
    }
    return;
  }

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  }

  function setArrayOffset(array, offset) {
    if (arguments.length < 2) {
      offset = 0;
    }
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 0xFF;
    }
  }

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if ('slice' in arg1) {
      result = arg1.slice(0);
    } else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
      }
    }

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }
    return result;
  }

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
})();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  }
})();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' });
      // ... another test for android gb browser for non-DOM objects
//      var Test = function Test() {};
//      Test.prototype = { get id() { } };
//      Object.defineProperty(new Test(), 'id',
//        { value: '', configurable: true, enumerable: true, writable: false });
        eval("var Test = function Test() {};Test.prototype = { get id() { } };Object.defineProperty(new Test(), 'id',{ value: '', configurable: true, enumerable: true, writable: false });");
    } catch (e) {
      definePropertyPossible = false;
    }
    if (definePropertyPossible) {
      return;
    }
  }

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
    }
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
    }
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
        });
        return value;
      });
      obj[name] = def.value;
    }
  };
})();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {}
    });
  }
  if ('responseType' in xhr) {
    return;
  }

  // The worker will be using XHR, so we can save time and disable worker.
  PDFJS.disableWorker = true;

  Object.defineProperty(xhrPrototype, 'responseType', {
    get: function xmlHttpRequestGetResponseType() {
      return this._responseType || 'text';
    },
    set: function xmlHttpRequestSetResponseType(value) {
      if (value === 'text' || value === 'arraybuffer') {
        this._responseType = value;
        if (value === 'arraybuffer' &&
            typeof this.overrideMimeType === 'function') {
          this.overrideMimeType('text/plain; charset=x-user-defined');
        }
      }
    }
  });

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
        } else {
          return this.responseText;
        }
      }
    });
    return;
  }

  Object.defineProperty(xhrPrototype, 'response', {
    get: function xmlHttpRequestResponseGet() {
      if (this.responseType !== 'arraybuffer') {
        return this.responseText;
      }
      var text = this.responseText;
      var i, n = text.length;
      var result = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        result[i] = text.charCodeAt(i) & 0xFF;
      }
      return result.buffer;
    }
  });
})();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  }

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
    }
    return buffer;
  };
})();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  }

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
    }
    return output;
  };
})();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  }

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
    };
    return bound;
  };
})();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  }

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      if (this._dataset) {
        return this._dataset;
      }

      var dataset = {};
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
        }
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
          });
        dataset[key] = attribute.value;
      }

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
      });
      return dataset;
    },
    enumerable: true
  });
})();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  }

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
    }
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
    }
    if (index >= 0 && remove) {
      list.splice(index, 1);
    }
    element.className = list.join(' ');
    return (index >= 0);
  }

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
    },
    contains: function(name) {
      return changeList(this.element, name, false, false);
    },
    remove: function(name) {
      changeList(this.element, name, false, true);
    },
    toggle: function(name) {
      changeList(this.element, name, true, true);
    }
  };

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
      }

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
        }
      });
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
      });
      return classList;
    },
    enumerable: true
  });
})();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  } else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.log);
    console.error = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.error);
    console.warn = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.warn);
  }
})();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
    }
  }
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  }
  if (navigator.userAgent.indexOf('Opera') !== -1) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  }
})();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (navigator.userAgent.indexOf('Trident') >= 0) {
    PDFJS.disableCreateObjectURL = true;
  }
})();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator &&
      /^[a-z]+(-[A-Z]+)?$/.test(navigator.language)) {
    return;
  }
  function formatLocale(locale) {
    var split = locale.split(/[-_]/);
    split[0] = split[0].toLowerCase();
    if (split.length > 1) {
      split[1] = split[1].toUpperCase();
    }
    return split.join('-');
  }
  var language = navigator.language || navigator.userLanguage || 'en-US';
  PDFJS.locale = formatLocale(language);
})();

(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.
  // Support: Safari 6.0+
  var isSafari = Object.prototype.toString.call(
                  window.HTMLElement).indexOf('Constructor') > 0;

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.
  // Support: Android<3.0
  var regex = /Android\s[0-2][^\d]/;
  var isOldAndroid = regex.test(navigator.userAgent);

  if (isSafari || isOldAndroid) {
    PDFJS.disableRange = true;
    PDFJS.disableStream = true;
  }
})();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || navigator.userAgent.indexOf('Android 2.') >= 0) {
    PDFJS.disableHistory = true;
  }
})();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0, ii = this.length; i < ii; i++) {
          this[i] = arr[i];
        }
      };
    }
  } else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (navigator.userAgent.indexOf('Chrom') >= 0) {
      versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
    } else if (navigator.userAgent.indexOf('Android') >= 0) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = /Android\s[0-4][^\d]/g.test(navigator.userAgent);
    } else if (navigator.userAgent.indexOf('Safari') >= 0) {
      versionMatch = navigator.userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
    }

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      contextPrototype._createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = this._createImageData(w, h);
        imageData.data.set = function(arr) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            this[i] = arr[i];
          }
        };
        return imageData;
      };
    }
  }
})();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  }

  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

  if ('requestAnimationFrame' in window) {
    return;
  }
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
})();

(function checkCanvasSizeLimitation() {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = /Android/g.test(navigator.userAgent);
  if (isIOS || isAndroid) {
    // 5MP
    PDFJS.maxCanvasPixels = 5242880;
  }
})();

// Disable fullscreen support for certain problematic configurations.
// Support: IE11+ (when embedded).
(function checkFullscreenSupport() {
  var isEmbeddedIE = (navigator.userAgent.indexOf('Trident') >= 0 &&
                      window.parent !== window);
  if (isEmbeddedIE) {
    PDFJS.disableFullscreen = true;
  }
})();
