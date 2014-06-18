Class.define('UI.Tree', {
	$extends: UI.Container,
	$features: 'UI.Selectable',

	Tree: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;

		this.nodes = new Map();

		this.on('container.added', function(e) {
			if( e.item instanceof UI.Component ) {
				console.warn('invalid tree-node data', e.item);
				return false;
			}
		});
		
		this.on('container.added', function(e) {
			var item = e.item;

			var node = new UI.TreeNode(item);

			self.nodes.set(item, node);

			self.attach(node);
		});

		this.on('container.removed', function(e) {
			var cmp = self.map.get(e.item);
			if( cmp ) {
				cmp.detach();
				self.map.remove(item);
			}
		});

		this.$super();
	},
	
	data: function(data) {
	},
	
	getSelectedNode: function() {
		return this.currentNode;
	},
	
	getNode: function(path) {
		return this.nodes[path];
	},

	getNodeAll: function() {
		return this.nodes;
	},

	expandAll: function() {
		for(var k in this.nodes) {
			var node = this.nodes[k];
			if( node ) node.expand();
		}
	},

	collapseAll: function() {
		for(var k in this.nodes) {
			var node = this.nodes[k];
			if( node ) node.collapse();
		}
	},

	setTreeData: function(data) {
		this.root = new UI.TreeNode({
			tree: this,
			c: data
		});
	},

	refresh: function() {
		this.root.detach();
		var o = this.options;
		this.root = new UI.TreeNode({
			tree: this,
			c: o.c
		});
		this.attach(this.root);
	}
});

UI.Tree.style = {
	'namespace': 'tree'
};

UI.Component.addType(UI.Tree);
