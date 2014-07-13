(function() {
	"use strict";

	// class Block
	function Block(options) {
		this.$super(options);
	}

	Block.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			
			this.loader(this.application().loader());

			// regist event listener
			this.on('added', function(e) {
				var added = e.item;
				if( added === '-' ) added = new UI.Separator({flex:1});
				
				var packed;
				if( o.translation !== false ) {
					packed = this.application().pack(added);
				}
				
				if( packed ) this.attach(packed);
				
				this.packed(added, packed);
			});

			this.on('removed', function(e) {
				var removed = e.item;
				removed = this.packed(removed);
				
				if( removed instanceof $ ) removed.detach();
				else if( removed instanceof Component ) removed.detach();
				else if( isNode(removed) ) this.attachTarget() && this.attachTarget().removeChild(removed);
			});
			
			// add original element
			$(this.dom()).contents().each(function() {
				self.add(this);
			});
			
			// call super's build
			this.$super();
		},
		packed: function(item, cmp) {
			var cm = this.cmpmap = this.cmpmap || new Map();
			if( arguments.length == 1 ) return cm.get(item);
			if( item && cmp ) return cm.set(item, cmp);
			return null;
		}
	};

	Block.style = {
		'position': 'relative'
	};

	Block.translator = Container.translator('block', function() {
		return this.__aui__ || this;
	});
	
	Block.inherit = UI.Container;
	
	return Block = UI.component('block', Block);
})();