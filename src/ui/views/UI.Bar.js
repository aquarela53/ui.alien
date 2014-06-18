var Bar = (function() {
	"use strict"

	function Bar(options) {
		if( options.cellborder !== false ) options.cellborder = true;
		if( options.vertical !== true ) options.horizontal = true;
		if( options.flexible !== false ) options.flexible = true;

		this.$super(options);
	}

	Bar.prototype = {
		build: function() {
			this.$super();
		}
	};

	Bar.style = {
		'min-width': 20,
		'min-height': 20
	};

	return Bar = UI.inherit(Bar, UI.View);
})();

UI.Bar = UI.component('bar', Bar);