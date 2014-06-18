var StackView = (function() {
	// class view
	function StackView(options) {
		this.$super(options);
	}

	StackView.prototype = {
		build: function() {
			var self = this;

			// create sub element 'box', all children will attach to box
			var boxel = this.boxel = this.el.create('<div></div>');
			
			// change attach target
			this.attachTarget(boxel);
			
			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.attachTo(self);
				if( self.length() === 1 ) self.select(e.item);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.$super();
		}
	};
	
	StackView.style = {
		'position': 'relative',
		'display': 'box',
		'box-orient': 'vertical',
		'overflow': 'hidden',
		'box-flex': 1,

		'> div': {
			'box-flex': 1,
			'display': 'box'
		},
		'> div > div': {			
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'top': '0',
			'left': '0'
		}
	};

	return StackView = UI.inherit(StackView, UI.Attachable);
})();

UI.StackView = UI.component('stackview', StackView);