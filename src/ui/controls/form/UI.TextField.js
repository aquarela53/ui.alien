UI.TextField = (function() {
	"use strict"

	function TextField(options) {
		this.$super(options);
	}

	TextField.prototype = {
		build: function() {
			// options
			var o = this.options;
			this.type(o.type || 'text');
			this.value(o.value);
			this.placeholder(o.placeholder);
			this.autocomplete(o.autocomplete);
			this.autocapitalize(o.autocapitalize);
			this.autocorrect(o.autocorrect);
			this.threshold(o.threshold);

			// events
			var self = this;
			var el = this.el;
			var current, timer;
			var changed = function() {
				self.fire('changed', self.value());
			};
			
			el.on('keyup', function(e) {
				var value = el.value();

				if( value === current ) return;
				else current = value;
				
				if( timer ) clearTimeout(timer);
				timer = setTimeout(changed, ((e.keyCode == 13) ? 1 : self.threshold()));
			});
			el.on('blur', function(e) {
				var value = el.value();

				if( value === current ) return;
				else current = value;
				
				if( timer ) clearTimeout(timer);
				timer = setTimeout(changed, ((e.keyCode == 13) ? 1 : self.threshold()));
			});
		},
		value: function(value) {
			if( !arguments.length ) return this.el.value();
			this.el.value(value || '');
			return this;
		},
		placeholder: function(placeholder) {
			if( !arguments.length ) return this.el.attr('placeholder');
			this.el.attr('placeholder', placeholder);
			return this;
		},
		type: function(type) {
			if( !arguments.length ) return this.el.attr('type');
			this.el.attr('type', type);
			return this;
		},
		autocomplete: function(autocomplete) {
			if( !arguments.length ) return this.el.attr('autocomplete');
			this.el.attr('autocomplete', autocomplete);
			return this;
		},
		autocapitalize: function(autocapitalize) {
			if( !arguments.length ) return this.el.attr('autocapitalize');
			this.el.attr('autocapitalize', autocapitalize);
			return this;
		},
		autocorrect: function(autocorrect) {
			if( !arguments.length ) return this.el.attr('autocorrect');
			this.el.attr('autocorrect', autocorrect);
			return this;
		},
		threshold: function(threshold) {
			if( !arguments.length ) return this._threshold || 500;
			this._threshold = threshold;
			return this;
		}
	};
	
	TextField.tag = 'input';
	TextField.style = {
		'font-size': '1em',
		'border': '2px solid transparent',
		'outline': '0',
		'height': 35,
		'line-height': 20,
		'box-shadow': 'none',
		'color': 'white',
		'padding': 3,
		'background-color': 'transparent',

		'..search': {
			'padding': '0 0 0 34px',
			'background-position': '5px 50%',
			'background-repeat': 'no-repeat',
			'background-size': '20px',
			'background-image': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJzZWFyY2hfMV8iPg0KCTxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yMCwwLjAwNWMtNi42MjcsMC0xMiw1LjM3My0xMiwxMmMwLDIuMDI2LDAuNTA3LDMuOTMzLDEuMzk1LDUuNjA4bC04LjM0NCw4LjM0MmwwLjAwNywwLjAwNg0KCQlDMC40MDYsMjYuNjAyLDAsMjcuNDksMCwyOC40NzdjMCwxLjk0OSwxLjU4LDMuNTI5LDMuNTI5LDMuNTI5YzAuOTg1LDAsMS44NzQtMC40MDYsMi41MTUtMS4wNTlsLTAuMDAyLTAuMDAybDguMzQxLTguMzQNCgkJYzEuNjc2LDAuODkxLDMuNTg2LDEuNCw1LjYxNywxLjRjNi42MjcsMCwxMi01LjM3MywxMi0xMkMzMiw1LjM3OCwyNi42MjcsMC4wMDUsMjAsMC4wMDV6IE00Ljc5NSwyOS42OTcNCgkJYy0wLjMyMiwwLjMzNC0wLjc2OCwwLjU0My0xLjI2NiwwLjU0M2MtMC45NzUsMC0xLjc2NS0wLjc4OS0xLjc2NS0xLjc2NGMwLTAuNDk4LDAuMjEtMC45NDMsMC41NDMtMS4yNjZsLTAuMDA5LTAuMDA4bDguMDY2LTguMDY2DQoJCWMwLjcwNSwwLjk1MSwxLjU0NSwxLjc5MSwyLjQ5NCwyLjQ5OEw0Ljc5NSwyOS42OTd6IE0yMCwyMi4wMDZjLTUuNTIyLDAtMTAtNC40NzktMTAtMTBjMC01LjUyMiw0LjQ3OC0xMCwxMC0xMA0KCQljNS41MjEsMCwxMCw0LjQ3OCwxMCwxMEMzMCwxNy41MjcsMjUuNTIxLDIyLjAwNiwyMCwyMi4wMDZ6Ii8+DQoJPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTIwLDUuMDA1Yy0zLjg2NywwLTcsMy4xMzQtNyw3YzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVzMC41LTAuMjI0LDAuNS0wLjVjMC0zLjMxMywyLjY4Ni02LDYtNg0KCQljMC4yNzUsMCwwLjUtMC4yMjQsMC41LTAuNVMyMC4yNzUsNS4wMDUsMjAsNS4wMDV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==)'			
		},
		
		':hover': {
			'border': '2px solid rgba(255,255,255,0.15)'
		},
		':focus': {
			'border': '2px solid #1F7F5C'
		},
		'::input-placeholder': {
			'font-size': '9pt',
			'font-weight': 'bold'
		}
	};

	return TextField = UI.inherit(TextField, UI.Field);
})();

UI.TextField = UI.component('field.text', UI.TextField);