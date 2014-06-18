UI.Splitter = (function() {
	"use strict"

	function Splitter(options) {
		this.$super(options);
	}

	Splitter.prototype = {
		build: function() {
			var self = this;
			
			var o = this.options;
			this.tickness( o.tickness || o.size );

			this.on('connectTo', function(e) {
				if( !(e.parent instanceof UI.BoxView) ) {
					console.error('WARN:Splitter can attach only BoxView');
					return false;
				}
			});

			this.on('connectedTo', function(e) {
				self.refresh();

				e.parent.on('boxview.direction', function(e) {
					self.refresh();				
				});
			});
		},
		refresh: function() {
			var el = this.el;
			var view = this.parent();
			if( view ) {
				if( view.direction() === 'horizontal' ) {
					el.style('max-width', this.tickness() + 'px');
					el.style('min-width', this.tickness() + 'px');
					el.style('width', this.tickness() + 'px');
					el.style('cursor', 'w-resize');
				} else if( view.direction() === 'vertical' ) {
					el.style('max-height', this.tickness() + 'px');
					el.style('min-height', this.tickness() + 'px');
					el.style('height', this.tickness() + 'px');
					el.style('cursor', 'n-resize');
				}
			}
		},
		tickness: function(thickness) {
			if( !arguments.length ) return this._tickness || 3;

			thickness = parseInt(thickness);
			if( !isNaN(thickness) ) this._thickness = tickness;
			this.refresh();
		}
	};
	
	Splitter.style = {		
		'background': 'transparent'
	};
	
	return Splitter = UI.inherit(Splitter, UI.Component);
})();

UI.Splitter = UI.component('splitter', UI.Splitter);