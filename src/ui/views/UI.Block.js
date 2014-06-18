UI.Block = (function() {
	"use strict"

	// class Block
	function Block(options) {
		this.$super(options);
	}

	Block.prototype = {
		build: function() {
			var self = this;

			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});
			
			// call super's build
			this.$super();
		}
	};

	Block.style = {
		'position': 'relative'
	};

	return Block = UI.inherit(Block, UI.Attachable);
})();

UI.Block = UI.component('block', UI.Block);