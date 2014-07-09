var SingleSelectable = (function() {
	"use strict";

	function SingleSelectable() {
	}
	
	SingleSelectable.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			if( this.selected() === item ) return false;
			if( this.selected() ) this.deselect(this.selected());

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected = item;

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

			this._selected = null;

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(index) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			index = this.indexOf(item);

			return (this._selected === item);
		},
		selectedIndex: function(item) {
			if( !this._selected ) return -1;
			return this.indexOf(this._selected);
		},
		prev: function() {
			var i = this.selectedIndex();
			if( i > 0 ) return this.select(i--);
			return false;
		},
		next: function() {
			var i = this.selectedIndex();
			if( i >= 0 && i < (this.length() - 1) ) return this.select(i++);
			return false;
		},
		first: function() {
			return this.select(0);
		},
		last: function() {
			return this.select(this.length());
		}
	};

	return SingleSelectable;
})();
