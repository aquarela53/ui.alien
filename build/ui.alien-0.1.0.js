/*!
 * ui.alien - UI Alien the Module-based Web UI Toolkit (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.1.0
 * @date: 2014-07-13 18:55:29
*/

// es6 shim
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
 * @date: 2014-07-13 14:15:17
*/

/*!
 * attrs.module - javascript module loader that supports cjs, amd (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.1.0
 * @date: 2014-07-13 1:25:54
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
		ext: function() {
			return Path.ext(this.src);
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
		if( !path ) return '';
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
		if( !path ) return '';
		if( path instanceof Path ) path = path.src;

		path = Path.uri(path).trim();

		if( path.endsWith('/') ) {
			path = path.substring(0, path.length - 1);
			return path.substring(path.lastIndexOf('/') + 1);
		} else {
			return path.substring(path.lastIndexOf('/') + 1);
		}
	};
	
	Path.ext = function(path) {
		if( !path ) return '';
		if( path instanceof Path ) path = path.src;
		
		path = Path.filename(path);
		
		var arg = path.split('.');
		if( arg.length <= 1 ) return '';
		return arg[arg.length - 1];		
	};

	Path.uri = function(path) {
		if( !path ) return '';
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		return path;
	};

	Path.querystring = function(path) {
		if( !path ) return '';
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(path.indexOf('?') + 1);
		else return '';
	};

	Path.query = function(path) {
		if( !path ) return '';
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
		if( !url ) return '';
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
		if( !url ) return {};
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
		if( !path ) return '';
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
										console.warn('[warn] json parse error:', e.message, '[in ' + url + ']');
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
			resolve: eval_as_module,
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
	require.resolve = Require.resolve;

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
	// class device
	function Device() {
		"use strict";
		
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
		this.versionString = version;
		this.version = parseInt(version.split('.')[0]);
		this.retina = retina;
		this.touchable = touchable;
		this.prefix = prefix;
		this.transform = hasTransform;
		this.has3d = has3d;
		this.resolution = resolution;

		this.calibrator = new CSS3Calibrator(this);
		
		// represent attributes
		this.gecko = (this.engine === 'gecko');
		this.webkit = (this.engine === 'webkit');
		
		this.firefox = (this.browser === 'firefox');
		this.ie = (this.browser === 'msie');
		this.opera = (this.browser === 'opera');
		this.chrome = (this.browser === 'chrome');
		this.safari = (this.browser === 'safari');
		
		this.iphone = (this.device === 'iphone');
		this.ipad = (this.device === 'ipad');
		this.ipod = (this.device === 'ios');

		this.ios = (this.platform.name === 'ios');
		this.android = (this.platform.name === 'android');
		this.osx = (this.platform.name === 'osx');
		this.windows = (this.platform.name === 'windows');
		this.linux = (this.platform.name === 'linux');		

		this.phone = (this.platform.type === 'phone');
		this.tablet = (this.platform.type === 'tablet');
		this.desktop = (this.platform.type === 'desktop');		

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
			with(this) {
				try {
					return eval(query);
				} catch(err) {
					console.warn('incorrect query [' + query + ']', err.message);
					return false;
				} 
			}
		}
	};

	return new Device();
})();


//console.log('Device', Device.is('webkit && version > 30 && desktop'));

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
	
	$.html = function(text) {
		var el = document.createElement('div');
		el.innerHTML = text;
		return $(el).contents().owner(null);
	};
	
	$.text = function(text) {
		var el = document.createElement('div');
		el.innerText = text;
		return $(el).contents().owner(null);
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
	
	function create(accessor, contents, force) {
		if( !accessor || typeof(accessor) !== 'string' ) return console.error('invalid parameter', accessor);
		
		var el;
		if( force === true || isHtml(accessor) ) {
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
	
	prototype.array = function() {
		return this.slice();	
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
			return array_return(arr);
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
	
	fn.visitup = function(visitor, containSelf) {
		if( typeof(visitor) !== 'function' ) return console.error('visitor must be a function');
		
		containSelf = (containSelf === true) ? true : false;
		
		return this.each(function() {			
			if( containSelf && visitor.call(this) === false ) return false;
	
			var propagation = function(el) {
				var p = el.parentNode;
				if( p ) {
					if( visitor.call(p) !== false ) {
						propagation(p);
					} else {
						return false;
					}
				}
			};

			return propagation(this);
		});
	};
	
	fn.visit = function(visitor, containSelf, allcontents) {
		if( typeof(visitor) !== 'function' ) return console.error('visitor must be a function');
		
		containSelf = (containSelf === true) ? true : false;
		allcontents = (allcontents === true) ? true : false;
		
		return this.each(function() {			
			if( containSelf && visitor.call(this) === false ) return false;
	
			var propagation = function(el) {
				var argc = $((allcontents) ? el.childNodes : el.children);
				argc.each(function() {
					if( visitor.call(this) !== false ) {
						propagation(this);
					} else {
						return false;
					}
				});
			};

			return propagation(this);
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
			console.info('\tready: ' + Framework.readytime + ' ms');
			console.info('\tload: ' + Framework.loadtime + ' ms');
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
				for(var i=0; i < items.length ;i++) {					
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
				var name = clz.fname || fname(clz);
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
		this.options = {};
	}

	HashController.prototype = {
		config: function(options) {
			if( typeof(options) !== 'object' ) return console.error('illegal parameter', options);
			this.options = options;
		},
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


// wrapping script text as function for when event listener is script string
function wrappingevalscript(script) {
	var app = this.application();
	var cmp = this;
	return function(e) {
		return eval(script);
		//var fn;
		//eval('fn = function(cmp, app) {\n' + script + '\n};');
		//return fn.apply(cmp, [cmp, app]);
	};
}

function evaljson(script) {
	var fn;
	eval('fn = function() { return ' + script + ';}');
	return fn();
}

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
	
	var array_return = $.util.array_return;
	
	function normalizeContentsType(mimeType, url) {
		if( mimeType && typeof(mimeType) === 'string' ) {
			mimeType = mimeType.split(';')[0];
			
			if( ~mimeType.indexOf('javascript') ) return 'js';
			else if( ~mimeType.indexOf('html') ) return 'html';
			else if( ~mimeType.indexOf('json') ) return 'json';
			else if( ~mimeType.indexOf('xml') ) return 'xml';
			else if( ~mimeType.indexOf('css') ) return 'css';
			else return mimeType;
		} else if( url && typeof(url) === 'string' ) {
			var ext = Path.ext(url).toLowerCase();
			if( ext === 'htm') return 'html';
			else return ext;
		} else {
			return console.error('illegal parameter', mimeType, url);
		}
	}
	
	// privates
	function makeup(options) {
		var o = {};
		if( isElement(options) ) {
			o.el = options;
		} else if( options instanceof $ ) {
			o.el = options[0];
		} else if( typeof(options) === 'function' ) {
			o.build = options;
		} else if( typeof(options) === 'object' ) {
			o = options;
		} else {
			console.error('illegal options', options);
			throw new TypeError('illegal options:' + options);
		}
		
		o = this.options = new Options(o);
		
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
		
		el = this.el = el.save('first').data('component', this).attr(o.attrs);
		
		el[0].__aui__ = this;
					
		// confirm event scope
		var events = o.e || o.events;
		if( events ) {
			// bind event in options
			var dispatcher = this._dispatcher = this._dispatcher || new EventDispatcher(this);
			
			if( events.soruce ) dispatcher.source(events.source);
			if( events.scope ) dispatcher.scope( ((events.scope == 'dom') ? el[0] : events.scope) );

			for(var k in events) {
				var fn = events[k];
			
				if( typeof(fn) === 'string' ) {
					fn = wrappingevalscript.call(this, fn);
				}
			
				if( typeof(fn) === 'function' ) this.on(k, fn);
				else console.warn('[' + this.accessor() + '] illegal type of event listener:', fn);
			}
		}
		
		// setup application & name
		if( o.id ) this.id(o.id);
		if( o.name ) this.name(o.name);
		if( o.origin ) this.origin(o.origin);
		if( o.base ) this.base(o.base);
		if( o.title ) this.title(o.title);
		this.classes(o.classes || o.class || '');
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
		
		this.fire('ready');
	}
	

	// class Component
	function Component(options) {
		makeup.call(this, options);
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
			this.base(Path.dir(origin));
			return this; 
		},
		base: function(base) {
			if( !arguments.length ) return this._base || this.application().base();
			
			if( !base ) this.base(Path.dir(origin));
			else if( base && typeof(base) === 'string' ) base = Path.join(this.application().base(), base);
			else return console.error('invalid base', base);
			
			base = base.trim();
			if( !base.endsWith('/') ) base = base + '/';
			this._base = base;
			
			return this;
		},
		path: function(src) {
			//console.log('origin', this.origin());
			//console.log('base', this.base());
			//console.log('requested', src);
			//console.log('src', Path.join(this.base(), src));
			return Path.join(this.base(), src);
		},
		
		// attach
		parent: function() {
			var parent = this.el[0].parentNode;
			if( parent && parent.__aui__ ) return parent.__aui__;
			return parent;
		},
		contents: function() {
			var attachTarget = this.attachTarget();
			if( !attachTarget ) return [];
			return Array.prototype.slice.call(attachTarget.childNodes);
		},
		children: function() {
			var contents = $(this.contents());
			var result = [];
			contents.each(function() {
				if( this.__aui__ ) result.push(this.__aui__);
			});
			return result;
		},	
		find: function(selector) {
			var result;
			selector = this.application().selector(selector);
			this.el.find(selector).each(function() {
				if( this.__aui__ ) {
					result = this.__aui__;
					return false;
				}
			});
			return result;
		},
		finds: function(selector) {			
			selector = this.application().selector(selector);
			var result = [];
			this.el.find(selector).each(function() {
				if( this.__aui__ ) result.push(this.__aui__);
			});
			return array_return(result);
		},
		byId: function(cmpid) {
			return this.find('#' + cmpid);
		},
		byName: function(name) {
			return this.finds('[name="' + name + '"]');
		},
		visitup: function(fn, containSelf) {
			if( typeof(fn) !== 'function' ) return console.error('visitor must be a function');
			this.el.visitup(function() {
				if( this.__aui__ ) return fn.call(this.__aui__);
			},containSelf);
			return this;
		},
		visit: function(fn, containSelf) {
			if( typeof(fn) !== 'function' ) return console.error('visitor must be a function');
			this.el.visit(function() {
				if( this.__aui__ ) return fn.call(this.__aui__);
			},containSelf);
			return this;
		},
		acceptable: function() {
			if( typeof(this._acceptable) === 'boolean' ) return this._acceptable;
			return this.concrete().acceptable();
		},
		attachTarget: function(attachTarget) {
			if( !this.acceptable() ) return null;
			if( !arguments.length ) return this._attachTarget || this.dom();
			
			if( attachTarget === this.dom() ) return this;
			
			if( this._attachTarget ) this._attachTarget.__aui__ = null;
			
			if( isElement(attachTarget) ) this._attachTarget = attachTarget;
			else return console.error('illegal attach target, target must be an element', attachTarget);
			
			attachTarget.__aui__ = this;
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
			return this;
		},

		// dom control
		dom: function() {
			return this.el[0];
		},
		accessor: function() {
			return this.el.accessor();
		},
		classes: function(classes) {
			var cls = this.constructor;
			var accessor = cls.accessor();
			
			var el = this.el;
			
			if( !arguments.length ) {
				var args = accessor.split('.');
				return el.classes().filter(function(item) {
					return !~args.indexOf(item);
				}).join(' ');
			}
			
			el.classes(accessor.split('.').join(' '));
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
			
			var dispatcher = this._dispatcher = this._dispatcher || new EventDispatcher(this);
			
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
			if( !dispatcher ) return this;

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
			if( !d ) return {};
			return d.fireASync.apply(d, arguments);
		},
		fire: function() {
			var d = this._dispatcher;
			if( !d ) return {};
			return d.fire.apply(d, arguments);
		},

		
		// page mapping by url hash
		pages: function(pages) {
			if( !arguments.length ) return this._pages;
			if( arguments.length === 1 && pages === false ) {
				pages = this._pages;
				if( !pages ) return this;
				
				for(var k in pages) {
					if( pages.hasOwnProperty(k) ) this.page(k, false);
				}
				
				return this;				
			} else if( typeof(pages) === 'object' ) {
				for(var k in pages) {
					if( pages.hasOwnProperty(k)) this.page(k, pages[k]);
				}
				return this;
			} else {
				return console.error('illegal parameter', pages);
			}
		},
		page: function(hash, fn) {
			if( typeof(hash) === 'string' && fn === false ) {
				// 해당 hash 만 지움
				var pages = this._pages;
				if( !pages ) return this;
				
				var fn = pages[hash];				
				if( fn && fn.listener ) this.off('hash', fn.listener);
				if( fn && fn.def_listener ) this.off('ready', fn.def_listener);
								
				pages[hash] = null;
				try { delete pages[hash]; } catch(e) {}
				
				return this;
			} else if( typeof(hash) === 'string' && typeof(fn) === 'function' ) {
				// hash 이벤트 등록
				var pages = this._pages = this._pages || {};
				
				var def_listener = false;
				if( hash === '@' ) hash = '@default';
				if( hash === '@default' ) {
					var def_listener = (function(fn) {
						return function(e) {
							fn.call(this, e);
						};
					})(fn);
				}
				
				var listener = (function(hash, fn) {
					return function(e) {
						if( hash === '*' || e.hash === hash || (hash === '@default' && e.hash === '')) return fn.call(this, e);
					};
				})(hash, fn);
				
				fn.listener = listener;
				if( def_listener ) {
					fn.def_listener = def_listener;
					this.on('ready', def_listener);
				}
				
				this.on('hash', listener);
				
				return this;
			} else {
				return console.error('illegal parameter', hash, fn);
			}
			
			return this;
		},
		
		// loader
		loader: function(fn) {
			if( !arguments.length ) return this._loader;
			if( typeof(fn) === 'function' ) this._loader = fn;
			else return console.error('loader must be a function', fn);
			return this;
		},
		load: function(src, fn, ajaxOptions) {
			if( debug('loader') ) console.info('[' + this.accessor() + '] load url', src, fn, ajaxOptions);

			if( typeof(src) !== 'string' ) return console.error('illegal src', fn);
			var contentType = ( typeof(fn) === 'string' ) ? fn : null;
			
			if( typeof(fn) !== 'function' ) fn = this._loader;
			if( !fn ) return console.error('[' + this.accessor + '] component has no loader');
			
			ajaxOptions = ajaxOptions || {};
			ajaxOptions.url = src;
			ajaxOptions.url = this.path(ajaxOptions.url);
			ajaxOptions.sync = true;
			ajaxOptions.cache = true;
			var result;
			var self = this;
			Ajax.ajax(ajaxOptions).done(function(err, data, xhr) {
				if( err ) return fn.apply(self, [err, data]);
				contentType = normalizeContentsType(contentType || xhr.getResponseHeader('content-type'), ajaxOptions.url);
				result = fn.apply(self, [err, data, contentType, ajaxOptions.url, xhr]);
			});
			return result || this;
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
	
	Component.translator = function(cmpid) {
		return function(el, options) {
			var concrete = this.component(cmpid);
			if( !concrete ) return console.warn('cannot find component [' + cmpid + ']');
			return new concrete(options);
		};
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
			
			this._marks = {};

			this.fire('cleared');
			return this;
		},
		items: function(items) {
			if( !arguments.length ) return this._items.slice();
			if( typeof(items) === 'number' ) return this.get(items);

			var current = this._items.slice();
			for(var i=current.length; i >= 0;i--) {
				this.remove(i);
			}
			
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
	
	

	var aaa = function(el, options) {
		var concrete = this.component('breadcrumb');
		
		var items = [];
		$(el).children('item').each(function() {
			var el = $(this);
			items.push({
				title: el.attr('title'),
				href: el.attr('href'),
				html: el.html()
			});
		});
		
		options.items = items;
		
		return new concrete(options);
	};
	
	function default_item_processor() {
		if( this.tagName && this.tagName.toLowerCase() === 'item' ) {
			var attributes = this.attributes;
			var attrs = {};
			var contentName, contentType = 'element';
			for(var i=0; i < attributes.length; i++) {
				var name = attributes[i].name, n;
				var value = attributes[i].value;
		
				if( (n = name.toLowerCase()).startsWith('data-') ) {
					if( n === 'data-content-name' ) contentName = value;
					else if( n === 'data-content-type' ) contentType = value;
					continue;
				}
		
				attrs[name] = value;
			}
			
			if( contentName ) {
				if( contentType === 'element' ) {
					attrs[contentName] = this.children[0];
				} else if( contentType === 'elements' ) {
					attrs[contentName] = this.children;
				} else if( contentType === 'contents' ) {
					attrs[contentName] = this.childNodes;
				} else if( contentType == 'html' ) {
					attrs[contentName] = this.innerHTML;
				} else if( contentType == 'text' ) {
					attrs[contentName] = this.innerText;
				} else if( contentType == 'function' ) {
					eval('attrs[contentName] = ' + this.innerText + ';');
				} else if( contentType == 'object' ) {
					eval('attrs[contentName] = ' + this.innerText + ';');
				} else if( contentType == 'script' ) {
					eval(this.innerText);
				} else if( contentType == 'json' ) {
					attrs[contentName] = JSON.parse(this.innerText);
				} else {
					console.error('unknown type of contents', this, contentType);
				}
			}
			
			return attrs;
		}
	}
	
	Container.translator = function(cmpid, fn) {
		if( !fn ) fn = default_item_processor;
		return function(el, options) {
			var concrete = this.component(cmpid);
			if( !concrete ) return console.warn('cannot find component [' + cmpid + ']');
			
			var items = [];
			if( options.items ) {
				if( typeof(options.items) === 'string' ) items = options.items.split(' ').join(',').split(',');
				else if( Array.isArray(options.items) ) items = options.items; 
				
				options.items = null;
			}
			
			var container = new concrete(options);
			var children = el.childNodes;
			
			for(var i=0; i < children.length; i++) {
				var c = fn.call(children[i]);				
				if( c ) items.push(c);
			}
		
			container.items(items);
			return container;
		};
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
				var added = e.added;
				
				var packed;
				if( o.translation !== false ) packed = this.pack(added);				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var packed = this.packed(e.removed);
				
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
			if( el.is('application') || el.attr('data-as') === 'application' ) return el.each(fn_application).void();
			else el.find('application, *[data-as="application"]').each(fn_application);
			
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
						
			if( !inherit ) return console.error('[' + this.applicationId() + '] illegal state, cannot find superclass', inherit);
			
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
	"use strict";

	// class Block
	function Block(options) {
		this.$super(options);
	}

	Block.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			this.loader(this.application().loader());

			// regist event listener
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
				removed = this.packed(removed);
				
				if( removed instanceof $ ) removed.detach();
				else if( removed instanceof Component ) removed.detach();
				else if( isNode(removed) ) this.attachTarget() && this.attachTarget().removeChild(removed);
			});
			
			// add original element
			$(this.dom()).contents().each(function() {
				self.add(this);
			});
			
			// call super's build
			this.$super();
		},
		packed: function(item, cmp) {
			var cm = this.cmpmap = this.cmpmap || new Map();
			if( arguments.length == 1 ) return cm.get(item);
			if( item && cmp ) return cm.set(item, cmp);
			return null;
		}
	};

	Block.style = {
		'position': 'relative'
	};

	Block.translator = Container.translator('block', function() {
		return this.__aui__ || this;
	});
	
	Block.inherit = UI.Container;
	
	return Block = UI.component('block', Block);
})();

(function() {
	"use strict";

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			// call super's build
			this.$super();
			
			// process options
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');
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
		},
		
		// override
		items: function(items) {
			if( typeof(items) === 'string' && !$.util.isHtml(items) ) {
				items = this.load(items);
			} else if( typeof(items) === 'function' ) {
				items.call(this.application(), this);
				return this;
			}
			
			return this.$super(items);			
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
	
	View.translator = Container.translator('view', function() {
		return this.__aui__ || this;
	});
	
	View.inherit = 'block';
	
	return View = UI.component('view', View);
})();


(function() {
	"use strict";
	
	function Markup(options) {
		if( typeof(options) === 'string' ) options = {html:[options]};
		else if( isElement(options) ) options = {el:options};
		
		this.$super(options);
	}
	
	Markup.prototype = {
		build: function() {
			var o = this.options;
			if( o.html ) this.html(o.html);	
		},
		html: function(html) {
			this.el.empty().append(this.application().pack(html));
			return this;
		},
		src: function(src) {
			var result = this.application().load(src);
			this.el.empty().append(this.application.pack(result));
			return this;
		}
	};
	
	Markup.fname = 'Markup';
	Markup.translator = Component.translator('markup');
	
	return Markup = UI.component('markup', Markup);
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
	
	Button.translator = function(el, attrs) {
		attrs.text = attrs.text || el.innerText;
		return new this.Button(attrs);
	};
	
	Button.fname = 'Button';
	Button.acceptable = true;
	
	return Button = UI.component('button', Button);
})();


(function() {
	"use strict";

	function Breadcrumb(options) {
		this.$super(options);
	}
	
	Breadcrumb.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			this.selectable(1);
			
			var ol = el.create('ol.breadcrumbs');
			
			this.on('added', function(e) {
				var item = e.added;

				var tab = ol.create('li').create('a').attr('href', '#').html((item.html || item.title || 'untitled')).end('li');

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					if( item.href ) self.action(item.href);					
				});

				//self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.removed);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').rc('selected');
			});

			this.$super();
		}
	};
		
	Breadcrumb.inherit = 'container';
	Breadcrumb.translator = Container.translator('breadcrumb');
	
	return Breadcrumb = UI.component('breadcrumb', Breadcrumb);
})();



/*
ol.breadcrumbs {
	margin-bottom: 18px;
	list-style: decimal;
	margin-left: 2.2em;
}
ol.breadcrumbs {
	font-size: 11px;
	color: #444;
	background: url(./breadcrumbs/breadcrumb_bg.png) no-repeat;
	height: 36px;
	line-height: 34px;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	float: left;
	margin: 0;
	padding: 0 0 0 20px;
	background: url(./breadcrumbs/breadcrumb_sep_20080909.png) no-repeat;
}
ol.breadcrumbs li a {
	float: left;
	color: #444;
	text-decoration: none;
	padding: 0 10px;
	margin-left: -10px;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	margin: 0;
	padding: 0 10px;
	width: 15px;
	text-indent: -9999px;
	overflow: hidden;
}

#breadory {
	border: 1px solid #ddd;
	width: 100%;
	margin: 0 auto;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	border-radius: 4px;
	
	--background-color: #232323;
}
ol.breadcrumbs {
	background: none;
	clear: both;
	float: none;
	height: 3em;
	line-height: 3em;
	font-size: 11px;
	color: #666;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	background: none;
	float: left;
	margin: 0;
	padding: 0 0 0 1em;
}
ol.breadcrumbs li a {
	float: left;
	color: #666;
	text-decoration: none;
	padding: 0 1.75em 0 0;
	margin-left: 0px;
	background: url(./breadcrumbs/breadcrumb_separator.png) no-repeat 100% 50%;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	background: url(./breadcrumbs/breadcrumb_home.png) no-repeat 1.25em 50%;
	margin: 0;
	padding: 0 0 0 1.25em;
	width: 30px;
	text-indent: -9999px;
	overflow: hidden;
}
ol.breadcrumbs li.home a:hover {
	background-image: url(./breadcrumbs/breadcrumb_home_over.png);
}

@media only screen {
	ol.breadcrumbs li a {
		background-image:url(./breadcrumbs/breadcrumb_separator.svg);
	}
	ol.breadcrumbs li.home a {
		background-image:url(./breadcrumbs/breadcrumb_home.svg);
	}
	ol.breadcrumbs li.home a:hover {
		background-image:url(./breadcrumbs/breadcrumb_home_over.svg);
	}
}

<div id="breadory">
	<ol class="breadcrumbs">
		<li><a href="#">홈</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title Title Title</a></li>
		<li><a href="#">Title</a></li>
		<li>Title</li>
	</ol>
</div>
*/


