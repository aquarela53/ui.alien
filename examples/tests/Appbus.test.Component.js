if( !window.Appbus.test ) window.Appbus.test = {};

Appbus.test.Component = (function() {
	function Test(options) {
		this.$super(options);
	}

	Test.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			var el = this.el;

			this.fire('test', {a:'1'});

			this.on('*', function(e) {
				//console.error(e.type, e);
			});

			this.on('attached staged', function(e) {
				//console.error('multi', e.type);
			});

			el.html('Appbus.test.Component:' + (o.html || this.name()));
		},
		activate: function() {
			this.el.ac('active');
		},
		deactivate: function() {
			this.el.rc('active');
		}
	};
	
	Test.tag = 'div';
	Test.style = {
		'': {
			'border': '1px solid black',
			'border-bottom': 'none',
			'padding': 5,
			'cursor': 'pointer'
		},
		':last-child': {
			'border-bottom': '1px solid black'
		},
		'..active': {
			'background': 'silver'
		}
	};

	return Appbus.Component.define('test', Test);
})();
