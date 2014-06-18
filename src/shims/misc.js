(function () {
	"use strict";

	var global = (typeof global === 'undefined') ? window : global;

	if( !global.console ) {
		global.console = {
			debug: function() {},
			dir: function() {},
			error: function() {},
			info: function() {},
			log: function() {},
			trace: function() {},
			warn: function() {}
		};
	}
	
	if( !String.prototype.ltrim ) {
		String.prototype.ltrim = function() {
			return this.replace(/(^ *)/g, "");
		};
	}

	if( !String.prototype.rtrim ) {
		String.prototype.rtrim = function() {
			return this.replace(/( *$)/g, "");
		};
	}

	if( !String.prototype.trim ) {
		String.prototype.trim = function() {
			return this.replace(/(^ *)|( *$)/g, "");
		};
	}

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


	// Date
	if( !Date.parseISO ) {
		Date.parseISO = function (string) {
			var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
				"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
				"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
			var d = string.match(new RegExp(regexp));

			var offset = 0;
			var date = new Date(d[1], 0, 1);

			if (d[3]) { date.setMonth(d[3] - 1); }
			if (d[5]) { date.setDate(d[5]); }
			if (d[7]) { date.setHours(d[7]); }
			if (d[8]) { date.setMinutes(d[8]); }
			if (d[10]) { date.setSeconds(d[10]); }
			if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
			if (d[14]) {
				offset = (Number(d[16]) * 60) + Number(d[17]);
				offset *= ((d[15] == '-') ? 1 : -1);
			}

			offset -= date.getTimezoneOffset();
			time = (Number(date) + (offset * 60 * 1000));
			date.setTime(Number(time));

			return date;
		};
	}
	
	if( !Date.prototype.diff ) {
		Date.prototype.diff = function(d, m) {
			var c = (1000*60*60*24);

			if( m == 'sec' || m == 's' ) c = 1000;
			else if( m == 'min' || m == 'm' ) c = (1000*60);
			else if( m == 'hour' || m == 'h' ) c = (1000*60*60);
			else if( m == 'month' || m == 'M' ) return this.getMonth() - d.getMonth();
			else if( m == 'year' || m == 'y' ) return this.getYear() - d.getYear();

			return (this-d)/c;
		};
	}
	
	(function() {
		/*
		 * Date Format 1.2.3
		 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
		 * MIT license
		 *
		 * Includes enhancements by Scott Trenda <scott.trenda.net>
		 * and Kris Kowal <cixar.com/~kris.kowal/>
		 *
		 * Accepts a date, a mask, or a date and a mask.
		 * Returns a formatted version of the given date.
		 * The date defaults to the current date/time.
		 * The mask defaults to dateFormat.masks.default.
		 */
		var dateFormat = function () {
			var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
				timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
				timezoneClip = /[^-+\dA-Z]/g,
				pad = function (val, len) {
					val = String(val);
					len = len || 2;
					while (val.length < len) val = "0" + val;
					return val;
				};

			// Regexes and supporting functions are cached through closure
			return function (date, mask, utc) {
				var dF = dateFormat;

				// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
				if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
					mask = date;
					date = undefined;
				}

				// Passing date through Date applies Date.parse, if necessary
				date = date ? new Date(date) : new Date;
				if (isNaN(date)) throw SyntaxError("invalid date");

				mask = String(dF.masks[mask] || mask || dF.masks["default"]);

				// Allow setting the utc argument via the mask
				if (mask.slice(0, 4) == "UTC:") {
					mask = mask.slice(4);
					utc = true;
				}

				var	_ = utc ? "getUTC" : "get",
					d = date[_ + "Date"](),
					D = date[_ + "Day"](),
					m = date[_ + "Month"](),
					y = date[_ + "FullYear"](),
					H = date[_ + "Hours"](),
					M = date[_ + "Minutes"](),
					s = date[_ + "Seconds"](),
					L = date[_ + "Milliseconds"](),
					o = utc ? 0 : date.getTimezoneOffset(),
					flags = {
						d:    d,
						dd:   pad(d),
						ddd:  dF.i18n.dayNames[D],
						dddd: dF.i18n.dayNames[D + 7],
						m:    m + 1,
						mm:   pad(m + 1),
						mmm:  dF.i18n.monthNames[m],
						mmmm: dF.i18n.monthNames[m + 12],
						yy:   String(y).slice(2),
						yyyy: y,
						h:    H % 12 || 12,
						hh:   pad(H % 12 || 12),
						H:    H,
						HH:   pad(H),
						M:    M,
						MM:   pad(M),
						s:    s,
						ss:   pad(s),
						l:    pad(L, 3),
						L:    pad(L > 99 ? Math.round(L / 10) : L),
						t:    H < 12 ? "a"  : "p",
						tt:   H < 12 ? "am" : "pm",
						T:    H < 12 ? "A"  : "P",
						TT:   H < 12 ? "AM" : "PM",
						Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
						o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
						S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
					};

				return mask.replace(token, function ($0) {
					return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
				});
			};
		}();

		// Some common format strings
		dateFormat.masks = {
			"default":      "ddd mmm dd yyyy HH:MM:ss",
			shortDate:      "m/d/yy",
			mediumDate:     "mmm d, yyyy",
			longDate:       "mmmm d, yyyy",
			fullDate:       "dddd, mmmm d, yyyy",
			shortTime:      "h:MM TT",
			mediumTime:     "h:MM:ss TT",
			longTime:       "h:MM:ss TT Z",
			isoDate:        "yyyy-mm-dd",
			isoTime:        "HH:MM:ss",
			isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
			isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
		};

		// Internationalization strings
		dateFormat.i18n = {
			dayNames: [
				"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			]
		};

		// For convenience...
		Date.prototype.format = function (mask, utc) {
			return dateFormat(this, mask, utc);
		};
	})();
	

	// Array
	if( !Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(v,from) {
			var length = this.length;
			if( typeof(from) !== 'number' || from < 0 ) return -1;
			for(var i=from; i < length; i++) {
				if(this[i] === v) {
					return i;
				}
			}

			return -1;
		};
	}

	if ( !Array.prototype.forEach ) {
		Array.prototype.forEach = function(fn, scope) {
			for(var i = 0, len = this.length; i < len; ++i) {
				fn.call(scope, this[i], i, this);
			}
		};
	}

	if (!Array.prototype.some) {
		Array.prototype.some = function(fun /*, thisp */) {
			"use strict";

			if (this == null) throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun != "function") throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t && fun.call(thisp, t[i], i, t)) return true;
			}

			return false;
		};
	}

	if (!Array.prototype.every ) {
		Array.prototype.every = function(fun /*, thisp */) {
			"use strict";

			if (this == null) throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun != "function") throw new TypeError();

			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t && !fun.call(thisp, t[i], i, t)) return false;
			}

			return true;
		};
	}

	if (!Array.prototype.reduce) {
		Array.prototype.reduce = function reduce(accumulator){
			if (this===null || this===undefined) throw new TypeError("Object is null or undefined");
			var i = 0, l = this.length >> 0, curr;

			if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
			throw new TypeError("First argument is not callable");

			if(arguments.length < 2) {
				if(l === 0) throw new TypeError("Array length is 0 and no second argument");
				curr = this[0];
				i = 1; // start accumulating at the second element
			} else curr = arguments[1];

			while (i < l) {
				if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
				++i;
			}

			return curr;
		};
	}

	if( !Array.isArray ) {
		Array.isArray = function isArray(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
	}

	// Production steps of ECMA-262, Edition 5, 15.4.4.19
	// Reference: http://es5.github.com/#x15.4.4.19
	if( !Array.prototype.map ) {
		Array.prototype.map = function(callback, thisArg) {
			var T, A, k;

			if (this == null) {
				throw new TypeError(" this is null or not defined");
			}

			var O = Object(this);
			var len = O.length >>> 0;
			if (typeof callback !== "function") {
				throw new TypeError(callback + " is not a function");
			}

			if (thisArg) {
				T = thisArg;
			}

			A = new Array(len);
			k = 0;
			while(k < len) {
				var kValue, mappedValue;
				if (k in O) {
					kValue = O[ k ];
					mappedValue = callback.call(T, kValue, k, O);
					A[ k ] = mappedValue;
				}
				k++;
			}

			return A;
		};      
	}

	// ES6 Map shim
	if( !global.Map ) {
		var Map = function() {
			this.k = [];
			this.v = [];
			this.size = 0;
		};

		Map.prototype = {
			get: function(k) {
				return this.v[this.k.indexOf(k)];
			},
			set: function(k, v) {
				var i = this.k.indexOf(k);
				if( i >= 0 ) {
					this.k[i] = v;
				} else {
					this.k.push(k);
					this.v.push(v);
				}
				
				this.size = this.k.length;
			},
			remove: function(k) {
				var i = this.k.indexOf(k);
				if( i >= 0 ) {
					this.k.remove(i);
					this.v.remove(i);
					this.size = this.k.length;
					return true;
				}
				return false;
			},
			has: function(k) {
				return (this.k.indexOf(k) >= 0);
			},
			indexOf: function(k) {
				return this.k.indexOf(k);
			},
			keys: function() {
				return this.k;
			},
			values: function() {
				return this.v;
			},
			clear: function() {
				this.k = [];
				this.v = [];
				this.size = 0;
			}
		};
		
		// custom method
		Map.prototype.getKeyByValue = function(v) {	
			var argk = this.keys();
			var argv = this.values();
			return argk[argv.indexOf(v)];
		};

		Map.prototype.toObject = function() {
			var keys = this.keys();
			var o = {};
			for(var i=0; i < keys.length; i++) {
				var k = keys[i];
				o[k] = this.get(k);
			}

			return o;
		};
		
		global.Map = Map;
	}



	if( !global.JSON ) {
		global.JSON = {};
		
		(function () {
			function f(n) {
				return n < 10 ? '0' + n : n;
			}

			if (typeof Date.prototype.toJSON !== 'function') {

				Date.prototype.toJSON = function (key) {

					return isFinite(this.valueOf()) ?
						this.getUTCFullYear()     + '-' +
						f(this.getUTCMonth() + 1) + '-' +
						f(this.getUTCDate())      + 'T' +
						f(this.getUTCHours())     + ':' +
						f(this.getUTCMinutes())   + ':' +
						f(this.getUTCSeconds())   + 'Z' : null;
				};

				String.prototype.toJSON      =
					Number.prototype.toJSON  =
					Boolean.prototype.toJSON = function (key) {
						return this.valueOf();
					};
			}

			var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
				escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
				gap,
				indent,
				meta = {    // table of character substitutions
					'\b': '\\b',
					'\t': '\\t',
					'\n': '\\n',
					'\f': '\\f',
					'\r': '\\r',
					'"' : '\\"',
					'\\': '\\\\'
				},
				rep;


			function quote(string) {
				escapable.lastIndex = 0;
				return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
					var c = meta[a];
					return typeof c === 'string' ? c :
						'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"' : '"' + string + '"';
			}


			function str(key, holder) {
				var i,          // The loop counter.
					k,          // The member key.
					v,          // The member value.
					length,
					mind = gap,
					partial,
					value = holder[key];

				if (value && typeof value === 'object' &&
						typeof value.toJSON === 'function') {
					value = value.toJSON(key);
				}

				if (typeof rep === 'function') {
					value = rep.call(holder, key, value);
				}

				switch (typeof value) {
				case 'string':
					return quote(value);
				case 'number':
					return isFinite(value) ? String(value) : 'null';
				case 'boolean':
				case 'null':
					return String(value);
				case 'object':
					if (!value) {
						return 'null';
					}

					gap += indent;
					partial = [];

					if (Object.prototype.toString.apply(value) === '[object Array]') {
						length = value.length;
						for (i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || 'null';
						}

						v = partial.length === 0 ? '[]' : gap ?
							'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
							'[' + partial.join(',') + ']';
						gap = mind;
						return v;
					}

					if (rep && typeof rep === 'object') {
						length = rep.length;
						for (i = 0; i < length; i += 1) {
							if (typeof rep[i] === 'string') {
								k = rep[i];
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}
					} else {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = str(k, value);
								if (v) {
									partial.push(quote(k) + (gap ? ': ' : ':') + v);
								}
							}
						}
					}

					v = partial.length === 0 ? '{}' : gap ?
						'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
						'{' + partial.join(',') + '}';
					gap = mind;
					return v;
				}
			}

			if (typeof JSON.stringify !== 'function') {
				JSON.stringify = function (value, replacer, space) {
					var i;
					gap = '';
					indent = '';

					if (typeof space === 'number') {
						for (i = 0; i < space; i += 1) {
							indent += ' ';
						}
					} else if (typeof space === 'string') {
						indent = space;
					}

					rep = replacer;
					if (replacer && typeof replacer !== 'function' &&
							(typeof replacer !== 'object' ||
							typeof replacer.length !== 'number')) {
						throw new Error('JSON.stringify');
					}

					return str('', {'': value});
				};
			}

			if (typeof JSON.parse !== 'function') {
				JSON.parse = function (text, reviver) {
					var j;

					function walk(holder, key) {
						var k, v, value = holder[key];
						if (value && typeof value === 'object') {
							for (k in value) {
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									v = walk(value, k);
									if (v !== undefined) {
										value[k] = v;
									} else {
										delete value[k];
									}
								}
							}
						}
						return reviver.call(holder, key, value);
					}

					text = String(text);
					cx.lastIndex = 0;
					if (cx.test(text)) {
						text = text.replace(cx, function (a) {
							return '\\u' +
								('0000' + a.charCodeAt(0).toString(16)).slice(-4);
						});
					}

					if (/^[\],:{}\s]*$/
							.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
								.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
								.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
						j = eval('(' + text + ')');

						return typeof reviver === 'function' ?
							walk({'': j}, '') : j;
					}

					throw new SyntaxError('JSON.parse');
				};
			}
		}());
	}


	// Hmm...
	if( false ) {
		if( !Array.prototype.remove ) {
			//! Array Remove - By John Resig (MIT Licensed)
			Array.prototype.remove = function(from, to) {
				if( from && typeof(from) !== 'number' ) from = this.indexOf(from);
				if( to && typeof(to) !== 'number' ) to = this.indexOf(to);

				var rest = this.slice((to || from) + 1 || this.length);
				this.length = from < 0 ? this.length + from : from;
				return this.push.apply(this, rest);
			};
		}

		Array.iteratable = function(o) {
			if( typeof(o) === 'string' || typeof(o) === 'number' || typeof(o) === 'boolean' ) return false;

			if( o instanceof Array ) return true;
			else if( Array.isArray(o) ) return true;
			else if( o.hasOwnProperty('length') && typeof(o.length) === 'number' ) return true;

			return false;
		};

		var pattern = new RegExp('[{][\\w:\\w\\-]+[}]', 'igm');
		String.prototype.build = function(o) {
			if( !o ) return this;

			var s = this;

			var m = s.match(pattern);
			if( m ) {
				for(var i=0, pos; i < m.length; i++) {
					var match = m[i];
					var key = match.substring(1, match.length -1);
					var fn = ((pos = key.indexOf(':')) >= 0) ? key.substring(pos + 1) : null;
					key = (pos >= 0) ? key.substring(0, pos) : key;

					var value = (fn) ? ((typeof(o[fn]) == 'function') ? o[fn].apply(this, [o[key], o, o]) : o[key]) : o[key];
					
					if( value == null || value == undefined ) value = key;
					s = s.split(match).join(value);
				}
			}

			return s;
		};
	
		String.prototype.zf = function(length) {
			var s = '';
			var i = 0;
			var limit = length - this.length;
			while (i++ < limit) {
				s += '0';
			}
			return s + this;
		};
	}
}());




