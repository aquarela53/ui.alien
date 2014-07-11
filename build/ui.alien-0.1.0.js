/*!
 * ui.alien - UI Alien the Module-based Web UI Toolkit (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.1.0
 * @date: 2014-07-11 14:3:19
*/

var less = {logLevel: 1};// es6 shim
(function() {
	if( !String.prototype.startsWith ) {
		String.prototype.startsWith = function(s) {
			return this.indexOf(s) === 0;
		};
	}

	if( !String.prototype.endsWith ) {
		String.prototype.endsWith = function(s) {
			var t = String(s);
			var index = this.lastIndexOf(t);
			return index >= 0 && index === this.length - t.length;
		};
	}

	if( !String.prototype.contains ) {
		String.prototype.contains = function(s) {
			return this.indexOf(s) !== -1;
		};
	}

	if( !String.prototype.toArray ) {
		String.prototype.toArray = function() {
			return this.split('');
		};
	}

	var global = window;
	// ES6 Map shim
	if( !global.Map ) {
		var Map = function Map() {
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
			has: function(k) {
				return (this.k.indexOf(k) >= 0);
			},
			keys: function() {
				return this.k;
			},
			values: function() {
				return this.v;
			},
			items: function() {
			},
			iterator: function() {
				return this.items();
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
		
		global.Map = global.WeakMap = Map;
	}
})();

/*!
 * attrs.dom - dom selector (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.1.0
 * @date: 2014-07-11 0:27:12
*/

/*!
 * attrs.module - javascript module loader that supports cjs, amd (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.1.0
 * @date: 2014-07-11 0:26:55
*/

(function() {
	

var Path = (function() {
	"use strict"

	function Path(src) {
		if( src instanceof Path ) src = src.src;
		if( !src || typeof(src) !== 'string' ) throw new Error('invalid path:' + src);
		this.src = src.trim();
	}

	Path.prototype = {
		join: function(path) {
			return Path.join(this.src, path);
		},
		dir: function() {
			return Path.dir(this.src);
		},
		uri: function() {
			return Path.uri(this.src);
		},
		filename: function() {
			return Path.filename(this.src);
		},
		querystring: function() {
			return Path.querystring(this.src);
		},
		query: function() {
			return Path.query(this.src);
		},
		host: function() {
			return Path.host(this.src);
		},
		parse: function() {
			return Path.parse(this.src);
		},
		parent: function() {
			return Path.parent(this.src);
		},
		isFile: function() {
			return !( src.endsWith('/') );
		},
		isDirectory: function() {
			return src.endsWith('/');
		},
		toString: function() {
			return this.src;
		}
	};
		
	Path.join = function(base, path) {
		if( !base ) return path;
		if( path.trim() === '.' ) return base;
		if( base instanceof Path ) base = base.src;
		if( path instanceof Path ) path = path.src;

		base = this.dir(base);
		path = path.trim();

		if( path.indexOf(':') >= 0 ) return path;

		if( path.startsWith('/') ) {
			var i;
			if( (i = base.indexOf('://')) >= 0 ) {
				base = base.substring(0, base.indexOf('/', i + 3));
			} else if( (i = base.indexOf(':')) >= 0 ) {
				base = base.substring(0, i + 1);
			} else {
				return path;
			}
		} else {			
			// 상대경로 맞추기
			for(;path.startsWith('.');) {
				if( path.startsWith('./') ) {
					path = path.substring(2);
				} else if( path.startsWith('../') ) {
					base = this.parent(base);
					path = path.substring(3);
					if( !base ) return null;
				} else {
					return null;	// 오류
				}
			}
		}
		
		return base + path;
	};
	
	Path.dir = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		var base = '', i;

		if( (i = path.indexOf('://')) ) {
			i = path.indexOf('/', i + 3);
			if( i < 0 ) return path + '/';

			base = path.substring(0, i) || path;
			path = path.substring(i);
		}
		
		if( path.endsWith('/') ) {
			path = path;
		} else if( path.indexOf('/') >= 0 ) {
			path = path.substring(0, path.lastIndexOf('/')) + '/';
		} else {
			path = path + '/';
		}

		return base + path;
	};
	
	Path.filename = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		if( path.endsWith('/') ) {
			path = path.substring(0, path.length - 1);
			return path.substring(path.lastIndexOf('/') + 1);
		} else {
			return path.substring(path.lastIndexOf('/') + 1);
		}
	};

	Path.uri = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		return path;
	};

	Path.querystring = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(path.indexOf('?') + 1);
		else return '';
	};

	Path.query = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		var q = this.querystring(q);
		var query = {};
		q.replace(
			new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
			function($0, key, $2, value) {
				if( !key || value === undefined ) return;

				if( value.indexOf('#') >= 0 ) value = value.substring(0, value.lastIndexOf('#'));

				if( o.query[key] !== undefined ) {
					if( !Array.isArray(query[key]) ) query[key] = [query[key]];
					query[key].push(value);
				} else {
					query[key] = value;
				}
			}
		);

		return query;
	};

	Path.host = function(url) {
		if( !url ) return null;
		if( url instanceof Path ) url = url.src;

		if( (i = url.indexOf('://')) >= 0 ) {
			var j = url.indexOf('/', i + 3);
			url = url.substring(i + 3, (j >= 0) ? j : url.length);
			if( (i = url.indexOf(':')) >= 0 ) url = url.substring(0, i);
			return url;
		} else {
			return null;
		}
	};

	Path.parse = function(url) {
		if( !url ) return null;
		if( url instanceof Path ) url = url.src;

		return {
			url: url,
			uri: this.uri(url),
			host: this.host(url),
			querystring: this.querystring(url),
			query: this.query(url),
			name: this.filename(url),
			dir: this.dir(url),
			parent: this.parent(url)			
		};			
	};

	Path.parent = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = this.dir(path);

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		var arg = path.split('/');
		if( !arg || arg.length <= 2 ) return null;
		return arg.splice(0, arg.length - 2).join('/') + '/';
	};

	return Path;
})();



/*
var url_file = 'http://host:8080/appbus/module/appbus.ui.json';
var windows_file = 'c:/appbus/module/appbus.ui.json';
var unix_file = '/appbus/module/appbus.ui.json';

var url_dir = 'http://host:8080/appbus/module/';
var windows_dir = 'c:/appbus/module/';
var unix_dir = '/appbus/module/';

var empty = '';
var path_abs = '/other/other.ui.json';
var path_rel1 = './other.js';
var path_rel2 = '../';
var path_rel3 = '../other/other.ui.json';

console.log('dir.url(file)', Path.dir(url_file));
console.log('dir.windows(file)', Path.dir(windows_file));
console.log('dir.unix(file)', Path.dir(unix_file));

console.log('dir.url(dir)', Path.dir(url_dir));
console.log('dir.windows(dir)', Path.dir(windows_dir));
console.log('dir.unix(dir)', Path.dir(unix_dir));

console.log('name.url(file)', Path.filename(url_file));
console.log('name.windows(file)', Path.filename(windows_file));
console.log('name.unix(file)', Path.filename(unix_file));

console.log('name.url(dir)', Path.filename(url_dir));
console.log('name.windows(dir)', Path.filename(windows_dir));
console.log('name.unix(dir)', Path.filename(unix_dir));

console.log('parent.url(file)', Path.parent(url_file));
console.log('parent.windows(file)', Path.parent(windows_file));
console.log('parent.unix(file)', Path.parent(unix_file));

console.log('parent.url(dir)', Path.parent(url_dir));
console.log('parent.windows(dir)', Path.parent(windows_dir));
console.log('parent.unix(dir)', Path.parent(unix_dir));

console.log('join.url.path_abs(file)', Path.join(url_file, path_abs));
console.log('join.url.path_rel1(file)', Path.join(url_file, path_rel1));
console.log('join.url.path_rel2(file)', Path.join(url_file, path_rel2));
console.log('join.url.path_rel3(file)', Path.join(url_file, path_rel3));

console.log('join.windows.path_abs(file)', Path.join(windows_file, path_abs));
console.log('join.windows.path_rel1(file)', Path.join(windows_file, path_rel1));
console.log('join.windows.path_rel2(file)', Path.join(windows_file, path_rel2));
console.log('join.windows.path_rel3(file)', Path.join(windows_file, path_rel3));

console.log('join.unix.path_abs(file)', Path.join(unix_file, path_abs));
console.log('join.unix.path_rel1(file)', Path.join(unix_file, path_rel1));
console.log('join.unix.path_rel2(file)', Path.join(unix_file, path_rel2));
console.log('join.unix.path_rel3(file)', Path.join(unix_file, path_rel3));


console.log('dir(a)', Path.dir('a'));
console.log('dir(http://host:80)', Path.dir('http://host:80'));
console.log('dir(http://host:80/)', Path.dir('http://host:80/'));
console.log('dir(http://host:80/a)', Path.dir('http://host:80/a'));
console.log('dir(http://host:80/a/b)', Path.dir('http://host:80/a/b'));
console.log('dir(http://host:80/a/b/c)', Path.dir('http://host:80/a/b/c'));
console.log('host(ftp://a.b.c.com)', Path.host('ftp://a.b.c.com'));
console.log('host(ftp://a.b.c.com:8080)', Path.host('ftp://a.b.c.com:8080'));
console.log('host(ftp://a.b.c.com:8080/)', Path.host('ftp://a.b.c.com:8080/'));
console.log('host(ftp://a.b.c.com:8080/a/b/c)', Path.host('ftp://a.b.c.com:8080/a/b/c'));
*/

var Ajax = (function() {
	"use strict"

	function AjaxError(msg, xhr) {
		this.message = msg;
		if( xhr ) {
			this.status = xhr.status;
			this.xhr = xhr;
		}
	}

	AjaxError.toString = function() {
		return this.message;
	};
	
	// eval script in global scope
	function eval_in_global(script) {
		try {
			eval.call(window, script);
		} catch(e) {
			throw new SyntaxError('remote script syntax error (' + e.message + ') in [' + src + ']');
		}
	}

	// eval script in global scope
	function eval_json(script, src) {
		try {
			var o;
			eval('o = ' + script);
			return o;
		} catch(e) {
			throw new SyntaxError('remote json syntax error (' + e.message + ') in [' + src + ']');
		}
	}

	// string to xml
	function string2xml(text){
		if( window.ActiveXObject ) {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(text);
		} else {
			var doc = new DOMParser().parseFromString(text, 'text/xml');
		}
		return doc;
	}

	// class ajax
	var Ajax = function() {};
	
	Ajax.prototype = {		
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
		get: function(url, qry, options, fn) {
			if( typeof(options) == 'function' ) fn = options, options = null;

			if( !url ) {
				if( fn ) fn(new AjaxError('missing url'));
				else throw new AjaxError('missing url');
			}
			
			var o = options || {};
			if( o.eval || o.json ) o.parse = false;
			else if( o.parse !== true ) o.parse = false;
			
			
			if( !fn ) {
				o.sync = true;
				fn = function(err, data) {
					if( err ) throw err;
				};
			}
			
			var result;
			this.ajax(url).qry(qry).parse(o.parse).cache(o.cache).sync(o.sync).get().done(
				function(err,data,xhr) {
					if( err ) return fn(err, data, xhr);
					
					if( o.json ) {
						data = eval_json(data);
					} else if( o.eval ) {
						eval_in_global(data);
					}

					result = data;
					fn(err, data, xhr);
				}
			);

			return result;
		},
		text: function(url, cache, fn) {
			return this.get(url, null, {cache:cache}, fn);
		},
		eval: function(url, cache, fn) {
			return this.get(url, null, {eval:true, cache:cache}, fn);
		},
		json: function(url, cache, fn) {
			return this.get(url, null, {json:true, cache:cache}, fn);
		},
		ajax: function(url) {
			var config = {
				method: 'get',
				sync: false,
				cache: false,
				parse: true
			};

			if( typeof(url) === 'object' ) {
				for(var k in url) {
					config[k] = url[k];
				}
			} else if( typeof(url) === 'string' ) {
				config.url = url;
			} else {
				throw new AjaxError('illegal ajax option(string or object):' + url);
			}

			var handler = null;
			var self = this;

			var execute = function() {
				var fns, err, payload, loaded = false, status, statusText, contentType, parsed = false;
				handler = {
					done: function(fn) {
						fns.listeners.done.push(fn);
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
				
				fns = {
					listeners: {done:[],success:[],error:[]},
					done: function() {
						var l = this.listeners.done, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					success: function() {
						var l = this.listeners.success, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					error: function() {
						var l = this.listeners.error, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					commit: function() {
						if( loaded ) {							
							var data = payload;
							if( data && !parsed ) {
								if( o.parse && contentType && contentType.indexOf('json') >= 0 && data ) {
									try {
										var json = JSON.parse(data);
										data = json;
									} catch(e) {
										console.error('json parse error:', e.message, '[in ' + url + ']');
									}
								} else if( o.parse && contentType && contentType.indexOf('xml') >= 0 && data ) {
									data = string2xml(data);
								}

								parsed = true;
							}
							
							if( o.interceptor ) {
								o.interceptor.apply(o.scope || this, [{
									config: o,
									error: err,
									xhr: xhr,
									payload: payload,
									data: data,
									statusText: statusText,
									contentType: contentType
								}]);
							} else {
								if( err ) this.error(err, data, xhr, payload);
								else this.success(data, xhr, payload);

								this.done(err, data, xhr, payload);
							}
						}
					}
				};

				if( o.success ) fns.listeners.success.push(o.success);
				if( o.error ) fns.listeners.error.push(o.error);
				if( o.done ) fns.listeners.done.push(o.done);
				
				var url = o.url;
				var qry = self.toqry(o.qry) || '';
				if( url.indexOf('?') > 0 ) url += ((!o.cache ? '&_nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));
				else url += ((!o.cache ? '?_nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));

				// create xhr
				var xhr = ( window.XMLHttpRequest ) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				xhr.open(o.method, url, !o.sync);
				if( o.accept ) xhr.setRequestHeader("Accept", o.accept);

				// success
				var oncomplete = function () {
					payload = xhr.responseText || '';
					status = xhr.status;
					statusText = xhr.statusText;
					contentType = xhr.getResponseHeader('Content-Type');
					loaded = true;

					if( xhr.status == 200 || xhr.status == 204 ) {
						err = null;
					} else {
						err = new AjaxError(statusText || status, xhr);
					}

					fns.commit();
				};

				// error
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
					xhr.addEventListener("load", oncomplete, false);
					xhr.addEventListener("error", onerror, false);
					xhr.addEventListener("abort", onerror, false);
				} else {
					xhr.onreadystatechange = function() {
						if( xhr.readyState === 4 ) oncomplete();
					};
					xhr.onload = onload;
					xhr.onerror = onerror;
					xhr.onabort = onerror;
				}

				handler.xhr = xhr;
				
				try {
					if( o.payload ) {
						if( typeof(o.payload) === 'object' ) {
							o.payload = JSON.stringify(o.payload);
							o.contentType = 'application/json';
						}
						
						xhr.setRequestHeader('Content-Type', (o.contentType || 'application/x-www-form-urlencoded') + (o.charset ? ('; charset=' + o.charset) : ''));

						xhr.send(o.payload);
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

				return handler;
			};

			return {
				qry: function(qry) {
					if( !qry ) return this;
					config.qry = qry;
					return this;
				},
				nocache: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					return this.cache(!b);
				},
				cache: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.cache = b;
					return this;
				},
				parse: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.parse = b;
					return this;
				},
				sync: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.sync = b;
					return this;
				},
				url: function(url) {
					if( !url ) return this;
					config.url = url;
					return this;
				},
				contentType: function(type) {
					config.contentType = type;
					return this;
				},
				charset: function(charset) {
					config.charset = charset;
					return this;
				},
				accept: function(accept) {
					config.accept = accept;
					return this;
				},
				post: function(payload) {
					config.method = 'post';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				put: function(payload) {
					config.method = 'put';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				get: function(payload) {
					config.method = 'get';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				options: function(payload) {
					config.method = 'options';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				del: function(payload) {
					config.method = 'delete';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				interceptor: function(fn) {
					config.interceptor = fn;
					return this;
				},
				listeners: function(listeners) {
					if( listeners.success ) config.success = listeners.success;
					if( listeners.error ) config.error = listeners.error;
					if( listeners.done ) config.done = listeners.done;

					return this;
				},
				scope: function(scope) {
					config.scope = scope;
					return this;
				},
				
				// execute
				execute: function() {
					if( handler ) throw new AjaxError('already executed');
					return execute();
				},
				done: function(fn) {
					if( !handler ) execute();
					handler.done(fn);
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

	return new Ajax();
})();

var Require = (function() {	
	// imports
	var global = window;
	
	var current_uri = Path.uri(location.href);

	// privates
	// create new require environment for each module
	function createRequire(src) {
		src = Path.join(current_uri, src) || current_uri;
		src = Path.dir(src);
		return (function(base) {
			return function require(path, reload, nocache) {				
				if( path.startsWith('./') || ~path.indexOf('://') ) {
					path = Path.join(base, path);
				}

				return Require.get(path, reload, nocache);
				
			};
		})(src);
	}

	// create sandbox
	var excepts = ['require', 'Map', 'Set', 'WeakMap', 'console', 'alert', 'confirm', 'print', 'prompt', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'];
	var sandbox = function() {
		var o = {};

		for(var k in window) {
			if( ~excepts.indexOf(k) ) continue;
			o[k] = undefined;
		}

		return o;
	};

	var global = {__sandbox_global__:1};
	
	// eval as module
	function eval_as_module(script, src) {
		// closure variables clear prepare for a possible illegal access in inner modules
		//var document = null, Element = null, window = null, $ = null, $$ = null;
		
		src = src || current_uri;
		
		var exports = {};
		var require = createRequire(src);
		var module = {
			exports:exports
		};

		// extract current require dirname & filename
		var __filename = Path.join(Path.dir(current_uri), src);
		var __dirname = Path.dir(__filename);

		//try {
			var scope = sandbox();
			scope.Ajax = undefined;
			scope.Path = undefined;
			scope.Require = undefined;
			scope.eval_as_module = undefined;
			scope.sandbox = undefined;
			scope.excepts = undefined;
			scope.createRequire = undefined;
			scope.global = global;

			with(scope) {
				if( typeof(script) === 'string' ) {
					eval('(function(module, require, exports, __filename, __dirname) {	' + script + ' \n})(module, require, exports, __filename, __dirname);');
				} else if( typeof(script) === 'function' ) {
					script(module, require, exports, __filename, __dirname);
				} else {
					throw new Error('illegal script or function');
				}
			}
		/*} catch(e) {
			//throw new SyntaxError('remote module syntax error (' + e.message + ' at ' + e.lineNumber + ') in [' + __filename + ']');
			console.error('remote module syntax error (' + e.message + ') in [' + __filename + ']');
			//throw e;
		}*/

		return module;
	}
	
	var Require;
	return Require = (function() {
		"use strict"
		
		// eval script in global scope
		function eval_json(json, src) {
			try {
				eval('json = ' + json);
				return json;
			} catch(e) {							
				throw new SyntaxError('json [' + src + '] has syntax error (' + e.message + ')');
			}

			/*try {
				if( window.JSON ) {
					try {
						json = JSON.parse(json);
					} catch(err) {
						try {
							eval('json = ' + json);
							console.error('[WARN] json syntax warning "' + err.message + '" at "' + src + '"');
						} catch(e) {							
							throw new SyntaxError('json [' + src + '] has syntax error (' + e.message + ')');
						}
					}
				} else {
					eval('json = ' + json);
				}

				return json;
			} catch(err) {
				throw new SyntaxError('json file [' + src + '] has syntax error (' + err.message + ')');
			}*/
		}
		
		// ajax execute to eval remote script
		function conn(src, cache, sync, fn) {
			Ajax.ajax(src).cache(cache).parse(false).sync(sync).get().done(function(err, data, xhr) {
				if( err ) return fn(err, data, xhr);
				
				var contentType = xhr.getResponseHeader('content-type');
					
				if( contentType && ~contentType.indexOf('javascript') ) {
					data = eval_as_module(data, src);
				} else if( contentType && ~contentType.indexOf('/json') || (src.lastIndexOf('.json') >= 0 && src.lastIndexOf('.json') === src.length - '.json'.length) ) {
					data = {
						exports: eval_json(data, src)
					};
				} else if( contentType && ~contentType.indexOf('text/') || (src.lastIndexOf('.html') >= 0 && src.lastIndexOf('.html') === src.length - '.html'.length) ) {
					data = data;
				} else {
					data = eval_as_module(data, src);
				}

				fn(null, data);
			});
		}

		var cached = {};
		var bundles = {
			'window': window,
			'document': document,
			'ajax': function(module) {  module.exports = Ajax; },
			'path': function(module) {  module.exports = Path; },
			'events': function(module) {  module.exports = EventDispatcher; }
		};

		// class Require, singleton
		function Require() {}

		Require.prototype = {
			bundles: function() {
				return bundles;
			},
			bundle: function(name) {
				return bundles[name];
			},
			cached: function() {
				return cached;
			},
			define: function(name, fn) {
				if( !name || typeof(name) !== 'string' ) return this;

				bundles[name] = fn;
			},
			defines: function(o) {
				if( !arguments.length ) return bundles;

				if( typeof(o) !== 'object' ) return null;

				for(var k in o) {
					if( !o.hasOwnProperty(k) || k[0] === '_' || ~k.indexOf(' ') ) continue;				
					this.define(k, o[k]);
				}

				return this;
			},
			get: function(path, reload, nocache, fn) {
				if( reload === true ) cached[path] = null;

				if( typeof(path) !== 'string' ) throw new Error('invalid path \'' +  + path + '\'');

				var module;
				
				//console.log('path', path, this.bundle(path));

				// if in bundles
				var bundle = this.bundle(path);
				
				if( typeof(bundle) === 'function' ) {					
					module = cached[path] || eval_as_module(bundle);					
				} else if( bundle ) {
					module = {exports:bundle};
				} else if( path.startsWith('./') || ~path.indexOf('://') ) {
					var cache = (nocache === true) ? false : true;
					
					if( typeof(fn) === 'function' ) {
						if( cached[path] ) return fn(null, cached[path]);
						
						conn(path, cache, false, function(err, module) {
							if( err ) fn(err);

							if( module ) cached[path] = module;
							else fn(new Error('Can not load module \'' + path + '\''));

							fn(null, module);
						});
						return;
					} else {
						conn(path, cache, true, function(err, data) {
							if( err ) throw err;
							module = data;
						});
					}
				}

				if( module ) cached[path] = module;

				if( typeof(fn) === 'function' ) {
					if( !module ) fn(new Error('Can not find module \'' + path + '\''));
					return fn(null, (module && module.exports || module));
				} else {				
					if( !module ) throw new Error('Can not find module \'' + path + '\'');
					return module && module.exports;
				}
			},
			sync: function(path, reload, nocache) {
				return this.get(path, reload, nocache);
			},
			async: function(path, reload, nocache) {
				var self = this;
				return {
					done: function(fn) {
						self.get(path, reload, nocache, fn);
					}
				};
			}
		};

		return Require = new Require();
	})();
})();

(function() {
	// export require in global
	var another = window.require;
	var anotherd = window.define;
	
	var require = function(src, cache) {
		return Require.sync(src, cache);
	};

	window.require = require;
	window.define = Require.define;
	window.define.attrs = true;

	window.require.noConflict = function() {
		window.require = another;
		window.define = anotherd;
		return require;
	};
	
	//console.log('define', define, define.attrs);

	var __require_jquery_url__ = 'http://code.jquery.com/jquery-latest.js';
	if( window.__require_jquery_url__ ) __require_jquery_url__ = window.__require_jquery_url__;

	// additional bundle module for jquery... 
	Require.define('jquery', function(module) {
		var $, error;

		var load = function(fn) {
			var script = document.createElement("script");
			script.charset = 'utf-8';
			script.async = true;
			script.src = __require_jquery_url__;
			
			var done = false;
			script.onload = script.onreadystatechange = function(e) {
				if ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
					done = true;
					$ = window.jQuery;
					fn($);
				} else if( this.readyState === "error" ) {
					error = 'jquery(http://code.jquery.com/jquery-latest.js) load error';
					console.error(error);
				}
			};

			script.onerror = function(e) {
				error = 'jquery(http://code.jquery.com/jquery-latest.js) load error';
				console.error(error);
			};
			
			var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
			head.appendChild(script);
		};
		
		module.exports = {
			ready: function(fn) {
				if( $ ) fn($);
				else if( error ) console.error(error);
				else load(fn);
			}
		};
	});
})();


/*
-- TODO : 언젠간 jsonp 를...
var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
var script = document.createElement("script");
if ( charset ) script.charset = charset;

script.async = false;

if( script.addEventListener ) {
	script.addEventListener('load', function() {
	});
	script.addEventListener('error', function() {
	});
} else if(script.attachEvent) {
	script.attachEvent('onload', function() {
	});
	script.attachEvent('onerror', function() {
	});
} else {
	var done = false;
	script.onload = script.onreadystatechange = function() {
		if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
		} else if( this.readyState === "error" ) {
		}
	};
}

script.src = 'http://code.jquery.com/jquery-latest.js';
head.insertBefore(script, head.firstChild);
*/


	
})();


(function() {
	

var DateUtil = (function() {
	"use strict"

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
			//if (isNaN(date)) throw SyntaxError("invalid date");
			if (isNaN(date)) return date;

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

	return {
		format: function(date, mask, utc) {
			return dateFormat(date, mask, utc);
		}
	};
})();


var Template = (function() {
	"use strict"
	
	//var TPL_PATTERN = new RegExp('[{][.\\w:\\w(.\\w)?\\-]+[}]', 'igm');
	var TPL_PATTERN = new RegExp('[{][a-zA-Z0-9 :.,()\'";?<>\|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]+[}]', 'igm');

	function currency(n, f){
		var c, d, t;

		var n = n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	}

	var TRANSLATORS = {
		image: function(v) {
			return ( typeof(v) === 'string' ) ? '<img src="' + v + '" />' : '';
		},
		currency: function(v) {
			var value = v;
			if( typeof(value) === 'number' ) value = parseInt(value);
			if( isNaN(value) ) return v;
			return currency(value, false);
		},
		stringify: function(v) {
			if( typeof(v) === 'object' ) return JSON.stringify(v, null, '\t');
			else if( typeof(v) === 'function' ) return v.toString();
			else return v;
		},
		date: function(v, format) {
			if( !(v instanceof Date) ) v = new Date(v);
			return v.format(format || 'yyyy.mm.dd');
		}
	};

	// class Template
	function Template(el) {
		this.el = el;
	}
	
	Template.translators = TRANSLATORS;

	Template.prototype = {
		bind: function(o, fns) {
			o = o || {};
			fns = fns || {};

			var el = this.el;

			var parseKey = function(k) {
				if( typeof(k) !== 'string' ) return null;

				if( k.startsWith('{') ) k = k.substring(1);
				if( k.endsWith('}') ) k = k.substring(0, k.length -1);
				
				var args = k.split(':');

				var fn = args[1];
				var option, pos;
				if( fn && (pos = fn.indexOf('(')) > 0 ) {
					option = fn.substring(fn.indexOf('(') + 1, fn.indexOf(')', pos+1));
					fn = fn.substring(0, fn.indexOf('('));
				}

				return {
					key: args[0],
					fn: fn,
					option: option,
					defaultValue: args[2],
					mask: args[3],
					args: args
				}
			};

			var getValue = function(key, o) {
				if( typeof(key) !== 'string' ) return null;
				
				if( key.indexOf('.') > 0 ) {
					var c = o;
					var arg = key.split('.');
					arg.forEach(function(k) {
						if( c ) c = c[k];
					});
					return c;
				}

				return o[key];
			};
			
			var evaluate = function(path, el, nodeValue, o, fns, global, preprocessor) {
				var v = nodeValue;
				var pos = -1;
				while((pos = v.indexOf('{')) >= 0) {
					v = v.substring(pos + 1);
					var matched  = v.substring(0, v.indexOf('}'));
					var parsed = parseKey(matched);
					var key = parsed.key;
					var fn = parsed.fn;
					var option = parsed.option;
					var def = parsed.defaultValue || '';
					var fnc = fns[fn] || global[fn] || TRANSLATORS[fn];
				
					var row = o;
					while( key.startsWith('.') ) {
						row = row._parent || {};
						fnc = (fns._parent || {})[fn] || (fns._parent || {})['all'];
						key = key.substring(1);
					}

					var value = getValue(key, row);

					if( preprocessor ) {
						var result = preprocessor(path, key, value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}

					if( fns && fns.$all ) {							
						var result = fns.$all(key, value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}

					if( fnc ) {
						if( typeof(fnc) !== 'function' && typeof(fnc.$) === 'function' ) fnc = fnc.$;
						var result = fnc(value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}
					
					if( !value ) value = def;
					nodeValue = nodeValue.split('{' + matched + '}').join(value);
				}

				return nodeValue;
			};

			var parse = function(path, el, o, fns, global, preprocessor) {
				if( el.nodeName == '#text' ) {
					if( el.nodeValue ) {
						var value = evaluate(path, el, el.nodeValue, o, fns, global, preprocessor);
						var p = el.parentNode;
						var nel = document.createElement((p.tagName || 'div'));
						nel.innerHTML = value;

						var c = nel.childNodes;
						var argc = [];
						if( c ) for(var j=0; j < c.length;j++) argc.push(c[j]);
						if( argc ) for(var j=0; j < argc.length;j++) p.insertBefore(argc[j], el);
						p.removeChild(el);
					}
				} else if( el.getAttribute ) {
					var attrs = el.attributes;
					for(var i=0; i < attrs.length; i++) {
						var attr = attrs[i];
						var value = evaluate(path, el, attr.value, o, fns, global, preprocessor);
						if( value !== attr.value ) {
							el.setAttribute(attr.name, value);
						}
					}
				}
				
				var childNodes = el.childNodes;
				var argc = [];
				if( childNodes && childNodes.length ) {
					for(var i=0; i < childNodes.length;i++) argc.push(childNodes[i]);
				}

				if( argc ) {
					for(var i=0; i < argc.length;i++) {
						var sub = argc[i];
						var v;

						if( sub.getAttribute && (v = sub.getAttribute('bypass')) ) {
							if( v.trim().toLowerCase() === 'true' ) continue;
						}
						
						// if hash console attr
						if( sub.getAttribute && (v = sub.getAttribute('log')) ) {
							sub.removeAttribute('log');
							
							(function(condition) {
								try {
									console.log(condition + ':', eval(v));
								} catch(e){
									console.error('tpl console log error', e, v);
								}
							}).call(o, v);

							if( sub.tagName.toUpperCase() === 'TPL' && !sub.getAttribute('for') && !sub.getAttribute('if') ) {
								el.removeChild(sub);
							}
						}

						// if in condition
						if( sub.getAttribute && (v = sub.getAttribute('if')) ) {
							//console.log('is condition', sub);
							var elsetag = sub.querySelector('else');
							if( elsetag && elsetag.parentNode !== sub ) elsetag = null;
							if( elsetag ) sub.removeChild(elsetag);
							sub.removeAttribute('if');

							var checktrue = (function(condition) {
								try {
									//console.log('evaluation', this, condition);
									//return eval('(row.items && row.items.length)');
									var item = o;
									var row = o;
									var r = eval('(' + condition + ')');
									//console.log('eval', condition, r);
									return r;
								} catch(e){
									console.error('tpl evaluation error', e, condition);
									return false;
								}
							}).call(o, v);

							var cnodes = [], rebuild = false;
							if( checktrue ) {
								if( sub.tagName.toUpperCase() === 'TPL' && !sub.getAttribute('for') ) {
									var subc = sub.childNodes;
									if( subc ) for(var p=0; p < subc.length;p++) cnodes.push(subc[p]);
									rebuild = true;
								}
							} else {
								if( elsetag ) {
									var subc = elsetag.childNodes;
									if( subc ) {
										for(var p=0; p < subc.length;p++) cnodes.push(subc[p]);
									}
								}
								rebuild = true;
							}

							if( rebuild ) {
								//console.log('is rebuild', sub);
								for(var p=0; p < cnodes.length; p++) {
									var n = cnodes[p];
									el.insertBefore(n, sub);
									argc.push(cnodes[p]);
								}
								el.removeChild(sub);
								continue;
							}
						}
						
						// if for loop
						if( sub.getAttribute && (v = sub.getAttribute('for')) ) {
							var parsed = parseKey(v);
							if( parsed ) {
								var key = parsed.key;
								var fn = parsed.fn;
								var def = parsed.defaultValue;
								var option = parsed.option;
								var arg = getValue(key, o) || def;
								var sfns = fns[fn || key] || global[fn || key] || TRANSLATORS[fn || key];
								var spath = ((path) ? (path + '.') : '') + key;
								var snext = sub.nextSibling;
								
								el.removeChild(sub);

								if( typeof(arg) === 'string' ) {
									el.innerHTML = arg;
									return;
								}

								if( !arg ) continue;

								if( typeof(arg.length) !== 'number' ) arg = [arg];

								for(var j=0; j < arg.length; j++) {
									var row = arg[j];

									var type = typeof(row);
									if( type === 'string' ) {
										var r = {};
										r[key] = row;
										row = r;
									} else if( !row || type !== 'object' ) {
										continue;
									}

									//console.error('#' + path, key, row, sfns, sub);

									var temp = sub.cloneNode(true);
									
									//만약 노드의 fn 이 펑션이라면 펑션 실행
									if( preprocessor ) {
										var result = preprocessor(path, key, row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									if( sfns && typeof(sfns.$) === 'function' ) {
										var result = sfns.$(key, row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									if( typeof(sfns) === 'function' ) {
										var result = sfns(row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									/*if( row ) {
										console.log(row);
										/*if( $.util.isElement(row) ) {
											temp = row;
										} else if( row instanceof $ ) {
											temp = row.el;
										} else if( row === false) {
											continue;
										} */
									if( row === false) {
										continue;
									} else if( row === undefined ) {
										row = arg[j];
									}

									if( !sfns ) sfns = {};

									temp.removeAttribute('for');
									row._parent = o;
									sfns._parent = fns;

									row._index = j;
									parse(spath, temp, row, sfns, global, preprocessor);
									
									if( temp.tagName.toUpperCase() === 'TPL' ) {
										var nodes = temp.childNodes;
										var _argc = [];
										if( nodes && nodes.length ) {
											for(var a=0; a < nodes.length;a++) _argc.push(nodes[a]);
										}

										if( _argc ) {
											for(var a=0; a < _argc.length;a++) {
												if( snext ) el.insertBefore(_argc[a], snext);
												else el.appendChild(_argc[a]);
											}
										}
									} else {
										if( snext ) el.insertBefore(temp, snext);
										else el.appendChild(temp);
									}
								}
							}
						} else {
							parse(path, sub, o, fns, global, preprocessor);
						}
					}
				}
			};

			parse('', el, o, fns, fns['global'] || {}, fns['preprocessor']);
			
			return this;
		}
	};

	return Template;
})();

var EventDispatcher = (function() {	
	"use strict"

	var seq = 100;

	var EventObjectSeq = 1;
	var EventObject = function CustomEvent(o) {
		this.options(o);
	};

	EventObject.prototype = {
		options: function(o) {
			this.timestamp = new Date().getTime();
			this.eventObjectId = EventObjectSeq++;
			this.type = o.type;
			this.cancelable = ((o.cancelable===true) ? true : false);
			this.bubbles = ((o.bubbles===true) ? true : false);
			this.cancelBubble = false;
			this.src = o.src;
			this.returnValue = true;
			this.eventPrevented = false;
			this.values = o.values;
			
			var values = o.values;
			if( values ) {
				if( values.stopPropagation && values.preventDefault ) this.originalEvent = values;
				else this.originalValues = values;

				for(var k in values) {
					if( values.hasOwnProperty && !values.hasOwnProperty(k) ) continue;
					if( !this[k] ) this[k] = values[k];
				}
			}
		},
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
	
	/* 
	 * Class EventDispatcher
	 * 
	 * layout
	 * {
	 *		_options: {},
	 *		_listeners: {},
	 *		_visitor: Function,
	 *		_scope: Object,
	 *		_source: Object,
	 *		__proto__: {
	 *			options: Function(),
	 *			listeners: Function(),
	 *			visitor: Function(),
	 *			scope: Function(),
	 *			source: Function(),
	 *			on: Function(),
	 *			un: Function(),
	 *			has: Function(),
	 *			fire: Function(),
	 *			fireSync: Function(),
	 *			dispatchEvent: Function()
	 *			
	 *		}
	 * }
	 *
	 */
	function EventDispatcher(scope, options) {
		if( scope ) this.scope(scope);
		if( options ) this.options(options);
	}

	EventDispatcher.prototype = {		
		options: function(options) {
			if( !arguments.length ) return this._options;

			if( typeof(options) != 'object' ) throw new Error('options must be a object'); 
			
			this._options = null;
			this._listeners = null;
			this._visitor = null;
			this._scope = null;
			this._source = null;
			this._silent = null;
			this._types = null;

			try {
				delete this._options;
				delete this._listeners;
				delete this._visitor;
				delete this._scope;
				delete this._source;
				delete this._silent;
				delete this._types;
			} catch(e) {}

			this._options = options;
			if( options.listeners ) this.listeners(options.listeners);
			if( options.visitor ) this.visitor(options.visitor);
			if( options.scope ) this.scope(options.scope);
			if( options.source ) this.source(options.source);
			if( options.silent ) this.source(options.silent);
			if( options.types ) this.source(options.types);

			return this;
		},
		silent: function(silent) {
			if( !arguments.length ) return (this._silent) ? true : false;

			if( silent === true ) {
				this._silent = true;
			} else {
				this._silent = false;
			}

			return this;
		},
		types: function(types, flag) {
			var args = this._types;
			if( !arguments.length ) return args;

			if( types === false || types === '*' ) {
				this._types = null;
				return true;
			}

			if( typeof(types) === 'string' ) types = types.split(' ');
			if( !Array.isArray(types) ) console.error('[ERROR] illegal types', types);

			if( flag === false ) {				
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					var index = args.indexOf(type);
					if( ~index ) args = args.splice(index, 1);
				}
			} else {
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					if( type && !~args.indexOf(type) ) args.push(type);
				}
			}

			return this;
		},
		listeners: function(listeners) {
			if( !this._listeners ) this._listeners = {};
			if( !arguments.length ) return this._listeners;

			if( !listeners ) return this;
					
			if( typeof(listeners) !== 'object' ) throw new Error('invalid listeners:' + listeners);
			for(var k in listeners) {
				if( !listeners.hasOwnProperty(k) || k === 'scope' || k === 'visitor' || k === 'source' ) continue;
				
				var handler = listeners[k];
				if( handler && typeof(handler) === 'function' || typeof(handler.handleEvents) === 'function' ) this.on(k, handler);
			}

			return this;
		},
		visitor: function(visitor) {
			if( !arguments.length ) return this._visitor;
			if( !visitor ) return this;
			this._visitor = visitor;
			return this;
		},
		scope: function(scope) {
			if( !arguments.length ) return this._scope || this;
			if( !scope ) return this;
			this._scope = scope;
			return this;
		},
		source: function(source) {
			if( !arguments.length ) return this._source || this.scope();
			if( !source ) return this;
			this._source = source;
			return this;
		},
		
		// actions
		wrap: function(o) {
			var self = this;
			o.on = function() {
				return self.on.apply(self, arguments);
			};
			o.un = function() {
				return self.un.apply(self, arguments);
			};
			o.has = function() {
				return self.has.apply(self, arguments);
			};
			o.fireSync = function() {
				return self.fireSync.apply(self, arguments);
			};
			o.fire = function() {
				return self.fire.apply(self, arguments);
			};
			o.getEventDispatcher = function() {
				return self;
			};

			return this;
		},
		isAllow: function(allow) {
			var types = this.types();
			if( !types ) return true;
			return (~types.indexOf(allow) || ~types.indexOf('*')) ? true : false;
		},
		has: function(action) {
			if( typeof(action) !== 'string' ) throw new Error('invalid action name:' + action);

			var listeners = this.listeners();
			var fns = listeners[action];

			if( fns ) {
				for(var i=0;i < fns.length;i++) {
					var fn = fns[i];
					if( typeof(fn) == 'function' ) {
						return true;
					}
				}
			}

			return false;
		},
		on: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) throw new Error('invalid event type:' + types);
			if( !(typeof(fn) === 'object' || typeof(fn) === 'function') ) throw new Error('invalid event listener:fn=' + fn);
			
			if( capture !== true ) capture = false;
			
			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' ) continue;
				if( !listeners[type] ) listeners[type] = [];

				var items = listeners[type];
				var item = {
					type: type,
					handler: fn,
					capture: capture
				};
				items.push(item);
				this.fireSync('event.on', item);
			}

			return this;
		},
		un: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) return console.error('[WARN] invalid event type', types);
			if( !fn || !(typeof(fn) === 'object' || typeof(fn) === 'function') ) return console.error('[WARN] invalid event handler', fn);
			
			if( capture !== true ) capture = false;

			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' || !listeners[type] ) continue;
			
				var items = listeners[type];
				for(var x=items.length - 1;x >= 0;x--) {
					var item = items[x];
					if( item && item.type === type && item.handler === fn && item.capture === capture) {
						items[x] = null;
						items = items.splice(x, 1);
						this.fireSync('event.un', item);
					}
				}
			}

			return this;
		},
		dispatchEvent: function(event, scope) {
			if( this.silent() ) return this;

			if( !(event instanceof EventObject) ) throw new Error('invalid EventObject:' + event);

			var listeners = this.listeners();			
			var global = listeners['*'] || [];
			var items = global.concat(listeners[event.type] || []);
			
			if( items ) {
				for(var i=(items.length - 1);i >= 0;i--) {					
					var item = items[i];
					var handler = item.handler;
					
					var result;
					if( typeof(handler) == 'function' ) {
						result = handler.call(scope || {}, event);
					} else if( typeof(handler) == 'object' && typeof(handler.handleEvent) === 'function' ) {						
						result = handler.handleEvent(event);
					} else {
						console.warn('invalid event listener(bypassed)', handler.toString());
					}

					if( result === false ) event.preventDefault();						
					if( event.cancelBubble ) break;
				}
			}

			return this;
		},
		fireSync: function(action, values, fn) {
			//if( action === 'named' ) console.error('fireSync', action, values);
			if( typeof(action) !== 'string' ) return null;

			var event = new EventObject({
				values: values || {},
				src: this.source(),
				type: action
			});

			if( this.silent() ) return event;

			var targets = [this];
			var visitor = this.visitor();
			if( event.bubbles ) {
				var p = this.visitor().parent();
				for(;p;) {
					if( typeof(p.eventParent) !== 'function' ) break;
					targets.push(p);
					p = p.eventParent();
				}
			}

			for(var i=0; i < targets.length; i++) {
				var target = targets[i];
				event.target = target;
				
				target.dispatchEvent(event, this.scope());
				if( event.cancelBubble ) break;
			}
			
			if( typeof(fn) === 'function' ) {
				fn.call(this, event);
			} else if( fn ) {
				console.warn('invalid event callback:', action, fn);
			}

			return event;
		},
		fire: function(action, values, fn) {
			//if( action === 'named' ) console.error('fire', action, values);
			if( typeof(action) !== 'string' ) return this;

			var self = this;
			setTimeout(function() {
				self.fireSync(action, values, fn);
			}, 1);

			return this;
		}
	};
	

	return EventDispatcher;
})();



var DefaultCSS3Validator = (function() {
	"use strict"

	var PREFIX_KEYS = [
		'align-content',
		'align-items',
		'align-self',
		'animation-delay',
		'animation-direction',
		'animation-duration',
		'animation-fill-mode',
		'animation-iteration-count',
		'animation-name',
		'animation-play-state',
		'animation-timing-function',
		'appearance',
		'backface-visibility',
		'background-clip',
		'background-composite',
		'background-origin',
		'background-size',
		'border-fit',
		'border-horizontal-spacing',
		'border-image',
		'border-vertical-spacing',
		'box-align',
		'box-decoration-break',
		'box-direction',
		'box-flex',
		'box-flex-group',
		'box-lines',
		'box-ordinal-group',
		'box-orient',
		'box-pack',
		'box-reflect',
		'box-shadow',
		'box-sizing',
		'color-correction',
		'column-axis',
		'column-break-after',
		'column-break-before',
		'column-break-inside',
		'column-count',
		'column-gap',
		'column-rule-color',
		'column-rule-style',
		'column-rule-width',
		'column-span',
		'column-width',
		'filter',
		'flex',
		'flex-direction',
		'flex-flow',
		'flex-wrap',
		'flow-from',
		'flow-into',
		'flex-glow',
		'flex-shrink',
		'flex-basis',
		'font-kerning',
		'font-smoothing',
		'font-variant-ligatures',
		'grid-column',
		'grid-columns',
		'grid-row',
		'grid-rows',
		'highlight',
		'hyphenate-character',
		'hyphenate-limit-after',
		'hyphenate-limit-before',
		'hyphenate-limit-lines',
		'hyphens',
		'justify-content',
		'line-align',
		'line-box-contain',
		'line-break',
		'line-clamp',
		'line-grid',
		'line-snap',
		'locale',
		'margin-after-collapse',
		'margin-before-collapse',
		'marquee-direction',
		'marquee-increment',
		'marquee-repetition',
		'marquee-style',
		'mask-attachment',
		'mask-box-image',
		'mask-box-image-outset',
		'mask-box-image-repeat',
		'mask-box-image-slice',
		'mask-box-image-source',
		'mask-box-image-width',
		'mask-clip',
		'mask-composite',
		'mask-image',
		'mask-origin',
		'mask-position',
		'mask-repeat',
		'mask-size',
		'nbsp-mode',
		'order',
		'perspective',
		'perspective-origin',
		'print-color-adjust',
		'region-break-after',
		'region-break-before',
		'region-break-inside',
		'region-overflow',
		'rtl-ordering',
		'shape-inside',
		'shape-outside',
		'svg-shadow',
		'tap-highlight-color',
		'text-combine',
		'text-decorations-in-effect',
		'text-emphasis-color',
		'text-emphasis-position',
		'text-emphasis-style',
		'text-fill-color',
		'text-orientation',
		'text-security',
		'text-stroke-color',
		'text-stroke-width',
		'transform',
		'transform-origin',
		'transform-style',
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
		'user-drag',
		'user-modify',
		'user-select',
		'wrap-flow',
		'wrap-margin',
		'wrap-padding',
		'wrap-through',
		'writing-mode',
		'text-size-adjust'
	];

	var PREFIX_VALUES = {
		'display': ['box', 'flex', 'flexbox'],
		'transition': ['transform'],
		'transition-property': ['transform']
	};
	
	var NUMBER_SUFFIXES = {
		'height': 'px',
		'min-height': 'px',
		'max-height': 'px',
		'width': 'px',
		'min-width': 'px',
		'max-width': 'px',
		'margin': 'px',
		'margin-left': 'px',
		'margin-right': 'px',
		'margin-top': 'px', 
		'margin-bottom': 'px', 
		'padding': 'px',
		'padding-left': 'px',
		'padding-right': 'px',
		'padding-top': 'px',
		'padding-bottom': 'px',
		'line-height': 'px',
		'marquee-increment': 'px',
		'mask-box-image-outset': 'px',
		'column-rule-width': 'px',
		'border-image-outset': 'px',
		'border-left-width': 'px',
		'border-right-width': 'px',
		'border-top-width': 'px',
		'border-bottom-width': 'px',
		'border-radius': 'px',
		'border-top-left-radius': 'px',
		'border-top-right-radius': 'px',
		'border-bottom-left-radius': 'px',
		'border-bottom-right-radius': 'px',
		'outline-offset': 'px',
		'outline-width': 'px',
		'word-spacing': 'px',
		'text-indent': 'px',
		'font-size': 'px',

		'animation-duration': 's',
		'animation-delay': 's',
		'transition-delay': 's',
		'transition-duration': 's',

		'perspective-origin': '%',
		'text-stroke-width': 'px'
	};

	// remove prefix in value
	function normalizeValue(v) {
		if( !v || typeof(v) !== 'string' ) return v;

		v = v.trim();
		v = v.split('-webkit-').join('');
		v = v.split('-moz-').join('');
		v = v.split('-ms-').join('');
		v = v.split('-o-').join('');
		v = v.split('-wap-').join('');

		return v;
	}
	
	// remove prefix in key
	function normalizeKey(v) {
		if( typeof(v) === 'string' ) return normalizeValue(v.toLowerCase());
		return v;
	}

	// class DefaultCSSValidator
	function DefaultCSS3Validator(prefix) {
		prefix = prefix || '';
		if( prefix ) prefix = '-' + prefix + '-';
		prefix = prefix.split('--').join('-');
		this.prefix = prefix;
	}

	DefaultCSS3Validator.prototype = {
		rule: function(rule) {
			if( typeof(rule) !== 'string' ) throw new Error('invalid css rule', rule);

			var rule = normalizeValue(rule);
			
			var device;
			var prefix = this.prefix;
			if( ~rule.indexOf(':input-placeholder') || ~rule.indexOf(':placeholder')) {
				rule = rule.split('::input-placeholder').join(':placeholder');
				rule = rule.split(':input-placeholder').join(':placeholder');
				rule = rule.split('::placeholder').join(':placeholder');
				rule = rule.split(':placeholder').join('::placeholder');

				device = [];

				if( prefix === '-ms-' ) {
					device = rule.split('::placeholder').join(':' + prefix + 'input-placeholder');
				} else if( prefix === '-webkit-' ) {
					device = rule.split('::placeholder').join('::' + prefix + 'input-placeholder');
				} else if( prefix === '-moz-' ) {
					device.push(rule.split('::placeholder').join(':' + prefix + 'placeholder'));
					device.push(rule.split('::placeholder').join('::' + prefix + 'placeholder'));
				} else {
					device = rule.split('::placeholder').join('::' + prefix + 'placeholder');
				}
			}

			if( ~rule.indexOf('@keyframes') ) device = rule.split('@keyframes').join('@' + prefix + 'keyframes');
			
			device = device || rule;

			return {
				original: rule,
				device: device
			};
		},
		key: function(key) {
			if( typeof(key) !== 'string' ) throw new Error('invalid css key', key);

			key = normalizeKey(key);

			var deviceKey = key;
			if(~PREFIX_KEYS.indexOf(key)) {
				deviceKey = this.prefix + key;
			}
			
			return {
				original: key,
				device: deviceKey,
				merged: (key === deviceKey) ? key : [key, deviceKey]
			};
		},
		value: function(key, value) {
			if( typeof(key) !== 'string' ) throw new Error('invalid css key', key);
			
			var key = this.key(key);

			var processValue = function(prefix, keyname, value) {
				value = normalizeValue(value);

				var pv = PREFIX_VALUES[keyname];
				var targetValue = pv ? pv[pv.indexOf(value)] : null;

				return {
					key: key,
					original: value,
					device: (( targetValue ) ? (prefix + targetValue) : value)
				};
			};
			
			var prefix = this.prefix;			
			if( typeof(value) === 'string' ) {
				var splits = value.split(',');

				var argo = [];
				var argd = [];
				for(var i=0; i < splits.length; i++) {
					var value = splits[i].trim();

					var result = processValue(prefix, key.original, value);
					argo.push(result.original);
					argd.push(result.device);
				}

				return {
					key: key,
					original: argo.join(', '),
					device: argd.join(', ')
				};
			} else if( typeof(value) === 'number' ) {
				value = ((value === 0) ? '0' : (value + (NUMBER_SUFFIXES[key.original] || '')));

				return {
					key: key,
					original: value,
					device: value
				};
			}

			return {
				key: key,
				original: value,
				device: value
			};
		}
	};

	return DefaultCSS3Validator;
})();


var CSS3Calibrator = (function() {
	"use strict"
	
	function camelcase(key) {
		var position;
		try {
			while( ~(position = key.indexOf('-')) ) {
				var head = key.substring(0, position);
				var lead = key.substring(position + 1, position + 2).toUpperCase();
				var tail = key.substring(position + 2);
				key = head + lead + tail;
			}

			key = key.substring(0,1).toLowerCase() + key.substring(1);
		} catch(e) {
			console.error('WARN:style key camelcase translation error', key, e);
		}

		return key;
	}

	function CSS3Calibrator(device) {
		this.device = device;
		var prefix = device.prefix;
		if( !prefix || typeof(prefix) !== 'string' ) prefix = '';
		this.adapter = new DefaultCSS3Validator(prefix || '');
	}

	CSS3Calibrator.prototype = {
		adapter: function(c) {
			if( !arguments.length ) return this.adapter;
			if( typeof(c) !== 'object' ) throw new Error('invalid calibrator(object)', c);
			this.adapter = c;
			return this;
		},
		camelcase: function(key) {
			if( key === 'float' ) {
				if( this.device.is('ie') ) return 'styleFloat';
				else if( this.device.is('gecko') ) return 'cssFloat';
			}

			return camelcase(key);
		},
		value: function(key, value) {
			if( typeof(key) !== 'string' ) throw new Error('invalid key(string)', key);

			if( Array.isArray(value) ) {
				var o = {original:{},device:{},merged:{}};

				for(var i=0; i < value.length; i++) {
					var result = this.adapter.value(key, value[i]);

					var k = result.key;

					if( !o.original[k.original] ) o.original[k.original] = [];
					if( !o.device[k.device] ) o.device[k.device] = [];

					o.original[k.original].push(result.original);
					o.device[k.device].push(result.device);

					if( key.original === key.device ) {
						if( !o.merged[k.original] ) o.merged[k.original] = [];

						if( result.original === result.device ) {
							o.merged[k.original].push(result.original);
						} else {
							o.merged[k.original].push(result.original);
							o.merged[k.device].push(result.device);
						}
					} else {
						if( !o.merged[k.original] ) o.merged[k.original] = [];						
						if( !o.merged[k.device] ) o.merged[k.device] = [];

						o.merged[k.original].push(result.original);
						o.merged[k.device].push(result.device);
					}
				}

				return o;
			} else {
				var result = this.adapter.value(key, value);

				var k = result.key;
				
				var o = {original:{},device:{},merged:{}};
				o.original[k.original] = result.original;
				o.device[k.device] = result.device;
				
				if( k.original === k.device && result.original !== result.device ) {
					o.merged[k.original] = [];
					o.merged[k.original].push(result.original);
					o.merged[k.original].push(result.device);
				} else {
					o.merged[k.original] = result.original;
					o.merged[k.device] = result.device;
				}
				return o;
			}
		},
		values: function(values) {
			if( typeof(values) !== 'object' ) throw new Error('invalid values(object)');
			
			var result = {
				original: {},
				device: {},
				merged: {}
			};
			for(var key in values) {
				if( !values.hasOwnProperty(key) ) continue;
								
				var calibrated = this.value(key, values[key]);
				key = this.key(key);

				result.original[key.original] = calibrated.original[key.original];
				result.device[key.device] = calibrated.device[key.device];

				if( !Array.isArray(key.merged) ) key.merged = [key.merged];

				for(var i=0; i < key.merged.length;i++) {
					result.merged[key.merged[i]] = calibrated.merged[key.merged[i]];
				}
			}
			return result;
		},
		key: function(key) {
			if( typeof(key) !== 'string' ) throw new Error('invalid key(string)', key);
			return this.adapter.key(key);
		},
		rule: function(rule) {
			if( typeof(rule) !== 'string' ) throw new Error('invalid rule(string)', rule);

			if( ~rule.indexOf(',') ) rule = rule.split(',');
			
			if( Array.isArray(rule) ) {
				var result = {
					original: [],
					device: [],
					merged: []
				};

				for(var i=0; i < rule.length;i++) {
					var calibrated = this.adapter.rule(rule[i].trim());

					result.original.push(calibrated.original);
					result.device.push(calibrated.device);

					if( calibrated.original === calibrated.device ) {
						result.merged.push(calibrated.original);
					} else {
						result.merged.push(calibrated.original);

						if( Array.isArray(calibrated.device) ) result.merged = result.merged.concat(calibrated.device);
						else result.merged.push(calibrated.device);
					}
				}

				result.original = result.original.join(', ');
				result.device = result.device.join(', ');
				result.merged = result.merged.join(', ');

				return result;
			} else {
				var result = {};

				var calibrated = this.adapter.rule(rule);
				result.original = calibrated.original;
				result.device = calibrated.device;
				if( calibrated.original !== calibrated.device ) {
					result.merged = [calibrated.original];	
					
					if( Array.isArray(calibrated.device) ) result.merged = result.merged.concat(calibrated.device);
					else result.merged.push(calibrated.device);	
				} else {
					result.merged = result.original;
				}

				if(Array.isArray(result.original)) result.original = result.original.join(', ');
				if(Array.isArray(result.device)) result.device = result.device.join(', ');
				if(Array.isArray(result.merged)) result.merged = result.merged.join(', ');

				return result;
			}
		},
		proofread: function(rule, values) {
			var rules = this.rule(rule);
			values = this.values(values);

			var result = {
				original: {},
				device: {},
				merged: {}
			};

			var args = rules.original;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.original[rule] = values.original;
			}

			args = rules.device;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.device[rule] = values.device;
			}

			args = rules.merged;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.merged[rule] = values.merged;
			}
			
			return result;
		}
	};

	return CSS3Calibrator;
})();

/*

var c = new CSS3Calibrator('-webkit-');

if( false ) {
	console.log('display', JSON.stringify(c.key('display'), null, '\t'), '\n\n\n');
	console.log('box-flex', JSON.stringify(c.key('box-flex'), null, '\t'), '\n\n\n');
	console.log('-webkit-box-flex', JSON.stringify(c.key('-webkit-box-flex'), null, '\t'), '\n\n\n');
	console.log('-ms-box-flex', JSON.stringify(c.key('-ms-box-flex'), null, '\t'), '\n\n\n');
	console.log('-o-box-flex', JSON.stringify(c.key('-o-box-flex'), null, '\t'), '\n\n\n');
	console.log('-moz-box-flex', JSON.stringify(c.key('-moz-box-flex'), null, '\t'), '\n\n\n');
}

if( false ) {
	console.log('transition(width, transform, height)', JSON.stringify(c.value('transition', 'width, transform, height'), null, '\t'), '\n\n\n');
	console.log('transition(transform)', JSON.stringify(c.value('transition', 'transform'), null, '\t'), '\n\n\n');
	console.log('display(box)', JSON.stringify(c.value('display', 'box'), null, '\t'), '\n\n\n');
	console.log('display(block)', JSON.stringify(c.value('display', 'block'), null, '\t'), '\n\n\n');
	console.log('display(flex)', JSON.stringify(c.value('display', 'flex'), null, '\t'), '\n\n\n');
	console.log('box-flex', JSON.stringify(c.value('box-flex', 1), null, '\t'), '\n\n\n');
	console.log('height', JSON.stringify(c.value('height', 100), null, '\t'), '\n\n\n');
	
	console.log('display([box, flex])', JSON.stringify(c.value('display', ['box', 'flex']), null, '\t'), '\n\n\n');
	console.log('box-flex([1,2])', JSON.stringify(c.value('box-flex', [1, 2]), null, '\t'), '\n\n\n');
}

if( false ) {
	var o = {
		'display': 'box',
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'-moz-transition': 'background-color, color',
		'font-weight': 'bold'
	};

	console.log('values', JSON.stringify(c.values(o), null, '\t'), '\n\n\n');
}

if( false ) {
	console.log('.cmp, #cmp', JSON.stringify(c.rule('.cmp, #cmp'), null, '\t'), '\n\n\n');
	console.log('.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b', JSON.stringify(c.rule('.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b'), null, '\t'), '\n\n\n');
	console.log('@keyframes', JSON.stringify(c.rule('@keyframes'), null, '\t'), '\n\n\n');
	console.log('@-webkit-keyframes', JSON.stringify(c.rule('@-webkit-keyframes'), null, '\t'), '\n\n\n');
	console.log('.cmp:input-placeholder', JSON.stringify(c.rule('.cmp:input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp::input-placeholder', JSON.stringify(c.rule('.cmp::input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp::-webkit-input-placeholder', JSON.stringify(c.rule('.cmp::-webkit-input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp:-ms-input-placeholder', JSON.stringify(c.rule('.cmp:-ms-input-placeholder'), null, '\t'), '\n\n\n');
}

if( true ) {
	console.log('.field_text::input-placeholder ', JSON.stringify(c.rule('.field_text::input-placeholder '), null, '\t'), '\n\n\n');
}

if( false ) {
	var rule = '.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b';
	var o = {
		'display': ['box', 'flex'],
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'font-weight': 'bold'
	};

	console.log(rule, JSON.stringify(c.proofread(rule, o), null, '\t'), '\n\n\n');
}

if( false ) {
	var rule = '.cmp';
	var o = {
		'display': ['box', 'flex'],
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'font-weight': 'bold'
	};

	console.log(rule, JSON.stringify(c.proofread(rule, o), null, '\t'), '\n\n\n');
}


- key(key)
	display
	{
		original: 'display',
		device: 'display',
		merged: 'display'
	}

	box-flex
	{
		original: 'box-flex',
		device: '-webkit-box-flex',
		merged: ['box-flex', '-webkit-box-flex']
	}

	-webkit-box-flex
	{
		original: 'box-flex',
		device: '-webkit-box-flex',
		merged: ['box-flex', '-webkit-box-flex']
	}

- value(key, value)
	display, box
	{
		original: {
			'display': 'box'
		},
		device: {
			'display': '-webkit-box'
		},
		merged: {
			'display': ['box', '-webkit-box']
		}
	}

	box-flex, 1
	{
		original: {
			'box-flex': '1'
		},
		device: {
			'-webkit-box-flex': '1'
		},
		merged: {
			'box-flex': '1',
			'-webkit-box-flex': '1'
		}
	}

- rule(rule)
	.cmp
	{
		original: '.cmp',
		device: '.cmp',
		merged: '.cmp'
	}

	.cmp:input-placeholder
	{
		original: '.cmp:input-placeholder',
		device: '.cmp::-webkit-input-placeholder',
		merged: ['.cmp:input-placeholder', '.cmp::-webkit-input-placeholder']
	}

	.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp
	{
		original: ['.cmp', '.cmp:input-placeholder, #cmp', '.cmp > .a', '.cmp'],
		device: ['.cmp', '.cmp:input-placeholder, #cmp', '.cmp > .a', '.cmp'],
		merged: ['.cmp', '.cmp:input-placeholder', '.cmp::-webkit-input-placeholder', '#cmp', '.cmp > .a']
	}

- proofread(rule, o)
	".view > .a, .view > .b::input-placeholder", {
		'display': 'box',
		'box-flex': 1
	}

	{
		original: {
			'.view > .a': {
				'display': 'box',
				'box-flex': 1
			},
			'.view > .b::input-placeholder': {
				'display': 'box',
				'box-flex': 1
			}
		},
		device: {
			'.view > .a': {
				'display': '-webkit-box',
				'-webkit-box-flex': 1
			},
			'.view > .b::-webkit-input-placeholder': {
				'display': '-webkit-box',
				'-webkit-box-flex': 1
			}
		},
		merged: {
			'.view > .a': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			},
			'.view > .b::input-placeholder': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			},
			'.view > .b::-webkit-input-placeholder': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			}
		}
	}
*/

var Device = (function() {
	"use strict"

	// class device
	function Device() {
		var nav = window.navigator;
		var _platform = nav.platform;
		var agent = nav.userAgent;
		
		var platform = {
			name: '',
			version: '',
			codename: '',
			type: ''
		};
		var device = 'desktop';
		var engine = '';
		var browser = '';
		var version = '';
		var retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1);
		var touchable = 'ontouchstart' in window;
		var prefix = '';
		var hasTransform = false;
		var has3d = false;
		var resolution = {
			width: screen.width,
			height: screen.height 
		};
		
		if( ~agent.indexOf('Seamonkey/') ) engine = 'gecko', browser = 'seamonkey', prefix = '-moz-';
		else if( ~agent.indexOf('Firefox/') ) engine = 'gecko', browser = 'firefox', prefix = '-moz-';
		else if( ~agent.indexOf('Opera/') ) engine = 'presto', browser = 'opera', prefix = '-o-';
		else if( ~agent.indexOf('MSIE ') ) engine = 'trident', browser = 'msie', prefix = '-ms-';
		else if( ~agent.indexOf('webOS/') ) engine = 'webkit', browser = 'webos', prefix = '-webkit-';
		else if( ~agent.indexOf('Chromium/') ) engine = 'webkit', browser = 'chromium', prefix = '-webkit-';
		else if( ~agent.indexOf('Chrome/') ) engine = 'webkit', browser = 'chrome', prefix = '-webkit-';
		else if( ~agent.indexOf('Android') ) engine = 'webkit', browser = 'android', prefix = '-webkit-';
		else if( ~agent.indexOf('Safari/') ) engine = 'webkit', browser = 'safari', prefix = '-webkit-';
		else if( ~agent.indexOf('Kindle/')) engine = 'netfront', browser = 'kindle', prefix = '', platform = {name: 'kindle', type: 'tablet'};
		else if( ~agent.indexOf('NetFront/')) engine = 'netfront', browser = 'netfront', prefix = '';
		else if( ~agent.indexOf('BlackBerry')) engine = 'webkit', browser = 'blackberry', prefix = '', platform = {name: 'kindle', type: 'tablet'};
		else if( ~agent.indexOf('AppleWebKit/') ) engine = 'webkit', browser = 'webkit', prefix = '-webkit-';
		else if( ~agent.indexOf('Gecko/') ) engine = 'gecko', browser = 'gecko', prefix = '-moz-';
				
		if( !platform.name ) {
			if( ~agent.indexOf('(iPhone;') ) device = 'iphone', platform = {name: 'ios', type: 'mobile'};
			else if( ~agent.indexOf('(iPad;') ) device = 'ipad', platform = {name: 'ios', type: 'tablet'};
			else if( ~agent.indexOf('(iPod;') ) device = 'ipod', platform = {name: 'ios', type: 'mobile'};
			else if( ~agent.indexOf('Android') && ~agent.indexOf('Mobile') ) device = 'android', platform = {name: 'android', type: 'mobile'};
			else if( ~agent.indexOf('Android') ) device = 'android', platform = {name: 'android', type: 'tablet'};
		}

		if( !platform.type ) {
			if( (/ipad|android 3|xoom|sch-i800|playbook|tablet|kindle/i.test(agent.toLowerCase())) ) platform.type = 'tablet';
			else if( (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(agent.toLowerCase())) ) platform.type = 'mobile';
		}
		
		if( !platform.name ) {			
			if( ~agent.indexOf('Mac OS X;') ) platform = {name: 'osx', type: 'desktop'};
			else if( ~agent.indexOf('Mac OS') ) platform = {name: 'mac', type: 'desktop'};
			else if( ~agent.indexOf('Windows;') || _platform === 'Win32' ) platform = {name: 'windows', type: 'desktop'};
			else if( ~agent.indexOf('Linux;') ) platform = {name: 'linux', type: 'desktop'};
			else platform.name = _platform;
		}
		
		var style = document.documentElement.style;
		if( engine == 'webkit' ) hasTransform = ('webkitTransform' in style), has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
		else if( engine == 'gecko' ) hasTransform = ('MozTransform' in style);
		else if( engine == 'presto' ) hasTransform = ('OTransform' in style);
		else if( engine == 'trident' ) hasTransform = ('MSTransform' in style);
		if( !hasTransform ) hasTransform = ('Transform' in style);
		
		var index;
		if( browser === 'android' && ~(index = agent.indexOf('Android')) ) version = platform.version = agent.substring(index + 7, agent.indexOf(' ', index + 1));
		else if( browser === 'msie' && ~(index = agent.indexOf('MSIE ')) ) version = agent.substring(index + 5, agent.indexOf(';', index + 1));
		else if( browser === 'chrome' && ~(index = agent.indexOf('Chrome/')) ) version = agent.substring(index + 7, agent.indexOf(' ', index + 1));
		else if( browser === 'safari' && ~(index = agent.indexOf('Version/')) ) version = agent.substring(index + 8, agent.indexOf(' ', index + 1));
		
		this.agent = agent;
		this.platform = platform;
		this.device = device;
		this.engine = engine;
		this.browser = browser;
		this.version = version;
		this.retina = retina;
		this.touchable = touchable;
		this.prefix = prefix;
		this.hasTransform = hasTransform;
		this.has3d = has3d;
		this.resolution = resolution;

		this.calibrator = new CSS3Calibrator(this);

		// gecko 의 경우 innerText 바인딩
		if( engine === 'gecko' && window.HTMLElement && window.HTMLElement.prototype.__defineGetter__ ) {
			HTMLElement.prototype.__defineGetter__("innerText",function() {
				if(this.textContent) {
					return(this.textContent)
				} 
				else {
					var r = this.ownerDocument.createRange();
					r.selectNodeContents(this);
					return r.toString();
				}
			});
			
			HTMLElement.prototype.__defineSetter__("innerText",function(sText) {
				this.innerHTML = sText
			});
		}

		//console.log('device', JSON.stringify(this, null, '\t'));
	}

	Device.prototype = {
		is: function(query) {
			// engine
			if( query === 'webkit' ) return (this.engine === 'webkit');
			if( query === 'gecko' ) return (this.engine === 'gecko');
			if( query === 'netfront' ) return (this.engine === 'netfront');
			if( query === 'presto' ) return (this.engine === 'presto');
			if( query === 'trident' ) return (this.engine === 'trident');

			// platform type
			if( query === 'phone' ) return (this.platform.type === 'phone');
			if( query === 'tablet' ) return (this.platform.type === 'tablet');
			if( query === 'dsektop' ) return (this.platform.type === 'dsektop');

			// platform name
			if( query === 'ios' ) return (this.platform.name === 'ios');
			if( query === 'iphone' ) return (this.device === 'iphone');
			if( query === 'ipad' ) return (this.device === 'ipad');
			if( query === 'ipod' ) return (this.device === 'ipod');			
			if( query === 'android' ) return (this.platform.name === 'android');
			if( query === 'mac' ) return (this.platform.type === 'osx' || this.platform.type === 'mac');
			if( query === 'osx' ) return (this.platform.name === 'osx');
			if( query === 'windows' ) return (this.platform.name === 'windows');
			if( query === 'linux' ) return (this.platform.name === 'linux');
			
			// features
			if( query === 'retina' ) return this.retina;
			if( query === 'touchable' ) return this.touchable;
			if( query === '3d' ) return this.has3d;
			if( query === 'transform' ) return this.hasTransform;
			
			// browser
			if( query === 'ie' || query === 'ms' || query === 'msie' ) return (this.browser === 'msie');
			if( query === 'firefox' ) return (this.browser === 'firefox');
			if( query === 'kindle' ) return (this.browser === 'kindle');
			if( query === 'opera' ) return (this.browser === 'opera');
			if( query === 'chrome' ) return (this.browser === 'chrome');
			if( query === 'chromium' ) return (this.browser === 'chromium');
			if( query === 'safari' ) return (this.browser === 'safari');
			if( query === 'blackberry' ) return (this.browser === 'blackberry');
			if( query === 'webkit browser' ) return (this.browser === 'webkit');
			if( query === 'android browser' ) return (this.browser === 'android');			

			return false;
		}
	};

	return new Device();
})();


var StyleSession = (function() {
	"use strict"
	
	var calibrator = Device.calibrator;

	// class Template
	function StyleSession(el) {
		this.el = el;
		this.buffer = {};
	}

	StyleSession.prototype = {
		toString: function() {
			return this.text();
		},
		toJSON: function() {
			return this.get();
		},
		raw: function(text) {
			if( !arguments.length ) return this.el.style.cssText;			
			if( typeof(text) === 'string' ) this.el.attr('style', text);
			return this;
		},
		text: function(text) {
			if( !arguments.length ) {
				var styles = this.get();
			
				var text = '';
				for(var key in styles) {
					text += key + ': ' + (styles[key] || '') + '; ';
				}
				
				return text;
			}
			
			if( typeof(text) === 'string') {
				var args = text.split(';');
				for(var i=0; i < args.length ; i++) {					
					var item = args[i];
					if( item ) {
						var keyvalue = item.split(':');
						var key = keyvalue[0];
						var value = keyvalue[1];
						if( typeof(value) === 'string') value = value.trim();
						this.set(key.trim(), value);
					}
				}
			} else {
				console.error('[WARN] illegal style text', text);
			}
			
			return this;
		},
		get: function(key) {
			if( !arguments.length ) {
				var o = {};
				var el = this.el;
				
				var raw = el.style.cssText;
				if( raw ) {
					var args = raw.split(';');
					for(var i=0; i < args.length ; i++) {					
						var item = args[i];
						if( item ) {
							var keyvalue = item.split(':');
							var key = calibrator.key(keyvalue[0].trim()).original;
							
							o[key] = this.get(key);
						}
					}
				}
				
				var buffer = this.buffer;
				for(var key in buffer) {
					o[key] = buffer[key];
				}
				
				return o;				
			}
			
			if( typeof(key) !== 'string' ) console.error('[WARN] invalid key', key);
			
			var buffer = this.buffer;
			if( buffer[key] ) return buffer[key];
			
			var el = this.el;
			key = calibrator.key(key);
			var value = el.style[calibrator.camelcase(key.device)] || el.style[calibrator.camelcase(key.original)];
			var calibrated = calibrator.value(key.original, value);
			return calibrated.original[key.original];
		},
		set: function(key, value) {
			if( arguments.length === 1 && key === false ) return this.clear();
						
			var o = {};
			if( typeof(key) === 'string' ) o[key] = value;
			else if( typeof(key) === 'object' ) o = key;
			else return this;

			var calibrated = calibrator.values(o);
			var merged = calibrated.merged;
			var buffer = this.buffer;

			if( merged ) {
				for(var key in merged) {
					if( !merged.hasOwnProperty(key) ) continue;
				
					var value = merged[key];
					buffer[key] = value;
				}
			}
			
			return this;
		},
		clear: function() {
			this.buffer = {$clear: true};
		},
		rollback: function() {
			this.buffer = {};
		},
		commit: function() {
			var el = this.el;
			
			try {
				var original = el.style.cssText;
				var buffer = this.buffer || {};
				this.buffer = {};
				if( buffer.$clear) el.style.cssText = '';
			
				for(var key in buffer) {
					if( !buffer.hasOwnProperty(key) ) continue;
				
					var value = buffer[key];
					key = calibrator.camelcase(key);
					if( !Array.isArray(value) ) value = [value];
									
					for(var i=0; i < value.length; i++) {
						try {
							if( value[i] === false ) el.style[key] = null;
							else el.style[key] = value[i];
						} catch(err) {
							console.error('[ERROR] style write failure (' + key + ':' + value[i] + ')');
							el.style.cssText = original;
							return this;
						}
					}
				}
			
				if( !el.style.cssText ) el.removeAttribute('style');
			} catch(err) {
				console.error('[ERROR] style write failure (' + err.message + ')', buffer, err);
				el.style.cssText = original;
			}
			
			return this;			
		}
	};

	return StyleSession;
})();

// test
if( false ) {
	var el = document.createElement('div');
	el.style.cssText = 'display:block;width:100%;';
	
	var session = new StyleSession(el);
	
	console.log('el', el);
	console.log('raw', session.raw());
	console.log('text', session.text());
	console.log('toString', session.toString());
	console.log('json', JSON.stringify(session));
	console.log('display', session.get('display'));
	console.log('width', session.get('width'));	
	
	session.set('font-weight', 'bold');
	session.set('height', 50);
	session.set('transition', 'all 1s');
	console.log('raw', session.raw());
	console.log('json', JSON.stringify(session));
	console.log('buffer', session.buffer);
	session.commit();
}


var Animator = (function() {
	"use strict"

	// privates
	function pixel(el, key, value) {
	}
	
	function toString(value, unit) {
		if( typeof(value) !== 'number' ) return value;
		return value + (unit || '');
	}

	var reserved = ['delay', 'use3d', 'backface', 'origin', 'perspective', 'easing', 'duration', 'perspective'];
	function transition(el, o) {
		var parent = el.parent();

		var session = el.style();
		if( o.use3d !== false ) session.set('transform-style', 'preserve-3d');
		if( o.backface === 'hidden' ) session.set('backface-visibility', 'hidden');
		if( o.origin ) session.set('transform-origin', o.origin);
		if( typeof(o.perspective) === 'number' ) parent.style('perspective', o.perspective);
		session.set('transition-timing-function', o.easing || Animator.DEFAULT_EASING || 'ease-in-out');		
		session.set('transition-duration', (o.duration || Animator.DEFAULT_DURATION) + 'ms');
		
		var properties = [];
		for(var key in o) {
			if( !key || !o.hasOwnProperty(key) || ~reserved.indexOf(key)) continue;

			var value = o[key];
			if( key === 'transform' && typeof(value) === 'object' ) {			
				var transform = o['transform'];
				
				var text = '';
				for(var key in transform) {
					if( !transform.hasOwnProperty(key) ) continue;
					
					var value = transform[key];
					
					if( key === 'x' ) text += 'translateX(' + toString(value, 'px') + ') ';
					else if( key === 'y' ) text += 'translateY(' + toString(value, 'px') + ') ';
					else if( key === 'z' ) text += 'translateZ(' + toString(value, 'px') + ') ';
					else if( key === 'rx' ) text += 'rotateX(' + toString(value, 'deg') + ') ';
					else if( key === 'ry' ) text += 'rotateY(' + toString(value, 'deg') + ') ';
					else if( key === 'rz' ) text += 'rotateZ(' + toString(value, 'deg') + ') ';
					else if( key === 'sx' ) text += 'scaleX(' + toString(value) + ') ';
					else if( key === 'sy' ) text += 'scaleY(' + toString(value) + ') ';
					else if( key === 'sz' ) text += 'scaleZ(' + toString(value) + ') ';
					else text += (key + '(' + value + ')');
				}
				
				//console.log('transform', text);
				
				session.set('transform', text);
				properties.push('transform');
			} else if( key ) {
				session.set(key, value);
				properties.push(key);
			}
		}

		session.set('transition-property', properties.join(','));		
		session.commit();
		//console.log('transition:', session.raw());
	}
	
	// class Animator
	function Animator(el, options, scope, exit) {
		if( !(el instanceof $) ) el = $(el);
		this.el = el;
		if( scope ) this.scope(scope);
		this._chain = [];
		this.index = -1;
		if( options ) this.chain(options);
		this._exit = exit || this.scope();
	}

	Animator.DEFAULT_DURATION = 250;
	Animator.DEFAULT_EASING = 'ease-in-out';
	Animator.FAULT_WAITING = 100;

	Animator.prototype = {
		chain: function(options) {
			if( !arguments.length ) return this._chain;
			if( typeof(options) === 'number' ) return this._chain[options];
			
			if( options === false ) {
				this._chain = [];
				return this;
			}

			var args = options;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length; i++) {
				var o = args[i];
				if( typeof(o) !== 'object' ) console.error('[WARN] illegal animation options', o);
				this._chain.push(o);
			}
			
			return this;
		},
		scope: function(scope) {
			if( !arguments.length ) return this._scope || this.el;
			if( scope ) this._scope = scope;
			return this;
		},
		length: function() {
			return this._chain.length;
		},
		out: function(exit) {
			if( !arguments.length ) return this._exit;
			this._exit = exit;
			return this;
		},
		reset: function(options) {
			this.stop();
			this.first();
			this.chain(options);
		},
		before: function(before) {
			if( !arguments.length ) return this._before;
			if( before === false ) {
				this._before = null;
				return this;
			}

			if( typeof(before) !== 'function' ) return console.error('Animator:before function must be a function', before);
			this._before = before;
			return this;
		},
		run: function(callback) {
			this.first();

			var before = this.before();
			if( before ) before.call(this.scope(), this);

			var fn = function() {
				if( !this.next(fn) && callback ) callback.call(this.scope(), this);
			};

			fn.call(this);

			return this;
		},
		reverse: function(callback) {
			this.last();

			var before = this.before();
			if( before ) before.call(this.scope(), this);

			var fn = function() {
				if( !this.prev(fn) && callback ) callback.call(this.scope(), this);
			};

			fn.call(this);

			return this;
		},
		executeCurrent: function(callback) {
			var self = this;
			var finished = false;
			var fn = function(e) {
				if( !finished ) {
					finished = true;
					self.el.un('transitionend', fn);
					if( callback ) callback.call(self.scope(), self);
				}
			};
			var options = this.chain(this.index);
			if( !options ) return false;
			this.el.on('transitionend', fn);
			
			if( typeof(options.delay) === 'number' ) {
				setTimeout(function() {
					transition(self.el, options);
				}, options.delay);
			} else {
				transition(this.el, options);
			}
			
			var wait = Animator.FAULT_WAITING;
			if( typeof(wait) !== 'number' || isNaN(options.delay) ) wait = 100;
			if( typeof(options.delay) === 'number' && !isNaN(options.delay) ) wait = wait + options.delay;
			if( typeof(options.duration) === 'number' && !isNaN(options.duration) ) wait = wait + options.duration;
			else wait += Animator.DEFAULT_DURATION;
			setTimeout(function() {
				if( !finished ) {
					finished = true;
					console.log('animation no affects', options);
					self.el.un('transitionend', fn);
					if( callback ) callback.call(self.scope(), self);
				}
			}, wait);

			return this;
		},
		first: function() {
			this.index = -1;
			return this;
		},
		last: function() {
			this.index = -1;
			return this;
		},
		next: function(callback) {
			var o = this.chain(++this.index);
			if( !o ) return false;
			var self = this;
			var b = this.executeCurrent(function(anim) {
				if( callback ) callback.call(self, anim);
			});
			if( !b ) return false;
			return this;
		},
		prev: function(callback) {
			var o = this.chain(--this.index);
			if( !o ) return false;
			var self = this;
			var b = this.executeCurrent(function(anim) {
				if( callback ) callback.call(self, anim);
			});
			if( !b ) return false;
			return this;
		}
	};

	return Animator;
})();


var Scroller = (function() {
	var SCROLL_INPUT_ELEMENTS =  ['input','textarea', 'select'];
	var SCROLL_HAS_TOUCH = ('createTouch' in document);

	var D = Device;

	function Scroller(el, options) {
		//*console.log('setup scroller', options);
		var s = this.options;
		var o = options;
		for(var k in o ) {
			var v = o[k];
			s[k] = v;	
		}

		this.id = (options) ? options.id : '';
		this.el = el.el || el;

		this.unlock();
	}

	Scroller.prototype = {
		options: {
			fps: (( D.is('android') ) ? 45 : (( D.is('ios') ) ? undefined : 120)),
			snapEasing: 'cubic-bezier(0.3, 0.6, 0.6, 1)',
			snapDelay: 250,
			initialY: 0,
			initialX: 0,
			lockThreshold: 0,
			overscroll: true,
			acceleration: true
		},
		
		id: undefined,
		clientWidth: 0,
		clientHeight: 0,
		contentWidth: 0,
		contentHeight: 0,
		lockThreshold: 0,
		
		target: undefined,
		overscroll: true,
		axisx: false,
		axisy: false,
		axisauto: false,
		startx: 0,
		starty: 0,
		lastx: 0,
		lasty: 0,
		lastd: 0,
		fpsInterval: undefined,
		use3d: true,
		beginTime: 0,
		acceleration: true,
		isDragging: false,
		hl: false,
		scale: 1,
		e: {},

		initialized: false,

		lock: function() {
			var el = this.el;

			if( SCROLL_HAS_TOUCH ) {
				el.removeEventListener('touchstart', this, false);
				el.removeEventListener('touchmove', this, false);
				el.removeEventListener('touchend', this, false);
			} else {
				el.removeEventListener('mousedown', this, false);
				el.removeEventListener('mousemove', this, false);
				el.removeEventListener('mouseup', this, false);
				el.removeEventListener('mouseout', this, false);
			}
			el.removeEventListener('gesturechange', this, false);
			el.removeEventListener('gestureend', this, false);
			el.removeEventListener('click', this, false);
			el.removeEventListener('click', this, true);
			el.removeEventListener('transitionend', this, false);
		},

		unlock: function() {
			var el = this.el;
			
			if( SCROLL_HAS_TOUCH ) {
				el.addEventListener('touchstart', this, false);
				el.addEventListener('touchmove', this, false);
				el.addEventListener('touchend', this, false);
			} else {
				el.addEventListener('mousedown', this, false);
				el.addEventListener('mousemove', this, false);
				el.addEventListener('mouseup', this, false);
				el.addEventListener('mouseout', this, false);
			}
			el.addEventListener('click', this, false);
			el.addEventListener('click', this, true);
			el.addEventListener('transitionend', this, false);
			
			if( this.options.zoom ) {
				el.addEventListener('gesturechange', this, false);
				el.addEventListener('gestureend', this, false);
			}
		},
		
		on : function( type, listener ) {
			if( !type || !listener ) return;
			this.e[type] = listener;
			this.hl = true;
		},

		fire : function(type, a,b,c,d,e,f,g,h) {
			var li = this.e[type];
			if( li && typeof(li) == 'function' ) li(a,b,c,d,e,f,g,h);
		},

		changeAxis: function(axis) {
			this.axisx = this.axisy = false;

			if( axis ) {
				if( axis == 'x' ) this.axisx = true;
				if( axis == 'y' ) this.axisy = true;
				if( axis == 'xy' || axis == 'yx' ) this.axisx = this.axisy = true;
			} else {
				this.axisy = true;
				this.axisauto = true;
			}

			//console.log('[' + this.id + ']', axis, this.axisx, this.axisy);

			this.validate();
		},

		reload: function() {
			this.initialized = true;
			var o = this.options;
			var self = this;

			this.stop();
			
			window.removeEventListener('resize', self.validate, false);
			window.addEventListener('resize', self.validate, false);

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			this.contentWidth = this.el.scrollWidth;
			this.contentHeight = this.el.scrollHeight;

			this.target = undefined;
			this.clientWidth = 0;
			this.clientHeight = 0;
			this.contentWidth = 0;
			this.contentHeight = 0;
			this.starty = 0;
			this.startx = 0;
			this.lastx = 0;
			this.lasty = 0;
			this.lastd = 0;
			this.use3d = (o.use3d === false) ? false : true;
			this.beginTime = 0;
			this.isDragging = false;

			this.acceleration = !(o.acceleration == false);		
			this.lockThreshold = o.lockThreshold ? o.lockThreshold : 0;
			this.overscroll = (o.overscroll == false) ? false : true;
			if( o.e ) {
				this.e = o.e;
				this.hl = true;
			}

			this.changeAxis(o.axis);

			this.unlock();

			var fps = o.fps;
			if( fps && !isNaN(parseInt(fps)) ) this.fpsInterval = Math.round(1000 / fps);
			//*//*console.log('[' + this.id + '] fps interval:' + this.fpsInterval + ' use 3d:' +  this.use3d + ' axisx:' + this.axisx + ', axisy:' + this.axisy + ', momentum:', this.acceleration);
		},

		destroy: function() {
			var el = this.el;

			this.lock();

			if( this.hl ) this.fire('destroyed', this);
		},
		
		validate: function(e) {
			if( this.hl ) this.fire('beforevalidate', this);
			
			//console.warn('clientHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.clientHeight);
			//console.warn('scrollHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.scrollHeight);
			//console.warn('offsetHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.offsetHeight);
			
			if( !this.el || !this.el.parentNode ) return;

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			if( this.scale == 1) this.contentWidth = this.el.scrollWidth;
			if( this.scale == 1) this.contentHeight = this.el.scrollHeight;
			this.bottomx = -(this.contentWidth - this.clientWidth);
			this.bottomy = -(this.contentHeight - this.clientHeight);
			var x = this.lastx;
			var y = this.lasty;

			if( this.scale === 1 ) {
				this.ocw = this.contentWidth;
				this.och = this.contentHeight;
			}

			if( this.axisauto ) {			
				this.axisx = false;
				this.axisy = true;
				if( this.contentWidth > this.clientWidth ) {
					this.axisx = true;
					this.axisy = false;
				}
				if( this.contentHeight > this.clientHeight ) this.axisy = true;
				//console.log('axisauto', this.axisx, this.axisy);
			}
			
			////*//*console.log('[' + this.id + '] x:' + this.clientWidth + ',' + this.contentWidth + ' = ' + -(this.contentWidth - this.clientWidth));
			//*//*console.log('[' + this.id + '] y:' + this.clientHeight + '/' + this.contentHeight + ', ' + this.bottomy + ',' + y);

			var bx = this.bottomx = -(this.contentWidth - this.clientWidth);
			var by = this.bottomy = -(this.contentHeight - this.clientHeight);
			
			//this.stop();
			//console.log('[' + this.id + ']', x, y, bx, by);

			//바운더리 벗어났다면, 바운드한다.
			if( this.axisy ) {
				if( y > 0 || by >= 0 ) {
					this.toTop();
				} else if( y < by ) {
					this.toBottom();
				}
			}
			
			if( this.axisx ) {
				if( x > 0 || bx >= 0 ) {
					this.toLeft();
				} else if( x < bx ) {
					this.toRight();
				}
			}
			if( this.hl ) this.fire('aftervalidate', this);
		},

		//event handler
		handleEvent: function(e) {
			if( !this.initialized ) this.reload();
			//scrollTo 피니시 펑션 수행 : 새로운 사용자 액션 혹은 트랜지션 종료시 실행
			if( this.scrollToFn ) {
				var fn = this.scrollToFn;
				this.scrollToFn = null;
				//console.log('finished scrollTo');
				fn(this, this.lastx, this.lasty)
			}

			if( !e.type == 'click' ) e._handleByScroller = true;
			//y가 고정이면 x 축 스크롤링(axisx) 일 경우만 동작, x 가 고정이면 y축 스크롤링(axisy) 인 경우만 동작
			if( (e.lockx && this.axisx) || (e.locky && this.axisy) ) return;
			
			var tag = e.target.tagName;

			//줌
			if( this.options.zoom ) {
				//console.log('줌');
				if( e.type == 'gesturechange' ) {
					e.preventDefault();
					this.zoomlock = true;
					var scale = this.scale = e.scale;				
					
					this.contentWidth = Math.round(scale * this.ocw);
					this.contentHeight = Math.round(scale * this.och);

					this.axisx = true;
					this.axisy = true;
					
					var el = this.el;
					el.css('transition', '');
					el.css('transform', 'scale(' + e.scale + ')');
				} else if( e.type == 'gestureend' ) {
					e.preventDefault();
					e.stopPropagation();				

					this.contentWidth = Math.round(scale * this.ocw);
					this.contentHeight = Math.round(scale * this.och);
					
					var el = this.el;
					el.css('transition', '');
					el.css('transform', 'scale(' + e.scale + ')');
					

					this.validate();

					this.zoomlock = false;				
				}
			
				if( this.zoomlock ) return;
			}

			if( e.type == 'touchstart' || e.type == 'mousedown' ) {
				this.begin(e);
			} else if( this.isDragging && (e.type == 'touchmove' || e.type == 'mousemove') ) {
				var p = e.touches ? e.touches[0] : e;
				if( (!this.fpsInterval || this.lastd == 0 || (e.timeStamp - this.lastd) > this.fpsInterval) ) {
					this.moving(e,p);
				}

				//하위 이벤트에 락 통보
				if( this.lockThreshold ) {
					var dx = Math.abs(p.clientX - this.startx);
					var dy = Math.abs(p.clientY - this.starty);

					////*//*console.log('dx,dy:', dx, dy);

					if( this.axisy && dx <= this.lockThreshold ) e.lockx = true;
					if( this.axisx && dy <= this.lockThreshold ) e.locky = true;
				}

				if( this.axisx && this.lastx < 0 && this.lastx > this.bottomx ) e.lockx = true;
				if( this.axisy && this.lasty < 0 && this.lasty > this.bottomy ) e.locky = true;
				////*console.warn('[' + this.id + '] lock:', e.lockx, e.locky );	
			} else if( this.isDragging && (e.type == 'touchend' || e.type == 'mouseup') ) {		
				this.finish(e);
			/*} else if( this.isDragging && e.type == 'mouseout' ) {
				this.out(e);*/
			} else if( e.type == 'click' ) {
				if( e.touches && e.touches.length > 1 ) {
					e.stopPropagation();
					return;
				}
				//e.preventDefault();
				//console.warn(e._handleByScroller);
				
				//안드로이드의 경우 select 이벤트를 소프트로 대체해줘야 한다... 망할
				if( D.is('android') && tag == 'SELECT' ) {
					return;
				}

				if( !e._handleByScroller ) {
					e.stopPropagation();
					//e.preventDefault();
				}
				return;
			} else if( e.type == 'webkitTransitionEnd' ) {
				if( e.target != this.el ) return;
				//console.warn(e.target, e);

				if( e.propertyName == '-webkit-transform' ) {
					//*console.log('scroller transition finished : ' + this.id, e);
					if( this.hl ) {
						if( this.isOver ) {
							console.log('finished with transition');
							this.fire('finish', this, this.lastx, this.lasty, this.bottomx, this.bottomy, this.isOver, e, this.dx, this.dy);
						}
					}
				}

				this.validate();

				e.stopPropagation();
				return;
			}
			
			
			//TODO: 이거 왜 했을까.. 이유를 알 수 없음
			//아무튼 안드로이드에서만 유독 인풋에서 발생한 이벤트가 상위로 올라감. 
			if( ~tag.indexof('SELECT', 'INPUT', 'TEXTAREA') ) {
				//this.validate();
				//e.preventDefault();
				//e.stopPropagation();
			}
		},

		begin: function(e) {
			//*//*console.log('[' + this.id + '] begin');
			////*console.log(e);

			this.stop();
			this.validate();

			this.el.css('transition', '');
			
			//*console.log('[' + this.id + '] x:' + this.clientWidth + ',' + this.contentWidth + ' = ' + -(this.contentWidth - this.clientWidth));
			//*console.log('[' + this.id + '] y:' + this.clientHeight + ',' + this.contentHeight + ' = ' + -(this.contentHeight - this.clientHeight));

			this.isDragging = true;
			this.beginTime = e.timeStamp;

			var p = e.touches ? e.touches[0] : e;
			this.target = e.target;

			this.starty = p.clientY;
			this.startOffsetY = this.lasty;

			this.startx = p.clientX;
			this.startOffsetX = this.lastx;

			this.dx = 0;
			this.dy = 0;

			if( this.hl ) this.fire('begin', this, e);
		},

		moving: function(e,p) {
			this.lastd = e.timeStamp;

			var currenty = p.clientY;
			var deltay = currenty - this.starty;
			var y = deltay + this.startOffsetY;

			var currentx = p.clientX;
			var deltax = currentx - this.startx;
			var x = deltax + this.startOffsetX;

			this.dx = (p.clientX - this.startx);
			this.dy = (p.clientY - this.starty);
			
			//바운더리를 넘었다면. 특정값에 수렴하도록 한다.
			if(y && this.axisy) {
				if( y >= 0 ) {
					if( !this.overscroll ) return;
					y = y - (deltay/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				} else if( y <= this.bottomy ) {
					if( !this.overscroll ) return;
					y = y - (deltay/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				}
				
				if(y) this._scrollBy(null,y);
			}

			//바운더리를 넘었다면. 특정값에 수렴하도록 한다.
			if(x && this.axisx) {
				if( x >= 0 ) {
					if( !this.overscroll ) return;
					x = x - (deltax/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				} else if( x <= this.bottomx ) {
					if( !this.overscroll ) return;
					x = x - (deltax/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				}
				
				if(x) this._scrollBy(x,null);
			}

			if( this.hl ) this.fire('moving', this, e, this.dx, this.dy);
		},

		finish: function(e) {
			if( this.hl ) this.fire('beforefinish', this, e);
			//*console.log('[' + this.id + '] finish');

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			if( this.scale == 1) this.contentWidth = this.el.scrollWidth;
			if( this.scale == 1) this.contentHeight = this.el.scrollHeight;

			var bx = this.bottomx = -(this.contentWidth - this.clientWidth);
			var by = this.bottomy = -(this.contentHeight - this.clientHeight);
			var x = this.lastx;
			var y = this.lasty;
			var duration = e.timeStamp - this.beginTime;

			//console.log('[' + this.id + '] finish:', this.contentHeight, this.clientHeight);
			
			var isOver = false;
			
			//*//*console.log('[' + this.id + '] y:' + this.clientHeight + '/' + this.contentHeight + ', ' + this.bottomy + ',' + y);
			
			if( this.axisx && this.axisy ) {
				if( y >= 0 || by >= 0 ) {
					isOver = true;
					this.toTop();
				} else if( y < by ) {
					isOver = true;
					this.toBottom();
				} else if (duration < 300 && this.acceleration) {
					if(this.dy > 0) this.toTop(3000);
					if(this.dy < 0) this.toBottom(3000);
				}

				if( x >= 0 || bx >= 0 ) {
					isOver = true;
					this.toLeft();
				} else if( x < bx ) {
					isOver = true;
					this.toRight();
				} else if (duration < 300 && this.acceleration) {
					//this.toRight(1200);
					if(this.dx > 0) this.toLeft(3000);
					if(this.dx < 0) this.toRight(3000);
				}
			} else if( this.axisy ) {
				if( y >= 0 || by >= 0 ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'y', y, e);
					this.toTop();
				} else if( y < by ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'y', y - by, e);
					this.toBottom();
				} else if (duration < 300 && this.acceleration) {
					var my = this._momentum(y - this.startOffsetY, duration, -y, ((this.clientHeight - this.contentHeight) < 0 ? this.contentHeight - this.clientHeight + y : 0), this.options.overscroll ? this.clientHeight : 0);
					var ny = y + my.dist;
					this.scrollTo(0, ny, my.time);
				}
			} else if( this.axisx ) {
				if( x >= 0 || bx >= 0 ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'x', x, e);
					this.toLeft();
				} else if( x < bx ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'x', x - bx, e);
					this.toRight();
				} else if (duration < 300 && this.acceleration) {
					var mx = this._momentum(x - this.startOffsetX, duration, -x, ((this.clientWidth - this.contentWidth) < 0 ? this.contentWidth - this.clientWidth + x : 0), this.options.overscroll ? this.clientWidth : 0);
					var nx = x + mx.dist;
					this.scrollTo(nx, 0, mx.time);
				}
			}

			this.isDragging = false;
			
			if( !e._dispatched && Math.abs(this.dx) <= 20 && Math.abs(this.dy) <= 20 ) {
				this._dispatchOriginalEvent(e);
			}
			e._dispatched = true;

			this.isOver = isOver;
			if( this.hl ) {
				if( ! this.isOver ) {
					//console.log('finished normally');
					this.fire('finish', this, this.lastx, this.lasty, this.bottomx, this.bottomy, this.isOver, e, this.dx, this.dy);
				}
			}
		},
		
		/*out: function(e) {
			var target = e.target;
			var related = e.relatedTarget;
			console.log('[' + this.id + '] out', this.el, target, related);
			if (false) {
				//만약 out 이벤트가 element 의 자식이 아닌것으로 일어났다면, 정지한다. 자식이라면 그대로 진행.
				

				if (!target) {
					//*//*console.log('[' + this.id + '] out', target);
					this.finish(e);
					return;
				}

				if(target.parentNode == this.el) {
					//*//*console.log('[' + this.id + '] out', target);
					this.finish(e);
					return;
				}
				
				//*//*console.log('[' + this.id + '] related', target);
				//*//*console.log('[' + this.id + '] element', this.el);

				while (target = target.parentNode) {
					//*//*console.log('[' + this.id + '] elemend', target);
					if (target == this.el) {
						this.finish(e);
						return;
					}
				}
			}
		},*/

		//private
		_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
			var mround = function(r) { return r >> 0; }

			var deceleration = 0.00065,
				speed = Math.abs(dist) / time,
				newDist = (speed * speed) / (2 * deceleration),
				newTime = 0, outsideDist = 0;

			// Proportinally reduce speed if we are outside of the boundaries 
			if (dist > 0 && newDist > maxDistUpper) {
				outsideDist = size / (6 / (newDist / speed * deceleration));
				maxDistUpper = maxDistUpper + outsideDist;
				speed = speed * maxDistUpper / newDist;
				newDist = maxDistUpper;
			} else if (dist < 0 && newDist > maxDistLower) {
				outsideDist = size / (6 / (newDist / speed * deceleration));
				maxDistLower = maxDistLower + outsideDist;
				speed = speed * maxDistLower / newDist;
				newDist = maxDistLower;
			}

			newDist = newDist * (dist < 0 ? -1 : 1);
			newTime = speed / deceleration;

			return { dist: newDist, time: mround(newTime) };
		},
		/*_momentum : function(dx,dy,mx,my,d) {
			var nx, ny, timex, timey;

			if( dx ) {
				var vx = dx / d;
				var ax = vx < 0 ? 0.0006 : -0.0006;
				nx = - (vx * vx) / (2 * ax);
				timex = - vx / ax;
				
				if( nx >= 0 ) {
					timex = timex * (mx/nx);
					nx = 0;
				} else if( nx < mx ) {
					timex = timex * (mx/nx);
					nx = mx;
				}
			}
			
			if( dy ) {
				var vy = dy / d;
				var ay = vy < 0 ? 0.0006 : -0.0006;
				ny = - (vy * vy) / (2 * ay);
				timey = - vy / ay;

				if( ny >= 0 ) {
					timey = timey * (my/ny);
					ny = 0;
				} else if( ny < my ) {
					timey = timey * (my/ny);
					ny = my;
				}
			}
			
			return {
				time: ((timex > timey) ? timex : timey),
				nx: nx,
				ny: ny
			};
		},*/

		_scrollBy: function(x,y) {
			////*//*console.log('[' + this.id + '] _scrollBy:', x, y);
			if(x != 0 ) x = x || this.lastx;
			if(y != 0 ) y = y || this.lasty;
			
			this.lastx = x;
			this.lasty = y;
			//this.el.style('transform'] = 'translate(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ')';
			
			if( this.use3d ) {
				this.el.css('transform', 'translate3d(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ', 0)');
			} else {
				this.el.css('transform', 'translate(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ')');
			}
		},

		_dispatchOriginalEvent: function (e) {
			var target = this.target;
			
			//인풋 개체인 경우 click 이벤트 발생하지 않는다.
			if (SCROLL_INPUT_ELEMENTS.indexOf(target.localName) != -1) {
				return;
			}

			if( D.is('webkit') ) {
				var pe = document.createEvent('MouseEvent');
				pe.initMouseEvent('click', true, false, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
				pe._handleByScroller = true;
				pe._ignoreInner = e._ignoreInner;
				target.dispatchEvent(pe);
			} else if( document.dispatchEvent ) {
				var pe = document.createEvent( "MouseEvents" );
				pe.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, target);
				pe._handleByScroller = true;
				pe._ignoreInner = e._ignoreInner;
				target.dispatchEvent(pe);
			} else if( document.fireEvent ) {
				target.fireEvent("onclick");
			}
		},
		
		//public
		scrollTo: function(x, y, ms, fn, easing) {
			//*//*console.log('[' + this.id + '] scrollTo:', x, y, ms);
			//*//*console.log('[' + this.id + '] translate3d(0, ' + y + 'px, 0)');
			if(ms !== 0) this.el.css('transition', 'transform ' + (ms || this.options.snapDelay) + 'ms ' + (easing || this.options.snapEasing));
			this._scrollBy(x, y, fn);
			
			if( fn && typeof(fn) == 'function' ) {
				if( ms == 0 && fn ) {
					fn(this, this.lastx, this.lasty);
				} else {
					this.scrollToFn = fn;
				}
			}
		},

		stop: function() {
			if( this.hl ) this.fire('beforestop', this);
			//*//*console.log('[' + this.id + '] stop');
			var style = document.defaultView.getComputedStyle(this.el, null);
			if( window.WebKitCSSMatrix ) {
				var transform = new WebKitCSSMatrix(style['webkitTransform']);
				this._scrollBy(transform.m41, transform.m42);
				this.el.css('transition', '');
				this.el.css('transition-duration', '');
				this.el.css('transition-delay', '');
				this.el.css('transform-timing-function', '');
				//*console.warn('[' + this.id + '] m41/m42:', transform.m41, transform.m42);
			}

			//this.validate();
			if( this.hl ) this.fire('afterstop', this);
		},

		toTop: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toTop:', ms);
			this.scrollTo(null,0,ms, easing, fn);
		},
		
		toBottom: function(ms, easing, fn) {
			if( !this.axisy ) return;
			//console.log('[' + this.id + '] toBottom:', ms, this.contentHeight, this.clientHeight);
			this.scrollTo(null,-(this.contentHeight - this.clientHeight),ms, easing, fn);
		},

		toLeft: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toLeft:', ms);
			this.scrollTo(0,null,ms, easing, fn);
		},
		
		toRight: function(ms, easing, fn) {
			if( !this.axisx ) return;
			//*//*console.log('[' + this.id + '] toRight:', ms);
			this.scrollTo(-(this.contentWidth - this.clientWidth),null,ms, easing);
		},

		toFirst: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toFirst:', ms);
			this.scrollTo(0,0,ms, easing, fn);
		},
		
		toLast: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toLast:', ms);
			var x = -(this.contentWidth - this.clientWidth);
			var y = -(this.contentHeight - this.clientHeight)
			
			if( !this.axisx ) x = 0;
			if( !this.axisy ) y = 0;

			this.scrollTo(x,y,ms, easing, fn);
		}
	};

	return Scroller;
})();

if( !String.prototype.startsWith ) {
	String.prototype.startsWith = function(s) {
		return this.indexOf(s) === 0;
	};
}

if( !String.prototype.endsWith ) {
	String.prototype.endsWith = function(s) {
		var t = String(s);
		var index = this.lastIndexOf(t);
		return index >= 0 && index === this.length - t.length;
	};
}

if ( !Array.prototype.every ) {
	Array.prototype.every = function(fun /*, thisArg */) {
		'use strict';

		if (this === void 0 || this === null) throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') throw new TypeError();

		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t && !fun.call(thisArg, t[i], i, t))
				return false;
		}

		return true;
	};
}

var $ = (function() {
	"use strict";
	
	function Selection(selector, criteria, single) {
		this.length = 0;
		this.refresh.apply(this, arguments);
	}
	
	var __root__ = {};
	function $(selector, criteria, single) {
		if( selector instanceof $ ) return selector;
		if( selector === document || selector === window ) return $;
		if( selector !== __root__ ) return new Selection(selector, criteria, single);
	}
	
	$.prototype = new Array();
	var prototype = Selection.prototype = new $(__root__);
	
	$.on = function(type, fn, bubble) {
		if( window.addEventListener ) {
			window.addEventListener(type, fn, ((bubble===true) ? true : false));
		} else if( window.attachEvent ) {
			if( type == 'DOMContentLoaded' ) {
				document.attachEvent("onreadystatechange", function(){
					if ( document.readyState === "complete" ) {
						document.detachEvent( "onreadystatechange", arguments.callee );
						if( fn ) fn.apply(this, arguments);
					}
				});
			} else {
				document.attachEvent('on' + type, fn, ((bubble===true) ? true : false));
			}
		}
		return this;
	};

	$.un = function(type, fn, bubble) {
		if( window.removeEventListener ) {
			window.removeEventListener(type, fn, ((bubble===true) ? true : false));
		} else {
			document.detachEvent('on' + type, fn, ((bubble===true) ? true : false));
		}
		return this;
	};
	
	$.ready = function(fn) {
		return $.on('DOMContentLoaded', fn);
	};
	
	$.create = function() {
		var tmp = $(document.createElement('div'));
		var items = tmp.create.apply(tmp, arguments).owner(null);
		tmp = null;
		return items;
	};
	
	$.fn = prototype;	
	
	// common functions
	function isNode(o){
		return (typeof(Node) === "object") ? o instanceof Node : 
			(o && typeof(o.nodeType) === 'number' && typeof(o.nodeName) === 'string');
	}
	
	function isElement(el) {
		if( typeof(el) !== 'object' ) return false;
		else if( !(window.attachEvent && !window.opera) ) return (el instanceof window.Element);
		else return (el.nodeType == 1 && el.tagName);
	}
	
	function merge(o) {
		if( !isNode(o) && typeof(o.length) === 'number' ) {
			for(var i=0; i < o.length; i++) {
				if( !~this.indexOf(o[i]) ) this.push(o[i]);
			}
		} else {
			if( !~this.indexOf(o) ) this.push(o);
		}
		return this;
	}
	
	function data(key, value) {
		if( !arguments.length ) return this.__alien__;
		if( arguments.length === 1 ) return this.__alien__ && this.__alien__[key];
		if( !this.__alien__ ) this.__alien__ = {};
		
		if( value !== false || value !== undefined ) {
			this.__alien__[key] = value;
		} else {
			this.__alien__[key] = undefined;
			try {
				delete this.__alien__[key];
			} catch(e) {}
		}
	}
	
	function resolve(value) {
		if( typeof(value) !== 'function' ) return value;
		return value.call(this, data.call(this, 'arg'));
	}
	
	function array_return(arr) {
		if( !arr || !arr.length ) return null;
		if( arr.length === 1 ) return arr[0];
		return arr;
	}
	
	function isHtml(html) {
		return ((typeof(html) === 'string') && (html.match(/(<([^>]+)>)/ig) || ~html.indexOf('\n'))) ? true : false;
	}
	
	function evalHtml(html, includeall) {
		var els = [];		
		if( typeof(html) !== 'string' ) return els;
		
		var el;
		if( !html.toLowerCase().indexOf('<tr') ) el = document.createElement('tbody');
		else if( !html.toLowerCase().indexOf('<tbody') || !html.toLowerCase().indexOf('<thead') || !html.toLowerCase().indexOf('<tfoot') ) el = document.createElement('table');
		else if( !html.toLowerCase().indexOf('<td') ) el = document.createElement('tr');
		else el = document.createElement('div');

		el.innerHTML = html;
		var children = (includeall) ? el.childNodes : el.children;
		if( children ) {
			for(var i=0; i < children.length; i++) {
				els.push(children[i]);
			}

			els.forEach(function(item) {
				el.removeChild(item);
			});
		}

		return els;
	}
	
	function accessor(el) {
		var tag = el.tagName.toLowerCase();
		var id = el.id;
		var cls = el.className.split(' ').join('.');
		id = id ? ('#' + id) : '';
		cls = cls ? ('.' + cls) : '';
		
		return tag + id + cls;
	}
	
	function assemble(selector) {
		if( !selector || typeof(selector) !== 'string' ) return console.error('invalid selector', selector);
		
		var arr = selector.split(':');
		
		var accessor = arr[0];
		var pseudo = arr[1];
		
		arr = accessor.split('.');
		var tag = arr[0];
		var id;
		var classes = arr.splice(1).join(' ').trim();
		
		if( ~tag.indexOf('#') ) {
			var t = tag.split('#');
			tag = t[0];
			id = t[1];
		}
		
		return {
			selector: selector,
			accessor: accessor,
			tag: tag && tag.toLowerCase() || '',
			id: id || '',
			classes: classes || '',
			pseudo: pseudo || ''
		};
	}
	
	function match(el, accessor) {
		if( accessor === '*' ) return true;
		var o = assemble(accessor);
		var tag = o.tag;
		var classes = o.classes;
		var id = o.id;
		var pseudo = o.pseudo;
				
		if( !tag || el.tagName.toLowerCase() === tag ) {
			if( !id || el.id === id ) {
				if( !classes || $(el).hasClass(classes) ) {
					if( !pseudo || matchPseudo(el, pseudo) ) return true;
				}
			}
		}
		
		return false;
	}
	
	function matchPseudo(el, pseudo) {
		if( !el || !pseudo ) return false;
		var p = el.parentNode;
		
		if( pseudo === 'first' ) {
			if( p && p.children[0] === el ) return true;
		} else if( pseudo === 'last' ) {
			if( p && p.children[p.children.length - 1] === el ) return true;
		} else if( pseudo === 'checked' ) {
			return (el.checked) ? true : false;		
		} else if( pseudo === 'selected' ) {
			return (el.selected) ? true : false;
		} else if( pseudo === 'empty' ) {
			return (!el.childNode.length) ? true : false;
		} else if( pseudo === 'checkbox' || pseudo === 'radio' || pseudo === 'select' ) {
			return (function(type) {
				return (el.tagName.toLowerCase() === 'input' && (el.getAttribute('type') || '').trim().toLowerCase() === type ) ? true : false;
			})(pseudo);
		} 
		
		return false;
	}
	
	function create(accessor, contents) {
		if( !accessor || typeof(accessor) !== 'string' ) return console.error('invalid parameter', accessor);
		
		var el;
		if( isHtml(accessor) ) {
			el = evalHtml(accessor)[0];
			if( !el ) return null;
			if( html ) el.innerHTML = html;
			return el; 
		} else {		
			var o = assemble(accessor);
			var tag = o.tag;
			var classes = o.classes;
			var id = o.id;
			
			if( !tag ) return console.error('invalid parameter', accessor);
		
			el = document.createElement(tag);
			if( id ) el.id = id;
			if( classes ) el.className = classes;
		}
		
		if( typeof(contents) === 'function' ) contents = contents.call(el);
		
		if( typeof(contents) === 'string' ) el.innerHTML = contents;
		else if( isElement(contents) ) el.appendChild(contents);
		else if( contents instanceof $ ) contents.appendTo(el);
		
		return el;
	}
	
	$.util = {
		merge: merge,
		data: data,
		isNode: isNode,
		match: match,
		isElement: isElement,
		isHtml: isHtml,
		evalHtml: evalHtml,
		create: create,
		accessor: accessor,
		assemble: assemble,
		array_return: array_return,
		resolve: resolve,
		matchPseudo: matchPseudo
	};
	
	// define essential functions
	prototype.add = merge;
	
	prototype.remove = function(item, once) {
		if( typeof(item) === 'number' ) item = this[item];
		for(var index;(index = this.indexOf(item)) >= 0;) {
			this.splice(index, 1);
			if( once ) break;
		}
		return this;
	};
	
	prototype.refresh = function(selector, criteria, single) {
		//if( arguments.length && !selector ) return console.error('invalid selector', selector);
		if( isHtml(selector) ) selector = evalHtml(selector);
		this.clear();
		this.selector = selector = selector || [];
		if( criteria ) this.criteria = criteria;
		if( single === true ) this.single = single = true;
		if( typeof(selector) === 'string' ) {
			var items = [];
					
			if( criteria instanceof $ ) {
				var self = this;
				criteria.each(function() {
					//console.log('selector', this, this.querySelectorAll(selector));	
					if( single && self.length > 0 ) return;
				
					if( single ) self.push(this.querySelector(selector));
					else merge.call(self, this.querySelectorAll(selector));
				});
			} else {
				if( single ) merge.call(this, (criteria || document).querySelector(selector));
				else merge.call(this, (criteria || document).querySelectorAll(selector));
			}
		} else {
			merge.call(this, selector);
		}
		return this;
	};
	
	prototype.each = function(fn) {
		this.every(function(el) {
			return ( fn.call(el) === false ) ? false : true;
		});
		return this;
	};
	
	prototype.reverse = function() {
		Array.prototype.reverse.call(this);
		return this;
	};
	
	prototype.clear = function() {
		var len = this.length;
		if( len > 0 ) {
			for(var i=0; i < len; i++) {
				this[i] = undefined;
				try {
					delete this[i];
				} catch(e) {}
			}
			
			this.length = 0;
		}
		
		return this;
	};
	
	prototype.get = function(index) {
		return this[index];
	};
		
	prototype.data = function(key, value) {
		if( typeof(key) === 'object' ) {
			for(var k in key) {
				if( key.hasOwnProperty(k) ) this.data(k, key[k]);
			}
			return this;
		}
			
		if( arguments.length <= 1 ) {
			var arg = arguments;
			var arr = [];
			this.each(function() {
				arr.push(data.apply(this, arg));
			});			
			return array_return(arr);
		}
		
		if( typeof(key) !== 'string' ) return console.error('invalid key', key);
		
		var self = this;
		return this.each(function() {
			var v = resolve.call(this, value);
			data.call(this, key, v);
		});
	};
	
	prototype.void = function() {
		return;	
	};
	
	prototype.arg = function(value) {
		if( !arguments.length ) return this.data('arg');
		this.data('arg', value);
		return this;
	};
	
	prototype.owner = function(owner) {
		if( !arguments.length ) return this.__owner__;
		
		if( owner && !(owner instanceof $) ) return console.error('owner selection must be an "$" instance, but', owner);
		this.__owner__ = owner || null;
		return this;
	};
	
	prototype.call = function(fn) {
		if( typeof(fn) !== 'function' ) return console.error('require function', fn);
		return this.each(function() {
			resolve.call(this, fn);
		});
	};
	
	prototype.out = prototype.end = function(step) {
		step = step || 1;
				
		var c = this;
		var last = c;
		var cnt = 0;
		for(;(c = (c.owner && c.owner()));) {
			cnt++;
			if( c ) last = c;
			if( typeof(step) === 'number' && step === cnt ) return last;
			else if( typeof(step) === 'string' && last.is(step) ) return last;
			
			if( cnt > 100 ) return console.error('so many out', this);
		}
		
		return console.error('can not found parent:' + (step || ''));
	};
	
	return $;
})();


// setup core functions
(function($) {
	"use strict";
	
	var fn = $.fn;
	
	var merge = $.util.merge;
	var accessor = $.util.accessor;
	var array_return = $.util.array_return;
	var resolve = $.util.resolve;
	var data = $.util.data;
	var create = $.util.create;
	var isElement = $.util.isElement;
	var evalHtml = $.util.evalHtml;
	var match = $.util.match;
	
	function stringify(el) {
		if( el.outerHTML ) {
			return el.outerHTML;
		} else {
			var p = el.parent();
			if( p ) {
				return p.html();
			} else {
				var html = '<' + el.tagName;
			
				if( el.style ) html += ' style="' + el.style + '"';
				if( el.className ) html += ' class="' + el.className + '"';
			
				var attrs = el.attributes;
				for(var k in attrs) {
					if( !attrs.hasOwnProperty(k) ) continue;
					if( k && attrs[k] ) {
						html += ' ' + k + '="' + attrs[k] + '"';
					}
				}

				html += '>';
				html += el.innerHTML;
				html += '</' + el.tagName + '>';

				return html;
			}
		}
	}
	
	function computed(el, k) {
		var cs;
		if ( el.currentStyle ) {
			cs = el.currentStyle;
		} else if( document.defaultView && document.defaultView.getComputedStyle ) {
			cs = document.defaultView.getComputedStyle(el);
		} else {
			return console.error('not support computed style');
			//throw new Error('browser does not support computed style');
		}

		return k ? cs[k] : cs;
	}
	
	function isShowing(el) {
		if( computed(el, 'visibillity') === 'hidden' ) return false;
		if( (el.scrollWidth || el.scrollHeight || el.offsetWidth || el.offsetHeight || el.clientWidth || el.clientHeight) ) return true;
		return false;
	}	
	
	// function template for node attributes
	function type1(attr, arg) {
		if( !arg.length ) {
			var arr = [];
			this.each(function() {
				arr.push(this[attr]);
			});
			return array_return(arr);
		}
				
		return this.each(function() {
			this[attr] = resolve.call(this, arg[0]);
		});
	}
	
	// function template for element attributes handling
	function type2(arg) {
		if( !arg.length ) {
			var arr = [];
			this.each(function() {
				var attrs = this.attributes;
				var o = {}; 
				for(var i= attrs.length-1; i>=0; i--) {
					o[attrs[i].name] = attrs[i].value;
				}

				arr.push(o);
			});			
			return array_return(arr);
		}
		
		var key = arg[0];
		var value = arg[1];
		
		if( typeof(key) === 'object' ) {
			for(var k in key) {
				if( key.hasOwnProperty(k) ) this.attr(k, key[k]);
			}
			return this;
		} else if( !key ) {
			return this;
		}
		
		if( typeof(key) !== 'string' ) return console.error('invalid key', key);
			
		if( arg.length === 1 ) {
			var arr = [];
			this.each(function() {
				arr.push(this.getAttribute(key));
			});
			return array_return(arr);
		}
		
		return this.each(function() {
			var v = resolve.call(this, value);
			if( v === false ) this.removeAttribute(key);
			else this.setAttribute(key, v || '');
		});
	}
	
	function boundary(el) {
		if( !el ) return console.error('invalid parameter', el);
		
		var abs = function(el) {
			var position = { x: el.offsetLeft, y: el.offsetTop };
			if (el.offsetParent) {
				var tmp = abs(el.offsetParent);
				position.x += tmp.x;
				position.y += tmp.y;
			}
			return position;
		};

		var boundary = {
			x: 0,
			y: 0,
			width: el.offsetWidth,
			height: el.offsetHeight,
			scrollWidth: el.scrollWidth,
			scrollHeight: el.scrollHeight,
			clientWidth: el.clientWidth,
			clientHeight: el.clientHeight
		};

		if( el.parentNode ) {
			boundary.x = el.offsetLeft + el.clientLeft;
			boundary.y = el.offsetTop + el.clientTop;
			if( el.offsetParent ) {
				var parentpos = abs(el.offsetParent);
				boundary.x += parentpos.x;
				boundary.y += parentpos.y;
			}
		}
		return boundary;
	}
	
	function camelcase(key) {
		var position;
		try {
			while( ~(position = key.indexOf('-')) ) {
				var head = key.substring(0, position);
				var lead = key.substring(position + 1, position + 2).toUpperCase();
				var tail = key.substring(position + 2);
				key = head + lead + tail;
			}

			key = key.substring(0,1).toLowerCase() + key.substring(1);
		} catch(e) {
			console.error('WARN:style key camelcase translation error', key, e);
		}

		return key;
	}
	
	function findChild(method, selector, arr) {
		if( typeof(selector) === 'number' ) {
			var c = this[method][selector];
			if( c ) arr.push(c);
		} else if( typeof(selector) === 'string' && !selector.startsWith('arg:') ) {	// find by selector
			var children = this[method];
			for(var i=0; i < children.length; i++) {
				var el = children[i];
				if( match(el, selector) ) arr.push(el);
			}
		} else if( selector ) {	// find by element's arg data
			if( selector.startsWith('arg:') ) selector = selector.substring(4);
			var children = this[method];
			for(var i=0; i < children.length; i++) {
				var el = children[i];
				if( data.call(el, 'arg') === selector ) arr.push(el);
			}
		} else {	// all children
			merge.call(arr, this[method]);	
		}
	}
	
	
	$.util.stringify = stringify;
	$.util.isShowing = isShowing;
	$.util.computed = computed;
	$.util.type1 = type1;
	$.util.boundary = boundary;
	$.util.camelcase = camelcase;
	$.util.findChild = findChild;
	
	
	// Let's define core functions
	// identifier & attributes
	fn.accessor = function() {
		var arr = [];
		this.each(function() {
			arr.push(accessor(this));
		});			
		return array_return(arr);
	};
	
	fn.id = function(id) {
		return type1.call(this, 'id', arguments);
	};
	
	fn.value = fn.val = function(value) {
		return type1.call(this, 'value', arguments);
	};
	
	fn.checked = function(checked) {
		checked = ( checked === true ) ? true : false;
		return type1.call(this, 'checked', arguments);
	};
	
	fn.check = function() {
		return this.each(function() {
			this.checked = true;	
		});
	};
	
	fn.uncheck = function() {
		return this.each(function() {
			this.checked = false;	
		});
	};
	
	fn.selected = function(selected) {
		selected = ( selected === true ) ? true : false;
		return type1.call(this, 'selected', arguments);
	};
	
	fn.select = function() {
		return this.each(function() {
			this.selected = true;	
		});
	};
	
	fn.unselect = function() {
		return this.each(function() {
			this.selected = false;	
		});
	};
	
	fn.name = function(name) {
		if( !arguments.length ) return this.attr('name');
		return this.attr('name', name);
	};
	
	fn.attr = function() {
		return type2.call(this, arguments);
	};
	
	// contents handling
	fn.text = function(value) {
		return type1.call(this, 'innerText', arguments);
	};
	
	fn.html = function(value) {
		return type1.call(this, 'innerHTML', arguments);
	};
	
	fn.outer = function(value) {
		return type1.call(this, 'outerHTML', arguments);
	};
	
	fn.empty = function() {
		return this.each(function() {
			this.innerHTML = '';	
		});
	};
	
	
	// style handling
	fn.css = function(key, value) {
		if( !arguments.length ) {
			var styles = this.style();
			
			if( !Array.isArray(styles) ) styles = [styles];
			var arr = [];
			for(var i=0; i < styles.length; i++) {
				arr.push(styles[i].get());
			}
			return array_return(arr);
		}
		
		return this.style.apply(this, arguments);
	};
	
	fn.style = function(key, value) {		
		if( !arguments.length ) {
			var arr = [];
			this.each(function() {
				arr.push(new StyleSession(this));
			});
			return array_return(arr);
		}
		
		if( typeof(key) === 'object' ) {
			return this.each(function() {
				new StyleSession(this).set(key).commit();
			});
		} else if( arguments.length === 1 ) {
			if( key === false ) {
				return this.each(function() {
					new StyleSession(this).clear().commit();
				});
			} else if( typeof(key) === 'string' && ~key.indexOf(':') ) {
				return this.each(function() {
					new StyleSession(this).text(key).commit();
				});
			} else if( typeof(key) === 'string' ) {
				var arr = [];
				this.each(function() {
					arr.push(new StyleSession(this).get(key));
				});
				return array_return(arr);
			} else {
				return console.error('illegal key', key);
			}
		}
		
		return this.each(function() {
			var v = resolve.call(this, value);
			new StyleSession(this).set(key, v).commit();
		});
	};
	
	fn.computed = function(key) {
		var arr = [];
		this.each(function() {
			arr.push(computed(this, key));
		});
		return array_return(arr);		
	};
	
		
	// accessor & class	
	fn.classes = function(cls, flag) {
		if( !arguments.length ) {
			var arr = [];
			this.each(function() {
				arr.push(this.className.trim().split(' '));
			});			
			return arr;
		}
				
		return this.each(function() {			
			var classes = resolve.call(this, cls);
			
			var el = this;
			var o = (el.className || '').trim();

			if( typeof(flag) === 'boolean' ) {
				if( !classes ) return this;
				if( Array.isArray(classes) ) classes = classes.join(' ');
				classes = classes.split(' ');
			
				var args = el.className.trim().split(' ');
				for(var i=0; i < classes.length; i++) {
					var c = classes[i];
					if( c ) {
						if( !flag && ~args.indexOf(c) ) args.splice(args.indexOf(c), 1);
						else if( flag && !~args.indexOf(c) ) args.push(c);
					}
				}

				el.className = args.join(' ').trim();
			} else {
				el.className = '';
				el.removeAttribute('class');
				if( Array.isArray(classes) ) classes = classes.join(' ').trim();
				if( classes ) el.className = classes.trim();
			}
		});
	};	
	
	fn.ac = fn.addClass = function(s) {
		return this.classes(s, true);
	};
		
	fn.hasClass = function(s) {
		if( !s || typeof(s) !== 'string' ) return s;
		s = s.split(' ');
		
		var hasnot = false;
		this.each(function() {
			for(var i=0; i < s.length; i++) {
				var cls = s[i];
				if( !cls || !~this.className.split(' ').indexOf(cls) ) hasnot = true;
			}
		});
		
		return !hasnot;
	};
	
	fn.is = function(s) {
		if( !s || typeof(s) !== 'string' ) return false;
		var hasnot = false;
		this.each(function() {
			if( !match(this, s) ) hasnot = true;
		});
		
		return !hasnot;
	};
	
	fn.not = function(s) {
		return !this.is(s);
	};
	
	fn.rc = fn.removeClass = function(s) {
		return this.classes(s, false);
	};
	
	fn.cc = fn.clearClass = function() {
		return this.each(function() {
			var el = this;
			el.className = '';
			el.removeAttribute('class');
		});
	};
	
	
	// find parent & children
	fn.parent = function(cnt) {
		var arr = [];
		this.each(function() {
			var p = this.parentNode;
			if( p ) arr.push(p);
		});
		return $(arr).owner(this);
	};
	
	fn.all = fn.find = function(selector) {
		if( !arguments.length ) selector = '*';
		return $(selector, this).owner(this);
	};
	
	fn.one = function(selector) {
		if( !arguments.length ) selector = '*';
		return $(selector, this, true).owner(this);
	};
	
	fn.children = function(selector) {
		var arr = [];
		this.each(function() {
			findChild.call(this, 'children', selector, arr);
		});
		return $(arr).owner(this);
	};
	
	fn.contents = function(selector) {
		var arr = [];
		this.each(function() {
			findChild.call(this, 'childNodes', selector, arr);
		});
		return $(arr).owner(this);	
	};
	
	fn.filter = fn.except = function(fn) {
		return this.subset(fn, false);
	};
	
	fn.subset = function(selector, positive) {
		var items = [];
		
		positive = (positive === false) ? false : true;
		
		var fn = selector;
		if( typeof(selector) === 'string' ) {
			fn = function() {
				return match(this, selector);
			}
		}
		
		this.each(function() {
			var result = fn.apply(this, arguments);
			if( positive ) {
				if( result === true ) items.push(this);
			} else {
				if( result !== true ) items.push(this);
			}			
		});
		return $(items).owner(this);
	};
	
	fn.visit = function(fn, direction, containSelf, ctx) {
		if( typeof(fn) !== 'function' ) return console.error('fn must be a function');
		
		if( direction && !~['up', 'down'].indexOf(direction) ) return console.error('invalid direction', direction);
		containSelf = (containSelf === false) ? false : true;
		ctx = ctx || this;
		
		return this.each(function() {			
			if( containSelf && fn.call(this, ctx) === false ) return false;
	
			var propagation;
			if( direction === 'up' ) {
				propagation = function(el) {
					var p = el.parentNode;
					if( p ) {
						if( fn.call(p, ctx) !== false ) {
							propagation(p);
						} else {
							return false;
						}
					}
				};
			} else {
				propagation = function(el) {
					var argc = el.children;
					if( argc ) {
						for(var i=0; i < argc.length;i++) {
							var cel = argc[i];
							if( fn.call(cel, ctx) !== false ) {
								propagation(cel);
							} else {
								return false;
							}
						}
					}
				};
			}

			propagation(this);
		});
	};
	
	fn.contains = function(child) {
		var contains = false;
		this.each(function() {
			var self = this;
			// TODO: 교집합을 구하는 것으로 수정해야 한다. child 가 모두 포함되어 있어야 contains 로 인정
			if( child instanceof $ ) return child.each(function() {
				if( self !== this && self.contains(this) ) contains = true;
			});

			if( typeof(child) === 'string' ) child = this.querySelector(child);
			if( this !== child && this.contains(child) ) contains = true;
		});		
		return contains;
	};
	
	fn.first = function() {
		return $(this[0]).owner(this);
	};
	
	fn.last = function() {
		return $(this[this.length - 1]).owner(this);
	};
	
	fn.at = function(index) {
		return $(this[index]).owner(this);
	};
	
	// TODO : 구현미비
	fn.in = function(el) {
		var contains = false;				
		this.each(function() {
			if( typeof(el) === 'string' ) el = this.querySelector(el);
			
			if( this === el ) contains = true;
		});		
		return contains;
	};
	
	// TODO : 구현미비
	fn.equals = function(target) {
		if( target === this ) return true;
		if( (target instanceof $) && target.length === 1 ) target = target[0];
		return (this.length === 1 && target === this[0]) ? true : false;
	};
	
	// creation
	fn.clone = function(args) {
		if( !args ) args = [null];
		if( typeof(args) === 'number') args = new Array(args);
		if( args && typeof(args.length) !== 'number' ) args = [args];
		
		var arr = [];
		this.each(function() {
			for(var i=0, len=args.length; i < len; i++) {
				var el = this.cloneNode(true);				
				$(el).data('arg', args[i]).save('#create');
				arr.push(el);
			}
		});
		return $(arr).owner(this);
	};
	
	fn.create = function(accessor, args, fn) {
		if( typeof(accessor) !== 'string' ) return console.error('invalid accessor', accessor);
		
		if( arguments.length === 2 && typeof(args) === 'function' ) {
			fn = args;
			args = [null];
		} else if( arguments.length === 1 ) {
			args = [null];
		} else if( !args ) {
			args = [];
		}
		
		if( typeof(args) === 'number') args = new Array(args);
		if( typeof(args) === 'string') args = [args];
		if( args && typeof(args.length) !== 'number' ) args = [args];
		
		var arr = [];
		this.each(function() {
			for(var i=0, len=args.length; i < len; i++) {
				var el = create.call(this, accessor);
				this.appendChild(el);
				$(el).data('arg', args[i]).save('#create');
				arr.push(el);
			}
		});
		
		return $(arr).owner(this);
	};
	
	fn.save = function(name) {
		return this.each(function() {
			var attrs = this.attributes;
			var o = {};
			for(var i= attrs.length-1; i>=0; i--) {
				o[attrs[i].name] = attrs[i].value;
			}
			
			var o = {
				html: this.innerHTML,
				attrs: o
			};
			
			data.call(this, 'save.' + name, o);
			data.call(this, 'save.#last', o);
		});
	};
	
	fn.restore = function(name) {
		return this.each(function() {
			var saved = name ? data.call(this, 'save.' + name) : data.call(this, 'save.#last');
			
			if( !saved ) return ~name.indexOf('#') ? null : console.warn('no saved status', name || '');			
			this.innerHTML = saved.html || '';
			
			// remove current attributes
			var attrs = this.attributes;
			for(var i= attrs.length-1; i>=0; i--) {
				this.removeAttribute(attrs[i].name);
			}
			
			attrs = saved.attrs;
			for(var k in attrs) {
				this.setAttribute(k, attrs[k]);
			}
		});
	};
	
	fn.append = function(items) {
		if( !items ) return console.error('items was null', items);
				
		return this.each(function() {
			var els = resolve.call(this, items);
			
			if( !(els instanceof $) ) els = $(els);
			
			var target = this;
			els.each(function() {
				target.appendChild(this);
			});
		});
	};
	
	fn.prepend = function(items) {
		if( !items ) return console.error('items was null', items);
				
		return this.each(function() {
			var els = resolve.call(this, items);
			
			if( !(els instanceof $) ) els = $(els);
			
			var target = this;
			els.each(function() {
				if( target.childNodes.length ) target.insertBefore(this, target.childNodes[0]);
				else target.appendChild(this);
			});
		});		
	};
	
	fn.before = fn.insertBefore = function(items) {
		if( !items ) return console.error('items was null', items);
				
		return this.each(function() {
			var els = resolve.call(this, items);
			
			if( !(els instanceof $) ) els = $(els);
			
			var target = this.parentNode;
			var before = this;
			if( target ) {
				els.each(function() {
					//console.error('before', this, before, target);
					target.insertBefore(this, before);
				});
			}
		});
	};
	
	fn.after = fn.insertAfter = function(items) {
		if( !items ) return console.error('items was null', items);
				
		return this.each(function() {
			var els = resolve.call(this, items);
			
			if( !(els instanceof $) ) els = $(els);
			
			var target = this.parentNode;
			if( target ) {
				var before = this.nextSibling; //;target.children[target.children.indexOf(this) + 1];
				els.each(function() {
					if( before ) target.insertBefore(this, before);
					else target.appendChild(this);
				});
			}
		});
	};
	
	fn.appendTo = function(target) {
		if( !target ) return console.error('target was null', target);
		
		return this.each(function() {
			var dest = resolve.call(this, target);
			
			if( typeof(dest) === 'string' ) dest = $(dest);
			if( dest instanceof $ ) dest = dest[dest.length - 1];
			
			dest.appendChild(this);
		});
	};
	
	fn.prependTo = function(target) {
		if( !target ) return console.error('target was null', target);
				
		return this.each(function() {
			var dest = resolve.call(this, target);
			
			if( typeof(dest) === 'string' ) dest = $(dest);
			if( dest instanceof $ ) dest = dest[dest.length - 1];
			
			if( dest.childNodes.length ) dest.insertBefore(this, dest.childNodes[0]);
			else dest.appendChild(this);
		});
	};
	
	fn.detach = function() {
		return this.each(function() {
			var p = this.parentNode;
			if( p ) p.removeChild(this);
		});
	};
	
	fn.unwrap = function() {
		return this.each(function() {
			var p = this.parentNode;
			if( !p ) return;
			
			var nodes = p.childNodes;
			var argc = [];
			if( nodes ) for(var a=0; a < nodes.length;a++) argc.push(nodes[a]);

			if( argc ) {
				if( p.parentNode ) {
					for(var a=0; a < argc.length;a++) {
						p.parentNode.insertBefore(argc[a], p);
					}
					p.parentNode.removeChild(p);
				}
			}
		});
	};
	
	fn.wrap = function(accessor) {
		var el = create(accessor);
		if( !isElement(el) ) return console.error('invalid accessor or html', accessor);
				
		var arr = [];
		this.each(function() {
			var p = this.parentNode;
			var newp = $(el).clone()[0];
			if( p ) p.insertBefore(newp, this);
			newp.appendChild(this);
			arr.push(newp);
		});		
		return $(arr).owner(this);
	};
	
	
	// events
	fn.on = function(types, fn, capture) {
		if( typeof(types) !== 'string' ) return console.error('invalid event type', types);
		if( typeof(fn) !== 'function' ) return console.error('invalid fn', fn);
	
		capture = (capture===true) ? true : false;
		types = types.split(' ');
	
		return this.each(function() {
			var el = this;
		
			for(var i=0; i < types.length; i++) {
				var type = types[i];
			
				if( el.addEventListener ) {
					el.addEventListener(type, fn, capture);

					if( type.toLowerCase() == 'transitionend' ) {
						el.addEventListener('webkitTransitionEnd', fn, capture);
					}
				} else if( el.attachEvent ) {
					el.attachEvent('on' + type, fn);
				}
			}			
		});
	};
	

	fn.off = function(types, fn, capture) {
		if( typeof(types) !== 'string' ) return console.error('invalid event type', types);
		if( typeof(fn) !== 'function' ) return console.error('invalid fn', fn);
	
		capture = (capture===true) ? true : false;
		types = types.split(' ');
	
		return this.each(function() {			
			var el = this;
		
			for(var i=0; i < types.length; i++) {
				var type = types[i];
			
				if( el.removeEventListener ) {
					el.removeEventListener(type, fn, capture);

					if( type.toLowerCase() == 'transitionend' )
						el.removeEventListener('webkitTransitionEnd', fn, capture);
				} else if( el.attachEvent ) {
					el.detachEvent('on' + type, fn);
				}
			}
		});
	};

	fn.fire = function(types, values) {
		if( !types ) return console.error('invalid event type:', types);
	
		values = values || {};
		types = types.split(' ');
	
		return this.each(function() {
			var e, el = this;
		
			for(var i=0; i < types.length; i++) {
				var type = types[i];
			
				// eventName, bubbles, cancelable
				if( document.createEvent ) {
					e = document.createEvent('Event');
					e.initEvent(type, ((values.bubbles===true) ? true : false), ((values.cancelable===true) ? true : false));
				} else if( document.createEventObject ) {
					e = document.createEventObject();
				} else {
					return console.error('this browser does not supports manual dom event fires');
				}
	
				for(var k in values) {
					if( !values.hasOwnProperty(k) ) continue;
					var v = values[k];
					try {
						e[k] = v;
					} catch(err) {
						console.error('[WARN] illegal event value', e, k);
					}
				}
				e.values = values;
				e.src = this;

				if( el.dispatchEvent ) {
					el.dispatchEvent(e);
				} else {
					e.cancelBubble = ((values.bubbles===true) ? true : false);
					el.fireEvent('on' + type, e );
				}
			}
		});
	};
	
	
	// view handling
	fn.hide = function(options, fn) {
		var self = this;
		var internal = function() {
			self.each(function() {
				this.style.display = 'none';
				$(this).fire('hide');
			});

			if(fn) fn.apply(self, arguments);
		};

		if( typeof(options) === 'object' ) {
			this.anim(options, scope || this).run(internal);
		} else {
			if( typeof(options) === 'function' ) fn = options;
			internal.call(this);
		}
		
		return this;
	};
	
	fn.invisible = function(options, fn) {
		var self = this;
		var internal = function() {
			self.each(function() {
				this.style.visibility = 'hidden';
				$(this).fire('invisible');
			});

			if(fn) fn.apply(self, arguments);
		};

		if( typeof(options) === 'object' ) {
			this.anim(options, scope || this).run(internal);
		} else {
			if( typeof(options) === 'function' ) fn = options;
			internal.call(this);
		}
		
		return this;
	};
	
	fn.show = function(options, fn) {
		var self = this;
		var internal = function() {
			self.each(function() {
				var el = $(this);
				
				this.style.display = '';
				this.style.visibility = '';
				if( !this.style.cssText ) el.attr('style', false);
				
				if( el.computed('display').toLowerCase() === 'none' ) this.style.display = 'block';
				if( el.computed('visibility').toLowerCase() === 'hidden' ) this.style.display = 'visible';
				el.fire('show');
			});

			if(fn) fn.apply(self, arguments);
		};

		if( typeof(options) === 'object' ) {
			this.anim(options, scope || this).run(internal);
		} else {
			if( typeof(options) === 'function' ) fn = options;
			internal.call(this);
		}
		
		return this;
	};
	
	fn.fade = function(start, end) {
		return this.each(function() {
			var el = this;
			
			var opacity = 0;
			el.style.opacity = 0;
			el.style.filter = '';

			var last = +new Date();
			var tick = function() {
				opacity += (new Date() - last) / 400;
				el.style.opacity = opacity;
				el.style.filter = 'alpha(opacity=' + (100 * opacity)|0 + ')';

				last = +new Date();

				if (opacity < 1) {
					(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
				}
			};

			tick();
		});
	};
	
	fn.fadeIn = function() {
		return this.fade(0, 1);
	};
	
	fn.fadeOut = function() {
		return this.fade(1, 0);
	};
		
	
	// status
	fn.staged = function(index) {
		if( typeof(index) === 'number' ) return document.body.contains(this[index]);
		
		var cnt = 0;
		this.each(function() {
			if( document.body.contains(this) ) cnt++;
		});
		
		return (cnt > 0 && cnt === this.length);
	};
	
	fn.showing = function(index) {
		if( typeof(index) === 'number' ) return isShowing(this[index]);
		
		var cnt = 0;
		this.each(function() {
			if( isShowing(this) ) cnt++;
		});
		
		return (cnt > 0 && cnt === this.length);
	};
	
	
	// size & position
	fn.boundary = function() {
		var arr = [];
		this.each(function() {
			arr.push(boundary(this));
		});
		return array_return(arr);
	};
	
	
	// misc
	fn.bg = function(bg) {
		if( !arguments.length ) {
			var arr = [];
			this.each(function() {
				var el = this, o = {};

				if( el.style.backgroundImage ) o['image'] = el.style.backgroundImage;
				if( el.style.backgroundColor ) o['color'] = el.style.backgroundColor;
				if( el.style.backgroundSize ) o['size'] = el.style.backgroundSize;
				if( el.style.backgroundPosition ) o['position'] = el.style.backgroundPosition;
				if( el.style.backgroundAttachment ) o['attachment'] = el.style.backgroundAttachment;
				if( el.style.backgroundRepeat ) o['repeat'] = el.style.backgroundRepeat;
				if( el.style.backgroundClip ) o['clip'] = el.style.backgroundClip;
				if( el.style.backgroundOrigin ) o['origin'] = el.style.backgroundOrigin;
	
				arr.push(o);
			});
			return array_return(arr);
		}
		
		if( typeof(bg) === 'string' ) {
			var s = bg.trim().toLowerCase();
			if( (!~bg.indexOf('(') && !~bg.indexOf(' ')) || bg.startsWith('rgb(') || bg.startsWith('rgba(') || bg.startsWith('hsl(') || bg.startsWith('hlsa(') ) bg = {'color':bg};
			else bg = {'image':bg};
		}
		
		if( typeof(bg) !== 'object' ) return this;
		
		return this.each(function() {
			var el = $(this);	
			el.style('background-image', bg['image']);
			el.style('background-color', bg['color']);
			el.style('background-size', bg['size']);
			el.style('background-position', bg['position']);
			el.style('background-attachment', bg['attachment']);
			el.style('background-repeat', bg['repeat']);
			el.style('background-clip', bg['clip']);
			el.style('background-origin', bg['origin']);
		});
	};
	
	fn.font = function(font) {
		if( !arguments.length ) {
			var arr = [];
			this.each(function() {
				var el = this, o = {};
				
				if( el.style.fontFamily ) o['family'] = el.style.fontFamily;
				if( el.style.fontSize ) o['size'] = el.style.fontSize;
				if( el.style.fontStyle ) o['style'] = el.style.fontStyle;
				if( el.style.fontVarient ) o['variant'] = el.style.fontVarient;
				if( el.style.fontWeight ) o['weight'] = el.style.fontWeight;
				if( el.style.fontSizeAdjust ) o['adjust'] = el.style.fontSizeAdjust;
				if( el.style.fontStretch ) o['stretch'] = el.style.fontStretch;
				if( el.style.letterSpacing ) o['spacing'] = el.style.letterSpacing;
				if( el.style.lineHeight ) o['height'] = el.style.lineHeight;
		
				arr.push(o);
			});
			return array_return(arr);			
		}
		
		return this.each(function() {
			var el = $(this);
			if( typeof(font) === 'string' ) {
				el.style('font', font);
			} else if( typeof(font) === 'number' ) {
				el.style('font-size', font + 'px');
			} else if( typeof(font) === 'object' ){
				el.style('font-family', font['family']);
				el.style('font-size', font['size']);
				el.style('font-style', font['style']);
				el.style('font-variant', font['variant']);
				el.style('font-weight', font['weight']);
				el.style('font-size-adjust', font['adjust']);
				el.style('font-stretch', font['stretch']);
				el.style('letter-spacing', font['spacing']);
				el.style('line-height', font['height']);
			}
		});
	};
	
	// for comfortable use
	fn.innerWidth = function() {
		var arr = [];
		this.each(function() {
			var w = 0;
			var c = this[0].children;
			if(c) {
				for(var i=0; i < c.length; i++) {
					w += c[i].offsetWidth;
				}
			}

			arr.push(w);
		});
		return array_return(arr);
	};
	
	fn.innerHeight = function() {
		var arr = [];
		this.each(function() {
			var h = 0;
			var c = this[0].children;
			if(c) {
				for(var i=0; i < c.length; i++) {
					h += c[i].offsetHeight;
				}
			}

			arr.push(h);
		});
		return array_return(arr);
	};
	
	fn.width = function(width) {
		if( !arguments.length ) return type1.call(this, 'offsetWidth', arguments);		
		return this.style.call(this, 'width', width);
	};
	
	fn.height = function(height) {
		if( !arguments.length ) return type1.call(this, 'offsetHeight', arguments);		
		return this.style.call(this, 'height', height);
	};
	
	(function() {
		var type_prop = [
			'offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'scrollWidth', 'scrollHeight'
		];
		
		var type_style = [
			'border', 'color', 'margin', 'padding', 'min-width', 'max-width', 'min-height', 'max-height',
			'flex', 'float', 'opacity', 'z-index'
		];
		
		type_prop.forEach(function(name) {
			fn[name] = fn[name] || (function(name) {
				return function() {
					return type1.call(this, name, arguments);
				};
			})(name);
		});
		
		type_style.forEach(function(name) {
			var cname = camelcase(name);
			fn[cname] = fn[cname] || (function(name) {
				return function(value) {
					var args = [name];
					if( arguments.length ) args.push(value);
					return this.style.apply(this, args);
				};
			})(name);
		});
	})();	
})($);


(function($) {
	"use strict";
	
	var fn = $.fn;
	
	var array_return = $.util.array_return;
	var resolve = $.util.resolve;
	var data = $.util.data;
	var evalHtml = $.util.evalHtml;
	
	// event extention		
	if( eval('typeof(EventDispatcher) !== "undefined"') ) {
		fn.on = function(types, fn, capture) {
			if( typeof(types) !== 'string' ) return console.error('invalid event type', types);
			if( typeof(fn) !== 'function' ) return console.error('invalid fn', fn);
	
			capture = (capture===true) ? true : false;
			types = types.split(' ');
	
			return this.each(function() {
				var el = this;
		
				for(var i=0; i < types.length; i++) {
					var type = types[i];
			
					if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events			
						if( el.addEventListener ) {
							el.addEventListener(type, fn, capture);

							if( type.toLowerCase() == 'transitionend' ) {
								el.addEventListener('webkitTransitionEnd', fn, capture);
							}
						} else if( el.attachEvent ) {
							el.attachEvent('on' + type, fn);
						}
					} else {
						var dispatcher = data.call(this, 'dispatcher');
						if( !dispatcher ) {
							dispatcher = new EventDispatcher(this);
							data.call(this, 'dispatcher', dispatcher);
						}
				
						dispatcher.on(type, fn, capture);
					}
				}
			});
		};

		fn.off = function(types, fn, capture) {
			if( typeof(types) !== 'string' ) return console.error('invalid event type', types);
			if( typeof(fn) !== 'function' ) return console.error('invalid fn', fn);
	
			capture = (capture===true) ? true : false;
			types = types.split(' ');
	
			return this.each(function() {			
				var el = this;
		
				for(var i=0; i < types.length; i++) {
					var type = types[i];
			
					if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events
						if( el.removeEventListener ) {
							el.removeEventListener(type, fn, capture);

							if( type.toLowerCase() == 'transitionend' )
								el.removeEventListener('webkitTransitionEnd', fn, capture);
						} else if( el.attachEvent ) {
							el.detachEvent('on' + type, fn);
						}
					} else {
						var dispatcher = data.call(this, 'dispatcher');
						if( !dispatcher ) continue;
				
						dispatcher.un(type, fn, capture);
					}
				}
			});
		};

		fn.fire = function(types, values) {
			if( !types ) return console.error('invalid event type:', types);
	
			values = values || {};
			types = types.split(' ');
	
			return this.each(function() {
				var e, el = this;
		
				for(var i=0; i < types.length; i++) {
					var type = types[i];
			
					if(('on' + type) in el) {	// if dom events
						// eventName, bubbles, cancelable
						if( document.createEvent ) {
							e = document.createEvent('Event');
							e.initEvent(type, ((values.bubbles===true) ? true : false), ((values.cancelable===true) ? true : false));
						} else if( document.createEventObject ) {
							e = document.createEventObject();
						} else {
							return console.error('this browser does not supports manual dom event fires');
						}
		
						for(var k in values) {
							if( !values.hasOwnProperty(k) ) continue;
							var v = values[k];
							try {
								e[k] = v;
							} catch(err) {
								console.error('[WARN] illegal event value', e, k);
							}
						}
						e.values = values;
						e.src = this;

						if( el.dispatchEvent ) {
							el.dispatchEvent(e);
						} else {
							e.cancelBubble = ((values.bubbles===true) ? true : false);
							el.fireEvent('on' + type, e );
						}
					} else {
						var dispatcher = data.call(this, 'dispatcher');
						if( !dispatcher ) continue;
				
						e = dispatcher.fireSync(type, values);
					}
				}
			});
		};
		
		// MutationObserver setup for detect DOM node changes.
		// if browser doesn't support DOM3 MutationObeserver, use MutationObeserver shim (https://github.com/megawac/MutationObserver.js)
		$.ready(function() {
			var observer = new MutationObserver(function(mutations){
				mutations.forEach(function(mutation) {
					//if( debug('mutation') ) console.error(mutation.target, mutation.type, mutation);
			
					if( mutation.type === 'childList' ) {
						var target = mutation.target;
						var tel = $(target);
						var added = mutation.addedNodes;
						var removed = mutation.removedNodes;				
								
						if( removed ) {
							for(var i=0; i < removed.length; i++) {
								var source = $(removed[i]);
						
								tel.fire('removed', {
									removed: removed[i]
								});
						
								source.fire('detached', {
									from: target
								});
							}
						}
				
						if( added ) {
							for(var i=0; i < added.length; i++) {
								var source = $(added[i]);
							
								tel.fire('added', {
									added: added[i]
								});
						
								source.fire('attached', {
									to: target
								});
							}
						}
					}
				}); 
		    });

			observer.observe(document.body, {
				subtree: true,
			    childList: true,
			    attributes: true,
			    characterData: true
			});
		});
	}

	// animation
	if( eval('typeof(Animator) !== "undefined"') ) {
		fn.animate = function(options, callback) {
			return new Animator(this, options, this, this).run(callback).out();
		};

		fn.animator = function(options, scope) {
			return new Animator(this, options, scope || this, this);
		};
	}

	// template
	if( eval('typeof(Template) !== "undefined"') ) {
		fn.bind = function(data, functions) {
			this.restore('#bind').save('#bind');
			return this.each(function() {
				new Template(this).bind(data, functions);
			});
		};

		fn.tpl = function(data, functions) {
			if( !arguments.length ) {
				var arr = [];
				this.each(function() {
					arr.push(new Template($(this).clone()[0]));
				});
				return array_return(arr);
			} else if( data ) {
				var arr = [];
				this.each(function() {
					var d = data;
					if( typeof(d) === 'function' ) d = resolve.call(this, d);				
			
					if( typeof(d.length) !== 'number' ) d = [d];
			
					for(var i=0; i < d.length; i++) {
						var el = $(this).clone()[0];
						if( el.tagName.toLowerCase() === 'script' ) {
							el = evalHtml(el.textContent || el.innerHTML || el.innerText)[0];
						}					
				
						new Template(el).bind(d[i], functions);
						arr.push(el);
					}
				});
				return $(arr).owner(this);
			} else {
				return console.error('illegal data', data);
			}
		};
	}
})($);


	
	// exports inner classes
	if( eval('typeof(Animator) !== "undefined"') ) $.Animator = Animator;
	if( eval('typeof(CSS3Calibrator) !== "undefined"') ) $.CSS3Calibrator = CSS3Calibrator;
	if( eval('typeof(Device) !== "undefined"') ) $.device = Device;
	if( eval('typeof(Scroller) !== "undefined"') ) $.Scroller = Scroller;
	if( eval('typeof(StyleSession) !== "undefined"') ) $.StyleSession = StyleSession;
	if( eval('typeof(Template) !== "undefined"') ) $.Template = Template;
	if( eval('typeof(EventDispatcher) !== "undefined"') ) $.EventDispatcher = EventDispatcher;
	
	
	// check current is in commonjs context
	var CJS = false;
	try {
		eval('(module && exports && require)');
		CJS = true;
	} catch(e) {}
	
	
	// binding to global or regist module system. amd, cjs, traditional
	if( typeof(window.define) === 'function' && define.attrs ) {
		define('attrs.dom', function(module) {
			module.exports = $;
		});
	} else if( typeof(window.define) === 'function' && define.amd ) {
		define(function() {
			return $;
		});
	} else if( CJS ) {
		exports = $;
	} else {
		var original = window.$;
		window.$ = window.Alien = $;
	
		$.noConflict = function() {
			window.$ = original;
			return $;
		};
	}
})();

// End Of File (dom.alien.js), attrs ({https://github.com/attrs})


/*!
 * Less - Leaner CSS v1.7.3
 * http://lesscss.org
 *
 * Copyright (c) 2009-2014, Alexis Sellier <self@cloudhead.net>
 * Licensed under the Apache v2 License.
 *
 */

 /** * @license Apache v2
 */



(function (window, undefined) {//
// Stub out `require` in the browser
//
function require(arg) {
    return window.less[arg.split('/')[1]];
};


if (typeof(window.less) === 'undefined' || typeof(window.less.nodeType) !== 'undefined') { window.less = {}; }
less = window.less;
tree = window.less.tree = {};
less.mode = 'browser';

var less, tree;

// Node.js does not have a header file added which defines less
if (less === undefined) {
    less = exports;
    tree = require('./tree');
    less.mode = 'node';
}
//
// less.js - parser
//
//    A relatively straight-forward predictive parser.
//    There is no tokenization/lexing stage, the input is parsed
//    in one sweep.
//
//    To make the parser fast enough to run in the browser, several
//    optimization had to be made:
//
//    - Matching and slicing on a huge input is often cause of slowdowns.
//      The solution is to chunkify the input into smaller strings.
//      The chunks are stored in the `chunks` var,
//      `j` holds the current chunk index, and `currentPos` holds
//      the index of the current chunk in relation to `input`.
//      This gives us an almost 4x speed-up.
//
//    - In many cases, we don't need to match individual tokens;
//      for example, if a value doesn't hold any variables, operations
//      or dynamic references, the parser can effectively 'skip' it,
//      treating it as a literal.
//      An example would be '1px solid #000' - which evaluates to itself,
//      we don't need to know what the individual components are.
//      The drawback, of course is that you don't get the benefits of
//      syntax-checking on the CSS. This gives us a 50% speed-up in the parser,
//      and a smaller speed-up in the code-gen.
//
//
//    Token matching is done with the `$` function, which either takes
//    a terminal string or regexp, or a non-terminal function to call.
//    It also takes care of moving all the indices forwards.
//
//
less.Parser = function Parser(env) {
    var input,       // LeSS input string
        i,           // current index in `input`
        j,           // current chunk
        saveStack = [],   // holds state for backtracking
        furthest,    // furthest index the parser has gone to
        chunks,      // chunkified input
        current,     // current chunk
        currentPos,  // index of current chunk, in `input`
        parser,
        parsers,
        rootFilename = env && env.filename;

    // Top parser on an import tree must be sure there is one "env"
    // which will then be passed around by reference.
    if (!(env instanceof tree.parseEnv)) {
        env = new tree.parseEnv(env);
    }

    var imports = this.imports = {
        paths: env.paths || [],  // Search paths, when importing
        queue: [],               // Files which haven't been imported yet
        files: env.files,        // Holds the imported parse trees
        contents: env.contents,  // Holds the imported file contents
        contentsIgnoredChars: env.contentsIgnoredChars, // lines inserted, not in the original less
        mime:  env.mime,         // MIME type of .less files
        error: null,             // Error in parsing/evaluating an import
        push: function (path, currentFileInfo, importOptions, callback) {
            var parserImports = this;
            this.queue.push(path);

            var fileParsedFunc = function (e, root, fullPath) {
                parserImports.queue.splice(parserImports.queue.indexOf(path), 1); // Remove the path from the queue

                var importedPreviously = fullPath === rootFilename;

                parserImports.files[fullPath] = root;                        // Store the root

                if (e && !parserImports.error) { parserImports.error = e; }

                callback(e, root, importedPreviously, fullPath);
            };

            if (less.Parser.importer) {
                less.Parser.importer(path, currentFileInfo, fileParsedFunc, env);
            } else {
                less.Parser.fileLoader(path, currentFileInfo, function(e, contents, fullPath, newFileInfo) {
                    if (e) {fileParsedFunc(e); return;}

                    var newEnv = new tree.parseEnv(env);

                    newEnv.currentFileInfo = newFileInfo;
                    newEnv.processImports = false;
                    newEnv.contents[fullPath] = contents;

                    if (currentFileInfo.reference || importOptions.reference) {
                        newFileInfo.reference = true;
                    }

                    if (importOptions.inline) {
                        fileParsedFunc(null, contents, fullPath);
                    } else {
                        new(less.Parser)(newEnv).parse(contents, function (e, root) {
                            fileParsedFunc(e, root, fullPath);
                        });
                    }
                }, env);
            }
        }
    };

    function save()    { currentPos = i; saveStack.push( { current: current, i: i, j: j }); }
    function restore() { var state = saveStack.pop(); current = state.current; currentPos = i = state.i; j = state.j; }
    function forget() { saveStack.pop(); }

    function sync() {
        if (i > currentPos) {
            current = current.slice(i - currentPos);
            currentPos = i;
        }
    }
    function isWhitespace(str, pos) {
        var code = str.charCodeAt(pos | 0);
        return (code <= 32) && (code === 32 || code === 10 || code === 9);
    }
    //
    // Parse from a token, regexp or string, and move forward if match
    //
    function $(tok) {
        var tokType = typeof tok,
            match, length;

        // Either match a single character in the input,
        // or match a regexp in the current chunk (`current`).
        //
        if (tokType === "string") {
            if (input.charAt(i) !== tok) {
                return null;
            }
            skipWhitespace(1);
            return tok;
        }

        // regexp
        sync ();
        if (! (match = tok.exec(current))) {
            return null;
        }

        length = match[0].length;

        // The match is confirmed, add the match length to `i`,
        // and consume any extra white-space characters (' ' || '\n')
        // which come after that. The reason for this is that LeSS's
        // grammar is mostly white-space insensitive.
        //
        skipWhitespace(length);

        if(typeof(match) === 'string') {
            return match;
        } else {
            return match.length === 1 ? match[0] : match;
        }
    }

    // Specialization of $(tok)
    function $re(tok) {
        if (i > currentPos) {
            current = current.slice(i - currentPos);
            currentPos = i;
        }
        var m = tok.exec(current);
        if (!m) {
            return null;
        }

        skipWhitespace(m[0].length);
        if(typeof m === "string") {
            return m;
        }

        return m.length === 1 ? m[0] : m;
    }

    var _$re = $re;

    // Specialization of $(tok)
    function $char(tok) {
        if (input.charAt(i) !== tok) {
            return null;
        }
        skipWhitespace(1);
        return tok;
    }

    function skipWhitespace(length) {
        var oldi = i, oldj = j,
            curr = i - currentPos,
            endIndex = i + current.length - curr,
            mem = (i += length),
            inp = input,
            c;

        for (; i < endIndex; i++) {
            c = inp.charCodeAt(i);
            if (c > 32) {
                break;
            }

            if ((c !== 32) && (c !== 10) && (c !== 9) && (c !== 13)) {
                break;
            }
         }

        current = current.slice(length + i - mem + curr);
        currentPos = i;

        if (!current.length && (j < chunks.length - 1)) {
            current = chunks[++j];
            skipWhitespace(0); // skip space at the beginning of a chunk
            return true; // things changed
        }

        return oldi !== i || oldj !== j;
    }

    function expect(arg, msg) {
        // some older browsers return typeof 'function' for RegExp
        var result = (Object.prototype.toString.call(arg) === '[object Function]') ? arg.call(parsers) : $(arg);
        if (result) {
            return result;
        }
        error(msg || (typeof(arg) === 'string' ? "expected '" + arg + "' got '" + input.charAt(i) + "'"
                                               : "unexpected token"));
    }

    // Specialization of expect()
    function expectChar(arg, msg) {
        if (input.charAt(i) === arg) {
            skipWhitespace(1);
            return arg;
        }
        error(msg || "expected '" + arg + "' got '" + input.charAt(i) + "'");
    }

    function error(msg, type) {
        var e = new Error(msg);
        e.index = i;
        e.type = type || 'Syntax';
        throw e;
    }

    // Same as $(), but don't change the state of the parser,
    // just return the match.
    function peek(tok) {
        if (typeof(tok) === 'string') {
            return input.charAt(i) === tok;
        } else {
            return tok.test(current);
        }
    }

    // Specialization of peek()
    function peekChar(tok) {
        return input.charAt(i) === tok;
    }


    function getInput(e, env) {
        if (e.filename && env.currentFileInfo.filename && (e.filename !== env.currentFileInfo.filename)) {
            return parser.imports.contents[e.filename];
        } else {
            return input;
        }
    }

    function getLocation(index, inputStream) {
        var n = index + 1,
            line = null,
            column = -1;

        while (--n >= 0 && inputStream.charAt(n) !== '\n') {
            column++;
        }

        if (typeof index === 'number') {
            line = (inputStream.slice(0, index).match(/\n/g) || "").length;
        }

        return {
            line: line,
            column: column
        };
    }

    function getDebugInfo(index, inputStream, env) {
        var filename = env.currentFileInfo.filename;
        if(less.mode !== 'browser' && less.mode !== 'rhino') {
            filename = require('path').resolve(filename);
        }

        return {
            lineNumber: getLocation(index, inputStream).line + 1,
            fileName: filename
        };
    }

    function LessError(e, env) {
        var input = getInput(e, env),
            loc = getLocation(e.index, input),
            line = loc.line,
            col  = loc.column,
            callLine = e.call && getLocation(e.call, input).line,
            lines = input.split('\n');

        this.type = e.type || 'Syntax';
        this.message = e.message;
        this.filename = e.filename || env.currentFileInfo.filename;
        this.index = e.index;
        this.line = typeof(line) === 'number' ? line + 1 : null;
        this.callLine = callLine + 1;
        this.callExtract = lines[callLine];
        this.stack = e.stack;
        this.column = col;
        this.extract = [
            lines[line - 1],
            lines[line],
            lines[line + 1]
        ];
    }

    LessError.prototype = new Error();
    LessError.prototype.constructor = LessError;

    this.env = env = env || {};

    // The optimization level dictates the thoroughness of the parser,
    // the lower the number, the less nodes it will create in the tree.
    // This could matter for debugging, or if you want to access
    // the individual nodes in the tree.
    this.optimization = ('optimization' in this.env) ? this.env.optimization : 1;

    //
    // The Parser
    //
    parser = {

        imports: imports,
        //
        // Parse an input string into an abstract syntax tree,
        // @param str A string containing 'less' markup
        // @param callback call `callback` when done.
        // @param [additionalData] An optional map which can contains vars - a map (key, value) of variables to apply
        //
        parse: function (str, callback, additionalData) {
            var root, line, lines, error = null, globalVars, modifyVars, preText = "";

            i = j = currentPos = furthest = 0;

            globalVars = (additionalData && additionalData.globalVars) ? less.Parser.serializeVars(additionalData.globalVars) + '\n' : '';
            modifyVars = (additionalData && additionalData.modifyVars) ? '\n' + less.Parser.serializeVars(additionalData.modifyVars) : '';

            if (globalVars || (additionalData && additionalData.banner)) {
                preText = ((additionalData && additionalData.banner) ? additionalData.banner : "") + globalVars;
                parser.imports.contentsIgnoredChars[env.currentFileInfo.filename] = preText.length;
            }

            str = str.replace(/\r\n/g, '\n');
            // Remove potential UTF Byte Order Mark
            input = str = preText + str.replace(/^\uFEFF/, '') + modifyVars;
            parser.imports.contents[env.currentFileInfo.filename] = str;

            // Split the input into chunks.
            chunks = (function (input) {
                var len = input.length, level = 0, parenLevel = 0,
                    lastOpening, lastOpeningParen, lastMultiComment, lastMultiCommentEndBrace,
                    chunks = [], emitFrom = 0,
                    parserCurrentIndex, currentChunkStartIndex, cc, cc2, matched;

                function fail(msg, index) {
                    error = new(LessError)({
                        index: index || parserCurrentIndex,
                        type: 'Parse',
                        message: msg,
                        filename: env.currentFileInfo.filename
                    }, env);
                }

                function emitChunk(force) {
                    var len = parserCurrentIndex - emitFrom;
                    if (((len < 512) && !force) || !len) {
                        return;
                    }
                    chunks.push(input.slice(emitFrom, parserCurrentIndex + 1));
                    emitFrom = parserCurrentIndex + 1;
                }

                for (parserCurrentIndex = 0; parserCurrentIndex < len; parserCurrentIndex++) {
                    cc = input.charCodeAt(parserCurrentIndex);
                    if (((cc >= 97) && (cc <= 122)) || (cc < 34)) {
                        // a-z or whitespace
                        continue;
                    }

                    switch (cc) {
                        case 40:                        // (
                            parenLevel++;
                            lastOpeningParen = parserCurrentIndex;
                            continue;
                        case 41:                        // )
                            if (--parenLevel < 0) {
                                return fail("missing opening `(`");
                            }
                            continue;
                        case 59:                        // ;
                            if (!parenLevel) { emitChunk(); }
                            continue;
                        case 123:                       // {
                            level++;
                            lastOpening = parserCurrentIndex;
                            continue;
                        case 125:                       // }
                            if (--level < 0) {
                                return fail("missing opening `{`");
                            }
                            if (!level && !parenLevel) { emitChunk(); }
                            continue;
                        case 92:                        // \
                            if (parserCurrentIndex < len - 1) { parserCurrentIndex++; continue; }
                            return fail("unescaped `\\`");
                        case 34:
                        case 39:
                        case 96:                        // ", ' and `
                            matched = 0;
                            currentChunkStartIndex = parserCurrentIndex;
                            for (parserCurrentIndex = parserCurrentIndex + 1; parserCurrentIndex < len; parserCurrentIndex++) {
                                cc2 = input.charCodeAt(parserCurrentIndex);
                                if (cc2 > 96) { continue; }
                                if (cc2 == cc) { matched = 1; break; }
                                if (cc2 == 92) {        // \
                                    if (parserCurrentIndex == len - 1) {
                                        return fail("unescaped `\\`");
                                    }
                                    parserCurrentIndex++;
                                }
                            }
                            if (matched) { continue; }
                            return fail("unmatched `" + String.fromCharCode(cc) + "`", currentChunkStartIndex);
                        case 47:                        // /, check for comment
                            if (parenLevel || (parserCurrentIndex == len - 1)) { continue; }
                            cc2 = input.charCodeAt(parserCurrentIndex + 1);
                            if (cc2 == 47) {
                                // //, find lnfeed
                                for (parserCurrentIndex = parserCurrentIndex + 2; parserCurrentIndex < len; parserCurrentIndex++) {
                                    cc2 = input.charCodeAt(parserCurrentIndex);
                                    if ((cc2 <= 13) && ((cc2 == 10) || (cc2 == 13))) { break; }
                                }
                            } else if (cc2 == 42) {
                                // /*, find */
                                lastMultiComment = currentChunkStartIndex = parserCurrentIndex;
                                for (parserCurrentIndex = parserCurrentIndex + 2; parserCurrentIndex < len - 1; parserCurrentIndex++) {
                                    cc2 = input.charCodeAt(parserCurrentIndex);
                                    if (cc2 == 125) { lastMultiCommentEndBrace = parserCurrentIndex; }
                                    if (cc2 != 42) { continue; }
                                    if (input.charCodeAt(parserCurrentIndex + 1) == 47) { break; }
                                }
                                if (parserCurrentIndex == len - 1) {
                                    return fail("missing closing `*/`", currentChunkStartIndex);
                                }
                                parserCurrentIndex++;
                            }
                            continue;
                        case 42:                       // *, check for unmatched */
                            if ((parserCurrentIndex < len - 1) && (input.charCodeAt(parserCurrentIndex + 1) == 47)) {
                                return fail("unmatched `/*`");
                            }
                            continue;
                    }
                }

                if (level !== 0) {
                    if ((lastMultiComment > lastOpening) && (lastMultiCommentEndBrace > lastMultiComment)) {
                        return fail("missing closing `}` or `*/`", lastOpening);
                    } else {
                        return fail("missing closing `}`", lastOpening);
                    }
                } else if (parenLevel !== 0) {
                    return fail("missing closing `)`", lastOpeningParen);
                }

                emitChunk(true);
                return chunks;
            })(str);

            if (error) {
                return callback(new(LessError)(error, env));
            }

            current = chunks[0];

            // Start with the primary rule.
            // The whole syntax tree is held under a Ruleset node,
            // with the `root` property set to true, so no `{}` are
            // output. The callback is called when the input is parsed.
            try {
                root = new(tree.Ruleset)(null, this.parsers.primary());
                root.root = true;
                root.firstRoot = true;
            } catch (e) {
                return callback(new(LessError)(e, env));
            }

            root.toCSS = (function (evaluate) {
                return function (options, variables) {
                    options = options || {};
                    var evaldRoot,
                        css,
                        evalEnv = new tree.evalEnv(options);

                    //
                    // Allows setting variables with a hash, so:
                    //
                    //   `{ color: new(tree.Color)('#f01') }` will become:
                    //
                    //   new(tree.Rule)('@color',
                    //     new(tree.Value)([
                    //       new(tree.Expression)([
                    //         new(tree.Color)('#f01')
                    //       ])
                    //     ])
                    //   )
                    //
                    if (typeof(variables) === 'object' && !Array.isArray(variables)) {
                        variables = Object.keys(variables).map(function (k) {
                            var value = variables[k];

                            if (! (value instanceof tree.Value)) {
                                if (! (value instanceof tree.Expression)) {
                                    value = new(tree.Expression)([value]);
                                }
                                value = new(tree.Value)([value]);
                            }
                            return new(tree.Rule)('@' + k, value, false, null, 0);
                        });
                        evalEnv.frames = [new(tree.Ruleset)(null, variables)];
                    }

                    try {
                        var preEvalVisitors = [],
                            visitors = [
                                new(tree.joinSelectorVisitor)(),
                                new(tree.processExtendsVisitor)(),
                                new(tree.toCSSVisitor)({compress: Boolean(options.compress)})
                            ], i, root = this;

                        if (options.plugins) {
                            for(i =0; i < options.plugins.length; i++) {
                                if (options.plugins[i].isPreEvalVisitor) {
                                    preEvalVisitors.push(options.plugins[i]);
                                } else {
                                    if (options.plugins[i].isPreVisitor) {
                                        visitors.splice(0, 0, options.plugins[i]);
                                    } else {
                                        visitors.push(options.plugins[i]);
                                    }
                                }
                            }
                        }

                        for(i = 0; i < preEvalVisitors.length; i++) {
                            preEvalVisitors[i].run(root);
                        }

                        evaldRoot = evaluate.call(root, evalEnv);

                        for(i = 0; i < visitors.length; i++) {
                            visitors[i].run(evaldRoot);
                        }

                        if (options.sourceMap) {
                            evaldRoot = new tree.sourceMapOutput(
                                {
                                    contentsIgnoredCharsMap: parser.imports.contentsIgnoredChars,
                                    writeSourceMap: options.writeSourceMap,
                                    rootNode: evaldRoot,
                                    contentsMap: parser.imports.contents,
                                    sourceMapFilename: options.sourceMapFilename,
                                    sourceMapURL: options.sourceMapURL,
                                    outputFilename: options.sourceMapOutputFilename,
                                    sourceMapBasepath: options.sourceMapBasepath,
                                    sourceMapRootpath: options.sourceMapRootpath,
                                    outputSourceFiles: options.outputSourceFiles,
                                    sourceMapGenerator: options.sourceMapGenerator
                                });
                        }

                        css = evaldRoot.toCSS({
                                compress: Boolean(options.compress),
                                dumpLineNumbers: env.dumpLineNumbers,
                                strictUnits: Boolean(options.strictUnits),
                                numPrecision: 8});
                    } catch (e) {
                        throw new(LessError)(e, env);
                    }

                    if (options.cleancss && less.mode === 'node') {
                        var CleanCSS = require('clean-css'),
                            cleancssOptions = options.cleancssOptions || {};

                        if (cleancssOptions.keepSpecialComments === undefined) {
                            cleancssOptions.keepSpecialComments = "*";
                        }
                        cleancssOptions.processImport = false;
                        cleancssOptions.noRebase = true;
                        if (cleancssOptions.noAdvanced === undefined) {
                            cleancssOptions.noAdvanced = true;
                        }

                        return new CleanCSS(cleancssOptions).minify(css);
                    } else if (options.compress) {
                        return css.replace(/(^(\s)+)|((\s)+$)/g, "");
                    } else {
                        return css;
                    }
                };
            })(root.eval);

            // If `i` is smaller than the `input.length - 1`,
            // it means the parser wasn't able to parse the whole
            // string, so we've got a parsing error.
            //
            // We try to extract a \n delimited string,
            // showing the line where the parse error occured.
            // We split it up into two parts (the part which parsed,
            // and the part which didn't), so we can color them differently.
            if (i < input.length - 1) {
                i = furthest;
                var loc = getLocation(i, input);
                lines = input.split('\n');
                line = loc.line + 1;

                error = {
                    type: "Parse",
                    message: "Unrecognised input",
                    index: i,
                    filename: env.currentFileInfo.filename,
                    line: line,
                    column: loc.column,
                    extract: [
                        lines[line - 2],
                        lines[line - 1],
                        lines[line]
                    ]
                };
            }

            var finish = function (e) {
                e = error || e || parser.imports.error;

                if (e) {
                    if (!(e instanceof LessError)) {
                        e = new(LessError)(e, env);
                    }

                    return callback(e);
                }
                else {
                    return callback(null, root);
                }
            };

            if (env.processImports !== false) {
                new tree.importVisitor(this.imports, finish)
                    .run(root);
            } else {
                return finish();
            }
        },

        //
        // Here in, the parsing rules/functions
        //
        // The basic structure of the syntax tree generated is as follows:
        //
        //   Ruleset ->  Rule -> Value -> Expression -> Entity
        //
        // Here's some Less code:
        //
        //    .class {
        //      color: #fff;
        //      border: 1px solid #000;
        //      width: @w + 4px;
        //      > .child {...}
        //    }
        //
        // And here's what the parse tree might look like:
        //
        //     Ruleset (Selector '.class', [
        //         Rule ("color",  Value ([Expression [Color #fff]]))
        //         Rule ("border", Value ([Expression [Dimension 1px][Keyword "solid"][Color #000]]))
        //         Rule ("width",  Value ([Expression [Operation "+" [Variable "@w"][Dimension 4px]]]))
        //         Ruleset (Selector [Element '>', '.child'], [...])
        //     ])
        //
        //  In general, most rules will try to parse a token with the `$()` function, and if the return
        //  value is truly, will return a new node, of the relevant type. Sometimes, we need to check
        //  first, before parsing, that's when we use `peek()`.
        //
        parsers: parsers = {
            //
            // The `primary` rule is the *entry* and *exit* point of the parser.
            // The rules here can appear at any level of the parse tree.
            //
            // The recursive nature of the grammar is an interplay between the `block`
            // rule, which represents `{ ... }`, the `ruleset` rule, and this `primary` rule,
            // as represented by this simplified grammar:
            //
            //     primary  →  (ruleset | rule)+
            //     ruleset  →  selector+ block
            //     block    →  '{' primary '}'
            //
            // Only at one point is the primary rule not called from the
            // block rule: at the root level.
            //
            primary: function () {
                var mixin = this.mixin, $re = _$re, root = [], node;

                while (current)
                {
                    node = this.extendRule() || mixin.definition() || this.rule() || this.ruleset() ||
                        mixin.call() || this.comment() || this.rulesetCall() || this.directive();
                    if (node) {
                        root.push(node);
                    } else {
                        if (!($re(/^[\s\n]+/) || $re(/^;+/))) {
                            break;
                        }
                    }
                    if (peekChar('}')) {
                        break;
                    }
                }

                return root;
            },

            // We create a Comment node for CSS comments `/* */`,
            // but keep the LeSS comments `//` silent, by just skipping
            // over them.
            comment: function () {
                var comment;

                if (input.charAt(i) !== '/') { return; }

                if (input.charAt(i + 1) === '/') {
                    return new(tree.Comment)($re(/^\/\/.*/), true, i, env.currentFileInfo);
                }
                comment = $re(/^\/\*(?:[^*]|\*+[^\/*])*\*+\/\n?/);
                if (comment) {
                    return new(tree.Comment)(comment, false, i, env.currentFileInfo);
                }
            },

            comments: function () {
                var comment, comments = [];

                while(true) {
                    comment = this.comment();
                    if (!comment) {
                        break;
                    }
                    comments.push(comment);
                }

                return comments;
            },

            //
            // Entities are tokens which can be found inside an Expression
            //
            entities: {
                //
                // A string, which supports escaping " and '
                //
                //     "milky way" 'he\'s the one!'
                //
                quoted: function () {
                    var str, j = i, e, index = i;

                    if (input.charAt(j) === '~') { j++; e = true; } // Escaped strings
                    if (input.charAt(j) !== '"' && input.charAt(j) !== "'") { return; }

                    if (e) { $char('~'); }

                    str = $re(/^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/);
                    if (str) {
                        return new(tree.Quoted)(str[0], str[1] || str[2], e, index, env.currentFileInfo);
                    }
                },

                //
                // A catch-all word, such as:
                //
                //     black border-collapse
                //
                keyword: function () {
                    var k;

                    k = $re(/^%|^[_A-Za-z-][_A-Za-z0-9-]*/);
                    if (k) {
                        var color = tree.Color.fromKeyword(k);
                        if (color) {
                            return color;
                        }
                        return new(tree.Keyword)(k);
                    }
                },

                //
                // A function call
                //
                //     rgb(255, 0, 255)
                //
                // We also try to catch IE's `alpha()`, but let the `alpha` parser
                // deal with the details.
                //
                // The arguments are parsed with the `entities.arguments` parser.
                //
                call: function () {
                    var name, nameLC, args, alpha_ret, index = i;

                    name = /^([\w-]+|%|progid:[\w\.]+)\(/.exec(current);
                    if (!name) { return; }

                    name = name[1];
                    nameLC = name.toLowerCase();
                    if (nameLC === 'url') {
                        return null;
                    }

                    i += name.length;

                    if (nameLC === 'alpha') {
                        alpha_ret = parsers.alpha();
                        if(typeof alpha_ret !== 'undefined') {
                            return alpha_ret;
                        }
                    }

                    $char('('); // Parse the '(' and consume whitespace.

                    args = this.arguments();

                    if (! $char(')')) {
                        return;
                    }

                    if (name) { return new(tree.Call)(name, args, index, env.currentFileInfo); }
                },
                arguments: function () {
                    var args = [], arg;

                    while (true) {
                        arg = this.assignment() || parsers.expression();
                        if (!arg) {
                            break;
                        }
                        args.push(arg);
                        if (! $char(',')) {
                            break;
                        }
                    }
                    return args;
                },
                literal: function () {
                    return this.dimension() ||
                           this.color() ||
                           this.quoted() ||
                           this.unicodeDescriptor();
                },

                // Assignments are argument entities for calls.
                // They are present in ie filter properties as shown below.
                //
                //     filter: progid:DXImageTransform.Microsoft.Alpha( *opacity=50* )
                //

                assignment: function () {
                    var key, value;
                    key = $re(/^\w+(?=\s?=)/i);
                    if (!key) {
                        return;
                    }
                    if (!$char('=')) {
                        return;
                    }
                    value = parsers.entity();
                    if (value) {
                        return new(tree.Assignment)(key, value);
                    }
                },

                //
                // Parse url() tokens
                //
                // We use a specific rule for urls, because they don't really behave like
                // standard function calls. The difference is that the argument doesn't have
                // to be enclosed within a string, so it can't be parsed as an Expression.
                //
                url: function () {
                    var value;

                    if (input.charAt(i) !== 'u' || !$re(/^url\(/)) {
                        return;
                    }

                    value = this.quoted() || this.variable() ||
                            $re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/) || "";

                    expectChar(')');

                    return new(tree.URL)((value.value != null || value instanceof tree.Variable)
                                        ? value : new(tree.Anonymous)(value), env.currentFileInfo);
                },

                //
                // A Variable entity, such as `@fink`, in
                //
                //     width: @fink + 2px
                //
                // We use a different parser for variable definitions,
                // see `parsers.variable`.
                //
                variable: function () {
                    var name, index = i;

                    if (input.charAt(i) === '@' && (name = $re(/^@@?[\w-]+/))) {
                        return new(tree.Variable)(name, index, env.currentFileInfo);
                    }
                },

                // A variable entity useing the protective {} e.g. @{var}
                variableCurly: function () {
                    var curly, index = i;

                    if (input.charAt(i) === '@' && (curly = $re(/^@\{([\w-]+)\}/))) {
                        return new(tree.Variable)("@" + curly[1], index, env.currentFileInfo);
                    }
                },

                //
                // A Hexadecimal color
                //
                //     #4F3C2F
                //
                // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
                //
                color: function () {
                    var rgb;

                    if (input.charAt(i) === '#' && (rgb = $re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
                        var colorCandidateString = rgb.input.match(/^#([\w]+).*/); // strip colons, brackets, whitespaces and other characters that should not definitely be part of color string
                        colorCandidateString = colorCandidateString[1];
                        if (!colorCandidateString.match(/^[A-Fa-f0-9]+$/)) { // verify if candidate consists only of allowed HEX characters
                            error("Invalid HEX color code");
                        }
                        return new(tree.Color)(rgb[1]);
                    }
                },

                //
                // A Dimension, that is, a number and a unit
                //
                //     0.5em 95%
                //
                dimension: function () {
                    var value, c = input.charCodeAt(i);
                    //Is the first char of the dimension 0-9, '.', '+' or '-'
                    if ((c > 57 || c < 43) || c === 47 || c == 44) {
                        return;
                    }

                    value = $re(/^([+-]?\d*\.?\d+)(%|[a-z]+)?/);
                    if (value) {
                        return new(tree.Dimension)(value[1], value[2]);
                    }
                },

                //
                // A unicode descriptor, as is used in unicode-range
                //
                // U+0??  or U+00A1-00A9
                //
                unicodeDescriptor: function () {
                    var ud;

                    ud = $re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/);
                    if (ud) {
                        return new(tree.UnicodeDescriptor)(ud[0]);
                    }
                },

                //
                // JavaScript code to be evaluated
                //
                //     `window.location.href`
                //
                javascript: function () {
                    var str, j = i, e;

                    if (input.charAt(j) === '~') { j++; e = true; } // Escaped strings
                    if (input.charAt(j) !== '`') { return; }
                    if (env.javascriptEnabled !== undefined && !env.javascriptEnabled) {
                        error("You are using JavaScript, which has been disabled.");
                    }

                    if (e) { $char('~'); }

                    str = $re(/^`([^`]*)`/);
                    if (str) {
                        return new(tree.JavaScript)(str[1], i, e);
                    }
                }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink:
            //
            variable: function () {
                var name;

                if (input.charAt(i) === '@' && (name = $re(/^(@[\w-]+)\s*:/))) { return name[1]; }
            },

            //
            // The variable part of a variable definition. Used in the `rule` parser
            //
            //     @fink();
            //
            rulesetCall: function () {
                var name;

                if (input.charAt(i) === '@' && (name = $re(/^(@[\w-]+)\s*\(\s*\)\s*;/))) {
                    return new tree.RulesetCall(name[1]);
                }
            },

            //
            // extend syntax - used to extend selectors
            //
            extend: function(isRule) {
                var elements, e, index = i, option, extendList, extend;

                if (!(isRule ? $re(/^&:extend\(/) : $re(/^:extend\(/))) { return; }

                do {
                    option = null;
                    elements = null;
                    while (! (option = $re(/^(all)(?=\s*(\)|,))/))) {
                        e = this.element();
                        if (!e) { break; }
                        if (elements) { elements.push(e); } else { elements = [ e ]; }
                    }

                    option = option && option[1];

                    extend = new(tree.Extend)(new(tree.Selector)(elements), option, index);
                    if (extendList) { extendList.push(extend); } else { extendList = [ extend ]; }

                } while($char(","));

                expect(/^\)/);

                if (isRule) {
                    expect(/^;/);
                }

                return extendList;
            },

            //
            // extendRule - used in a rule to extend all the parent selectors
            //
            extendRule: function() {
                return this.extend(true);
            },

            //
            // Mixins
            //
            mixin: {
                //
                // A Mixin call, with an optional argument list
                //
                //     #mixins > .square(#fff);
                //     .rounded(4px, black);
                //     .button;
                //
                // The `while` loop is there because mixins can be
                // namespaced, but we only support the child and descendant
                // selector for now.
                //
                call: function () {
                    var s = input.charAt(i), important = false, index = i, elemIndex,
                        elements, elem, e, c, args;

                    if (s !== '.' && s !== '#') { return; }

                    save(); // stop us absorbing part of an invalid selector

                    while (true) {
                        elemIndex = i;
                        e = $re(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/);
                        if (!e) {
                            break;
                        }
                        elem = new(tree.Element)(c, e, elemIndex, env.currentFileInfo);
                        if (elements) { elements.push(elem); } else { elements = [ elem ]; }
                        c = $char('>');
                    }

                    if (elements) {
                        if ($char('(')) {
                            args = this.args(true).args;
                            expectChar(')');
                        }

                        if (parsers.important()) {
                            important = true;
                        }

                        if (parsers.end()) {
                            forget();
                            return new(tree.mixin.Call)(elements, args, index, env.currentFileInfo, important);
                        }
                    }

                    restore();
                },
                args: function (isCall) {
                    var parsers = parser.parsers, entities = parsers.entities,
                        returner = { args:null, variadic: false },
                        expressions = [], argsSemiColon = [], argsComma = [],
                        isSemiColonSeperated, expressionContainsNamed, name, nameLoop, value, arg;

                    save();

                    while (true) {
                        if (isCall) {
                            arg = parsers.detachedRuleset() || parsers.expression();
                        } else {
                            parsers.comments();
                            if (input.charAt(i) === '.' && $re(/^\.{3}/)) {
                                returner.variadic = true;
                                if ($char(";") && !isSemiColonSeperated) {
                                    isSemiColonSeperated = true;
                                }
                                (isSemiColonSeperated ? argsSemiColon : argsComma)
                                    .push({ variadic: true });
                                break;
                            }
                            arg = entities.variable() || entities.literal() || entities.keyword();
                        }

                        if (!arg) {
                            break;
                        }

                        nameLoop = null;
                        if (arg.throwAwayComments) {
                            arg.throwAwayComments();
                        }
                        value = arg;
                        var val = null;

                        if (isCall) {
                            // Variable
                            if (arg.value && arg.value.length == 1) {
                                val = arg.value[0];
                            }
                        } else {
                            val = arg;
                        }

                        if (val && val instanceof tree.Variable) {
                            if ($char(':')) {
                                if (expressions.length > 0) {
                                    if (isSemiColonSeperated) {
                                        error("Cannot mix ; and , as delimiter types");
                                    }
                                    expressionContainsNamed = true;
                                }

                                // we do not support setting a ruleset as a default variable - it doesn't make sense
                                // However if we do want to add it, there is nothing blocking it, just don't error
                                // and remove isCall dependency below
                                value = (isCall && parsers.detachedRuleset()) || parsers.expression();

                                if (!value) {
                                    if (isCall) {
                                        error("could not understand value for named argument");
                                    } else {
                                        restore();
                                        returner.args = [];
                                        return returner;
                                    }
                                }
                                nameLoop = (name = val.name);
                            } else if (!isCall && $re(/^\.{3}/)) {
                                returner.variadic = true;
                                if ($char(";") && !isSemiColonSeperated) {
                                    isSemiColonSeperated = true;
                                }
                                (isSemiColonSeperated ? argsSemiColon : argsComma)
                                    .push({ name: arg.name, variadic: true });
                                break;
                            } else if (!isCall) {
                                name = nameLoop = val.name;
                                value = null;
                            }
                        }

                        if (value) {
                            expressions.push(value);
                        }

                        argsComma.push({ name:nameLoop, value:value });

                        if ($char(',')) {
                            continue;
                        }

                        if ($char(';') || isSemiColonSeperated) {

                            if (expressionContainsNamed) {
                                error("Cannot mix ; and , as delimiter types");
                            }

                            isSemiColonSeperated = true;

                            if (expressions.length > 1) {
                                value = new(tree.Value)(expressions);
                            }
                            argsSemiColon.push({ name:name, value:value });

                            name = null;
                            expressions = [];
                            expressionContainsNamed = false;
                        }
                    }

                    forget();
                    returner.args = isSemiColonSeperated ? argsSemiColon : argsComma;
                    return returner;
                },
                //
                // A Mixin definition, with a list of parameters
                //
                //     .rounded (@radius: 2px, @color) {
                //        ...
                //     }
                //
                // Until we have a finer grained state-machine, we have to
                // do a look-ahead, to make sure we don't have a mixin call.
                // See the `rule` function for more information.
                //
                // We start by matching `.rounded (`, and then proceed on to
                // the argument list, which has optional default values.
                // We store the parameters in `params`, with a `value` key,
                // if there is a value, such as in the case of `@radius`.
                //
                // Once we've got our params list, and a closing `)`, we parse
                // the `{...}` block.
                //
                definition: function () {
                    var name, params = [], match, ruleset, cond, variadic = false;
                    if ((input.charAt(i) !== '.' && input.charAt(i) !== '#') ||
                        peek(/^[^{]*\}/)) {
                        return;
                    }

                    save();

                    match = $re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/);
                    if (match) {
                        name = match[1];

                        var argInfo = this.args(false);
                        params = argInfo.args;
                        variadic = argInfo.variadic;

                        // .mixincall("@{a}");
                        // looks a bit like a mixin definition..
                        // also
                        // .mixincall(@a: {rule: set;});
                        // so we have to be nice and restore
                        if (!$char(')')) {
                            furthest = i;
                            restore();
                            return;
                        }

                        parsers.comments();

                        if ($re(/^when/)) { // Guard
                            cond = expect(parsers.conditions, 'expected condition');
                        }

                        ruleset = parsers.block();

                        if (ruleset) {
                            forget();
                            return new(tree.mixin.Definition)(name, params, ruleset, cond, variadic);
                        } else {
                            restore();
                        }
                    } else {
                        forget();
                    }
                }
            },

            //
            // Entities are the smallest recognized token,
            // and can be found inside a rule's value.
            //
            entity: function () {
                var entities = this.entities;

                return entities.literal() || entities.variable() || entities.url() ||
                       entities.call()    || entities.keyword()  || entities.javascript() ||
                       this.comment();
            },

            //
            // A Rule terminator. Note that we use `peek()` to check for '}',
            // because the `block` rule will be expecting it, but we still need to make sure
            // it's there, if ';' was ommitted.
            //
            end: function () {
                return $char(';') || peekChar('}');
            },

            //
            // IE's alpha function
            //
            //     alpha(opacity=88)
            //
            alpha: function () {
                var value;

                if (! $re(/^\(opacity=/i)) { return; }
                value = $re(/^\d+/) || this.entities.variable();
                if (value) {
                    expectChar(')');
                    return new(tree.Alpha)(value);
                }
            },

            //
            // A Selector Element
            //
            //     div
            //     + h1
            //     #socks
            //     input[type="text"]
            //
            // Elements are the building blocks for Selectors,
            // they are made out of a `Combinator` (see combinator rule),
            // and an element name, such as a tag a class, or `*`.
            //
            element: function () {
                var e, c, v, index = i;

                c = this.combinator();

                e = $re(/^(?:\d+\.\d+|\d+)%/) || $re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/) ||
                    $char('*') || $char('&') || this.attribute() || $re(/^\([^()@]+\)/) || $re(/^[\.#](?=@)/) ||
                    this.entities.variableCurly();

                if (! e) {
                    save();
                    if ($char('(')) {
                        if ((v = this.selector()) && $char(')')) {
                            e = new(tree.Paren)(v);
                            forget();
                        } else {
                            restore();
                        }
                    } else {
                        forget();
                    }
                }

                if (e) { return new(tree.Element)(c, e, index, env.currentFileInfo); }
            },

            //
            // Combinators combine elements together, in a Selector.
            //
            // Because our parser isn't white-space sensitive, special care
            // has to be taken, when parsing the descendant combinator, ` `,
            // as it's an empty space. We have to check the previous character
            // in the input, to see if it's a ` ` character. More info on how
            // we deal with this in *combinator.js*.
            //
            combinator: function () {
                var c = input.charAt(i);

                if (c === '>' || c === '+' || c === '~' || c === '|' || c === '^') {
                    i++;
                    if (input.charAt(i) === '^') {
                        c = '^^';
                        i++;
                    }
                    while (isWhitespace(input, i)) { i++; }
                    return new(tree.Combinator)(c);
                } else if (isWhitespace(input, i - 1)) {
                    return new(tree.Combinator)(" ");
                } else {
                    return new(tree.Combinator)(null);
                }
            },
            //
            // A CSS selector (see selector below)
            // with less extensions e.g. the ability to extend and guard
            //
            lessSelector: function () {
                return this.selector(true);
            },
            //
            // A CSS Selector
            //
            //     .class > div + h1
            //     li a:hover
            //
            // Selectors are made out of one or more Elements, see above.
            //
            selector: function (isLess) {
                var index = i, $re = _$re, elements, extendList, c, e, extend, when, condition;

                while ((isLess && (extend = this.extend())) || (isLess && (when = $re(/^when/))) || (e = this.element())) {
                    if (when) {
                        condition = expect(this.conditions, 'expected condition');
                    } else if (condition) {
                        error("CSS guard can only be used at the end of selector");
                    } else if (extend) {
                        if (extendList) { extendList.push(extend); } else { extendList = [ extend ]; }
                    } else {
                        if (extendList) { error("Extend can only be used at the end of selector"); }
                        c = input.charAt(i);
                        if (elements) { elements.push(e); } else { elements = [ e ]; }
                        e = null;
                    }
                    if (c === '{' || c === '}' || c === ';' || c === ',' || c === ')') {
                        break;
                    }
                }

                if (elements) { return new(tree.Selector)(elements, extendList, condition, index, env.currentFileInfo); }
                if (extendList) { error("Extend must be used to extend a selector, it cannot be used on its own"); }
            },
            attribute: function () {
                if (! $char('[')) { return; }

                var entities = this.entities,
                    key, val, op;

                if (!(key = entities.variableCurly())) {
                    key = expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/);
                }

                op = $re(/^[|~*$^]?=/);
                if (op) {
                    val = entities.quoted() || $re(/^[0-9]+%/) || $re(/^[\w-]+/) || entities.variableCurly();
                }

                expectChar(']');

                return new(tree.Attribute)(key, op, val);
            },

            //
            // The `block` rule is used by `ruleset` and `mixin.definition`.
            // It's a wrapper around the `primary` rule, with added `{}`.
            //
            block: function () {
                var content;
                if ($char('{') && (content = this.primary()) && $char('}')) {
                    return content;
                }
            },

            blockRuleset: function() {
                var block = this.block();

                if (block) {
                    block = new tree.Ruleset(null, block);
                }
                return block;
            },

            detachedRuleset: function() {
                var blockRuleset = this.blockRuleset();
                if (blockRuleset) {
                    return new tree.DetachedRuleset(blockRuleset);
                }
            },

            //
            // div, .class, body > p {...}
            //
            ruleset: function () {
                var selectors, s, rules, debugInfo;

                save();

                if (env.dumpLineNumbers) {
                    debugInfo = getDebugInfo(i, input, env);
                }

                while (true) {
                    s = this.lessSelector();
                    if (!s) {
                        break;
                    }
                    if (selectors) { selectors.push(s); } else { selectors = [ s ]; }
                    this.comments();
                    if (s.condition && selectors.length > 1) {
                        error("Guards are only currently allowed on a single selector.");
                    }
                    if (! $char(',')) { break; }
                    if (s.condition) {
                        error("Guards are only currently allowed on a single selector.");
                    }
                    this.comments();
                }

                if (selectors && (rules = this.block())) {
                    forget();
                    var ruleset = new(tree.Ruleset)(selectors, rules, env.strictImports);
                    if (env.dumpLineNumbers) {
                        ruleset.debugInfo = debugInfo;
                    }
                    return ruleset;
                } else {
                    // Backtrack
                    furthest = i;
                    restore();
                }
            },
            rule: function (tryAnonymous) {
                var name, value, startOfRule = i, c = input.charAt(startOfRule), important, merge, isVariable;

                if (c === '.' || c === '#' || c === '&') { return; }

                save();

                name = this.variable() || this.ruleProperty();
                if (name) {
                    isVariable = typeof name === "string";

                    if (isVariable) {
                        value = this.detachedRuleset();
                    }

                    if (!value) {
                        // prefer to try to parse first if its a variable or we are compressing
                        // but always fallback on the other one
                        value = !tryAnonymous && (env.compress || isVariable) ?
                            (this.value() || this.anonymousValue()) :
                            (this.anonymousValue() || this.value());

                        important = this.important();

                        // a name returned by this.ruleProperty() is always an array of the form:
                        // [string-1, ..., string-n, ""] or [string-1, ..., string-n, "+"]
                        // where each item is a tree.Keyword or tree.Variable
                        merge = !isVariable && name.pop().value;
                    }

                    if (value && this.end()) {
                        forget();
                        return new (tree.Rule)(name, value, important, merge, startOfRule, env.currentFileInfo);
                    } else {
                        furthest = i;
                        restore();
                        if (value && !tryAnonymous) {
                            return this.rule(true);
                        }
                    }
                } else {
                    forget();
                }
            },
            anonymousValue: function () {
                var match;
                match = /^([^@+\/'"*`(;{}-]*);/.exec(current);
                if (match) {
                    i += match[0].length - 1;
                    return new(tree.Anonymous)(match[1]);
                }
            },

            //
            // An @import directive
            //
            //     @import "lib";
            //
            // Depending on our environemnt, importing is done differently:
            // In the browser, it's an XHR request, in Node, it would be a
            // file-system operation. The function used for importing is
            // stored in `import`, which we pass to the Import constructor.
            //
            "import": function () {
                var path, features, index = i;

                save();

                var dir = $re(/^@import?\s+/);

                var options = (dir ? this.importOptions() : null) || {};

                if (dir && (path = this.entities.quoted() || this.entities.url())) {
                    features = this.mediaFeatures();
                    if ($char(';')) {
                        forget();
                        features = features && new(tree.Value)(features);
                        return new(tree.Import)(path, features, options, index, env.currentFileInfo);
                    }
                }

                restore();
            },

            importOptions: function() {
                var o, options = {}, optionName, value;

                // list of options, surrounded by parens
                if (! $char('(')) { return null; }
                do {
                    o = this.importOption();
                    if (o) {
                        optionName = o;
                        value = true;
                        switch(optionName) {
                            case "css":
                                optionName = "less";
                                value = false;
                            break;
                            case "once":
                                optionName = "multiple";
                                value = false;
                            break;
                        }
                        options[optionName] = value;
                        if (! $char(',')) { break; }
                    }
                } while (o);
                expectChar(')');
                return options;
            },

            importOption: function() {
                var opt = $re(/^(less|css|multiple|once|inline|reference)/);
                if (opt) {
                    return opt[1];
                }
            },

            mediaFeature: function () {
                var entities = this.entities, nodes = [], e, p;
                do {
                    e = entities.keyword() || entities.variable();
                    if (e) {
                        nodes.push(e);
                    } else if ($char('(')) {
                        p = this.property();
                        e = this.value();
                        if ($char(')')) {
                            if (p && e) {
                                nodes.push(new(tree.Paren)(new(tree.Rule)(p, e, null, null, i, env.currentFileInfo, true)));
                            } else if (e) {
                                nodes.push(new(tree.Paren)(e));
                            } else {
                                return null;
                            }
                        } else { return null; }
                    }
                } while (e);

                if (nodes.length > 0) {
                    return new(tree.Expression)(nodes);
                }
            },

            mediaFeatures: function () {
                var entities = this.entities, features = [], e;
                do {
                    e = this.mediaFeature();
                    if (e) {
                        features.push(e);
                        if (! $char(',')) { break; }
                    } else {
                        e = entities.variable();
                        if (e) {
                            features.push(e);
                            if (! $char(',')) { break; }
                        }
                    }
                } while (e);

                return features.length > 0 ? features : null;
            },

            media: function () {
                var features, rules, media, debugInfo;

                if (env.dumpLineNumbers) {
                    debugInfo = getDebugInfo(i, input, env);
                }

                if ($re(/^@media/)) {
                    features = this.mediaFeatures();

                    rules = this.block();
                    if (rules) {
                        media = new(tree.Media)(rules, features, i, env.currentFileInfo);
                        if (env.dumpLineNumbers) {
                            media.debugInfo = debugInfo;
                        }
                        return media;
                    }
                }
            },

            //
            // A CSS Directive
            //
            //     @charset "utf-8";
            //
            directive: function () {
                var index = i, name, value, rules, nonVendorSpecificName,
                    hasIdentifier, hasExpression, hasUnknown, hasBlock = true;

                if (input.charAt(i) !== '@') { return; }

                value = this['import']() || this.media();
                if (value) {
                    return value;
                }

                save();

                name = $re(/^@[a-z-]+/);

                if (!name) { return; }

                nonVendorSpecificName = name;
                if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
                    nonVendorSpecificName = "@" + name.slice(name.indexOf('-', 2) + 1);
                }

                switch(nonVendorSpecificName) {
                    /*
                    case "@font-face":
                    case "@viewport":
                    case "@top-left":
                    case "@top-left-corner":
                    case "@top-center":
                    case "@top-right":
                    case "@top-right-corner":
                    case "@bottom-left":
                    case "@bottom-left-corner":
                    case "@bottom-center":
                    case "@bottom-right":
                    case "@bottom-right-corner":
                    case "@left-top":
                    case "@left-middle":
                    case "@left-bottom":
                    case "@right-top":
                    case "@right-middle":
                    case "@right-bottom":
                        hasBlock = true;
                        break;
                    */
                    case "@charset":
                        hasIdentifier = true;
                        hasBlock = false;
                        break;
                    case "@namespace":
                        hasExpression = true;
                        hasBlock = false;
                        break;
                    case "@keyframes":
                        hasIdentifier = true;
                        break;
                    case "@host":
                    case "@page":
                    case "@document":
                    case "@supports":
                        hasUnknown = true;
                        break;
                }

                if (hasIdentifier) {
                    value = this.entity();
                    if (!value) {
                        error("expected " + name + " identifier");
                    }
                } else if (hasExpression) {
                    value = this.expression();
                    if (!value) {
                        error("expected " + name + " expression");
                    }
                } else if (hasUnknown) {
                    value = ($re(/^[^{;]+/) || '').trim();
                    if (value) {
                        value = new(tree.Anonymous)(value);
                    }
                }

                if (hasBlock) {
                    rules = this.blockRuleset();
                }

                if (rules || (!hasBlock && value && $char(';'))) {
                    forget();
                    return new(tree.Directive)(name, value, rules, index, env.currentFileInfo,
                        env.dumpLineNumbers ? getDebugInfo(index, input, env) : null);
                }

                restore();
            },

            //
            // A Value is a comma-delimited list of Expressions
            //
            //     font-family: Baskerville, Georgia, serif;
            //
            // In a Rule, a Value represents everything after the `:`,
            // and before the `;`.
            //
            value: function () {
                var e, expressions = [];

                do {
                    e = this.expression();
                    if (e) {
                        expressions.push(e);
                        if (! $char(',')) { break; }
                    }
                } while(e);

                if (expressions.length > 0) {
                    return new(tree.Value)(expressions);
                }
            },
            important: function () {
                if (input.charAt(i) === '!') {
                    return $re(/^! *important/);
                }
            },
            sub: function () {
                var a, e;

                if ($char('(')) {
                    a = this.addition();
                    if (a) {
                        e = new(tree.Expression)([a]);
                        expectChar(')');
                        e.parens = true;
                        return e;
                    }
                }
            },
            multiplication: function () {
                var m, a, op, operation, isSpaced;
                m = this.operand();
                if (m) {
                    isSpaced = isWhitespace(input, i - 1);
                    while (true) {
                        if (peek(/^\/[*\/]/)) {
                            break;
                        }

                        save();

                        op = $char('/') || $char('*');

                        if (!op) { forget(); break; }

                        a = this.operand();

                        if (!a) { restore(); break; }
                        forget();

                        m.parensInOp = true;
                        a.parensInOp = true;
                        operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
                        isSpaced = isWhitespace(input, i - 1);
                    }
                    return operation || m;
                }
            },
            addition: function () {
                var m, a, op, operation, isSpaced;
                m = this.multiplication();
                if (m) {
                    isSpaced = isWhitespace(input, i - 1);
                    while (true) {
                        op = $re(/^[-+]\s+/) || (!isSpaced && ($char('+') || $char('-')));
                        if (!op) {
                            break;
                        }
                        a = this.multiplication();
                        if (!a) {
                            break;
                        }

                        m.parensInOp = true;
                        a.parensInOp = true;
                        operation = new(tree.Operation)(op, [operation || m, a], isSpaced);
                        isSpaced = isWhitespace(input, i - 1);
                    }
                    return operation || m;
                }
            },
            conditions: function () {
                var a, b, index = i, condition;

                a = this.condition();
                if (a) {
                    while (true) {
                        if (!peek(/^,\s*(not\s*)?\(/) || !$char(',')) {
                            break;
                        }
                        b = this.condition();
                        if (!b) {
                            break;
                        }
                        condition = new(tree.Condition)('or', condition || a, b, index);
                    }
                    return condition || a;
                }
            },
            condition: function () {
                var entities = this.entities, index = i, negate = false,
                    a, b, c, op;

                if ($re(/^not/)) { negate = true; }
                expectChar('(');
                a = this.addition() || entities.keyword() || entities.quoted();
                if (a) {
                    op = $re(/^(?:>=|<=|=<|[<=>])/);
                    if (op) {
                        b = this.addition() || entities.keyword() || entities.quoted();
                        if (b) {
                            c = new(tree.Condition)(op, a, b, index, negate);
                        } else {
                            error('expected expression');
                        }
                    } else {
                        c = new(tree.Condition)('=', a, new(tree.Keyword)('true'), index, negate);
                    }
                    expectChar(')');
                    return $re(/^and/) ? new(tree.Condition)('and', c, this.condition()) : c;
                }
            },

            //
            // An operand is anything that can be part of an operation,
            // such as a Color, or a Variable
            //
            operand: function () {
                var entities = this.entities,
                    p = input.charAt(i + 1), negate;

                if (input.charAt(i) === '-' && (p === '@' || p === '(')) { negate = $char('-'); }
                var o = this.sub() || entities.dimension() ||
                        entities.color() || entities.variable() ||
                        entities.call();

                if (negate) {
                    o.parensInOp = true;
                    o = new(tree.Negative)(o);
                }

                return o;
            },

            //
            // Expressions either represent mathematical operations,
            // or white-space delimited Entities.
            //
            //     1px solid black
            //     @var * 2
            //
            expression: function () {
                var entities = [], e, delim;

                do {
                    e = this.addition() || this.entity();
                    if (e) {
                        entities.push(e);
                        // operations do not allow keyword "/" dimension (e.g. small/20px) so we support that here
                        if (!peek(/^\/[\/*]/)) {
                            delim = $char('/');
                            if (delim) {
                                entities.push(new(tree.Anonymous)(delim));
                            }
                        }
                    }
                } while (e);
                if (entities.length > 0) {
                    return new(tree.Expression)(entities);
                }
            },
            property: function () {
                var name = $re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/);
                if (name) {
                    return name[1];
                }
            },
            ruleProperty: function () {
                var c = current, name = [], index = [], length = 0, s, k;

                function match(re) {
                    var a = re.exec(c);
                    if (a) {
                        index.push(i + length);
                        length += a[0].length;
                        c = c.slice(a[1].length);
                        return name.push(a[1]);
                    }
                }

                match(/^(\*?)/);
                while (match(/^((?:[\w-]+)|(?:@\{[\w-]+\}))/)); // !
                if ((name.length > 1) && match(/^\s*((?:\+_|\+)?)\s*:/)) {
                    // at last, we have the complete match now. move forward,
                    // convert name particles to tree objects and return:
                    skipWhitespace(length);
                    if (name[0] === '') {
                        name.shift();
                        index.shift();
                    }
                    for (k = 0; k < name.length; k++) {
                        s = name[k];
                        name[k] = (s.charAt(0) !== '@')
                            ? new(tree.Keyword)(s)
                            : new(tree.Variable)('@' + s.slice(2, -1),
                                index[k], env.currentFileInfo);
                    }
                    return name;
                }
            }
        }
    };
    return parser;
};
less.Parser.serializeVars = function(vars) {
    var s = '';

    for (var name in vars) {
        if (Object.hasOwnProperty.call(vars, name)) {
            var value = vars[name];
            s += ((name[0] === '@') ? '' : '@') + name +': '+ value +
                    ((('' + value).slice(-1) === ';') ? '' : ';');
        }
    }

    return s;
};

(function (tree) {

tree.functions = {
    rgb: function (r, g, b) {
        return this.rgba(r, g, b, 1.0);
    },
    rgba: function (r, g, b, a) {
        var rgb = [r, g, b].map(function (c) { return scaled(c, 255); });
        a = number(a);
        return new(tree.Color)(rgb, a);
    },
    hsl: function (h, s, l) {
        return this.hsla(h, s, l, 1.0);
    },
    hsla: function (h, s, l, a) {
        function hue(h) {
            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
            if      (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
            else if (h * 2 < 1) { return m2; }
            else if (h * 3 < 2) { return m1 + (m2 - m1) * (2/3 - h) * 6; }
            else                { return m1; }
        }

        h = (number(h) % 360) / 360;
        s = clamp(number(s)); l = clamp(number(l)); a = clamp(number(a));

        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;

        return this.rgba(hue(h + 1/3) * 255,
                         hue(h)       * 255,
                         hue(h - 1/3) * 255,
                         a);
    },

    hsv: function(h, s, v) {
        return this.hsva(h, s, v, 1.0);
    },

    hsva: function(h, s, v, a) {
        h = ((number(h) % 360) / 360) * 360;
        s = number(s); v = number(v); a = number(a);

        var i, f;
        i = Math.floor((h / 60) % 6);
        f = (h / 60) - i;

        var vs = [v,
                  v * (1 - s),
                  v * (1 - f * s),
                  v * (1 - (1 - f) * s)];
        var perm = [[0, 3, 1],
                    [2, 0, 1],
                    [1, 0, 3],
                    [1, 2, 0],
                    [3, 1, 0],
                    [0, 1, 2]];

        return this.rgba(vs[perm[i][0]] * 255,
                         vs[perm[i][1]] * 255,
                         vs[perm[i][2]] * 255,
                         a);
    },

    hue: function (color) {
        return new(tree.Dimension)(color.toHSL().h);
    },
    saturation: function (color) {
        return new(tree.Dimension)(color.toHSL().s * 100, '%');
    },
    lightness: function (color) {
        return new(tree.Dimension)(color.toHSL().l * 100, '%');
    },
    hsvhue: function(color) {
        return new(tree.Dimension)(color.toHSV().h);
    },
    hsvsaturation: function (color) {
        return new(tree.Dimension)(color.toHSV().s * 100, '%');
    },
    hsvvalue: function (color) {
        return new(tree.Dimension)(color.toHSV().v * 100, '%');
    },
    red: function (color) {
        return new(tree.Dimension)(color.rgb[0]);
    },
    green: function (color) {
        return new(tree.Dimension)(color.rgb[1]);
    },
    blue: function (color) {
        return new(tree.Dimension)(color.rgb[2]);
    },
    alpha: function (color) {
        return new(tree.Dimension)(color.toHSL().a);
    },
    luma: function (color) {
        return new(tree.Dimension)(color.luma() * color.alpha * 100, '%');
    },
    luminance: function (color) {
        var luminance =
            (0.2126 * color.rgb[0] / 255)
          + (0.7152 * color.rgb[1] / 255)
          + (0.0722 * color.rgb[2] / 255);

        return new(tree.Dimension)(luminance * color.alpha * 100, '%');
    },
    saturate: function (color, amount) {
        // filter: saturate(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        var hsl = color.toHSL();

        hsl.s += amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    desaturate: function (color, amount) {
        var hsl = color.toHSL();

        hsl.s -= amount.value / 100;
        hsl.s = clamp(hsl.s);
        return hsla(hsl);
    },
    lighten: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l += amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    darken: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l -= amount.value / 100;
        hsl.l = clamp(hsl.l);
        return hsla(hsl);
    },
    fadein: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a += amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    fadeout: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a -= amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    fade: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a = amount.value / 100;
        hsl.a = clamp(hsl.a);
        return hsla(hsl);
    },
    spin: function (color, amount) {
        var hsl = color.toHSL();
        var hue = (hsl.h + amount.value) % 360;

        hsl.h = hue < 0 ? 360 + hue : hue;

        return hsla(hsl);
    },
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        if (!weight) {
            weight = new(tree.Dimension)(50);
        }
        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var a = color1.toHSL().a - color2.toHSL().a;

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
                   color1.rgb[1] * w1 + color2.rgb[1] * w2,
                   color1.rgb[2] * w1 + color2.rgb[2] * w2];

        var alpha = color1.alpha * p + color2.alpha * (1 - p);

        return new(tree.Color)(rgb, alpha);
    },
    greyscale: function (color) {
        return this.desaturate(color, new(tree.Dimension)(100));
    },
    contrast: function (color, dark, light, threshold) {
        // filter: contrast(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            return null;
        }
        if (typeof light === 'undefined') {
            light = this.rgba(255, 255, 255, 1.0);
        }
        if (typeof dark === 'undefined') {
            dark = this.rgba(0, 0, 0, 1.0);
        }
        //Figure out which is actually light and dark!
        if (dark.luma() > light.luma()) {
            var t = light;
            light = dark;
            dark = t;
        }
        if (typeof threshold === 'undefined') {
            threshold = 0.43;
        } else {
            threshold = number(threshold);
        }
        if (color.luma() < threshold) {
            return light;
        } else {
            return dark;
        }
    },
    e: function (str) {
        return new(tree.Anonymous)(str instanceof tree.JavaScript ? str.evaluated : str.value);
    },
    escape: function (str) {
        return new(tree.Anonymous)(encodeURI(str.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"));
    },
    replace: function (string, pattern, replacement, flags) {
        var result = string.value;

        result = result.replace(new RegExp(pattern.value, flags ? flags.value : ''), replacement.value);
        return new(tree.Quoted)(string.quote || '', result, string.escaped);
    },
    '%': function (string /* arg, arg, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1),
            result = string.value;

        for (var i = 0; i < args.length; i++) {
            /*jshint loopfunc:true */
            result = result.replace(/%[sda]/i, function(token) {
                var value = token.match(/s/i) ? args[i].value : args[i].toCSS();
                return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
            });
        }
        result = result.replace(/%%/g, '%');
        return new(tree.Quoted)(string.quote || '', result, string.escaped);
    },
    unit: function (val, unit) {
        if(!(val instanceof tree.Dimension)) {
            throw { type: "Argument", message: "the first argument to unit must be a number" + (val instanceof tree.Operation ? ". Have you forgotten parenthesis?" : "") };
        }
        if (unit) {
            if (unit instanceof tree.Keyword) {
                unit = unit.value;
            } else {
                unit = unit.toCSS();
            }
        } else {
            unit = "";
        }
        return new(tree.Dimension)(val.value, unit);
    },
    convert: function (val, unit) {
        return val.convertTo(unit.value);
    },
    round: function (n, f) {
        var fraction = typeof(f) === "undefined" ? 0 : f.value;
        return _math(function(num) { return num.toFixed(fraction); }, null, n);
    },
    pi: function () {
        return new(tree.Dimension)(Math.PI);
    },
    mod: function(a, b) {
        return new(tree.Dimension)(a.value % b.value, a.unit);
    },
    pow: function(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            x = new(tree.Dimension)(x);
            y = new(tree.Dimension)(y);
        } else if (!(x instanceof tree.Dimension) || !(y instanceof tree.Dimension)) {
            throw { type: "Argument", message: "arguments must be numbers" };
        }

        return new(tree.Dimension)(Math.pow(x.value, y.value), x.unit);
    },
    _minmax: function (isMin, args) {
        args = Array.prototype.slice.call(args);
        switch(args.length) {
            case 0: throw { type: "Argument", message: "one or more arguments required" };
        }
        var i, j, current, currentUnified, referenceUnified, unit, unitStatic, unitClone,
            order  = [], // elems only contains original argument values.
            values = {}; // key is the unit.toString() for unified tree.Dimension values,
                         // value is the index into the order array.
        for (i = 0; i < args.length; i++) {
            current = args[i];
            if (!(current instanceof tree.Dimension)) {
                if(Array.isArray(args[i].value)) {
                    Array.prototype.push.apply(args, Array.prototype.slice.call(args[i].value));
                }
                continue;
            }
            currentUnified = current.unit.toString() === "" && unitClone !== undefined ? new(tree.Dimension)(current.value, unitClone).unify() : current.unify();
            unit = currentUnified.unit.toString() === "" && unitStatic !== undefined ? unitStatic : currentUnified.unit.toString();
            unitStatic = unit !== "" && unitStatic === undefined || unit !== "" && order[0].unify().unit.toString() === "" ? unit : unitStatic;
            unitClone = unit !== "" && unitClone === undefined ? current.unit.toString() : unitClone;
            j = values[""] !== undefined && unit !== "" && unit === unitStatic ? values[""] : values[unit];
            if (j === undefined) {
                if(unitStatic !== undefined && unit !== unitStatic) {
                    throw{ type: "Argument", message: "incompatible types" };
                }
                values[unit] = order.length;
                order.push(current);
                continue;
            }
            referenceUnified = order[j].unit.toString() === "" && unitClone !== undefined ? new(tree.Dimension)(order[j].value, unitClone).unify() : order[j].unify();
            if ( isMin && currentUnified.value < referenceUnified.value ||
                !isMin && currentUnified.value > referenceUnified.value) {
                order[j] = current;
            }
        }
        if (order.length == 1) {
            return order[0];
        }
        args = order.map(function (a) { return a.toCSS(this.env); }).join(this.env.compress ? "," : ", ");
        return new(tree.Anonymous)((isMin ? "min" : "max") + "(" + args + ")");
    },
    min: function () {
        return this._minmax(true, arguments);
    },
    max: function () {
        return this._minmax(false, arguments);
    },
    "get-unit": function (n) {
        return new(tree.Anonymous)(n.unit);
    },
    argb: function (color) {
        return new(tree.Anonymous)(color.toARGB());
    },
    percentage: function (n) {
        return new(tree.Dimension)(n.value * 100, '%');
    },
    color: function (n) {
        if (n instanceof tree.Quoted) {
            var colorCandidate = n.value,
                returnColor;
            returnColor = tree.Color.fromKeyword(colorCandidate);
            if (returnColor) {
                return returnColor;
            }
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/.test(colorCandidate)) {
                return new(tree.Color)(colorCandidate.slice(1));
            }
            throw { type: "Argument", message: "argument must be a color keyword or 3/6 digit hex e.g. #FFF" };
        } else {
            throw { type: "Argument", message: "argument must be a string" };
        }
    },
    iscolor: function (n) {
        return this._isa(n, tree.Color);
    },
    isnumber: function (n) {
        return this._isa(n, tree.Dimension);
    },
    isstring: function (n) {
        return this._isa(n, tree.Quoted);
    },
    iskeyword: function (n) {
        return this._isa(n, tree.Keyword);
    },
    isurl: function (n) {
        return this._isa(n, tree.URL);
    },
    ispixel: function (n) {
        return this.isunit(n, 'px');
    },
    ispercentage: function (n) {
        return this.isunit(n, '%');
    },
    isem: function (n) {
        return this.isunit(n, 'em');
    },
    isunit: function (n, unit) {
        return (n instanceof tree.Dimension) && n.unit.is(unit.value || unit) ? tree.True : tree.False;
    },
    _isa: function (n, Type) {
        return (n instanceof Type) ? tree.True : tree.False;
    },
    tint: function(color, amount) {
        return this.mix(this.rgb(255,255,255), color, amount);
    },
    shade: function(color, amount) {
        return this.mix(this.rgb(0, 0, 0), color, amount);
    },
    extract: function(values, index) {
        index = index.value - 1; // (1-based index)
        // handle non-array values as an array of length 1
        // return 'undefined' if index is invalid
        return Array.isArray(values.value)
            ? values.value[index] : Array(values)[index];
    },
    length: function(values) {
        var n = Array.isArray(values.value) ? values.value.length : 1;
        return new tree.Dimension(n);
    },

    "data-uri": function(mimetypeNode, filePathNode) {

        if (typeof window !== 'undefined') {
            return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
        }

        var mimetype = mimetypeNode.value;
        var filePath = (filePathNode && filePathNode.value);

        var fs = require('./fs'),
            path = require('path'),
            useBase64 = false;

        if (arguments.length < 2) {
            filePath = mimetype;
        }

        if (this.env.isPathRelative(filePath)) {
            if (this.currentFileInfo.relativeUrls) {
                filePath = path.join(this.currentFileInfo.currentDirectory, filePath);
            } else {
                filePath = path.join(this.currentFileInfo.entryPath, filePath);
            }
        }

        // detect the mimetype if not given
        if (arguments.length < 2) {
            var mime;
            try {
                mime = require('mime');
            } catch (ex) {
                mime = tree._mime;
            }

            mimetype = mime.lookup(filePath);

            // use base 64 unless it's an ASCII or UTF-8 format
            var charset = mime.charsets.lookup(mimetype);
            useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
            if (useBase64) { mimetype += ';base64'; }
        }
        else {
            useBase64 = /;base64$/.test(mimetype);
        }

        var buf = fs.readFileSync(filePath);

        // IE8 cannot handle a data-uri larger than 32KB. If this is exceeded
        // and the --ieCompat flag is enabled, return a normal url() instead.
        var DATA_URI_MAX_KB = 32,
            fileSizeInKB = parseInt((buf.length / 1024), 10);
        if (fileSizeInKB >= DATA_URI_MAX_KB) {

            if (this.env.ieCompat !== false) {
                if (!this.env.silent) {
                    console.warn("Skipped data-uri embedding of %s because its size (%dKB) exceeds IE8-safe %dKB!", filePath, fileSizeInKB, DATA_URI_MAX_KB);
                }

                return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
            }
        }

        buf = useBase64 ? buf.toString('base64')
                        : encodeURIComponent(buf);

        var uri = "\"data:" + mimetype + ',' + buf + "\"";
        return new(tree.URL)(new(tree.Anonymous)(uri));
    },

    "svg-gradient": function(direction) {

        function throwArgumentDescriptor() {
            throw { type: "Argument", message: "svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position]" };
        }

        if (arguments.length < 3) {
            throwArgumentDescriptor();
        }
        var stops = Array.prototype.slice.call(arguments, 1),
            gradientDirectionSvg,
            gradientType = "linear",
            rectangleDimension = 'x="0" y="0" width="1" height="1"',
            useBase64 = true,
            renderEnv = {compress: false},
            returner,
            directionValue = direction.toCSS(renderEnv),
            i, color, position, positionValue, alpha;

        switch (directionValue) {
            case "to bottom":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
                break;
            case "to right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
                break;
            case "to bottom right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
                break;
            case "to top right":
                gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
                break;
            case "ellipse":
            case "ellipse at center":
                gradientType = "radial";
                gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
                rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
                break;
            default:
                throw { type: "Argument", message: "svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'" };
        }
        returner = '<?xml version="1.0" ?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">' +
            '<' + gradientType + 'Gradient id="gradient" gradientUnits="userSpaceOnUse" ' + gradientDirectionSvg + '>';

        for (i = 0; i < stops.length; i+= 1) {
            if (stops[i].value) {
                color = stops[i].value[0];
                position = stops[i].value[1];
            } else {
                color = stops[i];
                position = undefined;
            }

            if (!(color instanceof tree.Color) || (!((i === 0 || i+1 === stops.length) && position === undefined) && !(position instanceof tree.Dimension))) {
                throwArgumentDescriptor();
            }
            positionValue = position ? position.toCSS(renderEnv) : i === 0 ? "0%" : "100%";
            alpha = color.alpha;
            returner += '<stop offset="' + positionValue + '" stop-color="' + color.toRGB() + '"' + (alpha < 1 ? ' stop-opacity="' + alpha + '"' : '') + '/>';
        }
        returner += '</' + gradientType + 'Gradient>' +
                    '<rect ' + rectangleDimension + ' fill="url(#gradient)" /></svg>';

        if (useBase64) {
            try {
                returner = require('./encoder').encodeBase64(returner); // TODO browser implementation
            } catch(e) {
                useBase64 = false;
            }
        }

        returner = "'data:image/svg+xml" + (useBase64 ? ";base64" : "") + "," + returner + "'";
        return new(tree.URL)(new(tree.Anonymous)(returner));
    }
};

// these static methods are used as a fallback when the optional 'mime' dependency is missing
tree._mime = {
    // this map is intentionally incomplete
    // if you want more, install 'mime' dep
    _types: {
        '.htm' : 'text/html',
        '.html': 'text/html',
        '.gif' : 'image/gif',
        '.jpg' : 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png' : 'image/png'
    },
    lookup: function (filepath) {
        var ext = require('path').extname(filepath),
            type = tree._mime._types[ext];
        if (type === undefined) {
            throw new Error('Optional dependency "mime" is required for ' + ext);
        }
        return type;
    },
    charsets: {
        lookup: function (type) {
            // assumes all text types are UTF-8
            return type && (/^text\//).test(type) ? 'UTF-8' : '';
        }
    }
};

// Math

var mathFunctions = {
 // name,  unit
    ceil:  null,
    floor: null,
    sqrt:  null,
    abs:   null,
    tan:   "",
    sin:   "",
    cos:   "",
    atan:  "rad",
    asin:  "rad",
    acos:  "rad"
};

function _math(fn, unit, n) {
    if (!(n instanceof tree.Dimension)) {
        throw { type: "Argument", message: "argument must be a number" };
    }
    if (unit == null) {
        unit = n.unit;
    } else {
        n = n.unify();
    }
    return new(tree.Dimension)(fn(parseFloat(n.value)), unit);
}

// ~ End of Math

// Color Blending
// ref: http://www.w3.org/TR/compositing-1

function colorBlend(mode, color1, color2) {
    var ab = color1.alpha, cb, // backdrop
        as = color2.alpha, cs, // source
        ar, cr, r = [];        // result

    ar = as + ab * (1 - as);
    for (var i = 0; i < 3; i++) {
        cb = color1.rgb[i] / 255;
        cs = color2.rgb[i] / 255;
        cr = mode(cb, cs);
        if (ar) {
            cr = (as * cs + ab * (cb
                - as * (cb + cs - cr))) / ar;
        }
        r[i] = cr * 255;
    }

    return new(tree.Color)(r, ar);
}

var colorBlendMode = {
    multiply: function(cb, cs) {
        return cb * cs;
    },
    screen: function(cb, cs) {
        return cb + cs - cb * cs;
    },
    overlay: function(cb, cs) {
        cb *= 2;
        return (cb <= 1)
            ? colorBlendMode.multiply(cb, cs)
            : colorBlendMode.screen(cb - 1, cs);
    },
    softlight: function(cb, cs) {
        var d = 1, e = cb;
        if (cs > 0.5) {
            e = 1;
            d = (cb > 0.25) ? Math.sqrt(cb)
                : ((16 * cb - 12) * cb + 4) * cb;
        }
        return cb - (1 - 2 * cs) * e * (d - cb);
    },
    hardlight: function(cb, cs) {
        return colorBlendMode.overlay(cs, cb);
    },
    difference: function(cb, cs) {
        return Math.abs(cb - cs);
    },
    exclusion: function(cb, cs) {
        return cb + cs - 2 * cb * cs;
    },

    // non-w3c functions:
    average: function(cb, cs) {
        return (cb + cs) / 2;
    },
    negation: function(cb, cs) {
        return 1 - Math.abs(cb + cs - 1);
    }
};

// ~ End of Color Blending

tree.defaultFunc = {
    eval: function () {
        var v = this.value_, e = this.error_;
        if (e) {
            throw e;
        }
        if (v != null) {
            return v ? tree.True : tree.False;
        }
    },
    value: function (v) {
        this.value_ = v;
    },
    error: function (e) {
        this.error_ = e;
    },
    reset: function () {
        this.value_ = this.error_ = null;
    }
};

function initFunctions() {
    var f, tf = tree.functions;

    // math
    for (f in mathFunctions) {
        if (mathFunctions.hasOwnProperty(f)) {
            tf[f] = _math.bind(null, Math[f], mathFunctions[f]);
        }
    }

    // color blending
    for (f in colorBlendMode) {
        if (colorBlendMode.hasOwnProperty(f)) {
            tf[f] = colorBlend.bind(null, colorBlendMode[f]);
        }
    }

    // default
    f = tree.defaultFunc;
    tf["default"] = f.eval.bind(f);

} initFunctions();

function hsla(color) {
    return tree.functions.hsla(color.h, color.s, color.l, color.a);
}

function scaled(n, size) {
    if (n instanceof tree.Dimension && n.unit.is('%')) {
        return parseFloat(n.value * size / 100);
    } else {
        return number(n);
    }
}

function number(n) {
    if (n instanceof tree.Dimension) {
        return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
    } else if (typeof(n) === 'number') {
        return n;
    } else {
        throw {
            error: "RuntimeError",
            message: "color functions take numbers as parameters"
        };
    }
}

function clamp(val) {
    return Math.min(1, Math.max(0, val));
}

tree.fround = function(env, value) {
    var p = env && env.numPrecision;
    //add "epsilon" to ensure numbers like 1.000000005 (represented as 1.000000004999....) are properly rounded...
    return (p == null) ? value : Number((value + 2e-16).toFixed(p));
};

tree.functionCall = function(env, currentFileInfo) {
    this.env = env;
    this.currentFileInfo = currentFileInfo;
};

tree.functionCall.prototype = tree.functions;

})(require('./tree'));

(function (tree) {
    tree.colors = {
        'aliceblue':'#f0f8ff',
        'antiquewhite':'#faebd7',
        'aqua':'#00ffff',
        'aquamarine':'#7fffd4',
        'azure':'#f0ffff',
        'beige':'#f5f5dc',
        'bisque':'#ffe4c4',
        'black':'#000000',
        'blanchedalmond':'#ffebcd',
        'blue':'#0000ff',
        'blueviolet':'#8a2be2',
        'brown':'#a52a2a',
        'burlywood':'#deb887',
        'cadetblue':'#5f9ea0',
        'chartreuse':'#7fff00',
        'chocolate':'#d2691e',
        'coral':'#ff7f50',
        'cornflowerblue':'#6495ed',
        'cornsilk':'#fff8dc',
        'crimson':'#dc143c',
        'cyan':'#00ffff',
        'darkblue':'#00008b',
        'darkcyan':'#008b8b',
        'darkgoldenrod':'#b8860b',
        'darkgray':'#a9a9a9',
        'darkgrey':'#a9a9a9',
        'darkgreen':'#006400',
        'darkkhaki':'#bdb76b',
        'darkmagenta':'#8b008b',
        'darkolivegreen':'#556b2f',
        'darkorange':'#ff8c00',
        'darkorchid':'#9932cc',
        'darkred':'#8b0000',
        'darksalmon':'#e9967a',
        'darkseagreen':'#8fbc8f',
        'darkslateblue':'#483d8b',
        'darkslategray':'#2f4f4f',
        'darkslategrey':'#2f4f4f',
        'darkturquoise':'#00ced1',
        'darkviolet':'#9400d3',
        'deeppink':'#ff1493',
        'deepskyblue':'#00bfff',
        'dimgray':'#696969',
        'dimgrey':'#696969',
        'dodgerblue':'#1e90ff',
        'firebrick':'#b22222',
        'floralwhite':'#fffaf0',
        'forestgreen':'#228b22',
        'fuchsia':'#ff00ff',
        'gainsboro':'#dcdcdc',
        'ghostwhite':'#f8f8ff',
        'gold':'#ffd700',
        'goldenrod':'#daa520',
        'gray':'#808080',
        'grey':'#808080',
        'green':'#008000',
        'greenyellow':'#adff2f',
        'honeydew':'#f0fff0',
        'hotpink':'#ff69b4',
        'indianred':'#cd5c5c',
        'indigo':'#4b0082',
        'ivory':'#fffff0',
        'khaki':'#f0e68c',
        'lavender':'#e6e6fa',
        'lavenderblush':'#fff0f5',
        'lawngreen':'#7cfc00',
        'lemonchiffon':'#fffacd',
        'lightblue':'#add8e6',
        'lightcoral':'#f08080',
        'lightcyan':'#e0ffff',
        'lightgoldenrodyellow':'#fafad2',
        'lightgray':'#d3d3d3',
        'lightgrey':'#d3d3d3',
        'lightgreen':'#90ee90',
        'lightpink':'#ffb6c1',
        'lightsalmon':'#ffa07a',
        'lightseagreen':'#20b2aa',
        'lightskyblue':'#87cefa',
        'lightslategray':'#778899',
        'lightslategrey':'#778899',
        'lightsteelblue':'#b0c4de',
        'lightyellow':'#ffffe0',
        'lime':'#00ff00',
        'limegreen':'#32cd32',
        'linen':'#faf0e6',
        'magenta':'#ff00ff',
        'maroon':'#800000',
        'mediumaquamarine':'#66cdaa',
        'mediumblue':'#0000cd',
        'mediumorchid':'#ba55d3',
        'mediumpurple':'#9370d8',
        'mediumseagreen':'#3cb371',
        'mediumslateblue':'#7b68ee',
        'mediumspringgreen':'#00fa9a',
        'mediumturquoise':'#48d1cc',
        'mediumvioletred':'#c71585',
        'midnightblue':'#191970',
        'mintcream':'#f5fffa',
        'mistyrose':'#ffe4e1',
        'moccasin':'#ffe4b5',
        'navajowhite':'#ffdead',
        'navy':'#000080',
        'oldlace':'#fdf5e6',
        'olive':'#808000',
        'olivedrab':'#6b8e23',
        'orange':'#ffa500',
        'orangered':'#ff4500',
        'orchid':'#da70d6',
        'palegoldenrod':'#eee8aa',
        'palegreen':'#98fb98',
        'paleturquoise':'#afeeee',
        'palevioletred':'#d87093',
        'papayawhip':'#ffefd5',
        'peachpuff':'#ffdab9',
        'peru':'#cd853f',
        'pink':'#ffc0cb',
        'plum':'#dda0dd',
        'powderblue':'#b0e0e6',
        'purple':'#800080',
        'red':'#ff0000',
        'rosybrown':'#bc8f8f',
        'royalblue':'#4169e1',
        'saddlebrown':'#8b4513',
        'salmon':'#fa8072',
        'sandybrown':'#f4a460',
        'seagreen':'#2e8b57',
        'seashell':'#fff5ee',
        'sienna':'#a0522d',
        'silver':'#c0c0c0',
        'skyblue':'#87ceeb',
        'slateblue':'#6a5acd',
        'slategray':'#708090',
        'slategrey':'#708090',
        'snow':'#fffafa',
        'springgreen':'#00ff7f',
        'steelblue':'#4682b4',
        'tan':'#d2b48c',
        'teal':'#008080',
        'thistle':'#d8bfd8',
        'tomato':'#ff6347',
        'turquoise':'#40e0d0',
        'violet':'#ee82ee',
        'wheat':'#f5deb3',
        'white':'#ffffff',
        'whitesmoke':'#f5f5f5',
        'yellow':'#ffff00',
        'yellowgreen':'#9acd32'
    };
})(require('./tree'));

(function (tree) {

tree.debugInfo = function(env, ctx, lineSeperator) {
    var result="";
    if (env.dumpLineNumbers && !env.compress) {
        switch(env.dumpLineNumbers) {
            case 'comments':
                result = tree.debugInfo.asComment(ctx);
                break;
            case 'mediaquery':
                result = tree.debugInfo.asMediaQuery(ctx);
                break;
            case 'all':
                result = tree.debugInfo.asComment(ctx) + (lineSeperator || "") + tree.debugInfo.asMediaQuery(ctx);
                break;
        }
    }
    return result;
};

tree.debugInfo.asComment = function(ctx) {
    return '/* line ' + ctx.debugInfo.lineNumber + ', ' + ctx.debugInfo.fileName + ' */\n';
};

tree.debugInfo.asMediaQuery = function(ctx) {
    return '@media -sass-debug-info{filename{font-family:' +
        ('file://' + ctx.debugInfo.fileName).replace(/([.:\/\\])/g, function (a) {
            if (a == '\\') {
                a = '\/';
            }
            return '\\' + a;
        }) +
        '}line{font-family:\\00003' + ctx.debugInfo.lineNumber + '}}\n';
};

tree.find = function (obj, fun) {
    for (var i = 0, r; i < obj.length; i++) {
        r = fun.call(obj, obj[i]);
        if (r) { return r; }
    }
    return null;
};

tree.jsify = function (obj) {
    if (Array.isArray(obj.value) && (obj.value.length > 1)) {
        return '[' + obj.value.map(function (v) { return v.toCSS(); }).join(', ') + ']';
    } else {
        return obj.toCSS();
    }
};

tree.toCSS = function (env) {
    var strs = [];
    this.genCSS(env, {
        add: function(chunk, fileInfo, index) {
            strs.push(chunk);
        },
        isEmpty: function () {
            return strs.length === 0;
        }
    });
    return strs.join('');
};

tree.outputRuleset = function (env, output, rules) {
    var ruleCnt = rules.length, i;
    env.tabLevel = (env.tabLevel | 0) + 1;

    // Compressed
    if (env.compress) {
        output.add('{');
        for (i = 0; i < ruleCnt; i++) {
            rules[i].genCSS(env, output);
        }
        output.add('}');
        env.tabLevel--;
        return;
    }

    // Non-compressed
    var tabSetStr = '\n' + Array(env.tabLevel).join("  "), tabRuleStr = tabSetStr + "  ";
    if (!ruleCnt) {
        output.add(" {" + tabSetStr + '}');
    } else {
        output.add(" {" + tabRuleStr);
        rules[0].genCSS(env, output);
        for (i = 1; i < ruleCnt; i++) {
            output.add(tabRuleStr);
            rules[i].genCSS(env, output);
        }
        output.add(tabSetStr + '}');
    }

    env.tabLevel--;
};

})(require('./tree'));

(function (tree) {

tree.Alpha = function (val) {
    this.value = val;
};
tree.Alpha.prototype = {
    type: "Alpha",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    eval: function (env) {
        if (this.value.eval) { return new tree.Alpha(this.value.eval(env)); }
        return this;
    },
    genCSS: function (env, output) {
        output.add("alpha(opacity=");

        if (this.value.genCSS) {
            this.value.genCSS(env, output);
        } else {
            output.add(this.value);
        }

        output.add(")");
    },
    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {

tree.Anonymous = function (value, index, currentFileInfo, mapLines) {
    this.value = value;
    this.index = index;
    this.mapLines = mapLines;
    this.currentFileInfo = currentFileInfo;
};
tree.Anonymous.prototype = {
    type: "Anonymous",
    eval: function () { 
        return new tree.Anonymous(this.value, this.index, this.currentFileInfo, this.mapLines);
    },
    compare: function (x) {
        if (!x.toCSS) {
            return -1;
        }
        
        var left = this.toCSS(),
            right = x.toCSS();
        
        if (left === right) {
            return 0;
        }
        
        return left < right ? -1 : 1;
    },
    genCSS: function (env, output) {
        output.add(this.value, this.currentFileInfo, this.index, this.mapLines);
    },
    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {

tree.Assignment = function (key, val) {
    this.key = key;
    this.value = val;
};
tree.Assignment.prototype = {
    type: "Assignment",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    eval: function (env) {
        if (this.value.eval) {
            return new(tree.Assignment)(this.key, this.value.eval(env));
        }
        return this;
    },
    genCSS: function (env, output) {
        output.add(this.key + '=');
        if (this.value.genCSS) {
            this.value.genCSS(env, output);
        } else {
            output.add(this.value);
        }
    },
    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {

//
// A function call node.
//
tree.Call = function (name, args, index, currentFileInfo) {
    this.name = name;
    this.args = args;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
tree.Call.prototype = {
    type: "Call",
    accept: function (visitor) {
        if (this.args) {
            this.args = visitor.visitArray(this.args);
        }
    },
    //
    // When evaluating a function call,
    // we either find the function in `tree.functions` [1],
    // in which case we call it, passing the  evaluated arguments,
    // if this returns null or we cannot find the function, we 
    // simply print it out as it appeared originally [2].
    //
    // The *functions.js* file contains the built-in functions.
    //
    // The reason why we evaluate the arguments, is in the case where
    // we try to pass a variable to a function, like: `saturate(@color)`.
    // The function should receive the value, not the variable.
    //
    eval: function (env) {
        var args = this.args.map(function (a) { return a.eval(env); }),
            nameLC = this.name.toLowerCase(),
            result, func;

        if (nameLC in tree.functions) { // 1.
            try {
                func = new tree.functionCall(env, this.currentFileInfo);
                result = func[nameLC].apply(func, args);
                if (result != null) {
                    return result;
                }
            } catch (e) {
                throw { type: e.type || "Runtime",
                        message: "error evaluating function `" + this.name + "`" +
                                 (e.message ? ': ' + e.message : ''),
                        index: this.index, filename: this.currentFileInfo.filename };
            }
        }

        return new tree.Call(this.name, args, this.index, this.currentFileInfo);
    },

    genCSS: function (env, output) {
        output.add(this.name + "(", this.currentFileInfo, this.index);

        for(var i = 0; i < this.args.length; i++) {
            this.args[i].genCSS(env, output);
            if (i + 1 < this.args.length) {
                output.add(", ");
            }
        }

        output.add(")");
    },

    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {
//
// RGB Colors - #ff0014, #eee
//
tree.Color = function (rgb, a) {
    //
    // The end goal here, is to parse the arguments
    // into an integer triplet, such as `128, 255, 0`
    //
    // This facilitates operations and conversions.
    //
    if (Array.isArray(rgb)) {
        this.rgb = rgb;
    } else if (rgb.length == 6) {
        this.rgb = rgb.match(/.{2}/g).map(function (c) {
            return parseInt(c, 16);
        });
    } else {
        this.rgb = rgb.split('').map(function (c) {
            return parseInt(c + c, 16);
        });
    }
    this.alpha = typeof(a) === 'number' ? a : 1;
};

var transparentKeyword = "transparent";

tree.Color.prototype = {
    type: "Color",
    eval: function () { return this; },
    luma: function () {
        var r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255;

        r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },

    genCSS: function (env, output) {
        output.add(this.toCSS(env));
    },
    toCSS: function (env, doNotCompress) {
        var compress = env && env.compress && !doNotCompress,
            alpha = tree.fround(env, this.alpha);

        // If we have some transparency, the only way to represent it
        // is via `rgba`. Otherwise, we use the hex representation,
        // which has better compatibility with older browsers.
        // Values are capped between `0` and `255`, rounded and zero-padded.
        if (alpha < 1) {
            if (alpha === 0 && this.isTransparentKeyword) {
                return transparentKeyword;
            }
            return "rgba(" + this.rgb.map(function (c) {
                return clamp(Math.round(c), 255);
            }).concat(clamp(alpha, 1))
                .join(',' + (compress ? '' : ' ')) + ")";
        } else {
            var color = this.toRGB();

            if (compress) {
                var splitcolor = color.split('');

                // Convert color to short format
                if (splitcolor[1] === splitcolor[2] && splitcolor[3] === splitcolor[4] && splitcolor[5] === splitcolor[6]) {
                    color = '#' + splitcolor[1] + splitcolor[3] + splitcolor[5];
                }
            }

            return color;
        }
    },

    //
    // Operations have to be done per-channel, if not,
    // channels will spill onto each other. Once we have
    // our result, in the form of an integer triplet,
    // we create a new Color node to hold the result.
    //
    operate: function (env, op, other) {
        var rgb = [];
        var alpha = this.alpha * (1 - other.alpha) + other.alpha;
        for (var c = 0; c < 3; c++) {
            rgb[c] = tree.operate(env, op, this.rgb[c], other.rgb[c]);
        }
        return new(tree.Color)(rgb, alpha);
    },

    toRGB: function () {
        return toHex(this.rgb);
    },

    toHSL: function () {
        var r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255,
            a = this.alpha;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2, d = max - min;

        if (max === min) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2;               break;
                case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, l: l, a: a };
    },
    //Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    toHSV: function () {
        var r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255,
            a = this.alpha;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        if (max === 0) {
            s = 0;
        } else {
            s = d / max;
        }

        if (max === min) {
            h = 0;
        } else {
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, v: v, a: a };
    },
    toARGB: function () {
        return toHex([this.alpha * 255].concat(this.rgb));
    },
    compare: function (x) {
        if (!x.rgb) {
            return -1;
        }
        
        return (x.rgb[0] === this.rgb[0] &&
            x.rgb[1] === this.rgb[1] &&
            x.rgb[2] === this.rgb[2] &&
            x.alpha === this.alpha) ? 0 : -1;
    }
};

tree.Color.fromKeyword = function(keyword) {
    keyword = keyword.toLowerCase();

    if (tree.colors.hasOwnProperty(keyword)) {
        // detect named color
        return new(tree.Color)(tree.colors[keyword].slice(1));
    }
    if (keyword === transparentKeyword) {
        var transparent = new(tree.Color)([0, 0, 0], 0);
        transparent.isTransparentKeyword = true;
        return transparent;
    }
};

function toHex(v) {
    return '#' + v.map(function (c) {
        c = clamp(Math.round(c), 255);
        return (c < 16 ? '0' : '') + c.toString(16);
    }).join('');
}

function clamp(v, max) {
    return Math.min(Math.max(v, 0), max); 
}

})(require('../tree'));

(function (tree) {

tree.Comment = function (value, silent, index, currentFileInfo) {
    this.value = value;
    this.silent = !!silent;
    this.currentFileInfo = currentFileInfo;
};
tree.Comment.prototype = {
    type: "Comment",
    genCSS: function (env, output) {
        if (this.debugInfo) {
            output.add(tree.debugInfo(env, this), this.currentFileInfo, this.index);
        }
        output.add(this.value.trim()); //TODO shouldn't need to trim, we shouldn't grab the \n
    },
    toCSS: tree.toCSS,
    isSilent: function(env) {
        var isReference = (this.currentFileInfo && this.currentFileInfo.reference && !this.isReferenced),
            isCompressed = env.compress && !this.value.match(/^\/\*!/);
        return this.silent || isReference || isCompressed;
    },
    eval: function () { return this; },
    markReferenced: function () {
        this.isReferenced = true;
    }
};

})(require('../tree'));

(function (tree) {

tree.Condition = function (op, l, r, i, negate) {
    this.op = op.trim();
    this.lvalue = l;
    this.rvalue = r;
    this.index = i;
    this.negate = negate;
};
tree.Condition.prototype = {
    type: "Condition",
    accept: function (visitor) {
        this.lvalue = visitor.visit(this.lvalue);
        this.rvalue = visitor.visit(this.rvalue);
    },
    eval: function (env) {
        var a = this.lvalue.eval(env),
            b = this.rvalue.eval(env);

        var i = this.index, result;

        result = (function (op) {
            switch (op) {
                case 'and':
                    return a && b;
                case 'or':
                    return a || b;
                default:
                    if (a.compare) {
                        result = a.compare(b);
                    } else if (b.compare) {
                        result = b.compare(a);
                    } else {
                        throw { type: "Type",
                                message: "Unable to perform comparison",
                                index: i };
                    }
                    switch (result) {
                        case -1: return op === '<' || op === '=<' || op === '<=';
                        case  0: return op === '=' || op === '>=' || op === '=<' || op === '<=';
                        case  1: return op === '>' || op === '>=';
                    }
            }
        })(this.op);
        return this.negate ? !result : result;
    }
};

})(require('../tree'));

(function (tree) {

tree.DetachedRuleset = function (ruleset, frames) {
    this.ruleset = ruleset;
    this.frames = frames;
};
tree.DetachedRuleset.prototype = {
    type: "DetachedRuleset",
    accept: function (visitor) {
        this.ruleset = visitor.visit(this.ruleset);
    },
    eval: function (env) {
        var frames = this.frames || env.frames.slice(0);
        return new tree.DetachedRuleset(this.ruleset, frames);
    },
    callEval: function (env) {
        return this.ruleset.eval(this.frames ? new(tree.evalEnv)(env, this.frames.concat(env.frames)) : env);
    }
};
})(require('../tree'));

(function (tree) {

//
// A number with a unit
//
tree.Dimension = function (value, unit) {
    this.value = parseFloat(value);
    this.unit = (unit && unit instanceof tree.Unit) ? unit :
      new(tree.Unit)(unit ? [unit] : undefined);
};

tree.Dimension.prototype = {
    type: "Dimension",
    accept: function (visitor) {
        this.unit = visitor.visit(this.unit);
    },
    eval: function (env) {
        return this;
    },
    toColor: function () {
        return new(tree.Color)([this.value, this.value, this.value]);
    },
    genCSS: function (env, output) {
        if ((env && env.strictUnits) && !this.unit.isSingular()) {
            throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: "+this.unit.toString());
        }

        var value = tree.fround(env, this.value),
            strValue = String(value);

        if (value !== 0 && value < 0.000001 && value > -0.000001) {
            // would be output 1e-6 etc.
            strValue = value.toFixed(20).replace(/0+$/, "");
        }

        if (env && env.compress) {
            // Zero values doesn't need a unit
            if (value === 0 && this.unit.isLength()) {
                output.add(strValue);
                return;
            }

            // Float values doesn't need a leading zero
            if (value > 0 && value < 1) {
                strValue = (strValue).substr(1);
            }
        }

        output.add(strValue);
        this.unit.genCSS(env, output);
    },
    toCSS: tree.toCSS,

    // In an operation between two Dimensions,
    // we default to the first Dimension's unit,
    // so `1px + 2` will yield `3px`.
    operate: function (env, op, other) {
        /*jshint noempty:false */
        var value = tree.operate(env, op, this.value, other.value),
            unit = this.unit.clone();

        if (op === '+' || op === '-') {
            if (unit.numerator.length === 0 && unit.denominator.length === 0) {
                unit.numerator = other.unit.numerator.slice(0);
                unit.denominator = other.unit.denominator.slice(0);
            } else if (other.unit.numerator.length === 0 && unit.denominator.length === 0) {
                // do nothing
            } else {
                other = other.convertTo(this.unit.usedUnits());

                if(env.strictUnits && other.unit.toString() !== unit.toString()) {
                  throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '" + unit.toString() +
                    "' and '" + other.unit.toString() + "'.");
                }

                value = tree.operate(env, op, this.value, other.value);
            }
        } else if (op === '*') {
            unit.numerator = unit.numerator.concat(other.unit.numerator).sort();
            unit.denominator = unit.denominator.concat(other.unit.denominator).sort();
            unit.cancel();
        } else if (op === '/') {
            unit.numerator = unit.numerator.concat(other.unit.denominator).sort();
            unit.denominator = unit.denominator.concat(other.unit.numerator).sort();
            unit.cancel();
        }
        return new(tree.Dimension)(value, unit);
    },

    compare: function (other) {
        if (other instanceof tree.Dimension) {
            var a, b,
                aValue, bValue;
            
            if (this.unit.isEmpty() || other.unit.isEmpty()) {
                a = this;
                b = other;
            } else {
                a = this.unify();
                b = other.unify();
                if (a.unit.compare(b.unit) !== 0) {
                    return -1;
                }                
            }
            aValue = a.value;
            bValue = b.value;

            if (bValue > aValue) {
                return -1;
            } else if (bValue < aValue) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    },

    unify: function () {
        return this.convertTo({ length: 'px', duration: 's', angle: 'rad' });
    },

    convertTo: function (conversions) {
        var value = this.value, unit = this.unit.clone(),
            i, groupName, group, targetUnit, derivedConversions = {}, applyUnit;

        if (typeof conversions === 'string') {
            for(i in tree.UnitConversions) {
                if (tree.UnitConversions[i].hasOwnProperty(conversions)) {
                    derivedConversions = {};
                    derivedConversions[i] = conversions;
                }
            }
            conversions = derivedConversions;
        }
        applyUnit = function (atomicUnit, denominator) {
          /*jshint loopfunc:true */
            if (group.hasOwnProperty(atomicUnit)) {
                if (denominator) {
                    value = value / (group[atomicUnit] / group[targetUnit]);
                } else {
                    value = value * (group[atomicUnit] / group[targetUnit]);
                }

                return targetUnit;
            }

            return atomicUnit;
        };

        for (groupName in conversions) {
            if (conversions.hasOwnProperty(groupName)) {
                targetUnit = conversions[groupName];
                group = tree.UnitConversions[groupName];

                unit.map(applyUnit);
            }
        }

        unit.cancel();

        return new(tree.Dimension)(value, unit);
    }
};

// http://www.w3.org/TR/css3-values/#absolute-lengths
tree.UnitConversions = {
    length: {
         'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'px': 0.0254 / 96,
        'pt': 0.0254 / 72,
        'pc': 0.0254 / 72 * 12
    },
    duration: {
        's': 1,
        'ms': 0.001
    },
    angle: {
        'rad': 1/(2*Math.PI),
        'deg': 1/360,
        'grad': 1/400,
        'turn': 1
    }
};

tree.Unit = function (numerator, denominator, backupUnit) {
    this.numerator = numerator ? numerator.slice(0).sort() : [];
    this.denominator = denominator ? denominator.slice(0).sort() : [];
    this.backupUnit = backupUnit;
};

tree.Unit.prototype = {
    type: "Unit",
    clone: function () {
        return new tree.Unit(this.numerator.slice(0), this.denominator.slice(0), this.backupUnit);
    },
    genCSS: function (env, output) {
        if (this.numerator.length >= 1) {
            output.add(this.numerator[0]);
        } else
        if (this.denominator.length >= 1) {
            output.add(this.denominator[0]);
        } else
        if ((!env || !env.strictUnits) && this.backupUnit) {
            output.add(this.backupUnit);
        }
    },
    toCSS: tree.toCSS,

    toString: function () {
      var i, returnStr = this.numerator.join("*");
      for (i = 0; i < this.denominator.length; i++) {
          returnStr += "/" + this.denominator[i];
      }
      return returnStr;
    },

    compare: function (other) {
        return this.is(other.toString()) ? 0 : -1;
    },

    is: function (unitString) {
        return this.toString() === unitString;
    },

    isLength: function () {
        return Boolean(this.toCSS().match(/px|em|%|in|cm|mm|pc|pt|ex/));
    },

    isEmpty: function () {
        return this.numerator.length === 0 && this.denominator.length === 0;
    },

    isSingular: function() {
        return this.numerator.length <= 1 && this.denominator.length === 0;
    },

    map: function(callback) {
        var i;

        for (i = 0; i < this.numerator.length; i++) {
            this.numerator[i] = callback(this.numerator[i], false);
        }

        for (i = 0; i < this.denominator.length; i++) {
            this.denominator[i] = callback(this.denominator[i], true);
        }
    },

    usedUnits: function() {
        var group, result = {}, mapUnit;

        mapUnit = function (atomicUnit) {
        /*jshint loopfunc:true */
            if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
                result[groupName] = atomicUnit;
            }

            return atomicUnit;
        };

        for (var groupName in tree.UnitConversions) {
            if (tree.UnitConversions.hasOwnProperty(groupName)) {
                group = tree.UnitConversions[groupName];

                this.map(mapUnit);
            }
        }

        return result;
    },

    cancel: function () {
        var counter = {}, atomicUnit, i, backup;

        for (i = 0; i < this.numerator.length; i++) {
            atomicUnit = this.numerator[i];
            if (!backup) {
                backup = atomicUnit;
            }
            counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
        }

        for (i = 0; i < this.denominator.length; i++) {
            atomicUnit = this.denominator[i];
            if (!backup) {
                backup = atomicUnit;
            }
            counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
        }

        this.numerator = [];
        this.denominator = [];

        for (atomicUnit in counter) {
            if (counter.hasOwnProperty(atomicUnit)) {
                var count = counter[atomicUnit];

                if (count > 0) {
                    for (i = 0; i < count; i++) {
                        this.numerator.push(atomicUnit);
                    }
                } else if (count < 0) {
                    for (i = 0; i < -count; i++) {
                        this.denominator.push(atomicUnit);
                    }
                }
            }
        }

        if (this.numerator.length === 0 && this.denominator.length === 0 && backup) {
            this.backupUnit = backup;
        }

        this.numerator.sort();
        this.denominator.sort();
    }
};

})(require('../tree'));

(function (tree) {

tree.Directive = function (name, value, rules, index, currentFileInfo, debugInfo) {
    this.name  = name;
    this.value = value;
    if (rules) {
        this.rules = rules;
        this.rules.allowImports = true;
    }
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.debugInfo = debugInfo;
};

tree.Directive.prototype = {
    type: "Directive",
    accept: function (visitor) {
        var value = this.value, rules = this.rules;
        if (rules) {
            rules = visitor.visit(rules);
        }
        if (value) {
            value = visitor.visit(value);
        }
    },
    genCSS: function (env, output) {
        var value = this.value, rules = this.rules;
        output.add(this.name, this.currentFileInfo, this.index);
        if (value) {
            output.add(' ');
            value.genCSS(env, output);
        }
        if (rules) {
            tree.outputRuleset(env, output, [rules]);
        } else {
            output.add(';');
        }
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        var value = this.value, rules = this.rules;
        if (value) {
            value = value.eval(env);
        }
        if (rules) {
            rules = rules.eval(env);
            rules.root = true;
        }
        return new(tree.Directive)(this.name, value, rules,
            this.index, this.currentFileInfo, this.debugInfo);
    },
    variable: function (name) { if (this.rules) return tree.Ruleset.prototype.variable.call(this.rules, name); },
    find: function () { if (this.rules) return tree.Ruleset.prototype.find.apply(this.rules, arguments); },
    rulesets: function () { if (this.rules) return tree.Ruleset.prototype.rulesets.apply(this.rules); },
    markReferenced: function () {
        var i, rules;
        this.isReferenced = true;
        if (this.rules) {
            rules = this.rules.rules;
            for (i = 0; i < rules.length; i++) {
                if (rules[i].markReferenced) {
                    rules[i].markReferenced();
                }
            }
        }
    }
};

})(require('../tree'));

(function (tree) {

tree.Element = function (combinator, value, index, currentFileInfo) {
    this.combinator = combinator instanceof tree.Combinator ?
                      combinator : new(tree.Combinator)(combinator);

    if (typeof(value) === 'string') {
        this.value = value.trim();
    } else if (value) {
        this.value = value;
    } else {
        this.value = "";
    }
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
tree.Element.prototype = {
    type: "Element",
    accept: function (visitor) {
        var value = this.value;
        this.combinator = visitor.visit(this.combinator);
        if (typeof value === "object") {
            this.value = visitor.visit(value);
        }
    },
    eval: function (env) {
        return new(tree.Element)(this.combinator,
                                 this.value.eval ? this.value.eval(env) : this.value,
                                 this.index,
                                 this.currentFileInfo);
    },
    genCSS: function (env, output) {
        output.add(this.toCSS(env), this.currentFileInfo, this.index);
    },
    toCSS: function (env) {
        var value = (this.value.toCSS ? this.value.toCSS(env) : this.value);
        if (value === '' && this.combinator.value.charAt(0) === '&') {
            return '';
        } else {
            return this.combinator.toCSS(env || {}) + value;
        }
    }
};

tree.Attribute = function (key, op, value) {
    this.key = key;
    this.op = op;
    this.value = value;
};
tree.Attribute.prototype = {
    type: "Attribute",
    eval: function (env) {
        return new(tree.Attribute)(this.key.eval ? this.key.eval(env) : this.key,
            this.op, (this.value && this.value.eval) ? this.value.eval(env) : this.value);
    },
    genCSS: function (env, output) {
        output.add(this.toCSS(env));
    },
    toCSS: function (env) {
        var value = this.key.toCSS ? this.key.toCSS(env) : this.key;

        if (this.op) {
            value += this.op;
            value += (this.value.toCSS ? this.value.toCSS(env) : this.value);
        }

        return '[' + value + ']';
    }
};

tree.Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
    } else {
        this.value = value ? value.trim() : "";
    }
};
tree.Combinator.prototype = {
    type: "Combinator",
    _outputMap: {
        ''  : '',
        ' ' : ' ',
        ':' : ' :',
        '+' : ' + ',
        '~' : ' ~ ',
        '>' : ' > ',
        '|' : '|',
        '^' : ' ^ ',
        '^^' : ' ^^ '
    },
    _outputMapCompressed: {
        ''  : '',
        ' ' : ' ',
        ':' : ' :',
        '+' : '+',
        '~' : '~',
        '>' : '>',
        '|' : '|',
        '^' : '^',
        '^^' : '^^'
    },
    genCSS: function (env, output) {
        output.add((env.compress ? this._outputMapCompressed : this._outputMap)[this.value]);
    },
    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {

tree.Expression = function (value) { this.value = value; };
tree.Expression.prototype = {
    type: "Expression",
    accept: function (visitor) {
        if (this.value) {
            this.value = visitor.visitArray(this.value);
        }
    },
    eval: function (env) {
        var returnValue,
            inParenthesis = this.parens && !this.parensInOp,
            doubleParen = false;
        if (inParenthesis) {
            env.inParenthesis();
        }
        if (this.value.length > 1) {
            returnValue = new(tree.Expression)(this.value.map(function (e) {
                return e.eval(env);
            }));
        } else if (this.value.length === 1) {
            if (this.value[0].parens && !this.value[0].parensInOp) {
                doubleParen = true;
            }
            returnValue = this.value[0].eval(env);
        } else {
            returnValue = this;
        }
        if (inParenthesis) {
            env.outOfParenthesis();
        }
        if (this.parens && this.parensInOp && !(env.isMathOn()) && !doubleParen) {
            returnValue = new(tree.Paren)(returnValue);
        }
        return returnValue;
    },
    genCSS: function (env, output) {
        for(var i = 0; i < this.value.length; i++) {
            this.value[i].genCSS(env, output);
            if (i + 1 < this.value.length) {
                output.add(" ");
            }
        }
    },
    toCSS: tree.toCSS,
    throwAwayComments: function () {
        this.value = this.value.filter(function(v) {
            return !(v instanceof tree.Comment);
        });
    }
};

})(require('../tree'));

(function (tree) {

tree.Extend = function Extend(selector, option, index) {
    this.selector = selector;
    this.option = option;
    this.index = index;
    this.object_id = tree.Extend.next_id++;
    this.parent_ids = [this.object_id];

    switch(option) {
        case "all":
            this.allowBefore = true;
            this.allowAfter = true;
        break;
        default:
            this.allowBefore = false;
            this.allowAfter = false;
        break;
    }
};
tree.Extend.next_id = 0;

tree.Extend.prototype = {
    type: "Extend",
    accept: function (visitor) {
        this.selector = visitor.visit(this.selector);
    },
    eval: function (env) {
        return new(tree.Extend)(this.selector.eval(env), this.option, this.index);
    },
    clone: function (env) {
        return new(tree.Extend)(this.selector, this.option, this.index);
    },
    findSelfSelectors: function (selectors) {
        var selfElements = [],
            i,
            selectorElements;

        for(i = 0; i < selectors.length; i++) {
            selectorElements = selectors[i].elements;
            // duplicate the logic in genCSS function inside the selector node.
            // future TODO - move both logics into the selector joiner visitor
            if (i > 0 && selectorElements.length && selectorElements[0].combinator.value === "") {
                selectorElements[0].combinator.value = ' ';
            }
            selfElements = selfElements.concat(selectors[i].elements);
        }

        this.selfSelectors = [{ elements: selfElements }];
    }
};

})(require('../tree'));

(function (tree) {
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
tree.Import = function (path, features, options, index, currentFileInfo) {
    this.options = options;
    this.index = index;
    this.path = path;
    this.features = features;
    this.currentFileInfo = currentFileInfo;

    if (this.options.less !== undefined || this.options.inline) {
        this.css = !this.options.less || this.options.inline;
    } else {
        var pathValue = this.getPath();
        if (pathValue && /css([\?;].*)?$/.test(pathValue)) {
            this.css = true;
        }
    }
};

//
// The actual import node doesn't return anything, when converted to CSS.
// The reason is that it's used at the evaluation stage, so that the rules
// it imports can be treated like any other rules.
//
// In `eval`, we make sure all Import nodes get evaluated, recursively, so
// we end up with a flat structure, which can easily be imported in the parent
// ruleset.
//
tree.Import.prototype = {
    type: "Import",
    accept: function (visitor) {
        if (this.features) {
            this.features = visitor.visit(this.features);
        }
        this.path = visitor.visit(this.path);
        if (!this.options.inline && this.root) {
            this.root = visitor.visit(this.root);
        }
    },
    genCSS: function (env, output) {
        if (this.css) {
            output.add("@import ", this.currentFileInfo, this.index);
            this.path.genCSS(env, output);
            if (this.features) {
                output.add(" ");
                this.features.genCSS(env, output);
            }
            output.add(';');
        }
    },
    toCSS: tree.toCSS,
    getPath: function () {
        if (this.path instanceof tree.Quoted) {
            var path = this.path.value;
            return (this.css !== undefined || /(\.[a-z]*$)|([\?;].*)$/.test(path)) ? path : path + '.less';
        } else if (this.path instanceof tree.URL) {
            return this.path.value.value;
        }
        return null;
    },
    evalForImport: function (env) {
        return new(tree.Import)(this.path.eval(env), this.features, this.options, this.index, this.currentFileInfo);
    },
    evalPath: function (env) {
        var path = this.path.eval(env);
        var rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;

        if (!(path instanceof tree.URL)) {
            if (rootpath) {
                var pathValue = path.value;
                // Add the base path if the import is relative
                if (pathValue && env.isPathRelative(pathValue)) {
                    path.value = rootpath +pathValue;
                }
            }
            path.value = env.normalizePath(path.value);
        }

        return path;
    },
    eval: function (env) {
        var ruleset, features = this.features && this.features.eval(env);

        if (this.skip) {
            if (typeof this.skip === "function") {
                this.skip = this.skip();
            }
            if (this.skip) {
                return []; 
            }
        }
         
        if (this.options.inline) {
            //todo needs to reference css file not import
            var contents = new(tree.Anonymous)(this.root, 0, {filename: this.importedFilename}, true);
            return this.features ? new(tree.Media)([contents], this.features.value) : [contents];
        } else if (this.css) {
            var newImport = new(tree.Import)(this.evalPath(env), features, this.options, this.index);
            if (!newImport.css && this.error) {
                throw this.error;
            }
            return newImport;
        } else {
            ruleset = new(tree.Ruleset)(null, this.root.rules.slice(0));

            ruleset.evalImports(env);

            return this.features ? new(tree.Media)(ruleset.rules, this.features.value) : ruleset.rules;
        }
    }
};

})(require('../tree'));

(function (tree) {

tree.JavaScript = function (string, index, escaped) {
    this.escaped = escaped;
    this.expression = string;
    this.index = index;
};
tree.JavaScript.prototype = {
    type: "JavaScript",
    eval: function (env) {
        var result,
            that = this,
            context = {};

        var expression = this.expression.replace(/@\{([\w-]+)\}/g, function (_, name) {
            return tree.jsify(new(tree.Variable)('@' + name, that.index).eval(env));
        });

        try {
            expression = new(Function)('return (' + expression + ')');
        } catch (e) {
            throw { message: "JavaScript evaluation error: " + e.message + " from `" + expression + "`" ,
                    index: this.index };
        }

        var variables = env.frames[0].variables();
        for (var k in variables) {
            if (variables.hasOwnProperty(k)) {
                /*jshint loopfunc:true */
                context[k.slice(1)] = {
                    value: variables[k].value,
                    toJS: function () {
                        return this.value.eval(env).toCSS();
                    }
                };
            }
        }

        try {
            result = expression.call(context);
        } catch (e) {
            throw { message: "JavaScript evaluation error: '" + e.name + ': ' + e.message.replace(/["]/g, "'") + "'" ,
                    index: this.index };
        }
        if (typeof(result) === 'number') {
            return new(tree.Dimension)(result);
        } else if (typeof(result) === 'string') {
            return new(tree.Quoted)('"' + result + '"', result, this.escaped, this.index);
        } else if (Array.isArray(result)) {
            return new(tree.Anonymous)(result.join(', '));
        } else {
            return new(tree.Anonymous)(result);
        }
    }
};

})(require('../tree'));


(function (tree) {

tree.Keyword = function (value) { this.value = value; };
tree.Keyword.prototype = {
    type: "Keyword",
    eval: function () { return this; },
    genCSS: function (env, output) {
        if (this.value === '%') { throw { type: "Syntax", message: "Invalid % without number" }; }
        output.add(this.value);
    },
    toCSS: tree.toCSS,
    compare: function (other) {
        if (other instanceof tree.Keyword) {
            return other.value === this.value ? 0 : 1;
        } else {
            return -1;
        }
    }
};

tree.True = new(tree.Keyword)('true');
tree.False = new(tree.Keyword)('false');

})(require('../tree'));

(function (tree) {

tree.Media = function (value, features, index, currentFileInfo) {
    this.index = index;
    this.currentFileInfo = currentFileInfo;

    var selectors = this.emptySelectors();

    this.features = new(tree.Value)(features);
    this.rules = [new(tree.Ruleset)(selectors, value)];
    this.rules[0].allowImports = true;
};
tree.Media.prototype = {
    type: "Media",
    accept: function (visitor) {
        if (this.features) {
            this.features = visitor.visit(this.features);
        }
        if (this.rules) {
            this.rules = visitor.visitArray(this.rules);
        }
    },
    genCSS: function (env, output) {
        output.add('@media ', this.currentFileInfo, this.index);
        this.features.genCSS(env, output);
        tree.outputRuleset(env, output, this.rules);
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        if (!env.mediaBlocks) {
            env.mediaBlocks = [];
            env.mediaPath = [];
        }
        
        var media = new(tree.Media)(null, [], this.index, this.currentFileInfo);
        if(this.debugInfo) {
            this.rules[0].debugInfo = this.debugInfo;
            media.debugInfo = this.debugInfo;
        }
        var strictMathBypass = false;
        if (!env.strictMath) {
            strictMathBypass = true;
            env.strictMath = true;
        }
        try {
            media.features = this.features.eval(env);
        }
        finally {
            if (strictMathBypass) {
                env.strictMath = false;
            }
        }
        
        env.mediaPath.push(media);
        env.mediaBlocks.push(media);
        
        env.frames.unshift(this.rules[0]);
        media.rules = [this.rules[0].eval(env)];
        env.frames.shift();
        
        env.mediaPath.pop();

        return env.mediaPath.length === 0 ? media.evalTop(env) :
                    media.evalNested(env);
    },
    variable: function (name) { return tree.Ruleset.prototype.variable.call(this.rules[0], name); },
    find: function () { return tree.Ruleset.prototype.find.apply(this.rules[0], arguments); },
    rulesets: function () { return tree.Ruleset.prototype.rulesets.apply(this.rules[0]); },
    emptySelectors: function() { 
        var el = new(tree.Element)('', '&', this.index, this.currentFileInfo),
            sels = [new(tree.Selector)([el], null, null, this.index, this.currentFileInfo)];
        sels[0].mediaEmpty = true;
        return sels;
    },
    markReferenced: function () {
        var i, rules = this.rules[0].rules;
        this.rules[0].markReferenced();
        this.isReferenced = true;
        for (i = 0; i < rules.length; i++) {
            if (rules[i].markReferenced) {
                rules[i].markReferenced();
            }
        }
    },

    evalTop: function (env) {
        var result = this;

        // Render all dependent Media blocks.
        if (env.mediaBlocks.length > 1) {
            var selectors = this.emptySelectors();
            result = new(tree.Ruleset)(selectors, env.mediaBlocks);
            result.multiMedia = true;
        }

        delete env.mediaBlocks;
        delete env.mediaPath;

        return result;
    },
    evalNested: function (env) {
        var i, value,
            path = env.mediaPath.concat([this]);

        // Extract the media-query conditions separated with `,` (OR).
        for (i = 0; i < path.length; i++) {
            value = path[i].features instanceof tree.Value ?
                        path[i].features.value : path[i].features;
            path[i] = Array.isArray(value) ? value : [value];
        }

        // Trace all permutations to generate the resulting media-query.
        //
        // (a, b and c) with nested (d, e) ->
        //    a and d
        //    a and e
        //    b and c and d
        //    b and c and e
        this.features = new(tree.Value)(this.permute(path).map(function (path) {
            path = path.map(function (fragment) {
                return fragment.toCSS ? fragment : new(tree.Anonymous)(fragment);
            });

            for(i = path.length - 1; i > 0; i--) {
                path.splice(i, 0, new(tree.Anonymous)("and"));
            }

            return new(tree.Expression)(path);
        }));

        // Fake a tree-node that doesn't output anything.
        return new(tree.Ruleset)([], []);
    },
    permute: function (arr) {
      if (arr.length === 0) {
          return [];
      } else if (arr.length === 1) {
          return arr[0];
      } else {
          var result = [];
          var rest = this.permute(arr.slice(1));
          for (var i = 0; i < rest.length; i++) {
              for (var j = 0; j < arr[0].length; j++) {
                  result.push([arr[0][j]].concat(rest[i]));
              }
          }
          return result;
      }
    },
    bubbleSelectors: function (selectors) {
      if (!selectors)
        return;
      this.rules = [new(tree.Ruleset)(selectors.slice(0), [this.rules[0]])];
    }
};

})(require('../tree'));

(function (tree) {

tree.mixin = {};
tree.mixin.Call = function (elements, args, index, currentFileInfo, important) {
    this.selector = new(tree.Selector)(elements);
    this.arguments = (args && args.length) ? args : null;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.important = important;
};
tree.mixin.Call.prototype = {
    type: "MixinCall",
    accept: function (visitor) {
        if (this.selector) {
            this.selector = visitor.visit(this.selector);
        }
        if (this.arguments) {
            this.arguments = visitor.visitArray(this.arguments);
        }
    },
    eval: function (env) {
        var mixins, mixin, args, rules = [], match = false, i, m, f, isRecursive, isOneFound, rule,
            candidates = [], candidate, conditionResult = [], defaultFunc = tree.defaultFunc,
            defaultResult, defNone = 0, defTrue = 1, defFalse = 2, count, originalRuleset; 

        args = this.arguments && this.arguments.map(function (a) {
            return { name: a.name, value: a.value.eval(env) };
        });

        for (i = 0; i < env.frames.length; i++) {
            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
                isOneFound = true;
                
                // To make `default()` function independent of definition order we have two "subpasses" here.
                // At first we evaluate each guard *twice* (with `default() == true` and `default() == false`),
                // and build candidate list with corresponding flags. Then, when we know all possible matches,
                // we make a final decision.
                
                for (m = 0; m < mixins.length; m++) {
                    mixin = mixins[m];
                    isRecursive = false;
                    for(f = 0; f < env.frames.length; f++) {
                        if ((!(mixin instanceof tree.mixin.Definition)) && mixin === (env.frames[f].originalRuleset || env.frames[f])) {
                            isRecursive = true;
                            break;
                        }
                    }
                    if (isRecursive) {
                        continue;
                    }
                    
                    if (mixin.matchArgs(args, env)) {  
                        candidate = {mixin: mixin, group: defNone};
                        
                        if (mixin.matchCondition) { 
                            for (f = 0; f < 2; f++) {
                                defaultFunc.value(f);
                                conditionResult[f] = mixin.matchCondition(args, env);
                            }
                            if (conditionResult[0] || conditionResult[1]) {
                                if (conditionResult[0] != conditionResult[1]) {
                                    candidate.group = conditionResult[1] ?
                                        defTrue : defFalse;
                                }

                                candidates.push(candidate);
                            }   
                        }
                        else {
                            candidates.push(candidate);
                        }
                        
                        match = true;
                    }
                }
                
                defaultFunc.reset();

                count = [0, 0, 0];
                for (m = 0; m < candidates.length; m++) {
                    count[candidates[m].group]++;
                }

                if (count[defNone] > 0) {
                    defaultResult = defFalse;
                } else {
                    defaultResult = defTrue;
                    if ((count[defTrue] + count[defFalse]) > 1) {
                        throw { type: 'Runtime',
                            message: 'Ambiguous use of `default()` found when matching for `'
                                + this.format(args) + '`',
                            index: this.index, filename: this.currentFileInfo.filename };
                    }
                }
                
                for (m = 0; m < candidates.length; m++) {
                    candidate = candidates[m].group;
                    if ((candidate === defNone) || (candidate === defaultResult)) {
                        try {
                            mixin = candidates[m].mixin;
                            if (!(mixin instanceof tree.mixin.Definition)) {
                                originalRuleset = mixin.originalRuleset || mixin;
                                mixin = new tree.mixin.Definition("", [], mixin.rules, null, false);
                                mixin.originalRuleset = originalRuleset;
                            }
                            Array.prototype.push.apply(
                                  rules, mixin.evalCall(env, args, this.important).rules);
                        } catch (e) {
                            throw { message: e.message, index: this.index, filename: this.currentFileInfo.filename, stack: e.stack };
                        }
                    }
                }
                
                if (match) {
                    if (!this.currentFileInfo || !this.currentFileInfo.reference) {
                        for (i = 0; i < rules.length; i++) {
                            rule = rules[i];
                            if (rule.markReferenced) {
                                rule.markReferenced();
                            }
                        }
                    }
                    return rules;
                }
            }
        }
        if (isOneFound) {
            throw { type:    'Runtime',
                    message: 'No matching definition was found for `' + this.format(args) + '`',
                    index:   this.index, filename: this.currentFileInfo.filename };
        } else {
            throw { type:    'Name',
                    message: this.selector.toCSS().trim() + " is undefined",
                    index:   this.index, filename: this.currentFileInfo.filename };
        }
    },
    format: function (args) {
        return this.selector.toCSS().trim() + '(' +
            (args ? args.map(function (a) {
                var argValue = "";
                if (a.name) {
                    argValue += a.name + ":";
                }
                if (a.value.toCSS) {
                    argValue += a.value.toCSS();
                } else {
                    argValue += "???";
                }
                return argValue;
            }).join(', ') : "") + ")";
    }
};

tree.mixin.Definition = function (name, params, rules, condition, variadic, frames) {
    this.name = name;
    this.selectors = [new(tree.Selector)([new(tree.Element)(null, name, this.index, this.currentFileInfo)])];
    this.params = params;
    this.condition = condition;
    this.variadic = variadic;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function (count, p) {
        if (!p.name || (p.name && !p.value)) { return count + 1; }
        else                                 { return count; }
    }, 0);
    this.parent = tree.Ruleset.prototype;
    this.frames = frames;
};
tree.mixin.Definition.prototype = {
    type: "MixinDefinition",
    accept: function (visitor) {
        if (this.params && this.params.length) {
            this.params = visitor.visitArray(this.params);
        }
        this.rules = visitor.visitArray(this.rules);
        if (this.condition) {
            this.condition = visitor.visit(this.condition);
        }
    },
    variable:  function (name) { return this.parent.variable.call(this, name); },
    variables: function ()     { return this.parent.variables.call(this); },
    find:      function ()     { return this.parent.find.apply(this, arguments); },
    rulesets:  function ()     { return this.parent.rulesets.apply(this); },

    evalParams: function (env, mixinEnv, args, evaldArguments) {
        /*jshint boss:true */
        var frame = new(tree.Ruleset)(null, null),
            varargs, arg,
            params = this.params.slice(0),
            i, j, val, name, isNamedFound, argIndex, argsLength = 0;

        mixinEnv = new tree.evalEnv(mixinEnv, [frame].concat(mixinEnv.frames));

        if (args) {
            args = args.slice(0);
            argsLength = args.length;

            for(i = 0; i < argsLength; i++) {
                arg = args[i];
                if (name = (arg && arg.name)) {
                    isNamedFound = false;
                    for(j = 0; j < params.length; j++) {
                        if (!evaldArguments[j] && name === params[j].name) {
                            evaldArguments[j] = arg.value.eval(env);
                            frame.prependRule(new(tree.Rule)(name, arg.value.eval(env)));
                            isNamedFound = true;
                            break;
                        }
                    }
                    if (isNamedFound) {
                        args.splice(i, 1);
                        i--;
                        continue;
                    } else {
                        throw { type: 'Runtime', message: "Named argument for " + this.name +
                            ' ' + args[i].name + ' not found' };
                    }
                }
            }
        }
        argIndex = 0;
        for (i = 0; i < params.length; i++) {
            if (evaldArguments[i]) { continue; }

            arg = args && args[argIndex];

            if (name = params[i].name) {
                if (params[i].variadic) {
                    varargs = [];
                    for (j = argIndex; j < argsLength; j++) {
                        varargs.push(args[j].value.eval(env));
                    }
                    frame.prependRule(new(tree.Rule)(name, new(tree.Expression)(varargs).eval(env)));
                } else {
                    val = arg && arg.value;
                    if (val) {
                        val = val.eval(env);
                    } else if (params[i].value) {
                        val = params[i].value.eval(mixinEnv);
                        frame.resetCache();
                    } else {
                        throw { type: 'Runtime', message: "wrong number of arguments for " + this.name +
                            ' (' + argsLength + ' for ' + this.arity + ')' };
                    }
                    
                    frame.prependRule(new(tree.Rule)(name, val));
                    evaldArguments[i] = val;
                }
            }

            if (params[i].variadic && args) {
                for (j = argIndex; j < argsLength; j++) {
                    evaldArguments[j] = args[j].value.eval(env);
                }
            }
            argIndex++;
        }

        return frame;
    },
    eval: function (env) {
        return new tree.mixin.Definition(this.name, this.params, this.rules, this.condition, this.variadic, this.frames || env.frames.slice(0));
    },
    evalCall: function (env, args, important) {
        var _arguments = [],
            mixinFrames = this.frames ? this.frames.concat(env.frames) : env.frames,
            frame = this.evalParams(env, new(tree.evalEnv)(env, mixinFrames), args, _arguments),
            rules, ruleset;

        frame.prependRule(new(tree.Rule)('@arguments', new(tree.Expression)(_arguments).eval(env)));

        rules = this.rules.slice(0);

        ruleset = new(tree.Ruleset)(null, rules);
        ruleset.originalRuleset = this;
        ruleset = ruleset.eval(new(tree.evalEnv)(env, [this, frame].concat(mixinFrames)));
        if (important) {
            ruleset = this.parent.makeImportant.apply(ruleset);
        }
        return ruleset;
    },
    matchCondition: function (args, env) {
        if (this.condition && !this.condition.eval(
            new(tree.evalEnv)(env,
                [this.evalParams(env, new(tree.evalEnv)(env, this.frames ? this.frames.concat(env.frames) : env.frames), args, [])] // the parameter variables
                    .concat(this.frames) // the parent namespace/mixin frames
                    .concat(env.frames)))) { // the current environment frames
            return false;
        }
        return true;
    },
    matchArgs: function (args, env) {
        var argsLength = (args && args.length) || 0, len;

        if (! this.variadic) {
            if (argsLength < this.required)                               { return false; }
            if (argsLength > this.params.length)                          { return false; }
        } else {
            if (argsLength < (this.required - 1))                         { return false; }
        }

        len = Math.min(argsLength, this.arity);

        for (var i = 0; i < len; i++) {
            if (!this.params[i].name && !this.params[i].variadic) {
                if (args[i].value.eval(env).toCSS() != this.params[i].value.eval(env).toCSS()) {
                    return false;
                }
            }
        }
        return true;
    }
};

})(require('../tree'));

(function (tree) {

tree.Negative = function (node) {
    this.value = node;
};
tree.Negative.prototype = {
    type: "Negative",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    genCSS: function (env, output) {
        output.add('-');
        this.value.genCSS(env, output);
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        if (env.isMathOn()) {
            return (new(tree.Operation)('*', [new(tree.Dimension)(-1), this.value])).eval(env);
        }
        return new(tree.Negative)(this.value.eval(env));
    }
};

})(require('../tree'));

(function (tree) {

tree.Operation = function (op, operands, isSpaced) {
    this.op = op.trim();
    this.operands = operands;
    this.isSpaced = isSpaced;
};
tree.Operation.prototype = {
    type: "Operation",
    accept: function (visitor) {
        this.operands = visitor.visit(this.operands);
    },
    eval: function (env) {
        var a = this.operands[0].eval(env),
            b = this.operands[1].eval(env);

        if (env.isMathOn()) {
            if (a instanceof tree.Dimension && b instanceof tree.Color) {
                a = a.toColor();
            }
            if (b instanceof tree.Dimension && a instanceof tree.Color) {
                b = b.toColor();
            }
            if (!a.operate) {
                throw { type: "Operation",
                        message: "Operation on an invalid type" };
            }

            return a.operate(env, this.op, b);
        } else {
            return new(tree.Operation)(this.op, [a, b], this.isSpaced);
        }
    },
    genCSS: function (env, output) {
        this.operands[0].genCSS(env, output);
        if (this.isSpaced) {
            output.add(" ");
        }
        output.add(this.op);
        if (this.isSpaced) {
            output.add(" ");
        }
        this.operands[1].genCSS(env, output);
    },
    toCSS: tree.toCSS
};

tree.operate = function (env, op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
};

})(require('../tree'));


(function (tree) {

tree.Paren = function (node) {
    this.value = node;
};
tree.Paren.prototype = {
    type: "Paren",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    genCSS: function (env, output) {
        output.add('(');
        this.value.genCSS(env, output);
        output.add(')');
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        return new(tree.Paren)(this.value.eval(env));
    }
};

})(require('../tree'));

(function (tree) {

tree.Quoted = function (str, content, escaped, index, currentFileInfo) {
    this.escaped = escaped;
    this.value = content || '';
    this.quote = str.charAt(0);
    this.index = index;
    this.currentFileInfo = currentFileInfo;
};
tree.Quoted.prototype = {
    type: "Quoted",
    genCSS: function (env, output) {
        if (!this.escaped) {
            output.add(this.quote, this.currentFileInfo, this.index);
        }
        output.add(this.value);
        if (!this.escaped) {
            output.add(this.quote);
        }
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        var that = this;
        var value = this.value.replace(/`([^`]+)`/g, function (_, exp) {
            return new(tree.JavaScript)(exp, that.index, true).eval(env).value;
        }).replace(/@\{([\w-]+)\}/g, function (_, name) {
            var v = new(tree.Variable)('@' + name, that.index, that.currentFileInfo).eval(env, true);
            return (v instanceof tree.Quoted) ? v.value : v.toCSS();
        });
        return new(tree.Quoted)(this.quote + value + this.quote, value, this.escaped, this.index, this.currentFileInfo);
    },
    compare: function (x) {
        if (!x.toCSS) {
            return -1;
        }

        var left, right;

        // when comparing quoted strings allow the quote to differ
        if (x.type === "Quoted" && !this.escaped && !x.escaped) {
            left = x.value;
            right = this.value;
        } else {
            left = this.toCSS();
            right = x.toCSS();
        }

        if (left === right) {
            return 0;
        }

        return left < right ? -1 : 1;
    }
};

})(require('../tree'));

(function (tree) {

tree.Rule = function (name, value, important, merge, index, currentFileInfo, inline) {
    this.name = name;
    this.value = (value instanceof tree.Value || value instanceof tree.Ruleset) ? value : new(tree.Value)([value]);
    this.important = important ? ' ' + important.trim() : '';
    this.merge = merge;
    this.index = index;
    this.currentFileInfo = currentFileInfo;
    this.inline = inline || false;
    this.variable = name.charAt && (name.charAt(0) === '@');
};

tree.Rule.prototype = {
    type: "Rule",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    genCSS: function (env, output) {
        output.add(this.name + (env.compress ? ':' : ': '), this.currentFileInfo, this.index);
        try {
            this.value.genCSS(env, output);
        }
        catch(e) {
            e.index = this.index;
            e.filename = this.currentFileInfo.filename;
            throw e;
        }
        output.add(this.important + ((this.inline || (env.lastRule && env.compress)) ? "" : ";"), this.currentFileInfo, this.index);
    },
    toCSS: tree.toCSS,
    eval: function (env) {
        var strictMathBypass = false, name = this.name, evaldValue;
        if (typeof name !== "string") {
            // expand 'primitive' name directly to get
            // things faster (~10% for benchmark.less):
            name = (name.length === 1) 
                && (name[0] instanceof tree.Keyword)
                    ? name[0].value : evalName(env, name);
        }
        if (name === "font" && !env.strictMath) {
            strictMathBypass = true;
            env.strictMath = true;
        }
        try {
            evaldValue = this.value.eval(env);
            
            if (!this.variable && evaldValue.type === "DetachedRuleset") {
                throw { message: "Rulesets cannot be evaluated on a property.",
                        index: this.index, filename: this.currentFileInfo.filename };
            }

            return new(tree.Rule)(name,
                              evaldValue,
                              this.important,
                              this.merge,
                              this.index, this.currentFileInfo, this.inline);
        }
        catch(e) {
            if (typeof e.index !== 'number') {
                e.index = this.index;
                e.filename = this.currentFileInfo.filename;
            }
            throw e;
        }
        finally {
            if (strictMathBypass) {
                env.strictMath = false;
            }
        }
    },
    makeImportant: function () {
        return new(tree.Rule)(this.name,
                              this.value,
                              "!important",
                              this.merge,
                              this.index, this.currentFileInfo, this.inline);
    }
};

function evalName(env, name) {
    var value = "", i, n = name.length,
        output = {add: function (s) {value += s;}};
    for (i = 0; i < n; i++) {
        name[i].eval(env).genCSS(env, output);
    }
    return value;
}

})(require('../tree'));

(function (tree) {

tree.RulesetCall = function (variable) {
    this.variable = variable;
};
tree.RulesetCall.prototype = {
    type: "RulesetCall",
    accept: function (visitor) {
    },
    eval: function (env) {
        var detachedRuleset = new(tree.Variable)(this.variable).eval(env);
        return detachedRuleset.callEval(env);
    }
};

})(require('../tree'));

(function (tree) {

tree.Ruleset = function (selectors, rules, strictImports) {
    this.selectors = selectors;
    this.rules = rules;
    this._lookups = {};
    this.strictImports = strictImports;
};
tree.Ruleset.prototype = {
    type: "Ruleset",
    accept: function (visitor) {
        if (this.paths) {
            visitor.visitArray(this.paths, true);
        } else if (this.selectors) {
            this.selectors = visitor.visitArray(this.selectors);
        }
        if (this.rules && this.rules.length) {
            this.rules = visitor.visitArray(this.rules);
        }
    },
    eval: function (env) {
        var thisSelectors = this.selectors, selectors, 
            selCnt, selector, i, defaultFunc = tree.defaultFunc, hasOnePassingSelector = false;

        if (thisSelectors && (selCnt = thisSelectors.length)) {
            selectors = [];
            defaultFunc.error({
                type: "Syntax", 
                message: "it is currently only allowed in parametric mixin guards," 
            });
            for (i = 0; i < selCnt; i++) {
                selector = thisSelectors[i].eval(env);
                selectors.push(selector);
                if (selector.evaldCondition) {
                    hasOnePassingSelector = true;
                }
            }
            defaultFunc.reset();  
        } else {
            hasOnePassingSelector = true;
        }

        var rules = this.rules ? this.rules.slice(0) : null,
            ruleset = new(tree.Ruleset)(selectors, rules, this.strictImports),
            rule, subRule;

        ruleset.originalRuleset = this;
        ruleset.root = this.root;
        ruleset.firstRoot = this.firstRoot;
        ruleset.allowImports = this.allowImports;

        if(this.debugInfo) {
            ruleset.debugInfo = this.debugInfo;
        }
        
        if (!hasOnePassingSelector) {
            rules.length = 0;
        }

        // push the current ruleset to the frames stack
        var envFrames = env.frames;
        envFrames.unshift(ruleset);

        // currrent selectors
        var envSelectors = env.selectors;
        if (!envSelectors) {
            env.selectors = envSelectors = [];
        }
        envSelectors.unshift(this.selectors);

        // Evaluate imports
        if (ruleset.root || ruleset.allowImports || !ruleset.strictImports) {
            ruleset.evalImports(env);
        }

        // Store the frames around mixin definitions,
        // so they can be evaluated like closures when the time comes.
        var rsRules = ruleset.rules, rsRuleCnt = rsRules ? rsRules.length : 0;
        for (i = 0; i < rsRuleCnt; i++) {
            if (rsRules[i] instanceof tree.mixin.Definition || rsRules[i] instanceof tree.DetachedRuleset) {
                rsRules[i] = rsRules[i].eval(env);
            }
        }

        var mediaBlockCount = (env.mediaBlocks && env.mediaBlocks.length) || 0;

        // Evaluate mixin calls.
        for (i = 0; i < rsRuleCnt; i++) {
            if (rsRules[i] instanceof tree.mixin.Call) {
                /*jshint loopfunc:true */
                rules = rsRules[i].eval(env).filter(function(r) {
                    if ((r instanceof tree.Rule) && r.variable) {
                        // do not pollute the scope if the variable is
                        // already there. consider returning false here
                        // but we need a way to "return" variable from mixins
                        return !(ruleset.variable(r.name));
                    }
                    return true;
                });
                rsRules.splice.apply(rsRules, [i, 1].concat(rules));
                rsRuleCnt += rules.length - 1;
                i += rules.length-1;
                ruleset.resetCache();
            } else if (rsRules[i] instanceof tree.RulesetCall) {
                /*jshint loopfunc:true */
                rules = rsRules[i].eval(env).rules.filter(function(r) {
                    if ((r instanceof tree.Rule) && r.variable) {
                        // do not pollute the scope at all
                        return false;
                    }
                    return true;
                });
                rsRules.splice.apply(rsRules, [i, 1].concat(rules));
                rsRuleCnt += rules.length - 1;
                i += rules.length-1;
                ruleset.resetCache();
            }
        }

        // Evaluate everything else
        for (i = 0; i < rsRules.length; i++) {
            rule = rsRules[i];
            if (! (rule instanceof tree.mixin.Definition || rule instanceof tree.DetachedRuleset)) {
                rsRules[i] = rule = rule.eval ? rule.eval(env) : rule;
            }
        }
        
        // Evaluate everything else
        for (i = 0; i < rsRules.length; i++) {
            rule = rsRules[i];
            // for rulesets, check if it is a css guard and can be removed
            if (rule instanceof tree.Ruleset && rule.selectors && rule.selectors.length === 1) {
                // check if it can be folded in (e.g. & where)
                if (rule.selectors[0].isJustParentSelector()) {
                    rsRules.splice(i--, 1);

                    for(var j = 0; j < rule.rules.length; j++) {
                        subRule = rule.rules[j];
                        if (!(subRule instanceof tree.Rule) || !subRule.variable) {
                            rsRules.splice(++i, 0, subRule);
                        }
                    }
                }
            }
        }

        // Pop the stack
        envFrames.shift();
        envSelectors.shift();
        
        if (env.mediaBlocks) {
            for (i = mediaBlockCount; i < env.mediaBlocks.length; i++) {
                env.mediaBlocks[i].bubbleSelectors(selectors);
            }
        }

        return ruleset;
    },
    evalImports: function(env) {
        var rules = this.rules, i, importRules;
        if (!rules) { return; }

        for (i = 0; i < rules.length; i++) {
            if (rules[i] instanceof tree.Import) {
                importRules = rules[i].eval(env);
                if (importRules && importRules.length) {
                    rules.splice.apply(rules, [i, 1].concat(importRules));
                    i+= importRules.length-1;
                } else {
                    rules.splice(i, 1, importRules);
                }
                this.resetCache();
            }
        }
    },
    makeImportant: function() {
        return new tree.Ruleset(this.selectors, this.rules.map(function (r) {
                    if (r.makeImportant) {
                        return r.makeImportant();
                    } else {
                        return r;
                    }
                }), this.strictImports);
    },
    matchArgs: function (args) {
        return !args || args.length === 0;
    },
    // lets you call a css selector with a guard
    matchCondition: function (args, env) {
        var lastSelector = this.selectors[this.selectors.length-1];
        if (!lastSelector.evaldCondition) {
            return false;
        }
        if (lastSelector.condition &&
            !lastSelector.condition.eval(
                new(tree.evalEnv)(env,
                    env.frames))) {
            return false;
        }
        return true;
    },
    resetCache: function () {
        this._rulesets = null;
        this._variables = null;
        this._lookups = {};
    },
    variables: function () {
        if (!this._variables) {
            this._variables = !this.rules ? {} : this.rules.reduce(function (hash, r) {
                if (r instanceof tree.Rule && r.variable === true) {
                    hash[r.name] = r;
                }
                return hash;
            }, {});
        }
        return this._variables;
    },
    variable: function (name) {
        return this.variables()[name];
    },
    rulesets: function () {
        if (!this.rules) { return null; }

        var _Ruleset = tree.Ruleset, _MixinDefinition = tree.mixin.Definition,
            filtRules = [], rules = this.rules, cnt = rules.length,
            i, rule;

        for (i = 0; i < cnt; i++) {
            rule = rules[i];
            if ((rule instanceof _Ruleset) || (rule instanceof _MixinDefinition)) {
                filtRules.push(rule);
            }
        }

        return filtRules;
    },
    prependRule: function (rule) {
        var rules = this.rules;
        if (rules) { rules.unshift(rule); } else { this.rules = [ rule ]; }
    },
    find: function (selector, self) {
        self = self || this;
        var rules = [], match,
            key = selector.toCSS();

        if (key in this._lookups) { return this._lookups[key]; }

        this.rulesets().forEach(function (rule) {
            if (rule !== self) {
                for (var j = 0; j < rule.selectors.length; j++) {
                    match = selector.match(rule.selectors[j]);
                    if (match) {
                        if (selector.elements.length > match) {
                            Array.prototype.push.apply(rules, rule.find(
                                new(tree.Selector)(selector.elements.slice(match)), self));
                        } else {
                            rules.push(rule);
                        }
                        break;
                    }
                }
            }
        });
        this._lookups[key] = rules;
        return rules;
    },
    genCSS: function (env, output) {
        var i, j,
            ruleNodes = [],
            rulesetNodes = [],
            rulesetNodeCnt,
            debugInfo,     // Line number debugging
            rule,
            path;

        env.tabLevel = (env.tabLevel || 0);

        if (!this.root) {
            env.tabLevel++;
        }

        var tabRuleStr = env.compress ? '' : Array(env.tabLevel + 1).join("  "),
            tabSetStr = env.compress ? '' : Array(env.tabLevel).join("  "),
            sep;

        for (i = 0; i < this.rules.length; i++) {
            rule = this.rules[i];
            if (rule.rules || (rule instanceof tree.Media) || rule instanceof tree.Directive || (this.root && rule instanceof tree.Comment)) {
                rulesetNodes.push(rule);
            } else {
                ruleNodes.push(rule);
            }
        }

        // If this is the root node, we don't render
        // a selector, or {}.
        if (!this.root) {
            debugInfo = tree.debugInfo(env, this, tabSetStr);

            if (debugInfo) {
                output.add(debugInfo);
                output.add(tabSetStr);
            }

            var paths = this.paths, pathCnt = paths.length,
                pathSubCnt;

            sep = env.compress ? ',' : (',\n' + tabSetStr);

            for (i = 0; i < pathCnt; i++) {
                path = paths[i];
                if (!(pathSubCnt = path.length)) { continue; }
                if (i > 0) { output.add(sep); }

                env.firstSelector = true;
                path[0].genCSS(env, output);

                env.firstSelector = false;
                for (j = 1; j < pathSubCnt; j++) {
                    path[j].genCSS(env, output);
                }
            }

            output.add((env.compress ? '{' : ' {\n') + tabRuleStr);
        }

        // Compile rules and rulesets
        for (i = 0; i < ruleNodes.length; i++) {
            rule = ruleNodes[i];

            // @page{ directive ends up with root elements inside it, a mix of rules and rulesets
            // In this instance we do not know whether it is the last property
            if (i + 1 === ruleNodes.length && (!this.root || rulesetNodes.length === 0 || this.firstRoot)) {
                env.lastRule = true;
            }

            if (rule.genCSS) {
                rule.genCSS(env, output);
            } else if (rule.value) {
                output.add(rule.value.toString());
            }

            if (!env.lastRule) {
                output.add(env.compress ? '' : ('\n' + tabRuleStr));
            } else {
                env.lastRule = false;
            }
        }

        if (!this.root) {
            output.add((env.compress ? '}' : '\n' + tabSetStr + '}'));
            env.tabLevel--;
        }

        sep = (env.compress ? "" : "\n") + (this.root ? tabRuleStr : tabSetStr);
        rulesetNodeCnt = rulesetNodes.length;
        if (rulesetNodeCnt) {
            if (ruleNodes.length && sep) { output.add(sep); }
            rulesetNodes[0].genCSS(env, output);
            for (i = 1; i < rulesetNodeCnt; i++) {
                if (sep) { output.add(sep); }
                rulesetNodes[i].genCSS(env, output);
            }
        }

        if (!output.isEmpty() && !env.compress && this.firstRoot) {
            output.add('\n');
        }
    },

    toCSS: tree.toCSS,

    markReferenced: function () {
        if (!this.selectors) {
            return;
        }
        for (var s = 0; s < this.selectors.length; s++) {
            this.selectors[s].markReferenced();
        }
    },

    joinSelectors: function (paths, context, selectors) {
        for (var s = 0; s < selectors.length; s++) {
            this.joinSelector(paths, context, selectors[s]);
        }
    },

    joinSelector: function (paths, context, selector) {

        var i, j, k, 
            hasParentSelector, newSelectors, el, sel, parentSel, 
            newSelectorPath, afterParentJoin, newJoinedSelector, 
            newJoinedSelectorEmpty, lastSelector, currentElements,
            selectorsMultiplied;
    
        for (i = 0; i < selector.elements.length; i++) {
            el = selector.elements[i];
            if (el.value === '&') {
                hasParentSelector = true;
            }
        }
    
        if (!hasParentSelector) {
            if (context.length > 0) {
                for (i = 0; i < context.length; i++) {
                    paths.push(context[i].concat(selector));
                }
            }
            else {
                paths.push([selector]);
            }
            return;
        }

        // The paths are [[Selector]]
        // The first list is a list of comma seperated selectors
        // The inner list is a list of inheritance seperated selectors
        // e.g.
        // .a, .b {
        //   .c {
        //   }
        // }
        // == [[.a] [.c]] [[.b] [.c]]
        //

        // the elements from the current selector so far
        currentElements = [];
        // the current list of new selectors to add to the path.
        // We will build it up. We initiate it with one empty selector as we "multiply" the new selectors
        // by the parents
        newSelectors = [[]];

        for (i = 0; i < selector.elements.length; i++) {
            el = selector.elements[i];
            // non parent reference elements just get added
            if (el.value !== "&") {
                currentElements.push(el);
            } else {
                // the new list of selectors to add
                selectorsMultiplied = [];

                // merge the current list of non parent selector elements
                // on to the current list of selectors to add
                if (currentElements.length > 0) {
                    this.mergeElementsOnToSelectors(currentElements, newSelectors);
                }

                // loop through our current selectors
                for (j = 0; j < newSelectors.length; j++) {
                    sel = newSelectors[j];
                    // if we don't have any parent paths, the & might be in a mixin so that it can be used
                    // whether there are parents or not
                    if (context.length === 0) {
                        // the combinator used on el should now be applied to the next element instead so that
                        // it is not lost
                        if (sel.length > 0) {
                            sel[0].elements = sel[0].elements.slice(0);
                            sel[0].elements.push(new(tree.Element)(el.combinator, '', el.index, el.currentFileInfo));
                        }
                        selectorsMultiplied.push(sel);
                    }
                    else {
                        // and the parent selectors
                        for (k = 0; k < context.length; k++) {
                            parentSel = context[k];
                            // We need to put the current selectors
                            // then join the last selector's elements on to the parents selectors

                            // our new selector path
                            newSelectorPath = [];
                            // selectors from the parent after the join
                            afterParentJoin = [];
                            newJoinedSelectorEmpty = true;

                            //construct the joined selector - if & is the first thing this will be empty,
                            // if not newJoinedSelector will be the last set of elements in the selector
                            if (sel.length > 0) {
                                newSelectorPath = sel.slice(0);
                                lastSelector = newSelectorPath.pop();
                                newJoinedSelector = selector.createDerived(lastSelector.elements.slice(0));
                                newJoinedSelectorEmpty = false;
                            }
                            else {
                                newJoinedSelector = selector.createDerived([]);
                            }

                            //put together the parent selectors after the join
                            if (parentSel.length > 1) {
                                afterParentJoin = afterParentJoin.concat(parentSel.slice(1));
                            }

                            if (parentSel.length > 0) {
                                newJoinedSelectorEmpty = false;

                                // join the elements so far with the first part of the parent
                                newJoinedSelector.elements.push(new(tree.Element)(el.combinator, parentSel[0].elements[0].value, el.index, el.currentFileInfo));
                                newJoinedSelector.elements = newJoinedSelector.elements.concat(parentSel[0].elements.slice(1));
                            }

                            if (!newJoinedSelectorEmpty) {
                                // now add the joined selector
                                newSelectorPath.push(newJoinedSelector);
                            }

                            // and the rest of the parent
                            newSelectorPath = newSelectorPath.concat(afterParentJoin);

                            // add that to our new set of selectors
                            selectorsMultiplied.push(newSelectorPath);
                        }
                    }
                }

                // our new selectors has been multiplied, so reset the state
                newSelectors = selectorsMultiplied;
                currentElements = [];
            }
        }

        // if we have any elements left over (e.g. .a& .b == .b)
        // add them on to all the current selectors
        if (currentElements.length > 0) {
            this.mergeElementsOnToSelectors(currentElements, newSelectors);
        }

        for (i = 0; i < newSelectors.length; i++) {
            if (newSelectors[i].length > 0) {
                paths.push(newSelectors[i]);
            }
        }
    },
    
    mergeElementsOnToSelectors: function(elements, selectors) {
        var i, sel;

        if (selectors.length === 0) {
            selectors.push([ new(tree.Selector)(elements) ]);
            return;
        }

        for (i = 0; i < selectors.length; i++) {
            sel = selectors[i];

            // if the previous thing in sel is a parent this needs to join on to it
            if (sel.length > 0) {
                sel[sel.length - 1] = sel[sel.length - 1].createDerived(sel[sel.length - 1].elements.concat(elements));
            }
            else {
                sel.push(new(tree.Selector)(elements));
            }
        }
    }
};
})(require('../tree'));

(function (tree) {

tree.Selector = function (elements, extendList, condition, index, currentFileInfo, isReferenced) {
    this.elements = elements;
    this.extendList = extendList;
    this.condition = condition;
    this.currentFileInfo = currentFileInfo || {};
    this.isReferenced = isReferenced;
    if (!condition) {
        this.evaldCondition = true;
    }
};
tree.Selector.prototype = {
    type: "Selector",
    accept: function (visitor) {
        if (this.elements) {
            this.elements = visitor.visitArray(this.elements);
        }
        if (this.extendList) {
            this.extendList = visitor.visitArray(this.extendList);
        }
        if (this.condition) {
            this.condition = visitor.visit(this.condition);
        }
    },
    createDerived: function(elements, extendList, evaldCondition) {
        evaldCondition = (evaldCondition != null) ? evaldCondition : this.evaldCondition;
        var newSelector = new(tree.Selector)(elements, extendList || this.extendList, null, this.index, this.currentFileInfo, this.isReferenced);
        newSelector.evaldCondition = evaldCondition;
        newSelector.mediaEmpty = this.mediaEmpty;
        return newSelector;
    },
    match: function (other) {
        var elements = this.elements,
            len = elements.length,
            olen, i;

        other.CacheElements();

        olen = other._elements.length;
        if (olen === 0 || len < olen) {
            return 0;
        } else {
            for (i = 0; i < olen; i++) {
                if (elements[i].value !== other._elements[i]) {
                    return 0;
                }
            }
        }

        return olen; // return number of matched elements
    },
    CacheElements: function(){
        var css = '', len, v, i;

        if( !this._elements ){

            len = this.elements.length;
            for(i = 0; i < len; i++){

                v = this.elements[i];
                css += v.combinator.value;

                if( !v.value.value ){
                    css += v.value;
                    continue;
                }

                if( typeof v.value.value !== "string" ){
                    css = '';
                    break;
                }
                css += v.value.value;
            }

            this._elements = css.match(/[,&#\.\w-]([\w-]|(\\.))*/g);

            if (this._elements) {
                if (this._elements[0] === "&") {
                    this._elements.shift();
                }

            } else {
                this._elements = [];
            }

        }
    },
    isJustParentSelector: function() {
        return !this.mediaEmpty && 
            this.elements.length === 1 && 
            this.elements[0].value === '&' && 
            (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
    },
    eval: function (env) {
        var evaldCondition = this.condition && this.condition.eval(env),
            elements = this.elements, extendList = this.extendList;

        elements = elements && elements.map(function (e) { return e.eval(env); });
        extendList = extendList && extendList.map(function(extend) { return extend.eval(env); });

        return this.createDerived(elements, extendList, evaldCondition);
    },
    genCSS: function (env, output) {
        var i, element;
        if ((!env || !env.firstSelector) && this.elements[0].combinator.value === "") {
            output.add(' ', this.currentFileInfo, this.index);
        }
        if (!this._css) {
            //TODO caching? speed comparison?
            for(i = 0; i < this.elements.length; i++) {
                element = this.elements[i];
                element.genCSS(env, output);
            }
        }
    },
    toCSS: tree.toCSS,
    markReferenced: function () {
        this.isReferenced = true;
    },
    getIsReferenced: function() {
        return !this.currentFileInfo.reference || this.isReferenced;
    },
    getIsOutput: function() {
        return this.evaldCondition;
    }
};

})(require('../tree'));

(function (tree) {

tree.UnicodeDescriptor = function (value) {
    this.value = value;
};
tree.UnicodeDescriptor.prototype = {
    type: "UnicodeDescriptor",
    genCSS: function (env, output) {
        output.add(this.value);
    },
    toCSS: tree.toCSS,
    eval: function () { return this; }
};

})(require('../tree'));

(function (tree) {

tree.URL = function (val, currentFileInfo, isEvald) {
    this.value = val;
    this.currentFileInfo = currentFileInfo;
    this.isEvald = isEvald;
};
tree.URL.prototype = {
    type: "Url",
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    genCSS: function (env, output) {
        output.add("url(");
        this.value.genCSS(env, output);
        output.add(")");
    },
    toCSS: tree.toCSS,
    eval: function (ctx) {
        var val = this.value.eval(ctx),
            rootpath;

        if (!this.isEvald) {
            // Add the base path if the URL is relative
            rootpath = this.currentFileInfo && this.currentFileInfo.rootpath;
            if (rootpath && typeof val.value === "string" && ctx.isPathRelative(val.value)) {
                if (!val.quote) {
                    rootpath = rootpath.replace(/[\(\)'"\s]/g, function(match) { return "\\"+match; });
                }
                val.value = rootpath + val.value;
            }
            
            val.value = ctx.normalizePath(val.value);

            // Add url args if enabled
            if (ctx.urlArgs) {
                if (!val.value.match(/^\s*data:/)) {
                    var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
                    var urlArgs = delimiter + ctx.urlArgs;
                    if (val.value.indexOf('#') !== -1) {
                        val.value = val.value.replace('#', urlArgs + '#');
                    } else {
                        val.value += urlArgs;
                    }
                }
            }
        }

        return new(tree.URL)(val, this.currentFileInfo, true);
    }
};

})(require('../tree'));

(function (tree) {

tree.Value = function (value) {
    this.value = value;
};
tree.Value.prototype = {
    type: "Value",
    accept: function (visitor) {
        if (this.value) {
            this.value = visitor.visitArray(this.value);
        }
    },
    eval: function (env) {
        if (this.value.length === 1) {
            return this.value[0].eval(env);
        } else {
            return new(tree.Value)(this.value.map(function (v) {
                return v.eval(env);
            }));
        }
    },
    genCSS: function (env, output) {
        var i;
        for(i = 0; i < this.value.length; i++) {
            this.value[i].genCSS(env, output);
            if (i+1 < this.value.length) {
                output.add((env && env.compress) ? ',' : ', ');
            }
        }
    },
    toCSS: tree.toCSS
};

})(require('../tree'));

(function (tree) {

tree.Variable = function (name, index, currentFileInfo) {
    this.name = name;
    this.index = index;
    this.currentFileInfo = currentFileInfo || {};
};
tree.Variable.prototype = {
    type: "Variable",
    eval: function (env) {
        var variable, name = this.name;

        if (name.indexOf('@@') === 0) {
            name = '@' + new(tree.Variable)(name.slice(1)).eval(env).value;
        }
        
        if (this.evaluating) {
            throw { type: 'Name',
                    message: "Recursive variable definition for " + name,
                    filename: this.currentFileInfo.file,
                    index: this.index };
        }
        
        this.evaluating = true;

        variable = tree.find(env.frames, function (frame) {
            var v = frame.variable(name);
            if (v) {
                return v.value.eval(env);
            }
        });
        if (variable) { 
            this.evaluating = false;
            return variable;
        } else {
            throw { type: 'Name',
                    message: "variable " + name + " is undefined",
                    filename: this.currentFileInfo.filename,
                    index: this.index };
        }
    }
};

})(require('../tree'));

(function (tree) {

    var parseCopyProperties = [
        'paths',            // option - unmodified - paths to search for imports on
        'optimization',     // option - optimization level (for the chunker)
        'files',            // list of files that have been imported, used for import-once
        'contents',         // map - filename to contents of all the files
        'contentsIgnoredChars', // map - filename to lines at the begining of each file to ignore
        'relativeUrls',     // option - whether to adjust URL's to be relative
        'rootpath',         // option - rootpath to append to URL's
        'strictImports',    // option -
        'insecure',         // option - whether to allow imports from insecure ssl hosts
        'dumpLineNumbers',  // option - whether to dump line numbers
        'compress',         // option - whether to compress
        'processImports',   // option - whether to process imports. if false then imports will not be imported
        'syncImport',       // option - whether to import synchronously
        'javascriptEnabled',// option - whether JavaScript is enabled. if undefined, defaults to true
        'mime',             // browser only - mime type for sheet import
        'useFileCache',     // browser only - whether to use the per file session cache
        'currentFileInfo'   // information about the current file - for error reporting and importing and making urls relative etc.
    ];

    //currentFileInfo = {
    //  'relativeUrls' - option - whether to adjust URL's to be relative
    //  'filename' - full resolved filename of current file
    //  'rootpath' - path to append to normal URLs for this node
    //  'currentDirectory' - path to the current file, absolute
    //  'rootFilename' - filename of the base file
    //  'entryPath' - absolute path to the entry file
    //  'reference' - whether the file should not be output and only output parts that are referenced

    tree.parseEnv = function(options) {
        copyFromOriginal(options, this, parseCopyProperties);

        if (!this.contents) { this.contents = {}; }
        if (!this.contentsIgnoredChars) { this.contentsIgnoredChars = {}; }
        if (!this.files) { this.files = {}; }

        if (typeof this.paths === "string") { this.paths = [this.paths]; }

        if (!this.currentFileInfo) {
            var filename = (options && options.filename) || "input";
            var entryPath = filename.replace(/[^\/\\]*$/, "");
            if (options) {
                options.filename = null;
            }
            this.currentFileInfo = {
                filename: filename,
                relativeUrls: this.relativeUrls,
                rootpath: (options && options.rootpath) || "",
                currentDirectory: entryPath,
                entryPath: entryPath,
                rootFilename: filename
            };
        }
    };

    var evalCopyProperties = [
        'silent',         // whether to swallow errors and warnings
        'verbose',        // whether to log more activity
        'compress',       // whether to compress
        'yuicompress',    // whether to compress with the outside tool yui compressor
        'ieCompat',       // whether to enforce IE compatibility (IE8 data-uri)
        'strictMath',     // whether math has to be within parenthesis
        'strictUnits',    // whether units need to evaluate correctly
        'cleancss',       // whether to compress with clean-css
        'sourceMap',      // whether to output a source map
        'importMultiple', // whether we are currently importing multiple copies
        'urlArgs'         // whether to add args into url tokens
        ];

    tree.evalEnv = function(options, frames) {
        copyFromOriginal(options, this, evalCopyProperties);

        this.frames = frames || [];
    };

    tree.evalEnv.prototype.inParenthesis = function () {
        if (!this.parensStack) {
            this.parensStack = [];
        }
        this.parensStack.push(true);
    };

    tree.evalEnv.prototype.outOfParenthesis = function () {
        this.parensStack.pop();
    };

    tree.evalEnv.prototype.isMathOn = function () {
        return this.strictMath ? (this.parensStack && this.parensStack.length) : true;
    };

    tree.evalEnv.prototype.isPathRelative = function (path) {
        return !/^(?:[a-z-]+:|\/)/.test(path);
    };

    tree.evalEnv.prototype.normalizePath = function( path ) {
        var
          segments = path.split("/").reverse(),
          segment;

        path = [];
        while (segments.length !== 0 ) {
            segment = segments.pop();
            switch( segment ) {
                case ".":
                    break;
                case "..":
                    if ((path.length === 0) || (path[path.length - 1] === "..")) {
                        path.push( segment );
                    } else {
                        path.pop();
                    }
                    break;
                default:
                    path.push( segment );
                    break;
            }
        }

        return path.join("/");
    };

    //todo - do the same for the toCSS env
    //tree.toCSSEnv = function (options) {
    //};

    var copyFromOriginal = function(original, destination, propertiesToCopy) {
        if (!original) { return; }

        for(var i = 0; i < propertiesToCopy.length; i++) {
            if (original.hasOwnProperty(propertiesToCopy[i])) {
                destination[propertiesToCopy[i]] = original[propertiesToCopy[i]];
            }
        }
    };

})(require('./tree'));

(function (tree) {

    var _visitArgs = { visitDeeper: true },
        _hasIndexed = false;

    function _noop(node) {
        return node;
    }

    function indexNodeTypes(parent, ticker) {
        // add .typeIndex to tree node types for lookup table
        var key, child;
        for (key in parent) {
            if (parent.hasOwnProperty(key)) {
                child = parent[key];
                switch (typeof child) {
                    case "function":
                        // ignore bound functions directly on tree which do not have a prototype
                        // or aren't nodes
                        if (child.prototype && child.prototype.type) {
                            child.prototype.typeIndex = ticker++;
                        }
                        break;
                    case "object":
                        ticker = indexNodeTypes(child, ticker);
                        break;
                }
            }
        }
        return ticker;
    }

    tree.visitor = function(implementation) {
        this._implementation = implementation;
        this._visitFnCache = [];

        if (!_hasIndexed) {
            indexNodeTypes(tree, 1);
            _hasIndexed = true;
        }
    };

    tree.visitor.prototype = {
        visit: function(node) {
            if (!node) {
                return node;
            }

            var nodeTypeIndex = node.typeIndex;
            if (!nodeTypeIndex) {
                return node;
            }

            var visitFnCache = this._visitFnCache,
                impl = this._implementation,
                aryIndx = nodeTypeIndex << 1,
                outAryIndex = aryIndx | 1,
                func = visitFnCache[aryIndx],
                funcOut = visitFnCache[outAryIndex],
                visitArgs = _visitArgs,
                fnName;

            visitArgs.visitDeeper = true;

            if (!func) {
                fnName = "visit" + node.type;
                func = impl[fnName] || _noop;
                funcOut = impl[fnName + "Out"] || _noop;
                visitFnCache[aryIndx] = func;
                visitFnCache[outAryIndex] = funcOut;
            }

            if (func !== _noop) {
                var newNode = func.call(impl, node, visitArgs);
                if (impl.isReplacing) {
                    node = newNode;
                }
            }

            if (visitArgs.visitDeeper && node && node.accept) {
                node.accept(this);
            }

            if (funcOut != _noop) {
                funcOut.call(impl, node);
            }

            return node;
        },
        visitArray: function(nodes, nonReplacing) {
            if (!nodes) {
                return nodes;
            }

            var cnt = nodes.length, i;

            // Non-replacing
            if (nonReplacing || !this._implementation.isReplacing) {
                for (i = 0; i < cnt; i++) {
                    this.visit(nodes[i]);
                }
                return nodes;
            }

            // Replacing
            var out = [];
            for (i = 0; i < cnt; i++) {
                var evald = this.visit(nodes[i]);
                if (!evald.splice) {
                    out.push(evald);
                } else if (evald.length) {
                    this.flatten(evald, out);
                }
            }
            return out;
        },
        flatten: function(arr, out) {
            if (!out) {
                out = [];
            }

            var cnt, i, item,
                nestedCnt, j, nestedItem;

            for (i = 0, cnt = arr.length; i < cnt; i++) {
                item = arr[i];
                if (!item.splice) {
                    out.push(item);
                    continue;
                }

                for (j = 0, nestedCnt = item.length; j < nestedCnt; j++) {
                    nestedItem = item[j];
                    if (!nestedItem.splice) {
                        out.push(nestedItem);
                    } else if (nestedItem.length) {
                        this.flatten(nestedItem, out);
                    }
                }
            }

            return out;
        }
    };

})(require('./tree'));
(function (tree) {
    tree.importVisitor = function(importer, finish, evalEnv, onceFileDetectionMap, recursionDetector) {
        this._visitor = new tree.visitor(this);
        this._importer = importer;
        this._finish = finish;
        this.env = evalEnv || new tree.evalEnv();
        this.importCount = 0;
        this.onceFileDetectionMap = onceFileDetectionMap || {};
        this.recursionDetector = {};
        if (recursionDetector) {
            for(var fullFilename in recursionDetector) {
                if (recursionDetector.hasOwnProperty(fullFilename)) {
                    this.recursionDetector[fullFilename] = true;
                }
            }
        }
    };

    tree.importVisitor.prototype = {
        isReplacing: true,
        run: function (root) {
            var error;
            try {
                // process the contents
                this._visitor.visit(root);
            }
            catch(e) {
                error = e;
            }

            this.isFinished = true;

            if (this.importCount === 0) {
                this._finish(error);
            }
        },
        visitImport: function (importNode, visitArgs) {
            var importVisitor = this,
                evaldImportNode,
                inlineCSS = importNode.options.inline;
            
            if (!importNode.css || inlineCSS) {

                try {
                    evaldImportNode = importNode.evalForImport(this.env);
                } catch(e){
                    if (!e.filename) { e.index = importNode.index; e.filename = importNode.currentFileInfo.filename; }
                    // attempt to eval properly and treat as css
                    importNode.css = true;
                    // if that fails, this error will be thrown
                    importNode.error = e;
                }

                if (evaldImportNode && (!evaldImportNode.css || inlineCSS)) {
                    importNode = evaldImportNode;
                    this.importCount++;
                    var env = new tree.evalEnv(this.env, this.env.frames.slice(0));

                    if (importNode.options.multiple) {
                        env.importMultiple = true;
                    }

                    this._importer.push(importNode.getPath(), importNode.currentFileInfo, importNode.options, function (e, root, importedAtRoot, fullPath) {
                        if (e && !e.filename) { e.index = importNode.index; e.filename = importNode.currentFileInfo.filename; }

                        if (!env.importMultiple) { 
                            if (importedAtRoot) {
                                importNode.skip = true;
                            } else {
                                importNode.skip = function() {
                                    if (fullPath in importVisitor.onceFileDetectionMap) {
                                        return true;
                                    }
                                    importVisitor.onceFileDetectionMap[fullPath] = true;
                                    return false;
                                }; 
                            }
                        }

                        var subFinish = function(e) {
                            importVisitor.importCount--;

                            if (importVisitor.importCount === 0 && importVisitor.isFinished) {
                                importVisitor._finish(e);
                            }
                        };

                        if (root) {
                            importNode.root = root;
                            importNode.importedFilename = fullPath;
                            var duplicateImport = importedAtRoot || fullPath in importVisitor.recursionDetector;

                            if (!inlineCSS && (env.importMultiple || !duplicateImport)) {
                                importVisitor.recursionDetector[fullPath] = true;
                                new(tree.importVisitor)(importVisitor._importer, subFinish, env, importVisitor.onceFileDetectionMap, importVisitor.recursionDetector)
                                    .run(root);
                                return;
                            }
                        }

                        subFinish();
                    });
                }
            }
            visitArgs.visitDeeper = false;
            return importNode;
        },
        visitRule: function (ruleNode, visitArgs) {
            visitArgs.visitDeeper = false;
            return ruleNode;
        },
        visitDirective: function (directiveNode, visitArgs) {
            this.env.frames.unshift(directiveNode);
            return directiveNode;
        },
        visitDirectiveOut: function (directiveNode) {
            this.env.frames.shift();
        },
        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
            this.env.frames.unshift(mixinDefinitionNode);
            return mixinDefinitionNode;
        },
        visitMixinDefinitionOut: function (mixinDefinitionNode) {
            this.env.frames.shift();
        },
        visitRuleset: function (rulesetNode, visitArgs) {
            this.env.frames.unshift(rulesetNode);
            return rulesetNode;
        },
        visitRulesetOut: function (rulesetNode) {
            this.env.frames.shift();
        },
        visitMedia: function (mediaNode, visitArgs) {
            this.env.frames.unshift(mediaNode.ruleset);
            return mediaNode;
        },
        visitMediaOut: function (mediaNode) {
            this.env.frames.shift();
        }
    };

})(require('./tree'));
(function (tree) {
    tree.joinSelectorVisitor = function() {
        this.contexts = [[]];
        this._visitor = new tree.visitor(this);
    };

    tree.joinSelectorVisitor.prototype = {
        run: function (root) {
            return this._visitor.visit(root);
        },
        visitRule: function (ruleNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },

        visitRuleset: function (rulesetNode, visitArgs) {
            var context = this.contexts[this.contexts.length - 1],
                paths = [], selectors;

            this.contexts.push(paths);

            if (! rulesetNode.root) {
                selectors = rulesetNode.selectors;
                if (selectors) {
                    selectors = selectors.filter(function(selector) { return selector.getIsOutput(); });
                    rulesetNode.selectors = selectors.length ? selectors : (selectors = null);
                    if (selectors) { rulesetNode.joinSelectors(paths, context, selectors); }
                }
                if (!selectors) { rulesetNode.rules = null; }
                rulesetNode.paths = paths;
            }
        },
        visitRulesetOut: function (rulesetNode) {
            this.contexts.length = this.contexts.length - 1;
        },
        visitMedia: function (mediaNode, visitArgs) {
            var context = this.contexts[this.contexts.length - 1];
            mediaNode.rules[0].root = (context.length === 0 || context[0].multiMedia);
        }
    };

})(require('./tree'));
(function (tree) {
    tree.toCSSVisitor = function(env) {
        this._visitor = new tree.visitor(this);
        this._env = env;
    };

    tree.toCSSVisitor.prototype = {
        isReplacing: true,
        run: function (root) {
            return this._visitor.visit(root);
        },

        visitRule: function (ruleNode, visitArgs) {
            if (ruleNode.variable) {
                return [];
            }
            return ruleNode;
        },

        visitMixinDefinition: function (mixinNode, visitArgs) {
            // mixin definitions do not get eval'd - this means they keep state
            // so we have to clear that state here so it isn't used if toCSS is called twice
            mixinNode.frames = [];
            return [];
        },

        visitExtend: function (extendNode, visitArgs) {
            return [];
        },

        visitComment: function (commentNode, visitArgs) {
            if (commentNode.isSilent(this._env)) {
                return [];
            }
            return commentNode;
        },

        visitMedia: function(mediaNode, visitArgs) {
            mediaNode.accept(this._visitor);
            visitArgs.visitDeeper = false;

            if (!mediaNode.rules.length) {
                return [];
            }
            return mediaNode;
        },

        visitDirective: function(directiveNode, visitArgs) {
            if (directiveNode.currentFileInfo.reference && !directiveNode.isReferenced) {
                return [];
            }
            if (directiveNode.name === "@charset") {
                // Only output the debug info together with subsequent @charset definitions
                // a comment (or @media statement) before the actual @charset directive would
                // be considered illegal css as it has to be on the first line
                if (this.charset) {
                    if (directiveNode.debugInfo) {
                        var comment = new tree.Comment("/* " + directiveNode.toCSS(this._env).replace(/\n/g, "")+" */\n");
                        comment.debugInfo = directiveNode.debugInfo;
                        return this._visitor.visit(comment);
                    }
                    return [];
                }
                this.charset = true;
            }
            return directiveNode;
        },

        checkPropertiesInRoot: function(rules) {
            var ruleNode;
            for(var i = 0; i < rules.length; i++) {
                ruleNode = rules[i];
                if (ruleNode instanceof tree.Rule && !ruleNode.variable) {
                    throw { message: "properties must be inside selector blocks, they cannot be in the root.",
                        index: ruleNode.index, filename: ruleNode.currentFileInfo ? ruleNode.currentFileInfo.filename : null};
                }
            }
        },

        visitRuleset: function (rulesetNode, visitArgs) {
            var rule, rulesets = [];
            if (rulesetNode.firstRoot) {
                this.checkPropertiesInRoot(rulesetNode.rules);
            }
            if (! rulesetNode.root) {
                if (rulesetNode.paths) {
                    rulesetNode.paths = rulesetNode.paths
                        .filter(function(p) {
                            var i;
                            if (p[0].elements[0].combinator.value === ' ') {
                                p[0].elements[0].combinator = new(tree.Combinator)('');
                            }
                            for(i = 0; i < p.length; i++) {
                                if (p[i].getIsReferenced() && p[i].getIsOutput()) {
                                    return true;
                                }
                            }
                            return false;
                        });
                }

                // Compile rules and rulesets
                var nodeRules = rulesetNode.rules, nodeRuleCnt = nodeRules ? nodeRules.length : 0;
                for (var i = 0; i < nodeRuleCnt; ) {
                    rule = nodeRules[i];
                    if (rule && rule.rules) {
                        // visit because we are moving them out from being a child
                        rulesets.push(this._visitor.visit(rule));
                        nodeRules.splice(i, 1);
                        nodeRuleCnt--;
                        continue;
                    }
                    i++;
                }
                // accept the visitor to remove rules and refactor itself
                // then we can decide now whether we want it or not
                if (nodeRuleCnt > 0) {
                    rulesetNode.accept(this._visitor);
                } else {
                    rulesetNode.rules = null;
                }
                visitArgs.visitDeeper = false;

                nodeRules = rulesetNode.rules;
                if (nodeRules) {
                    this._mergeRules(nodeRules);
                    nodeRules = rulesetNode.rules;
                }
                if (nodeRules) {
                    this._removeDuplicateRules(nodeRules);
                    nodeRules = rulesetNode.rules;
                }

                // now decide whether we keep the ruleset
                if (nodeRules && nodeRules.length > 0 && rulesetNode.paths.length > 0) {
                    rulesets.splice(0, 0, rulesetNode);
                }
            } else {
                rulesetNode.accept(this._visitor);
                visitArgs.visitDeeper = false;
                if (rulesetNode.firstRoot || (rulesetNode.rules && rulesetNode.rules.length > 0)) {
                    rulesets.splice(0, 0, rulesetNode);
                }
            }
            if (rulesets.length === 1) {
                return rulesets[0];
            }
            return rulesets;
        },

        _removeDuplicateRules: function(rules) {
            if (!rules) { return; }

            // remove duplicates
            var ruleCache = {},
                ruleList, rule, i;

            for(i = rules.length - 1; i >= 0 ; i--) {
                rule = rules[i];
                if (rule instanceof tree.Rule) {
                    if (!ruleCache[rule.name]) {
                        ruleCache[rule.name] = rule;
                    } else {
                        ruleList = ruleCache[rule.name];
                        if (ruleList instanceof tree.Rule) {
                            ruleList = ruleCache[rule.name] = [ruleCache[rule.name].toCSS(this._env)];
                        }
                        var ruleCSS = rule.toCSS(this._env);
                        if (ruleList.indexOf(ruleCSS) !== -1) {
                            rules.splice(i, 1);
                        } else {
                            ruleList.push(ruleCSS);
                        }
                    }
                }
            }
        },

        _mergeRules: function (rules) {
            if (!rules) { return; }

            var groups = {},
                parts,
                rule,
                key;

            for (var i = 0; i < rules.length; i++) {
                rule = rules[i];

                if ((rule instanceof tree.Rule) && rule.merge) {
                    key = [rule.name,
                        rule.important ? "!" : ""].join(",");

                    if (!groups[key]) {
                        groups[key] = [];
                    } else {
                        rules.splice(i--, 1);
                    }

                    groups[key].push(rule);
                }
            }

            Object.keys(groups).map(function (k) {

                function toExpression(values) {
                    return new (tree.Expression)(values.map(function (p) {
                        return p.value;
                    }));
                }

                function toValue(values) {
                    return new (tree.Value)(values.map(function (p) {
                        return p;
                    }));
                }

                parts = groups[k];

                if (parts.length > 1) {
                    rule = parts[0];
                    var spacedGroups = [];
                    var lastSpacedGroup = [];
                    parts.map(function (p) {
                    if (p.merge==="+") {
                        if (lastSpacedGroup.length > 0) {
                                spacedGroups.push(toExpression(lastSpacedGroup));
                            }
                            lastSpacedGroup = [];
                        }
                        lastSpacedGroup.push(p);
                    });
                    spacedGroups.push(toExpression(lastSpacedGroup));
                    rule.value = toValue(spacedGroups);
                }
            });
        }
    };

})(require('./tree'));
(function (tree) {
    /*jshint loopfunc:true */

    tree.extendFinderVisitor = function() {
        this._visitor = new tree.visitor(this);
        this.contexts = [];
        this.allExtendsStack = [[]];
    };

    tree.extendFinderVisitor.prototype = {
        run: function (root) {
            root = this._visitor.visit(root);
            root.allExtends = this.allExtendsStack[0];
            return root;
        },
        visitRule: function (ruleNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitRuleset: function (rulesetNode, visitArgs) {
            if (rulesetNode.root) {
                return;
            }

            var i, j, extend, allSelectorsExtendList = [], extendList;

            // get &:extend(.a); rules which apply to all selectors in this ruleset
            var rules = rulesetNode.rules, ruleCnt = rules ? rules.length : 0;
            for(i = 0; i < ruleCnt; i++) {
                if (rulesetNode.rules[i] instanceof tree.Extend) {
                    allSelectorsExtendList.push(rules[i]);
                    rulesetNode.extendOnEveryPath = true;
                }
            }

            // now find every selector and apply the extends that apply to all extends
            // and the ones which apply to an individual extend
            var paths = rulesetNode.paths;
            for(i = 0; i < paths.length; i++) {
                var selectorPath = paths[i],
                    selector = selectorPath[selectorPath.length - 1],
                    selExtendList = selector.extendList;

                extendList = selExtendList ? selExtendList.slice(0).concat(allSelectorsExtendList)
                                           : allSelectorsExtendList;

                if (extendList) {
                    extendList = extendList.map(function(allSelectorsExtend) {
                        return allSelectorsExtend.clone();
                    });
                }

                for(j = 0; j < extendList.length; j++) {
                    this.foundExtends = true;
                    extend = extendList[j];
                    extend.findSelfSelectors(selectorPath);
                    extend.ruleset = rulesetNode;
                    if (j === 0) { extend.firstExtendOnThisSelectorPath = true; }
                    this.allExtendsStack[this.allExtendsStack.length-1].push(extend);
                }
            }

            this.contexts.push(rulesetNode.selectors);
        },
        visitRulesetOut: function (rulesetNode) {
            if (!rulesetNode.root) {
                this.contexts.length = this.contexts.length - 1;
            }
        },
        visitMedia: function (mediaNode, visitArgs) {
            mediaNode.allExtends = [];
            this.allExtendsStack.push(mediaNode.allExtends);
        },
        visitMediaOut: function (mediaNode) {
            this.allExtendsStack.length = this.allExtendsStack.length - 1;
        },
        visitDirective: function (directiveNode, visitArgs) {
            directiveNode.allExtends = [];
            this.allExtendsStack.push(directiveNode.allExtends);
        },
        visitDirectiveOut: function (directiveNode) {
            this.allExtendsStack.length = this.allExtendsStack.length - 1;
        }
    };

    tree.processExtendsVisitor = function() {
        this._visitor = new tree.visitor(this);
    };

    tree.processExtendsVisitor.prototype = {
        run: function(root) {
            var extendFinder = new tree.extendFinderVisitor();
            extendFinder.run(root);
            if (!extendFinder.foundExtends) { return root; }
            root.allExtends = root.allExtends.concat(this.doExtendChaining(root.allExtends, root.allExtends));
            this.allExtendsStack = [root.allExtends];
            return this._visitor.visit(root);
        },
        doExtendChaining: function (extendsList, extendsListTarget, iterationCount) {
            //
            // chaining is different from normal extension.. if we extend an extend then we are not just copying, altering and pasting
            // the selector we would do normally, but we are also adding an extend with the same target selector
            // this means this new extend can then go and alter other extends
            //
            // this method deals with all the chaining work - without it, extend is flat and doesn't work on other extend selectors
            // this is also the most expensive.. and a match on one selector can cause an extension of a selector we had already processed if
            // we look at each selector at a time, as is done in visitRuleset

            var extendIndex, targetExtendIndex, matches, extendsToAdd = [], newSelector, extendVisitor = this, selectorPath, extend, targetExtend, newExtend;

            iterationCount = iterationCount || 0;

            //loop through comparing every extend with every target extend.
            // a target extend is the one on the ruleset we are looking at copy/edit/pasting in place
            // e.g.  .a:extend(.b) {}  and .b:extend(.c) {} then the first extend extends the second one
            // and the second is the target.
            // the seperation into two lists allows us to process a subset of chains with a bigger set, as is the
            // case when processing media queries
            for(extendIndex = 0; extendIndex < extendsList.length; extendIndex++){
                for(targetExtendIndex = 0; targetExtendIndex < extendsListTarget.length; targetExtendIndex++){

                    extend = extendsList[extendIndex];
                    targetExtend = extendsListTarget[targetExtendIndex];

                    // look for circular references
                    if( extend.parent_ids.indexOf( targetExtend.object_id ) >= 0 ){ continue; }

                    // find a match in the target extends self selector (the bit before :extend)
                    selectorPath = [targetExtend.selfSelectors[0]];
                    matches = extendVisitor.findMatch(extend, selectorPath);

                    if (matches.length) {

                        // we found a match, so for each self selector..
                        extend.selfSelectors.forEach(function(selfSelector) {

                            // process the extend as usual
                            newSelector = extendVisitor.extendSelector(matches, selectorPath, selfSelector);

                            // but now we create a new extend from it
                            newExtend = new(tree.Extend)(targetExtend.selector, targetExtend.option, 0);
                            newExtend.selfSelectors = newSelector;

                            // add the extend onto the list of extends for that selector
                            newSelector[newSelector.length-1].extendList = [newExtend];

                            // record that we need to add it.
                            extendsToAdd.push(newExtend);
                            newExtend.ruleset = targetExtend.ruleset;

                            //remember its parents for circular references
                            newExtend.parent_ids = newExtend.parent_ids.concat(targetExtend.parent_ids, extend.parent_ids);

                            // only process the selector once.. if we have :extend(.a,.b) then multiple
                            // extends will look at the same selector path, so when extending
                            // we know that any others will be duplicates in terms of what is added to the css
                            if (targetExtend.firstExtendOnThisSelectorPath) {
                                newExtend.firstExtendOnThisSelectorPath = true;
                                targetExtend.ruleset.paths.push(newSelector);
                            }
                        });
                    }
                }
            }

            if (extendsToAdd.length) {
                // try to detect circular references to stop a stack overflow.
                // may no longer be needed.
                this.extendChainCount++;
                if (iterationCount > 100) {
                    var selectorOne = "{unable to calculate}";
                    var selectorTwo = "{unable to calculate}";
                    try
                    {
                        selectorOne = extendsToAdd[0].selfSelectors[0].toCSS();
                        selectorTwo = extendsToAdd[0].selector.toCSS();
                    }
                    catch(e) {}
                    throw {message: "extend circular reference detected. One of the circular extends is currently:"+selectorOne+":extend(" + selectorTwo+")"};
                }

                // now process the new extends on the existing rules so that we can handle a extending b extending c ectending d extending e...
                return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd, extendsListTarget, iterationCount+1));
            } else {
                return extendsToAdd;
            }
        },
        visitRule: function (ruleNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitMixinDefinition: function (mixinDefinitionNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitSelector: function (selectorNode, visitArgs) {
            visitArgs.visitDeeper = false;
        },
        visitRuleset: function (rulesetNode, visitArgs) {
            if (rulesetNode.root) {
                return;
            }
            var matches, pathIndex, extendIndex, allExtends = this.allExtendsStack[this.allExtendsStack.length-1], selectorsToAdd = [], extendVisitor = this, selectorPath;

            // look at each selector path in the ruleset, find any extend matches and then copy, find and replace

            for(extendIndex = 0; extendIndex < allExtends.length; extendIndex++) {
                for(pathIndex = 0; pathIndex < rulesetNode.paths.length; pathIndex++) {
                    selectorPath = rulesetNode.paths[pathIndex];

                    // extending extends happens initially, before the main pass
                    if (rulesetNode.extendOnEveryPath) { continue; }
                    var extendList = selectorPath[selectorPath.length-1].extendList;
                    if (extendList && extendList.length) { continue; }

                    matches = this.findMatch(allExtends[extendIndex], selectorPath);

                    if (matches.length) {

                        allExtends[extendIndex].selfSelectors.forEach(function(selfSelector) {
                            selectorsToAdd.push(extendVisitor.extendSelector(matches, selectorPath, selfSelector));
                        });
                    }
                }
            }
            rulesetNode.paths = rulesetNode.paths.concat(selectorsToAdd);
        },
        findMatch: function (extend, haystackSelectorPath) {
            //
            // look through the haystack selector path to try and find the needle - extend.selector
            // returns an array of selector matches that can then be replaced
            //
            var haystackSelectorIndex, hackstackSelector, hackstackElementIndex, haystackElement,
                targetCombinator, i,
                extendVisitor = this,
                needleElements = extend.selector.elements,
                potentialMatches = [], potentialMatch, matches = [];

            // loop through the haystack elements
            for(haystackSelectorIndex = 0; haystackSelectorIndex < haystackSelectorPath.length; haystackSelectorIndex++) {
                hackstackSelector = haystackSelectorPath[haystackSelectorIndex];

                for(hackstackElementIndex = 0; hackstackElementIndex < hackstackSelector.elements.length; hackstackElementIndex++) {

                    haystackElement = hackstackSelector.elements[hackstackElementIndex];

                    // if we allow elements before our match we can add a potential match every time. otherwise only at the first element.
                    if (extend.allowBefore || (haystackSelectorIndex === 0 && hackstackElementIndex === 0)) {
                        potentialMatches.push({pathIndex: haystackSelectorIndex, index: hackstackElementIndex, matched: 0, initialCombinator: haystackElement.combinator});
                    }

                    for(i = 0; i < potentialMatches.length; i++) {
                        potentialMatch = potentialMatches[i];

                        // selectors add " " onto the first element. When we use & it joins the selectors together, but if we don't
                        // then each selector in haystackSelectorPath has a space before it added in the toCSS phase. so we need to work out
                        // what the resulting combinator will be
                        targetCombinator = haystackElement.combinator.value;
                        if (targetCombinator === '' && hackstackElementIndex === 0) {
                            targetCombinator = ' ';
                        }

                        // if we don't match, null our match to indicate failure
                        if (!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value, haystackElement.value) ||
                            (potentialMatch.matched > 0 && needleElements[potentialMatch.matched].combinator.value !== targetCombinator)) {
                            potentialMatch = null;
                        } else {
                            potentialMatch.matched++;
                        }

                        // if we are still valid and have finished, test whether we have elements after and whether these are allowed
                        if (potentialMatch) {
                            potentialMatch.finished = potentialMatch.matched === needleElements.length;
                            if (potentialMatch.finished &&
                                (!extend.allowAfter && (hackstackElementIndex+1 < hackstackSelector.elements.length || haystackSelectorIndex+1 < haystackSelectorPath.length))) {
                                potentialMatch = null;
                            }
                        }
                        // if null we remove, if not, we are still valid, so either push as a valid match or continue
                        if (potentialMatch) {
                            if (potentialMatch.finished) {
                                potentialMatch.length = needleElements.length;
                                potentialMatch.endPathIndex = haystackSelectorIndex;
                                potentialMatch.endPathElementIndex = hackstackElementIndex + 1; // index after end of match
                                potentialMatches.length = 0; // we don't allow matches to overlap, so start matching again
                                matches.push(potentialMatch);
                            }
                        } else {
                            potentialMatches.splice(i, 1);
                            i--;
                        }
                    }
                }
            }
            return matches;
        },
        isElementValuesEqual: function(elementValue1, elementValue2) {
            if (typeof elementValue1 === "string" || typeof elementValue2 === "string") {
                return elementValue1 === elementValue2;
            }
            if (elementValue1 instanceof tree.Attribute) {
                if (elementValue1.op !== elementValue2.op || elementValue1.key !== elementValue2.key) {
                    return false;
                }
                if (!elementValue1.value || !elementValue2.value) {
                    if (elementValue1.value || elementValue2.value) {
                        return false;
                    }
                    return true;
                }
                elementValue1 = elementValue1.value.value || elementValue1.value;
                elementValue2 = elementValue2.value.value || elementValue2.value;
                return elementValue1 === elementValue2;
            }
            elementValue1 = elementValue1.value;
            elementValue2 = elementValue2.value;
            if (elementValue1 instanceof tree.Selector) {
                if (!(elementValue2 instanceof tree.Selector) || elementValue1.elements.length !== elementValue2.elements.length) {
                    return false;
                }
                for(var i = 0; i <elementValue1.elements.length; i++) {
                    if (elementValue1.elements[i].combinator.value !== elementValue2.elements[i].combinator.value) {
                        if (i !== 0 || (elementValue1.elements[i].combinator.value || ' ') !== (elementValue2.elements[i].combinator.value || ' ')) {
                            return false;
                        }
                    }
                    if (!this.isElementValuesEqual(elementValue1.elements[i].value, elementValue2.elements[i].value)) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        extendSelector:function (matches, selectorPath, replacementSelector) {

            //for a set of matches, replace each match with the replacement selector

            var currentSelectorPathIndex = 0,
                currentSelectorPathElementIndex = 0,
                path = [],
                matchIndex,
                selector,
                firstElement,
                match,
                newElements;

            for (matchIndex = 0; matchIndex < matches.length; matchIndex++) {
                match = matches[matchIndex];
                selector = selectorPath[match.pathIndex];
                firstElement = new tree.Element(
                    match.initialCombinator,
                    replacementSelector.elements[0].value,
                    replacementSelector.elements[0].index,
                    replacementSelector.elements[0].currentFileInfo
                );

                if (match.pathIndex > currentSelectorPathIndex && currentSelectorPathElementIndex > 0) {
                    path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
                    currentSelectorPathElementIndex = 0;
                    currentSelectorPathIndex++;
                }

                newElements = selector.elements
                    .slice(currentSelectorPathElementIndex, match.index)
                    .concat([firstElement])
                    .concat(replacementSelector.elements.slice(1));

                if (currentSelectorPathIndex === match.pathIndex && matchIndex > 0) {
                    path[path.length - 1].elements =
                        path[path.length - 1].elements.concat(newElements);
                } else {
                    path = path.concat(selectorPath.slice(currentSelectorPathIndex, match.pathIndex));

                    path.push(new tree.Selector(
                        newElements
                    ));
                }
                currentSelectorPathIndex = match.endPathIndex;
                currentSelectorPathElementIndex = match.endPathElementIndex;
                if (currentSelectorPathElementIndex >= selectorPath[currentSelectorPathIndex].elements.length) {
                    currentSelectorPathElementIndex = 0;
                    currentSelectorPathIndex++;
                }
            }

            if (currentSelectorPathIndex < selectorPath.length && currentSelectorPathElementIndex > 0) {
                path[path.length - 1].elements = path[path.length - 1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex));
                currentSelectorPathIndex++;
            }

            path = path.concat(selectorPath.slice(currentSelectorPathIndex, selectorPath.length));

            return path;
        },
        visitRulesetOut: function (rulesetNode) {
        },
        visitMedia: function (mediaNode, visitArgs) {
            var newAllExtends = mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);
            newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, mediaNode.allExtends));
            this.allExtendsStack.push(newAllExtends);
        },
        visitMediaOut: function (mediaNode) {
            this.allExtendsStack.length = this.allExtendsStack.length - 1;
        },
        visitDirective: function (directiveNode, visitArgs) {
            var newAllExtends = directiveNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1]);
            newAllExtends = newAllExtends.concat(this.doExtendChaining(newAllExtends, directiveNode.allExtends));
            this.allExtendsStack.push(newAllExtends);
        },
        visitDirectiveOut: function (directiveNode) {
            this.allExtendsStack.length = this.allExtendsStack.length - 1;
        }
    };

})(require('./tree'));

(function (tree) {

    tree.sourceMapOutput = function (options) {
        this._css = [];
        this._rootNode = options.rootNode;
        this._writeSourceMap = options.writeSourceMap;
        this._contentsMap = options.contentsMap;
        this._contentsIgnoredCharsMap = options.contentsIgnoredCharsMap;
        this._sourceMapFilename = options.sourceMapFilename;
        this._outputFilename = options.outputFilename;
        this._sourceMapURL = options.sourceMapURL;
        if (options.sourceMapBasepath) {
            this._sourceMapBasepath = options.sourceMapBasepath.replace(/\\/g, '/');
        }
        this._sourceMapRootpath = options.sourceMapRootpath;
        this._outputSourceFiles = options.outputSourceFiles;
        this._sourceMapGeneratorConstructor = options.sourceMapGenerator || require("source-map").SourceMapGenerator;

        if (this._sourceMapRootpath && this._sourceMapRootpath.charAt(this._sourceMapRootpath.length-1) !== '/') {
            this._sourceMapRootpath += '/';
        }

        this._lineNumber = 0;
        this._column = 0;
    };

    tree.sourceMapOutput.prototype.normalizeFilename = function(filename) {
        filename = filename.replace(/\\/g, '/');

        if (this._sourceMapBasepath && filename.indexOf(this._sourceMapBasepath) === 0) {
            filename = filename.substring(this._sourceMapBasepath.length);
            if (filename.charAt(0) === '\\' || filename.charAt(0) === '/') {
               filename = filename.substring(1);
            }
        }
        return (this._sourceMapRootpath || "") + filename;
    };

    tree.sourceMapOutput.prototype.add = function(chunk, fileInfo, index, mapLines) {

        //ignore adding empty strings
        if (!chunk) {
            return;
        }

        var lines,
            sourceLines,
            columns,
            sourceColumns,
            i;

        if (fileInfo) {
            var inputSource = this._contentsMap[fileInfo.filename];
            
            // remove vars/banner added to the top of the file
            if (this._contentsIgnoredCharsMap[fileInfo.filename]) {
                // adjust the index
                index -= this._contentsIgnoredCharsMap[fileInfo.filename];
                if (index < 0) { index = 0; }
                // adjust the source
                inputSource = inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename]);
            }
            inputSource = inputSource.substring(0, index);
            sourceLines = inputSource.split("\n");
            sourceColumns = sourceLines[sourceLines.length-1];
        }

        lines = chunk.split("\n");
        columns = lines[lines.length-1];

        if (fileInfo) {
            if (!mapLines) {
                this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + 1, column: this._column},
                    original: { line: sourceLines.length, column: sourceColumns.length},
                    source: this.normalizeFilename(fileInfo.filename)});
            } else {
                for(i = 0; i < lines.length; i++) {
                    this._sourceMapGenerator.addMapping({ generated: { line: this._lineNumber + i + 1, column: i === 0 ? this._column : 0},
                        original: { line: sourceLines.length + i, column: i === 0 ? sourceColumns.length : 0},
                        source: this.normalizeFilename(fileInfo.filename)});
                }
            }
        }

        if (lines.length === 1) {
            this._column += columns.length;
        } else {
            this._lineNumber += lines.length - 1;
            this._column = columns.length;
        }

        this._css.push(chunk);
    };

    tree.sourceMapOutput.prototype.isEmpty = function() {
        return this._css.length === 0;
    };

    tree.sourceMapOutput.prototype.toCSS = function(env) {
        this._sourceMapGenerator = new this._sourceMapGeneratorConstructor({ file: this._outputFilename, sourceRoot: null });

        if (this._outputSourceFiles) {
            for(var filename in this._contentsMap) {
                if (this._contentsMap.hasOwnProperty(filename))
                {
                    var source = this._contentsMap[filename];
                    if (this._contentsIgnoredCharsMap[filename]) {
                        source = source.slice(this._contentsIgnoredCharsMap[filename]);
                    }
                    this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename), source);
                }
            }
        }

        this._rootNode.genCSS(env, this);

        if (this._css.length > 0) {
            var sourceMapURL,
                sourceMapContent = JSON.stringify(this._sourceMapGenerator.toJSON());

            if (this._sourceMapURL) {
                sourceMapURL = this._sourceMapURL;
            } else if (this._sourceMapFilename) {
                sourceMapURL = this.normalizeFilename(this._sourceMapFilename);
            }

            if (this._writeSourceMap) {
                this._writeSourceMap(sourceMapContent);
            } else {
                sourceMapURL = "data:application/json;base64," + require('./encoder.js').encodeBase64(sourceMapContent);
            }

            if (sourceMapURL) {
                this._css.push("/*# sourceMappingURL=" + sourceMapURL + " */");
            }
        }

        return this._css.join('');
    };

})(require('./tree'));

//
// browser.js - client-side engine
//
/*global less, window, document, XMLHttpRequest, location */

var isFileProtocol = /^(file|chrome(-extension)?|resource|qrc|app):/.test(location.protocol);

less.env = less.env || (location.hostname == '127.0.0.1' ||
                        location.hostname == '0.0.0.0'   ||
                        location.hostname == 'localhost' ||
                        (location.port &&
                          location.port.length > 0)      ||
                        isFileProtocol                   ? 'development'
                                                         : 'production');

var logLevel = {
    debug: 3,
    info: 2,
    errors: 1,
    none: 0
};

// The amount of logging in the javascript console.
// 3 - Debug, information and errors
// 2 - Information and errors
// 1 - Errors
// 0 - None
// Defaults to 2
less.logLevel = typeof(less.logLevel) != 'undefined' ? less.logLevel : (less.env === 'development' ?  logLevel.debug : logLevel.errors);

// Load styles asynchronously (default: false)
//
// This is set to `false` by default, so that the body
// doesn't start loading before the stylesheets are parsed.
// Setting this to `true` can result in flickering.
//
less.async = less.async || false;
less.fileAsync = less.fileAsync || false;

// Interval between watch polls
less.poll = less.poll || (isFileProtocol ? 1000 : 1500);

//Setup user functions
if (less.functions) {
    for(var func in less.functions) {
        if (less.functions.hasOwnProperty(func)) {
            less.tree.functions[func] = less.functions[func];
        }
   }
}

var dumpLineNumbers = /!dumpLineNumbers:(comments|mediaquery|all)/.exec(location.hash);
if (dumpLineNumbers) {
    less.dumpLineNumbers = dumpLineNumbers[1];
}

var typePattern = /^text\/(x-)?less$/;
var cache = null;
var fileCache = {};

function log(str, level) {
    if (typeof(console) !== 'undefined' && less.logLevel >= level) {
        console.log('less: ' + str);
    }
}

function extractId(href) {
    return href.replace(/^[a-z-]+:\/+?[^\/]+/, '' )  // Remove protocol & domain
        .replace(/^\//,                 '' )  // Remove root /
        .replace(/\.[a-zA-Z]+$/,        '' )  // Remove simple extension
        .replace(/[^\.\w-]+/g,          '-')  // Replace illegal characters
        .replace(/\./g,                 ':'); // Replace dots with colons(for valid id)
}

function errorConsole(e, rootHref) {
    var template = '{line} {content}';
    var filename = e.filename || rootHref;
    var errors = [];
    var content = (e.type || "Syntax") + "Error: " + (e.message || 'There is an error in your .less file') +
        " in " + filename + " ";

    var errorline = function (e, i, classname) {
        if (e.extract[i] !== undefined) {
            errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                .replace(/\{class\}/, classname)
                .replace(/\{content\}/, e.extract[i]));
        }
    };

    if (e.extract) {
        errorline(e, 0, '');
        errorline(e, 1, 'line');
        errorline(e, 2, '');
        content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':\n' +
            errors.join('\n');
    } else if (e.stack) {
        content += e.stack;
    }
    log(content, logLevel.errors);
}

function createCSS(styles, sheet, lastModified) {
    // Strip the query-string
    var href = sheet.href || '';

    // If there is no title set, use the filename, minus the extension
    var id = 'less:' + (sheet.title || extractId(href));

    // If this has already been inserted into the DOM, we may need to replace it
    var oldCss = document.getElementById(id);
    var keepOldCss = false;

    // Create a new stylesheet node for insertion or (if necessary) replacement
    var css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    if (sheet.media) {
        css.setAttribute('media', sheet.media);
    }
    css.id = id;

    if (!css.styleSheet) {
        css.appendChild(document.createTextNode(styles));

        // If new contents match contents of oldCss, don't replace oldCss
        keepOldCss = (oldCss !== null && oldCss.childNodes.length > 0 && css.childNodes.length > 0 &&
            oldCss.firstChild.nodeValue === css.firstChild.nodeValue);
    }

    var head = document.getElementsByTagName('head')[0];

    // If there is no oldCss, just append; otherwise, only append if we need
    // to replace oldCss with an updated stylesheet
    if (oldCss === null || keepOldCss === false) {
        var nextEl = sheet && sheet.nextSibling || null;
        if (nextEl) {
            nextEl.parentNode.insertBefore(css, nextEl);
        } else {
            head.appendChild(css);
        }
    }
    if (oldCss && keepOldCss === false) {
        oldCss.parentNode.removeChild(oldCss);
    }

    // For IE.
    // This needs to happen *after* the style element is added to the DOM, otherwise IE 7 and 8 may crash.
    // See http://social.msdn.microsoft.com/Forums/en-US/7e081b65-878a-4c22-8e68-c10d39c2ed32/internet-explorer-crashes-appending-style-element-to-head
    if (css.styleSheet) {
        try {
            css.styleSheet.cssText = styles;
        } catch (e) {
            throw new(Error)("Couldn't reassign styleSheet.cssText.");
        }
    }

    // Don't update the local store if the file wasn't modified
    if (lastModified && cache) {
        log('saving ' + href + ' to cache.', logLevel.info);
        try {
            cache.setItem(href, styles);
            cache.setItem(href + ':timestamp', lastModified);
        } catch(e) {
            //TODO - could do with adding more robust error handling
            log('failed to save', logLevel.errors);
        }
    }
}

function postProcessCSS(styles) {
    if (less.postProcessor && typeof less.postProcessor === 'function') {
        styles = less.postProcessor.call(styles, styles) || styles;
    }
    return styles;
}

function errorHTML(e, rootHref) {
    var id = 'less-error-message:' + extractId(rootHref || "");
    var template = '<li><label>{line}</label><pre class="{class}">{content}</pre></li>';
    var elem = document.createElement('div'), timer, content, errors = [];
    var filename = e.filename || rootHref;
    var filenameNoPath = filename.match(/([^\/]+(\?.*)?)$/)[1];

    elem.id        = id;
    elem.className = "less-error-message";

    content = '<h3>'  + (e.type || "Syntax") + "Error: " + (e.message || 'There is an error in your .less file') +
        '</h3>' + '<p>in <a href="' + filename   + '">' + filenameNoPath + "</a> ";

    var errorline = function (e, i, classname) {
        if (e.extract[i] !== undefined) {
            errors.push(template.replace(/\{line\}/, (parseInt(e.line, 10) || 0) + (i - 1))
                .replace(/\{class\}/, classname)
                .replace(/\{content\}/, e.extract[i]));
        }
    };

    if (e.extract) {
        errorline(e, 0, '');
        errorline(e, 1, 'line');
        errorline(e, 2, '');
        content += 'on line ' + e.line + ', column ' + (e.column + 1) + ':</p>' +
            '<ul>' + errors.join('') + '</ul>';
    } else if (e.stack) {
        content += '<br/>' + e.stack.split('\n').slice(1).join('<br/>');
    }
    elem.innerHTML = content;

    // CSS for error messages
    createCSS([
        '.less-error-message ul, .less-error-message li {',
        'list-style-type: none;',
        'margin-right: 15px;',
        'padding: 4px 0;',
        'margin: 0;',
        '}',
        '.less-error-message label {',
        'font-size: 12px;',
        'margin-right: 15px;',
        'padding: 4px 0;',
        'color: #cc7777;',
        '}',
        '.less-error-message pre {',
        'color: #dd6666;',
        'padding: 4px 0;',
        'margin: 0;',
        'display: inline-block;',
        '}',
        '.less-error-message pre.line {',
        'color: #ff0000;',
        '}',
        '.less-error-message h3 {',
        'font-size: 20px;',
        'font-weight: bold;',
        'padding: 15px 0 5px 0;',
        'margin: 0;',
        '}',
        '.less-error-message a {',
        'color: #10a',
        '}',
        '.less-error-message .error {',
        'color: red;',
        'font-weight: bold;',
        'padding-bottom: 2px;',
        'border-bottom: 1px dashed red;',
        '}'
    ].join('\n'), { title: 'error-message' });

    elem.style.cssText = [
        "font-family: Arial, sans-serif",
        "border: 1px solid #e00",
        "background-color: #eee",
        "border-radius: 5px",
        "-webkit-border-radius: 5px",
        "-moz-border-radius: 5px",
        "color: #e00",
        "padding: 15px",
        "margin-bottom: 15px"
    ].join(';');

    if (less.env == 'development') {
        timer = setInterval(function () {
            if (document.body) {
                if (document.getElementById(id)) {
                    document.body.replaceChild(elem, document.getElementById(id));
                } else {
                    document.body.insertBefore(elem, document.body.firstChild);
                }
                clearInterval(timer);
            }
        }, 10);
    }
}

function error(e, rootHref) {
    if (!less.errorReporting || less.errorReporting === "html") {
        errorHTML(e, rootHref);
    } else if (less.errorReporting === "console") {
        errorConsole(e, rootHref);
    } else if (typeof less.errorReporting === 'function') {
        less.errorReporting("add", e, rootHref);
    }
}

function removeErrorHTML(path) {
    var node = document.getElementById('less-error-message:' + extractId(path));
    if (node) {
        node.parentNode.removeChild(node);
    }
}

function removeErrorConsole(path) {
    //no action
}

function removeError(path) {
    if (!less.errorReporting || less.errorReporting === "html") {
        removeErrorHTML(path);
    } else if (less.errorReporting === "console") {
        removeErrorConsole(path);
    } else if (typeof less.errorReporting === 'function') {
        less.errorReporting("remove", path);
    }
}

function loadStyles(modifyVars) {
    var styles = document.getElementsByTagName('style'),
        style;
    for (var i = 0; i < styles.length; i++) {
        style = styles[i];
        if (style.type.match(typePattern)) {
            var env = new less.tree.parseEnv(less),
                lessText = style.innerHTML || '';
            env.filename = document.location.href.replace(/#.*$/, '');

            if (modifyVars || less.globalVars) {
                env.useFileCache = true;
            }

            /*jshint loopfunc:true */
            // use closure to store current value of i
            var callback = (function(style) {
                return function (e, cssAST) {
                    if (e) {
                        return error(e, "inline");
                    }
                    var css = cssAST.toCSS(less);
                    style.type = 'text/css';
                    if (style.styleSheet) {
                        style.styleSheet.cssText = css;
                    } else {
                        style.innerHTML = css;
                    }
                };
            })(style);
            new(less.Parser)(env).parse(lessText, callback, {globalVars: less.globalVars, modifyVars: modifyVars});
        }
    }
}

function extractUrlParts(url, baseUrl) {
    // urlParts[1] = protocol&hostname || /
    // urlParts[2] = / if path relative to host base
    // urlParts[3] = directories
    // urlParts[4] = filename
    // urlParts[5] = parameters

    var urlPartsRegex = /^((?:[a-z-]+:)?\/+?(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,
        urlParts = url.match(urlPartsRegex),
        returner = {}, directories = [], i, baseUrlParts;

    if (!urlParts) {
        throw new Error("Could not parse sheet href - '"+url+"'");
    }

    // Stylesheets in IE don't always return the full path
    if (!urlParts[1] || urlParts[2]) {
        baseUrlParts = baseUrl.match(urlPartsRegex);
        if (!baseUrlParts) {
            throw new Error("Could not parse page url - '"+baseUrl+"'");
        }
        urlParts[1] = urlParts[1] || baseUrlParts[1] || "";
        if (!urlParts[2]) {
            urlParts[3] = baseUrlParts[3] + urlParts[3];
        }
    }

    if (urlParts[3]) {
        directories = urlParts[3].replace(/\\/g, "/").split("/");

        // extract out . before .. so .. doesn't absorb a non-directory
        for(i = 0; i < directories.length; i++) {
            if (directories[i] === ".") {
                directories.splice(i, 1);
                i -= 1;
            }
        }

        for(i = 0; i < directories.length; i++) {
            if (directories[i] === ".." && i > 0) {
                directories.splice(i-1, 2);
                i -= 2;
            }
        }
    }

    returner.hostPart = urlParts[1];
    returner.directories = directories;
    returner.path = urlParts[1] + directories.join("/");
    returner.fileUrl = returner.path + (urlParts[4] || "");
    returner.url = returner.fileUrl + (urlParts[5] || "");
    return returner;
}

function pathDiff(url, baseUrl) {
    // diff between two paths to create a relative path

    var urlParts = extractUrlParts(url),
        baseUrlParts = extractUrlParts(baseUrl),
        i, max, urlDirectories, baseUrlDirectories, diff = "";
    if (urlParts.hostPart !== baseUrlParts.hostPart) {
        return "";
    }
    max = Math.max(baseUrlParts.directories.length, urlParts.directories.length);
    for(i = 0; i < max; i++) {
        if (baseUrlParts.directories[i] !== urlParts.directories[i]) { break; }
    }
    baseUrlDirectories = baseUrlParts.directories.slice(i);
    urlDirectories = urlParts.directories.slice(i);
    for(i = 0; i < baseUrlDirectories.length-1; i++) {
        diff += "../";
    }
    for(i = 0; i < urlDirectories.length-1; i++) {
        diff += urlDirectories[i] + "/";
    }
    return diff;
}

function getXMLHttpRequest() {
    if (window.XMLHttpRequest && (window.location.protocol !== "file:" || !("ActiveXObject" in window))) {
        return new XMLHttpRequest();
    } else {
        try {
            /*global ActiveXObject */
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            log("browser doesn't support AJAX.", logLevel.errors);
            return null;
        }
    }
}

function doXHR(url, type, callback, errback) {
    var xhr = getXMLHttpRequest();
    var async = isFileProtocol ? less.fileAsync : less.async;

    if (typeof(xhr.overrideMimeType) === 'function') {
        xhr.overrideMimeType('text/css');
    }
    log("XHR: Getting '" + url + "'", logLevel.debug);
    xhr.open('GET', url, async);
    xhr.setRequestHeader('Accept', type || 'text/x-less, text/css; q=0.9, */*; q=0.5');
    xhr.send(null);

    function handleResponse(xhr, callback, errback) {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.responseText,
                xhr.getResponseHeader("Last-Modified"));
        } else if (typeof(errback) === 'function') {
            errback(xhr.status, url);
        }
    }

    if (isFileProtocol && !less.fileAsync) {
        if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
            callback(xhr.responseText);
        } else {
            errback(xhr.status, url);
        }
    } else if (async) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                handleResponse(xhr, callback, errback);
            }
        };
    } else {
        handleResponse(xhr, callback, errback);
    }
}

function loadFile(originalHref, currentFileInfo, callback, env, modifyVars) {

    if (currentFileInfo && currentFileInfo.currentDirectory && !/^([a-z-]+:)?\//.test(originalHref)) {
        originalHref = currentFileInfo.currentDirectory + originalHref;
    }

    // sheet may be set to the stylesheet for the initial load or a collection of properties including
    // some env variables for imports
    var hrefParts = extractUrlParts(originalHref, window.location.href);
    var href      = hrefParts.url;
    var newFileInfo = {
        currentDirectory: hrefParts.path,
        filename: href
    };

    if (currentFileInfo) {
        newFileInfo.entryPath = currentFileInfo.entryPath;
        newFileInfo.rootpath = currentFileInfo.rootpath;
        newFileInfo.rootFilename = currentFileInfo.rootFilename;
        newFileInfo.relativeUrls = currentFileInfo.relativeUrls;
    } else {
        newFileInfo.entryPath = hrefParts.path;
        newFileInfo.rootpath = less.rootpath || hrefParts.path;
        newFileInfo.rootFilename = href;
        newFileInfo.relativeUrls = env.relativeUrls;
    }

    if (newFileInfo.relativeUrls) {
        if (env.rootpath) {
            newFileInfo.rootpath = extractUrlParts(env.rootpath + pathDiff(hrefParts.path, newFileInfo.entryPath)).path;
        } else {
            newFileInfo.rootpath = hrefParts.path;
        }
    }

    if (env.useFileCache && fileCache[href]) {
        try {
            var lessText = fileCache[href];
            callback(null, lessText, href, newFileInfo, { lastModified: new Date() });
        } catch (e) {
            callback(e, null, href);
        }
        return;
    }

    doXHR(href, env.mime, function (data, lastModified) {
        // per file cache
        fileCache[href] = data;

        // Use remote copy (re-parse)
        try {
            callback(null, data, href, newFileInfo, { lastModified: lastModified });
        } catch (e) {
            callback(e, null, href);
        }
    }, function (status, url) {
        callback({ type: 'File', message: "'" + url + "' wasn't found (" + status + ")" }, null, href);
    });
}

function loadStyleSheet(sheet, callback, reload, remaining, modifyVars) {

    var env = new less.tree.parseEnv(less);
    env.mime = sheet.type;

    if (modifyVars || less.globalVars) {
        env.useFileCache = true;
    }

    loadFile(sheet.href, null, function(e, data, path, newFileInfo, webInfo) {

        if (webInfo) {
            webInfo.remaining = remaining;

            var css       = cache && cache.getItem(path),
                timestamp = cache && cache.getItem(path + ':timestamp');

            if (!reload && timestamp && webInfo.lastModified &&
                (new(Date)(webInfo.lastModified).valueOf() ===
                    new(Date)(timestamp).valueOf())) {
                // Use local copy
                createCSS(css, sheet);
                webInfo.local = true;
                callback(null, null, data, sheet, webInfo, path);
                return;
            }
        }

        //TODO add tests around how this behaves when reloading
        removeError(path);

        if (data) {
            env.currentFileInfo = newFileInfo;
            new(less.Parser)(env).parse(data, function (e, root) {
                if (e) { return callback(e, null, null, sheet); }
                try {
                    callback(e, root, data, sheet, webInfo, path);
                } catch (e) {
                    callback(e, null, null, sheet);
                }
            }, {modifyVars: modifyVars, globalVars: less.globalVars});
        } else {
            callback(e, null, null, sheet, webInfo, path);
        }
    }, env, modifyVars);
}

function loadStyleSheets(callback, reload, modifyVars) {
    for (var i = 0; i < less.sheets.length; i++) {
        loadStyleSheet(less.sheets[i], callback, reload, less.sheets.length - (i + 1), modifyVars);
    }
}

function initRunningMode(){
    if (less.env === 'development') {
        less.optimization = 0;
        less.watchTimer = setInterval(function () {
            if (less.watchMode) {
                loadStyleSheets(function (e, root, _, sheet, env) {
                    if (e) {
                        error(e, sheet.href);
                    } else if (root) {
                        var styles = root.toCSS(less);
                        styles = postProcessCSS(styles);
                        createCSS(styles, sheet, env.lastModified);
                    }
                });
            }
        }, less.poll);
    } else {
        less.optimization = 3;
    }
}



//
// Watch mode
//
less.watch   = function () {
    if (!less.watchMode ){
        less.env = 'development';
         initRunningMode();
    }
    this.watchMode = true;
    return true;
};

less.unwatch = function () {clearInterval(less.watchTimer); this.watchMode = false; return false; };

if (/!watch/.test(location.hash)) {
    less.watch();
}

if (less.env != 'development') {
    try {
        cache = (typeof(window.localStorage) === 'undefined') ? null : window.localStorage;
    } catch (_) {}
}

//
// Get all <link> tags with the 'rel' attribute set to "stylesheet/less"
//
var links = document.getElementsByTagName('link');

less.sheets = [];

for (var i = 0; i < links.length; i++) {
    if (links[i].rel === 'stylesheet/less' || (links[i].rel.match(/stylesheet/) &&
       (links[i].type.match(typePattern)))) {
        less.sheets.push(links[i]);
    }
}

//
// With this function, it's possible to alter variables and re-render
// CSS without reloading less-files
//
less.modifyVars = function(record) {
    less.refresh(false, record);
};

less.refresh = function (reload, modifyVars) {
    var startTime, endTime;
    startTime = endTime = new Date();

    loadStyleSheets(function (e, root, _, sheet, env) {
        if (e) {
            return error(e, sheet.href);
        }
        if (env.local) {
            log("loading " + sheet.href + " from cache.", logLevel.info);
        } else {
            log("parsed " + sheet.href + " successfully.", logLevel.debug);
            var styles = root.toCSS(less);
            styles = postProcessCSS(styles);
            createCSS(styles, sheet, env.lastModified);
        }
        log("css for " + sheet.href + " generated in " + (new Date() - endTime) + 'ms', logLevel.info);
        if (env.remaining === 0) {
            log("less has finished. css generated in " + (new Date() - startTime) + 'ms', logLevel.info);
        }
        endTime = new Date();
    }, reload, modifyVars);

    loadStyles(modifyVars);
};

less.refreshStyles = loadStyles;

less.Parser.fileLoader = loadFile;

less.refresh(less.env === 'development');

// amd.js
//
// Define Less as an AMD module.
if (typeof define === "function" && define.amd) {
    define(function () { return less; } );
}

})(window);

(function() {
	// init Framework Object, contains initial parameters & build informations.
	var Framework = {
		id: 'ui.alien',
		version: '0.1.0',
		name: 'ui.alien',
		author: {"name":"joje","email":"joje.attrs@gmail.com","url":"https://github.com/joje6"},
		repository: {"type":"git","url":"git://github.com/attrs/ui.alien.git"},
		starttime: new Date().getTime(),
		parameters: {
			get: function(key) {
				if( typeof(key) !== 'string' ) return null;
				return Framework.parameters[key];
			},
			set: function(key, value) {
				if( typeof(key) === 'string' ) Framework.parameters[key] = value;
				return Framework.parameters;
			}
		},
		print: function() {
			console.info('* [' + Framework.id + '] info');
			console.info('\tversion: ' + Framework.version );
			console.info('\tcore build: ' + Framework.buildtime + ' ms');
			console.info('\telapsed time to here: ' + (new Date().getTime() - Framework.finishtime) + ' ms');
			console.info('\ttotal elapsed time: ' + (new Date().getTime() - Framework.starttime) + ' ms');
		}
	};

	// extract global options in meta tag
	(function() {
		var argm = document.getElementsByTagName('meta');
		for (var i=0,length=argm.length; i < length; i++) {
			var name = argm[i].name.toLowerCase();
			if( name.startsWith('attrs.ui.') ) {
				name = name.substring(9);
				if( name === 'get' || name === 'set' ) continue;
				var value = argm[i].getAttribute('content').trim();
				Framework.parameters[name] = value;
			}
		}
	})();

	// setup debug object
	var debug = (function(p) {
		return function(category) {
			category = category || '';
			var args = category.split('.');
			if( args ) {
				for(var i=args.length; i >= 1; i--) {
					var c = args.slice(0, i).join('.');
					//console.log('current', c, p['debug.' + c]);
					if( p['debug.' + c] === 'false' ) return false;
					else if( p['debug.' + c] === 'true' ) return true;
				}
			}
		
			return (p['debug'] !== 'true') ? false : true;
		}; 
	})(Framework.parameters);

	if(debug()) console.debug(Framework.name + '[' + Framework.version + '] started with \n' + JSON.stringify(Framework.parameters, null, '\t'));

	// to global use
	var $ = require('attrs.dom');
	var Ajax = require('ajax');
	var Path = require('path');
	var isElement = $.util.isElement;
	var isNode = $.util.isNode;
	
	define('dom', function(module) {
		module.exports = $;
	});
	
	/* debug test
	console.log('ui.controls.html', debug('ui.controls.html') );
	console.log('ui.controls', debug('ui.controls') );
	console.log('ui.context', debug('ui.context') );
	console.log('ui.submodule', debug('ui.submodule') );
	console.log('ui', debug('ui') );
	console.log('all', debug() );
	*/
	
	// start class definitions

var Util = (function() {
	"use strict"

	function merge(o1, o2) {
		if( o1 === null || typeof(o1) !== 'object' ) return null;
		if( o2 === null || typeof(o2) !== 'object' ) return o1;

		if( Array.isArray(o1) && Array.isArray(o2) ) return o1.concat(o2);

		o1 = clone(o1);
		o2 = clone(o2);

		if( o2 ) {
			for(var k in o2) {
				o1[k] = o2[k];
			}
		}

		return o1;
	}

	function clone(o, deep, allprototype) {
		if( o == null || typeof(o) != 'object' ) return o;

		if( Array.isArray(o) ) return o.slice();

		var n = {};
		for(var k in o) {
			if( !o.hasOwnProperty(k) && !allprototype ) continue;
			if( deep === true ) n[k] = clone(o[k]);
			else n[k] = o[k];
		}

		return n;
	}

	function array_removeByItem(arg, item, once) {
		if( !Array.isArray(arg) ) return null;
		
		for(var index;(index = arg.indexOf(item)) >= 0;) {
			arg.splice(index, 1);
			if( once ) break;
		}
		return arg;
	}
	
	function outline(fn) {
		if( typeof(fn) !== 'function' ) return fn;
	
		var o = new (function Static(){});
		for(var k in fn) {
			if( !fn.hasOwnProperty(k) ) continue;
			o[k] = fn[k];
		}
	
		return o;
	}
	
	function camelcase(value, firstlower, delimeter){
		if( !delimeter ) delimeter = '-';
		var result = value.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace(delimeter,'');});
		if( !result ) return result;
		if( firstlower ) return result;
		return result.substring(0,1).toUpperCase() + result.substring(1);
	};
	
	function uncamelcase(value, delimeter){
		if( !delimeter ) delimeter = '-';
		var result = value.replace(/([A-Z])/g, function($1){return (delimeter + $1).toLowerCase();});
		if( value[0] !== '-' && result[0] === '-' ) result = result.substring(1);
		return result;
	};

	function currency(n, f){
		var c, d, t;

		var n = n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	}

	return {
		merge: merge,
		clone: function(o, allprototype) {
			return clone(o, true, allprototype);
		},
		copy: function(o) {
			return clone(o);
		},
		array: {
			removeByItem: array_removeByItem
		},
		currency: currency,
		camelcase: camelcase,
		uncamelcase: uncamelcase,
		outline: outline
	};
})();


/*
var arg = ['1', '2', '3', '4', '3'];
console.log(Util.array.removeByItem(arg, '3'), arg.length);
*/


var Color = (function() {
	"use strict"

	return {
		hexToR : function(h) {return parseInt((this.cutHex(h)).substring(0,2),16)},
		hexToG : function(h) {return parseInt((this.cutHex(h)).substring(2,4),16)},
		hexToB : function(h) {return parseInt((this.cutHex(h)).substring(4,6),16)},
		cutHex : function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h},
		toRGBA : function(h, alpha) {
			if( !h ) return null;
			if( ! alpha ) alpha = 1;
			alpha = parseInt(alpha);
			if( isNaN(alpha) ) alpha = 1;

			//*console.log(h);

			if( typeof(h) == 'object' ) {
				return 'rgba(' + h.r + ',' + h.g + ',' + h.b + ',' + alpha + ')';
			} else if( typeof(h) == 'string' ) {		
				return 'rgba(' + this.hexToR(h) + ',' + this.hexToG(h) + ',' + this.hexToB(h) + ',' + alpha + ')';
			}
		},
		toRGB : function(h) {
			if( !h ) return null;
			return {
				r : this.hexToR(h),
				g : this.hexToG(h),
				b : this.hexToB(h)
			};
		},
		changeAlpha: function(rgba, alpha) {
			if( !rgba ) return null;

			if( rgba.startsWith('#') ) {
				var rgba = toRGB(rgba);
			}

			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
			} else if( rgba.startsWith('rgb(') ) {
				var digits = /(.*?)rgb\((.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
			}

			if( digits ) {
				var r = parseInt(digits[2]);
				var g = parseInt(digits[3]);
				var b = parseInt(digits[4]);

				return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
			}
			return null;
		},
		getAlpha: function(rgba) {
			if( !rgba ) return null;
			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var a = parseFloat(digits[5]);
				return a;
			}
			return null;
		},
		toHex: function(rgba) {
			if( !rgba ) return null;
			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				
				var rgb = blue | (green << 8) | (red << 16);
				return '#' + rgb.toString(16).toUpperCase();
			} else if( rgba.startsWith('rgb(') ) {
				var digits = /(.*?)rgb\((.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				
				var rgb = blue | (green << 8) | (red << 16);
				return '#' + rgb.toString(16).toUpperCase();
			} else if( rgba.startsWith('#') ) {
				return rgba;
			} else {
				return null;
			}
		},
		sumRGB : function(h, r, g, b) {
			if( !h ) return null;
			var a = {
				r : this.hexToR(h) + r,
				g : this.hexToG(h) + g,
				b : this.hexToB(h) + b
			};

			a.r = (a.r <= 255) ? a.r : 255;
			a.g = (a.g <= 255) ? a.g : 255;
			a.b = (a.b <= 255) ? a.b : 255;

			return a;
		},
		sumRGBA : function(h, r, g, b, alpha) {
			if( !h ) return null;
			var a;
			
			if( typeof(h) == 'object' ) {
				a = {
					r : h.r + r,
					g : h.g + g,
					b : h.b + b
				};
			} else if( typeof(h) == 'string' ) {
				a = {
					r : this.hexToR(h) + r,
					g : this.hexToG(h) + g,
					b : this.hexToB(h) + b
				};
			}

			a.r = (a.r <= 255) ? a.r : 255;
			a.g = (a.g <= 255) ? a.g : 255;
			a.b = (a.b <= 255) ? a.b : 255;

			return this.toRGBA(a, alpha);
		}
	};
})();


var EventDispatcher = (function() {	
	"use strict"

	var seq = 100;

	var EventObjectSeq = 1;
	var EventObject = function(o) {
		this.options(o);
	};

	EventObject.prototype = {
		options: function(o) {
			this.timestamp = new Date().getTime();
			this.eventObjectId = EventObjectSeq++;
			this.type = o.type;
			this.cancelable = ((o.cancelable===true) ? true : false);
			this.bubbles = ((o.bubbles===true) ? true : false);
			this.cancelBubble = false;
			this.src = o.src;
			this.returnValue = true;
			this.eventPrevented = false;
			this.values = o.values;
			
			var values = o.values;
			if( values ) {
				if( values.stopPropagation && values.preventDefault ) this.originalEvent = values;
				else this.originalValues = values;

				for(var k in values) {
					if( values.hasOwnProperty && !values.hasOwnProperty(k) ) continue;
					if( !this[k] ) this[k] = values[k];
				}
			}
		},
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
	
	/* 
	 * Class EventDispatcher
	 * 
	 * layout
	 * {
	 *		_options: {},
	 *		_listeners: {},
	 *		_visitor: Function,
	 *		_scope: Object,
	 *		_source: Object,
	 *		__proto__: {
	 *			options: Function(),
	 *			listeners: Function(),
	 *			visitor: Function(),
	 *			scope: Function(),
	 *			source: Function(),
	 *			on: Function(),
	 *			un: Function(),
	 *			has: Function(),
	 *			fire: Function(),
	 *			fireASync: Function(),
	 *			dispatchEvent: Function()
	 *			
	 *		}
	 * }
	 *
	 */
	function EventDispatcher(scope, options) {
		if( scope ) this.scope(scope);
		if( options ) this.options(options);
	}

	EventDispatcher.prototype = {		
		options: function(options) {
			if( !arguments.length ) return this._options;

			if( typeof(options) != 'object' ) throw new Error('options must be a object'); 
			
			this._options = null;
			this._listeners = null;
			this._visitor = null;
			this._scope = null;
			this._source = null;
			this._silent = null;
			this._types = null;

			try {
				delete this._options;
				delete this._listeners;
				delete this._visitor;
				delete this._scope;
				delete this._source;
				delete this._silent;
				delete this._types;
			} catch(e) {}

			this._options = options;
			if( options.listeners ) this.listeners(options.listeners);
			if( options.visitor ) this.visitor(options.visitor);
			if( options.scope ) this.scope(options.scope);
			if( options.source ) this.source(options.source);
			if( options.silent ) this.source(options.silent);
			if( options.types ) this.source(options.types);

			return this;
		},
		silent: function(silent) {
			if( !arguments.length ) return (this._silent) ? true : false;

			if( silent === true ) {
				this._silent = true;
			} else {
				this._silent = false;
			}

			return this;
		},
		types: function(types, flag) {
			var args = this._types;
			if( !arguments.length ) return args;

			if( types === false || types === '*' ) {
				this._types = null;
				return true;
			}

			if( typeof(types) === 'string' ) types = types.split(' ');
			if( !Array.isArray(types) ) console.error('[ERROR] illegal types', types);

			if( flag === false ) {				
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					var index = args.indexOf(type);
					if( ~index ) args = args.splice(index, 1);
				}
			} else {
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					if( type && !~args.indexOf(type) ) args.push(type);
				}
			}

			return this;
		},
		listeners: function(listeners) {
			if( !this._listeners ) this._listeners = {};
			if( !arguments.length ) return this._listeners;

			if( !listeners ) return this;
					
			if( typeof(listeners) !== 'object' ) throw new Error('invalid listeners:' + listeners);
			for(var k in listeners) {
				if( !listeners.hasOwnProperty(k) || k === 'scope' || k === 'visitor' || k === 'source' ) continue;
				
				var handler = listeners[k];
				if( handler && typeof(handler) === 'function' || typeof(handler.handleEvents) === 'function' ) this.on(k, handler);
			}

			return this;
		},
		visitor: function(visitor) {
			if( !arguments.length ) return this._visitor;
			if( !visitor ) return this;
			this._visitor = visitor;
			return this;
		},
		scope: function(scope) {
			if( !arguments.length ) return this._scope || this;
			if( !scope ) return this;
			this._scope = scope;
			return this;
		},
		source: function(source) {
			if( !arguments.length ) return this._source || this.scope();
			if( !source ) return this;
			this._source = source;
			return this;
		},
		
		// actions
		wrap: function(o) {
			var self = this;
			o.on = function() {
				return self.on.apply(self, arguments);
			};
			o.un = function() {
				return self.un.apply(self, arguments);
			};
			o.has = function() {
				return self.has.apply(self, arguments);
			};
			o.fireASync = function() {
				return self.fireASync.apply(self, arguments);
			};
			o.fire = function() {
				return self.fire.apply(self, arguments);
			};
			o.getEventDispatcher = function() {
				return self;
			};

			return this;
		},
		isAllow: function(allow) {
			var types = this.types();
			if( !types ) return true;
			return (~types.indexOf(allow) || ~types.indexOf('*')) ? true : false;
		},
		has: function(action) {
			if( typeof(action) !== 'string' ) throw new Error('invalid action name:' + action);

			var listeners = this.listeners();
			var fns = listeners[action];

			if( fns ) {
				for(var i=0;i < fns.length;i++) {
					var fn = fns[i];
					if( typeof(fn) == 'function' ) {
						return true;
					}
				}
			}

			return false;
		},
		on: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) throw new Error('invalid event type:' + types);
			if( !(typeof(fn) === 'object' || typeof(fn) === 'function') ) throw new Error('invalid event listener:fn=' + fn);
			
			if( capture !== true ) capture = false;
			
			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' ) continue;
				if( !listeners[type] ) listeners[type] = [];

				var items = listeners[type];
				var item = {
					type: type,
					handler: fn,
					capture: capture
				};
				items.push(item);
				this.fire('event.on', item);
			}

			return this;
		},
		un: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) return console.error('[WARN] invalid event type', types);
			if( !fn || !(typeof(fn) === 'object' || typeof(fn) === 'function') ) return console.error('[WARN] invalid event handler', fn);
			
			if( capture !== true ) capture = false;

			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' || !listeners[type] ) continue;
			
				var items = listeners[type];
				for(var x=items.length - 1;x >= 0;x--) {
					var item = items[x];
					if( item && item.type === type && item.handler === fn && item.capture === capture) {
						items[x] = null;
						items = items.splice(x, 1);
						this.fire('event.un', item);
					}
				}
			}

			return this;
		},
		dispatchEvent: function(event, scope) {
			if( this.silent() ) return this;

			if( !(event instanceof EventObject) ) throw new Error('invalid EventObject:' + event);

			var listeners = this.listeners();			
			var global = listeners['*'] || [];
			var items = global.concat(listeners[event.type] || []);
			
			if( items ) {
				for(var i=(items.length - 1);i >= 0;i--) {					
					var item = items[i];
					var handler = item.handler;
					
					var result;
					if( typeof(handler) == 'function' ) {
						result = handler.call(scope || {}, event);
					} else if( typeof(handler) == 'object' && typeof(handler.handleEvent) === 'function' ) {						
						result = handler.handleEvent(event);
					} else {
						console.warn('invalid event listener(bypassed)', handler.toString());
					}
					
					if( result === false ) event.stopPropagation();
					if( event.cancelBubble ) break;
				}
			}

			return this;
		},
		fire: function(action, values, fn) {
			//if( action === 'named' ) console.error('fire', action, values);
			if( typeof(action) !== 'string' ) return null;

			var event = new EventObject({
				values: values || {},
				src: this.source(),
				type: action
			});

			if( this.silent() ) return event;

			var targets = [this];
			var visitor = this.visitor();
			if( event.bubbles ) {
				var p = this.visitor().parent();
				for(;p;) {
					if( typeof(p.eventParent) !== 'function' ) break;
					targets.push(p);
					p = p.eventParent();
				}
			}

			for(var i=0; i < targets.length; i++) {
				var target = targets[i];
				event.target = target;
				
				target.dispatchEvent(event, this.scope());
				if( event.cancelBubble ) break;
			}
			
			if( typeof(fn) === 'function' ) {
				fn.call(this, event);
			} else if( fn ) {
				console.warn('invalid event callback:', action, fn);
			}

			return event;
		},
		fireASync: function(action, values, fn) {
			//if( action === 'named' ) console.error('fire', action, values);
			if( typeof(action) !== 'string' ) return this;

			var self = this;
			setTimeout(function() {
				self.fire(action, values, fn);
			}, 1);

			return this;
		}
	};
	

	return EventDispatcher;
})();



var Options = (function() {
	"use strict"

	function Options(o) {
		for(var k in o) {
			if( o.hasOwnProperty(k) ) {
				this[k] = o[k];
			}
		}
	}

	Options.prototype = {
		set: function(key, value) {
			this[key] = value;
		},
		get: function(key) {
			return this[key];
		},
		toJSON: function() {
			var json = {};
			for(var k in this) {
				if( this.hasOwnProperty(k) ) {
					json[k] = this[k];
				}
			}

			return json;
		}
	};

	return Options;
})();


var Class = (function() {	
	"use strict"
	
	// extract function name
	function fname(f) {
		if( typeof(f) != 'function' ) return null;
		var n = /\W*function\s+([\w\$]+)\(/.exec( f.toString() );
		return (n) ? n[1] : null;
	}

	// copy getter/setter
	function cgs(src, dest, k) {
		var g, s;
		if( src.__lookupGetter__ ) {
			g = src.__lookupGetter__(k);
			s = src.__lookupSetter__(k);
		}

		if ( dest.__defineGetter__ && (g || s) ) {
			//TODO : 같은 애트리뷰트가 상위의 getter/setter 일 수 있으므로... 체크해야 한다.
			if ( g ) dest.__defineGetter__(k, g);
			if ( s ) dest.__defineSetter__(k, s);
			return true;
		} else {
			return false;
		}
	}

	var _ = {}, issuper = false, debug = true;

	var Class = {
		fname: fname,
		inherit: function inherit(clz, sclz, instantiatable) {
			if( typeof(clz) !== 'function' ) throw new TypeError('class must be a function');
			if( sclz && typeof(sclz) !== 'function' ) throw new TypeError('super class must be a function');
			
			//console.log('-- ' + fname(clz));
						
			var attrs = {};
			var constructor = function(a) {
				if( a !== _ ) {
					if( instantiatable === false && !issuper ) throw new TypeError('this class cannot instantiatable');
					// bind $super initializer
					var self = this;
					this.$super = function() {
						issuper = true;
						var r = sclz.apply(self, arguments);
						issuper = false;
						return r;
					};
					
					// bind prototype attributes : ignore if called by $super
					if( !issuper ) {
						for (var k in attrs) {
							this[k] = attrs[k];
						}
					}
					
					// call initializer
					var r = clz.apply(this, arguments);
					try {delete this['$super'];} catch(e) {this['$super'] = null;}
					return r;
				};
			};

			// define cls class
			var cls = function cls() {constructor.apply(this, arguments);}			
			//cls.__meta__ = {};
			
			// for debug
			if( debug ) {
				var name = fname(clz);
				eval('cls = function ' + (name || 'anonymous') + '() {constructor.apply(this, arguments);}');
				//cls.__meta__ = {};
				//cls.__meta__.name = name;
			}

			// inheritance
			if( sclz ) cls.prototype = new sclz(_);
			cls.prototype.constructor = cls;
			
			//cls.__meta__.origin = clz;
			//cls.__meta__.superclass = sclz;
			cls.clone = function() {
				return Class.inherit(clz, sclz, instantiatable);
			};
			cls.superclass = function() {
				return sclz;
			};
			cls.source = function() {
				return clz;	
			};

			// copy prototype
			var proto = clz.prototype;
			for( var k in proto ) {
				if( !proto.hasOwnProperty(k) ) continue;

				if( !cgs(proto, cls, k) ) {
					var v = proto[k];
					
					if( sclz && typeof(v) == 'function' && typeof(sclz.prototype[k]) == 'function' ) {
						cls.prototype[k] = function(name, fn) {
							return function() {
								var self = this;
								var p = this.$super;
								this.$super = function() {
									sclz.prototype[name].apply(self, arguments);
								};
								var r = fn.apply(this, arguments);
								if( p ) {
									this.$super = p;
								} else {
									this.$super = null;
									try {delete this['$super'];} catch(e) {this['$super'] = null;}
								}

								return r;
							};
						}(k, v);
					} else {
						cls.prototype[k] = v;
					}
				}
			}

			// copy static
			for( var k in clz ) {
				if( clz.hasOwnProperty(k) ) if( !cgs(clz, cls, k) ) cls[k] = clz[k];
			}

			// extract attributes
			for( var k in cls.prototype ) {
				var v = cls.prototype[k];
				if( typeof(v) != 'function' ) {
					attrs[k] = v;
				}
			}
			
			return cls;
		}
	};
	
	return Class;
})();



var TagTranslator = (function() {
	"use strict"
	
	var $ = require('attrs.dom');
	
	function isNode(o){
		return (typeof(Node) === "object") ? o instanceof Node : 
			(o && typeof(o.nodeType) === 'number' && typeof(o.nodeName) === 'string');
	}
	
	function TagTranslator(scope) {
		this.translators = {};
		this.scope = scope;
	}
	
	TagTranslator.prototype = {
		add: function(selector, translator) {
			if( arguments.length <= 1 ) return this.translators[selector];
			
			if( typeof(translator) !== 'function' ) return console.error('translator must be a function', selector, translator);
			this.translators[selector] = translator;
			return this;
		},
		translate: function(el) {
			var translators = this.translators;
			
			var scope = this.scope || this;
			for(var selector in translators) {
				if( !translators.hasOwnProperty(selector) ) continue;
				
				var els = Array.prototype.slice.call(el.querySelectorAll(selector));
				var translator = translators[selector];
				
				els.forEach(function(el) {
					var attrs = el.attributes;

					var o = {};
					for(var i=0; i < attrs.length; i++) {
						var name = attrs[i].name;
						var value = attrs[i].value;
						o[name] = value;
					}
					
					var replaced = translator.apply(scope, [el, o]);
					
					return;
					
					//console.log('el', el);
					//console.log('replaced', replaced);
					//console.log('parent', el && el.parentNode);
					
					if( replaced && el !== replaced ) {
						if( !isNode(replaced) ) return console.error('illegal returned node at ', selector, replaced);
						if( typeof(replaced.length) !== 'number' ) replaced = [replaced];
											
						for(var i=0; i < replaced.length; i++) {			
							el.parentNode.insertBefore(replaced[i], el);
						}
						
						el.parentNode.removeChild(el);
					} else if( replaced === false ) {
						el.parentNode.removeChild(el);
					}
				});
			}
		}
	};
	
	return TagTranslator;
})();

/* test 
window.onload = function() {
	var translator = new TagTranslator();
	translator.add('btn', function(el, attrs) {
		console.log('btn', el, attrs);
		
		var div = document.createElement('div');
		div.innerHTML = 'replaced';
		
		var div2 = document.createElement('div');
		div2.innerHTML = 'replaced';
		
		return div;
	});
	
	translator.translate(document.body);
};
*/

var HashController = (function() {
	"use strict"
	
	var handlers = [];

	// singleton
	function HashController() {
	}

	HashController.prototype = {
		current: function() {
			var hash = window.location.hash || '#';
			return hash.substring(1);
		},
		start: function() {
			var self = this;
			if( "onhashchange" in window ) {
				this.listener = function (e) {
					self.invoke();
				};

				if( window.addEventListener ) window.addEventListener("hashchange", this.listener, false);
				else window.attachEvent("hashchange", this.listener);
			} else {
				var current = window.location.hash;
				this.poller = window.setInterval(function () {
					if (window.location.hash != current) {
						current = window.location.hash;
						self.invoke();
					}
				}, 200);
			}
		},
		stop: function() {
			if( this.poller ) window.clearInterval(this.poller);
			if( this.listener ) {
				if( window.removeEventListener ) window.removeEventListener("hashchange", this.listener, false);
				else window.detachEvent("hashchange", this.listener);
			}
		},
		invoke: function() {
			for(var i=0; i < handlers.length; i++) {
				var handler = handlers[i];
				var fn = handler.fn;
				var scope = handler.scope || window;

				if( typeof(fn) === 'object' ) {
					scope = fn;
					fn = fn.onHash;
					if( !fn ) continue;
				}

				//try {
					var hash = window.location.hash || '';
					hash = hash.split('#').join('');

					fn.call(scope, hash, window.location);
				//} catch(err) {
				//	console.error('WARN:exception occured in hash handler', err.message, err, fn, scope);
				//}
			}
		},
		handlers: function() {
			return handlers.slice();
		},
		unregist: function(fn) {
			if( !fn ) return false;
			if( typeof(fn) === 'object' && fn.onHash ) {
				fn = fn.onHash;
			}
			
			var target;
			for(var i=0; i < handlers.length;i++) {
				if( handlers[i] && handlers[i].fn === fn ) {
					target = handlers[i];
				}
			}

			if( !target ) return false;

			handlers.splice(handlers.indexOf(target), 1);
			return true;
		},
		regist: function(fn, scope) {
			if( !fn ) return this;

			handlers.push({
				fn: fn,
				scope: scope
			});

			return this;
		}
	};

	return new HashController();	
})();





var StyleSheetManager = (function() {
	"use strict"
	
	var STYLESHEETS = {};
	
	function StyleSheetManager(name, media) {
		if( !name || typeof(name) !== 'string' ) throw new Error('illegal stylesheet name:' + name);
		
		//this.debug = true;
		this._media = media;
		this._name = name;
		if( STYLESHEETS[this.id()] ) throw new Error('already exists stylesheet name & media');

		this.clear();

		STYLESHEETS[this.id()] = this;
	}

	StyleSheetManager.prototype = {
		id: function() {
			return this.name() + '.' + this.media();
		},
		media: function(media) {
			if( !arguments.length ) return this._media || 'all';

			if( media && typeof(media) !== 'string' ) throw new TypeError('illegal stylesheet media(string):' + media);

			this._media = media;
			return this;
		},
		name: function(name) {
			if( !arguments.length ) return this._name;

			if( !name || typeof(name) !== 'string' ) throw new TypeError('illegal stylesheet name(string):' + name);

			this._name = name;
			return this;
		},
		cssText: function() {
			var css = '';
			var rules = this.rules();
			for(var i=0; i < rules.length; i++) {
				css += rules[i].cssText + '\n';
			}
			return css;
		},
		rules: function() {
			var stylesheet = this.stylesheet;
			return ( stylesheet ) ? (stylesheet.rules || stylesheet.cssRules) : null;
		},
		clear: function() {
			var head = document.head || document.getElementsByTagName('head').item(0);
			var tag = document.createElement('style');
			tag.setAttribute('name', this.name());
			tag.setAttribute('media', this.media());
			tag.setAttribute('type', 'text/css');
			
			var prev = this.tag;
			if( prev ) {
				head.insertBefore(tag, prev);
				head.removeChild(prev);
			} else {
				head.appendChild(tag);
			}

			var stylesheets = document.styleSheets, stylesheet;
			if( stylesheets ) {
				for(var i=0; i < stylesheets.length; i++) {
					if( (stylesheets[i].ownerNode || stylesheets[i].owningElement) === tag )
						stylesheet = stylesheets[i];
				}
			}

			if( !stylesheet ) throw new Error('style tag creation failure');
			this.stylesheet = stylesheet;
			this.tag = tag;

			return this;
		},
		detach: function() {
			if( this.tag ) {
				var head = document.head || document.getElementsByTagName('head').item(0);

				if( this.tag.parentNode === head ) {
					head.removeChild(this.tag);
				}
			}
			return this;
		},
		attach: function(tag, after) {
			if( this.tag ) {
				var head = document.head || document.getElementsByTagName('head').item(0);

				if( this.tag.parentNode === head ) return this;

				if( tag && (tag.tag || tag) ) {
					if( after === true ) head.insertAfter(this.tag, tag.tag || tag);
					else head.insertBefore(this.tag, tag.tag || tag);
				} else {
					head.appendChild(this.tag);
				}
			}
			return this;
		},
		insert: function(accessor, css) {
			if( !accessor ) return console.error('[insert] ' + this.id(), 'invalid accessor', accessor);
			if( !css ) return console.error('[insert] ' + this.id(), 'invalid css', css);
			
			if( css instanceof Style ) css = css.css();
			else if( typeof(css) === 'object' ) css = new Style(css).css();

			var stylesheet = this.stylesheet;
			try {
				if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', stylesheet.cssRules.length);
				else stylesheet.addRule(accessor, css, stylesheet.rules.length);

				if( this.debug ) console.log('[insert] ' + this.id(), '\n' + accessor + ' {\n' + css + '}\n');
			} catch(e) {
				console.error(e.message, '\n' + accessor + ' {\n' + css + '}\n');
			}

			return this;
		},
		update: function(accessor, css) {
			if( !accessor ) return console.error('[update] ' + this.id(), 'invalid accessor', accessor);
			if( !css ) return console.error('[update] ' + this.id(), 'invalid css', css);

			if( css instanceof Style ) css = css.css();
			else if( typeof(css) === 'object' ) css = new Style(css).css();

			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			var updated = false;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', i);
					else stylesheet.addRule(accessor, css, i);

					updated = true;

					if( this.debug ) console.log('[update] ' + this.id(), '\n' + accessor + ' {\n' + css + '}\n');

					break;
				}
			}

			if( !updated ) this.insert(accessor, css);

			return this;
		},
		remove: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);
				}
			}

			if( this.debug ) console.log('[remove] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		removeLast: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					break;
				}
			}

			if( this.debug ) console.log('[removeLast] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		removeFirst: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=0; i < rules.length; i++) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					break;
				}
			}

			if( this.debug ) console.log('[removeFirst] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		visit: function(fn, reverse) {
			function handler(stylesheet, rule) {
				var rules = Array.prototype.slice.call(stylesheet.rules || stylesheet.cssRules || []);
				return {
					stylesheet: stylesheet,
					rule: rule,
					rules: rules,
					update: function(accessor, css) {
						var i = rules.indexOf(rule);
						if( ~i ) {
							if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
							else stylesheet.removeRule(i);

							if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', i);
							else stylesheet.addRule(accessor, css, i);
						} else {
							console.error('[WARN] cannot update rule(not exist):' + rule);
						}
					},
					remove: function() {
						var i = rules.indexOf(rule);
						if( ~i ) {
							if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
							else stylesheet.removeRule(i);
						} else {
							console.error('[WARN] cannot remove rule(not exist):' + rule);
						}
					}
				};
			}

			var stylesheet = this.stylesheet;
			var rules = Array.prototype.slice.call(stylesheet.rules || stylesheet.cssRules || []);
			if( reverse === true ) {
				for(var i=(rules.length - 1); i >= 0; i--) {
					var rule = rules[i].selectorText;
					if( fn.apply(this, handler(stylesheet, rule)) === false ) break;
				}
			} else {
				for(var i=0; i < rules.length; i++) {
					var rule = rules[i].selectorText;
					if( fn.call(this, handler(stylesheet, rule)) === false ) break;
				}
			}

			return this;
		}
	};

	
	var STYLESHEETS = {};
	StyleSheetManager.get = function get(name, media) {
		return STYLESHEETS[name + '.' + (media || 'all')];
	};

	StyleSheetManager.all = function all() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(STYLESHEETS[k]);
		}
		return o;
	};

	StyleSheetManager.ids = function ids() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(k);
		}
		return o;
	};

	StyleSheetManager.names = function ids() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(STYLESHEETS[k].name);
		}
		return o;
	};


	return StyleSheetManager;
})();


var Style = (function() {
	"use strict"

	var calibrator = require('attrs.dom').device.calibrator;

	function parse(s, forceobjectify) {
		s = s.trim();
		if( ~s.indexOf(':') && !~s.indexOf('{') ) {
			var o = s;
			var bracket;

			if( ~s.indexOf('(') && ~s.indexOf(')') ) {
				bracket = s.substring(s.indexOf('('), s.indexOf(')') + 1);
				s = s.split(bracket).join('$bracket$');
			}

			var arg = s.split(';');
			if( arg.length <= 1 && forceobjectify !== true ) {
				if( o.endsWith(';') ) o = o.substring(0, o.lastIndexOf(';'));
				return o;
			}

			var result = {};
			for(var i=0; i < arg.length; i++) {
				var c = arg[i];
				if( !c || !~c.indexOf(':') ) {
					console.error('WARN:detected invalid style item [' + c + '] in ' + o);
					continue;
				}
				
				var pos = c.indexOf(':');
				var key = c.substring(0, pos).trim();
				var value = c.substring(pos + 1).trim();
				if( bracket && value.indexOf('$bracket$') ) value = value.split('$bracket$').join(bracket);

				result[key] = value;
			}

			return result;
		}

		if( s.endsWith(';') ) s = s.substring(0, s.lastIndexOf(';'));

		return s;
	}

	function isPrimitive(value) {
		return (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') ? true : false;
	}

	function joinRule(prefix, rule) {
		if( !rule || typeof(rule) !== 'string' ) throw new TypeError('illegal rule:' + rule);
		
		var rules = rule.split(',');
		var result = [];
		for(var i=0; i < rules.length; i++) {
			var rule = rules[i].trim();
			if( !rule ) continue;

			if( !rule.startsWith('@') ) {
				if( rule.startsWith(':') || rule.startsWith('..') ) rule = prefix + rule.split('..').join('.');
				else if( rule.startsWith('!') ) rule = rule.substring(1) + prefix;
				else rule = prefix + ' ' + rule;
			}

			if( rule ) result.push(rule);
		}

		return result.join(', ');
	}

	// class Style
	var Style = function Style(source) {
		if( typeof(source) !== 'object' ) source = {};

		this._d = new EventDispatcher().scope(this).source(this);

		source = Util.copy(source);
		this.reset(source);
	};
	
	Style.prototype = {
		get: function(rule) {
			if( !arguments.length ) return null;
			return this[rule];
		},
		rules: function(recursive) {
			var arr = [];
			for(var k in this) {
				if( !this.hasOwnProperty(k) || k.startsWith('_') ) continue;
				if( this[k] || isPrimitive(this[k]) ) arr.push(k);	
			}

			return arr;
		},
		clear: function() {
			// delete current elements
			var dispatcher = this._d;
			
			for(var rule in this) {
				if( !this.hasOwnProperty(rule) || rule.startsWith('_') ) continue;
				this[rule] = null;
				try { delete this[rule]; } catch(e) {}
			}

			dispatcher.fire('cleared');
			dispatcher.fire('changed');
			return this;
		},
		reset: function(source) {
			if( !arguments.length || typeof(source) !== 'object' ) return this;
			
			var dispatcher = this._d;
			
			var silent = dispatcher.silent();
			dispatcher.silent(true);

			// clear previous
			this.clear();
			this.set(source);
			dispatcher.silent(silent);

			dispatcher.fire('reset', {source:source});
			dispatcher.fire('changed');
			return this;
		},
		set: function(rule, value, event) {
			var source;

			if( typeof(rule) === 'object' ) {
				source = rule;
			} else if( typeof(rule) === 'string' ) {
				source = {};
				source[rule] = value;
			} else {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}

			var dispatcher = this._d;
			var p = this[rule];

			// bind new elements
			for(var rule in source) {
				if( !source.hasOwnProperty(rule) || rule.startsWith('_') ) continue;
				
				value = source[rule];
				rule = rule.trim();

				// if string, try parse to object
				if( typeof(value) === 'string' ) {
					var force = false;
					if( rule.startsWith('.') || rule.startsWith('#') || rule.startsWith('@') || rule.startsWith(':') || rule.startsWith('[') || ~rule.indexOf('~') || ~rule.indexOf('+') || ~rule.indexOf('>') || ~rule.indexOf(' ') || ~rule.indexOf('*') ) force = true;
					value = parse(value, force);
				}
				
				if( isPrimitive(value) ) {
					this[rule] = value;
				} else if( Array.isArray(value) ) {
					var arr = value;

					for(var i=0; i < arr.length; i++) {
						if( typeof(arr[i]) === 'object' ) {
							var style = arr[i] = new Style(arr[i]);
					
							// bind events
							var fn = function(e) {
								dispatcher.fire('changed', {rule:rule, originalEvent:e.originalEvent || e});
							};
							style.on('changed', fn).__listener__ = fn;
						}
					}

					this[rule] = arr;
				} else if( typeof(value) === 'object' ) {
					var style = new Style(value);
					
					// bind events
					var fn = function(e) {
						dispatcher.fire('changed', {rule:rule, originalEvent:e.originalEvent || e});
					};
					style.on('changed', fn).__listener__ = fn;

					this[rule] = style;
				} else {
					if( !value ) console.warn('style item[' + rule + '] bypassed. illegal value:', value, source);
				}

			}
			
			if( event !== false ) {
				if( p ) dispatcher.fire('replaced', {rule:rule, value:value});
				else dispatcher.fire('added', {rule:rule, value:value});
				dispatcher.fire('changed');
			}
			
			return this;
		},
		merge: function(rule, value, event) {
			if( arguments.length < 2 || !rule || typeof(rule) !== 'string' || rule.startsWith('_') ) {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}
			
			rule = rule.trim();

			var item = this[rule];
			var dispatcher = this._d;
			
			if( !item ) {
				return this.set(rule, value, event);
			} else if( item instanceof Style ) {
				if( typeof(value) !== 'object' ) return this;

				for(var k in value) {
					if( !value.hasOwnProperty(k) || k.startsWith('_') ) continue;
					item.merge(k, value[k], event);
				}
			} else {
				if( Array.isArray(value) ) {
					var arr = value;

					for(var i=0; i < arr.length; i++) {
						var v = arr[i];
						
						if( typeof(v) === 'object' ) {
							v = new Style(v);
						} else if( !isPrimitive(value) ) {
							continue;
						}

						// bind events
						if( v instanceof Style ) {
							var fn = function(e) {
								dispatcher.fire('changed', {rule:rule, originalEvent:e.originalEvent || e});
							};
							style.on('changed', fn).__listener__ = fn;
						}

						item.push(v);
					}

					this[rule] = arr;
				} else if( isPrimitive(value) ) {
					this[rule] = value;
				} else {
					if( !value ) console.warn('style item[' + rule + '] bypassed. illegal value:', value);
				}
			}
			
			if( event !== false ) {
				dispatcher.fire('merged', {rule:rule, value:value});
				dispatcher.fire('changed');
			}

			return this;
		},
		remove: function(rule) {
			if( arguments.length < 1 || !rule || typeof(rule) !== 'string' || rule.startsWith('_') ) {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}

			rule = rule.trim();

			var style = this[rule];
			if( style === null || style === undefined ) return this;
			
			var dispatcher = this._d;

			if( style instanceof Style ) {
				style.un('changed', style.__listener__);
			}

			this[rule] = null;
			try { delete this[rule]; } catch(e) {}

			dispatcher.fire('removed', {rule:rule});
			dispatcher.fire('changed');

			return this;
		},
		css: function() {
			var values;
			for(var key in this) {
				if( !this.hasOwnProperty(key) || key.startsWith('_') || this[key] instanceof Style || key === 'inherit' || key === 'debug' ) continue;
				
				if( !values ) values = {};
				values[key] = this[key];
			}
			
			if( !values ) return '';

			//console.log('css', values);
			var calibrated = calibrator.values(values);
			//console.log(JSON.stringify(calibrated, null, '\t'));
			
			var css = '';
			var merged = calibrated.merged;
			for(var key in merged) {
				var values = merged[key];
				if( !Array.isArray(values) ) values = [values];
				for(var i=0; i < values.length; i++) {
					//if( !isPrimitive(items[i]) ) continue;
					var value = values[i];

					if( key === '!' ) css = '' + value + '\n';
					else css += '\t' + key + ': ' + value + ';\n';
				}				
			}			

			return css;
		},
		build: function(prefix, stylesheet, excludeAtkey) {			
			if( !prefix ) prefix = '';
			if( typeof(prefix) !== 'string' ) throw new Error('invalid style prefix:' + prefix);
			
			prefix = prefix.trim();			
			var css = this.css() || '';
			
			//console.error(prefix);

			//if( prefix.startsWith('@') ) prefix = calibrator.rule(prefix).merged;
			prefix = calibrator.rule(prefix).device;
			
			if( stylesheet && prefix && css ) stylesheet.insert(prefix, css);

			if( css ) css = prefix + ' {\n' + css + '}\n\n';

			//console.log(css);
			
			
			var subcss = '';
			for(var rule in this) {
				if( !this.hasOwnProperty(rule) || rule.startsWith('_') || typeof(this[rule]) !== 'object' ) continue;
				
				var items = this[rule];
				if( !Array.isArray(items) ) items = [items];

				for(var i=0; i < items.length; i++) {
					if( !(items[i] instanceof Style) ) continue;
					if( rule.trim().startsWith('@') && excludeAtkey === true ) continue;
					
					var item = items[i];
					var subprefix = joinRule(prefix, rule);

					subcss += item.build(subprefix, stylesheet, excludeAtkey);
				}
			}

			return css + subcss;
		},
		clone: function() {
			return new Style(JSON.parse(JSON.stringify(this)));
		},
		
		// event dispatcher bridge method
		on: function() {
			return this._d.on.apply(this._d, arguments);
		},
		un: function() {
			return this._d.un.apply(this._d, arguments);
		},
		has: function() {
			return this._d.has.apply(this._d, arguments);
		},
		
		// json interpreter
		toJSON: function() {
			var r = {};
			for(var k in this) {
				if( !this.hasOwnProperty(k) || k.startsWith('_') ) continue;
				if( this[k] || isPrimitive(this[k]) ) r[k] = this[k];		
			}

			return r;
		}
	};

	return Style;
})();


var StyleSystem = (function() {
	"use strict"

	// define style tags
	var style_global = new StyleSheetManager('attrs.ui.global');
	
	
	// global style
	var global = new Style();
	global.on('changed', function(e) {
		style_global.clear();
		global.build('', style_global);
	});

	return {
		stylesheets: StyleSheetManager,
		global: global
	};
})();


var Component = (function() { 
	"use strict"

	var DOM_EVENTS = [
		'click', 'dblclick', 'applicationmenu', 'blur', 'focus', 
		'tap', 'dbltap', 'shorttap', 'longtap',
		'touchstart', 'touchmove', 'touchend', 'touchstop',
		'mouseup', 'mousedown', 'mouseover', 'mousemove', 'mouseout', 'mouseout',
		'keyup', 'keydown', 'mousewheel','orientationchange',
		'drag', 'dragstart', 'drop', 'dragover', 
		'swipeleft', 'swiperight',
		'staged', 'unstaged',
		'transition.start', 'transition.stop', 'transition.end',
		'appended', 'attached', 'dropped', 'detached'
	];
	
	var seq = 100;
	
	// wrapping script text as function for when event listener is script string
	function wrappingevalscript(script) {
		var app = this.application();
		var cmp = this;
		return function(e) {
			return eval(script);
		};
	}
	
	// privates
	function makeup(o) {
		var cls = this.constructor;

		if( o.debug ) this.debug = true;
		
		// if rebuild component
		var el;
		if( this.el ) {
			el = this.el.restore('first').data('component', false);
		} else {
			if( isElement(o.el) ) el = $(o.el);
			else if( !o.el ) el = $.create((o.tag || cls.tag || 'div'));
			else if( el instanceof $ ) el = o.el;
			else throw new TypeError('illegal type "options.el":' + o.el); 
		}
				
		this.el = el.save('first').data('component', this).attr(o.attrs).classes(this.accessor());
				
		// confirm event scope
		var events = o.e || o.events;
		var scope = (events && events.scope) || this;
		if( scope == 'el' ) scope = el;
		else if( scope == 'element' ) scope = el[0];

		// bind event in options
		var dispatcher = this._dispatcher = new EventDispatcher(this, {
			source: (o.e && o.e.source) || this,
			scope: scope
		});

		for(var k in events) {
			var fn = events[k];
			
			if( typeof(fn) === 'string' ) {
				fn = wrappingevalscript.call(this, fn);
			}
			
			if( typeof(fn) === 'function' ) this.on(k, fn);
			else console.warn('[' + this.accessor() + '] illegal type of event listener:', fn);
		}
		
		// setup application & name
		if( o.id ) this.id(o.id);
		if( o.name ) this.name(o.name);
		if( o.origin ) this.origin(o.origin);
		if( o.title ) this.title(o.title);
		if( o.classes || o.class ) this.classes(o.classes || o.class);
		if( o.origin ) this.origin(o.origin);

		// setup status
		if( o.hidden ) el.style('display', 'none');
		if( o.movable ) el.movable(o.movable);
		if( o.enable ) this.enable(o.enable);

		// setup style & dom
		if( o.style ) this.style(o.style);
		if( o.css ) this.css(o.css);
		if( o.theme ) this.theme(o.theme);
		if( o.abs ) this.abs(o.abs);
		//if( o.html ) this.html(o.html);

		// href
		if( o.href ) this.href(o.href);
		
		// bg 와 width height font 에 대해서는 편의적 메소드를 제공하기로...
		if( o.bg || o.background ) el.bg(o.bg || o.background);
		if( o.font ) el.font(o.font);
		if( o.color ) el.color(o.color);
		if( o.flex ) el.flex(o.flex);
		if( o['float'] ) this['float'](o['float']);
		if( o.margin ) el.margin(o.margin);
		if( o.padding ) el.padding(o.padding);
		if( o.border ) el.border(o.border);
		if( o.width || o.width === 0 ) el.width(o.width);
		if( o.minWidth || o.minWidth === 0 ) el.minWidth(o.minWidth);
		if( o.maxWidth || o.maxWidth === 0 ) el.maxWidth(o.maxWidth);
		if( o.height || o.height === 0 ) el.height(o.height);
		if( o.minHeight || o.minHeight === 0 ) el.minHeight(o.minHeight);
		if( o.maxHeight || o.maxHeight === 0 ) el.maxHeight(o.maxHeight);
		
		if( o['min-width'] || o['min-width'] === 0 ) el.minWidth(o['min-width']);
		if( o['max-width'] || o['max-width'] === 0 ) el.maxWidth(o['max-width']);
		if( o['min-height'] || o['min-height'] === 0 ) el.minHeight(o['min-height']);
		if( o['max-height'] || o['max-height'] === 0 ) el.maxHeight(o['max-height']);

		if( o.fit ) el.ac('fit');

		// setup effects options
		if( o.effects ) this.effects(o.effects);
		
		// invoke class's build & options build
		if( typeof(o.before) === 'function' ) o.before.call(this);
		if( typeof(this.build) === 'function' ) this.build();
		if( typeof(o.build) === 'function' ) o.build.call(this);
		if( typeof(o.after) === 'function' ) o.after.call(this);

		// block build method
		this.build = function() { throw new Error('illegal access'); };
	}
	

	// class Component
	function Component(options) {
		this.options = new Options(options);
		makeup.call(this, this.options);
	}

	Component.prototype = {
		rebuild: function(options) {
			if( typeof(options) === 'object' ) this.options = new Options(options);
			makeup.call(this, this.options);
			this.fire('rebuilt');
			return this;
		},
		
		// major attributes
		id: function(id) {
			if( !arguments.length ) return this.el.attr('id');
			this.el.attr('id', id);
			return this;
		},
		name: function(name) {
			if( !arguments.length ) return this.el.attr('name');			
			this.el.attr('name', name);
			return this;
		},
		title: function(title) {
			if( !arguments.length ) return this.el.attr('title');
			this.el.attr('title', title);
			return this;
		},
		
		// application
		concrete: function() {
			return this.constructor;
		},
		application: function() {
			return this.constructor.application();
		},
		origin: function(origin) {
			if( !arguments.length ) return this._origin || this.application().origin();
			
			if( typeof(origin) !== 'string' ) return console.error('invalid origin', origin);
			
			this._origin = Path.join(this.application().origin(), origin);
			return this; 
		},
		base: function() {
			return Path.dir(this.origin());
		},
		path: function(src) {
			return Path.join(this.base(), src);
		},
		
		// selector
		finds: function(selector) {
			return null;			
		},
		find: function(selector) {
			return null;
		},
		
		// attach
		parent: function() {
			return this._parent;
		},
		children: function() {
			var attachTarget = this.attachTarget();
			if( !attachTarget ) return [];
			
			return attachTarget.children;
		},
		acceptable: function() {
			if( typeof(this._acceptable) === 'boolean' ) return this._acceptable;
			return this.concrete().acceptable();
		},
		attachTarget: function(attachTarget) {
			if( !this.acceptable() ) return null;
			if( !arguments.length ) return this._attachTarget || this.dom();
			
			if( isElement(attachTarget) ) this._attachTarget = attachTarget;
			else console.error('illegal attach target, target must be an element', attachTarget);
			return this;
		},
		attach: function(child, index) {
			var target = this.attachTarget();
			if( !target ) return console.error('component cannot acceptable', this);
			
			if( typeof(child) == 'string' || (!(child instanceof Component) && typeof(child.component) === 'string') ) {
				var cmp = this.application().component(child.component);
				if( !cmp ) return console.error('unknown component [' + child.component + ']');
				child = new cmp(child);
			}
			
			var el;
			
			//console.log('attach', child, (child instanceof Component));
			
			if( child instanceof Component ) el = child.dom();
			else if( child instanceof $ ) el = child[0];
			else el = child;
			
			if( !isNode(el) ) return console.error('illegal child type', child);
			
			if( typeof(index) === 'number' ) {
				var ref = target.children(index);
				if( ref.length ) ref.before(el);
				else $(target).append(el);
			} else {
				$(target).append(el);
			}
						
			if( child instanceof Component ) child._parent = this;
			
			return this;
		},
		attachTo: function(target, index) {
			if( !target ) return console.error('attach target must be a component or dom element', target);
			
			if( isElement(target) ) target = $(target);			
			else if( typeof(target) === 'string' ) target = this.application().find(target) || $(target);
			
			if( target instanceof Component ) {
				target.attach(this, index);
			} else if( target instanceof $ ) {
				var el = this.dom();
				
				if( typeof(index) === 'number' ) {
					var ref = target.children(index);
					if( ref.length ) ref.before(el);
					else target.append(el);
				} else { 
					target.append(el);
				}
			} else {
				console.error('illegal target(available only Element or EL or Component)', target);
			}

			return this;
		},
		detach: function() {
			this.el.detach();
			this._parent = null;
			return this;
		},

		// dom control
		dom: function() {
			return this.el[0];
		},
		accessor: function() {
			var themecls = this._theme || '';
			if( themecls ) themecls = ' theme-' + themecls;
			return this.concrete().accessor() + themecls;
		},
		classes: function(classes) {
			var el = this.el;
			
			if( !arguments.length ) {
				var accessor = this.accessor().split(' ');
				
				return el.classes().filter(function(item) {
					return !~accessor.indexOf(item);
				}).join(' ');
			}
			
			el.classes(this.accessor());
			if( classes && typeof(classes) === 'string' ) el.ac(classes);
			return this;
		},
		ac: function(classes) {
			this.el.ac(classes);
			return this;
		},
		rc: function(classes) {
			this.el.rc(classes);
			return this;
		},
		is: function(classes) {
			return this.el.is(classes);
		},
		attr: function() {
			this.el.attr.apply(this.el, arguments);
			return this;
		},		
		theme: function(theme) {
			if( !arguments.length ) return this._theme || '';
			
			var cls = this.classes();
			
			if( typeof(theme) === 'string' ) this._theme = theme;
			else return console.error('invalid theme name', theme);

			this.classes(cls);

			return this;
		},
		style: function(key, value) {
			if( !arguments.length ) return this.el.style();
			if( arguments.length === 1 && typeof(key) === 'string' ) return this.el.style(key);

			this.el.style.apply(this.el, arguments);
			return this;
		},
		css: function(css) {
			var el = this.el;
			var id = el.id();
			var stylesheet = this.application().stylesheet();

			if( !arguments.length ) return id ? stylesheet.get('#' + id) : null;	
			
			if( typeof(css) === 'object' ) {
				id = id || ('gen-' + (this.concrete().id() || 'nemo') + '-' + (seq++));
				el.id(id);
				stylesheet.update('#' + id, css);
				if( css.debug ) console.log('#' + id, stylesheet.build());
			} else if( css === false ) {				
				if( id ) {
					stylesheet.remove(id);
					el.id(false);
				}
			} else {
				console.warn('invalid css', css);
			}

			return this;
		},
		_abs: function(abs) {
			var el = this.el;
			if( !arguments.length ) return el.is('abs');
			
			el.rc('abs').rc('top').rc('right').rc('left').rc('bottom');

			if( abs !== false ) {
				this.el.ac('abs');
			}
			
			if( typeof(abs) === 'string' ) {
				if( ~abs.indexOf('top') ) el.ac('top');
				if( ~abs.indexOf('left') ) el.ac('left');
				if( ~abs.indexOf('right') ) el.ac('right');
				if( ~abs.indexOf('bottom') ) el.ac('bottom');
			}

			return this;
		},
		html: function(html) {
			if( !arguments.length ) return this.el.html();			
			if( typeof(html) === 'string' ) this.el.html(html);
			return this;
		},
		show: function(options, fn) {
			this.el.show(options, fn);
			return this;
		},
		hide: function(options, fn) {
			this.el.hide(options, fn);
			return this;
		},
		anim: function(options, scope) {
			return this.el.anim(options, scope || this);
		},
		effect: function(type, options) {
			var listeners = this._effect_listeners;
			if( !listeners ) listeners = this._effect_listeners = {};

			if( !arguments.length ) return console.error('[WARN] illegal parameters', type, options);
			if( arguments.length === 1 ) return listeners[type];

			if( options === false ) {
				listeners[type] = null;
				try { delete listeners[type]; } catch(e) {}
			}

			if( typeof(options) !== 'object' ) return console.error('[WARN] invalid animation options', options);
			var fn = (function(options) {
				return function(e) {
					this.el.anim().chain(options).run();
				};
			})(options);
			listeners[type] = fn;
			this.on(type, fn);

			return true;
		},
		effects: function(effects) {
			for(var type in effects) {
				this.effect(type, effects[type]);
			}
			return true;
		},
		disable: function(b) {
			return this.enable(b === false ? true : false);
		},
		enable: function(b) {
			var el = this.el;
			if( b === false ) {
				if( !el.is('disabled') ) {
					el.ac('disabled');
					this.fire('disabled');
				}
			} else {
				if( el.is('disabled') ) {
					el.rc('disabled');
					this.fire('enabled');
				}
			}
			return this;
		},
		boundary: function() {
			return this.el.boundary();
		},
		data: function(key, value) {
			var data = this._data;
			if( !arguments.length ) return data;
			else if( arguments.length == 1 ) return data && data[k];

			if( !data ) data = this._data = {};
			data[key] = value;
			return this;
		},

		// href
		action: function(href) {
			if( !href ) return false;

			var href = href.trim();
			if( href.toLowerCase().startsWith('javascript:') ) {
				var script = href.substring(11);
				var self = this;
				(function() {
					var application = self.application();
					var o = eval.call(self, script);
					if( o ) console.log('href script call has result', o);
				})();
			} else if( href.startsWith('this:') ) {
				var path = href.substring(5);
				var application = self.application();
				if( application ) url = application.path(path);
				location.href = path;
			} else {
				location.href = href;
			}

			return true;
		},
		href: function(href) {
			if( !arguments.length ) return this._href;

			this._href = href;
			if( this._hrefhandler ) this.un('click', this._hrefhandler);
			
			if( href && typeof(href) === 'string' ) {
				var self = this;
				this._hrefhandler = function(e) {
					self.action.call(self, self._href);
				};
				this.on('click', this._hrefhandler);
				this.el.ac('clickable');
			} else {
				this.el.rc('clickable');
				this._href = null;
				try { delete this._href; } catch(e) {}
			}

			return this;
		},

		// event handle
		on: function(actions, fn, bubble) {
			if( typeof(actions) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', actions, fn, bubble);
			
			var dispatcher = this._dispatcher;
			if( !dispatcher ) {
				this.options.e = this.options.e || {};
				this.options.e[actions] = fn;
				return this;
			}
			
			actions = actions.split(' ');
			for(var i=0; i < actions.length; i++) {
				var action = actions[i];
				
				// if action is dom element event type, binding events to dom element
				if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action === '*' || action === 'dom.*' ) {
					var type = action.startsWith('dom.') ? action.substring(4) : action;
					var self = this;
					var proxy = function(e) {
						return fn.call(self, e);
					};
					fn.proxy = proxy;
					this.el.on(type, proxy, bubble);
					if( action !== '*' ) return this;
				}
	
				dispatcher.on.apply(dispatcher, arguments);
			}
			
			return this;
		},
		off: function(actions, fn, bubble) {
			if( typeof(actions) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', actions, fn, bubble);
	
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is event dispatcher?');

			actions = actions.split(' ');
			for(var i=0; i < actions.length; i++) {
				var action = actions[i];
				
				if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action == '*' || action == 'el.*' ) {
					var type = action.startsWith('dom.') ? action.substring(4) : action;
					this.el.un(type, fn.proxy || fn, bubble);
					if( action !== '*' ) return this;
				}

				dispatcher.un.apply(dispatcher, arguments);
			}
			
			return this;
		},
		fireASync: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fireASync.apply(d, arguments);
		},
		fire: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fire.apply(d, arguments);
		},

		
		// page mapping by url hash
		hash: function(hash, fn) {
			if( arguments.length === 1 && hash === false ) {
				// 다 지움
				var hashset = this._hashset;
				if( !hashset ) return this;
				
				for(var k in hashset) {
					if( !hashset.hasOwnProperty(k) ) continue;
					
					var fn = hashset[k];
					if( fn ) this.off('hash', fn.listener);
					
					hashset[k] = null;
					try { delete hashset[k]; } catch(e) {}
				}
				
				return this;
			} else if( typeof(hash) === 'string' && fn === false ) {
				// 해당 hash 만 지움
				var hashset = this._hashset;
				if( !hashset ) return this;
				
				var fn = hashset[hash];				
				if( fn ) this.off('hash', fn.listener);
								
				hashset[hash] = null;
				try { delete hashset[hash]; } catch(e) {}
				
				return this;
			} else if( typeof(hash) === 'string' && typeof(fn) === 'function' ) {
				// hash 이벤트 등록
				var hashset = this._hashset;
				if( !hashset ) hashset = this._hashset = {};
				
				var listener = (function(hash, fn) {
					return function(e) {
						if( hash === '*' || e.hash === hash ) return fn.call(this, e);
					};
				})(hash, fn);
				
				fn.listener = listener;
				
				this.on('hash', listener);
				
				return this;
			} else {
				return console.error('illegal parameter', hash, fn);
			}
			
			return this;
		},
		
		// misc		
		toJSON: function() {
			var o = this.options.toJSON();

			var json = {
				component: this.concrete().id()
			};

			for(var k in o) {
				if( o.hasOwnProperty(k) ) json[k] = o[k];
			}

			return json;
		},
		destroy: function() {
			this.detach();
			var name = this.name() || '(unknown)';
			var appid = this.application().id();
			this.el.empty().classes(false).attr(false);
			for(var k in this) {
				if( this.hasOwnProperty(k) ) continue;
				var v = this[k];
				this[k] = null;
				try { delete this[k]; } catch(e) {}
				if( typeof(v) === 'function' ) this[k] = function() {throw new Error(appid + ' ui control [' + name + '] was destroyed.');};
			}
		},
		framework: function framework() {
			return Framework;
		},
		debug: function() {
			var cmp = this;
			var concrete = this.concrete();
			var application = this.application();
			console.log('= Instanceof ' + concrete.id() + ':' + concrete.fname() + ' ======================================');
			
			console.log('- Framework');
			console.log('Framework', Framework);
			
			console.log('- Instance');
			console.log('instance', cmp);
			console.log('instance.framework()', cmp.framework());
			console.log('instance.id()', cmp.id());
			console.log('instance.name()', cmp.name());
			console.log('instance.title()', cmp.title());
			console.log('instance.application()', cmp.application());
			console.log('instance.parent()', cmp.parent());
			console.log('instance.children()', cmp.children());
			console.log('instance.acceptable()', cmp.acceptable());
			console.log('instance.attachTarget()', cmp.attachTarget());
			console.log('instance.base()', cmp.base());
			console.log('instance.path("dir/file.ext")', cmp.path('dir/file.ext'));
			console.log('instance.dom()', cmp.dom());
			console.log('instance.style()', cmp.style());
			console.log('instance.accessor()', cmp.accessor());
			console.log('instance.classes()', cmp.classes());
			
			console.log('\n- concrete');
			console.log('concrete', concrete);
			console.log('concrete.acceptable()', concrete.acceptable());
			console.log('concrete.id()', concrete.id());
			console.log('concrete.fname()', concrete.fname());
			console.log('concrete.accessor()', concrete.accessor());
			console.log('concrete.application()', concrete.application());
			console.log('concrete.style()', concrete.style());
			console.log('concrete.source()', concrete.source());
			
			console.log('\n- application');
			console.log('application', application);
			console.log('application.applicationId()', application.applicationId());
			console.log('application.origin()', application.origin());
			console.log('application.base()', application.base());
			console.log('application.accessor()', application.accessor());
			
			console.log('==============================================');
		}
	};
	
	return Component = Class.inherit(Component);
})();





var Selectable = (function() {
	"use strict"

	function Selectable() {
		this._selected = [];
	}
	
	Selectable.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected.push(item);

			this.fireSync('selected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selectable: function(selectable) {
			if( !arguments.length ) return (this._selectable === false) ? false : true;
			if( selectable === false ) this._selectable = false;
			return this;
		},
		deselect: function(index) {
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;
			
			var e = this.fireSync('deselect', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;
			
			if( !this.selected(item) ) return false;

			this._selected.remove(item);

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(item) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			var index = this.indexOf(item);

			return ~this._selected.indexOf(item);
		}
	};
	
	return Selectable;
})();


var SingleSelectable = (function() {
	"use strict";

	function SingleSelectable() {
	}
	
	SingleSelectable.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			if( this.selected() === item ) return false;
			if( this.selected() ) this.deselect(this.selected());

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected = item;

			this.fireSync('selected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selectable: function(selectable) {
			if( !arguments.length ) return (this._selectable === false) ? false : true;
			if( selectable === false ) this._selectable = false;
			return this;
		},
		deselect: function(index) {
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;
			
			var e = this.fireSync('deselect', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;
			
			if( !this.selected(item) ) return false;

			this._selected = null;

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(index) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			index = this.indexOf(item);

			return (this._selected === item);
		},
		selectedIndex: function(item) {
			if( !this._selected ) return -1;
			return this.indexOf(this._selected);
		},
		prev: function() {
			var i = this.selectedIndex();
			if( i > 0 ) return this.select(i--);
			return false;
		},
		next: function() {
			var i = this.selectedIndex();
			if( i >= 0 && i < (this.length() - 1) ) return this.select(i++);
			return false;
		},
		first: function() {
			return this.select(0);
		},
		last: function() {
			return this.select(this.length());
		}
	};

	return SingleSelectable;
})();


var Container = (function() {
	"use strict"

	// class container
	function Container(options) {
		this._items = [];
		this.$super(options);
	}

	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			// setup selectable
			if( o.selectable ) this.selectable(o.selectable);
			
			// setup options.items
			var fn = function() {
				self.add(o.items);
				self.mark();
			};

			if( o.async === true ) {
				setTimeout(function() {
					fn();
				}, 5);
			} else {
				fn();
			}
		},
		add: function(item, index) {
			if( !item ) return this;
			
			var items = item;
			if( !Array.isArray(items) ) items = [items];
			
			if( index && typeof(index) !== 'number' ) index = this.indexOf(index);
			
			if( index <= 0 ) index = 0;
			else if( index >= this._items.length ) index = this.length() - 1;
			else index = -1;

			if( items ) {
				for(var i=0; i < items.length; i++) {
					var item = items[i];

					if( !item && item !== 0 ) continue;
					
					// evaluation for available to add
					var e = this.fire('add', {
						cancelable: true,
						item: item,
						index: ((index === -1) ? this.length() - 1 : index + 1)
					});
					item = e.item;
					
					// if event prevented or item replaced to null, bypass
					if( e.eventPrevented || item === null || item === undefined ) continue;
															
					if( index === -1 ) {
						this._items.push(item);
					} else {
						var at = index++;
						this._items = this._items.splice(at, 0, item);
					}

					e = this.fire('added', {added:item, index:this.indexOf(item)});
				}
			}

			return this;
		},
		remove: function(index) {
			var item = this.get(index);
			var index = this.indexOf(item);

			if( !item ) return;
			
			this._items = this._items.filter(function(c) {
				return (c === item) ? false : true;
			});
			this.fire('removed', {removed:item, index:index});

			return this;
		},
		clear: function() {
			var items = this._items.slice();
			for(var i=items.length; i >= 0;i--) {
				this.remove(i);
			}

			this.fire('cleared');
			return this;
		},
		items: function(items) {
			if( !arguments.length ) return this._items.slice();
			if( typeof(items) === 'number' ) return this.get(items);

			this.clear();
			
			if( items || items === 0 ) this.add(items);
			return this;
		},
		mark: function(name, flag) {
			if( !arguments.length ) name = 'initial';
			
			if( !this._marks ) this._marks = {};
			if( flag !== false ) {
				this._marks[name] = this._items || false;
			} else {
				this._marks[name] = null;
				try {
					delete this._marks[name];
				} catch(e) {}				
			}

			return this;
		},
		restore: function(mark) {
			if( !this._marks ) return false;
			var source = ( !arguments.length ) ? this._marks['initial'] : this._marks[mark];			
			if( source || source === false ) this.items(source);
			return true;
		},
		get: function(index) {
			if( typeof(index) === 'number' ) return this._items[index];
			index = this._items.indexOf(index);
			if( index >= 0 ) return this._items[index];
			return null;
		},
		contains: function(item) {
			return this._items.contains(item);
		},
		length: function() {
			return this._items.length;
		},
		indexOf: function(item) {
			return this._items.indexOf(item);
		},
		
		// selectable interface
		selectable: function(selectable) {
			if( !arguments.length ) {
				selectable = this._selectable;
				if( !selectable ) return 0;
				else return selectable.selectable.call(this);
			}
			
			if( selectable === false || selectable === 0 ) this._selectable = null;
			else if( selectable === 1 ) this._selectable = SingleSelectable;
			else if( selectable > 0 ) this._selectable = Selectable;
			
			return this;
		},
		select: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.select.apply(this, arguments);
		},
		deselect: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.deselect.apply(this, arguments);
		},
		selected: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.selected.apply(this, arguments);
		},
		selectedIndex: function(item) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.selectedIndex.apply(this, arguments);
		},
		prev: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.prev.apply(this, arguments);
		},
		next: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.next.apply(this, arguments);
		},
		first: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.first.apply(this, arguments);
		},
		last: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.last.apply(this, arguments);
		}
	};

	return Container = Class.inherit(Container, Component);
})();


// convert element's attributes to options
function convert2options(el) {
	var attributes = el.attributes;
	var attrs = {};
	for(var i=0; i < attributes.length; i++) {
		var name = attributes[i].name;
		var value = attributes[i].value;
		
		if( name === 'as' ) continue;
		
		if( name.toLowerCase().startsWith('on') ) {
			var ename = name.substring(2);
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
	return attrs;
}


var Application = (function() {
	"use strict"
	
	var APPLICATIONS = [];
	var seq = 1;
	
	// class Application
	function Application(options) {
		this._cmps = {};
		this._translator = new TagTranslator(this);
		this._themes = new ThemeManager();
		
		this.Component = Application.Component;
		this.Container = Application.Container;
		this.Application = Application.Application;
		
		this._applicationId = 'app-' + ((seq === 1) ? 'x' : seq);
		this._accessor = 'aui ' + this._applicationId;
		
		seq++;
		
		for(var k in BUNDLES.components) {
			this.component(k, BUNDLES.components[k]);
		}
		
		for(var k in BUNDLES.translators) {
			this.tag(k, BUNDLES.translators[k]);
		}
		
		this.options = options = options || {};
		options.src = (typeof(options) === 'string') ? options : options.src;
		options.el = isElement(options) ? options : options.el;
		options.origin = options.origin || options.src || location.href;
		
		this.origin(options.origin);
		
		// validate options
		if( typeof(options.src) === 'string' ) {
			if( Path.uri(options.src) === Path.uri(location.href) ) throw new Error('cannot load current location url', options.src);
			
			var result = require(Path.join(location.href, options.src));
			if( typeof(result) === 'function' ) options.initializer = result;
			else if( typeof(result) === 'object' ) options.items = [result];
			else if( Array.isArray(result) ) options.items = result;
			
			// invoke initializer
			if( options.initializer ) {
				var fn = options.initializer;
				fn.call(fn, this);
			}
		}
		
		this.$super(this.options);
		
		APPLICATIONS.push(this);
		
		this.fire('ready', {application:this});
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
			if( !arguments.length ) return this._origin;
			
			if( typeof(origin) !== 'string' ) return console.error('invalid origin', origin);
			
			this._origin = Path.uri(Path.join(Path.uri(location.href), origin));
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
				var options = convert2options(this);
				options.items = Array.prototype.slice.call(this.childNodes);
				var application = new Application(options);
				$(this).before(application.dom()).detach();
			};
			if( el.is('application') || el.attr('as') === 'application' ) return el.each(fn_application).void();
			else el.find('application, *[as="application"]').each(fn_application);
			
			// remove defines tag
			if( el.is('defines') ) return el.detach().void();
			else el.find('defines').detach();
			
			
			//if( debug('translator') ) console.info('[' + self.applicationId() + '] translation start', el[0]);
			var translator = this._translator;
			//var match = $.util.match;
			var selectors = this.tag();
			
			var tmp = $.create('div').append(el).all().reverse().each(function() {
				for(var selector in selectors) {
					if( $(this).is(selector) || this.getAttribute('as') === selector ) {
					//if( this.tagName.toLowerCase() === selector || this.getAttribute('as') === selector ) {
						var as = this.getAttribute('as');
						var el = this;
						var fn = selectors[selector];
						var options = convert2options(el);
						
						if( as ) {
							options['el'] = el;
							var cmp = self.component(as);
							if( !cmp ) {
								console.error('[' + self.applicationId() + '] component not found', as);
								continue;
							}
							
							new cmp(options);
							
							this.removeAttribute('as');
						} else {
							var cmp = fn.apply(self, [el, options]);
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
			} else if( isNode(source) ) {
				packed = source;
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
			
			if(debug('hash')) console.info('[' + ctx.applicationId() + '] actions', actions);
			
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
	
// autopack
(function() {	
	// auto pack
	var autopack = Framework.parameters['autopack'];
	if( !autopack || autopack.toLowerCase() !== 'false' ) {
		if( debug('ui') ) console.info('[' + Framework.id + '] autopack on');
		
		$.ready(function(e) {
			var appels = $('application, *[as="application"]');
			
			var applications = [];
			appels.each(function() {
				var options = convert2options(this);
				options.items = Array.prototype.slice.call(this.childNodes);
				var application = new Application(options);
				$(this).before(application.dom()).detach();		
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
		});
	});
	
	// invoke current hash after application ready
	$.on('load', function(e) {
		if( debug('hash') ) console.log('hash controller invoke');
		HashController.invoke();
	});
})();




var Theme = (function() {
	"use strict"
	
	// private
	var writeComponentStyleSheet = function(context, style, cmpname, prefix, stylesheet) {
		var cmp = context.component(cmpname);
		if( !cmp || !cmp.accessor ) {
			if( !cmp ) return console.error('WARN:theme css writing warning. component[' + cmpname + '] does not exists. bypassed');
			else return console.error('WARN:component\'s \'accessor\' attribute is not defined.');
		}
		
		style.build(prefix + '.' + cmp.accessor.split(' ').join('.'), stylesheet);
	};
	
	// class theme
	function Theme(context, name, src) {
		if( !(context instanceof Application) ) {
			console.error('[ERROR] invalid context', context);
			throw new Error('invalid context:' + context);
		}

		if( name && (typeof(name) !== 'string' || !/^[-a-zA-Z0-9]+$/.test(name) || name.startsWith('-')) ) throw new Error('illegal theme name:' + name);

		this._name = name || '';
		this._context = context;
		this._styles = {};
		this._stylesheet = new StyleSheetManager('attrs.ui.' + context.id() + ((name) ? '.' + name : ''));
		this._d = new EventDispatcher().scope(this).source(this);

		if( src ) this.src(src);
	};

	Theme.prototype = {
		name: function() {
			return this._name || '';
		},
		context: function() {
			return this._context;
		},
		styles: function() {
			return this._styles;
		},
		stylesheet: function() {
			return this._stylesheet;
		},
		source: function(source) {
			if( !arguments.length ) return this._source;
			
			if( typeof(source) !== 'object' ) return console.error('[ERROR] invalid source', source);
			
			this._source = source;
			this.clear();

			// remove previous component styles
			var styles = this.styles();
			for(var k in styles) {
				if( !styles.hasOwnProperty(k) || k.startsWith('_') ) continue;
				this.remove(k);
			}

			// create new component styles
			for(var k in source) {
				if( !source.hasOwnProperty(k) || k.startsWith('_') ) continue;

				var style = this.component(k);
				if( style ) style.reset(source[k]);
			}
			
			return this;
		},
		src: function(src, async) {
			if( !arguments.length ) return this._src;
			
			if( typeof(src) !== 'string' ) return console.error('[ERROR] invalid src', src);

			if( async && typeof(src) == 'string' ) {
				this._src = src;
				var self = this;
				Require.async(this.context().path(src)).done(function(err, module) {
					if( err ) return console.error('[ERROR] remote theme load fail', src, e.message);
					console.log('theme loaded from', src, module.exports);
					if( module ) self.source(module.exports);
				});
				return this;
			}

			this.source(Require.sync(this.context().path(src)));
			
			return this;
		},
		global: function() {
			return this.component('global');
		},
		component: function(id) {
			if( typeof(id) !== 'string' || !/^[-a-zA-Z0-9_]+$/.test(id) || id.startsWith('-') ) throw new Error('illegal theme component name:' + id);

			var style = this.styles()[id];
			var context = this.context();
			var prefix = this.accessor();
			var stylesheet = this.stylesheet();
						
			if( !style ) {
				style = new Style();
				this.styles()[id] = style;
				
				var accessor = prefix;
				if( id !== 'global' ) {
					var cmp = context.component(id);
					if( !cmp ) return console.warn('[WARN] theme [' + (this.name() || '(default)') + ':' + (this.src() || '(unknown source)') + '] apply failure. [' + id + '] component theme bypassed.', this.source());
					accessor = cmp && cmp.accessor;
					
					if( accessor ) accessor = prefix + '.' + accessor.split(' ').join('.');
					else return console.error('[WARN] component\'s \'accessor\' attribute is not defined.');
				}

				// binding listener
				var dispatcher = this._d;
				var fn = function(e) {
					dispatcher.fireSync('changed', {component:id});
					
					// 기존스타일 제거
					/*stylesheet.visit(function(current) {
						var rule = current.rule;
						//console.log(rule, accessor);
						if( accessor && (rule === accessor || rule.indexOf(accessor + ' ') === 0 || rule.indexOf(accessor + '.') === 0) ) current.remove();
					});*/

					style.build(accessor, stylesheet);
				};
				style.__listener_bytheme__ = fn;
				style.on('changed', fn);
			}

			return style;
		},
		remove: function(id) {
			var style = this.styles()[id];
			if( style ) {
				// remove listener
				style.un('changed', style.__listener_bytheme__);

				this.styles()[id] = null;
				try { delete this.styles()[id]; } catch(e) {}

				this._d.fireSync('removed', {component:id});
			}

			return this;
		},
		accessor: function() {
			var ca = this.context().accessor();
			var name = this.name();
			return (ca ? '.' + ca : '') + (name ? '.theme-' + name : '');
		},
		writeTo: function(stylesheet) {
			if( !stylesheet ) return console.error('[ERROR] missing parameter:stylesheet ');
			var context = this.context();
			var styles = this.styles();
			var prefix = this.accessor();

			for(var cmpname in styles) {
				var cmp = context.component(cmpname);
				var accessor = cmp && cmp.accessor;
				
				if( accessor ) accessor = prefix + '.' + accessor.split(' ').join('.');
				else return console.error('WARN:component\'s \'accessor\' attribute is not defined.');

				styles[cmpname].build(accessor, stylesheet);
			}
		},
		css: function(pretty) {
			var result = '';
			if( pretty === false ) this.writeTo({insert:function(p,c){result += p + ' {' + c + '}';}});
			else this.writeTo({insert:function(p,c){result += p + ' {\n' + c + '\n}\n';}});
			return result;
		},
		clear: function() {
			this._styles = {};
			this.stylesheet().clear();
		},
		refresh: function() {
			this.writeTo(this.stylesheet());
		},
		
		// event dispatcher bridge method
		on: function() {
			return this._d.on.apply(this._d, arguments);
		},
		un: function() {
			return this._d.un.apply(this._d, arguments);
		},
		has: function() {
			return this._d.has.apply(this._d, arguments);
		},
		
		// json interpreter
		clone: function(asname) {
			if( typeof(asname) !== 'string' ) throw new TypeError('illegal clone theme name');
			var source = JSON.parse(JSON.stringify(this));
			source.name = asname;
			return new Theme(source);
		},
		toJSON: function() {
			return this.styles();
		}
	};

	return Theme;
})();



var ThemeManager = (function() {
	"use strict";
	
	function ThemeManager() {
	}
	
	ThemeManager.prototype = {
		current: function(name) {
			if( !arguments.length ) return this._current;
			return true;
		},
		theme: function(name, data) {
		}
	};
	
	
	return ThemeManager;
})();

(function() {
	"use strict"
	
	var style = {
		'user-select': 'none',
		'box-sizing': 'border-box',
		'margin': 0,
		'padding': 0,

		'*': {
			'box-sizing': 'border-box',
			'margin': 0,
			'padding': 0
		},
		'::selection': {
			'background-color': '#cc3c09',
			'color': '#fff',
			'text-shadow': 'none'
		},

		// classes
		'..fit': {
			'position': 'absolute !important',
			'top': 0,
			'left': 0,
			'right': 0,
			'bottom': 0,
			'overflow': 'hidden'
		},
		'..abs': {
			'position': 'absolute !important'
		},
		'..abs.h': {
			'width': '100%'
		},
		'..abs.v': {
			'height': '100%'
		},
		'..abs.top': {
			'left': '0',
			'top': '0'
		},
		'..abs.left': {
			'top': '0',
			'left': '0'
		},
		'..abs.right': {
			'top': '0',
			'right': '0'
		},
		'..abs.bottom': {
			'left': '0',
			'bottom': '0'
		},		
		'..fixed': {
			'position': 'absolute !important'
		},
		'..fixed.h': {
			'width': '100%'
		},
		'..fixed.v': {
			'height': '100%'
		},
		'..fixed.top': {
			'left': '0',
			'top': '0'
		},
		'..fixed.left': {
			'top': '0',
			'left': '0'
		},
		'..fixed.right': {
			'top': '0',
			'right': '0'
		},
		'..fixed.bottom': {
			'left': '0',
			'bottom': '0'
		},
		'..border': {
			'border': '1px solid rgba(255,255,255, 0.1)'
		},
		'..boxshadow': {
			'box-shadow': '0 0 5px rgba(25,25,25,0.3)'
		},
		'..round': {
			'border-radius': 5
		},
		'..glass': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 50%)',
			'border-top': '1px solid rgba(255, 255, 255, 0.4)',
			'border-bottom': '1px solid rgba(0, 0, 0, 0.3)'
		},
		'..pad': {
			'margin': 5,
			'padding': 5
		},
		'..innerpad': {
			'padding': 5
		},
		'..outerpad': {
			'margin': 5
		},
		'..clickable': {
			'cursor': ['hand', 'pointer']
		},
		'..bg-stripe': {
			'background-image': 'url(data:image/gif;base64,R0lGODlhBwABAKIAAAAAAP///8G2pMzDtP///wAAAAAAAAAAACH5BAEAAAQALAAAAAAHAAEAAAMEKKozCQA7)'
		},
		'..bg-transparent': {
			'background-color': 'white',
			'background-image': 'url(data:image/gif;base64,R0lGODlhAgACAJEAAAAAAP///8DAwP///yH5BAEAAAMALAAAAAACAAIAAAID1CYFADs=)',
			'background-size': '16px'
		}
	};
})();

(function() {
	"use strict"

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;

			// process options
			var o = this.options;
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');

			this.cmpmap = new Map();

			this.on('added', function(e) {
				var added = e.added;
				if( added === '-' ) added = new UI.Separator({flex:1});
				
				var packed;
				if( o.translation !== false ) {
					packed = this.application().pack(added);
				}
				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var removed = e.removed;
				removed = this.byItem(removed);
				
				if( removed instanceof $ ) removed.detach();
				else if( removed instanceof Component ) removed.detach();
				else if( isElement(removed) ) this.attachTarget() && this.attachTarget().removeChild(removed);
			});
			
			// call super's build
			this.$super();
		},
		packed: function(item, cmp) {
			if( arguments.length == 1 ) return this.cmpmap.get(item);
			if( item && cmp ) return this.cmpmap.set(item, cmp);
			return null;
		},
		direction: function(direction) {
			var el = this.el;

			if( !arguments.length ) return this.el.is('horizontal') ? 'horizontal' : 'vertical';
			
			if( direction === 'horizontal' ) el.rc('vertical').ac('horizontal');
			else if( direction === 'vertical' )  el.ac('vertical').rc('horizontal');
			else return console.error('invalid direction', direction);

			this.fire('view.direction changed', {
				direction: (el.is('horizontal') ? 'horizontal' : 'vertical')
			});

			return this;
		}
	};
	
	View.style = {
		'position': 'relative',
		'display': 'flex',
		'flex-direction': 'column',
		'align-content': 'stretch',
		
		'..horizontal': {
			'flex-direction': 'row'
		}
	};
	
	View.translator = function(el, options) {
		var view = new this.View(options);
		var children = el.childNodes;
		var items = [];
		
		for(var i=0; i < children.length; i++) {
			var c = children[i];
			var cmp = $(c).data('component');
			if( cmp ) items.push(cmp);
			else items.push(c);
		}
		
		view.add(items);
		return view;
	};
	
	View.inherit = UI.Container;
	
	return View = UI.component('view', View);
})();


(function() {
	"use strict"
	
	function HTML(options) {
		if( typeof(options) === 'string' ) options = {html:options};
		this.$super(options);
	}

	HTML.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.html ) this.html(o.html, true);
			else if( o.text ) this.text(o.text, true);
			else if( o.src ) this.src(o.src, o.cache, 'html');
		},
		src: function(url, cache, mode, append) {
			console.log('html', this.base(), url, this.context().base());
			url = this.path(url);

			var self = this;
			Ajax.ajax(url).cache(cache).done(function(err, data) {
				if( err ) return console.error('[ERROR] remote html load fail', err);
				
				if( mode === 'text' ) self.text(data, append);
				else self.html(data, append);

				self.fire('html.loaded', {contents:data, mode:mode});
			});
			return this;
		},
		html: function(html, append) {
			if( !arguments.length ) return this.el.html();
			this.el.html(html, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:html, mode:'html'});
			return this;
		},
		text: function(text, append) {
			if( !arguments.length ) return this.el.text();
			this.el.text(text, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:text, mode:'text'});
			return this;
		},
		bind: function(data, fns) {
			this.el.tpl(data, fns);
			this.fire('html.changed', {contents:this.el.html(), mode:'html'});
			return this;
		}
	};
	
	HTML.style = {
		'background-color': 'transparent',
		'user-select': 'all',

		'..center': {
			'text-align': 'center'
		},
		'..left': {
			'text-align': 'left'
		},
		'..right': {
			'text-align': 'right'
		},
		'..darkshadow': {
			'text-shadow': '0 -1px 0 rgba(0,0,0,0.8)'
		},
		'..lightshadow': {
			'text-shadow': '0 1px 0 rgba(255,255,255,0.8)'
		},
		'..h3': {
			'font-weight': 'bold',
			'letter-spacing': 0,
			'font-size': 13
		}
	};
	
	HTML.fname = 'HTML';
		
	return HTML = UI.component('html', HTML);
})();


(function() {
	"use strict"

	function Button(options) {
		this.$super(options);
	}

	Button.prototype = {
		build: function() {
			var o = this.options;
			this.text(o.text);
			this.icon(o.icon);
			this.image(o.image);
		},
		makeup: function() {
			this.el.html('<div class="inner"><div class="text">' + this.text() + '</div></div>');
		},
		text: function(text) {
			if( !arguments.length ) return this._text;
			this._text = text;
			this.makeup();
			return this || '';
		},
		icon: function(icon) {
			if( !arguments.length ) return this._icon;
			this._icon = icon;
			this.makeup();
			return this;
		},
		image: function(image) {
			if( !arguments.length ) return this._image;
			this._image = image;
			this.makeup();
			return this;
		}
	};

	Button.style = {
		'cursor': ['hand', 'pointer'],
		'min-height': 32,
		'color': '#f6f6f6',
		'background-color': 'transparent',
		
		'.inner': {
			'display': 'table',
			'table-layout': 'fixed',
			'width': '100%',
			'height': '100%'
		},
		'.text': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'vertical-align': 'middle',
			'width': '100%',
			'height': '100%',
			'text-align': 'center',
			'letter-spacing': 0,
			'font-weight': 'bold',
			'font-size': 12,
			'line-height': 12,
			'padding': '9px'
		},
		
		'..glass': {
			':hover': {
				'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 51%)'
			}
		},

		':hover': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
		},
		
		'..grey': {
			'background-color': '#2e2e2e'
		},
		'..grey.dark': {
			'background-color': '#232323'
		},
		'..green': {
			'background-color': '#1f7e5c'
		},
		'..green.dark': {
			'background-color': '#1a664a'
		},
		'..red': {
			'background-color': '#e66c69'
		},
		'..red.dark': {
			'background-color': '#b85655'
		},
		'..yellow': {
			'background-color': '#daa571'
		},
		'..yellow.dark': {
			'background-color': '#af845a'
		},
		'..blue': {
			'background-color': '#5b9aa9'
		},
		'..blue.dark': {
			'background-color': '#497b86'
		},
		'..purple': {
			'background-color': '#6b5b8c'
		},
		'..purple.dark': {
			'background-color': '#554971'
		},
		'..wine': {
			'background-color': '#8b5d79'
		},
		'..wine.dark': {
			'background-color': '#704a61'
		},
		'..twitter': {
			'background-color': '#2589c5'
		},
		'..twitter.dark': {
			'background-color': '#0067bc'
		},
		'..facebook': {
			'background-color': '#3b5999'
		},
		'..facebook.dark': {
			'background-color': '#2f4785'
		}
	};
	
	Button.translator = function(el, attrs) {
		attrs.text = el.innerText;
		return new this.Button(attrs);
	};
	
	Button.fname = 'Button';
	Button.acceptable = true;
	
	return Button = UI.component('btn', Button);
})();


	// ends of class definitions

	// hash controller start
	HashController.start();

	// bundle require binding
	define('color', function(module) { module.exports = Color; });
	define('class', function(module) { module.exports = Class; });
	
	define('style.system', function(module) { module.exports = StyleSystem; });
	define('style', function(module) { module.exports = Style; });
	define('theme', function(module) { module.exports = Theme; });
	
	define('util', function(module) { module.exports = Util; });	
	define('hash', function(module) { module.exports = HashController; });	
	define('framework', function(module) { module.exports = Framework; });
	define('debug', function(module) { module.exports = debug; });
	define('ui', function(module) { module.exports = Application; });
	
	// mark build time
	Framework.buildtime = (Framework.finishtime = new Date().getTime()) - Framework.starttime;
})();

// End Of File (attrs.ui.js), Authored by joje6 ({https://github.com/joje6})

