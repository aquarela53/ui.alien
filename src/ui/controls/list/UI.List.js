UI.List = (function() {
	function List(options) {
		this.$super(options);
	}

	List.prototype = {
		build: function() {
			var o = this.options;
			this.innerborder(o.innerborder);

			// attach events
			this.on('add', function(e) {
				var item = e.item;
				if( item instanceof UI.Component ) return;

				e.item = new UI.ListItem(item);
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('remove', function(e) {
				e.item.detach();
			});

			this.$super();
		},
		innerborder: function(innerborder) {
			if( !arguments.length ) return this.el.hc('innerborder');

			if( innerborder === false ) this.el.rc('innerborder');
			else this.el.ac('innerborder');

			return this;
		}
	};

	List.style = {
		'position': 'relative',
		'border': '1px solid #d9d9d9',

		'> .clickable:hover': {
			'background-color': '#d9d9d9'
		},
		'> .clickable:hover .separator': {
			'background-color': '#d9d9d9'
		},
		
		'..innerborder > .a-cmp': {			
			'border-bottom': '1px solid #d9d9d9'
		},
		'..innerborder > .a-cmp:last-child': {			
			'border-bottom': 'none'
		},
		'..dark': {
			'background-color': '#232323',
			'color': '#fcfcfc',
			'border': 'none',

			'> .clickable:hover': {
				'background-color': '#6A5A8C'
			},
			'> .clickable:hover .separator': {
				'background-color': '#6A5A8C'
			},
			
			'..innerborder > .a-cmp': {			
				'border-bottom': '1px solid #2e2e2e'
			},
			'..innerborder > .a-cmp:last-child': {			
				'border-bottom': 'none'
			}
		}
	};

	return List = UI.inherit(List, UI.SelectableContainer);
})();

UI.List = UI.component('list', UI.List);