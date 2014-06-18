UI.GridView = (function() {
	"use strict"

	function GridView(options) {
		this.$super(options);
	}

	GridView.prototype = {
		build: function() {
			this.attachTarget(false);

			var boxel = this.boxel = this.el.create('<table cellspacing="0" cellpadding="0"></table>');
			var tbody = boxel.create('<tbody></tbody>');
			var tr;

			// process options
			var o = this.options;
			this.cells(o.cells);

			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {					
				var item = e.item;
				var cellconfig = item.options.cell || {};
				
				var cols = this.cols();
				var cells = this.cells();
				var height = cellconfig.height || cells.height;
				var align = cellconfig.align || cells.align;
				var bg = cellconfig.bg || cells.bg;
				var padding = cellconfig.padding || cells.padding;
				var valign = cellconfig.valign || cells.valign;
				var border = (cellconfig.border === false ) ? false : cellconfig.border || cells.border;
				if( typeof(border) !== 'boolean' ) border = true;
				
				var createRow = function() {
					var tr = tbody.create('<tr></tr>');
					for(var i=0; i < cols; i++) {
						tr.create('<td class="empty"></td>');
					}

					return tr;
				};

				if( !tr ) tr = createRow();
				var td = tr.find('.empty');
				if( td.length <= 0 ) tr = createRow();
				td = tr.find('.empty');

				var cellbody = td.create('<div class="cellbody"></div>');
				
				td.rc('empty').ac('active');
				if( padding ) td.style('padding', padding);
				if( height ) td.style('height', height);
				if( bg ) td.style('background', bg);
				if( valign ) td.style('vertical-align', valign);
				if( align ) {					
					if( align === 'center' ) cellbody.style('margin', '0 auto');
					else if( align === 'right' ) cellbody.style('float', 'right');
				}

				item.attachTo(cellbody);
				this.connect(item);
			});

			this.on('removed', function(e) {
				var item = e.item;
				var td = item.el.parent();
				var tr = td.parent();
				e.item.detach();
				td.detach();

				if( tr.count() <= 0 ) tr.detach();
			});

			this.$super();
		},
		cols: function(cols) {
			if( !arguments.length ) {
				var cols = this.cells().cols;
				if( cols <= 0 || typeof(cols) !== 'number' ) return 1;
				return cols;
			}
			
			var cells = this.cells();
			cells.cols = cols;
			this.cells(cells);
		},
		cells: function(cells) {
			if( !arguments.length ) return this._cells || {};

			if( typeof(cells) === 'number' ) cells = {col:cells};
			if( typeof(cells) !== 'object' ) return this;
			
			this._cells = cells;
			return this;
		}
	};
	
	GridView.style = {
		'> table': {
			'width': '100%',
			'table-layout': 'fixed',
			'border-style': 'none',
			'border-spacing': '0px',
			'padding': '0px',
			'background-color': 'transparent',
			'border': '1px solid #e5e6e7',
			
			'tbody > tr > td': {
				'box-sizing': 'border-box',
				'overflow': 'hidden',
				'vertical-align': 'top',
				'border-top': '1px solid #e5e6e7',
				'border-left': '1px solid #e5e6e7'
			},
			'tbody > tr > td > .cellbody': {
				'display': 'table'
			},
			'tbody > tr:first-child > td': {
				'border-top': 'none'
			},
			'tbody > tr > td:first-child': {
				'border-left': 'none'
			}
		}
	};

	return GridView = UI.inherit(GridView, UI.Attachable);
})();

UI.GridView = UI.component('gridview', UI.GridView);