/*
 * class StyleSheetManagerHandler for raw stylesheet handling
 */
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
