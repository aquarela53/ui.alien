UI.CheckField = (function() {

	function CheckField(options) {
		this.$super(options);
	}

	CheckField.prototype = {
		build: function() {
			this.checker = this.el.create('<div class="checker"></div>');
			this.label = this.el.create('<div class="label"></div>');
			this.clear = this.el.create('<div class="clear"></div>');

			var o = this.options;
			this.text(o.text);
			this.value(o.value);

			this.on('click', function(e) {
				this.value(!this.value());
			});
		},
		text: function(text) {
			if( !arguments.length ) return this.label.html();
			this.label.html(text || '');
			return this;
		},
		value: function(b) {
			if( !arguments.length ) return this.checker.hc('checked');

			if( b ) this.checker.ac('checked');
			else this.checker.rc('checked');
			return this;
		}
	};
	
	CheckField.style = {
		'margin': '5px 0',
		'cursor': ['hand', 'pointer'],

		':hover': {
			'.checker': {
				'border': '2px solid #1F805D'
			}
		},

		'.checker': {
			'float': 'left',
			'width': 13,
			'height': 13,
			'border': '1px solid rgba(155,155,155,0.7)',
			
			'..checked': {
				'border': '2px solid #1F805D',
				'background-color': '#1F805D'
			}
		},
		'.label': {
			'float': 'left',
			'margin': '0 8px',
			'line-height': 15,
			'color': '#fefefe',
			'letter-spacing': -1,
			'font-size': 11
		},
		'.clear': {
			'clear': 'both'
		}
	};

	return CheckField = UI.inherit(CheckField, UI.Field);
})();

UI.CheckField = UI.component('field.check', UI.CheckField);