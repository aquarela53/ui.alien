var Container = (function() {
	"use strict"

	var Util = require('util');

	// class container
	function Container(options) {
		this._items = [];
		this.$super(options);
	}

	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			var fn = function() {
				self.items(o.items || o.item || o.src);
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
					var e = this.fireSync('add', {
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

					e = this.fireSync('added', {item:item, index:this.indexOf(item)});
				}
			}

			return this;
		},
		remove: function(index) {
			var item = this.get(index);

			if( !item ) return;
			
			this._items = this._items.filter(function(c) {
				return (c === item) ? false : true;
			});
			this.fireSync('removed', {item:item});

			return this;
		},
		clear: function() {
			var items = this._items.slice();
			for(var i=items.length; i >= 0;i--) {
				this.remove(i);
			}

			this.fireSync('removedAll');
			return this;
		},
		items: function(items) {
			if( !arguments.length ) return this._items.slice();
			if( typeof(items) === 'number' ) return this.get(items);

			this.clear();
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
		}
	};

	return Container = Class.inherit(Container, Component);
})();
