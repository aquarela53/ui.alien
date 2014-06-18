var CardView = (function() {
	// class view
	function CardView(options) {
		this.$super(options);
	}

	CardView.prototype = {
		build: function() {
			var self = this;
			
			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.hide();
				e.item.attachTo(self);
				if( self.length() === 1 ) self.select(e.item);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.on('selected', function(e) {
				e.item.show();
			});

			this.on('deselected', function(e) {
				e.item.hide();
			});

			this.$super();
			
			var o = this.options;
			if( o.selected || o.selected === 0 ) {
				this.select(o.selected);
			}
		}
	};
	
	CardView.inherit = '';
	CardView.style = {
		'position': 'relative',
		'background-color': 'transparent',
		'overflow': 'hidden',
		'width': '100%',
		'height': '100%'
	};
	
	return CardView = UI.inherit(CardView, UI.SingleSelectableContainer);
})();

UI.CardView = UI.component('cardview', CardView);