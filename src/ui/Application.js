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
			options = {el:options};
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
			var self = this;
			var o = this.options;
			
			this.cmpmap = new Map();
			
			this.on('added', function(e) {
				var added = e.added;
				
				var packed;
				if( o.translation !== false ) {
					packed = this.pack(added);
				}
				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var packed = this.packed(e.removed);
				
				// TODO : 그냥 detach 하면 안됨. 어떤 시점에 다른 곳에 이미 attach 되었을 수도 있으니.
				if( packed instanceof $ ) packed.detach();
				else if( packed instanceof Component ) packed.detach();
				else if( isElement(packed) ) this.attachTarget() && this.attachTarget().removeChild(packed);
			});
			
			// add original element
			$(this.dom()).children().each(function() {
				self.add(this);
			});
			
			this.$super();
			
			if( o.setup ) {
				var fn = o.setup;
				fn.call(fn, this, (o.argv || {}));
			}
		},
		packed: function(item, cmp) {
			if( arguments.length == 1 ) return this.cmpmap.get(item);
			if( item && cmp ) return this.cmpmap.set(item, cmp);
			return null;
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
		
		// inspects DOM Elements for translates as component
		tag: function(selector, fn) {
			if( !arguments.length ) return this._tags || {};
			else if( arguments.length === 1 ) return this._tags && this._tags[selector];
			
			if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('[' + this.applicationId() + '] invalid parameter(string, function)', arguments);
			
			this._tags = this._tags || {};
			this._tags[selector] = fn;
			
			this.fire('tag.added', {
				selector: selector,
				fn: fn
			});
			
			return this;
		},
		translate: function(el) {
			if( !isElement(el) ) return console.error('[' + this.applicationId() + '] el must be an element');
			
			el = $(el);
			
			var self = this;
			
			// preprocessing component & on & theme tags
			var fn_component = function() {
				var el = $(this);
				var id = el.id();
				var src = el.attr('src');

				if( debug('translator') ) console.info('[' + self.applicationId() + '] component tag found [' + id + '] src="' + src + '"');

				try {
					self.component(id, src);
				} catch(e) {
					console.warn('[' + self.applicationId() + '] component load failure. [' + id + '] src="' + src + '"', e);
				} finally {
					el.detach();
				}
			};			
			if( el.is('component') ) return el.each(fn_component).void();
			else el.find('component').each(fn_component);
			
			// preprocessing onhash tags
			var fn_onhash = function() {
				var el = $(this);
				// TODO : 미구현
				el.detach();
			};			
			if( el.is('onhash') ) return el.each(fn_onhash).void();
			else el.find('onhash').each(fn_onhash);
			
			// preprocessing application tags
			var fn_application = function() {
				var el = $(this);
				var options = el.attr();
				options.items = Array.prototype.slice.call(this.children);
				var application = new Application(options);
				el.before(application.dom()).detach();
			};
			if( el.is('application') ) return el.each(fn_application).void();
			else el.find('application').each(fn_application);
			
			//if( debug('translator') ) console.info('[' + self.applicationId() + '] translation start', el[0]);
			var translator = this._translator;
			//var match = $.util.match;
			var tag = this.tag();
			
			var tmp = $.create('div').append(el).all().reverse().each(function() {
				for(var tagname in tag) {
					if( this.tagName.toLowerCase() === tagname || this.getAttribute('as') === tagname ) {
						var as = this.getAttribute('as') ? true : false;
						this.removeAttribute('as');
						var el = this;
						var fn = tag[tagname];
						var attributes = el.attributes;
						var attrs = {};
						for(var i=0; i < attributes.length; i++) {
							var name = attributes[i].name;
							var value = attributes[i].value;
							attrs[name] = value;
						}						
						
						if( as ) {
							attrs['el'] = el;
							var cmp = fn.apply(self, [el, attrs]);
							if( !cmp ) $(el).detach();
						} else {
							var cmp = fn.apply(self, [el, attrs]);
							if( cmp instanceof Component ) $(el).before(cmp.dom()).detach();
							else if( (cmp instanceof $) || isElement(cmp) ) $(el).before(cmp).detach();
							else $(el).detach();
						}
					}
				}			
			}).end(1);
			
			// preprocessing onhash tags
			var fn_include = function() {
				var el = $(this);
				var src = el.attr('src');
				var sync = (el.attr('sync') === 'true') ? true : false;
				
				Ajax.ajax(self.path(src)).sync(sync).done(function(err, result) {
					if( err ) return console.error('cannot include src', src);
					var items = $(result);
					//el.before(items).detach();
					items.each(function() {
						var translated = self.translate(this);
						if( translated ) el.before(translated);
						//console.log('include translated', translated);
					});
					el.detach();
				});
			};			
			if( el.is('include') ) el.each(fn_include).void();
			else el.find('include').each(fn_include);
			
			return tmp.children()[0];
		},
		
		
		// translate from ui json to component
		pack: function(source) {
			if( source instanceof Component ) return source;
			
			var packed;
			
			if( typeof(source) === 'string' ) {
				var origin = source;
				source = Ajax.json(source);
				source.origin = origin;
			}
			
			if( isElement(source) ) {
				packed = this.translate(source);
			} else if( source instanceof $ ) {
				var arr = [];
				var self = this;
				source.each(function() {
					var translated = this.translate(this);
					if( translated ) arr.push(translated);
				});
				packed = $(arr).owner(source);
			} else if( source && typeof(source.component) === 'string' ) {
				var cmp = this.component(source.component);
				if( !cmp ) return console.error('[' + this.applicationId() + '] unknown component [' + source.component + ']');
				packed = new cmp(source);
			} else {
				return console.error('[' + this.applicationId() + '] unsupported source type', source);
			}
			
			this.fire('packed', {
				packed: packed
			});
			
			return packed;
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
			var fname = cls.fname || Util.camelcase(id);
			
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
			
			var translator = cls.translator || function(el) {
				console.warn('[' + this.applicationId() + '] component [' + id + '] does not support custom tag');
			};
			
			this.tag(id, translator);
			
			cmp.translator = function() {
				return translator;
			};
			
			this.fire('component.added', {
				component: cmp
			});

			return cmp;
		}
	};
	
	Application = Class.inherit(Application, Container);
	
	Application.Component = Component;
	Application.Container = Container;
	Application.Application = Application;
	
	Application.acceptable = function() {
		return true;
	};
	
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
	
	
	// TODO: ...
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


