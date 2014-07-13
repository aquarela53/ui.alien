(function() {
	"use strict"

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
	
	Button.translator = function(el, attrs) {
		attrs.text = attrs.text || el.innerText;
		return new this.Button(attrs);
	};
	
	Button.fname = 'Button';
	Button.acceptable = true;
	
	return Button = UI.component('button', Button);
})();
