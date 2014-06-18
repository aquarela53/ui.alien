if( !window.Appbus.test ) window.Appbus.test = {};

Appbus.test.Container = (function() {
	function Container(options) {
		this.$super(options);
	}
	
	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			var el = this.el;

			this.on('*', function(e) {
				//console.error(e.type);
			});

			this.on('container.add', function(e) {
				//console.log('add', e.item);

				if( e.item === 3 ) return false;
			});

			this.on('container.added', function(e) {
				var item = e.item;

				//console.log('added', item);
				el.attach('this is ' + item + '<a href="#">' + item + '</a><div>' + item + '</div><br/>');

				new Appbus.test.Component({html:item}).attachTo(self);
			});

			el.html('Appbus.test.Container:' + (o.html || this.name()));
		}
	};

	Container.tag = 'div';
	Container.style = {
		'': {
			'background': 'orange'
		}
	};


	return Appbus.Component.define('test.container', Container, Appbus.Container);
})();
