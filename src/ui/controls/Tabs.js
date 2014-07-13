(function() {
	"use strict";
	
	function Tabs(options) {
		this.$super(options);
	}
	
	Tabs.prototype = {
		build: function() {
			var map = new Map();
			
			// sub dom
			var ul = this.el.create('ul.tabs');
			
			// options
			var o = this.options;
			this.tabAlign(o.tabAlign);

			// events			
			this.on('added', function(e) {
				var item = e.item;

				var html = '<li>' + 
					'<a href="javascript:;" class="tab">' + 
						'<span class="octicon octicon-diff-added"></span>' + 
						'<span class="title">' + (item.title || 'untitled') + '</span>' + 
						((item.extra || item.extra === 0) ? '<span class="extra">' + item.extra + '</span>' : '') + 
					'</a>' + 
				'</li>';

				var tab = $(html);
				ul.append(tab);

				map.set(item, tab);
				
				var self = this;
				tab.on('click', function(e) {
					self.select(item);
					
					// execute href action if exists
					if( item.href ) self.action(item.href);					
				});

				if( !this.selected() || item.selected ) this.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.item);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').rc('selected');
			});

			this.$super();
		},
		tabAlign: function(tabAlign) {
			if( !arguments.length ) return this.el.hc('bottom') ? 'bottom' : 'top';

			if( tabAlign === 'bottom' ) this.el.rc('top').ac('bottom');
			else this.el.rc('bottom').ac('top');

			return this;
		}
	};
	
	Tabs.style = {};
	
	Tabs.inherit = 'container';
	Tabs.fname = 'Tabs';
	Tabs.translator = Container.translator('tabs');
	
	return Tabs = UI.component('tabs', Tabs);
})();

