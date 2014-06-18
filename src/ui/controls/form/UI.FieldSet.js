UI.FieldSet = (function() {
	"use strict"

	function FieldSet(o) {
		this.$super(o);
	}
	
	FieldSet.prototype = {
		build: function() {
			// apply options
			var o = this.options;
			this.legend(o.legend);
			this.bordered(o.border);

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.$super();
		},
		bordered: function(border) {
			if( !arguments.length ) return this.el.hc('bordered');
			if( !border ) this.el.rc('bordered');
			else this.el.ac('bordered');
			this.$super(border);
			return this;
		},
		legend: function(legend) {
			if( !arguments.length ) return this._legend ? this._legend.html() : null;

			if( !legend ) {
				if( this._legend ) this._legend.detach();
				return this;
			}


			if( !this._legend ) this._legend = this.el.create('legend');
			this._legend.html(legend);

			return this;
		}
	}
	
	FieldSet.tag = 'fieldset';
	FieldSet.style = {
		'border': 'none',

		'> legend': {
			'display': 'none'
		},

		'..bordered': {
			'border': '1px solid rgba(255,255,255,0.2)',
			'padding': 3,
			'margin': 3,

			'> legend': {
				'display': 'block',
				'font-size': 11,
				'font-weight': 'bold',
				'color': 'rgba(255,255,255,0.8)'
			}
		}
	};

	return FieldSet = UI.inherit(FieldSet, UI.Attachable);
})();

UI.FieldSet = UI.component('fieldset', UI.FieldSet);