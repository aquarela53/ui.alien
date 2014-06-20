(function() {
	"use strict"
	
	var UI = require('ui');

	function Button(options) {
		this.$super(options);
	}

	Button.prototype = {
		build: function() {
			var o = this.options;
			this.text(o.text);
			this.icon(o.icon);
			this.image(o.image);
		},
		makeup: function() {
			this.el.html('<div class="inner"><div class="text">' + this.text() + '</div></div>');
		},
		text: function(text) {
			if( !arguments.length ) return this._text;
			this._text = text;
			this.makeup();
			return this || '';
		},
		icon: function(icon) {
			if( !arguments.length ) return this._icon;
			this._icon = icon;
			this.makeup();
			return this;
		},
		image: function(image) {
			if( !arguments.length ) return this._image;
			this._image = image;
			this.makeup();
			return this;
		}
	};

	Button.style = {
		'cursor': ['hand', 'pointer'],
		'min-height': 32,
		'color': '#f6f6f6',
		'background-color': 'transparent',
		
		'.inner': {
			'display': 'table',
			'table-layout': 'fixed',
			'width': '100%',
			'height': '100%'
		},
		'.text': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'vertical-align': 'middle',
			'width': '100%',
			'height': '100%',
			'text-align': 'center',
			'letter-spacing': 0,
			'font-weight': 'bold',
			'font-size': 12,
			'line-height': 12,
			'padding': '9px'
		},
		
		'..glass': {
			':hover': {
				'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 51%)'
			}
		},

		':hover': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
		},
		
		'..grey': {
			'background-color': '#2e2e2e'
		},
		'..grey.dark': {
			'background-color': '#232323'
		},
		'..green': {
			'background-color': '#1f7e5c'
		},
		'..green.dark': {
			'background-color': '#1a664a'
		},
		'..red': {
			'background-color': '#e66c69'
		},
		'..red.dark': {
			'background-color': '#b85655'
		},
		'..yellow': {
			'background-color': '#daa571'
		},
		'..yellow.dark': {
			'background-color': '#af845a'
		},
		'..blue': {
			'background-color': '#5b9aa9'
		},
		'..blue.dark': {
			'background-color': '#497b86'
		},
		'..purple': {
			'background-color': '#6b5b8c'
		},
		'..purple.dark': {
			'background-color': '#554971'
		},
		'..wine': {
			'background-color': '#8b5d79'
		},
		'..wine.dark': {
			'background-color': '#704a61'
		},
		'..twitter': {
			'background-color': '#2589c5'
		},
		'..twitter.dark': {
			'background-color': '#0067bc'
		},
		'..facebook': {
			'background-color': '#3b5999'
		},
		'..facebook.dark': {
			'background-color': '#2f4785'
		}
	};
	
	Button.translator = {
		selector: 'btn',
		fn: function(el, attrs) {
			attrs.text = el.innerText;
			return new this.Button(attrs);
		}
	};

	Button.acceptable = true;
	
	return Button = UI.component('button', Button);
})();
