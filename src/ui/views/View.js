(function() {
	"use strict"

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
				var added = e.added;
				if( added === '-' ) added = new UI.Separator({flex:1});
				
				var packed;
				if( o.translation !== false ) {
					packed = this.application().pack(added);
				}
				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var removed = e.removed;
				removed = this.byItem(removed);
				
				if( removed instanceof $ ) removed.detach();
				else if( removed instanceof Component ) removed.detach();
				else if( isElement(removed) ) this.attachTarget() && this.attachTarget().removeChild(removed);
			});
			
			// call super's build
			this.$super();
		},
		packed: function(item, cmp) {
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
	
	View.translator = function(el, options) {
		var view = new this.View(options);
		var children = el.childNodes;
		var items = [];
		
		for(var i=0; i < children.length; i++) {
			var c = children[i];
			var cmp = c.__aui__;
			if( cmp ) items.push(cmp);
			else items.push(c);
		}
		
		view.add(items);
		return view;
	};
	
	View.inherit = UI.Container;
	
	return View = UI.component('view', View);
})();
