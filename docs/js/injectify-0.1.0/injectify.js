(function () {
	"use strict";

	var global = (typeof global === 'undefined') ? window : global;

	if( !global.console ) {
		global.console = {
			assert: function() {},
			constructor: function() {},
			count: function() {},
			debug: function() {},
			dir: function() {},
			dirxml: function() {},
			error: function() {},
			group: function() {},
			groupCollapsed: function() {},
			groupEnd: function() {},
			info: function() {},
			log: function() {},
			markTimeline: function() {},
			profile: function() {},
			profileEnd: function() {},
			time: function() {},
			timeEnd: function() {},
			trace: function() {},
			warn: function() {}
		};
	}

	if( typeof document !== 'undefined' ) {
		document.qry = function(k) {
			k = k.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS = "[\\?&]"+k+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( global.location.href );
			if( results == null ) {
				return "";
			} else {
				return results[1];
			}
		};
	}

	Number.prototype.toDecimalFormat = function(f){
		var c, d, t;

		var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	};

	Number.prototype.zf = function(len){return this.toString().zf(len);};

	String.prototype.toDecimalFormat = function(f) {
		var n = parseInt(this);
		if( !n ) return null;
		return n.toDecimalFormat(f);
	};

	String.prototype.isKoreanOnly = function() {
		for(var i=0; i < this.length; i++){ 
			var c = this.charCodeAt(i); 

			//( 0xAC00 <= c && c <= 0xD7A3 ) 초중종성이 모인 한글자 
			//( 0x3131 <= c && c <= 0x318E ) 자음 모음 

			if( !( ( 0xAC00 <= c && c <= 0xD7A3 ) || ( 0x3131 <= c && c <= 0x318E ) ) ) {      
				return false; 
			}
		}  
		return true;
	};

	String.prototype.isEnglishAndDigit = function() {
		for( var i=0; i < this.length;i++){          
			var c = this.charCodeAt(i);       
			if( !((  0x61 <= c && c <= 0x7A ) || ( 0x41 <= c && c <= 0x5A ) || (  0x30 <= c && c <= 0x39 )) ) {
				return false;
			}
		}      
		return true;
	};

	String.prototype.isEnglishOnly = function() {		   
		for( var i=0; i < this.length;i++){          
			var c = this.charCodeAt(i);       
			if( !( (  0x61 <= c && c <= 0x7A ) || ( 0x41 <= c && c <= 0x5A ) ) ) return false;
		}      
		return true;
	};

	String.prototype.isDigitOnly = function() {
		return !(/[^0-9]/i).test(this);
	};
		
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
	
	if( !String.prototype.replaceAll ) {
		String.prototype.replaceAll = function(find, replace) {
			return this.replace(new RegExp(find, 'g'), replace);
		};
	}
	
	if( true ) {
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
					s = s.replaceAll(match, value);
				}
			}

			return s;
		};

		/*var a = '/api/{realmId}/{module}';
		console.log(a.build({
			realmId: 'bbb',
			module: 'aaa'
		}));*/
	}
	
	if( true ) {
		var string = function(str, len){
			var s = '';
			var i = 0;
			while (i++ < len) {
				s += str;
			}
			return s;
		};
		String.prototype.zf = function(length) {
			return string('0', length - this.length) + this;
		};
	}


	// Date
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

	Date.prototype.format = function(f) {
		if (!this.valueOf()) return " ";
	 
		var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
		var d = this;
		 
		return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
			switch ($1) {
				case "yyyy": return d.getFullYear();
				case "yy": return (d.getFullYear() % 1000).zf(2);
				case "MM": return (d.getMonth() + 1).zf(2);
				case "dd": return d.getDate().zf(2);
				case "E": return weekName[d.getDay()];
				case "HH": return d.getHours().zf(2);
				case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
				case "mm": return d.getMinutes().zf(2);
				case "ss": return d.getSeconds().zf(2);
				case "a/p": return d.getHours() < 12 ? "오전" : "오후";
				default: return $1;
			}
		});
	};
	Date.prototype.diff = function(d, m) {
		var c = (1000*60*60*24);

		if( m == 'sec' || m == 's' ) c = 1000;
		else if( m == 'min' || m == 'm' ) c = (1000*60);
		else if( m == 'hour' || m == 'h' ) c = (1000*60*60);
		else if( m == 'month' || m == 'M' ) return this.getMonth() - d.getMonth();
		else if( m == 'year' || m == 'y' ) return this.getYear() - d.getYear();

		return (this-d)/c;
	};
	
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

	if ( !Array.prototype.contains ) {
		Array.prototype.contains = function(v) {
			return (this.indexOf(v) >= 0);
		};
	}

	if ( !Array.prototype.forEach ) {
		Array.prototype.forEach = function(fn, scope) {
			for(var i = 0, len = this.length; i < len; ++i) {
				fn.call(scope, this[i], i, this);
			}
		};
	}

	if ( !Array.prototype.remove ) {
		//! Array Remove - By John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
			if( from && typeof(from) !== 'number' ) from = this.indexOf(from);
			if( to && typeof(to) !== 'number' ) to = this.indexOf(to);

			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		};
	}

	if (!Array.isArray) {
		Array.isArray = function isArray(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
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
}());


