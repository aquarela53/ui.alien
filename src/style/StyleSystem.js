var StyleSystem = (function() {
	"use strict"

	// define style tags
	var style_global = new StyleSheetManager('attrs.ui.global');
	
	
	// global style
	var global = new Style();
	global.on('changed', function(e) {
		style_global.clear();
		global.build('', style_global);
	});

	return {
		stylesheets: StyleSheetManager,
		global: global
	};
})();
