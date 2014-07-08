var ThemeManager = (function() {
	"use strict";
	
	function ThemeManager() {
	}
	
	ThemeManager.prototype = {
		current: function(name) {
			if( !arguments.length ) return this._current;
			return true;
		},
		theme: function(name, data) {
		}
	};
	
	
	return ThemeManager;
})();