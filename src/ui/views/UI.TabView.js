var TabView = (function() {
	"use strict"

	function TabView(options) {
		this.$super(options);
	}
	
	TabView.prototype = {
		build: function() {
			var self = this;
			
			// create contents component
			var cards = this.cards = new UI.CardView();
			var tabbar = this.tabbar = new UI.TabBar({
				e: {
					'selected': function(e) {
						cards.select(e.index);
					}
				}
			});

			// process options
			var o = this.options;
			this.tabAlign(o.tabAlign);

			// bind events
			this.on('add', function(e) {
				return (e.item instanceof UI.Component);
			});

			this.on('added', function(e) {
				var cmp = e.item;

				cards.add(cmp);
				tabbar.add(new UI.Tab({
					title: cmp.options.title || 'Untitled',
					icon: cmp.options.icon,
					closable: (cmp.options.closable === false ) ? false : true
				}));
			});

			this.on('removed', function(e) {
				cards.remove(e.item);
				tabbar.remove(e.item);
			});

			this.on('selected', function(e) {
				tabbar.select(e.item);
			});
			
			// call super
			this.$super();
		},
		tabAlign: function(tabAlign) {
			var el = this.el;

			if( tabAlign === 'bottom' ) {
				this.cards.attachTo(this);
				this.tabbar.attachTo(this);
				this.tabbar.classes('bottom');
			} else {
				this.tabbar.attachTo(this);
				this.cards.attachTo(this);
				this.tabbar.classes('top');
			}
		}
	};
	
	TabView.inherit = '';
	TabView.style = {
		'background-color': '#242426',
		'border': '1px solid #373737',

		'position': 'relative',
		'display': 'box',
		'box-orient': 'vertical',
		'overflow': 'hidden',
		'box-flex': '1',

		'> .box': {
			'box-flex': '1',
			'display': 'box',
			'box-align': 'stretch',
			'box-pack': 'stretch',
			'box-orient': 'vertical'
		}
	};

	return TabView = UI.inherit(TabView, UI.SingleSelectableContainer);
})();

UI.TabView = UI.component('tabview', TabView);