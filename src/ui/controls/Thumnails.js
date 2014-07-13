UI.Thumnails = (function() {
	"use strict"

	function Thumnails(options) {
		this.$super(options);
	}

	Thumnails.prototype = {
		build: function() {
			var self = this;
			var map = new Map();
			
			// create dom
			var ul = this.el.create('ul');

			// apply options
			var o = this.options;
			this.size(o.size);			

			// bind events
			this.on('add', function(e) {
				var item = e.item;

				if( typeof(item) === 'string' ) item = {src:item};				
				if( typeof(item) !== 'object' ) return false;

				e.item = item;
			});

			this.on('added', function(e) {
				var item = e.item;

				var html = '<li class="item">' + 
					'<img src="' + item.src + '" />' + 
					'<div class="mask" title="' + (item.title || '') + '"></div>' +
				'</li>';

				var thumnail = $(html);
				ul.attach(thumnail);

				map.set(item, thumnail);
				
				(function(thumnail, item) {
					thumnail.on('click', function(e) {
						self.select(item);
					});

					thumnail.on('mouseover', function(e) {
						self.fire('over', {
							item: item
						});
						e.stopPropagation();
					});

					thumnail.on('mouseout', function(e) {
						self.fire('out', {
							item: item
						});
						e.stopPropagation();
					});
				})(thumnail, item);

				if( !self.selected() || item.selected ) self.select(item);
				
			});

			this.on('removed', function(e) {
				var itemEl = map.get(e.item);
				if( itemEl ) itemEl.detach();
			});

			this.on('selected', function(e) {
			});

			this.on('deselected', function(e) {
			});

			this.$super();
		},
		size: function(size) {
			if( !arguments.length ) return this._size || {width:50,height:50};

			if( typeof(size) === 'object' && !(this.size.width || this.size.height) ) this._size = size;
			else console.error('invalid size object');

			this.css({
				'.item': {
					'width': size.width,
					'height': size.height,
					'border': size.border
				}
			});
			
			return this;
		}
	};
	
	Thumnails.style = {
		'.thumnails': {
			'overflow': 'hidden',
			'list-style': 'none'
		},
		'.item': {
			'position': 'relative',
			'cursor': ['hand', 'pointer'],
			'float': 'left',
			'width': 49,
			'overflow': 'hidden'
		},
		'.item img': {
			'width': '100%'
		},
		'.item .mask': {
			'position': 'absolute',
			'box-sizing': 'border-box',
			'top': 0,
			'bottom': 0,
			'left': 0,
			'right': 0
		},
		'.item:hover .mask': {
			'border': '2px solid #484348'
		}
	};

	return Thumnails = UI.inherit(Thumnails, UI.SingleSelectableContainer);
})();

UI.Thumnails = UI.component('thumnails', UI.Thumnails);