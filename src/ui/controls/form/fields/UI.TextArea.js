Class.define('UI.TextArea', {
	$extends : UI.Component,

	TextArea : function(o) {
		this.parent(o);
	},

	build: function() {
		var o = this.options;
		var self = this;

		this.value = (o.value || '');
		this.placeholder = (o.placeholder || '');

		var fireChanged = function() {
			self.fire('changed', self.field.value);
		};
		
		var field = this.field = El('textarea');
		field.attr('placeholder', this.placeholder);
		field.html(this.value);
		field.on('focus', function(e) {
			self.fire('focus', e);
		});
		field.on('keyup', function(e) {
			self.fire('keyup', self, field.value);

			if( field.value == self.value ) return;
			else self.value = field.value;
			
			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, ((e.keyCode == 13) ? 2000 : 2000));
		});
		field.on('blur', function(e) {
			self.fire('blur', self, field.value);

			if( field.value == self.value ) return;
			else self.value = field.value;

			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, 10);
		});

		this.attach(field);
	},

	setValue: function(value) {
		if( ! value ) value = '';
		this.value = value;

		if( this.field ) {
			if( this.field.tagName == 'DIV' ) {
				this.field.innerText = this.value;
			} else {
				this.field.value = this.value;
			}
		}
	},

	getValue: function() {
		return this.value;
	}
});

UI.TextArea.style = {
	namespace: 'fld-textarea',
	'display': 'block',
	'height': '100px',
	'overflow': 'hidden',

	'> .proxyfield': {
		'font-size': '13px',
		'line-height': '25px',
		'font-weight': 'bold',
		'border': 'none',
		'color': '#000000',
		'padding': '0 8px'
	},
	'> textarea': {
		'ime-mode': 'active',
		'display': 'block',
		'box-sizing': 'border-box',
		'width': '100%',
		'height': '100%',
		'background-color': 'transparent',
		'font-size': '13px',
		'font-weight': 'bold',
		'border': 'none',
		'padding-left': '5px',
		'padding-top': '14px',
		'padding-bottom': '14px',
		'color': '#000000'
	},
	'> textarea::input-placeholder': {		
		'font-size': '12px',
		'font-weight': 'bold'
	}
};

UI.Component.addType(UI.TextArea);
UI.Field.TYPES['textarea'] = UI.TextArea;