// ES6 Map shim
if( !global.Map ) {
	var Map = function() {
		this.k = [];
		this.v = [];
		this.size = 0;
	};

	Map.prototype = {
		get: function(k) {
			return this.v[this.k.indexOf(k)];
		},
		set: function(k, v) {
			var i = this.k.indexOf(k);
			if( i >= 0 ) {
				this.k[i] = v;
			} else {
				this.k.push(k);
				this.v.push(v);
			}
			
			this.size = this.k.length;
		},
		"delete": function(k) {
			var i = this.k.indexOf(k);
			if( i >= 0 ) {
				this.k.remove(i);
				this.v.remove(i);
				this.size = this.k.length;
				return true;
			}
			return false;
		},
		items: function() {
			var arg = [];
			for (var i = 0; i < this.k.length; i++) {
				arg.push([this.k[i], this.v[i]]);
			}
			return arg;
		},
		has: function(k) {
			return (this.k.indexOf(k) >= 0);
		},
		indexOf: function(k) {
			return this.k.indexOf(k);
		},
		keys: function() {
			return this.k;
		},
		values: function() {
			return this.v;
		},
		clear: function() {
			this.k = [];
			this.v = [];
			this.size = 0;
		}
	};
	
	if( Object.defineProperty ) 
		Object.defineProperty(Map.prototype, "iterator", {configurable: true, writable: true, value: Map.prototype.items})
	
	global.Map = Map;;
}