var Selectable = (function() {
	"use strict"

	function Selectable() {
		this._selected = [];
	}
	
	Selectable.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected.push(item);

			this.fireSync('selected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selectable: function(selectable) {
			if( !arguments.length ) return (this._selectable === false) ? false : true;
			if( selectable === false ) this._selectable = false;
			return this;
		},
		deselect: function(index) {
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;
			
			var e = this.fireSync('deselect', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;
			
			if( !this.selected(item) ) return false;

			this._selected.remove(item);

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(item) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			var index = this.indexOf(item);

			return ~this._selected.indexOf(item);
		}
	};
	
	return Selectable;
})();
