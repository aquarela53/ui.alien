Class.define('UI.LinkField', {
	$extends : UI.Component,

	LinkField : function(o) {
		this.$super(o);
	},

	build: function() {
		var o = this.options;
		var self = this;

		this.label = o.label;
		this.value = (o.value || '');
		this.placeholder = (o.placeholder || '');
		this.type = (o.type || '');
		this.autocomplete = o.autocomplete || 'off';
		this.autocapitalize = o.autocapitalize || 'off';
		this.autocorrect = o.autocorrect || 'off';

		var fireChanged = function() {
			self.fire('changed', self.value);
		};

		var select = this.select = El('select');
		select.html('<option value="">직접입력</option>' + 
			'<option value="url">웹페이지</option>' + 
			'<option value="tel">전화연결</option>' + 
			'<option value="sms">SMS 보내기</option>' + 
			'<option value="mailto">메일주소</option>');
		this.attach(select);
		
		
		var field = this.field = El('input');
		field.attr('id', this.id() + '-tx');
		field.attr('type', this.type || 'text');
		field.attr('placeholder', this.placeholder);
		if(this.value) field.attr('value', this.value);
		
		if( UI.is.iOS ) {
			field.attr('autocomplete', this.autocomplete);
			field.attr('autocapitalize', this.autocapitalize);
			field.attr('autocorrect', this.autocorrect);
		}
		
		field.on('focus', function(e) {
			//window.scrollTo(0,0);
		});
		field.on('keyup', function(e) {
			self.fire('keyup', self, field.value);

			if( field.value == self.value ) return;
			else self.value = field.value;
			
			if( self._timerFn ) clearTimeout(self._timerFn);
			self._timerFn = setTimeout(fireChanged, ((e.keyCode == 13) ? 10 : 2000));
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
		if( !value && value !== 0 ) value = '';
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
		console.log(this.select.value);
		if( this.value ) {
			if( this.select.value == 'tel' && !this.value.startsWith('tel:') ) {
				return 'tel:' + this.value;
			} else if( this.select.value == 'sms' && !this.value.startsWith('sms:') ) {
				return 'sms:' + this.value;
			} else if( this.select.value == 'mailto' && !this.value.startsWith('mailto:') ) {
				return 'mailto:' + this.value;
			} else if( this.select.value == 'url' && this.value.indexOf(':') < 0 ) {
				return 'http://' + this.value;
			}
		}

		return this.value;
	}
});

UI.LinkField.style = {
	namespace: 'fld-link',
	
	'> .proxyfield': {
		'font-size': '13px',
		'height': '25px',
		'line-height': '25px',
		'font-weight': 'bold',
		'border': 'none',
		'color': '#000000',
		'overflow': 'hidden',
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis',
		'padding': '0 8px'
	},
	'> input': {
		'ime-mode': 'active',
		'width': '100%',
		'background-color': 'transparent',
		'font-size': '13px',
		'height': '25px',
		'line-height': '25px',
		'font-weight': 'bold',
		'border': 'none',
		//'margin': '0',
		//'padding': '10px',
		'color': '#000000'
	},
	'> input::input-placeholder': {		
		'font-size': '13px',
		'font-weight': 'bold'
	}
};

UI.Component.addType(UI.LinkField);
