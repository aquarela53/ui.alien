UI.TableHeader = (function() {
	"use strict"
		
	// class body
	function TableHeader(options) {
		this.$super(options);
	}
	
	TableHeader.prototype = {
		build: function() {
			var o = this.options;

			this.html('<div class="headers">table header</div>');
		},
		body: function(body) {
			if( !arguments.length ) return this._body;

			if( body instanceof UI.TableBody ) {
				this._body = body;
				this.sync();
			} else {
				console.error('WARN:body must be a TableBody');
			}

			return this;
		},
		sync: function() {
			var cols = this._body && this._body.cols();
			if( cols ) {
				var el = $('<div class="row"></div>');
		
				for(var i=0; i < cols.length; i++) {
					var col = cols[i];
					var name = col.name;
					var translator = col.value;
					
					var cell = el.create('<div class="cell"></div>');

					if( translator === 'separator' ) cell.ac('separator');

					if( col.width ) cell.style('width', col.width);
					if( col.label ) cell.html(col.label);
					if( col.padding ) cell.style('padding', col.padding);
					if( typeof(col.style) === 'object' ) cell.style(col.style);
					if( col.align === 'center' ) cell.style('text-align', 'center');
					else if( col.align === 'right' ) cell.style('text-align', 'right');
					else if( !col.align ) cell.style('text-align', 'center');
				}

				this.el.html(false);
				this.el.attach(el);
			}

			return this;
		}
	};
	
	TableHeader.style = {
		'display': 'table',
		'table-layout': 'fixed',
		'border-style': 'none',
		'border-spacing': 0,
		'padding': 0,
		'width': '100%',
		'background-color': 'transparent',

		'> .row': {
			'display': 'table-row'
		},
		'> .row > .cell': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'overflow': 'hidden',
			'vertical-align': 'middle',
			'border-bottom': '1px solid #2e2e2e',
			'width': 'auto',
			'height': 38,
			'font-weight': 'bold'
		},		
		'> .row > .cell.separator': {
			'background-color': '#2e2e2e',
			'width': '1px'
		}
	};

	return TableHeader = UI.inherit(TableHeader, UI.Component);
})();

UI.component('table.header', UI.TableHeader);