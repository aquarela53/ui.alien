UI.TableBody = (function() {
	"use strict"
		
	var translators = {
		seq: function(el, value, index, col, item) {
			el.html(index + '');
		},
		separator: function(el, value) {
			el.ac('separator');
		},
		currency: function(el, value) {
			if( typeof(value) === 'number' ) value = parseInt(value);
			if( isNaN(value) ) return;

			el.html(Util.currency(value, false));
		},
		stringify: function(el, v) {
			if( typeof(v) === 'object' ) el.html(JSON.stringify(v, null, '\t'));
			else if( typeof(v) === 'function' ) el.html(v.toString());
			else if( typeof(v) === 'boolean' ) el.html(v);
			else if( typeof(v) === 'number' ) el.html(v);
			else el.html(v || '');
		},
		image: function(el, v) {
			if( typeof(v) === 'string' ) el.html('<img src="' + v + '" style="display:block;height:100%;" />');
		},
		date: function(el, v, index, col, item) {
			var date;
			if( typeof(v) === 'number' ) date = new Date(v);
			else if( typeof(v) === 'string' ) date = new Date(v);
			else if( v instanceof Date ) date = v;

			if( date ) el.html( DateUtil.format(date, (col.format || 'yyyy.mm.dd')) );
		}
	};

	// private
	function makerow(item) {
		var el = $('<div class="row"></div>');
		
		var cols = this.cols();
		var index = this.indexOf(item) + 1;
		if( cols ) {
			for(var i=0; i < cols.length; i++) {
				var col = cols[i];
				var name = col.name;
				var value = item[name];
				var translator = col.value;
				if( typeof(translator) === 'string' ) translator = translators[translator];
				
				var cell = el.create('<div class="cell"></div>');
				if( col.width ) cell.style('width', col.width);
				if( col.height ) cell.style('height', col.height);
				if( col.padding ) cell.style('padding', col.padding);
				if( col.bold ) cell.style('font-weight', 'bold');
				if( col.empty ) cell.html(col.empty);
				if( typeof(col.style) === 'object' ) cell.style(col.style);
				if( col.align === 'center' ) cell.style('text-align', 'center');
				else if( col.align === 'right' ) cell.style('text-align', 'right');

				if( typeof(translator) === 'function' ) {
					translator.apply(this, [cell, value, index, col, item]);
				} else if( value instanceof UI.Component ) {
					cell.html(false);
					value.attachTo(cell);
				} else if( value instanceof EL ) {
					cell.html(false);
					cell.attach(value);
				} else if( EL.isElement(value) ) {
					cell.html(false);
					cell.attach(value);
				} else if( value ) {
					cell.html(value);
				}
			}
		}

		return el;
	}

	
	// class TableBody
	function TableBody(options) {
		this.$super(options);
	}
	
	TableBody.prototype = {
		build: function() {
			var o = this.options;
			if( o.cols ) this.cols(o.cols);
			
			// events
			this.on('add', function(e) {
				if( typeof(e) !== 'object' || e.item instanceof UI.Component ) return false;
			});

			this.on('added', function(e) {
				var o = e.item;
				var row = makerow.call(this, o);
				o.row = row;
				this.el.attach(row);
			});

			this.on('removed', function(e) {
				var o = e.item;
				var row = o.row;
				if( row ) row.detach();
			});
		},
		col: function(name) {
			return this._columns && this._columns[name];
		},
		cols: function(cols) {
			if( !arguments.length ) return this._cols;	
			
			if( Array.isArray(cols) ) {
				var columns = {};
				if( cols ) {
					for(var i=0; i < cols.length; i++) {
						var col = cols[i];
						if( typeof(col) !== 'object' || !col.name || typeof(col.name) !== 'string' ) {
							//console.error('invalid column:', col);
							continue;
						}

						columns[col.name] = col;
					}
				}

				this._cols = cols;
				this._columns = columns;
			} else {
				console.error('WARN:illegal cols(array)', cols);
			}

			return this;
		}
	};
	
	TableBody.style = {
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
			'height': 38
		},
		'> .row > .cell.separator': {
			'background-color': '#2e2e2e',
			'width': '1px'
		},

		// hover
		'> .row:hover': {
			'background-color': '#6A5A8C'
		}, 
		'> .row:hover > .cell': {
			'border-bottom': '1px solid #6A5A8C'
		}, 
		'> .row:hover > .cell.separator': {
			'background-color': '#7A6A9C'
		}
	};

	return TableBody = UI.inherit(TableBody, UI.Container);
})();

UI.TableBody = UI.component('table.body', UI.TableBody);