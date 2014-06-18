UI.NumberField = new Class({
	$extends : UI.Component,
	namespace: 'numberfield',

	NumberField : function(o) {
		this.$super(o);
	},

	build: function() {
		var o = this.options;
		var self = this;

		this.value = (o.value || '');
		this.placeholder = (o.placeholder || '');
		this.type = (o.type || '');
		this.autocomplete = o.autocomplete || 'off';
		this.autocapitalize = o.autocapitalize || 'off';
		this.autocorrect = o.autocorrect || 'off';

		var fireChanged = function() {
			self.fire('changed', self.value);
		};

		var field = this.field = El('input');
		field.attr('id', this.id() + '-tx');
		field.attr('type', 'number');
		field.attr('placeholder', this.placeholder);
		field.attr('autocomplete', this.autocomplete);
		field.attr('autocapitalize', this.autocapitalize);
		field.attr('autocorrect', this.autocorrect);

		field.attr('value', this.value);
		field.on('focus', function(e) {
			//window.scrollTo(0,0);
		});
		field.on('keyup', function(e) {
			if( field.value === self.value ) return;
			
			var value = parseInt(field.value);

			if( isNaN(value) ) field.value = ((self.value) ? self.value : '');
			self.value = value;

			self.fire('keyup', self.value);
			
			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, ((e.keyCode == 13) ? 10 : 2000));
		});
		field.on('blur', function(e) {
			if( field.value === self.value ) return;
			
			var value = parseInt(field.value);

			if( isNaN(self.value) ) field.value = ((self.value) ? self.value : '');
			self.value = value;
			
			self.fire('blur', self.value);

			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, 10);
		});

		this.attach(field);
	},

	setValue: function(value) {
		if( ! value ) value = '';
		
		value = parseInt(value);
		if( isNaN(value) ) return;

		this.value = parseInt(value);

		if( this.field ) this.field.value = this.value;
	},

	getValue: function() {
		return this.value;
	}
});

UI.NumberField.style = {
	namespace: 'fld-number',
	'> input': {
		'width': '100%',
		'box-sizing': 'border-box',
		'background': 'transparent',
		'font-size': '13px',
		'font-weight': 'bold',
		'border': 'none',
		'margin': '0',
		'padding': '0',
		'padding': '5px',
		'color': 'black'
	},
	'> input::input-placeholder': {		
		'font-size': '13px',
		'font-weight': 'bold'
	}
};

UI.Component.addType(UI.NumberField);
