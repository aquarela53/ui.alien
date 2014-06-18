UI.Breadcrumb = (function() {
	"use strict"

	function Breadcrumb(options) {
		this.$super(options);
	}
	
	Breadcrumb.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			var ol = $('<ol class="breadcrumbs"></ol>');

			el.attach(ol);
			
			this.on('added', function(e) {
				var item = e.item;

				var html = '<li>' + 
					'<a href="#">' + (item.title || 'untitled') + '</a>' + 
				'</li>';

				var tab = $(html);
				ol.attach(tab);

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					if( item.href ) self.action(item.href);					
				});

				self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.item);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').rc('selected');
			});

			this.$super();
		}
	};
	
	Breadcrumb.inherit = '';
	Breadcrumb.style = {
		'border': '1px solid #ddd',
		'border-radius': '4px',
		
		'.breadcrumbs': {
			'margin-bottom': '18px',
			'margin-left': '2.2em',
			'background': 'none',
			'height': '3em',
			'overflow': 'hidden',
			'line-height': '3em',
			'margin': '0',
			'list-style': 'none',
			'font-weight': 'bold',
			'text-shadow': '0 1px 0 #fff'
		},
		'.breadcrumbs li': {
			'background': 'none',
			'float': 'left',
			'margin': '0',
			'padding': '0 0 0 1em'
		},
		'.breadcrumbs li a': {
			'color': '#666',
			'float': 'left',
			'text-decoration': 'none',
			'padding': '0 1.75em 0 0',
			'margin-left': '0px',
			'background': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABdCAMAAACIPFYVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF29vb////0lAD4QAAAAJ0Uk5T/wDltzBKAAAAoElEQVR42qyWyQ2AMBDEPP03TQM4xBJ8zUo55gjs/QMhzAEC5gABc4CAOUDAHCBgDhAwBwiYAwTMAQLmAAFzcPfXZOR2jTf7nYzcn/b3zU1Gim6+NDgZaQ44u2kyUr18yoUYMYOfQklXRd059XSpN0hVCVWJVLVTHUV1LTUZqOlDTThqilKTmtoG1Mahthq1OantTH0BUF8ZOTQsfh4BBgArjQgu2PVF4gAAAABJRU5ErkJggg==) no-repeat 100% 50%'
		},
		'.breadcrumbs li a.selected': {
			'color': '#333',
			'background': 'none'
		},
		'.breadcrumbs li a:hover': {
			'color': '#333',
			'text-decoration': 'none'
		}/*,

		'@media only screen': {
			'ol.breadcrumbs li a': {
				'background-image': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjVweCIgaGVpZ2h0PSI5M3B4IiB2aWV3Qm94PSIwIDAgMjUgOTMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI1IDkzIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5Z29uIGZpbGw9IiNEREREREQiIHBvaW50cz0iMC41Nyw5MyAtMC41Nyw5MyAyMy43ODksNDYuNDE4IDAuMjExLDAgMS4zMiwwIDI0LjkxNCw0Ni40MjUgIi8+DQo8L3N2Zz4NCg==)'
			}
		}*/
	};

	return Breadcrumb = UI.inherit(Breadcrumb, UI.SingleSelectableContainer);
})();

UI.Breadcrumb = UI.component('breadcrumb', UI.Breadcrumb);



/*
ol.breadcrumbs {
	margin-bottom: 18px;
	list-style: decimal;
	margin-left: 2.2em;
}
ol.breadcrumbs {
	font-size: 11px;
	color: #444;
	background: url(./breadcrumbs/breadcrumb_bg.png) no-repeat;
	height: 36px;
	line-height: 34px;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	float: left;
	margin: 0;
	padding: 0 0 0 20px;
	background: url(./breadcrumbs/breadcrumb_sep_20080909.png) no-repeat;
}
ol.breadcrumbs li a {
	float: left;
	color: #444;
	text-decoration: none;
	padding: 0 10px;
	margin-left: -10px;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	margin: 0;
	padding: 0 10px;
	width: 15px;
	text-indent: -9999px;
	overflow: hidden;
}

#breadory {
	border: 1px solid #ddd;
	width: 100%;
	margin: 0 auto;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	border-radius: 4px;
	
	--background-color: #232323;
}
ol.breadcrumbs {
	background: none;
	clear: both;
	float: none;
	height: 3em;
	line-height: 3em;
	font-size: 11px;
	color: #666;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	background: none;
	float: left;
	margin: 0;
	padding: 0 0 0 1em;
}
ol.breadcrumbs li a {
	float: left;
	color: #666;
	text-decoration: none;
	padding: 0 1.75em 0 0;
	margin-left: 0px;
	background: url(./breadcrumbs/breadcrumb_separator.png) no-repeat 100% 50%;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	background: url(./breadcrumbs/breadcrumb_home.png) no-repeat 1.25em 50%;
	margin: 0;
	padding: 0 0 0 1.25em;
	width: 30px;
	text-indent: -9999px;
	overflow: hidden;
}
ol.breadcrumbs li.home a:hover {
	background-image: url(./breadcrumbs/breadcrumb_home_over.png);
}

@media only screen {
	ol.breadcrumbs li a {
		background-image:url(./breadcrumbs/breadcrumb_separator.svg);
	}
	ol.breadcrumbs li.home a {
		background-image:url(./breadcrumbs/breadcrumb_home.svg);
	}
	ol.breadcrumbs li.home a:hover {
		background-image:url(./breadcrumbs/breadcrumb_home_over.svg);
	}
}

<div id="breadory">
	<ol class="breadcrumbs">
		<li><a href="#">홈</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title Title Title</a></li>
		<li><a href="#">Title</a></li>
		<li>Title</li>
	</ol>
</div>
*/
