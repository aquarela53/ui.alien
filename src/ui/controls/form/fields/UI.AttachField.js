Class.define('UI.AttachField', {
	$extends : UI.Component,

	AttachField : function(o) {
		this.$super(o);
	},

	build: function() {
		var o = this.options;
		var self = this;

		this.text = (o.text || '찾아보기');
		this.value = o.value;
		this.filename = o.filename;
		this.url = o.url;

		this.el.innerHTML = '';

		if( this.field ) {
			delete this.filefield;
			delete this.field;
		}

		var filefield = this.filefield = El('input');
		filefield.attr('type', 'file');
		filefield.css({
			'visibility': 'hidden',
			'width': 0,
			'height': 0
		});
		this.attach(filefield);
		
		var onchange = function(e) {
			if( self.url ) {
				UI.Ajax.upload({
					url: self.url,
					file: filefield,
					success: function(result) {
						var files = JSON.parse(result.files);

						if( files && typeof(files) == 'object' ) {
							self.setValue(files);
						} else {
							self.setValue(url || uri);
						}
						self.filefield.value = '';
					},
					error: function(result,a,b,c,d,e) {
						self.filefield.value = '';
						
						alert('업로드 실패: ' + (result.localizedMessage || result.message || result));
					}
				});
			} else {
				alert('업로드 실패: URL이 지정되지 않았습니다.');
			}
		};
		filefield.on('change', onchange);		

		
		//클리어 버튼
		var clearBtn = this.clearBtn = El('div');
		clearBtn.css({			
			'display': 'inline-block',
			'textAlign': 'center',
			'color': 'white',
			'background': 'rgba(166,19,14,1)',
			'innerHTML': 'X'
		});
		this.attach(clearBtn);
		
		clearBtn.on('click', function() {
			self.setValue(o.value);
		});


		//업로드 버튼
		var field = this.field = El('div');
		this.setValue(o.value);	
		this.attach(field);
		
		field.on('click', function() {
			//console.log('클릭', self.filefield);
			setTimeout(function() {
				var pe = document.createEvent('MouseEvent');
				pe.initMouseEvent('click', true, false, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
				self.filefield.dispatchEvent(pe);
			}, 10);
		});
	},

	setDefault: function(value) {
		this.setValue(value);
		this.options.value = value;
	},

	setValue: function(value) {
		if( ! value ) value = '';

		if( value != this.value ) {
			this.value = value;
			
			if( this.field ) {
				var filename = this.value;
				var label;
				if( typeof(filename) == 'object' ) {
					filename = this.value.thumnail || this.value.url || this.value.uri || this.value.file || this.value.image || this.value.icon;
					label = this.value.origin;
				}

				if( filename && filename.lastIndexOf('/') ) filename = filename.substring(filename.lastIndexOf('/') + 1);
				if( !label ) label = filename;
				this.field.innerHTML = this.filename || label || this.text;
			}
						
			this.fire('changed', this);
		}
	},

	getValue: function() {
		return this.value;
	}
});

UI.AttachField.style = {
	namespace: 'fld-attach',
	'> div': {
		'cursor': 'pointer',
		'float': 'right',
		'background': 'rgba(136,149,176,0.9)',
		'border-radius': '20px',
		'padding': '4px 8px',
		'margin-right': '10px',
		
		'font-size': '13px',
		'font-weight': 'bold',
		'color': 'white',
		'max-width': '70%',
		'overflow': 'hidden',
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis'
	}
};

UI.Component.addType(UI.AttachField);
