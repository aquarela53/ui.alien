(function() {
	"use strict"
	
	var HashController = require('attrs.hash');
	var Util = require('attrs.util');
	var $ = require('attrs.dom');
	var Path = require('path');
	var CONTEXTS = [];
	var DefaultContext;
		
		
	// class Context
	var Context = (function() {
		var seq = 0;

		function Context(src) {			
			if( !src ) throw new Error('error:src cannot be null:' + src);
			
			src = Path.join(location.href, src);
						
			this._id = 'ctx-' + (seq++);
			this._src = src;
			this._uri = Path.uri(src);
			this._accessor = 'aui ' + this._id;
			this._children = [];
			this.translator = new TagTranslator(this);
			
			this._cmps = {};
			this._instances = [];
		
			this.Component = Context.Component;
			this.Container = Context.Container;
			
			this._dispatcher = new EventDispatcher(this);
			
			for(var k in BUNDLES.translators) {
				this.tag(k, BUNDLES.translators[k]);
			}
			
			for(var k in BUNDLES.components) {
				this.component(k, BUNDLES.components[k]);
			}
			
			if(src === location.href) {
				var self = this;
				
				this._id = 'ctx-local';
				this._accessor = 'aui ' + this._id;
				
				$.on('DOMContentLoaded', function(e) {					
					var translation = true;
					if( Framework.parameters['tagtranslate'].toLowerCase() === 'false' ) {
						if( debug('ui') ) console.log('tag translation on');
						translation = false;
					}
					self.content(document.body, translation);
				});
			} else {
				this.content(src, true);
			}
			
			CONTEXTS.push(this);
		}

		Context.prototype = {
			id: function() {
				return this._id;
			},
			content: function(content, translation) {
				if( !arguments.length ) return this._content;
				
				if( !content ) return console.error('null content', content);
				
				var self = this;
				var resolve = function(content) {
					self.fire('prepare');						
					self._content = content;
					if( $.util.isElement(content) ) self.translate(content);
					self.fire('ready', {
						content: content
					});
				};
				
				if( typeof(content) === 'string' ) {
					current = this;					
					Ajax.get(content).done(function(err, data) {
						current = DefaultContext;
						if( err ) return console.error('content "' + content + '" load failure', err);
						
						resolve(data);
					});
				} else if( $.util.isElement(content) ) {
					setTimeout(function() {
						resolve(content);
					}, 1);
				} else {
					return console.error('unsupported content type', content);
				}
				
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
			ready: function(fn) {
				this.on('ready', fn);	
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
			component: function(id, cls) {
				if( typeof(id) !== 'string' || ~id.indexOf('.') ) return console.error('illegal component id:' + id);			
				if( arguments.length === 1 ) {
					var cmp = this._cmps[id];					
					if( cmp ) return cmp;
					
					var pcmp = local.component(id);
					if( pcmp ) cls = pcmp.source();
					
					if( !cls ) return console.error('[WARN] cannot found component:' + id);
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
				
				var cmp = Class.inherit(cls, superclass );
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
				
				
				// reserve
				if( false ) {
					var parser = new less.Parser({});
					parser.parse(Ajax.get('login/login.less'), function (err, root) { 
						if( err ) return console.error(err);
						console.log(root);
					   	var css = root.toCSS(); 
						console.log(css);
					});
				}
				
				
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
				
				if( cls.translator ) {
					this.tag(id, cls.translator);
				}
				
				cmp.translator = function() {
					return cls.translator;
				};
				
				this.fire('component', {
					component: cmp
				});

				return cmp;
			},
			
			// inspects DOM Elements for translates as component
			tag: function(selector, fn) {
				if( !arguments.length ) return translator;
				
				var translator = this.translator;				
				if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('invalid parameter(string, function)', arguments);

				var self = this;
				this.translator.add(selector, function() {
					var result = fn.apply(self, arguments);
					if( result instanceof Component ) return result.dom();
					return result;
				});
				return this;
			},
			translate: function(el) {
				this.translator.translate(el);
				return this;
			},
			
			// load remote component or application through new ui context
			load: function(src) {
				if( !src ) return console.error('invalid src', src);				
				return new Context(src);
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
				var index = CONTEXTS.indexOf(this);
				if( ~index ) CONTEXTS.splice(index, 1);
				
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
	
		Context.Component = Component;
		Context.Container = Container;
		
		Context.contexts = function contexts() {
			return CONTEXTS;
		};
		
		var BUNDLES = {
			components: {},
			translators: {}
		};
		
		Context.component = function component(id, cls) {
			if( typeof(id) !== 'string' || typeof(cls) !== 'function' ) return console.error('invalid parameter', id, cls);
			
			BUNDLES.components[id] = cls;
			CONTEXTS.forEach(function(context) {
				context.component(id, cls);
			});
		};
		
		Context.translator = function(selector, fn) {
			if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('invalid parameter', selector, fn);
			
			BUNDLES.translators[selector] = fn;
			
			CONTEXTS.forEach(function(context) {
				context.tag(selector, fn);
			});
		};
		
		var current;
		Context.current = function context() {
			return current || DefaultContext;
		};
		
		return Context;
	})();
	
	// initializing default context
	var local = DefaultContext = new Context(location.href);
	
	// regist bundle translators
	// <page hash="test">
	// 	<action type="import" target="#content" src="html/page.html"></action>
	// </page>
	Context.translator('page', function(el, attrs) {
		var ctx = this;
	
		var hash = attrs.hash;
		if( typeof(hash) !== 'string' ) return console.warn('attributes "hash" required', el);
	
		ctx.pages(hash, function(e) {
			var actions = $(target).children('action');
			
			console.log('actions', actions);
			
			var target = attrs.target;
			var src = attrs.src;
			if( typeof(target) !== 'string' ) return console.warn('attributes "target" required', el);
			if( typeof(src) !== 'string' ) return console.warn('attributes "src" required', el);
		
			var app = this.load(src);
		
			if( app ) {
				var cmp = el.data('component');
				if( cmp ) {
					console.log('target cmp', cmp);
				} else {
					console.log('target el', el);
				}
			}
		});
	});
	
	// <component id="cmpid" src="dir/file.js"></component>
	Context.translator('component', function(el, attrs) {
		var ctx = this;
		var id = attrs.id;
		var src = attrs.src;		
		ctx.component(id, src);
	});
	
	// regist hash control	
	HashController.regist(function(hash, location) {
		if( debug('hash') ) console.log('hash changed "' + hash + '"');
		local.pages().propagation(hash);
	});
	
	// exports module 'ui'
	define('ui', function(module) {
		module.exports = Context;
	});
	
	$.on('ready', function(e) {
		// invoke current hash
		HashController.invoke();
	});
})();

