(function() {
	"use strict"
	
	var UI = require('ui');

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;

			// process options
			var o = this.options;
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');

			this.cmpmap = new Map();

			this.on('added', function(e) {
				var cmp = e.item;
				if( cmp === '-' ) cmp = new UI.Separator({flex:1});
								
				cmp = this.attach(cmp);
				if( cmp ) this.componentByItem(e.item, cmp);
			});

			this.on('removed', function(e) {
				var cmp = this.componentByItem(e.item);
				if( cmp ) cmp.detach();
			});
			
			// call super's build
			this.$super();
		},
		componentByItem: function(item, cmp) {
			if( arguments.length == 1 ) return this.cmpmap.get(item);
			if( item && cmp ) return this.cmpmap.set(item, cmp);
			return null;
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
	
	View.translator = function(el, attrs) {
		var view = new this.View();
		var children = el.children;
		var items = [];
		for(var i=0; i < children.length; i++) {
			this.translate(children[i]);
		}
		
		view.add(items);
		console.log('view', view);
		return view;
	};
	
	View.inherit = UI.Container;
	
	return View = UI.component('view', View);
})();
