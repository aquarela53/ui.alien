var Application = (function() {
	"use strict"
	
	var HashController = require('attrs.hash');
	var Util = require('attrs.util');
	var $ = require('attrs.dom');
	var Ajax = require('ajax');
	var Path = require('path');
	var APPLICATIONS = [];
	
	var seq = 0;
	
	// TODO : Application 객체는 생성될 때 콘크리트도 분리되어서 생성되어야 하지만 지금은 그렇지 못함. 고쳐야 해
	function Application(options) {
		if( typeof(options) === 'string' ) options = {origin:options};
		
		this._cmps = {};
		this.translator = new TagTranslator(this);
		
		this.Component = Application.Component;
		this.Container = Application.Container;
		this.Application = Application.Application;
		
		var self = this;
		this.constructor.application = function() {
			return self;
		};
		
		var applicationId = this.applicationId = 'app-' + (seq++);
		var accessor = 'aui app-' + applicationId;
		this.constructor.applicationAccessor = function() {
			return accessor;
		};
		
		this.constructor.accessor = function() {
			return accessor + ' application';
		};
		
		for(var k in BUNDLES.components) {
			this.component(k, BUNDLES.components[k]);
		}
		
		for(var k in BUNDLES.translators) {
			this.tag(k, BUNDLES.translators[k]);
		}
		
		options = options || {};
		if( !options.origin ) options.origin = location.href;
		
		this.$super(options);
		
		APPLICATIONS.push(this);
	}
	
	Application.prototype = {
		origin: function(origin) {
			if( !arguments.length ) return this._origin || location.href;
			
			if( typeof(origin) !== 'string' ) return console.error('invalid origin', origin);
			
			this._origin = Path.join(location.href, origin);
			return this; 
		},
		icons: function(icons) {
			if( !arguments.length ) return this._icons;
			if( typeof(icons) === 'string' ) icons = {'default': icons};
			if( typeof(icons) === 'object' ) this._icons = icons;
			return this;
		},
		splash: function(splash) {
			if( !arguments.length ) return this._splash;
			if( typeof(splash) === 'string' ) splash = {'default': splash};
			if( typeof(splash) === 'object' ) this._splash = splash;
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
				
				if( this === local ) return console.error('[WARN] not exists component:' + id);
				
				var pcmp = local.component(id);
				if( pcmp ) cls = pcmp.source();
				
				if( !cls ) return console.error('[WARN] not exists component:' + id);
			}
			
			if( typeof(cls) === 'string' ) cls = require(this.path(cls));
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
			
			var accessor = (this.constructor.applicationAccessor() + ' ' + ids.reverse().join(' ')).trim();
			
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
			cmp.application = function() {
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
				console.info('[' + this.accessor() + '] component registerd', '[' + cmp.id() + ',' + fname + ']', Util.outline(cmp));
			}
			
			if( cls.translator ) {
				this.tag(id, cls.translator);
			}
			
			cmp.translator = function() {
				return cls.translator;
			};
			
			this.fire('component.added', {
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
			
			this.fire('tag.added', {
				selector: selector,
				fn: fn
			});
			
			return this;
		},
		translate: function(el) {
			this.translator.translate(el);
			return this;
		},
		
		// translate from ui json to component
		pack: function(source) {
			if( $.util.isElement(source) ) {
				source = {
					component: (type || 'html'),
					el: source
				};					
			} else if( typeof(source) === 'string' ) {
				var origin = source;
				source = Ajax.json(source);
				source.origin = origin;
			}
			
			if( !(source && typeof(source.component) === 'string') ) {
				return console.error('unsupported source type', source);
			}
			
			var cmp = this.component(source.component);
			if( !cmp ) return console.error('unknown component [' + source.component + ']');
			var instance = new cmp(source);
							
			this.fire('build', {
				instance: instance
			});
			
			return instance;
		},
	};
	
	Application = Class.inherit(Application, Container);
	
	
	Application.Component = Component;
	Application.Container = Container;
	Application.Application = Application;	
	
	Application.applications = function() {
		return APPLICATIONS;
	};
	
	// bundles
	var BUNDLES = {
		components: {},
		translators: {}
	};
	
	Application.component = function(id, cls) {
		if( typeof(id) !== 'string' || typeof(cls) !== 'function' ) return console.error('invalid parameter', id, cls);
		
		BUNDLES.components[id] = cls;
		APPLICATIONS.forEach(function(application) {
			application.component(id, cls);
		});
	};
	
	Application.translator = function(selector, fn) {
		if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('invalid parameter', selector, fn);
		
		BUNDLES.translators[selector] = fn;
		
		APPLICATIONS.forEach(function(application) {
			application.tag(selector, fn);
		});
	};
	
	// bind default translators
	Application.translator('page', function(el, attrs) {
		var ctx = this;
	
		var hash = attrs.hash;
		if( typeof(hash) !== 'string' ) return console.warn('attributes "hash" required', el);
	
		ctx.hash(hash, function(e) {
			var actions = $(this).children('action');
			
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
		return false;
	});
	
	// <component id="cmpid" src="dir/file.js"></component>
	Application.translator('component', function(el, attrs) {
		var app = this;
		var id = attrs.id;
		var src = attrs.src;		

		if( debug('translator') ) console.log('translate component', id, src);
		
		app.component(id, src);
		return false;
	});
		
	return Application;
})();
	
// initial application setting
(function() {
	var $ = require('attrs.dom');
	
	// create default application
	var app = new Application(location.href);	
	Application.local = function() {
		return app;
	};
	
	// auto pack
	var autopack = Framework.parameters['autopack'];
	if( !autopack || autopack.toLowerCase() !== 'false' ) {
		if( debug('ui') ) console.log('autopack on');
		
		$.ready(function(e) {
			app.translate(document.body);
			//app.items(document.body.children).attachTo(document.body);
			app.fire('ready');
		});
	} else {
		console.log('autopack off');
	}
	
	// regist global hash control	
	HashController.regist(function(hash, location) {
		if( debug('hash') ) console.log('hash changed "' + hash + '"');
		
		var e = app.fire('hash', {
			hash: hash
		});
		if( e.cancelBubble === true ) return false;
		
		$(document.body).visit(function() {
			var cmp = $(this).data('component');
			if( cmp instanceof Component ) {
				if( debug('hash') ) console.log('visiting component', cmp.accessor());
				var e = cmp.fire('hash', {
					hash: hash
				});
				if( e.cancelBubble === true ) return false;
			}
		});
	});
	
	// invoke current hash after application ready
	$.on('load', function(e) {
		if( debug('hash') ) console.log('hash controller invoke');
		HashController.invoke();
	});
	
	// exports Application as 'ui'
	define('ui', function(module) {
		module.exports = Application;
	});
})();