/*
var d = {d:1};
var map = new Map();
map.set('a', 1);
map.set('b', {b:1});
map.set('c', 'ccc');
map.set(d, 'ddd');

console.log(map.keys(), map.values());

console.log('b', map.get('b'));
console.log('d', map.get(d));
map.remove('a');
map.remove(d);
console.log(map.keys(), map.values());


var args = ['0','1','2','3','4','5','6'];
console.log(args.indexOf('2','3'));
console.log(args.indexOf2('2','3'));
*/(function() {
	"use strict"

	var Ajax = {
		toqry: function(obj) {
			if( !obj || typeof(obj) != 'object' ) return '';
			
			var s = '';
			var first = true;
			for(var k in obj) {
				var v = obj[k];
				var type = typeof(v);
				if( type == 'string' || type == 'number' || type == 'boolean' ) {
					v = encodeURIComponent(v);
					if( k ) s += ( ((first) ? '':'&') + k + '=' + v);
					first = false;
				}
			}

			return s;
		},
		get: function(url, qry, fn) {
			if( !fn && typeof(qry) == 'function' ) fn = qry;
			if( !url ) {
				if( fn ) fn('url missing');
				else throw new Error('url missing');
			}
			
			if( fn ) {			
				this.ajax(url).qry(qry).get().complete(
					function(err,data) {
						fn(err,data);
					}
				);
			} else {
				return this.ajax(url).qry(qry).get().sync();
			}
		},
		string2xml: function(text){
			if( window.ActiveXObject ) {
				var doc=  new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(text);
			} else {
				var parser=new DOMParser();
				var doc=parser.parseFromString(text, 'text/xml');
			}
			return doc;
		},
		ajax: function(url) {
			var self = this;
			var config = {
				debug: false,
				method: 'get',
				url: url,
				timeout: 10000,
				sync: false,
				cache: false,
				charset: 'utf-8',
				parse: true,
				contentType: 'application/json',
				accept: 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
			};

			var handler = null;

			var execute = function() {
				var fns, err, payload, loaded = false, status, statusText, contentType, parsed = false;
				handler = {
					complete: function(fn) {
						fns.listeners.complete.push(fn);
						fns.commit();
						return this;
					},
					success: function(fn) {
						fns.listeners.success.push(fn);
						fns.commit();
						return this;
					},
					error: function(fn) {
						fns.listeners.error.push(fn);
						fns.commit();
						return this;
					}
				};

				var o = config;
				
				if( o.debug ) console.log('ajax \'' + o.url + '\'', o);
				
				fns = {
					listeners: {complete:[],success:[],error:[]},
					complete: function() {
						var l = this.listeners.complete, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(item, args);
								else throw new Error('compolete listener is not a function.');
							});
						}
					},
					success: function() {
						var l = this.listeners.success, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(item, args);
								else throw new Error('compolete listener is not a function.');
							});
						}
					},
					error: function() {
						var l = this.listeners.error, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(item, args);
								else throw new Error('compolete listener is not a function.');
							});
						}
					},
					commit: function() {
						if( loaded ) {
							if( o.debug ) console.log('- ' + o.url + ' -----------------------------------');
							if( o.debug ) console.log('error:', err);
							if( o.debug ) console.log('payload:', payload);
							if( o.debug ) console.log('status:', status);
							if( o.debug ) console.log('statusText:', statusText);
							if( o.debug ) console.log('contentType:', contentType);
							if( o.debug ) console.log('xhr:', xhr);
							
							var data = payload;
							if( data && !parsed ) {
								if( o.parse !== false && contentType && contentType.indexOf('json') >= 0 && data ) {
									try {
										var json = JSON.parse(data);
										data = json;
									} catch(e) {
										console.error('json parse error:', e.message, '[in ' + url + ']');
									}
								} else if( o.parse !== false && contentType && contentType.indexOf('xml') >= 0 && data ) {
									data = self.string2xml(data);
								}

								parsed = true;
							}

							if( o.debug ) console.log('data:', data);
							
							if( o.interceptor ) {
								if( o.debug ) console.log('call interceptor');
								o.interceptor({
									config: o,
									error: err,
									xhr: o.xhr,
									payload: payload,
									data: data,
									statusText: statusText,
									contentType: contentType,
									handler: this
								});
							} else {
								if( o.debug ) console.log('call listeners');
								if( err ) this.error(err, data, payload, xhr);
								else this.success(data, payload, xhr);

								this.complete(err, data, payload, xhr);
							}
						}
					}
				};

				if( o.success ) fns.listeners.success.push(o.success);
				if( o.error ) fns.listeners.error.push(o.error);
				if( o.complete ) fns.listeners.complete.push(o.complete);
				
				var url = o.url;
				var qry = self.toqry(o.qry) || '';
				if( url.indexOf('?') > 0 ) url += ((!o.cache ? '&nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));
				else url += ((!o.cache ? '?nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));

				//console.log('qry', o.qry, url);

				var xhr = new XMLHttpRequest();
				xhr.open(o.method, url, !o.sync);
				xhr.timeout = o.timeout;
				xhr.ontimeout = function(){err = 'timeout';};
				if( o.accept ) xhr.setRequestHeader("Accept", o.accept);			

				var onload = function () {
					payload = xhr.responseText || '';
					status = xhr.status;
					statusText = xhr.statusText;
					contentType = xhr.getResponseHeader('Content-Type');
					loaded = true;

					if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 204)) {
						err = null;
					} else {
						err = statusText || status;
					}

					fns.commit();
				};

				var onerror = function() {
					payload = xhr.responseText || '';
					status = xhr.status;
					statusText = xhr.statusText;
					contentType = xhr.getResponseHeader('Content-Type');
					loaded = true;
					err = statusText || status || 'unknown ajax error';

					fns.commit();
				};
				
				if( xhr.addEventListener ) {
					//req.addEventListener("progress", onprogress, false);
					xhr.addEventListener("load", onload, false);
					xhr.addEventListener("error", onerror, false);
					xhr.addEventListener("abort", onerror, false);
				} else {
					xhr.onload = onload;
					xhr.onerror = onerror;
					xhr.onabort = onerror;
				}
				
				try {
					if( o.data ) {
						if( typeof(o.data) === 'object' ) o.data = JSON.stringify(o.data);

						xhr.setRequestHeader('Content-Type', o.contentType + '; charset=' + o.charset);
						xhr.send(o.data);
					} else {
						xhr.send();
					}
				} catch(e) {
					err = e;
					status = -1;
					statusText = 'script error:' + e;
					loaded = true;
					fns.commit();
				}

				if( o.sync === true ) {
					if( err ) {
						var error = new Error(err);
						error.payload = payload;
						throw error;
					} else {
						return payload;
					}
				}

				return handler;
			};

			if( typeof(url) === 'object' ) {
				for(var k in url) {
					config[k] = url[k];
				}

				return execute();
			}

			return {
				qry: function(qry) {
					if( !qry ) return this;
					config.qry = qry;
					return this;
				},
				debug: function(b) {
					if( b !== true && b !== false ) b = true;
					config.debug = b;
					return this;
				},
				cache: function(b) {
					if( b !== true && b !== false ) b = true;
					config.cache = b;
					return this;
				},
				parse: function(b) {
					if( b !== true && b !== false ) b = true;
					config.parse = b;
					return this;
				},
				url: function(url) {
					if( !url ) return this;
					config.url = url;
					return this;
				},
				contentType: function(type) {				
					if( !type ) return this;
					config.contentType = type;
					return this;
				},
				charset: function(charset) {				
					if( !charset ) return this;
					config.charset = charset;
					return this;
				},
				accept: function(accept) {
					if( !accept ) return this;
					config.accept = accept;
					return this;
				},
				post: function(payload) {
					config.method = 'post';
					if( payload ) config.payload = payload;
					return this;
				},
				put: function(payload) {
					config.method = 'put';
					if( payload ) config.payload = payload;
					return this;
				},
				get: function() {
					config.method = 'get';
					return this;
				},
				options: function() {
					config.method = 'options';
					return this;
				},
				del: function() {
					config.method = 'delete';
					return this;
				},
				interceptor: function(fn) {
					config.interceptor = fn;
					return this;
				},
				listeners: function(listeners) {
					if( listeners.success ) config.success = listeners.success;
					if( listeners.error ) config.error = listeners.error;
					if( listeners.complete ) config.complete = listeners.complete;

					return this;
				},
				
				// execute
				execute: function() {
					if( handler ) throw new Error('already executed');
					return execute();
				},
				sync: function() {
					if( handler ) throw new Error('already executed');
					config.sync = true;
					return execute();
				},
				complete: function(fn) {
					if( !handler ) execute();
					handler.complete(fn);
					return handler;
				},
				success: function(fn) {
					if( !handler ) execute();
					handler.success(fn);
					return handler;
				},
				error: function(fn) {
					if( !handler ) execute();
					handler.error(fn);
					return handler;
				}
			};
		}
	};

	window.Ajax = Ajax;
})();(function() {
	var seq = 100;

	function EventDispatcher(listeners) {
		this.id = 'event-dispatcher-' + seq++;
		this.listeners(listeners);
	}

	EventDispatcher.prototype = {
		listeners: function(listeners) {
			if( !this._listeners ) this._listeners = {};
			if( arguments.length <= 0 ) return this._listeners;
					
			if( typeof(listeners) !== 'object' ) throw new Error('invalid listeners:' + listeners);
			for(var k in listeners) {
				if( !listeners.hasOwnProperty(k) ) continue;
				
				if( k === 'id' ) {
					if( listeners[k] ) this.id = listeners[k];
				} else if( k === 'scope' ) {
					this.eventScope(listeners[k]);
				} else if( k === 'src' ) {
					this.eventSource(listeners[k]);
				} else {
					var handler = listeners[k];
					if( handler ) this.on(k, handler, handler.bubble, handler.singleton);
				}
			}
		},
		eventScope: function(scope) {
			if( arguments.length <= 0 ) return this._listeners.scope || {};

			this._listeners.scope = scope;
		},
		eventSource: function(src) {
			if( arguments.length <= 0 ) return this._listeners.src || this;

			this._listeners.src = src;
		},
		on: function(action, fn, bubble, notaddifexist) {
			if( action == 'id' || action == 'scope' || action == 'src' ) throw new Error('invalid action name:' + action);
			if( !this._listeners ) throw new Error('_listeners not defined. illegal state');
			
			if( typeof(fn) === 'object' ) fn = fn.handleEvent;

			if( !action || typeof(fn) != 'function' || action == 'id' ) throw new Error('invalid event handler');
			
			var ls = this._listeners;
			if( !ls[action] ) {
				ls[action] = [];
			}
			
			if( ls[action].indexOf(fn) === -1 ) {
				if( notaddifexist === true ) {
					if( ls[action].length > 0 ) return;
				}

				fn.__bubble__ = bubble;
				ls[action].push(fn);
				this.fireSync('event.on', {
					eventType: action,
					eventHandler: fn,
					eventBubble: bubble
				});
			}

			return this;
		},
		hasOn: function(action) {
			if( action == 'id' || action == 'scope' || action == 'src' ) return false;
			if( !this._listeners ) throw new Error('_listeners not defined. illegal state');
			var l = this._listeners[action];

			if( l ) {
				for(var i=0;i < l.length;i++) {
					var li = l[i];
					if( typeof(li) == 'function' ) {
						return true;
					}
				}
			}

			return false;
		},
		un: function(action, fn, bubble) {
			if( action == 'id' || action == 'scope' || action == 'src' ) throw new Error('invalid action name:' + action);
			if( !action ) throw new Error('missing_parameter:action');
			if( !this._listeners ) throw new Error('_listeners not defined. illegal state');
			if( typeof(fn) != 'function' ) throw new Error('fn must be a function');
			
			var l = this._listeners[action];
			if( l ) {
				for(var i=0;i < l.length;i++) {
					if( l[i] === fn && bubble === l[i].__bubble__) {
						this.fireSync('event.un', {
							eventType: action,
							eventHandler: l[i],
							eventBubble: l[i].__bubble__
						});
						delete l[i];
					}
				}
			}

			return this;
		},
		fireSync: function(action, values, fn) {
			if( action == 'id' || action == 'scope' || action == 'src' ) throw new Error('invalid action name:' + action);
			if( !action ) throw new Error('missing_parameter:action');
			if( !this._listeners ) throw new Error('_listeners not defined. illegal state');
			
			var l = this._listeners[action];
			var event = new PageEvent({
			});
			
			if( values ) {
				if( values.stopPropagation && values.preventDefault ) event.originalEvent = values;
				else event.originalValues = values;

				for(var k in values) {
					if( !values.hasOwnProperty(k) ) continue;
					if( !event[k] ) event[k] = values[k];
				}
			}
			
			event.type = action;
			event.src = this.eventSource();

			if( l ) {
				for(var i=0;i < l.length;i++) {
					var li = l[i];
					if( typeof(li) == 'object' ) {
						li = li.handleEvent || li.handle;
					}

					if( typeof(li) == 'function' ) {
						try {
						var r = li.call(this.eventScope(), event);
						} catch(e) {
							console.error('[' + this.id + ']', '["' + e.message + '"]', li.toString());
						}
						if( r === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
			
			if( fn ) {
				if( typeof(fn) === 'function' ) {
					fn.apply(this, [event]);
				} else {
					console.error('invalid event callback:', action, fn);
					throw new Error('invalid event callback[' + action + '/' + fn + ']');
				}
			}

			return event;
		},
		fire: function(action, values, fn) {
			if( action == 'id' || action == 'scope' || action == 'src' ) throw new Error('invalid action name:' + action);

			var self = this;
			setTimeout(function() {
				self.fireSync(action, values, fn);
			}, 0);
		}
	};

	var PageEventSeq = 1;
	var PageEvent = function(o) {
		this.timestamp = new Date().getTime();
		this.eventObjectId = PageEventSeq++;
		this.type = o.type;
		this.cancelable = ((o.cancelable===true) ? true : false);
		this.bubbles = ((o.bubbles===true) ? true : false);
		this.cancelBubble = false;
		this.src = o.src;
		this.returnValue = true;
		this.eventPrevented = false;
	};

	PageEvent.prototype = {
		preventDefault: function() {
			if( this.cancelable ) {
				this.returnValue = false;
				this.eventPrevented = true;
			}

			if( this.originalEvent ) this.originalEvent.preventDefault();
		},
		stopPropagation: function() {
			this.cancelBubble = true;

			if( this.originalEvent ) this.originalEvent.stopPropagation();
		}
	};

	window.EventDispatcher = EventDispatcher;
})();(function() {
	var uri = window.location.href; //'http://your.domain/product.aspx?category=4&product_id=2140&query=lcd+tv&product_name=asd&';
	var qry = {};
	uri.replace(
		new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		function($0, key, $2, value) {
			if( !key || value === undefined ) return;

			if( value.indexOf('#') >= 0 ) value = value.substring(0, value.lastIndexOf('#'));

			if( qry[key] !== undefined ) {
				if( !Array.isArray(qry[key]) ) qry[key] = [qry[key]];
				qry[key].push(value);
			} else {
				qry[key] = value;
			}
		}
	);

	var path = window.location.pathname;
	var base = path.substring(0, path.lastIndexOf('/') + 1);
	var pagename = path.substring(path.lastIndexOf('/') + 1);
	
	var qrystring = '';
	if( uri.indexOf('?') >= 0 ) qrystring = uri.substring(uri.lastIndexOf('?') + 1);
	if( qrystring.indexOf('#') >= 0 ) qrystring = qrystring.substring(0, qrystring.lastIndexOf('#'));

	function getCurrentHash() {
		var hash = window.location.hash;
		if( hash && hash.startsWith('#') ) hash = hash.substring(1);
		return hash;
	}
	
	var path = {
		url: window.location.href,
		path: window.location.pathname,
		hash: getCurrentHash(),
		pagename: pagename,
		base: base,
		qrystring: qrystring,
		qry: qry
	};

	function Page(o) {
		this.options = o || {};		
		var self = this;

		this.path = path;
		
		this.on('load', function(e) {
			var current = getCurrentHash();
			self.fireSync('hash', {
				prevhash: '',
				hash: current
			});

			if( self.hasOn('#' + current) ) {
				self.fireSync('#' + current, {
					prevhash: '',
					hash: current
				});
			}
		});
		this.on('ready', function(e) {
			//console.log('ready to injectify!');
			self.parse();
		});
	}

	Page.prototype = {
		partials: function() {
			return Partials;
		},
		partial: function(id) {
			return Partials.get(id);
		},
		change: function(hash) {
			if( hash === this.path.hash ) return;
			
			var prev = this.path.hash;
			var current = this.path.hash = getCurrentHash();
			
			page.fireSync('hash', {
				prevhash: prev,
				hash: current
			});
			
			if( this.hasOn('#' + prev + '.leave') ) {
				this.fireSync('#' + prev + '.leave', {
					prevhash: prev,
					hash: current
				});
			}

			if( this.hasOn('#' + current) ) {
				this.fireSync('#' + current, {
					prevhash: prev,
					hash: current
				});
			}
		},
		parse: function() {
			var self = this;
			var incs = document.getElementsByTagName('partial');
			if( incs ) {
				var getIndex = function(parent, node) {
					var items = parent.childNodes;
					for(var i=0; i < items.length; i++) {
						//console.log('* compare', items[i], node, (items[i] === node));
						if( items[i] === node ) return i;
					}
					return -1;
				};
				
				var toremove = [];
				for(var i=0; i < incs.length; i++) {
					/*var a = incs[i];
					for(var k in a) {
						console.log(k, a[k]);
					}*/
					var parent = incs[i].parentNode;
					var inc = incs[i];
					var index = getIndex(parent, inc);
					var prev = (inc.previousSibling && inc.previousSibling.parentNode === parent) ? inc.previousSibling : null;
					var next = (inc.nextSibling && inc.nextSibling.parentNode === parent) ? inc.nextSibling : null;
					
					//console.error('children', parent.childNodes);
					//console.error('target', parent);
					//console.error('index', index);
					//console.error('next node', next);

					toremove.push(inc);
					var id = inc.getAttribute('id');
					var options = {};

					var attrs = inc.attributes;
					if( attrs ) {
						for(var j=0; j < attrs.length; j++) {
							var attr = attrs[j];
							if( attr.nodeName !== 'id' ) options[attr.nodeName] = attr.nodeValue;
						}
					}
					options.html = inc.innerHTML;

					var partial = self.partials().create(id, options);
					if( next ) partial.attachBefore(next);
					else partial.attachTo(parent);
				}

				for(var i=0; i < toremove.length; i++) {
					toremove[i].parentNode.removeChild(toremove[i]);
				}
			}
		},
		dispatcher: function() {
			if( !this._dispatcher ) {
				this._dispatcher = new EventDispatcher({
					scope: this,
					src: this
				});
			}

			return this._dispatcher;
		},
		on: function(type, fn, bubble) {
			return this.dispatcher().on(type, fn, bubble);
		},
		un: function(type, fn, bubble) {
			return this.dispatcher().un(type, fn, bubble);
		},
		hasOn: function(type) {
			return this.dispatcher().hasOn(type);
		},
		fire: function(type, value) {
			return this.dispatcher().fire(type, value);
		},
		fireSync: function(type, value) {
			return this.dispatcher().fireSync(type, value);
		}
	};
	
	var page = window.page = new Page();

	var on = function(type, fn, bubble) {
		if( window.addEventListener ) {
			if( type == 'ready' ) type = 'DOMContentLoaded';
			window.addEventListener(type, fn, ((bubble===true) ? true : false));
		} else if( window.attachEvent ) {
			if( type == 'ready' ) {
				document.attachEvent("onreadystatechange", function(){
					if ( document.readyState === "complete" ) {
						//console.log('dom ready');
						document.detachEvent( "onreadystatechange", arguments.callee );
						if( fn ) fn.apply(this, arguments);
					}
				});
			} else {
				document.attachEvent('on' + type, fn, ((bubble===true) ? true : false));
			}
		}
	}

	if ("onhashchange" in window && window.onhashchange != null) {
		window.onhashchange = function () {
			page.change(window.location.hash);
		}
	} else {
		var storedHash = window.location.hash;
		window.setInterval(function () {
			if (window.location.hash != storedHash) {
				storedHash = window.location.hash;				
				page.change(window.location.hash);
			}
		}, 100);
	}

	on('ready', function(e) {
		page.fireSync('ready', e);
	});

	on('load', function(e) {
		page.fireSync('load', e);
	});

	on('resize', function(e) {
		page.fire('resize', e);
	});

	page.fireSync('initialized');
})();
(function() {
	function isElement(o) {
		if( !o ) return false;

		if( !(window.attachEvent && !window.opera) ) return (o instanceof Element);
		else return (o.nodeType == 1 && o.tagName);
	}

	function isDefinedScript(src) {
		return false;
	}
	
	var tagname = new RegExp('([a-zA-Z]+)', 'igm');
	function findAll(qry) {
		var el;
		if( qry === 'body' ) el = document.body;
		else if( qry === 'head' ) el = document.head;
		else if( qry === 'html' ) el = document.html;
		else if( document.querySelectorAll ) el = document.querySelectorAll(qry);
		else if( qry.startsWith('#') && qry.indexOf('.') == -1 && qry.indexOf(' ') == -1 && qry.indexOf(':') == -1 ) el = document.getElementById(qry.substring(1));
		else if( qry.match(tagname)[0] === qry ) el = document.getElementsByTagName(qry);

		if( !el ) return null;

		if( typeof(el.length) === 'number' ) return el;
		else return [el];
	}

	function find(qry) {
		var el = findAll(qry);
		if( el ) return el[0];
		return null;
	}

	var Partials = {
		cache: new Map(),
		create: function(id, options) {
			if( !id ) throw new Error('missing id');
			if( Partials.get(id) ) throw new Error('already exist partial id:' + id);
			var partial = new Partial(id, options);
			Partials.cache.set(id, partial);
			return partial;
		},
		get: function(id) {
			return Partials.cache.get(id);
		},
		remove: function(id) {
			Partials.cache.remove(id);
		}
	};

	var Partial = function(id, options) {
		this.id = id;
		this.options = options = options || {};

		if( options.debug === 'true' || options.debug === true ) this.debug = true;

		this.reset();
	};

	Partial.prototype = {
		reset: function() {
			if( this.debug) console.log('[' + this.id + '] reset', this.options);
			if( this.options.src ) {
				if( this.debug) console.log('[' + this.id + '] reset.src', this.options.src);
				this.src(this.options.src, true);
			} else {
				if( this.debug) console.log('[' + this.id + '] reset.html', this.options.html);
				this._src = '';
				this.html((this.options.html || ''));
			}
		},
		src: function(src, force) {
			if( arguments.length <= 0 ) return this._src;

			if( this.debug) console.log('[' + this.id + '] src', src);

			if( force || (src !== this._src) ) {
				if( this.debug) console.log('[' + this.id + '] src changed', this._src, '->', src);

				this._src = src;

				var payload = Ajax.ajax(src).contentType('text/html').get().cache(true).sync();
				this.parse(payload);

				if( this.debug) console.log('[' + this.id + '] reattaching', this.attachMethod, this.attachTarget);

				if( this.attachMethod === 'append' ) {
					this.attachTo(this.attachTarget, this.attachReplace);
				} else if( this.attachMethod === 'before' ) {
					this.attachBefore(this.attachTarget);
				}
			} else {
				if( this.debug) console.log('[' + this.id + '] src not changed');
			}

			return this;
		},
		html: function(html) {
			if( arguments.length <= 0 ) return this._html;

			if( this.debug) console.log('[' + this.id + '] html', html);

			this._html = html;

			this.parse(html);

			if( this.debug) console.log('[' + this.id + '] reattaching', this.attachMethod, this.attachTarget);

			if( this.attachMethod === 'append' ) {
				this.attachTo(this.attachTarget, this.attachReplace);
			} else if( this.attachMethod === 'before' ) {
				this.attachBefore(this.attachTarget);
			}

			return this;
		},
		parse: function(html) {
			if( this.debug) console.log('[' + this.id + '] parse', this.src());
						
			try {
				var payload = html || '';

				this.scripts = [];
				this.elements = [];

				var container = document.createElement('div');
				container.innerHTML = payload;

				// extract script tags
				var tags = container.getElementsByTagName('script');
				if( tags ) {
					var toremove = [];
					for(var i=0; i < tags.length; i++) {
						var os = tags[i];
						toremove.push(os);

						this.scripts.push({
							src: os.src,
							type: os.getAttribute('type'),
							charset: os.getAttribute('charset'),
							scope: os.getAttribute('scope'),
							singleton: os.getAttribute('singleton'),
							code: os.innerHTML
						});
					}

					for(var i=0; i < toremove.length; i++) {
						toremove[i].parentNode.removeChild(toremove[i]);
					}
				}

				// extract style tags
				tags = container.getElementsByTagName('style');
				if( tags ) {
					var toremove = [];
					for(var i=0; i < tags.length; i++) {
						var os = tags[i];
						toremove.push(os);

						this.styles.push({
							type: os.getAttribute('type'),
							media: os.getAttribute('media'),
							scoped: os.getAttribute('scoped'),
							cssText: os.innerHTML
						});
					}

					for(var i=0; i < toremove.length; i++) {
						toremove[i].parentNode.removeChild(toremove[i]);
					}
				}

				tags = container.getElementsByTagName('link');
				if( tags ) {
					var toremove = [];
					for(var i=0; i < tags.length; i++) {
						var os = tags[i];
						toremove.push(os);

						if( os.getAttribute('rel').toLowerCase() === 'stylesheet' ) {
							this.styles.push({
								type: os.getAttribute('type'),
								media: os.getAttribute('media'),
								href: os.getAttribute('href')
							});
						}
					}

					for(var i=0; i < toremove.length; i++) {
						toremove[i].parentNode.removeChild(toremove[i]);
					}
				}
				
				var arg = container.childNodes;
				if( arg && arg.length > 0 ) {
					for(var i=0; i < arg.length; i++) {
						this.elements.push(arg[i]);
					}
				} else {
					var text = document.createTextNode(container.innerText);
					this.elements.push(text);
				}

				if( this.debug) console.log('[' + this.id + '] loaded', this.elements, this.scripts);
			} catch(e) {
				this.scripts = [];
				this.elements = [];
				console.error('[' + this.id + '] error occured on load[' + this.src() + ']', e.message);
			}

			return this;
		},
		reload: function() {
			this.src(this.src(), true);

			return this;
		},
		execute: function() {
			var arg = this.scripts;
			if( arg ) {
				if( this.attachedScripts ) {
					for(var i=0; i < this.attachedScripts.length; i++) {
						var script = this.attachedScripts[i];
						script.parentNode.removeChild(script);
					}
				}

				this.attachedScripts = [];

				for(var i=0; i < arg.length; i++) {
					var os = arg[i];
					if( os.singleton && this.called ) continue;

					if( os.src ) {
						var script = document.createElement('script');
						if( !isDefinedScript(os.src) ) {
							if( os.src ) script.src = os.src;
							if( os.type ) script.type = os.type;
							if( os.charset ) script.charset = os.charset;
							document.head.appendChild(script);
							this.attachedScripts.push(script);
						}
					} else if( os.code ) {
						var self = this;
						eval('(function(partial) {\n' + os.code + '\n})(self);');
					}
				}

				this.called = true;
			}
		},
		attachBefore: function(target) {
			if( this.debug) console.log('[' + this.id + '] attachBefore', target);

			if( typeof(target) === 'string' ) target = find(target);
			if( !target ) throw new Error('invalid element:' + target);

			this.detach();

			var els = this.elements;
			if( els ) {
				for(var i=0; i < els.length; i++) {
					if( this.debug) console.log('[' + this.id + '] insert before', els[i], '->', target);
					target.parentNode.insertBefore(els[i], target);
					this.attached.push(els[i]);
				}
			}
			this.execute();

			this.attachMethod = 'before';
			this.attachTarget = target;

			return this;
		},
		attachTo: function(target, replace) {
			if( this.debug) console.log('[' + this.id + '] attachTo', target, '/replace', replace);

			if( typeof(target) === 'string' ) target = find(target);
			if( !target ) throw new Error('invalid element:' + target);

			this.detach();
			
			if( replace ) target.innerHTML = '';
			
			var els = this.elements;
			if( els ) {
				for(var i=0; i < els.length; i++) {
					if( this.debug) console.log('[' + this.id + '] appending', els[i], '->', target);
					target.appendChild(els[i]);
					this.attached.push(els[i]);
				}
			}
			this.execute();

			this.attachMethod = 'append';
			this.attachTarget = target;
			this.attachReplace = replace;

			return this;
		},
		detach: function() {
			if( this.debug) console.log('[' + this.id + '] detach');

			var attached = this.attached;
			if( attached ) {
				for(var i=0; i < attached.length; i++) {
					var a = attached[i];
					a.parentNode.removeChild(a);
				}
			}
			this.attached = [];
			this.attachMethod = null;
			this.attachTarget = null;
			this.attachReplace = null;

			return this;
		},
		remove: function() {
			if( this.debug) console.log('[' + this.id + '] remove', target);

			this.detach();
			Partials.remove(this.id);
		}
	};

	window.Partials = Partials;
})();