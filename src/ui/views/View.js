(function() {	
	"use strict"

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			this.loader(this.application().loader());

			// regist event listener
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
				console.log('removed', e.removed);
				var removed = e.removed;
				removed = this.packed(removed);
				
				if( removed instanceof $ ) removed.detach();
				else if( removed instanceof Component ) removed.detach();
				else if( isNode(removed) ) this.attachTarget() && this.attachTarget().removeChild(removed);
			});
			
			// add original element
			$(this.dom()).contents().each(function() {
				self.add(this);
			});
			
			// call super's build
			this.$super();
			
			// process options
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');
		},
		packed: function(item, cmp) {
			var cm = this.cmpmap = this.cmpmap || new Map();
			if( arguments.length == 1 ) return cm.get(item);
			if( item && cmp ) return cm.set(item, cmp);
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
