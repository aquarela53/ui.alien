(function() {
	var global = this;
	
	"use strict"

	if( !String.prototype.startsWith ) {
		String.prototype.startsWith = function(s) {
			if( !s ) return false;
			return (this.indexOf(s)==0);
		};
	}

	if( !String.prototype.endsWith ) {
		String.prototype.endsWith = function(s) {
			if( !s ) return false;

			return this.indexOf(s, this.length - s.length) !== -1;
		};
	}

	if( !String.prototype.replaceAll ) {
		String.prototype.replaceAll = function(find, replace) {
			return this.replace(new RegExp(find, 'g'), replace);
		};
	}
	
	var scope = this;
	// bind object as variable to global scope (in node.js is module scope)
	var toGlobal = function(name, value) {
		if( !name || !value ) throw new TypeError('variable name or value was null.');
		var tmp;
		try {
			eval('tmp = ' + name + ';');
			if( tmp ) throw new TypeError('already exist variable name:\'' + name + '\'');
		} catch(e) {}
		
		var pos;
		if((pos = name.lastIndexOf('.')) > 0) {
			ns(name.substring(0, pos));
		}

		eval('global.' + name + '= value');
	};

	// create package namespace object (ex/ ns('attrs.oop') is create attrs.oop = {} )
	var ns = function(name) {
		if( !name ) throw new TypeError('invalid namespace:\'' + name + '\'');
		var args = name.split('.');

		//console.log(name, args);
		
		eval('var parent = global.' + args[0] + ' = global.' + args[0] + ' || {}');

		//console.log(args[0], parent);
		if( args.length > 1 ) {
			for(var i=1; i < args.length; i++) {
				parent = parent[args[i]] = parent[args[i]] || {};
			}
		}
	};

	var seq = 100;

	var Class = function(name, c) {
		return Class.define(name, c);
	};
	Class.clone = function(obj) {
		if(obj == null || typeof(obj) != 'object')
			return obj;

		var temp = obj.constructor(); // changed

		for(var key in obj)
			temp[key] = Class.clone(obj[key]);
		return temp;
	};
	Class.define = function(name, c) {
		if( typeof(name) === 'object' || typeof(name) === 'function' ) {
			c = name;
			name = 'Class$' + seq++;
		} else if( typeof(name) !== 'string' ) {
			throw new TypeError('class name must be a string');
		} else if( !name.trim() || name.startsWith('.') || !isNaN(parseInt(name.substring(0,1))) ) {
			throw new TypeError('invalid class name:\'' + name + '\'');
		}

		// define constructor
		var cls = function(a) {
			if( a !== '__inherit__' ) {
				var clazz = this.constructor.__class__;
				if(clazz && clazz.instantiatable===false) throw new ReferenceError('[' + clazz.name + '] class cannot instantiatable directly.');

				// bind defined attributes
				var attrs = clazz.attrs;
				if( attrs ) {
					for (var k in attrs) {
						this[k] = Class.clone(attrs[k]);
					}
				}
				
				// invoke feature initializer
				var argf = clazz.features;
				if( argf ) {
					for(var k in argf) {
						var finit = argf[k].initializer;
						if( finit ) finit.apply(this, arguments);
					}
				}
				
				var r;
				if( this.initializer ) r = this.initializer.apply(this, arguments);
				if( r ) return r;
			}
		};
		cls.__class__ = {};
		(function(cls) {
			cls.prototype.instanceOf = function(c) {
				//console.log('o', o, 'cls', cls);
				if( this instanceof c ) return true;
				else return false;
			};
			cls.isChildOf = function(parentCls) {
				var c = {
					superclass: cls
				};

				for(;c = c.superclass;) {
					//console.error('compare', c.superclass, parentCls);
					if( c.superclass === parentCls ) return true;
				}
				return false;
			};
		})(cls);
		
		// evaluate class body members
		var body = (typeof(c) === 'object') ? c : c.apply(cls, [this.prototype]);
		if( typeof(body) !== 'object' ) throw new TypeError('class body must be a object.');
		
		// extract name & bind to Class.classes
		name = cls.__class__.name = name || body.$name;
		Class.classes[name] = cls;
		toGlobal(name, cls);

		var pos;
		if((pos = name.lastIndexOf('.')) > 0) {
			cls.__class__.initializerName = name.substring(pos + 1);
		}
		
		cls.getClass = function() { return cls.__class__; };
		cls.__class__.source = body;
		cls.__class__.instantiatable = body.$instantiatable;

		// check protocols
		Protocol.validation(body.$protocols, body);

		// confirm super class
		var superclass = body.$extends || this;

		//console.log(superclass);

		if( typeof(superclass) === 'string' ) superclass = Class.find(superclass);
		
		if( typeof(superclass) !== 'function' ) throw new TypeError('super class must be a function.');
		
		// check super class's abstract
		if( superclass.source && superclass.source.$abstract ) {
			var abs = superclass.source.$abstract;
			for(var k in abs) {
				//console.log('abstract check', k)
				if( k.startsWith('$') ) continue;
				var d = abs[k];
				var m = body[k];
				
				if( !m ) {
					throw new TypeError('Class [' + name + '.' + k + '] must be defined. according to [class ' + superclass.__class__.name + ' abstract definition]');
				} else if( typeof(m) != 'function' ) {
					throw new TypeError('Class [' + name + '.' + k + '] must be a function. according to [class ' + superclass.__class__.name + ' abstract definition]');
				} else if( typeof(d) == 'function' ) {
					if( !d.apply(protocol, [m, source, this]) ) throw new TypeError('Class [' + name + '.' + k + '] invalid. according to [class ' + superclass.__class__.name + ' abstract definition]');
				} else if( d !== true && d >= 0 && m.length !== d ) {
					throw new TypeError('Class [' + name + '.' + k + '] has wrong arguments length(defined ' + d + ' but has ' + m.length + '). according to [class ' + superclass.__class__.name + ' abstract definition]');
				}
			}
		}

		// bind static members
		var statics = body.$ || body.$static;
		if( statics ) {
			Class.copy(cls, statics);
		}

		// inherit
		if( superclass !== Class ) cls.prototype = new superclass('__inherit__');
		
		// extract super class's attributes
		cls.__class__.attrs = {};
		if( cls.prototype.constructor.__class__.attrs ) for (var k in cls.prototype.constructor.__class__.attrs) cls.__class__.attrs[k] = cls.prototype.constructor.__class__.attrs[k];
		
		// change constructor to current class
		cls.prototype.constructor = cls;

		// bind members to prototype
		for (var k in body) {
			if( k.substring(0,1) === '$' || k === 'inherit' ) continue;
			var v = body[k];

			if( k == cls.__class__.initializerName || k === 'initialize' || k === 'construct' ) {
				//console.log('initializer catched', cls.__class__.name, cls.__class__.initializerName, k);
				if( cls.prototype[k] ) throw new TypeError('duplicate initializer');
				k = 'initializer';
			}

			if( typeof(v) === 'function' && typeof(superclass.prototype[k]) === 'function') {
				// case of exists same name function in super class (enabling supercall)
				v = function(name, fn) {
					return function() {
						var self = this;
						this.$super = function() {
							superclass.prototype[name].apply(self, arguments);
						};
						var r = fn.apply(this, arguments);
						delete this.$super;

						return r;
					};
				}(k, v);
			}

			if( typeof(v) !== 'function' ) {
				cls.__class__.attrs[k] = v;
			} else {
				cls.prototype[k] = v;
			}
		}

		// bind features
		cls.__class__.features = Feature.bindsAll(body.$features || body.$feature, cls.prototype, cls.attrs) || {};
		
		if( superclass && superclass.__class__ && superclass.__class__.features ) {
			for(var k in superclass.__class__.features) {
				var feature = superclass.__class__.features[k];
				if( ! cls.__class__.features[k] ) cls.__class__.features[feature.name] = feature;
			}
		}
		
		// bind bundle members
		cls.inherit = Class.define;
		cls.prototype._super = superclass.prototype;
		cls.prototype.getClass = function() {
			return cls.__class__;
		};
		cls.superclass = superclass;
		
		return cls;
	};
	// copy prototype (attributes, methods, getters, setters)
	Class.copy = function(target, source, attrs) {
		// original attributes in current class
		var attributes = attrs || {};

		for(var k in source) {
			if( k.startsWith('$') || !source.hasOwnProperty(k) ) continue;

			var g, s;
			if( source.__lookupGetter__ ) {
				g = source.__lookupGetter__(k);
				s = source.__lookupSetter__(k);
			}

			if ( (g || s) ) {
				//TODO : 같은 애트리뷰트가 상위의 getter/setter 일 수 있으므로... 체크해야 한다.

				if ( g ) target.__defineGetter__(k, g);
				if ( s ) target.__defineSetter__(k, s);
			} else {
				if( source[k] == self.initializer ) continue;
				if( target.hasOwnProperty(k) ) throw new TypeError('feature member [' + k + '] is conflict with class member.');
				var v = source[k];
				if( typeof(v) == 'function' ) target[k] = v;	//펑션은 prototype 에 위치
				else target[k] = attributes[k] = v;				//정의 속성은 scope 상에도 넣어야 하므로..
			}
		}

		return attributes;
	};
	Class.classes = {'Class':Class};
	// find class by name
	Class.find = function(name) {
		return Class.classes[name];
	};

	// Protocol
	var Protocol = function(name, source) {
		if( !name ) throw new TypeError('protocol name missing');
		if( Protocol.protocols[name] ) throw new TypeError('already exist protocol name:' + name);
		if( !name.trim() || name.startsWith('.') || !isNaN(parseInt(name.substring(0,1))) ) throw new TypeError('invalid protocol name:\'' + name + '\'');

		if( !(typeof(source) == 'object' || typeof(source) == 'function') ) throw new TypeError('protocol must be a object or function');
		
		toGlobal(name, this);
		Protocol.protocols[name] = this;

		this.source = source;	
		this.name = name;
	};
	Protocol.prototype = {
		validation: function(cls) {
			var protocol = this.source;
			if( typeof(protocol) == 'function' ){
				if( !(protocol.apply(protocol, [source, this])) ) throw new TypeError('Class [' + name + '] is invalid according to protocol [' + pname + '].');
			} else {
				for(var k in protocol) {
					//console.log(name, pname, k);
					if( k.startsWith('$') ) continue;
					var d = protocol[k];
					var m = cls[k];
					
					if( !m ) {
						throw new TypeError('method [' + k + '] must be defined. according to [' + this.name + ']');
					} else if( typeof(m) != 'function' ) {
						throw new TypeError('method [' + k + '] must be a function. according to [' + this.name + ']');
					} else if( typeof(d) == 'function' ) {
						if( !d.apply(protocol, [m, source, this]) ) throw new TypeError('method [' + k + '] invalid. according to [' + this.name + ']');
					} else if( d !== true && d >= 0 && m.length !== d ) {
						throw new TypeError('method [' + k + '] has wrong arguments length(defined ' + d + ' but has ' + m.length + '). according to [' + this.name + ']');
					}
				}
			}
		},
		is: function(cls) {
			return false;
		}
	};
	Protocol.validation = function(protocols, cls) {
		if( protocols && cls ) {
			if( !(protocols instanceof Array) ) protocols = [protocols];
			for(var i=0; i < protocols.length; i++) {
				var protocol = protocols[i];
				if( typeof(protocol) === 'string' ) protocol = Protocol.find(protocol);
				if( protocol instanceof Protocol ) {
					protocol.validation(cls);
				} else {
					throw new TypeError('[' + protocols[i] + '] is not a protocol.');
				}
			}
		}
	};
	Protocol.protocols = {};

	// find class by name
	Protocol.find = function(name) {
		return Protocol.protocols[name];
	};

	// define class with name & source
	Protocol.define = function(name, source) {
		return new Protocol(name, source);
	};

	// remove class by name
	Protocol.remove = function(name) {
		var cls = Protocol.protocols[name];
		if( !cls ) throw new TypeError('not exist protocols/protocols name:\'' + name + '\'');
		Protocol.protocols[name] = null;
		try {
			eval(name + ' = null;');
		} catch(e) {}
	};
	
	// assign Protocol to Class
	Class.Protocol = Protocol;


	// Feature
	var Feature = function(name, source) {
		if( !name ) throw new TypeError('feature name missing');
		if( Feature.features[name] ) throw new TypeError('already exist feature name:' + name);
		if( !name.trim() || name.startsWith('.') || !isNaN(parseInt(name.substring(0,1))) ) throw new TypeError('invalid feature name:\'' + name + '\'');

		if( !(typeof(source) == 'object' || typeof(source) == 'function') ) throw new TypeError('feature must be a object or function');
		
		toGlobal(name, this);
		Feature.features[name] = this;
		
		this.name = name;
		this.source = source;
		
		var initname = name;
		var pos;
		if((pos = initname.lastIndexOf('.')) > 0) {
			initname = initname.substring(pos + 1);
		}

		this.initializer = source[initname] || source.initializer || source.construct;
		delete source[initname];
		delete source['initializer'];
		delete source['construct'];
	};
	Feature.prototype.bind = function(target, attrs) {
		Class.copy(target, this.source, attrs, false);
	};
	Feature.bindsAll = function(features, target, attrs) {
		if( features && target ) {
			var argf = {};
			if( !(features instanceof Array) ) features = [features];
			for(var i=0; i < features.length; i++) {
				var feature = features[i];
				if( typeof(feature) === 'string' ) feature = Feature.find(feature);
				if( feature instanceof Feature ) {
					feature.bind(target, attrs);
					argf[feature.name] = feature;
				} else {
					throw new TypeError('[' + features[i] + '] is not a feature.');
				}
			}

			return argf;
		}

		return null;
	};
	Feature.features = {};

	// find class by name
	Feature.find = function(name) {
		return Feature.features[name];
	};
	// define class with name & source
	Feature.define = function(name, source) {
		return new Feature(name, source);
	};
	// remove class by name
	Feature.remove = function(name) {
		var cls = Feature.protocols[name];
		if( !cls ) throw new TypeError('not exist protocols/protocols name:\'' + name + '\'');
		Feature.protocols[name] = null;
		try {
			eval(name + ' = null;');
		} catch(e) {}
	};
	
	// assign Feature to Class
	Class.Feature = Feature;

	
	// eval nodejs
	var isNodeJS = false;
	try {
		eval('var m = module;');
		isNodeJS = true;
	} catch(e) {
	}

	// assign to global	
	if( isNodeJS ) {
		module.exports = Class;
	} else {
		if( !window.Class ) window.Class = Class;
		else console.warn('WARNING: already exist \'Class\' in window object. you can use alternated access \'attrs.oop.Class\'.');

		if( !window.Protocol ) window.Protocol = Protocol;
		else console.warn('WARNING: already exist \'Protocol\' in window object. you can use alternated access \'attrs.oop.Protocol\'.');

		if( !window.Feature ) window.Feature = Feature;
		else console.warn('WARNING: already exist \'Feature\' in window object. you can use alternated access \'attrs.oop.Feature\'.');

		if( !window.attrs ) window.attrs = {oop:{Class:Class, Protocol:Protocol, Feature:Feature}};
		else if( window.attrs && !window.attrs.oop ) window.attrs.oop = {Class:Class, Protocol:Protocol, Feature:Feature};
	}
})();