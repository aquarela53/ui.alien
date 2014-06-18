Class.define('UI.DateField', {
	$extends : UI.Component,

	DateField : function(o) {
		this.$super(o);
		var o = options;
		this.value = (o.value || '');
		this.placeholder = (o.placeholder || '');
	},

	build: function() {
		var o = this.options;
		var self = this;

		var fireChanged = function() {
			self.fire('changed', self.field.value);
		};

		var field = this.field = El('input');
		field.attrs({
			'id': this.id() + '-tx',
			'placeholder': this.placeholder,
			'value': this.value
		});

		field.on('keyup', function(e) {
			self.fire('keyup', field.value);
			
			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, 1000);
		});
		field.on('blur', function(e) {
			self.fire('blur', field.value);
		});

		this.attach(field);
	},

	setValue: function(value) {
		if( ! value ) value = '';
		this.value = value;

		this._make();
	},

	getValue: function() {
		return this.value;
	}
});

UI.DateField.style = {
	namespace: 'datefield',
	'> input': {
		'width': '100%',
		'background': 'transparent',
		'font-size': '12px',
		'border': 'none',
		'margin': '0',
		'padding': '0',
		'color': '#385487'
	}
};
