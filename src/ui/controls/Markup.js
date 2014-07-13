(function() {
	"use strict";
	
	function Markup(options) {
		if( typeof(options) === 'string' ) options = {html:[options]};
		else if( isElement(options) ) options = {el:options};
		
		this.$super(options);
	}
	
	Markup.prototype = {
		build: function() {
			var o = this.options;
			if( o.html ) this.html(o.html);	
		},
		html: function(html) {
			this.el.empty();
			if( html ) this.el.append(this.application().pack(html));
			return this;
		},
		src: function(src) {
			var result = this.application().load(src);
			this.el.empty().append(this.application.pack(result));
			return this;
		}
	};
	
	Markup.fname = 'Markup';
	Markup.translator = Component.translator('markup');
	
	return Markup = UI.component('markup', Markup);
})();
