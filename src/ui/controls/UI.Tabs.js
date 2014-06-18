UI.Tabs = (function() {
	"use strict"

	function Tabs(options) {
		this.$super(options);
	}
	
	Tabs.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			// sub dom
			var ul = $('<ul class="tabs"></ul>');
			el.attach(ul);
			this.attachTarget(false);
			
			// options
			var o = this.options;
			this.tabAlign(o.tabAlign);
			this.type(o.type);

			// events			
			this.on('added', function(e) {
				var item = e.item;

				var html = '<li>' + 
					'<a href="javascript:;" class="tab">' + 
						'<span class="octicon octicon-diff-added"></span>' + 
						'<span class="title">' + (item.title || 'untitled') + '</span>' + 
						((item.extra || item.extra === 0) ? '<span class="extra">' + item.extra + '</span>' : '') + 
					'</a>' + 
				'</li>';

				var tab = $(html);
				ul.attach(tab);

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					
					// execute href action if exists
					if( item.href ) self.action(item.href);					
				});

				if( !self.selected() || item.selected ) self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.item);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').rc('selected');
			});

			this.$super();
		},
		type: function(type) {
			if( !arguments.length ) return this._type;

			if( typeof(type) !== 'string' || !type ) type = 'default';

			if( this._type ) this.el.rc(this._type);
			this.el.ac(type);
			this._type = type;
			return this;
		},
		tabAlign: function(tabAlign) {
			if( !arguments.length ) return this.el.hc('bottom') ? 'bottom' : 'top';

			if( tabAlign === 'bottom' ) this.el.rc('top').ac('bottom');
			else this.el.rc('bottom').ac('top');

			return this;
		}
	};
	
	Tabs.inherit = '';
	Tabs.style = {		
		'..default': {
			'.tabs': {
				'display': 'inline-block'
			},
			'.tabs > li': {
				'display': 'inline-block',
				'margin-bottom': '-1px'
			},
			'.tab': {
				'display': 'inline-block',
				'padding': '8px 12px 7px',
				'border': '1px solid transparent',
				'border-bottom': '0',
				'color': '#666',
				'text-decoration': 'none'
			},
			'.tab.selected': {
				'border-color': '#ddd',
				'border-radius': '4px 4px 0 0',
				'background-color': '#fff',
				'color': '#333'
			},
			'.tab:hover': {
				'text-decoration': 'none'
			},
			'.title': {
				'display': 'inline-block',
				'padding-bottom': '2px'
			},
			'.extra': {
				'display': 'inline-block',
				'margin': '0 0 0 5px',
				'padding': '2px 5px 3px',
				'font-size': '10px',
				'font-weight': 'bold',
				'line-height': '1',
				'color': '#666',
				'background-color': '#e5e5e5',
				'border-radius': '10px'
			},
			'.extra.blank': {
				'display': 'none'
			},
			
			'..bottom': {
				'.tabs > li': {
					'margin-top': '-1px'
				},
				'.tab': {
					'border': '1px solid transparent',
					'border-top': '0'
				},
				'.tab.selected': {
					'border-color': '#ddd',
					'border-radius': '0 0 4px 4px'
				}
			}
		},
		
		'..mini': {
		},
		
		'..text': {
			'font-size': '0.9em',
			'.tabs': {
			},
			'.tabs > li': {
				'display': 'inline-block'
			},
			'.tab': {
				'margin-left': 6,
				'padding-left': 6,
				'background': 'url(data:image/gif;base64,R0lGODlhAgCuAbMNAO3t7e3u79fX1+7u8ASsAO7u7+7u7ujo6efn7N3d3UpNWCAjLvPz+////wAAAAAAACH5BAEAAA0ALAAAAAACAK4BAASIEDRJp6346lyb/2AYDg1pluh5imzrvkYTz3JN0+8bNHvP/75grsXZWIbDREPJXDqbSqRroaBaq9irVAfsCr+/rfhTaJTP5jR6PW6DBA24PE6f2934u75Ox+MJDYCCgYSDhoV+UgcNi42Mj46OiW0IDZWXlpmYmJNjDA2foaCjop1+KimpqKZSEQA7) no-repeat 0 -338px',
				'color': '#6f707b',
				'text-decoration': 'none',
				'letter-spacing': -1
			},
			'.tabs > li:first-child > .tab': {
				'margin-left': 0,
				'background': 'none'
			},
			'.tab.selected': {
				'color': '#20232c',
				'font-weight': 'bold'
			},
			'.title': {
				'display': 'inline-block',
				'padding-bottom': '2px'
			},
			'.extra': {
				'margin-left': 3,
				'padding': '3px 7px',
				'font-size': '0.8em',
				'font-weight': 'normal',
				'letter-spacing': 0,
				'color': '#6f707b',
				'background-color': '#e5e5e5',
				'border-radius': 8
			},
			'.extra.blank': {
				'display': 'none'
			}
		}
	};

	return Tabs = UI.inherit(Tabs, UI.SingleSelectableContainer);
})();

UI.Tabs = UI.component('tabs', UI.Tabs);



/*
<ul class="tabnav-tabs">
	<li>
		<a href="#" class="tabnav-tab selected">
			<span class="octicon octicon-diff-added"></span>
			Contributions
		</a>
	</li>
	<li>
		<a href="#" class="tabnav-tab ">
			<span class="octicon octicon-repo"></span>
			Repositories
		</a>
	</li>
	<li>
		<a href="#" class="tabnav-tab ">
			<span class="octicon octicon-rss"></span>
			Public Activity
		</a>
	</li>
</ul>


.tabnav {
	margin:0 0 15px;
	border-bottom:1px solid #ddd;
	-moz-box-sizing:border-box;
	box-sizing:border-box;
}

.tabnav .tabnav-tabs {
	display:inline-block;
}

.tabnav .tabnav-tabs > li {
	display:inline-block;
	margin-bottom:-1px;
}

.tabnav-tab {
	display:inline-block;
	padding:8px 12px 7px;
	border:1px solid transparent;
	border-bottom:0;
	font-size:14px;
	line-height:20px;
	color:#666;
	text-decoration:none;
}

.tabnav-tab.selected {
	border-color:#ddd;
	border-radius:3px 3px 0 0;
	background-color:#fff;
	color:#333;
}

.tabnav-tab:hover {
	text-decoration:none;
}

.tabnav .counter {
	display:inline-block;
	margin:0 0 0 5px;
	padding:2px 5px 3px;
	font-size:10px;
	font-weight:700;
	line-height:1;
	color:#666;
	background-color:#e5e5e5;
	border-radius:10px;
}

.tabnav .counter.blank {
	display:none;
}
*/
