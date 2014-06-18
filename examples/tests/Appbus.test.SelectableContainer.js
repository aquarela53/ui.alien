if( !window.Appbus.test ) window.Appbus.test = {};

Appbus.test.SelectableContainer = (function() {
	function Container(options) {
		this.$super(options);
	}
	
	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			var el = this.el;

			this.on('*', function(e) {
				console.error(e.type, e);
			});

			this.on('container.add', function(e) {
				console.log('add', e);
			});

			this.on('container.added', function(e) {
				console.log('added', e);				
			});

			this.el.html('Appbus.test.Container:' + (o.html || this.name()));
		}
	};

	Container.tag = 'div';
	Container.style = {
		'': {
			'background': 'orange'
		}
	};

	return Appbus.Component.define('test.selectable', Container, Appbus.SelectableContainer);
})();
