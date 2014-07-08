var UI = require('ui');
var $ = require('attrs.dom');

// class TestComponent
function TestComponent(options) {
	this.$super(options);
}

TestComponent.prototype = {
	build: function() {
		var el = this.el;
		this.table = el.create('table.main')
				.create('thead')
				.create('tr')
				.out(2)
				.create('tbody')
				.out('table');
				
		var o = this.options;
		if( o.cols ) this.cols(o.cols);
		if( o.rows ) this.rows(o.rows);
	},
	rows: function(rows, flag) {
		if( !arguments.length ) return (this._rows && this._rows.slice()) || []
		
		if( !this._rows ) this._rows = [];
		if( rows === 'date' ) {
			this._rows = [];
			var now = new Date();
			var year = 2004;
			var month = 6;
			var lastOfMonth = 30;
			for(var i=1; i <= lastOfMonth; i++) {
				var formatted = new Date(year, month, i);
				this._rows.push(formatted);
			}
		} else if( rows ) {
			if( !Array.isArray(rows) ) rows = [rows];
			
		}
		
		return this;
	},
	cols: function(cols, flag) {
		var el = this.el;
		if( !arguments.length ) {
			return (this._cols && this._cols.slice()) || [];
		} else if( !cols ) {
			return console.error('illegal parameter', cls, flag);
		} else if( arguments.length === 1 ) {
			if( !Array.isArray(cols) ) cols = [cols];
			this._cols = cols;
			
			// claer all cols & rows
			el.find('td').detach();
			
			// add header
			el.find('thead > tr').create('th.unit').out()
			.create('th', cols).call(function(col) {
				$(this).ac('col-' + col).html(col);
			});
			
			el.find('tbody > tr').create('td.unit').out().create('td', cols).call(function(col) {
				$(this).ac('col-' + col);
			});
		} else if( flag === true ) {
			
		} else if( flag === false ) {
			// remove target slot
			this._cols = [];
		} else {
			console.error('illegal parameter', cols, flag);
		}
		
		return this;
	},
	data: function(data, row, col) {
		if( !arguments.length ) return (this._data && this._data.slice()) || [];
		
		if( !this._data ) this._data = [];
		
		if( !Array.isArray(data) ) data = [data];
		
		var mapper = this.options.mapper;
		if( !mapper ) return console.error('not found mapper');
		for(var i=0; i < data.length; i++) {
			this.data.push(data[i]);
		}
		
		return this;
	},
	clear: function() {
		this.data([]);
	}
};

TestComponent.inherit = UI.Component;
TestComponent.style = 'css/style.less';

module.exports = TestComponent;