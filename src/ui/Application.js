var Application = (function() {
	"use strict"
	
	var APPLICATIONS = [];
	var isElement = $.util.isElement;
	
	var seq = 0;
	
	// class Application
	function Application(options, argv) {
		this._cmps = {};
		this._translator = new TagTranslator(this);
		this._themes = new ThemeManager();
		
		this.Component = Application.Component;
		this.Container = Application.Container;
		this.Application = Application.Application;
		
		this._applicationId = 'app-' + (seq++);
		this._accessor = 'aui app-' + this._applicationId;
		
		for(var k in BUNDLES.components) {
			this.component(k, BUNDLES.components[k]);
		}
		
		for(var k in BUNDLES.translators) {
			this.tag(k, BUNDLES.translators[k]);
		}
		
		// validate options
		if( typeof(options) === 'string' ) {
			if( Path.uri(options) === Path.uri(location.href) ) throw new Error('cannot load current location url', options);
			options = {origin:options};
			
			var result = require(Path.join(location.href, options.origin));
			if( typeof(result) === 'function' ) options.setup = result;
			else if( typeof(result) === 'object' ) options.items = [result];
			else if( Array.isArray(result) ) options.item = result;
		} else if( isElement(options) ) {
			options = {el:options, translation: true};
		}
		
		options = options || {};
		if( !options.origin ) options.origin = location.href;
		if( argv ) options.argv = argv;
		
		this.$super(options);
		
		APPLICATIONS.push(this);
		
		this.fire('ready');
	}
	
	Application.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.translation ) this.translate(this.el);
			
			if( o.setup ) {
				var fn = o.setup;
				fn.call(fn, this, (o.argv || {}));
			}
			
			this.on('added', function(e) {
				this.attach(e.item);
			});

			this.on('removed', function(e) {
				if( e.item && e.item.detach ) e.item.detach();
			});
			
			this.$super();
		},
		applicationId: function() {
			return this._applicationId;
		},
		applicationAccessor: function() {
			return this._accessor;
		},
		accessor: function() {
			return this._accessor + ' application';
		},
		application: function() {
			return this;
		},
		
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
			/*if( !this._themes ) this._themes = {};

			var themes = this._themes;
			var theme = themes[name];
			if( !theme ) theme = themes[name] = new Theme(this, name);
			
			return theme;*/
			//TODO: 지정된 테마를 기본테마로 변경
			if( !arguments.length ) return this.themes().current();
			
			if( !this.themes().current(name) ) {
				console.warn('[' + this.applicationId() + '] not exists theme name', name);
			}
			
			return this;
		},
		themes: function() {
			return this._themes;
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
			if( typeof(id) !== 'string' || ~id.indexOf('.') ) return console.error('[' + this.applicationId() + '] illegal component id:' + id);			
			if( arguments.length === 1 ) {
				return this._cmps[id];
			}
			
			if( typeof(cls) === 'string' ) cls = require(this.path(cls));
			if( typeof(cls) !== 'function' ) return console.error('[' + this.applicationId() + '] invalid component class:' + id, cls);
			
			var self = this;
			var fname = cls.name || Util.camelcase(id);
			
			var inherit = cls.inherit;			
			if( cls.hasOwnProperty('inherit') && !inherit ) return console.error('[' + this.applicationId() + '] invalid inherit, unkwnown \'' + inherit + '\'', cls);
			else if( !inherit || inherit === 'component' ) inherit = this.Component;
			else if( inherit === 'container' ) inherit = this.Container;
			else if( inherit === 'application' ) inherit = this.Application;
			else if( typeof(inherit) === 'string' ) inherit = this.component(inherit);
						
			if( !inherit ) return console.error('[' + this.applicationId() + '] illegal state, cannot find superclass', inherit);
			
			var cmp = Class.inherit(cls, inherit);
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
			
			var accessor = (this.applicationAccessor() + ' ' + ids.reverse().join(' ')).trim();
			
			if( false ) {
				var parser = new less.Parser({});
				parser.parse(Ajax.get('login/login.less'), function (err, root) { 
					if( err ) return console.error(err);
					console.log(root);
				   	var css = root.toCSS(); 
					console.log(css);
				});
			}
			
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
					console.warn('[' + this.applicationId() + '] component fname conflict, so overwrited. before=', this[cmp.fname()], '/after=', cmp);
				} else {
					this[fname] = cmp;
				}
			} else {
				console.warn('[' + this.applicationId() + '] function name was empty', fname);
			}
			
			if( debug('ui') ) {
				console.info('[' + this.applicationId() + '] component added', '[' + cmp.id() + ',' + fname + ']', Util.outline(cmp));
			}
			
			if( cls.translator ) this.tag(id, cls.translator);
			
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
			if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('[' + this.applicationId() + '] invalid parameter(string, function)', arguments);

			var self = this;
			this._translator.add(selector, function() {
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
			if( isElement(el) ) el = $(el);
			else if( !(el instanceof $) ) return console.error('[' + this.applicationId() + '] illegal element', el);
			
			var translator = this._translator;
			el.each(function() {
				translator.translate(this);
			});
			
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
				return console.error('[' + this.applicationId() + '] unsupported source type', source);
			}
			
			var cmp = this.component(source.component);
			if( !cmp ) return console.error('[' + this.applicationId() + '] unknown component [' + source.component + ']');
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
		if( typeof(id) !== 'string' || typeof(cls) !== 'function' ) return console.error('[' + Framework.id + '] invalid parameter', id, cls);
		
		BUNDLES.components[id] = cls;
		APPLICATIONS.forEach(function(application) {
			application.component(id, cls);
		});
	};
	
	Application.translator = function(selector, fn) {
		if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('[' + Framework.id + '] invalid parameter', selector, fn);
		
		BUNDLES.translators[selector] = fn;
		
		APPLICATIONS.forEach(function(application) {
			application.tag(selector, fn);
		});
	};
	
	// bind default translators
	Application.translator('page', function(el, attrs) {
		var ctx = this;
	
		var hash = attrs.hash;
		if( typeof(hash) !== 'string' ) return console.warn('[' + Framework.id + '] attributes "hash" required', el);
	
		ctx.hash(hash, function(e) {
			var actions = $(this).children('action');
			
			console.log('[' + ctx.applicationId() + '] actions', actions);
			
			var target = attrs.target;
			var src = attrs.src;
			if( typeof(target) !== 'string' ) return console.warn('[' + ctx.applicationId() + '] attributes "target" required', el);
			if( typeof(src) !== 'string' ) return console.warn('[' + ctx.applicationId() + '] attributes "src" required', el);
		
			var app = ctx.load(src);
		
			if( app ) {
				var cmp = el.data('component');
				if( cmp ) {
					console.log('[' + ctx.applicationId() + '] target cmp', cmp);
				} else {
					console.log('[' + ctx.applicationId() + '] target el', el);
				}
			}
		});
		return false;
	});
	
	
	// if autopack is on, fire ready after build default application.
	var dispatcher = new EventDispatcher().scope(Application);
	Application.ready = function(fn) {
		dispatcher.on('ready', fn);
	};
	
	Application.fire = function(type, value) {
		dispatcher.fire(type, value);
	};
	
	// <component id="cmpid" src="dir/file.js"></component>
	Application.translator('component', function(el, attrs) {
		var app = this;
		var id = attrs.id;
		var src = attrs.src;

		if( debug('translator') ) console.log('[' + this.applicationId() + '] component tag found [' + id + '] src="' + src + '"');
		
		try {
			app.component(id, src);
		} catch(e) {
			console.warn('[' + this.applicationId() + '] component load failure. [' + id + '] src="' + src + '"', e);
		} 
		return false;
	});
		
	return Application;
})();

var UI = Application;
	
// initial application setting
(function() {	
	// auto pack
	var autopack = Framework.parameters['autopack'];
	if( !autopack || autopack.toLowerCase() !== 'false' ) {
		if( debug('ui') ) console.info('[' + Framework.id + '] autopack on');
		
		$.ready(function(e) {
			var app = new Application(document.body);
			
			Application.fire('ready', {
				application: app
			});
		});
	} else {
		if( debug() ) console.info('[' + Framework.id + '] autopack off');
	}
	
	// regist global hash control	
	HashController.regist(function(hash, location) {
		if( debug('hash') ) console.log('[' + Framework.id + '] hash changed "' + hash + '"');
		
		$(document.body).visit(function() {
			var cmp = $(this).data('component');
			if( cmp instanceof Component ) {
				if( debug('hash') ) console.log('[' + Framework.id + '] visiting component', cmp.accessor());
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
})();


