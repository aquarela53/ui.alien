var Theme = (function() {
	"use strict"
	
	var Context = require('ui');
	
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
		if( !(context instanceof Context) ) {
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

