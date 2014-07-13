(function() {
	"use strict";

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			// call super's build
			this.$super();
			
			// process options
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');
		},
		direction: function(direction) {
			var el = this.el;

			if( !arguments.length ) return this.el.is('horizontal') ? 'horizontal' : 'vertical';
			
			if( direction === 'horizontal' ) el.rc('vertical').ac('horizontal');
			else if( direction === 'vertical' )  el.ac('vertical').rc('horizontal');
			else return console.error('invalid direction', direction);

			this.fire('view.direction changed', {
				direction: (el.is('horizontal') ? 'horizontal' : 'vertical')
			});

			return this;
		},
		
		// override
		items: function(items) {
			if( typeof(items) === 'string' && !$.util.isHtml(items) ) {
				items = this.load(items);
			} else if( typeof(items) === 'function' ) {
				items.call(this.application(), this);
				return this;
			}
			
			return this.$super(items);			
		}
	};
	
	View.style = {
		'position': 'relative',
		'display': 'flex',
		'flex-direction': 'column',
		'align-content': 'stretch',
		
		'..horizontal': {
			'flex-direction': 'row'
		}
	};
	
	View.translator = Container.translator('view', function() {
		return this.__aui__ || this;
	});
	
	View.inherit = 'block';
	
	return View = UI.component('view', View);
})();
