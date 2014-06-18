(function() {
	"use strict"
	
	var HashController = require('hash');
	var Util = require('util');
	var $ = require('dom');
	
	// regist default tag handler
	var DefaultTagHandler = function(cls, el, attrs) {
		return attrs;
	};
	
	var Context = (function() {
		var seq = 0;

		function Context(src) {			
			if( typeof(src) !== 'string' ) throw new Error('invliad src:' + src);
						
			this._id = 'ctx-' + (seq++);
			this._src = src;
			this._uri = Path.uri(src);
			this._accessor = 'aui ctx-' + this._id;
			this._children = [];
			this._tagtranslator = new TagTranslator(this);
			
			this._cmps = {};
			this._instances = [];
		
			this.Component = Context.Component;
			this.Container = Context.Container;
			
			this._dispatcher = new EventDispatcher(this);
		}

		Context.prototype = {
			id: function() {
				return this._id;
			},
			owner: function(owner) {
				if( !arguments.length ) return this._owner;
				
				if( owner instanceof Component ) this._owner = owner;
				else if( owner instanceof $.EL ) this._owner = owner;
				else if( $.isElement(owner) ) this._owner = $(owner);
				else return console.error('unsupported owner type', owner);
				
				return this;
			},
			accessor: function() {
				return this._accessor;
			},
			src: function() {
				return this._src;
			},
			uri: function() {
				return this._uri;
			},
			path: function(path) {
				return Path.join(this.base(), path);
			},
			base: function() {
				return Path.dir(this.uri());
			},
			
			// event support
			on: function() {
				var d = this._dispatcher;
				d.on.apply(d, arguments);
				return this;
			},
			un: function() {
				var d = this._dispatcher;
				d.un.apply(d, arguments);
				return this;
			},
			has: function() {
				var d = this._dispatcher;
				d.has.apply(d, arguments);
				return this;
			},
			fire: function() {
				var d = this._dispatcher;
				if( !d ) return;
				return d.fireSync.apply(d, arguments);
			},
			
			// page mapping by url hash
			pages: function(mapping, fn) {
				if( !this._pages ) this._pages = {};
				var self = this;
				this._pages.propagation = function(hash) {
					(this[hash] || function() {}).call(self, {
						hash: hash
					});
				};
				
				if( !arguments.length ) return this._pages;
				if( arguments.length === 1 && typeof(mapping) === 'string' ) return this._pages[mapping];
				
				if( typeof(mapping) === 'string' && typeof(fn) == 'function' ) {
					var name = mapping;
					mapping = {};
					mapping[name] = fn;				
				}
				
				if( typeof(mapping) !== 'object' ) return console.error('page mapping must be an object');
								
				this._pages = Util.merge(this._pages, mapping);
				
				return this;
			},
			
			// theme & components
			theme: function(name) {
				if( !this._themes ) this._themes = {};

				var themes = this._themes;
				var theme = themes[name];
				if( !theme ) theme = themes[name] = new Theme(this, name);				
				
				return theme;
			},
			themes: function() {
				if( !this._themes ) return null;
				
				var args = [];
				var themes = this._themes;
				for(var k in themes) 
					if( k && themes.hasOwnProperty(k) ) args.push(k);					
				
				return args;
			},
			stylesheet: function() {
				if( !this._stylesheet ) this._stylesheet = new StyleSheetManager('attrs.ui.' + this.id() + '.instances');
				return this._stylesheet;
			},
			componentIds: function() {				
				var args = [];
				var cmps = this._cmps;
				for(var k in cmps) 
					if( k && cmps.hasOwnProperty(k) ) args.push(k);					
				
				return args;
			},
			
			// define ui component
			component: function(id, cls, instantiatable) {
				if( typeof(id) !== 'string' || ~id.indexOf('.') ) return console.error('illegal component id:' + id);			
				if( arguments.length === 1 ) {
					var cmp = this._cmps[id];					
					if( cmp ) return cmp;
					
					var pcmp = local.component(id);
					if( pcmp ) cls = pcmp.source();
					
					if( !cls )return console.error('[WARN] cannot found component:' + id);
				}
				
				if( typeof(cls) === 'string' ) cls = require(cls);
				if( typeof(cls) !== 'function' ) return console.error('[WARN] invalid component class:' + id, cls);
				
				var inherit = cls.inherit;
				
				if( cls.hasOwnProperty('inherit') && !inherit ) return console.error('invalid inherit, unkwnown \'' + inherit + '\'', cls);
				
				if( typeof(inherit) === 'string' ) inherit = this.component(inherit);
								
				var self = this;
				var fname = cls.name || Util.camelcase(id);
				var superclass = inherit || this.Component;
				
				if( !superclass ) return console.error('illegal state, cannot find superclass', superclass, this.Component);
				
				var cmp = Class.inherit(cls, superclass, ((instantiatable === false) ? false: true) );
				var style = null;	//this.theme().component(id).reset(cls.style);
				var acceptable = cls.acceptable;
				acceptable = (acceptable === false) ? false : true;
				
				var ids = [id];
				for(var c = cmp;c = c.superclass();) {
					if( typeof(c.id) === 'function' ) {
						if(c.id()) ids.push(c.id());
					}
					
					if( typeof(c.acceptable) === 'function' && !c.acceptable() ) acceptable = false;
					if( !c.superclass ) break;
				}
				
				var accessor = (this.accessor() + ' ' + ids.reverse().join(' ')).trim();
				
				cmp.source = function() {
					return cls;
				};
				cmp.context = function() {
					return self;
				};
				cmp.id = function() {
					return id;
				};
				cmp.style = function() {
					return style;
				};
				cmp.accessor = function() {
					return accessor;
				};
				cmp.acceptable = function() {
					return acceptable;
				};
				cmp.theme = function(themeId) {
					return self.theme(themeId).component(id);
				};
				cmp.fname = function() {
					return fname;
				};
				
				this._cmps[id] = cmp;				
				if( fname ) {
					if( this[fname] ) {
						console.warn('component fname conflict, so overwrited. before=', this[cmp.fname()], '/after=', cmp);
					} else {
						this[fname] = cmp;
					}
				} else {
					console.warn('function name was empty', fname);
				}
				
				if( debug('ui') ) {
					console.info('[' + this.id() + '] component registerd', '[' + cmp.id() + ',' + fname + ']', Util.outline(cmp));
				}
					
				this.fire('component.registered', {
					component: cmp
				});

				return cmp;
			},
			
			// inspects DOM Elements for translates as component
			translator: function(selector, fn) {
				var translator = this._tagtranslator;
				
				if( !arguments.length ) return translator;
				if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('invalid parameter(string, function)', arguments);
					
				translator.add(selector, fn);
				return this;
			},
			translate: function(el) {
				this._tagtranslator.translate(el);
				return this;
			},
			
			// load remote component or application through new ui context
			load: function(source) {
				if( !source ) return console.error('invalid source', source);
				
				if( typeof(source) === 'string' ) {
					var path = this.path(source);				
					var source = Require.sync(path);
				}
				
				if( $.isElement(source) ) {
					
				} else {
					
				}
			},
						
			// translate from ui json to component
			build: function(source) {
				if( $.isElement(source) || typeof(source) === 'string' ) {
					source = {
						component: 'html',
						html: source
					};
				} else if( !source || typeof(source) !== 'object' || typeof(source.component) !== 'string' ) {
					return console.error('source must be \'ui json\'', source);
				}
				
				var cmp = this.component(source.component);
				if( !cmp ) return console.error('unknown component [' + source.component + ']');
				var instance = new cmp(source);
								
				this.fire('build', {
					instance: instance
				});
				
				return instance;
			},
			
			// component selector
			find: function(qry) {			
				return null;
			},
			finds: function(qry) {
				return null;
			},
			each: function(fn, scope) {
				if( typeof(fn) !== 'function' ) throw new Error('illegal arguments. fn must be a function:' + fn);
				var scope = scope || this;
				
				var instances = this.all();
				for( var i=0; i < instances.length; i++ ) {
					var cmp = instances[i];

					if( fn.call(scope, cmp) === false ) return false;
				}

				return true;
			},
			destroy: function() {
				var src = this.src();
				var id = this.id();
				for(var k in this) {
					var v = this[k];
					this[k] = null;
					try { delete this[k]; } catch(e) {}
				}
				if( this.__proto__ ) this.__proto__ = null;
			}
		};
		
		return Context = Class.inherit(Context);
	})();
	
	// setup component impl
	Context.Component = Component;
	Context.Container = Container;
	
	// define local context class
	var LocalContext = (function() {
		function LocalContext() {
			this.$super(location.href);
			this._id = 'local';
			this._accessor = 'aui ctx-local';
		}
	
		return LocalContext = Class.inherit(LocalContext, Context);
	})();
	
	// regist hash control	
	HashController.regist(function(hash, location) {
		local.pages().propagation(hash);
	});

	// create & export root context
	var local = new LocalContext();
	var current = local;

	Context.context = function context() {		
		return current;
	};

	Context.component = function component() {
		var cmp = local.component.apply(local, arguments);
		if( cmp ) {
			if( Context[cmp.fname()] ) console.warn('global component fname conflict, so overwrited. before=', Context[cmp.fname()], '/after=', cmp);
			Context[cmp.fname()] = cmp;
		}
		return this;
	};
	
	define('ui', function(module) {
		module.exports = Context;
	});

	// attach document.body inspecting
	if( Framework.parameters['tagtranslate'].toLowerCase() !== 'false' ) {
		if( debug('ui') ) console.log('tag translation on');
		
		require('dom').on('ready', function(e) {
			local.owner(document.body);
			local.fire('load');
			
			// invoke current hash
			HashController.invoke();
		});
	}
})();

