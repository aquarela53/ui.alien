(function() {
	"use strict";

	function Buttons(options) {
		this.$super(options);
	}

	Buttons.prototype = {
		build: function() {
			var o = this.options;
			
			var btns = this.btns = new Map();

			this.on('added', function(e) {
				var item = e.item;

				var btn = this.el.create('div.button');
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
				
				if( item.html ) btn.html(item.html);
				else if( item.image ) btn.html('<img src="' + item.image + '" />');
				else if( item.text ) btn.html('<span>' + item.text + '</span>');
				else btn.html('<span>' + item + '</span>');
				
				var self = this;
				btn.on('mousedown', function(e) {
					self.select(item);
				});
				
				btns.set(item, btn);

				if( item.selected ) this.select(item);
			});
			
			this.on('removed', function(e) {
				var btn = this.btns.get(e.item);
				if( btn ) {
					btn.detach();
					this.btns.remove(e.item);
				}
			});

			this.on('select', function(e) {
				var btn = this.btns.get(e.item);
				if( btn.has('disabled') ) return false;
			});

			this.on('selected', function(e) {
				var btn = this.btns.get(e.item);
				if( btn ) {
					btn.ac('active');						
					this.fire('active', {
						originalEvent: e,
						item: e.item
					});
				}
			});

			this.on('deselected', function(e) {
				var btn = this.btns.get(e.item);
				if( btn ) {
					btn.rc('active');
					this.fire('deactive', {
						originalEvent: e,
						item: e.item
					});
				}
			});
		}
	};

	Buttons.style = {};
	
	Buttons.inherit = 'container';
	Buttons.fname = 'Buttons';
	Buttons.translator = Container.translator('buttons');
	
	return Buttons = UI.component('buttons', Buttons);
})();