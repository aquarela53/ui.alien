(function() {
	function evaljson(script) {
		with({}) {
			var fn;
			eval('fn = function() { return ' + script + ';}');
			return fn();
		}
	}
	
	"use strict"

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;
			
			this.loader(function(err, data, type, url, xhr) {
				if( err ) return console.log('[' + this.accessor() + '] load fail', url);
				if( typeof(data) === 'string' && type === 'html' ) {
					this.items($(data).array());
				} else if( type === 'json' ) {
					if( typeof(data) === 'string' ) data = evaljson(data);
					this.items(data);
				} else if( type === 'js' ) {
					var module = require.resolve(data, url);
					if( module && typeof(module.exports) === 'function' ) module.exports(this);
				} else {
					return console.error('[' + this.accessor() + '] unsupported type [' + type + '] of contents', url, data);
				}
			});

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
				removed = this.packed(removed);
				
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
