(function() {
	"use strict";

	function Image(options) {
		if( typeof(options) === 'string' ) options = {src:options};
		this.$super(options);
	}

	Image.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			
			el.on('load', function(e) {
				self.fire('image.load', e);
			});

			el.on('error', function(e) {
				self.fire('image.error', e);
			});

			el.on('abort', function(e) {
				self.fire('image.abort', e);
			});
			
			var o = this.options;
			this.block(o.block);
			this.src(o.src);	
		},
		src: function(src) {
			if( !arguments.length ) return this.el.attr('src');
			
			if( typeof(src) === 'string' ) this.el.attr('src', this.path(src));
			return this;
		},
		block: function(block) {
			if( !arguments.length ) return (this.el.style('display') === 'block');

			if( block === true ) this.el.style('display', 'block');
			else this.el.style('display', false);

			return this;
		}
	};
	
	Image.tag = 'img';
	Image.translator = Component.translator('picture');
	
	return Image = UI.component('picture', Image);
})();
