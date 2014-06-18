(function() {
	"use strict"
	
	var EL = (function() {
		"use strict"
		
		function EL(el) {
			if( el.__handler__ ) return el.__handler__;
			else if( el instanceof EL ) return el;
		
			if( el.nodeName == '#text' || el.nodeName == '#cdata-section' || el.nodeName == '#comment' ) {			
				return new TextNode(el);
			}

			if( !EL.isElement(el) ) {
				console.error('invalid element', el);
				throw new Error('invalid element');
			}

			el.__handler__ = this;
			this.length = 1;
			this[0] = el;
		};

		EL.prototype = {
			id: function(id) {
				if( !arguments.length ) return this[0].id;
				return this.attr('id', ((id) ? id : false));
			},
			name: function(name) {
				if( !arguments.length ) return this.attr('name');
				return this.attr('name', ((name) ? name : false));
			},

			// attach & detach
			create: function(tag, attrs) {
				var el = EL.create(tag, attrs);
				this.attach(el);
				return el;
			},
			attachBefore: function(el, reference) {
				return this.attach(el, reference, -1);
			},
			attachAfter: function(el, reference) {
				return this.attach(el, reference);
			},
			attach: function(els, reference, adjust) {
				if( !els ) throw new Error('el was null');
			
				var el = this[0];
				if( !Array.isArray(els) ) els = [els];
				for(var i=0; i < els.length; i++) {
					var children = $(els[i]);
					if( !children ) continue;
					for(var j=0; j < children.length; j++) {
						var child = children[j].__handler__ || new EL(children[j]);
						
						child.detach();
	
						var ref = null;
						//console.log('reference', reference);
						if( reference || reference === 0 ) {
							if( typeof(reference) === 'number' ) ref = el.children[reference];
							else if( EL.isElement(reference) ) ref = reference;
							else if( EL.isElement(reference[0]) ) ref = reference[0];
			
							if( adjust && ref ) {
								var index = el.children.indexOf(ref) + adjust;
								if( index > el.children.length - 1 ) index = el.children.length - 1;
								else if( index < 0) index = 0;
								ref = el.children[index];
							}
						}
		
						if( ref ) el.insertBefore(child[0], ref.nextSibling); 
						else el.appendChild(child[0]);
					}
				}
				return this;
			},
			attachTo: function(el, reference) {
				if( !el ) throw new Error('missing el:' + el);
				$(el).attach(this, reference);
				return this;
			},
			detach: function() {
				var parent = this[0].parentNode;
				var el = this[0];
			
				if( parent ) parent.removeChild(el);
			
				return this;
			},
			isStaged: function() {
				var el = this[0];
				var el = {
					parentNode: el
				};

				for(;el = el.parentNode;) {
					if( el.nodeType === 11 ) return false;
					if( el === document.body ) return true;
				}

				return false;
			},
			showing: function() {
				var el = this[0];
				if( this.computed('visibillity') === 'hidden' ) return false;
				if( (el.scrollWidth || el.scrollHeight || el.offsetWidth || el.offsetHeight || el.clientWidth || el.clientHeight) ) return true;
				return false;
			},
			clear: function() {
				this.fire('clear');
				this.style(false);
				this.attr(false);
				this.classes(false);
				this.html(false);
				this.un();
				this.fire('cleared');
				return this;
			},
			css: function(key, value) {
				return this.style(key, value);
			},
			style: function(key, value) {
				if( !arguments.length ) return new StyleSession(this[0]);
						
				var session = new StyleSession(this[0]);
				if( arguments.length === 1 && typeof(key) !== 'object' ) {
					if( key === false ) {
						session.clear();
					} else if( typeof(key) === 'string' && ~key.indexOf(':') ) {
						session.text(key);
						session.commit();
					} else if( typeof(key) === 'string' ) {
						return session.get(key);
					}

					return this;
				}
			
				if( typeof(key) === 'object' ) session.set(key);
				else session.set(key, value);
			
				session.commit();

				return this;
			},
			computed: function(k) {
				var cs;
				var el = this[0];
				if ( el.currentStyle ) {
					cs = el.currentStyle;
				} else if( document.defaultView && document.defaultView.getComputedStyle ) {
					cs = document.defaultView.getComputedStyle(el);
				} else {
					throw new Error('browser does not support computed style');
				}

				return (typeof(k) === 'string') ? cs[k] : cs;
			},
		
			// class
			classes: function(classes, flag) {
				var el = this[0];
				var o = (el.className || '').trim();

				if( !arguments.length ) return o;			

				if( typeof(flag) === 'boolean' ) {
					if( !classes ) return this;
					if( Array.isArray(classes) ) classes = classes.join(' ');
					classes = classes.split(' ');
				
					var args = o ? o.split(' ') : [];
					for(var i=0; i < classes.length; i++) {
						var cls = classes[i];
						if( cls ) {
							if( !flag && ~args.indexOf(cls) ) args = Util.array.removeByItem(args, cls);
							else if( flag && !~args.indexOf(cls) ) args.push(cls);
						}
					}

					el.className = args.join(' ');
				} else {
					el.className = '';
					el.removeAttribute('class');
					if( Array.isArray(classes) ) classes = classes.join(' ').trim();
					if( classes ) el.className = classes;
				}

				var changed = (el.className || '').trim();
			
				return this;
			},
			addClass: function(s) {
				return this.classes(s, true);
			},
			hasClass: function(s) {
				return (s && ~this[0].className.split(' ').indexOf(s)) ? true : false;
			},
			removeClass: function(s) {
				return this.classes(s, false);
			},
			clearClass: function() {
				var el = this[0];
				var o = el.className;
				el.className = '';
				el.removeAttribute('class');
				return this;
			},
			ac: function(s) {
				return this.classes(s, true);
			},
			rc: function(s) {
				return this.classes(s, false);
			},
			cc: function() {
				return this.clearClass();
			},
			is: function(s) {
				return this.hasClass(s);
			},
		
			// events
			on: function(type, fn, capture) {
				if( !type || !fn ) return console.error('[ERROR] illegal event type or handler', type, fn, capture);

				var dispatcher = this._dispatcher;
				if( !dispatcher ) dispatcher = this._dispatcher = new EventDispatcher(this[0]);

				capture = (capture===true) ? true : false;

				var el = this[0];
				if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events			
					if( el.addEventListener ) {
						el.addEventListener(type, fn, capture);

						if( type.toLowerCase() == 'transitionend' && Device.is('webkit') ) {
							el.addEventListener('webkitTransitionEnd', fn, capture);
						}
					} else if( el.attachEvent ) {
						el.attachEvent('on' + type, fn);
					}
				} else {
					dispatcher.on(type, fn, capture);
				}
				
				return this;
			},
			hasOn: function(type) {
				var dispatcher = this._dispatcher;
				return (dispatcher) ? dispatcher.has(type) : false;
			},
			un: function(type, fn, capture) {
				if( !type || !fn ) return console.error('[ERROR] illegal event type or handler', type, fn, capture);

				var dispatcher = this._dispatcher;
				if( !dispatcher ) return this;

				capture = (capture===true) ? true : false;

				var el = this[0];
				if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events
					if( el.removeEventListener ) {
						el.removeEventListener(type, fn, capture);

						if( type.toLowerCase() == 'transitionend' && Device.is('webkit') )
							el.removeEventListener('webkitTransitionEnd', fn, capture);
					} else if( el.attachEvent ) {
						el.detachEvent('on' + type, fn);
					}
				}

				dispatcher.un(type, fn, capture);
				return this;
			},
			unAll: function() {
				var dispatcher = this._dispatcher;
				if( !dispatcher ) return this;

				var listeners = dispatcher.listeners();
				for(var type in listeners) {
					var fns = listeners[type];

					if( fns ) {
						for(var i=fns.length - 1;i >= 0;i--) {
							var o = fns[i];
							this.un(o.type, o.fn, o.capture);
						}
					}
				}

				this.fire('event.cleared');

				return this;
			},
			fire: function(type, values) {
				if( !type ) return console.error('[ERROR] cannot fire event type:', type);
				if( !values ) values = {};

				var dispatcher = this._dispatcher;
				if( !dispatcher ) dispatcher = this._dispatcher = new EventDispatcher(this[0]);

				var e, el = this[0];
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

					if( this[0].dispatchEvent ) {
						this[0].dispatchEvent(e);
					} else {
						e.cancelBubble = ((values.bubbles===true) ? true : false);
						this[0].fireEvent('on' + type, e );
					}
				} else if( dispatcher ) {
					e = dispatcher.fireSync(type, values);
				}

				return e;
			},
			attr: function(k,v) {
				var el = this[0];

				if( !arguments.length ) {
					var arga = el.attributes;
					var o = {};
					for(var i=0; i < arga.length; i++) {
						o[arga[i].name] = arga[i].nodeValue;
					}

					return o;
				} else if( k === false ) {
					var arga = el.attributes;
					for(var i=(arga.length - 1); i >= 0; i--) {
						el.removeAttribute(arga[i].name);
					}
					return this;
				} else if( arguments.length === 1 && typeof(k) === 'string' ) {
					return el.getAttribute(k);
				}
			
				var self = this;
				var fn = function(k,v) {
					var o = el.getAttribute(k);
					if( !v && v !== 0 ) el.removeAttribute(k);
					else el.setAttribute(k,v);
				};
			
				if( typeof(k) === 'object' ) {
					for(var key in k) 
						if( k.hasOwnProperty(key) && typeof(key) === 'string' ) fn(key, k[key]);
				} else {
					fn(k, v);
				}

				return this;
			},
			value: function(v) {
				if( !arguments.length ) return this[0].value;

				var o = this[0].value;
				this[0].value = v;

				return this;
			},
			html: function(s, append) {
				if( !arguments.length ) return this[0].innerHTML;
				if( !s ) s = '';
			
				var o = this[0].innerHTML;
				try {
					this[0].innerHTML = (append === true) ? o + s : s;
				} catch(e) {
					this[0].innerText = (append === true) ? o + s : s;
				}

				return this;
			},
			text: function(s, append) {
				if( !arguments.length ) return this[0].innerText;
				if( !s ) s = '';
			
				var o = this[0].innerText;
				this[0].innerText = (append === true) ? o + s : s;

				return this;
			},
			tpl: function(o, fns, reset) {
				if( !this._tpl ) this._tpl = new Template(this[0]);
				return this._tpl.bind(o, fns, reset);
			},
			empty: function() {
				this[0].innerHTML = '';

				return this;
			},
			wrap: function(tag) {
			},		
			unwrap: function() {
				var el = this[0];
				var p = el.parentNode;
				if( !p ) throw new Error('cannot unwrap because has no parent');
				var nodes = p.childNodes;
				var _argc = [];
				if( nodes ) for(var a=0; a < nodes.length;a++) _argc.push(nodes[a]);

				if( _argc ) {
					if( p.parentNode ) {
						for(var a=0; a < _argc.length;a++) {
							p.parentNode.insertBefore(_argc[a], p);
						}
						p.parentNode.removeChild(p);
					} else {
						return new ELs(_argc);
					}
				}
			
				return this;
			},
			offsetWidth: function() {
				return this[0].offsetWidth;
			},
			offsetHeight: function() {
				return this[0].offsetHeight;
			},
			clientWidth: function() {
				return this[0].clientWidth;
			},
			clientHeight: function() {
				return this[0].clientHeight;
			},
			scrollWidth: function() {
				return this[0].scrollWidth;
			},
			scrollHeight: function() {
				return this[0].scrollHeight;
			},
			innerWidth: function() {
				var w = 0;
				var c = this[0].children;
				if(c) {
					for(var i=0; i < c.length; i++) {
						w += c[i].offsetWidth;
					}
				}

				return w;
			},
			innerHeight: function() {
				var h = 0;
				var c = this[0].children;
				if(c) {
					for(var i=0; i < c.length; i++) {
						h += c[i].offsetHeight;
					}
				}

				return h;
			},
			boundary: function() {
				var el = this[0];

				var abs = function(el) {
					if( !el ) el = this[0];
					var r = { x: el.offsetLeft, y: el.offsetTop };
					if (el.offsetParent) {
						var tmp = abs(el.offsetParent);
						r.x += tmp.x;
						r.y += tmp.y;
					}
					return r;
				};

				if( !el ) return null;
				var boundary = function() {};
				boundary = new boundary();		
				boundary.x = boundary.y = 0;
				boundary.width = el.offsetWidth;
				boundary.height = el.offsetHeight;
				boundary.scrollWidth = el.scrollWidth;
				boundary.scrollHeight = el.scrollHeight;
				boundary.clientWidth = el.clientWidth;
				boundary.clientHeight = el.clientHeight;


				var pos = boundary;

				if( el.parentNode ) {
					pos.x = el.offsetLeft + el.clientLeft;
					pos.y = el.offsetTop + el.clientTop;
					if( el.offsetParent ) {
						var parentpos = abs(el.offsetParent);
						pos.x += parentpos.x;
						pos.y += parentpos.y;
					}
				}
				return pos;
			},
			data: function(k, v) {
				var el = this[0];
				if( !arguments.length ) return el.__data__;
				else if( arguments.length == 1 ) return el.__data__ && el.__data__[k];

				if( !el.__data__ ) el.__data__ = {};
				el.__data__[k] = v;
				return this;
			},
			find: function(qry) {
				var el = this[0].querySelector(qry);
				if( el ) return new EL(el);
				else return new ELs();
			},
			finds: function(qry) {
				return new ELs(this[0].querySelectorAll(qry));
			},
			parent: function() {
				var pel = this[0].parentNode;
				if( pel && pel.nodeType != 11 ) return new EL(pel);
			},
			children: function(all) {
				var c = (all === true) ? this[0].childNodes : this[0].children;
				return new ELs(c);
			},
			count: function(all) {
				if( all ) return (this[0].childNodes && this[0].childNodes.length) || 0;
				return (this[0].children && this[0].children.length) || 0;
			},
			nodes: function() {
				return new ELs(this[0].childNodes);
			},
			clone: function(deep) {
				return new EL(this[0].cloneNode((deep === false ? false : true)));
			},
			visit: function(fn, direction, containSelf, scope) {
				if( typeof(fn) !== 'function' ) throw new Error('invalid arguments. fn must be a function');
				scope = scope || this;
				if( containSelf && fn.call(scope, this[0]) === false ) return;
			
				var propagation;
				if( direction === 'up' ) {
					propagation = function(el) {
						var p = el.parentNode;
						if( p ) {
							if( !EL.isElement(p) ) return;
							if( fn.call(scope, p) !== false ) {
								propagation(p);
							}
						}
					};
				} else if( !direction || direction === 'down' ) {
					propagation = function(el) {
						var argc = el.children;
						if( argc ) {
							for(var i=0; i < argc.length;i++) {
								var cel = argc[i];
								if( fn.call(scope, cel) !== false ) {
									propagation(cel);
								}
							}
						}
					};
				} else {
					console.error('unknown direction', direction);
					return this;
				}

				propagation(this[0]);
			},
			outer: function() {
				return this.stringify();
			},
			stringify: function() {
				if( this[0].outerHTML ) {
					return this[0].outerHTML;
				} else {
					var p = this.parent();
					var el = this[0];
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
			},
			invisible: function() {
				this[0].style.visibility = 'hidden';
				return this;
			},		
			checked: function(b) {
				if( !arguments.length ) return this[0].checked;

				this[0].checked = b;
				return this;
			},
			selected: function(b) {
				if( !arguments.length ) return this[0].selected;

				this[0].selected = b;
				return this;
			},

			// TODO
			movable: function(qry, options) {
				return this;
			},		
			hide: function(options, fn) {
				var internal = function(anim) {
					this[0].style.display = 'none';
					if(fn) fn.call(this, anim);
					this.fire('hide');
				};

				if( typeof(options) === 'object' ) {
					this.anim(options, scope || this).run(internal);
				} else {
					if( typeof(options) === 'function' ) fn = options;
					internal.call(this);
				}
				return this;
			},
			show: function(options, fn) {
				var internal = function(anim) {
					this[0].style.display = '';
					this[0].style.visibility = '';
					if( !this[0].style.cssText ) this.attr('style', false);

					if( this.computed('display').toLowerCase() === 'none' ) this[0].style.display = 'block';
					if( this.computed('visibility').toLowerCase() === 'hidden' ) this[0].style.display = 'visible';

					if(fn) fn.call(this, anim);
					this.fire('show');
				};

				if( typeof(options) === 'object' ) {
					this.anim(options, scope || this).run(internal);
				} else {
					if( typeof(options) === 'function' ) fn = options;
					internal.call(this);
				}
				return this;
			},
			anim: function(options, scope) {
				return new Animator(this, options, scope || this);
			},
		
			// utility styles
			margin: function(margin) {
				var el = this;
				if( !arguments.length ) return el.style('margin');
				el.style('margin', margin);
				return this;
			},
			padding: function(padding) {
				var el = this;
				if( !arguments.length ) return el.style('padding');
				el.style('padding', padding);
				return this;
			},
			width: function(width) {
				var el = this;
				if( !arguments.length ) return el.style('width');

				el.style('width', width);
				if( !el.style('min-width') ) el.style('min-width', width);
				if( !el.style('max-width') ) el.style('max-width', width);

				return this;
			},
			minWidth: function(width) {
				var el = this;
				if( !arguments.length ) return el.style('min-width');
				el.style('min-width', width);
				return this;
			},
			maxWidth: function(width) {
				var el = this;
				if( !arguments.length ) return el.style('max-width');
				el.style('max-width', width);
				return this;
			},
			height: function(height) {
				var el = this;
				if( !arguments.length ) return el.style('height');

				el.style('height', height);
				if( !el.style('min-height') ) el.style('min-height', height);
				if( !el.style('max-height') ) el.style('max-height', height);
				return this;
			},
			minHeight: function(height) {
				var el = this;
				if( !arguments.length ) return el.style('min-height');
				el.style('min-height', height);
				return this;
			},
			maxHeight: function(height) {
				var el = this;
				if( !arguments.length ) return el.style('max-height');
				el.style('max-height', height);
				return this;
			},
			flex: function(flex) {
				var el = this;
				if( !arguments.length ) return el.style('flex');
				el.style('flex', flex);
				return this;
			},
			'float': function(f) {
				var el = this;
				if( !arguments.length ) return el.style('float');
				el.style('float', f);
				return this;
			},
			bg: function(bg) {
				var el = this;

				if( !arguments.length ) {
					if( !el.style.backgroundImage && el.style.backgroundColor ) return null;

					var o = {};
					if( el.style.backgroundImage ) o['image'] = el.style.backgroundImage;
					if( el.style.backgroundColor ) o['color'] = el.style.backgroundColor;
					if( el.style.backgroundSize ) o['size'] = el.style.backgroundSize;
					if( el.style.backgroundPosition ) o['position'] = el.style.backgroundPosition;
					if( el.style.backgroundAttachment ) o['attachment'] = el.style.backgroundAttachment;
					if( el.style.backgroundRepeat ) o['repeat'] = el.style.backgroundRepeat;
					if( el.style.backgroundClip ) o['clip'] = el.style.backgroundClip;
					if( el.style.backgroundOrigin ) o['origin'] = el.style.backgroundOrigin;
				
					return o;
				}

				if( typeof(bg) === 'string' ) {
					var s = bg.trim().toLowerCase();
					if( (!~bg.indexOf('(') && !~bg.indexOf(' ')) || bg.startsWith('rgb(') || bg.startsWith('rgba(') || bg.startsWith('hsl(') || bg.startsWith('hlsa(') ) bg = {'color':bg};
					else bg = {'image':bg};
				}

				if( typeof(bg) !== 'object' ) return this;
			
				el.style('background-image', bg['image']);
				el.style('background-color', bg['color']);
				el.style('background-size', bg['size']);
				el.style('background-position', bg['position']);
				el.style('background-attachment', bg['attachment']);
				el.style('background-repeat', bg['repeat']);
				el.style('background-clip', bg['clip']);
				el.style('background-origin', bg['origin']);
				return this;
			},
			font: function(font) {
				var el = this;

				if( !arguments.length ) {
					if( !el.style.fontFamily && el.style.fontSize ) return null;

					var o = {};
					if( el.style.fontFamily ) o['family'] = el.style.fontFamily;
					if( el.style.fontSize ) o['size'] = el.style.fontSize;
					if( el.style.fontStyle ) o['style'] = el.style.fontStyle;
					if( el.style.fontVarient ) o['variant'] = el.style.fontVarient;
					if( el.style.fontWeight ) o['weight'] = el.style.fontWeight;
					if( el.style.fontSizeAdjust ) o['adjust'] = el.style.fontSizeAdjust;
					if( el.style.fontStretch ) o['stretch'] = el.style.fontStretch;
					if( el.style.letterSpacing ) o['spacing'] = el.style.letterSpacing;
					if( el.style.lineHeight ) o['height'] = el.style.lineHeight;
				
					return o;
				}

				if( typeof(font) === 'string' ) {
					var s = font.trim().toLowerCase();
					if( s.endsWith('px') || s.endsWith('pt') || s.endsWith('em') ) font = {size:font};
					else font = {family:font};
				} else if( typeof(font) === 'number' ) font = {size:font};

				if( typeof(font) !== 'object' ) return this;

				el.style('font-family', font['family']);
				el.style('font-size', font['size']);
				el.style('font-style', font['style']);
				el.style('font-variant', font['variant']);
				el.style('font-weight', font['weight']);
				el.style('font-size-adjust', font['adjust']);
				el.style('font-stretch', font['stretch']);
				el.style('letter-spacing', font['spacing']);
				el.style('line-height', font['height']);

				return this;
			},
			color: function(color) {
				var el = this;
				if( !arguments.length ) return el.style('color');
				el.style('color', color);
				return this;
			},
			border: function(border) {
				var el = this;
				if( !arguments.length ) return el.style('border');
				el.style('border', border);
				return this;
			}
		};

		// static method
		EL.isElement = function(el) {
			if( !el ) return false;

			if( !(window.attachEvent && !window.opera) ) return (el instanceof window.Element);
			else return (el.nodeType == 1 && el.tagName);
		};

		EL.eval = function(html) {
			if( typeof(html) !== 'string' ) return null;

			html = html.trim();
		
			var els = new ELs();
			var el = document.createElement('body');			
			if( html.toLowerCase().startsWith('<tr') ) el = document.createElement('tbody');
			else if( html.toLowerCase().startsWith('<tbody') ) el = document.createElement('table');
			else if( html.toLowerCase().startsWith('<td') ) el = document.createElement('tr');

			el.innerHTML = html;
			if( el.childNodes ) {
				var fordel = [];
				for(var i=0; i < el.childNodes.length; i++) {
					var child = el.childNodes[i];
					els.push(child);
					fordel.push(child);
				}

				fordel.forEach(function(item) {
					el.removeChild(item);
				});
			} else {
				console.warn('empty creation [' + html + '] attrs:[' + JSON.stringify(attrs) + ']');
			}

			if( els.length === 1 ) return new EL(els[0]);
			return els;
		};

		EL.create = function(tag, attrs) {
			if( typeof(tag) !== 'string' ) return null;

			tag = tag.trim();
		
			var el;
			if( tag.match(/^(\w+)$/ig) ) {
				el = new EL(document.createElement(tag));
			} else if( tag.startsWith('!#') ) {
				el = EL.eval(tag.substring(2));
			} else {
				el = EL.eval(tag);
			}

			if( el && el[0] ) {
				var e = el[0];
				for(var key in attrs) {
					if( !key ) continue;
					if( key.toLowerCase() == 'html' ) e.innerHTML = attrs[key] || '';
					else e.setAttribute(key, attrs[key]);
				}
			}
			return el;
		};

		EL.finds = function(qry) {
			if( !qry || typeof(qry) !== 'string' ) return null;

			var els = new ELs();
			if( qry === 'body' ) els.push(document.body);
			else if( qry === 'head' ) els.push(document.head);
			else if( document.querySelectorAll ) els.merge(document.querySelectorAll(qry));
			return els;
		};

		EL.find = function(qry) {
			if( !qry || typeof(qry) !== 'string' ) return null;

			var el;
			if( qry === 'body' ) el = document.body;
			else if( qry === 'head' ) el = document.head;
			else el = document.querySelector(qry);

			return el ? new EL(el) : null;
		};

		// misc
		EL.prototype.bind = EL.prototype.on;
		EL.prototype.unbind = EL.prototype.un;
		EL.prototype.trigger = EL.prototype.fire;

		EL.prototype.focus = function() {
			this[0].focus();
			return this;
		};

		EL.prototype.hover = function(over, out) {
		};

		EL.prototype.toggle = function(before, after) {
		};

		EL.prototype.each = function(fn) {
			fn.apply(this[0], [0, this[0]]);
		};

		EL.prototype.forEach = function(fn) {
			fn.apply(this[0], [0, this[0]]);
		};

		// Text Node
		function TextNode(element) {
			this[0] = element;
			this.__handler__ = this;
		}

		for(var k in EL.prototype) {
			var v = EL.prototype[k];
			if( typeof(v) === 'function' ) {
				TextNode.prototype[k] = function() {};
			}
		}

		TextNode.prototype.attachTo = EL.prototype.attachTo;
		TextNode.prototype.detach = EL.prototype.detach;
	
		return EL;
	})();


	var ELs = (function() {
		"use strict"

		function ELs(arr) {
			this.length = 0;
			this.merge(arr);
		}

		ELs.prototype = new Array;

		var o = EL.prototype;
		for( var k in o ) {
			if( !o.hasOwnProperty(k) ) continue;
			var fn = o[k];
			if( typeof(fn) === 'function' ) {
				(function(k, fn) {
					ELs.prototype[k] = function() {
						for(var i=0; i < this.length; i++) {
							var item = this[i];
							fn.apply(item.__handler__ || new EL(item), arguments);
						}

						return this;
					};
				})(k, fn);
			}
		}

		ELs.prototype.push = function(o) {
			if( o instanceof EL ) this[this.length++] = o[0];			
			else if( EL.isElement(o) ) this[this.length++] = o;
			else if( o && (o.nodeName == '#text' || o.nodeName == '#comment' || o.nodeName == '#cdata-section') ) this[this.length++] = o;
			else console.error('WARN:incompatible element pushed', o);
		};

		ELs.prototype.merge = function(o) {
			if( !o ) return;

			if( typeof(o.length) === 'number' ) {
				for(var i=0; i < o.length; i++) {
					this.push(o[i]);
				}
			} else {
				this.push(o);
			}
		};

		ELs.prototype.forEach = function(fn) {
			if( typeof(fn) !== 'function' ) throw new TypeError('invalid function');

			for(var i=0; i < this.length; i++) {
				var item = this[i];
				fn.apply(item, [i, item]);
			}
		};

		ELs.prototype.each = ELs.prototype.forEach;

		return ELs;
	})();


	// dom query
	var DOM = (function() {
		"use strict"

		var DOM = function(qry) {
			if( !qry ) return null;
			else if( qry instanceof EL ) return qry;
			else if( qry instanceof ELs ) return qry;
			else if( DOM.isElement(qry) ) return new EL(qry);
		

			var els = new ELs();
			if( typeof(qry) === 'object' && typeof(qry.length) === 'number' ) {
				for(var i=0; i < qry.length; i++) {
					els.push(qry[i]);
				}
			} else if( typeof(qry) === 'string' ) {
				if( qry.startsWith('!#') || qry.match(/(<([^>]+)>)/ig) || ~qry.indexOf('\n') ) {
					els = DOM.create(qry);
				} else {
					els = DOM.finds(qry);
				}
			}

			if( els && els.length === 1 ) return new EL(els[0]);
			return els;
		};

		DOM.isElement = EL.isElement;
		DOM.create = EL.create;
		DOM.eval = EL.eval;
		DOM.finds = EL.finds;
		DOM.find = EL.find;
		DOM.EL = EL;
		DOM.ELs = ELs;

		return DOM;
	})();

	// global event
	(function() {
		"use strict"

		DOM.on = function(type, fn, bubble) {
			if( !type || !fn ) throw new Error('missing:type or fn');

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
		};

		DOM.un = function(type, fn, bubble) {
			if( window.removeEventListener ) {
				window.removeEventListener(type, fn, ((bubble===true) ? true : false));
			} else {
				document.detachEvent('on' + type, fn, ((bubble===true) ? true : false));
			}
		};
	
		DOM.ready = function ready(fn) {
			DOM.on('ready', fn);
		};
		DOM.load = function load(fn) {
			DOM.on('load', fn);
		};
	})();

	// MutationObserver setup for detect DOM node changes.
	// if browser doesn't support DOM3 MutationObeserver, use MutationObeserver shim (https://github.com/megawac/MutationObserver.js)
	DOM.ready(function() {
		var observer = new MutationObserver(function(mutations){
			mutations.forEach(function(mutation) {
				if( debug('mutation') ) console.error(mutation.target, mutation.type, mutation);
				
				if( mutation.type === 'childList' ) {
					var target = mutation.target;
					var tel = target.__handler__;
					var added = mutation.addedNodes;
					var removed = mutation.removedNodes;
					
									
					if( removed ) {
						for(var i=0; i < removed.length; i++) {
							var source = removed[i].__handler__;
							
							if( tel ) {
								tel.fire('removed', {
									removed: removed[i]
								});
							}
							
							if( source ) {
								source.fire('detached', {
									from: target
								});
							}
						}
					}
					
					if( added ) {
						for(var i=0; i < added.length; i++) {
							var source = added[i].__handler__;
								
							if( tel ) {
								tel.fire('added', {
									added: added[i]
								});
							}
							
							if( source ) {
								source.fire('attached', {
									to: target
								});
							}
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

	define('dom', function(module) {
		module.exports = DOM;
	})
})();
