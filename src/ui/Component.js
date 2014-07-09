var Component = (function() { 
	"use strict"
		
	var isElement = $.util.isElement;

	var DOM_EVENTS = [
		'click', 'dblclick', 'applicationmenu', 'blur', 'focus', 
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
		
		// if rebuild component
		var el;
		if( this.el ) {
			el = this.el.restore('first').data('component', false);
		} else {
			if( isElement(o.el) ) el = $(o.el);
			else if( !o.el ) el = $.create((o.tag || cls.tag || 'div'));
			else if( el instanceof $ ) el = o.el;
			else throw new TypeError('illegal type "options.el":' + o.el); 
		}
				
		this.el = el.save('first').data('component', this).attr(o.attrs).classes(this.accessor());
				
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
		
		// setup application & name
		if( o.id ) this.id(o.id);
		if( o.name ) this.name(o.name);
		if( o.origin ) this.origin(o.origin);
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
		if( o.font ) el.font(o.font);
		if( o.color ) el.color(o.color);
		if( o.flex ) el.flex(o.flex);
		if( o['float'] ) this['float'](o['float']);
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
		
		// application
		concrete: function() {
			return this.constructor;
		},
		application: function() {
			return this.constructor.application();
		},
		origin: function(origin) {
			if( !arguments.length ) return this._origin || this.application().origin();
			
			if( typeof(origin) !== 'string' ) return console.error('invalid origin', origin);
			
			this._origin = Path.join(this.application().origin(), origin);
			return this; 
		},
		base: function() {
			return Path.dir(this.origin());
		},
		path: function(src) {
			return Path.join(this.base(), src);
		},
		
		// selector
		finds: function(selector) {
			return null;			
		},
		find: function(selector) {
			return null;
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
			return this.concrete().acceptable();
		},
		attachTarget: function(attachTarget) {
			if( !this.acceptable() ) return null;
			if( !arguments.length ) return this._attachTarget || this.dom();
			
			if( isElement(attachTarget) ) this._attachTarget = attachTarget;
			else console.error('illegal attach target, target must be an element', attachTarget);
			return this;
		},
		attach: function(child, index) {
			var target = this.attachTarget();
			if( !target ) return console.error('component cannot acceptable', this);
			
			if( typeof(child) == 'string' || (!(child instanceof Component) && typeof(child.component) === 'string') ) {
				var cmp = this.application().component(child.component);
				if( !cmp ) return console.error('unknown component [' + child.component + ']');
				child = new cmp(child);
			}
			
			var el;
			
			//console.log('attach', child, (child instanceof Component));
			
			if( child instanceof Component ) el = child.dom();
			else if( child instanceof $ ) el = child[0];
			else el = child;
			
			if( !isElement(el) ) return console.error('illegal child type', child);
			
			if( typeof(index) === 'number' ) {
				var ref = target.children(index);
				if( ref.length ) ref.before(el);
				else $(target).append(el);
			} else { 
				$(target).append(el);
			}
						
			if( child instanceof Component ) {
				var prevp = child._parent;
				if( prevp && prevp._children ) {
					prevp._children = Util.array.removeByItem(prevp._children, child);
				}
				
				child._parent = this;
			} else {
				var $child = $(child);
				
				// element 가 detach 되면 자동으로 child 에서 삭제되도록.
				var self = this;
				var listener = function(e){
					if( e.from === self.dom() ) {
						self._children = Util.array.removeByItem(self._children, this);
						$child.off('detached', listener);
					}
				};
				$child.on('detached', listener);
			}

			if( !this._children ) this._children = [];
			this._children.push(child);
			
			return this;
		},
		attachTo: function(target, index) {
			if( !target ) return console.error('attach target must be a component or dom element', target);
			
			if( isElement(target) ) target = $(target);			
			else if( typeof(target) === 'string' ) target = this.application().find(target) || $(target);
			
			if( target instanceof Component ) {
				target.attach(this, index);
			} else if( target instanceof $ ) {
				var el = this.dom();
				
				if( typeof(index) === 'number' ) {
					var ref = target.children(index);
					if( ref.length ) ref.before(el);
					else target.append(el);
				} else { 
					target.append(el);
				}
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
			return this.concrete().accessor() + themecls;
		},
		classes: function(classes) {
			var el = this.el;
			
			if( !arguments.length ) {
				var accessor = this.accessor().split(' ');
				
				return el.classes().filter(function(item) {
					return !~accessor.indexOf(item);
				}).join(' ');
			}
			
			el.classes(this.accessor());
			if( classes && typeof(classes) === 'string' ) el.ac(classes);
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
			var stylesheet = this.application().stylesheet();

			if( !arguments.length ) return id ? stylesheet.get('#' + id) : null;	
			
			if( typeof(css) === 'object' ) {
				id = id || ('gen-' + (this.concrete().id() || 'nemo') + '-' + (seq++));
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
					var application = self.application();
					var o = eval.call(self, script);
					if( o ) console.log('href script call has result', o);
				})();
			} else if( href.startsWith('this:') ) {
				var path = href.substring(5);
				var application = self.application();
				if( application ) url = application.path(path);
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
			if( !dispatcher ) return console.error('[ERROR] where is event dispatcher?');
			
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
		off: function(action, fn, bubble) {
			if( typeof(action) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', action, fn, bubble);
	
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is event dispatcher?');

			if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action == '*' || action == 'el.*' ) {
				var type = action.startsWith('dom.') ? action.substring(4) : action;
				this.el.un(type, fn.proxy || fn, bubble);
				if( action !== '*' ) return this;
			}

			dispatcher.un.apply(dispatcher, arguments);
			return this;
		},
		fireASync: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fireASync.apply(d, arguments);
		},
		fire: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fire.apply(d, arguments);
		},

		
		// page mapping by url hash
		hash: function(hash, fn) {
			if( arguments.length === 1 && hash === false ) {
				// 다 지움
				var hashset = this._hashset;
				if( !hashset ) return this;
				
				for(var k in hashset) {
					if( !hashset.hasOwnProperty(k) ) continue;
					
					var fn = hashset[k];
					if( fn ) this.off('hash', fn.listener);
					
					hashset[k] = null;
					try { delete hashset[k]; } catch(e) {}
				}
				
				return this;
			} else if( typeof(hash) === 'string' && fn === false ) {
				// 해당 hash 만 지움
				var hashset = this._hashset;
				if( !hashset ) return this;
				
				var fn = hashset[hash];				
				if( fn ) this.off('hash', fn.listener);
								
				hashset[hash] = null;
				try { delete hashset[hash]; } catch(e) {}
				
				return this;
			} else if( typeof(hash) === 'string' && typeof(fn) === 'function' ) {
				// hash 이벤트 등록
				var hashset = this._hashset;
				if( !hashset ) hashset = this._hashset = {};
				
				var listener = (function(hash, fn) {
					return function(e) {
						if( hash === '*' || e.hash === hash ) return fn.call(this, e);
					};
				})(hash, fn);
				
				fn.listener = listener;
				
				this.on('hash', listener);
				
				return this;
			} else {
				return console.error('illegal parameter', hash, fn);
			}
			
			return this;
		},
		
		// misc		
		toJSON: function() {
			var o = this.options.toJSON();

			var json = {
				component: this.concrete().id()
			};

			for(var k in o) {
				if( o.hasOwnProperty(k) ) json[k] = o[k];
			}

			return json;
		},
		destroy: function() {
			this.detach();
			var name = this.name() || '(unknown)';
			var appid = this.application().id();
			this.el.empty().classes(false).attr(false);
			for(var k in this) {
				if( this.hasOwnProperty(k) ) continue;
				var v = this[k];
				this[k] = null;
				try { delete this[k]; } catch(e) {}
				if( typeof(v) === 'function' ) this[k] = function() {throw new Error(appid + ' ui control [' + name + '] was destroyed.');};
			}
		},
		framework: function framework() {
			return Framework;
		},
		debug: function() {
			var cmp = this;
			var concrete = this.concrete();
			var application = this.application();
			console.log('= Instanceof ' + concrete.id() + ':' + concrete.fname() + ' ======================================');
			
			console.log('- Framework');
			console.log('Framework', Framework);
			
			console.log('- Instance');
			console.log('instance', cmp);
			console.log('instance.framework()', cmp.framework());
			console.log('instance.id()', cmp.id());
			console.log('instance.name()', cmp.name());
			console.log('instance.title()', cmp.title());
			console.log('instance.application()', cmp.application());
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
			
			console.log('\n- concrete');
			console.log('concrete', concrete);
			console.log('concrete.acceptable()', concrete.acceptable());
			console.log('concrete.id()', concrete.id());
			console.log('concrete.fname()', concrete.fname());
			console.log('concrete.accessor()', concrete.accessor());
			console.log('concrete.application()', concrete.application());
			console.log('concrete.style()', concrete.style());
			console.log('concrete.source()', concrete.source());
			
			console.log('\n- application');
			console.log('application', application);
			console.log('application.applicationId()', application.applicationId());
			console.log('application.origin()', application.origin());
			console.log('application.base()', application.base());
			console.log('application.accessor()', application.accessor());
			
			console.log('==============================================');
		}
	};
	
	return Component = Class.inherit(Component);
})();



