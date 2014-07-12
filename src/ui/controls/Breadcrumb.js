(function() {
	"use strict";

	function Breadcrumb(options) {
		this.$super(options);
	}
	
	Breadcrumb.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			this.selectable(1);
			
			var ol = el.create('ol.breadcrumbs');
			
			this.on('added', function(e) {
				var item = e.added;

				var tab = ol.create('li').create('a').attr('href', '#').html((item.html || item.title || 'untitled')).end('li');

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					if( item.href ) self.action(item.href);					
				});

				//self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.removed);
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
		
	Breadcrumb.inherit = 'container';
	Breadcrumb.translator = function(el, options) {
		var concrete = this.component('breadcrumb');
		
		var items = [];
		$(el).children('item').each(function() {
			var el = $(this);
			items.push({
				title: el.attr('title'),
				href: el.attr('href'),
				html: el.html()
			});
		});
		
		options.items = items;
		
		return new concrete(options);
	};
	
	return Breadcrumb = UI.component('breadcrumb', Breadcrumb);
})();



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
