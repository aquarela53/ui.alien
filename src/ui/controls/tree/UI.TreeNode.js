Class.define('UI.TreeNodeGroup', {
	$: {
		groups: new Map(),
		getGroup: function(groupId) {
			return groupId;
		},
		add: function(group) {
			if( !group ) return;
			this.groups.set(group.groupId, group);
			return group;
		},
		remove: function(groupId) {
			var group = this.groups.get(groupId);
			if( group ) this.groups.remove(groupId);
			return group;
		}
	},
	
	TreeNodeGroup: function(groupId, root) {
		this.groupId = groupId;
		this.root = root;
		this.nodes = [];

		UI.TreeNodeGroup.add(this);
	},
	add: function(node) {
		this.nodes.push(node);
	},
	select: function(node) {
		if( this.nodes.indexOf(node) >= 0 ) {
			this.deselect();
			node.activate(true);
			this.selected = node;
		}
	},
	deselect: function() {
		if( this.selected ) {
			this.selected.activate(false);
			this.selected = null;
		}
	},
	getSelected: function() {
		return this.selected;
	}
});

Class.define('UI.TreeNode', {
	$extends: UI.Container,
	$features: 'UI.Selectable',

	TreeNode: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;
		var el = this.el;

		this.seq = 0;
		
		this.nodes = new Map();
		if( o.tree ) this.setTree(o.tree);
		
		var label = o.label || o.name || this.id();
		
		this.expander = $.create('button').ac('expander');;
		this.attach(this.expander);		

		this.label = $('<span class="label"><div class="icon"></div><span class="text">' + (label || this.name() || '제목없음') + '</span></span>');
		this.attach(this.label);

		this.icon = this.label.find('.icon');

		this.attachTarget = $('<div class="node"></div>').attachTo(this.el);

		this.expander.on('click', function(e) {
			if( self.isCollapsed() ) self.expand();
			else self.collapse();
		});

		this.label.on('click', function(e) {
			self.fire('node.select', e);
		});

		if( o.folder ) {
			this.expander.ac('collapse');
			this.icon.ac('folder');
		}
		
		this.on('container.add', function(e) {
			var item = e.item;
			
			if( (item instanceof UI.Component) && !(item instanceof UI.TreeNode) ) {
				console.warn('UI.Tree is can only add UI.TreeNode type. Ignored', item);
				return false;
			} else if( item.$ ) {
				item = e.item = UI.Component.build(item, this);
			} else if( typeof(item) === 'object' )  {
				item = new UI.TreeNode(item);
			} else {
				console.warn('UI.Tree is can only add UI.TreeNode type. Ignored', item);
				return false;
			}

			e.item = item;
		});

		this.on('container.added', function(e) {
			var item = e.item;
			if( !item.name() ) item.name(('node-' + self.seq++));
			self.nodes.set(item.name(), item);
			self.attach(item);
			self.validate();

			item.on('node.select', function(e) {
				self.select(e.src);
			});
		});

		this.on('container.removed', function(e) {
			var cmp = self.nodes.get(e.item);
			if( cmp ) {
				cmp.detach();
				self.nodes.remove(item);
				self.validate();
			}
		});

		this.on('container.selected', function(e) {
			if( e.item.activate() ) self.deselect(e.item);
			else e.item.activate(true);
		});

		this.on('container.deselected', function(e) {
			e.item.activate(false);
		});

		this.$super();
	},
	
	validate: function() {
		var o = this.options;
		if( this.nodes.size > 0 ) {
			this.expander.ac('collapse');
			this.icon.ac('folder');
		} else {
			if( !o.folder ) {
				this.expander.rc('collapse');
				this.icon.rc('folder');
			}
		}
	},

	setTree: function(tree) {
		if( !tree || !(tree instanceof UI.Tree) ) throw new Error('tree doesn\'t a instance of UI.Tree');
		this.tree = tree;

		var keys = this.map.keys();
		for(var i=0; i < keys.length; i++) {
			var cmp = this.map.get(keys[i]);
			if( cmp ) {
				cmp.setTree(tree);
			}
		}
	},

	getPath: function() {

	},

	getTree: function() {
		return this.tree;
	},

	isCollapsed: function() {
		return this.el.hc('collapsed');
	},
	
	activate: function(b) {
		if( arguments === 0 ) return this.el.hc('activate');
		
		if( b ) {
			this.el.ac('activate');
		} else {
			this.el.rc('activate');		
		}
	},
	
	expand: function() {
		if( this.size() > 0 ) {
			this.expander.ac('collapse');
			this.expander.rc('expand');
		}

		this.el.rc('collapsed');
		this.fire('expanded');
	},
	
	collapse: function() {
		if( this.size() > 0 ) {
			this.expander.rc('collapse');
			this.expander.ac('expand');
		}

		this.el.ac('collapsed');
		this.fire('collapsed');
	}
});