(function() {
	"use strict";

	function Image(options) {
		if( typeof(options) === 'string' ) options = {src:options};
		this.$super(options);
	}

	Image.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			
			el.on('load', function(e) {
				self.fire('image.load', e);
			});

			el.on('error', function(e) {
				self.fire('image.error', e);
			});

			el.on('abort', function(e) {
				self.fire('image.abort', e);
			});
			
			var o = this.options;
			this.block(o.block);
			this.src(o.src);	
		},
		src: function(src) {
			if( !arguments.length ) return this.el.attr('src');
			
			if( typeof(src) === 'string' ) this.el.attr('src', this.path(src));
			return this;
		},
		block: function(block) {
			if( !arguments.length ) return (this.el.style('display') === 'block');

			if( block === true ) this.el.style('display', 'block');
			else this.el.style('display', false);

			return this;
		}
	};
	
	Image.tag = 'img';
	Image.translator = Component.translator('picture');
	
	return Image = UI.component('picture', Image);
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
	
	$.on('DOMContentLoaded', function() {
		Framework.readytime = new Date().getTime() - Framework.starttime;
	});
	
	$.on('load', function() {
		Framework.loadtime = new Date().getTime() - Framework.starttime;
	});
})();

// End Of File (attrs.ui.js), Authored by joje6 ({https://github.com/joje6})