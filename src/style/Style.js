/**
 *	Style: JSON Style Sheet Object Representation (JSON-SS)
 *
 * 
 *	- CSS Selectors and Pseudo Selectors Browser Compatibility
 *	CSS 1 
 *		E
 *		E F
 *		:link
 *		E:active
 *		E:visited
 *		E:first-line
 *		E:first-letter
 *		E.classname
 *		E#id
 *		.classname.classname
 *
 *	CSS 2.1	
 *		*
 *		E > F
 *		E:first-child
 *		E:hover
 *		E:focus	(not supported in IE7)
 *		E + F
 *		E[attr]
 *		E[attr="name"]
 *		E[attr~="name"]
 *		E:before	(not supported in IE7)
 *		E:after	(not supported in IE7)
 *
 *	CSS 3
 *		E ~ F
 *		E[attr^="name"]
 *		E[attr$="name"]
 *		E[attr*="name"]
 *		E[attr|="name"]
 *	
 *	CSS 3 (not supported in IE 7 & 8)
 *		E:root
 *		E:nth-of-type
 *		E:nth-last-of-type
 *		E:first-of-type
 *		E:last-of-type
 *		E:only-of-type
 *		E:only-child
 *		E:last-child
 *		E:nth-child
 *		E:nth-last-child
 *		E:empty
 *		E:target
 *		E:checked
 *		E::selection
 *		E:enabled
 *		E:disabled
 *		E:not(s)
 */

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

			dispatcher.fireSync('cleared');
			dispatcher.fireSync('changed');
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

			dispatcher.fireSync('reset', {source:source});
			dispatcher.fireSync('changed');
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
								dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
							};
							style.on('changed', fn).__listener__ = fn;
						}
					}

					this[rule] = arr;
				} else if( typeof(value) === 'object' ) {
					var style = new Style(value);
					
					// bind events
					var fn = function(e) {
						dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
					};
					style.on('changed', fn).__listener__ = fn;

					this[rule] = style;
				} else {
					if( !value ) console.warn('style item[' + rule + '] bypassed. illegal value:', value, source);
				}

			}
			
			if( event !== false ) {
				if( p ) dispatcher.fireSync('replaced', {rule:rule, value:value});
				else dispatcher.fireSync('added', {rule:rule, value:value});
				dispatcher.fireSync('changed');
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
								dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
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
				dispatcher.fireSync('merged', {rule:rule, value:value});
				dispatcher.fireSync('changed');
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

			dispatcher.fireSync('removed', {rule:rule});
			dispatcher.fireSync('changed');

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
