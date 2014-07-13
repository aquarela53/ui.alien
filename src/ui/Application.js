// convert element's attributes to options
function convert2options(el) {
	var attributes = el.attributes;
	var attrs = {};
	for(var i=0; i < attributes.length; i++) {
		var name = attributes[i].name;
		var value = attributes[i].value;
		
		if( name.startsWith('data-') ) name = name.substring(5);
		if( name === 'as' ) continue;
		
		if( name.toLowerCase().startsWith('on') ) {
			var ename = name.substring(2).trim().split('_').join('.');
			if( ename ) {
				if( !attrs.e ) attrs.e = {};
				attrs.e[ename] = value;
				el.removeAttribute(name);
			}
		} else if( ~name.indexOf('-') ) {
			attrs[Util.camelcase(name, true)] = value;
		}
		
		attrs[name] = value;
	}
	
	//el.removeAttribute('data-as');
	return attrs;
}


var Application = (function() {
	"use strict"
	
	var APPLICATIONS = [];
	var seq = 1;
	
	var array_return = $.util.array_return;
	
	// class Application
	function Application(options) {
		this._cmps = {};
		this._translator = new TagTranslator(this);
		this._themes = new ThemeManager();
		
		this.Component = Application.Component;
		this.Container = Application.Container;
		this.Application = Application.Application;
		
		this._applicationId = 'app-' + ((seq === 1) ? 'x' : seq);
		this._accessor = '.aui.' + this._applicationId;
		
		seq++;
		
		for(var k in BUNDLES.components) {
			this.component(k, BUNDLES.components[k]);
		}
		
		for(var k in BUNDLES.translators) {
			this.translator(k, BUNDLES.translators[k]);
		}
		
		// regist loader 
		this.loader(function(err, data, type, url, xhr) {
			if( err ) return console.log('[' + this.accessor() + '] load fail', url);
			
			if( debug('loader') ) console.info('[' + this.accessor() + '] loaded', {data:data, type:type, url:url, xhr:xhr});
			if( typeof(data) === 'string' && type === 'html' ) {
				data = $.html(data).array();
			} else if( type === 'json' ) {
				data = (typeof(data) === 'string') ? evaljson(data) : data;
			} else if( type === 'js' ) {
				return require.resolve(data, url).exports;
			} else {
				return data;
			}
			
			return this.application().pack(data);
		});
		
		options = options || {};
		var src = ((typeof(options) === 'string') ? options : (options.src || '')).trim();
		if( src ) options.src = src;
		
		// validate options
		if( src ) {			
			if( src.startsWith('javascript:') ) {
				options.initializer = src.substring('javascript:'.length);
				console.log('initializer', initializer);
			} else {			
				if( Path.uri(src) === Path.uri(location.href) ) throw new Error('cannot load current location url', src);
			
				this.origin(src);
			
				var result = require(Path.join(location.href, src));
				if( typeof(result) === 'function' ) options.initializer = result;
				else if( typeof(result) === 'object' ) options.items = [result];
				else if( Array.isArray(result) ) options.items = result;
			}
			
			// invoke initializer
			if( options.initializer ) {
				var fn = options.initializer;
				fn.call(fn, this);
			}
		}
		
		this.$super(options);
		
		APPLICATIONS.push(this);
	}
	
	Application.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			this.cmpmap = new Map();			
			this.on('added', function(e) {
				var added = e.item;
				
				var packed;
				if( o.translation !== false ) packed = this.pack(added);				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var packed = this.packed(e.item);
				
				if( packed instanceof $ ) packed.detach();
				else if( packed instanceof Component ) packed.detach();
				else if( isElement(packed) ) packed.parentNode && packed.parentNode.removeChild(packed);
			});
			
			// add original element
			$(this.dom()).contents().each(function() {
				self.add(this);
			});
			
			this.$super();
		},
		ready: function(fn) {
			this.on('ready', fn);
			return this;
		},
		packed: function(item, cmp) {
			if( arguments.length == 1 ) return this.cmpmap.get(item);
			if( item && cmp ) return this.cmpmap.set(item, cmp);
			return null;
		},
		selector: function(selector) {
			// request : div#id.a.b.c[name="name"]
			// accessor : .app-x.application
			// result = div#id.app-x.application.a.b.c[name="name"]			
			selector = selector || '*';
			var appaccessor = this.applicationAccessor();
			if( selector === '*' ) return appaccessor;
			else if( !~selector.indexOf('.') ) return selector + appaccessor;
				
			var h = selector.substring(0, selector.indexOf('.'));
			var t = selector.substring(selector.indexOf('.'));
			return h + appaccessor + t;
		},
		
		applicationId: function() {
			return this._applicationId;
		},
		applicationAccessor: function() {
			return this._accessor;
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
		translator: function(selector, fn) {	
			var translators = this._translators = this._translators || {};
			
			if( !arguments.length ) return translators || {};
			else if( arguments.length === 1 ) return translators && translators[selector];
			
			if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('[' + this.applicationId() + '] invalid parameter(string, function)', arguments);
			
			translators[selector] = fn;
			
			this.fire('translator.added', {
				selector: selector,
				fn: fn
			});
			
			return this;
		},
		translate: function(el) {
			if( !isElement(el) ) return console.error('[' + this.applicationId() + '] el must be an element');
			
			el = $(el);
			
			var self = this;
			
			// preprocessing application tags
			var fn_application = function() {
				var options = convert2options(this);
				options.items = Array.prototype.slice.call(this.childNodes);
				var application = new Application(options);
				$(this).before(application.dom()).detach();
			};
			if( el.is('application') || el.attr('data-as') === 'application' ) return el.each(fn_application).void();
			else el.find('application, *[data-as="application"]').each(fn_application);
			
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
			
			// preprocessing route tags
			var fn_route = function() {
				var el = $(this);
				// TODO : 미구현
				el.detach();
			};			
			if( el.is('route') ) return el.each(fn_route).void();
			else el.find('route').each(fn_route);
			
			// remove defines tag
			if( el.is('defines') ) return el.detach().void();
			else el.find('defines').detach();
			
			// component parsing...
			var tmp = $.create('div').append(el).all().reverse().each(function() {
				var as = this.getAttribute('data-as');
				var tag = this.tagName.toLowerCase();
				var options = convert2options(this);
				var cmp;
				if( as ) {
					cmp = self.component(as);
					options.el = this;
					if( !cmp ) return console.warn('cannot found component corresponding to the tag [' + as + ']');
				} else {
					cmp = self.component(tag);
				}
				
				var fn = cmp && cmp.translator();
				if( fn ) {
					var result = fn.apply(self, [this, options]);
					
					if( !as ) {
						if( result instanceof Component ) $(this).before(result.dom()).detach();
						else if( (result instanceof $) || isElement(result) ) $(this).before(result).detach();
						else $(this).detach();
					}
				}
			}).end(1);
			
			// process additional translators
			var translators = this.translator();
			
			
			// process include tags
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
		pack: function(items) {
			if( items instanceof Component ) return items;
			
			var packed = [];
			
			if( typeof(items) === 'string' ) {
				if( $.util.isHtml(items) ) items = $.create(items).array();
				else items = $.html(items).array();
			}
			
			var items = items;
			if( !Array.isArray(items) ) items = [items];
			
			for(var i=0; i < items.length; i++) {
				var item = items[i]
				if( isElement(item) ) {
					packed.push(this.translate(item));
				} else if( isNode(item) ) {
					packed.push(item);
				} else if( item instanceof $ ) {
					var self = this;
					item.each(function() {
						var translated = self.translate(this);
						if( translated ) packed.push(translated);
					});
				} else if( typeof(item) === 'object' && typeof(item.component) === 'string' ) {
					var cmp = this.component(item.component);
					if( !cmp ) return console.error('[' + this.applicationId() + '] unknown component [' + item.component + ']');
					packed.push(new cmp(item));
				} else {
					return console.error('[' + this.applicationId() + '] unsupported source type', item);
				}
			}
			
			this.fire('packed', {
				packed: packed
			});
			
			return array_return(packed);
		},
		

		// theme & components
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
			if( arguments.length === 1 ) {
				return this._cmps[id];
			}
			
			if( ~id.indexOf(',') ) {
				var ids = id.split(',');
				for(var i=0; i < ids.length; i++) {
					this.component(ids[i].trim(), cls);
				}
				return this;
			}
			
			if( typeof(id) !== 'string' || ~id.indexOf('.') ) return console.error('[' + this.applicationId() + '] illegal component id:' + id);		
			if( typeof(cls) === 'string' ) cls = require(this.path(cls));
			if( typeof(cls) !== 'function' ) return console.error('[' + this.applicationId() + '] invalid component class:' + id, cls);
			
			var self = this;
			var fname = cls.fname = cls.fname || Util.camelcase(id);
			
			var inherit = cls.inherit;			
			if( cls.hasOwnProperty('inherit') && !inherit ) return console.error('[' + this.applicationId() + '] invalid inherit, unkwnown \'' + inherit + '\'', cls);
			else if( !inherit || inherit === 'component' ) inherit = this.Component;
			else if( inherit === 'container' ) inherit = this.Container;
			else if( inherit === 'application' ) inherit = this.Application;
			else if( typeof(inherit) === 'string' ) inherit = this.component(inherit);
						
			if( !inherit ) return console.error('[' + this.applicationId() + '] cannot find superclass :', cls.inherit);
			
			var cmp = Class.inherit(cls, inherit);
			var style = null;	//this.theme().component(id).reset(cls.style);
			var acceptable = cls.acceptable;
			acceptable = (acceptable === false) ? false : true;
			
			var classes = [id];
			if( cls.classes !== false ) {
				if( typeof(cls.classes) === 'string' ) {
					var arg = cls.classes.split(' ');
					arg.forEach(function(s) {
						if( s ) classes.push(s);
					});
				} else {
					for(var c = cmp;c = c.superclass();) {
						if( typeof(c.id) === 'function' ) {
							if(c.id()) classes.push(c.id());
						}
				
						if( typeof(c.acceptable) === 'function' && !c.acceptable() ) acceptable = false;
						if( !c.superclass ) break;
					}
				}
			}
			
			var accessor = (this.applicationAccessor() + '.' + classes.reverse().join('.')).trim();
			classes = classes.join(' ');
			
			cmp.classes = function() {
				if( arguments.length ) return console.error('illegal operation cannot set class to component\'s concrete');
				return classes;	
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
			
			cmp.translator = function() {
				return translator;
			};
			
			this.fire('component.added', {
				component: cmp
			});

			return cmp;
		},
		
		// override
		classes: function(classes) {
			var cls = this.constructor;
			var accessor = this.accessor(); 
			
			var el = this.el;
			
			if( !arguments.length ) {
				var args = accessor.split('.');
				return 'application ' + el.classes().filter(function(item) {
					return !~args.indexOf(item);
				}).join(' ');
			}
			
			el.classes(accessor.split('.').join(' '));
			if( classes && typeof(classes) === 'string' ) el.ac(classes);
			return this;
		},
		application: function() {
			return this;
		},
		accessor: function() {
			return this._accessor + '.application';
		},
		origin: function(origin) {
			if( !arguments.length ) return this._origin || location.href;			
			if( typeof(origin) !== 'string' ) return console.error('invalid origin', origin);			
			this._origin = Path.join(location.href, origin);
			return this;
		},
		base: function(base) {
			if( !arguments.length ) return this._base || Path.dir(this._origin || location.href);
			
			if( !base ) this.base(Path.dir(origin));
			else if( base && typeof(base) === 'string' ) base = Path.join(location.href, base);
			else return console.error('invalid base', base);
			
			base = base.trim();
			if( !base.endsWith('/') ) base = base + '/';
			this._base = base;
			
			return this;
		},
		theme: function(name) {
			//TODO: 지정된 테마를 기본테마로 변경
			if( !arguments.length ) return this.themes().current();
			
			if( !this.themes().current(name) ) {
				console.warn('[' + this.applicationId() + '] not exists theme name', name);
			}
			
			return this;
		},
		items: function(items) {
			if( typeof(items) === 'string' ) items = this.load(items);
			if( typeof(items) === 'function' ) {
				items.call(this.application(), this);
				return this;
			}
			return this.$super(items);			
		}
	};
	
	Application.fname = 'Application';
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
	
	Application.translator = function(selector, fn) {
		if( typeof(selector) !== 'string' || typeof(fn) !== 'function' ) return console.error('[' + Framework.id + '] invalid parameter', selector, fn);
		
		BUNDLES.translators[selector] = fn;
		
		APPLICATIONS.forEach(function(application) {
			application.translator(selector, fn);
		});
	};
	
	// bind default translators
	Application.translator('page', function(el, attrs) {
		if( !attrs.hash || typeof(attrs.hash) !== 'string' ) return console.warn('[' + Framework.id + '] attributes "hash" required', el);
		if( !attrs.action || typeof(attrs.action) !== 'string' ) return console.warn('[' + Framework.id + '] attributes "action" required', el);
		this.page(attrs.hash, attrs.action);	
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
	
// autopack
(function() {	
	// auto pack
	var autopack = Framework.parameters['autopack'];
	if( !autopack || autopack.toLowerCase() !== 'false' ) {
		if( debug('ui') ) console.info('[' + Framework.id + '] autopack on');
		
		$.ready(function(e) {
			var appels = $('application, *[data-as="application"]');
			
			var applications = [];
			appels.each(function() {
				var options = convert2options(this);
				if( this.tagName.toLowerCase() !== 'application' ) options.el = this;
				var application = new Application(options);
				if( !options.el ) $(this).before(application.dom()).detach();
				applications.push(application);
			});
			
			Application.fire('ready', {
				applications: applications
			});
		});
	} else {
		if( debug() ) console.info('[' + Framework.id + '] autopack off');
	}
})();

// regist global hash control
(function() {
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
		}, true);
	});
	
	// invoke current hash after application ready
	$.on('load', function(e) {
		if( debug('hash') ) console.log('hash controller invoke');
		if( HashController.current() ) HashController.invoke();
	});
})();


