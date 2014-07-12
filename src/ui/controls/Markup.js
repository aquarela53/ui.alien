(function() {
	"use strict";
	
	function Markup(options) {
		if( typeof(options) === 'string' ) options = {items:[options]};
		this.$super(options);
	}
	
	Markup.inherit = 'view';
	Markup.fname = 'Markup';
	Markup.translator = Component.translator('markup');
		
	return Markup = UI.component('markup', Markup);
})();
