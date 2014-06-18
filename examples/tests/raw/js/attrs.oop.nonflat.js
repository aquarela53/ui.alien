/*!
 * attrs.oop
 *		Class-based OOP in javascript. 
 *
 * Author : 
 *		Joje (joje.attrs@gmail.com)
 *
 * Repository : 
 *		GitHub (https://github.com/joje6/attrs.oop)
 *
 * Issues : 
 *		GitHub (https://github.com/joje6/attrs.oop/issues)
 * 
 * Lisence:
 *		MIT Lisence (https://github.com/joje6/attrs.oop/blob/master/LICENSE)
 */
var starttime = new Date().getTime();
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

	if( !String.prototype.trim ) {
		String.prototype.trim = function() {
			return this.replace(/(^ *)|( *$)/g, "");
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
				parent = parent[args[i]] = {};
			}
		}
	};

	var seq = 100;
	
	// Class class
	var Class = function(name, source) {
		if( !name) throw new TypeError('parameter missing');

		if( source && typeof(name) == 'string' ) {
			source.$name = name;
		} else if( !source && typeof(name) == 'string' ) {
			throw new TypeError('missing parameter:source');
		} else if( !source ) {
			source = name;
			source.$name = 'Class$' + (seq++);
		} else {
			throw new TypeError('missing parameters');
		}

		name = this.name = source.$name;
		source = this.source = source;

		var cls = this.wiring();

		return Class.regist(name, cls);
	};
	Class.classes = {'Class':Class};

	// abstract command
	Class.$abstract = function(cnt) {
		return {
			type: 'abstract',
			cnt: cnt
		};
	};

	// find class by name
	Class.find = function(name) {
		return Class.classes[name];
	};

	// define class with name & source
	Class.define = function(name, source) {
		var clz = new Class(name, source);
		return clz;
	};

	// remove class by name
	Class.remove = function(name) {
		var cls = Class.classes[name];
		if( !cls ) throw new TypeError('not exist class/class name:\'' + name + '\'');
		Class.classes[name] = null;
		try {
			eval(name + ' = null;');
		} catch(e) {}
	};

	// regist class
	Class.regist = function(name, cls) {
		if( !name ) throw new TypeError('class name was null');
		if( !cls || typeof(cls) != 'function' ) throw new TypeError('class must be a function');
		
		if( !name.trim() || name.startsWith('.') || !isNaN(parseInt(name.substring(0,1))) ) throw new TypeError('invalid class name:\'' + name + '\'');
		
		if( Class.classes[name] ) throw new TypeError('already exist class name:\'' + name + '\'');
		
		var tmp;
		try {
			eval('tmp = ' + name + ';');
			if( tmp ) throw new TypeError('already exist class:\'' + name + '\'');
		} catch(e) {}
		
		var pos;
		if((pos = name.lastIndexOf('.')) > 0) {
			ns(name.substring(0, pos));
		}

		eval('global.' + name + '= cls;');
		toGlobal(name, cls);

		Class.classes[name] = cls;
		return cls;
	};

	Class.prototype.validation = function() {
		// validation by protocols
		var protocols = this.source.$protocol;
		if( protocols ) {
			if( !(protocols instanceof Array) ) protocols = [protocols];
			for(var i=0; i < protocols.length; i++) {
				var protocol = protocols[i];
				if( typeof(protocol) == 'string' ) {
					protocol = Protocol.find(protocol);
				}

				if( !(protocol instanceof Protocol) ) throw new TypeError('invalid protocol:' +  protocol);
				
				protocol.validation(this.cls);
			}
		}

		return true;
	};

	// create class
	Class.prototype.wiring = function() {
		var self = this;
		var source = this.source;
		var name = this.name;

		// switching debug mode
		this.debug = (source.$debug === true) ? true : false;

		if( !name ) throw new TypeError('class name missing');

		// evaluation non-flat mode
		var flat = this.flat = (source.$flat === true) ? true : false;

		// extract static members
		var statics = this.statics = source.$ || source.$static;

		// class name separation from full name(if full name has package name)
		var classname = name;
		var pos;
		if((pos = name.lastIndexOf('.')) > 0) {
			classname = name.substring(pos + 1);
		}

		// initializer setup
		var initializer = this.initializer = source[classname] || source.initializer || source.initialize || source.init;
		if( !initializer ) {
			//console.warn('initializer missing : class [' + name + ']');
			initializer = function() {};
		}
		if( typeof(initializer) != 'function' ) throw new TypeError('class [' + name + '] has invalid Initializer. Initializer must be a function.');
				
		// validation class define from protocol
		this.validation();

		// get super class
		var superclass = source.$extends;
		if( superclass ) {
			var superclassname;
			if( typeof(superclass) == 'string' ) {
				superclassname = superclass;
				superclass = Class.find(superclassname);
			} else {
				superclassname = Class.getName(superclass);
			}
			
			if( !superclass ) throw new TypeError('super class \'' + (superclassname || 'unknown') + '\' does not exist.');
			if( typeof(superclass) != 'function' ) throw new TypeError('super class \'' + (superclassname || 'unknown') + '\' must be a function.');
			
			// if super class is final, stop.
			if( superclass.isFinal() ) throw new TypeError('super class \'' + (superclassname || 'unknown') + '\' is final. stopped extending.');

			// if super class is non-flat, current class must non-flat
			if( !superclass.$builder.flat && this.flat ) throw new TypeError('super class \'' + (superclassname || 'unknown') + '\' is non-flat class. sub-class must be non-flat class.');

			// validation check abstract method implements
			var abs = superclass.abstracts();
			if( abs ) {
				for(var k in abs) {
					//console.log('abstract check', k)
					if( k.startsWith('$') ) continue;
					var d = abs[k];
					var m = source[k];
					
					if( !m ) {
						throw new TypeError('Class [' + name + '.' + k + '] must be defined. according to [' + superclassname + ' abstract]');
					} else if( typeof(m) != 'function' ) {
						throw new TypeError('Class [' + name + '.' + k + '] must be a function. according to [' + superclassname + ' abstract]');
					} else if( typeof(d) == 'function' ) {
						if( !d.apply(protocol, [m, source, this]) ) throw new TypeError('Class [' + name + '.' + k + '] invalid. according to [' + superclassname + ' abstract]');
					} else if( d !== true && d >= 0 && m.length !== d ) {
						throw new TypeError('Class [' + name + '.' + k + '] has wrong arguments length(defined ' + d + ' but has ' + m.length + '). according to [' + superclassname + ' abstract]');
					}
				}
			}
		} else {
			// root class is flat
			//if( !this.flat ) console.warn('root class is flat, \'$flat:false\' option is ignored.');
			//flat = this.flat = true;
		}

		// default constructor (this function is real constructor of class, eval for labeling in chrome console)
		/*var cls;
		if( flat ) {
			var Flat = {};
			eval('Flat["' + name + '"] = function(){ ' + 
				'\t// \'' + name + '\' constructor (default)\n' + 
				'\tself.router.apply(this, arguments);\n' + 
			'};');
			cls = Flat[name];
		} else {
			var ID = {};
			ID[name] = function() {	// constructor (non-flat)
				return self.router.apply(this, arguments);
			};
			eval('ID["' + name + '"] = function(){ ' + 
				'\t// \'' + name + '\' constructor (non-flat)\n' + 
				'\treturn self.router.apply(this, arguments);\n' + 
			'};');
			cls = ID[name];		
		}*/

		var cls = this.cls = function(mode) {	// default constructor	
			var $_ext_origin_ = (mode == '$_ext_origin_');
			var $_ext_flat_ = (mode == '$_ext_flat_');
			//console.log($_ext_origin_);
			if( $_ext_origin_ ) return;
			if( self.flat || $_ext_flat_ ) {
				self.router.apply(this, arguments);
			} else {
				return self.router.apply(this, arguments);
			}
		};
	
		// bind static members		
		cls.$builder = this;
		Class.bindStatics(cls, (statics || {}));
		
		// set class's final & abstract options
		cls.setFinal(source.$final);
		cls.abstracts(source.$abstract || source.$abstracts);
		cls.feature(source.$feature || source.$features);

		// routes function for naming(in chrome) & routing
		var router = this.router = function(mode) {
			var $_ext_flat_ = (mode == '$_ext_flat_');
			var $_ext_nonflat_ = (mode == '$_ext_nonflat_');
			var extending = $_ext_flat_ || $_ext_nonflat_;
			//console.error('* this', name, ((extending) ? 'extending' : 'entry'), this, ((flat) ? 'falt' : 'nonflat'));
			// in case, entry class instantiate, if class has abstract methods, stop instantiation.
			if( !extending && cls.abstracts() ) throw new TypeError('Class [' + name + '] has abstract methods. cannot be instantiated directly.');

			if( self.debug ) this._uuid = Math.random();
			self.arguments = arguments;

			if( self.flat ) {
				if( self.debug ) console.log('[' + name + '] class creating with flat mode. situation:', (extending) ? 'Extending' : 'Entry');
				if( self.attributes && !$_ext_flat_ ) {
					for(var k in self.attributes) {
						this[k] = self.attributes[k];
					}
				}
				if( self.initializer && !extending ) self.initializer.apply(this, arguments);
				if( self.debug ) console.log('[' + name + '] class created with flat mode');
			} else {
				if( self.debug ) console.log('[' + name + '] class creating with non-flat mode. situation:', (extending) ? 'Extending' : 'Entry');
				var id = self.initAsNonFlat.apply(this, arguments);
				//console.log('* flat', name, self.flat, id);
				if( self.debug ) console.log('[' + name + '] class created with non-flat mode');
				return id;
			}
		}
		
		// call & setup super class
		var attributes;
		if( superclass ) {
			cls.prototype = new superclass('$_ext_flat_');
			cls.prototype.constructor = cls;
			
			// get original attributes in super class
			attributes = (superclass.prototype.$builder) ? superclass.prototype.$builder.attributes : {};
		}
		
		// set attributes to current class
		attributes = this.attributes = attributes || {};
		
		// binding original attributes in current class
		cls.prototype._super = ((superclass) ? superclass.prototype : {});
		var arga = this.bindMembers(cls.prototype) || {};
		for(var k in arga) {
			attributes[k] = arga[k];
		}

		cls.prototype.initializer = initializer;

		// setup non-flat constructor (for hierarchical instance area)
		this.initAsNonFlat = function(mode, caller) {
			var $_ext_flat_ = (mode == '$_ext_flat_');
			var $_ext_nonflat_ = (mode == '$_ext_nonflat_');
			var extending = $_ext_flat_ || $_ext_nonflat_;

			//console.error('[' + name + '] caller', caller, extending);

			
			var ID = {};
			eval('ID["' + name + '"] = function(){ ' + 
				'\t// \'' + name + '\' constructor for instance\n' + 
				'\tvar extending = ' + extending + ';\n' + 
				'\tif( self.debug ) this._uuid=Math.random();\n' +
				'\tif( self.attributes ) {\n' + 
					'\t\tfor(var k in self.attributes) {\n' + 
						'\t\t\tthis[k] = self.attributes[k];\n' + 
					'\t\t}\n' + 
				'\t}\n' +  
				'\tif( !extending ) {\n' +  
					'\tvar instance = this;\n' +  
					'\tvar id = {_super:this};\n' +  
					'\tfor(;id = id._super;) {\n' +  
						'\tid.constructor.prototype._instance = instance;\n' +  
					'\t}\n' +  
				'\t}\n' +  
				'\tif( self.initializer && !extending ) self.initializer.apply(this, self.arguments);\n' + 
			'};');
			var id = ID[name];
			/*
			var id = function() {	//constructor for instance
				if( self.debug ) this._uuid=Math.random();
				if( self.attributes ) {
					for(var k in self.attributes) {
						this[k] = self.attributes[k];
					}
				}

				if( !extending ) {
					//console.log('**', name, this._super );
					
					var instance = this;
					var id = {_super:this};
					for(;id = id._super;) {
						id.constructor.prototype._instance = instance;
					}
				}

				if( self.initializer && !extending ) self.initializer.apply(this, self.arguments);
			};
			*/

			var members = function() {	//methods/attributes area
				this._super = members.prototype;
				//this._child = caller;
				//this._instance = caller;
				self.attributes = self.bindMembers(this, members.prototype)
			};
			/*
				var CLS = {};
				eval('CLS["' + name + '"] = function(){ ' + 
					'\t// \'' + name + '\' methods/attributes area\n' + 
					'\tthis._super = members.prototype;\n' + 
					'\tself.attributes = self.bindMembers(this, members.prototype);\n' + 
				'};');
				
				var members = CLS[name];
			*/

			if( superclass ) {			
				members.prototype = new superclass('$_ext_nonflat_', (caller || cls));
			} else if( extending && caller ) {
				//console.error(caller.prototype);
				members.prototype = caller.prototype;
			}

			id.prototype = new members;
			id.prototype.initializer = initializer;
			id.prototype.constructor = id;
		
			this.constructor.prototype = id.prototype;
			
			// bind static members
			//Class.bindStatics(id, (statics || {}));

			if( superclass ) Class.override(id, superclass);

			var instance = new id;		// return non-flat instance
			return instance;
		}

		return cls;
	};

	// bind class members to target object
	Class.prototype.bindMembers = function(target) {
		if( this.debug ) console.log('[' + this.name + '] bind members called.');
		
		var source = this.source;
		var self = this;
		
		// set $builder attribute to instance
		target.$builder = this;
		

		// setup designated prototype (attributes, methods, getters, setters)
		var bind = function(target, source, attributes) {
			// original attributes in current class
			attributes = attributes || {};

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
					if( target.hasOwnProperty(k) ) throw new TypeError('class memeber [' + k + '] was conflect.');
					var v = source[k];
					if( typeof(v) == 'function' ) target[k] = v;	//펑션은 prototype 에 위치
					else target[k] = attributes[k] = v;				//정의 속성은 scope 상에도 넣어야 하므로..
				}
			}

			return attributes;
		};

		var attributes = bind(target, source);

		// setup super (for super method calls by this scope)
		var flat = this.flat;
		var _super = target._super;
		target._parent = function(method) {
			var fn = _super[method];
			
			var args = [];
			if( arguments.length > 1 ) {
				for(var i=1;i < arguments.length; i++) {
					args.push(arguments[i]);
				}
			}

			if( fn && typeof(fn) ) {
				fn.apply( ((flat) ? this : _super), args);
			} else {
				throw new TypeError('method [' + fn + '] not exist in super class');
			}
		};

		//setup serialize insatnce attrivbutes
		var self = this;
		target.serialize = function(all, combined) {
			var o = Class.serializeAll.apply(this, [this, all, combined]);
			if( self.debug ) console.log('[' + self.name + '] serialize called(' + ((!(combined === false)) ? 'combined' : 'hierarchical') + ').', o);
			return o;
		};

		target.is = function(cls) {
			if( !cls ) return false;
			if( typeof(cls) == 'string' ) cls = Class.find(cls);
			if( !cls ) return false;

			return cls.is(this);
		};

		//setup features
		var fs = this._features;
		if( fs ) {
			for(var i=0; i < fs.length; i++) {
				var f = fs[i];
				//console.error('feature', f);
				if( f.source ) bind(target, f.source, attributes);
			}
		}

		//setup abstract
		var as = this._abstract;
		if( as ) {
			for(var k in as) {
				//if( target[k] ) throw new TypeError('abstract method [' + k + '] was conflict by class member.');
				target[k] = (function(k) {
					return function() {	// abstract proxy function
						target._instance[k].apply(target._instance, arguments);
					}
				})(k);
			}
		}

		return attributes;
	};
	
	// bind static members to cls
	Class.bindStatics = function(cls, statics) {
		if( !cls ) throw new TypeError('target class missing');
		if( typeof(cls) != 'function' ) throw new TypeError('target class must be a function');
		if( !statics ) throw new TypeError('static data missing');
		if( !(typeof(statics) == 'object' || typeof(statics) == 'function') ) throw new TypeError('static data must be a function or object');

		if( typeof(statics) == 'function' ) statics = statics.apply(cls);
		if( typeof(statics) == 'object' ) {
			for(var k in statics) {
				var v = statics[k];
				cls[k] = v;
			}
		}

		cls.getStatic = function() {
			var o = {};
			for(var k in cls) {
				//console.log(k);
				if( k == 'statics' || k.startsWith('$') ) continue;
				var v = cls[k];
				if( typeof(v) != 'function' ) {
					o[k] = v;
				}
			}
			return o;
		};
		
		if( cls.__defineGetter__ ) {
			cls.__defineGetter__('statics', function() {
				return cls.getStatic();
			});
		}

		cls.is = function(id) {
			id = {_super:id};
			for(;id = id._super;) {
				if( id.$builder ) {
					if( id instanceof cls) {
						return true;
					} else {
						//console.log(cls, id.$builder.cls, (cls === id.$builder.cls));
						var b = (cls && id.$builder.cls && id.$builder.cls === cls);
						if( b ) return true;
					}
				}
			}

			return false;
		};
		
		// set class to final
		cls.isFinal = function() {
			return this.$builder._final;
		};

		cls.setFinal = function(b) {
			if( b !== false && !b ) return;
			this.$builder._final = (b === true) ? true : false;
		};
	
		// add abstract methods
		cls.abstracts = function(obj) {
			if( obj === false ) this.$builder._abstract = null;

			if( !obj ) return this.$builder._abstract;

			if( typeof(obj) == 'function' ) {
				obj = obj.apply(obj, [this.$builder.cls, this.$builder.source]);
			}

			if( typeof(obj) == 'object' ) {
				for(var k in obj) {
					if( k && obj.hasOwnProperty(k) ) {
						v = obj[k];

						if( typeof(v) == 'function' ) {
							v = v.apply(obj, [this.$builder.cls, this.$builder.source]);
						}

						if( !this.$builder._abstract ) this.$builder._abstract = {};
						this.$builder._abstract[k] = v;
					}
				}
			}
		};

		// add features
		cls.feature = function(obj) {
			if( obj === false ) this.$builder._features = null;

			if( !obj ) return this.$builder._features;
			
			if( !this.$builder._features ) this.$builder._features = [];
			
			if( obj.length !== 0 && !obj.length ) obj = [obj];
			for(var i=0; i < obj.length; i++) {
				var f = obj[i];
				if( typeof(f) == 'string' ) f = Feature.find(f);

				if( f instanceof Feature ) {
					this.$builder._features.push(f);
				} else {
					throw new TypeError('not found feature [' + obj + ']');
				}
			}			
		};
	};

	//serialize attributes of object's all prototype chain.
	Class.serializeAll = function(obj, all, combined) {
		all = (all === true) ? true : false;
		combined = !(combined === false);

		//console.log('-- serialize (' + ((this.constructor.prototype.$builder) ? this.constructor.prototype.$builder.name : 'unknwon') + ')', obj, obj._super);

		var o = {};
		var c;

		var id = {_super:obj};
		var args = [];
		for(;id = id._super;) {
			if( combined ) {
				args.push(id);
			} else {
				var name = Class.getName(id);
				if( !name ) break;

				if( !c ) o = c = {};
				else c = c[name] = {};
				
				for(var k in id) {
					if( !k || k == 'constructor' || (!all && k.startsWith('_')) ) continue;

					if(id.__lookupGetter__ && id.__lookupGetter__(k)) {
						c[k] = id[k];
					} else {
						var v = id[k];
						if( v && id.hasOwnProperty(k) && typeof(v) !== 'function' ) {
							c[k] = v;
						}
					}
				}
			}

			if( Class.isFlat(id) ) break;
		}

		if( combined && args && args.length >= 1 ) {
			for(var i=args.length-1;i >= 0;i--) {
				var id = args[i];
				for(var k in id) {
					if( !k || k == 'constructor' || (!all && k.startsWith('_')) ) continue;

					if(id.__lookupGetter__ && id.__lookupGetter__(k)) {
						o[k] = id[k];
					} else {
						var v = id[k];
						if( v && id.hasOwnProperty(k) && typeof(v) !== 'function' ) {
							o[k] = v;
						}
					}
				}				
			}
		}

		//console.log('serialize result', o);

		return o;
	};

	Class.getName = function(cls) {
		if( !cls ) return null;
		if( typeof(cls) == 'string' ) cls = Class.find(cls);
		if( !cls ) return null;
 		return (cls.$builder) ? cls.$builder.name : null;
	};

	Class.isFlat = function(cls) {
		if( !cls ) return null;
		if( typeof(cls) == 'string' ) cls = Class.find(cls);		
		if( !cls ) return null;
 		return (cls.$builder) ? cls.$builder.flat : true;
	};

	Class.override = function(base, superclass) {		
		if( !base || typeof(base) != 'function' ) throw new TypeError('base class must be a function');
		if( !superclass || typeof(superclass) != 'function' ) throw new TypeError('super class must be a function');
			
		var sc = superclass.prototype;
		var bc = base.prototype;

		//console.log('-- overriding (' + bc.$builder.name + ')----------------------------');
		//console.log('superclass.prototype', sc);
		//console.log('base.prototype', bc);
		//console.log('superclass name', sc.$builder.name);
		
		var Override = {};
		for(var k in sc) {
			if( !k || k.startsWith('$') || k == 'serialize' || k == 'init' || k == 'initialize' || (sc.$builder && k == sc.$builder.name) ) continue;				
			
			if( sc.hasOwnProperty(k) && !bc.hasOwnProperty(k) ) {
				//console.log('key: ', k);
				
				var g,s;
				if( sc.__lookupGetter__ ) {
					g = sc.__lookupGetter__(k);
					s = sc.__lookupSetter__(k);
				}
				
				if( g || s ) {
					//TODO : 같은 애트리뷰트가 상위의 getter/setter 일 수 있으므로... 체크해야 한다.

					if ( g ) {
						/*eval('Override["' + sc.$builder.name + '.' + k + '"] = function() {' + 
							'//** override getter call [' + sc.$builder.name + '.' + k + ']"\n' + 
							'return this._super["' + k + '"];\n' + 
						'}');

						bc.__defineGetter__(k, Override[sc.$builder.name + '.' + k]);*/
						var fn = function(k) {
							if( k.startsWith('_') ) {
								return function() {	//private override getter
									throw new ReferenceError('super getter [' + k + '] is private.');
								};
							} else {
								return function() {	//override getter
									return this._super[k];
								};
							}
						}(k);
						bc.__defineGetter__(k, fn);
					}

					if( s ) {
						/*eval('Override["' + sc.$builder.name + '.' + k + '"] = function(value) {' + 
							'//** override setter call [' + sc.$builder.name + '.' + k + ']"\n' + 
							'this._super["' + k + '"] = value;\n' + 
						'}');
						bc.__defineSetter__(k, Override[sc.$builder.name + '.' + k]);*/
						var fn = function(k) {
							if( k.startsWith('_') ) {
								return function() {	//private override setter
									throw new ReferenceError('super setter [' + k + '] is private.');
								};
							} else {
								return function(v) {	//override setter
									this._super[k] = v;
								};
							}
						}(k);
						bc.__defineGetter__(k, fn);
					}
				} else if( typeof(sc[k]) == 'function' ) {
					//console.log('function: ', k);
					/*eval('Override["' + sc.$builder.name + '.' + k + '"] = function() {' + 
							'//** override method call ' + sc.$builder.name + '.' + k + ']"\n' + 
						'this._super["' + k + '"].apply(this._super, arguments);\n' + 
					'}');
					bc[k] = Override[sc.$builder.name + '.' + k];
					*/
					var fn = function(k) {
						if( k.startsWith('_') ) {
							return function() {	//private override
								throw new ReferenceError('super method [' + k + '] is private.');
							};
						} else {
							return function() {	//override
								this._super[k].apply(this._super, arguments);
							};
						}
					}(k);
					bc[k] = fn;
				}
			}
		}

		//console.log('-----------------------------------------------');
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
					var m = source[k];
					
					if( !m ) {
						throw new TypeError('Class [' + name + '.' + k + '] must be defined. according to [' + pname + ']');
					} else if( typeof(m) != 'function' ) {
						throw new TypeError('Class [' + name + '.' + k + '] must be a function. according to [' + pname + ']');
					} else if( typeof(d) == 'function' ) {
						if( !d.apply(protocol, [m, source, this]) ) throw new TypeError('Class [' + name + '.' + k + '] invalid. according to [' + pname + ']');
					} else if( d !== true && d >= 0 && m.length !== d ) {
						throw new TypeError('Class [' + name + '.' + k + '] has wrong arguments length(defined ' + d + ' but has ' + m.length + '). according to [' + pname + ']');
					}
				}
			}
		},
		is: function(cls) {
			return false;
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

		this.source = source;
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