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