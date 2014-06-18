UI.MultiButton = (function() {
	"use strict"

	function MultiButton(options) {
		this.$super(options);
	}

	MultiButton.prototype = {
		build: function() {
			var o = this.options;
			var self = this;
			
			this.btns = new Map();
			this.fit(o.fit);

			this.on('added', function(e) {
				var item = e.item;

				var btn = El.create('div');
				if( item.disabled ) btn.ac('disabled');

				var w = item.width || item.w;
				if( typeof(w) === 'number' ) btn.css('width', w + 'px');
				if( typeof(w) === 'string' ) btn.css('width', w);

				var xw = item.maxWidth || item.xw;
				if( typeof(xw) === 'number' ) btn.css('max-width', xw + 'px');
				if( typeof(xw) === 'string' ) btn.css('max-width', xw);

				var mw = item.minWidth || item.mw;
				if( typeof(mw) === 'number' ) btn.css('min-width', mw + 'px');
				if( typeof(mw) === 'string' ) btn.css('min-width', mw);
				
				if( item.html ) {
					btn.html(item.html);
				} else {
					if( item.image ) btn.html('<img src="' + item.image + '" />');
					if( item.text ) btn.html('<span>' + item.text + '</span>');
				}
				
				(function(btn, item) {
					btn.on('mousedown', function(e) {
						if( self.selectable === 'multi' ) {
							if( self.isSelected(item) ) self.deselect(item);
							else self.select(item);
						} else {
							self.select(item);
						}
					});
				})(btn, item);
				
				self.btns.set(item, btn);
				self.attach(btn);

				if( item.selected ) self.select(item);
			});
			
			this.on('removed', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.detach();
					self.btns.remove(e.item);
				}
			});

			this.on('select', function(e) {
				var btn = self.btns.get(e.item);
				if( btn.hc('disabled') ) return false;
			});

			this.on('selected', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.ac('active');						
					self.fire('active', {
						originalEvent: e,
						item: e.item						
					});
				}
			});

			this.on('deselected', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.rc('active');
					self.fire('deactive', {
						originalEvent: e,
						item: e.item						
					});
				}
			});
		},
		fit: function(fit) {
			if( fit === undefined ) return this.el.hc('fit');

			if( fit ) this.el.ac('fit');
			else this.el.rc('fit');
		}
	};

	MultiButton.style = {
		'display': 'box',
		'margin': '1px',

		'..fit': {
			'box-flex': 1,
			'width': '100%'
		},
		'> div.disabled': {
			'color': '#bbb'
		},
		'> div': {
			'display': 'box',
			'box-align': 'center',
			'box-pack': 'center',
			'box-flex': '1',
			'min-width': 30,
			'padding': '5px 10px',
			'margin': '0',
			'margin-bottom': '1px',
			'cursor': 'pointer',
			'font-weight': 'bold',
			'font-size': '11px',
			'border': '1px solid rgba(109,109,109,0.5)',
			'border-left': 'none'
		},
		'> div.active': {
			'border': '1px solid #fff',
			'border-left': 'none',
			'color': 'black',
			'background-color': '#fff'
		},
		'> div:first-child': {
			'border-left': '1px solid rgba(109,109,109,0.5)',
			'border-top-left-radius': '4px',
			'border-bottom-left-radius': '4px'
		},
		'> div:last-child': {
			'border-left': 'none',
			'border-top-right-radius': '4px',
			'border-bottom-right-radius': '4px'
		},
		'> div > span': {
			'display': 'block',
			'max-width': '100%',
			'overflow': 'hidden',
			'white-space': 'nowrap',
			'text-overflow': 'ellipsis'
		},
		'..ios': {
			'> div.disabled': {
				'color': '#bbb',
				'text-shadow': 'rgba(0, 0, 0, 0.3) 0 -1px 0'
			},
			'> div': {
				'text-shadow': 'black 0 1px 0',
				'background-image': 'linear-gradient(bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
				'border': '1px solid rgba(109,109,109,0.5)',
				'border-left': 'none',
				'box-shadow': 'inset 0 1px 1px rgba(0,0,0,0.5), 0 1px rgba(255,255,255,0.5)'
			},
			'> div.active': {
				'border': '1px solid #eee',
				'border-left': 'none',
				'color': 'black',
				'text-shadow': 'white 0 1px 0',
				'background-color': '#ccc',
				'background-image': 'linear-gradient(bottom, #eee 0%, #fff 100%)',
				'box-shadow': '0 1px rgba(255,255,255,0.5)'
			},
			'> div:first-child': {
				'border-left': '1px solid rgba(109,109,109,0.5)',
				'border-top-left-radius': '4px',
				'border-bottom-left-radius': '4px'
			},
			'> div:last-child': {
				'border-left': 'none',
				'border-top-right-radius': '4px',
				'border-bottom-right-radius': '4px'
			}
		},
		'..vintage': {
			'> div': {
				'box-shadow': 'inset 0 1px 10px rgba(0,0,0,0.2), 0 1px rgba(255,255,255,0.3)'
			}
		},
		'..red': {
			'> div': {
				'background-color': 'rgba(141,13,0,0.8)'
			}
		}
	};

	return MultiButton = UI.inherit(MultiButton, UI.Component);
})();

UI.MultiButton = UI.component('multibutton', UI.MultiButton);