UI.ListItem = (function() {
	"use strict"

	var icons = {
		'heart': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJoZWFydCI+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNmZmZmZmQiIGQ9Ik0yOS4xOTMsNS4yNjVjLTMuNjI5LTMuNTk2LTkuNDMyLTMuNjcxLTEzLjE5MS0wLjI4OA0KCQlDMTIuMjQyLDEuNTk0LDYuNDQxLDEuNjY5LDIuODEsNS4yNjVjLTMuNzQxLDMuNzA0LTMuNzQxLDkuNzA5LDAsMTMuNDE1YzEuMDY5LDEuMDU5LDExLjA1MywxMC45NDEsMTEuMDUzLDEwLjk0MQ0KCQljMS4xODMsMS4xNzIsMy4wOTYsMS4xNzIsNC4yNzgsMGMwLDAsMTAuOTMyLTEwLjgyMiwxMS4wNTMtMTAuOTQxQzMyLjkzNiwxNC45NzQsMzIuOTM2LDguOTY5LDI5LjE5Myw1LjI2NXogTTI3Ljc2OCwxNy4yNjgNCgkJTDE2LjcxNSwyOC4yMDljLTAuMzkzLDAuMzkxLTEuMDM0LDAuMzkxLTEuNDI1LDBMNC4yMzcsMTcuMjY4Yy0yLjk1LTIuOTItMi45NS03LjY3MSwwLTEwLjU5MQ0KCQljMi44NDQtMi44MTUsNy40MTYtMi45MTQsMTAuNDA5LTAuMjIybDEuMzU2LDEuMjJsMS4zNTUtMS4yMmMyLjk5NC0yLjY5Miw3LjU2Ni0yLjU5NCwxMC40MSwwLjIyMg0KCQlDMzAuNzE3LDkuNTk2LDMwLjcxNywxNC4zNDcsMjcuNzY4LDE3LjI2OHoiLz4NCgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZmZmZCIgZD0iTTkuMjUzLDcuNTAxYy0wLjAwMiwwLTAuMDAyLDAuMDAxLTAuMDA0LDAuMDAxDQoJCWMtMi4zNDUsMC4wMDItNC4yNDYsMS45MDMtNC4yNDYsNC4yNDlsMCwwYzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVzMC41LTAuMjI0LDAuNS0wLjVWMTEuNzVjMC0xLjc5NCwxLjQ1NS0zLjI0OSwzLjI0OS0zLjI0OQ0KCQloMC4wMDFjMC4yNzYsMCwwLjUtMC4yMjQsMC41LTAuNVM5LjUzLDcuNTAxLDkuMjUzLDcuNTAxeiIvPg0KPC9nPg0KPC9zdmc+DQo='
	};
	
	// private
	function makeup(item) {
		var html =  
			'<div class="row">' +
				'<div class="cell">' +
					'<div class="icon">' +
						'<img alt="" src="" />' + 
					'</div>' +
				'</div>' +
				'<div class="separator"></div>' +
				'<div class="cell auto">' +
					'<div class="text">' +
						'<div class="title">' + (item.title() || '') + '</div>' +
						'<div class="description">' + (item.description() || '') + '</div>' +
					'</div>' +
				'</div>' +
				'<div class="cell">' +
					'<div class="round">10</div>' +
				'</div>' +
				'<div class="cell">' +
					'<div class="arrow"></div>' +
				'</div>' +
			'</div>';

		return html;
	}

	
	// class ListItem
	function ListItem(options) {
		this.$super(options);
	}
	
	ListItem.prototype = {
		build: function() {
			var o = this.options;
			this.title(o.title);
			this.description(o.description);
			this.icon(o.icon);
			this.thumnail(o.thumnail);
			this.roundtext(o.roundtext);
			this.sidetext(o.sidetext);
			this.arrow(o.arrow);

			this._ready = true;

			this.el.html(makeup(this));
		},
		title: function(title) {
			if( !arguments.length ) return this._title;

			if( typeof(title) === 'string' ) this._title = title;
			else if( !title ) return this;
			else console.error('WARN:illegal title(string)', title);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		description: function(description) {
			if( !arguments.length ) return this._description;

			if( typeof(description) === 'string' ) this._description = description;
			else if( !description ) return this;
			else console.error('WARN:illegal description(string)', description);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		icon: function(icon) {
			if( !arguments.length ) return this._icon;

			if( typeof(icon) === 'string' ) this._icon = icon;
			else if( !icon ) return this;
			else console.error('WARN:illegal icon(string)', icon);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		thumnail: function(thumnail) {
			if( !arguments.length ) return this._thumnail;

			if( typeof(thumnail) === 'string' ) this._thumnail = thumnail;
			else if( !thumnail ) return this;
			else console.error('WARN:illegal thumnail(string)', thumnail);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		roundtext: function(roundtext) {
			if( !arguments.length ) return this._roundtext;

			if( typeof(roundtext) === 'string' ) this._roundtext = roundtext;
			else if( !roundtext ) return this;
			else console.error('WARN:illegal roundtext(string)', roundtext);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		sidetext: function(sidetext) {
			if( !arguments.length ) return this._sidetext;

			if( typeof(sidetext) === 'string' ) this._sidetext = sidetext;
			else if( !sidetext ) return this;
			else console.error('WARN:illegal sidetext(string)', sidetext);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		arrow: function(arrow) {
			if( !arguments.length ) return this._arrow;

			if( arrow === false ) this._arrow = false;
			else this._arrow = true;
			return this;
		}
	};
	
	ListItem.style = {
		'display': 'table',
		'width': '100%',
		'height': 38,
		'background-color': 'transparent',

		'> .row': {
			'display': 'table-row'
		},
		'> .row > .cell': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'vertical-align': 'middle',
			'width': '1px'
		},
		'> .row > .separator': {
			'display': 'table-cell',
			'background-color': '#e9e9e9',
			'width': '1px'
		},
		'> .row > .cell.auto': {
			'width': 'auto'
		},


		/* icon */
		'> .row > .cell > .icon': {
			'margin': '0 8px',
			'margin-top': '2px',
			'width': '22px'
		},
		'> .row > .cell > .icon img': {
			'width': '22px'
		},
		
		/* thumnail */
		'> .row > .cell > .thumnail': {
			'padding': '5px',
			'overflow': 'hidden'
		},
		'> .row > .cell > .thumnail img': {
			'width': '30px',
			'height': '30px'
		},
		'> .row > .cell > .text': {
			'padding': '4px 6px'
		},
		'> .row > .cell > .title': {
			'font-weight': 'bold',
			'font-size': '1em'
		},
		'> .row > .cell > .description': {
			'font-weight': 'bold',
			'font-size': '0.9em',
			'color': '#959595'
		},
		'> .row > .cell > .round': {
			'margin-left': '4px',
			'font-size': '1em',
			'font-weight': 'bold',
			'background': '#888',
			'color': 'white',
			'padding': '1px 8px 2px',
			'margin-top': '-1px'
		},
		'> .row > .cell > .arrow': {
			'margin': '0 10px',
			'width': '9px',
			'height': '13px',
			'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABGklEQVQ4jbXULW7DMBQHcK+jiTYpZCcwXXGQUaQBS4ODRfExco0mZHQkFwjyAQw6VgV5KCFPShWDKaQlTZU5H6vt9iFbfv7Jlv42QvcqSumGc95gjNdOiBDiKIQ4WmNDxAZ76Aec88bzvCe9oSzLb8YYadu2WYJW/SCOY6KUOugNGOPXNE257/vPV53ovGmdZRm3OdnjcAIAtZRyH0XRh94YBMFLGIZvRVF8dV33uwghhJCUcl9V1Q8h5N0EG0Hna+xMsUnIBpuFTLFF6Fosz/PtamqzTf0LUUo3SZJ8Tq312UJIC6QN0gd0FjJBZiFTZBKyQUaQy6O9QC7IH8j1Y7skGwBqPb1KqQNjjABAvYSM6iaf/xBzRlzqBKp+G8ywLRSzAAAAAElFTkSuQmCC)',
			'background-repeat': 'no-repeat no-repeat',
			'background-size': '9px 13px'
		},
		
		'..dark': {
			'display': 'table',
			'width': '100%',
			'height': 38,
			'background-color': 'transparent',

			'> .row': {
				'display': 'table-row'
			},
			'> .row > .cell': {
				'display': 'table-cell',
				'box-sizing': 'border-box',
				'vertical-align': 'middle',
				'width': '1px'
			},
			'> .row > .separator': {
				'display': 'table-cell',
				'background-color': '#2e2e2e',
				'width': '1px'
			},
			'> .row > .cell.auto': {
				'width': 'auto'
			},


			/* icon */
			'> .row > .cell > .icon': {
				'margin': '0 8px',
				'margin-top': '2px',
				'width': '22px'
			},
			'> .row > .cell > .icon img': {
				'width': '22px'
			},
			
			/* thumnail */
			'> .row > .cell > .thumnail': {
				'padding': '5px',
				'overflow': 'hidden'
			},
			'> .row > .cell > .thumnail img': {
				'width': '30px',
				'height': '30px'
			},
			'> .row > .cell > .text': {
				'padding': '4px 6px'
			},
			'> .row > .cell > .title': {
				'font-weight': 'bold',
				'font-size': '1em'
			},
			'> .row > .cell > .description': {
				'font-weight': 'bold',
				'font-size': '0.9em',
				'color': '#959595'
			},
			'> .row > .cell > .round': {
				'margin-left': '4px',
				'font-size': '1em',
				'font-weight': 'bold',
				'background': '#6b5b8c',
				'color': 'white',
				'padding': '1px 8px 2px',
				'margin-top': '-1px'
			},
			'> .row > .cell > .arrow': {
				'margin': '0 10px',
				'width': '9px',
				'height': '13px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABGklEQVQ4jbXULW7DMBQHcK+jiTYpZCcwXXGQUaQBS4ODRfExco0mZHQkFwjyAQw6VgV5KCFPShWDKaQlTZU5H6vt9iFbfv7Jlv42QvcqSumGc95gjNdOiBDiKIQ4WmNDxAZ76Aec88bzvCe9oSzLb8YYadu2WYJW/SCOY6KUOugNGOPXNE257/vPV53ovGmdZRm3OdnjcAIAtZRyH0XRh94YBMFLGIZvRVF8dV33uwghhJCUcl9V1Q8h5N0EG0Hna+xMsUnIBpuFTLFF6Fosz/PtamqzTf0LUUo3SZJ8Tq312UJIC6QN0gd0FjJBZiFTZBKyQUaQy6O9QC7IH8j1Y7skGwBqPb1KqQNjjABAvYSM6iaf/xBzRlzqBKp+G8ywLRSzAAAAAElFTkSuQmCC)',
				'background-repeat': 'no-repeat no-repeat',
				'background-size': '9px 13px'
			}
		}
	};

	return ListItem = UI.inherit(ListItem, UI.Component);
})();

UI.ListItem = UI.component('list-item', UI.ListItem);