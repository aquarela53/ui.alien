UI.Space = (function() {
	"use strict"

	function Space(options) {
		this.$super(options);
	}

	Space.prototype = {
		build: function() {
			var o = this.options;
			if( o.size || o.size === 0 ) this.size(o.size);
		},
		size: function(size) {
			if( !arguments.length ) return this._size;

			this.el.width(size || false);
			this.el.height(size || false);
		}
	};

	Space.style = {
		'background': 'transparent'
	};

	return Space = UI.inherit(Space, UI.Component);
})();

UI.Space = UI.component('space', UI.Space);