UI.TreeNode.style = {
	'position': 'relative',
	'padding': '0 0 0 18px',
	'white-space': 'nowrap',
	'line-height': '18px',
	'background': 'url(data:image/gif;base64,R0lGODlhCQDwBoABAICAgP///yH5BAEAAAEALAAAAAAJAPAGAAL/jH+Ay6YNw4tsUqSy3NBe9y3eN14ldUZpF2Jt8oLx2tBVzL22iO/u3AsChzphkdjywZAhpewITRqlTNK0ebVWTVnuFtUFf1Vh8ph1rpXRUWz69ubFf21t3XsX5817NrWvNrcECEcoZ0j3p+iGOLho94gXqTfJV+nHeBnY+KRZ6HkImphJClkqeUqZarmKafqKCqsqy0rrGos7m1u7e6v7ywvsG0w8bLwp6tiKvPzZHPo8ass87VwNfS3dS71t3Y39rS3MPe5dDn4uXky+bt6O/q5+7D4PXy/Pfq+cvR/en/4vXkB9naINzIeQXkJ7C/EpfMgQosOIFCdaPCgRY0WN/xcL8vPoDyRAkQJJEsyRzGRDjixVZnS5EWZHlAZltqT5EWdInSN5lvR50gnQlTaLDn15NGbSmUKbriG69KZTQUancopa9SlSqymxeuVa86tWpWBzlt15tmfan2uDjmX6VmrcrFTF1m0LFe/WuXav6iXL9y/cu4ELEz7s13BixF0Fy2Uc1jHdxZQbK7YM2ezlyJs1Z0bbGfRntaFJj2ZbGvVpt6vzpmZdmXPrvbMB1x4c23Nu0btN91b9Gzbm4K5vPyZOG7lt5biHO5fN/Phz3dN5V/d9HXh24dC3F48+2Xty8cvJN++Onnp66+uxt9f+nrv6+ezpu7cPH7/8+vzv967P/99+/g0IIIECFojggQp+Z5508TH44HgRljfhefpBeKGEGVK4oYUBYvihhiFyOKKHBoJ4oogpkriiiQmi+KKKMbI4o4sLyngjjTnaCOOODnb4Y4lBtjhkjUX6GF6FR/bIJI5N6vgkj05OCSWVUlaJ5ZVaLmkll1l6uWWSQIopJJlEmmkkmkj21aCaUYIJp5tdyvklnWGyqaSdceI5Jp9l+nkmoGkKuqZkG2iQQQEAOw==) no-repeat 9px 0',

	'..root': {
		'background': 'none'
	},
	':last-child': {
		'background-position': '9px -1766px'
	},
	'> .label:hover': {
		'border-radius': 3,
		'border': '1px dotted rgba(127,127,127,0.7)',
		'background-color': 'rgba(155,0,0,0)'
	},
	'..activate > .label': {
		'border-radius': 3,
		'border': '1px solid rgba(127,127,127,0.7)',
		'background-color': 'rgba(127,127,127,0.2)'
	},
	'> button.expander': {
		'position': 'absolute',
		'top': '0',
		'left': '0',
		'width': '19px',
		'height': '19px',
		'padding': '0',
		'overflow': 'hidden',
		'vertical-align': 'middle',
		'border': '0',
		'font-size': '0',
		'color': '#fff',
		'text-indent': '19px',
		'*text-indent': '0',
		'background': 'transparent url(data:image/gif;base64,R0lGODlhCQAdAJEDAAAAAICAgP///////yH5BAEAAAMALAAAAAAJAB0AAAIsjI+iK8brXgsCWDtllvGhHwziSJbmiabqyrYomHCUAkBzZVdX3dVKn5PBAgUAOw==) no-repeat',
		'cursor': 'pointer',
		'background-position': '-100px -100px'
	},
	'> button.expander.expand': {
		'background-position': '5px -15px'
	},
	'> button.expander.collapse': {
		'background-position': '5px 5px'
	},
	'> .label': {
		'display': 'inline-block',
		'height': '20px',
		'cursor': 'pointer',
		'border': '1px dotted rgba(127,127,127,0)'
	},
	'> .label > .text': {
		'line-height': '20px',
		'white-space': 'nowrap',
		'margin-left': 3,
		'padding': '0 3px 3px 3px',
		'border': '1px dotted rgba(127,127,127,0)'
	},
	'> .node': {
		'box-sizing': 'border-box',
		'margin': '0 0 0 -5px',
		'padding': 0,

		'transition-property': 'all',
		'transition-timing-function': 'ease-in',
		'transition-duration': '0.5s'
	},
	'..collapsed > .node': {
		'overflow': 'hidden',
		'height': 0
	},
	'> .label > .icon': {
		'display': 'inline-block',
		'vertical-align': 'middle',
		'width': 15,
		'height': 15,
		'background-size': '15px 15px',
		'background-repeat': 'no-repeat no-repeat',
		'background-position': 'center center',
		'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANkE3LLaAgAAARxJREFUeJydkTFqhEAUhv/RaQRJJRirnEJILhEJpLGyMpfxAFaWOUGaVHuAgHXA2iKCYCUS5vkmzWaZWV3X5IdhmOGb7/HmCRxzOBy+mVlhJY7juF3X1WmaPgP4WgC+7z8Rkb60pmnSTdPoqqo+ANxY8uOu1yqbGccRWZbFZVm+AwjOBZuRUoKI0Pc98jx/KIriDcDtboEQAkoptG2Luq6RJMl9FEWPACBNUOvLncRxDCICEcHzPAgh3IVgTytS2k+sEzPvErmu+z8BM4OZ4Xne3wTMDK01mBmO41isJVBKnQATMsXnRSwBEW22sBYJAPM8w9yvRWt9Yq/+gRBicWdyliAIgl19m2P81d+FYfjCBrkxEQEAwzC8Avj8ARK8rCIgUJQ+AAAAAElFTkSuQmCC)'
	},
	'> .label > .icon.folder': {
		'background-position': 'center -1px',
		'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLxZO7ihRBFIa/6u0ZW7GHBUV0UQQTZzd3QdhMQxOfwMRXEANBMNQX0MzAzFAwEzHwARbNFDdwEd31Mj3X7a6uOr9BtzNjYjKBJ6nicP7v3KqcJFaxhBVtZUAK8OHlld2st7Xl3DJPVONP+zEUV4HqL5UDYHr5xvuQAjgl/Qs7TzvOOVAjxjlC+ePSwe6DfbVegLVuT4r14eTr6zvA8xSAoBLzx6pvj4l+DZIezuVkG9fY2H7YRQIMZIBwycmzH1/s3F8AapfIPNF3kQk7+kw9PWBy+IZOdg5Ug3mkAATy/t0usovzGeCUWTjCz0B+Sj0ekfdvkZ3abBv+U4GaCtJ1iEm6ANQJ6fEzrG/engcKw/wXQvEKxSEKQxRGKE7Izt+DSiwBJMUSm71rguMYhQKrBygOIRStf4TiFFRBvbRGKiQLWP29yRSHKBTtfdBmHs0BUpgvtgF4yRFR+NUKi0XZcYjCeCG2smkzLAHkbRBmP0/Uk26O5YnUActBp1GsAI+S5nRJJJal5K1aAMrq0d6Tm9uI6zjyf75dAe6tx/SsWeD//o2/Ab6IH3/h25pOAAAAAElFTkSuQmCC)'
	}
};

UI.TreeNode.styles = {
	'..noline': {
		'background': 'none',

		'> button.expander': {			
			'background': 'transparent'
		},
		'> button.expander.expand': {
			'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAYAAACulacQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABhSURBVHjafJDRDcAgCAXPhoWcQEdwFEdhBSdiJPrVRqn1fZHcQcij1uq9d2cTKaXQWgNwVU0LBMg5JzPzKMgz7ASZz0RB4hOzcHHIB5qZjzFQ1XT9gWUzghfuAACn+u4BAEINQacJRveAAAAAAElFTkSuQmCC)',
			'background-size': '5px auto',
			'background-repeat': 'no-repeat no-repeat',
			'background-position': '8px 6px'
		},
		'> button.expander.collapse': {
			'background-image': 'url(data:image/png;base64,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)',
			'cursor': 'pointer',
			'background-size': '5px auto',
			'background-repeat': 'no-repeat no-repeat',
			'background-position': '9px 7px'
		}
	}
};

UI.Component.addType(UI.TreeNode);
