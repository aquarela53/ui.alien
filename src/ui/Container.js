var Container = (function() {
	"use strict"

	// class container
	function Container(options) {
		this._items = [];
		this.$super(options);
	}

	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			// setup selectable
			if( o.selectable ) this.selectable(o.selectable);
			
			// setup options.items
			var fn = function() {
				self.add(o.items);
				self.mark();
			};

			if( o.async === true ) {
				setTimeout(function() {
					fn();
				}, 5);
			} else {
				fn();
			}
		},
		add: function(item, index) {
			if( !item ) return this;
			
			var items = item;
			if( !Array.isArray(items) ) items = [items];
			
			if( index && typeof(index) !== 'number' ) index = this.indexOf(index);
			
			if( index <= 0 ) index = 0;
			else if( index >= this._items.length ) index = this.length() - 1;
			else index = -1;

			if( items ) {
				for(var i=0; i < items.length; i++) {
					var item = items[i];

					if( !item && item !== 0 ) continue;
					
					// evaluation for available to add
					var e = this.fire('add', {
						cancelable: true,
						item: item,
						index: ((index === -1) ? this.length() - 1 : index + 1)
					});
					item = e.item;
					
					// if event prevented or item replaced to null, bypass
					if( e.eventPrevented || item === null || item === undefined ) continue;
															
					if( index === -1 ) {
						this._items.push(item);
					} else {
						var at = index++;
						this._items = this._items.splice(at, 0, item);
					}

					e = this.fire('added', {added:item, index:this.indexOf(item)});
				}
			}

			return this;
		},
		remove: function(index) {
			var item = this.get(index);
			var index = this.indexOf(item);
				
			

			if( !item ) return;
			
			this._items = this._items.filter(function(c) {
				return (c === item) ? false : true;
			});
			this.fire('removed', {removed:item, index:index});

			return this;
		},
		clear: function() {
			var items = this._items.slice();
			for(var i=items.length; i >= 0;i--) {
				this.remove(i);
			}
			
			this._marks = {};

			this.fire('cleared');
			return this;
		},
		items: function(items) {
			if( !arguments.length ) return this._items.slice();
			if( typeof(items) === 'number' ) return this.get(items);

			var current = this._items.slice();
			for(var i=current.length; i >= 0;i--) {
				this.remove(i);
			}
			
			if( items || items === 0 ) this.add(items);
			return this;
		},
		mark: function(name, flag) {
			if( !arguments.length ) name = 'initial';
			
			if( !this._marks ) this._marks = {};
			if( flag !== false ) {
				this._marks[name] = this._items || false;
			} else {
				this._marks[name] = null;
				try {
					delete this._marks[name];
				} catch(e) {}				
			}

			return this;
		},
		restore: function(mark) {
			if( !this._marks ) return false;
			var source = ( !arguments.length ) ? this._marks['initial'] : this._marks[mark];			
			if( source || source === false ) this.items(source);
			return true;
		},
		get: function(index) {
			if( typeof(index) === 'number' ) return this._items[index];
			index = this._items.indexOf(index);
			if( index >= 0 ) return this._items[index];
			return null;
		},
		contains: function(item) {
			return this._items.contains(item);
		},
		length: function() {
			return this._items.length;
		},
		indexOf: function(item) {
			return this._items.indexOf(item);
		},
		
		// selectable interface
		selectable: function(selectable) {
			if( !arguments.length ) {
				selectable = this._selectable;
				if( !selectable ) return 0;
				else return selectable.selectable.call(this);
			}
			
			if( selectable === false || selectable === 0 ) this._selectable = null;
			else if( selectable === 1 ) this._selectable = SingleSelectable;
			else if( selectable > 0 ) this._selectable = Selectable;
			
			return this;
		},
		select: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.select.apply(this, arguments);
		},
		deselect: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.deselect.apply(this, arguments);
		},
		selected: function(index) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.selected.apply(this, arguments);
		},
		selectedIndex: function(item) {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.selectedIndex.apply(this, arguments);
		},
		prev: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.prev.apply(this, arguments);
		},
		next: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.next.apply(this, arguments);
		},
		first: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.first.apply(this, arguments);
		},
		last: function() {
			var selectable = this._selectable;
			if( !selectable ) return console.error('[' + this.accessor() + '] component is not selectable');
			return selectable.last.apply(this, arguments);
		}
	};

	return Container = Class.inherit(Container, Component);
})();
