var Component = (function() { 
	"use strict"
	
	var Util = require('attrs.util');
	var $ = require('attrs.dom');

	var DOM_EVENTS = [
		'click', 'dblclick', 'contextmenu', 'blur', 'focus', 
		'tap', 'dbltap', 'shorttap', 'longtap',
		'touchstart', 'touchmove', 'touchend', 'touchstop',
		'mouseup', 'mousedown', 'mouseover', 'mousemove', 'mouseout', 'mouseout',
		'keyup', 'keydown', 'mousewheel','orientationchange',
		'drag', 'dragstart', 'drop', 'dragover', 
		'swipeleft', 'swiperight',
		'staged', 'unstaged',
		'transition.start', 'transition.stop', 'transition.end',
		'attach', 'attached', 'detach', 'detached'
	];
	
	var seq = 100;
	
	// privates
	function makeup(o) {
		var cls = this.constructor;

		if( o.debug ) this.debug = true;

		// create el
		if( !this.el ) this.el = $.create((o.tag || cls.tag || 'div'), o.attrs);
		else this.el.clear();
		
		// setup el
		var el = this.el.data('component', this).classes(cls.accessor());
		
		// confirm event scope
		var events = o.e || o.events;
		var scope = (events && events.scope) || this;
		if( scope == 'el' ) scope = el;
		else if( scope == 'element' ) scope = el[0];

		// bind event in options
		var dispatcher = this._dispatcher = new EventDispatcher(this, {
			source: (o.e && o.e.source) || this,
			scope: scope
		});

		for(var k in events) {
			var fn = events[k];
			if( typeof(fn) === 'function' ) this.on(k, fn);
		}
		
		/* event listener for mutation events
		$(el).on('detached', function(e) {
			//console.log('detached', this, e.from);			
			var parent = e.from;
			var pcmp = $(e.from).data('component');
			
			var cmp = $(this).data('component');
			console.log('detached', cmp);
			
			if( pcmp && ~pcmp._children.indexOf(cmp) ) {
				pcmp._children = Util.array.removeByItem(pcmp._children, cmp);
			}
			
			cmp._parent = null;
		});
		
		$(el).on('attached', function(e) {
			//console.log('attached', this, e.to);
			var cmp = $(this).data('component');
			console.log('attached', cmp);
		});
		*/
		
		
		// setup context & name
		if( o.id ) this.id(o.id);
		if( o.name ) this.name(o.name);
		if( o.title ) this.title(o.title);
		if( o.classes || o.class ) this.classes(o.classes || o.class);
		if( o.origin ) this.origin(o.origin);

		// setup status
		if( o.hidden ) el.style('display', 'none');
		if( o.movable ) el.movable(o.movable);
		if( o.enable ) this.enable(o.enable);

		// setup style & dom
		if( o.style ) this.style(o.style);
		if( o.css ) this.css(o.css);
		if( o.theme ) this.theme(o.theme);
		if( o.abs ) this.abs(o.abs);
		//if( o.html ) this.html(o.html);

		// href
		if( o.href ) this.href(o.href);
		
		// bg 와 width height font 에 대해서는 편의적 메소드를 제공하기로...
		if( o.bg || o.background ) el.bg(o.bg || o.background);
		if( o.color ) el.color(o.color);
		if( o.flex ) el.flex(o.flex);
		if( o['float'] ) this['float'](o['float']);
		if( o.font ) el.font(o.font);
		if( o.margin ) el.margin(o.margin);
		if( o.padding ) el.padding(o.padding);
		if( o.border ) el.border(o.border);
		if( o.width || o.width === 0 ) el.width(o.width);
		if( o.minWidth || o.minWidth === 0 ) el.minWidth(o.minWidth);
		if( o.maxWidth || o.maxWidth === 0 ) el.maxWidth(o.maxWidth);
		if( o.height || o.height === 0 ) el.height(o.height);
		if( o.minHeight || o.minHeight === 0 ) el.minHeight(o.minHeight);
		if( o.maxHeight || o.maxHeight === 0 ) el.maxHeight(o.maxHeight);

		if( o.fit ) el.ac('fit');

		// setup effects options
		if( o.effects ) this.effects(o.effects);
		
		// invoke class's build & options build
		if( typeof(o.before) === 'function' ) o.before.call(this);
		if( typeof(this.build) === 'function' ) this.build();
		if( typeof(o.build) === 'function' ) o.build.call(this);
		if( typeof(o.after) === 'function' ) o.after.call(this);

		// block build method
		this.build = function() { throw new Error('illegal access'); };
	}
	

	// class Component
	function Component(options) {
		this.options = new Options(options);
		makeup.call(this, this.options);
	}

	Component.prototype = {
		rebuild: function(options) {
			if( typeof(options) === 'object' ) this.options = new Options(options);
			makeup.call(this, this.options);
			this.fire('rebuilt');
			return this;
		},
		
		// major attributes
		id: function(id) {
			if( !arguments.length ) return this.el.attr('id');
			this.el.attr('id', id);
			return this;
		},
		name: function(name) {
			if( !arguments.length ) return this.el.attr('name');			
			this.el.attr('name', name);
			return this;
		},
		title: function(title) {
			if( !arguments.length ) return this.el.attr('title');
			this.el.attr('title', title);
			return this;
		},
		
		// context
		getClass: function() {
			return this.constructor;
		},
		context: function() {
			return this.constructor.context();
		},
		base: function() {
			return this.constructor.context().base();
		},
		path: function(src) {
			return this.constructor.context().path(src);
		},
		
		// attach
		parent: function() {
			return this._parent;
		},
		children: function() {
			if( !this._children ) this._children = [];
			return this._children.slice();
		},
		acceptable: function() {
			if( typeof(this._acceptable) === 'boolean' ) return this._acceptable;
			return this.constructor.acceptable();
		},
		attachTarget: function(attachTarget) {
			if( !this.acceptable() ) return null;
			if( !arguments.length ) return this._attachTarget || this.dom();
			
			if( $.isElement(attachTarget) ) this._attachTarget = attachTarget;
			else console.error('illegal attach target, target must be an element', attachTarget);
			return this;
		},
		attach: function(child, index) {
			var target = this.attachTarget();
			if( !target ) return console.error('component cannot acceptable', this);
			
			if( typeof(child) == 'string' || (!(child instanceof Component) && typeof(child.component) === 'string') ) {
				child = this.context().build(child);
			}
			
			var el;
			
			//console.log('attach', child, (child instanceof Component));
			
			if( child instanceof Component ) el = child.dom();
			else if( child instanceof $.EL ) el = child[0];
			else return console.error('illegal child', child);
			
			if( !$.isElement(el) ) return console.error('illegal child type', child);
			$(target).attach(el, index);
						
			if( child instanceof Component ) {
				var prevp = child._parent;
				if( prevp && prevp._children ) {
					prevp._children = Util.array.removeByItem(prevp._children, child);
				}
				
				child._parent = this;
			} else {
				child = $(child);
				
				// element 가 detach 되면 자동으로 child 에서 삭제되도록.
				var self = this;
				var listener = function(e){
					self._children = Util.array.removeByItem(self._children, $(this));
					child.un('detached', listener);
				};
				child.on('detached', listener);
			}

			if( !this._children ) this._children = [];
			this._children.push(child);
			
			return child;
		},
		attachTo: function(target, index) {
			if( !target ) return console.error('attach target must be a component or dom element', target);
			
			if( $.isElement(target) ) target = $(target);			
			else if( typeof(target) === 'string' ) target = this.context().find(target) || $(target);
			
			if( target instanceof Component ) {
				target.attach(this, index);
			} else if( target instanceof $.EL ) {
				target.attach(this.dom(), index);
			} else {
				console.error('illegal target(available only Element or EL or Component)', target);
			}

			return this;
		},
		detach: function() {
			this.el.detach();
			var prevp = this._parent;
			if( prevp && prevp._children ) {
				prevp._children = Util.array.removeByItem(prevp._children, this);
			}
			this._parent = null;
			return this;
		},

		// dom control
		dom: function() {
			return this.el[0];
		},
		accessor: function() {
			var themecls = this._theme || '';
			if( themecls ) themecls = ' theme-' + themecls;
			return this.constructor.accessor() + themecls;
		},
		classes: function(classes) {
			var el = this.el;
			
			if( !arguments.length ) {
				var accessor = this.accessor().split(' ');
				
				return el.classes().split(' ').filter(function(item) {
					return !~accessor.indexOf(item);
				}).join(' ');
			}
			
			el.classes(this.accessor()).ac(classes);
			return this;
		},
		ac: function(classes) {
			this.el.ac(classes);
			return this;
		},
		rc: function(classes) {
			this.el.rc(classes);
			return this;
		},
		is: function(classes) {
			return this.el.is(classes);
		},
		attr: function() {
			this.el.attr.apply(this.el, arguments);
			return this;
		},		
		theme: function(theme) {
			if( !arguments.length ) return this._theme || '';
			
			var cls = this.classes();
			
			if( typeof(theme) === 'string' ) this._theme = theme;
			else return console.error('invalid theme name', theme);

			this.classes(cls);

			return this;
		},
		style: function(key, value) {
			if( !arguments.length ) return this.el.style();
			if( arguments.length === 1 && typeof(key) === 'string' ) return this.el.style(key);

			this.el.style.apply(this.el, arguments);
			return this;
		},
		css: function(css) {
			var el = this.el;
			var id = el.id();
			var stylesheet = this.context().stylesheet();

			if( !arguments.length ) return id ? stylesheet.get('#' + id) : null;	
			
			if( typeof(css) === 'object' ) {
				id = id || ('gen-' + (this.constructor.cmpname || 'nemo') + '-' + (seq++));
				el.id(id);
				stylesheet.update('#' + id, css);
				if( css.debug ) console.log('#' + id, stylesheet.build());
			} else if( css === false ) {				
				if( id ) {
					stylesheet.remove(id);
					el.id(false);
				}
			} else {
				console.warn('invalid css', css);
			}

			return this;
		},
		_abs: function(abs) {
			var el = this.el;
			if( !arguments.length ) return el.is('abs');
			
			el.rc('abs').rc('top').rc('right').rc('left').rc('bottom');

			if( abs !== false ) {
				this.el.ac('abs');
			}
			
			if( typeof(abs) === 'string' ) {
				if( ~abs.indexOf('top') ) el.ac('top');
				if( ~abs.indexOf('left') ) el.ac('left');
				if( ~abs.indexOf('right') ) el.ac('right');
				if( ~abs.indexOf('bottom') ) el.ac('bottom');
			}

			return this;
		},
		html: function(html) {
			if( !arguments.length ) return this.el.html();			
			if( typeof(html) === 'string' ) this.el.html(html);
			return this;
		},
		show: function(options, fn) {
			this.el.show(options, fn);
			return this;
		},
		hide: function(options, fn) {
			this.el.hide(options, fn);
			return this;
		},
		anim: function(options, scope) {
			return this.el.anim(options, scope || this);
		},
		effect: function(type, options) {
			var listeners = this._effect_listeners;
			if( !listeners ) listeners = this._effect_listeners = {};

			if( !arguments.length ) return console.error('[WARN] illegal parameters', type, options);
			if( arguments.length === 1 ) return listeners[type];

			if( options === false ) {
				listeners[type] = null;
				try { delete listeners[type]; } catch(e) {}
			}

			if( typeof(options) !== 'object' ) return console.error('[WARN] invalid animation options', options);
			var fn = (function(options) {
				return function(e) {
					this.el.anim().chain(options).run();
				};
			})(options);
			listeners[type] = fn;
			this.on(type, fn);

			return true;
		},
		effects: function(effects) {
			for(var type in effects) {
				this.effect(type, effects[type]);
			}
			return true;
		},
		disable: function(b) {
			return this.enable(b === false ? true : false);
		},
		enable: function(b) {
			var el = this.el;
			if( b === false ) {
				if( !el.is('disabled') ) {
					el.ac('disabled');
					this.fire('disabled');
				}
			} else {
				if( el.is('disabled') ) {
					el.rc('disabled');
					this.fire('enabled');
				}
			}
			return this;
		},
		boundary: function() {
			return this.el.boundary();
		},
		data: function(key, value) {
			var data = this._data;
			if( !arguments.length ) return data;
			else if( arguments.length == 1 ) return data && data[k];

			if( !data ) data = this._data = {};
			data[key] = value;
			return this;
		},

		// href
		action: function(href) {
			if( !href ) return false;

			var href = href.trim();
			if( href.toLowerCase().startsWith('javascript:') ) {
				var script = href.substring(11);
				var self = this;
				(function() {
					var context = self.context();
					var o = eval.call(self, script);
					if( o ) console.log('href script call has result', o);
				})();
			} else if( href.startsWith('this:') ) {
				var path = href.substring(5);
				var context = self.context();
				if( context ) url = context.path(path);
				location.href = path;
			} else {
				location.href = href;
			}

			return true;
		},
		href: function(href) {
			if( !arguments.length ) return this._href;

			this._href = href;
			if( this._hrefhandler ) this.un('click', this._hrefhandler);
			
			if( href && typeof(href) === 'string' ) {
				var self = this;
				this._hrefhandler = function(e) {
					self.action.call(self, self._href);
				};
				this.on('click', this._hrefhandler);
				this.el.ac('clickable');
			} else {
				this.el.rc('clickable');
				this._href = null;
				try { delete this._href; } catch(e) {}
			}

			return this;
		},

		// event handle
		on: function(action, fn, bubble) {
			if( typeof(action) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', action, fn, bubble);
			
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is displatcher?');
			
			// if action is dom element event type, binding events to dom element
			if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action === '*' || action === 'dom.*' ) {
				var type = action.startsWith('dom.') ? action.substring(4) : action;
				var self = this;
				var proxy = function(e) {
					return fn.call(self, e);
				};
				fn.proxy = proxy;
				this.el.on(type, proxy, bubble);
				if( action !== '*' ) return this;
			}
	
			dispatcher.on.apply(dispatcher, arguments);
			return this;
		},
		un: function(action, fn, bubble) {
			if( typeof(action) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', action, fn, bubble);
	
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is displatcher?');

			if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action == '*' || action == 'el.*' ) {
				var type = action.startsWith('dom.') ? action.substring(4) : action;
				this.el.un(type, fn.proxy || fn, bubble);
				if( action !== '*' ) return this;
			}

			dispatcher.un.apply(dispatcher, arguments);
			return this;
		},
		fireSync: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fireSync.apply(d, arguments);
		},
		fire: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fire.apply(d, arguments);
		},
		toJSON: function() {
			var o = this.options.toJSON();

			var json = {
				component: this.constructor.id()
			};

			for(var k in o) {
				if( o.hasOwnProperty(k) ) json[k] = o[k];
			}

			return json;
		},
		destroy: function() {
			this.detach();
			var ns = this.constructor.namespace;
			var name = this.name() || '(unknown)';
			var context = this.context();
			if( context ) context.disconnect(this);
			this.el.clear();
			for(var k in this) {
				if( this.hasOwnProperty(k) ) continue;
				var v = this[k];
				this[k] = null;
				try { delete this[k]; } catch(e) {}
				if( typeof(v) === 'function' ) this[k] = function() {throw new Error(ns + ' ui control [' + name + '] was destroyed.');};
			}
		},
		framework: function framework() {
			return Framework;
		},
		debug: function() {
			var cmp = this;
			var clazz = this.getClass();
			var context = this.context();
			console.log('= Instanceof ' + clazz.fname() + ' ======================================');
			
			console.log('- Framework');
			console.log('Framework', Framework);
			
			console.log('- Instance');
			console.log('instance', cmp);
			console.log('instance.framework()', cmp.framework());
			console.log('instance.id()', cmp.id());
			console.log('instance.name()', cmp.name());
			console.log('instance.title()', cmp.title());
			console.log('instance.context()', cmp.context());
			console.log('instance.parent()', cmp.parent());
			console.log('instance.children()', cmp.children());
			console.log('instance.acceptable()', cmp.acceptable());
			console.log('instance.attachTarget()', cmp.attachTarget());
			console.log('instance.base()', cmp.base());
			console.log('instance.path("dir/file.ext")', cmp.path('dir/file.ext'));
			console.log('instance.dom()', cmp.dom());
			console.log('instance.style()', cmp.style());
			console.log('instance.accessor()', cmp.accessor());
			console.log('instance.classes()', cmp.classes());
			
			console.log('\n- class');
			console.log('class', clazz);
			console.log('class.acceptable()', clazz.acceptable());
			console.log('class.id()', clazz.id());
			console.log('class.fname()', clazz.fname());
			console.log('class.accessor()', clazz.accessor());
			console.log('class.context()', clazz.context());
			console.log('class.style()', clazz.style());
			console.log('class.source()', clazz.source());
			
			console.log('\n- context');
			console.log('context', context);
			console.log('context.id()', context.id());
			console.log('context.src()', context.src());
			console.log('context.base()', context.base());
			console.log('context.accessor()', context.accessor());
			console.log('context.parent()', context.parent());
			
			console.log('==============================================');
		}
	};
	
	return Component = Class.inherit(Component);
})();



