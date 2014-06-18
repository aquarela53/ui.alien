UI.Pagination = (function() {
	"use strict"

	function Pagination(options) {
		this.$super(options);
	}

	Pagination.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.min || o.min === 0 ) this.min(o.min);
			if( o.max || o.max === 0 ) this.max(o.max);
			if( o.current || o.current === 0 ) this.current(o.current);
			if( o.prev ) this.prevButton(o.prev);
			if( o.next ) this.nextButton(o.next);
		},
		refresh: function() {
			var min = this._min;
			var max = this._max;
			var current = this._current;
			var per = this._per;
			
			if( !min && min !== 0 ) min = 1;
			if( (!max && max !== 0) || max <= min ) max = min;
			if( (!current && current !== 0) || current < min ) current = min;
			if( current > max ) current = max;
			if( (!per && per !== 0 ) || per <= 0 ) per = 10;

			var self = this;
			this.el.empty();

			var prevButton = $('<span class="page prev">이전</span>');
			this.el.attach(prevButton);

			for(var i=min; i <= max;i++) {
				var pageel = $('<span class="page">' + i + '</span>');
				this.el.attach(pageel);

				if( i === current ) pageel.ac('selected');
				
				(function(pageel, i) {
					pageel.on('click', function(e) {
						self.current(i);
					});
				})(pageel, i);
			}

			var nextButton = $('<span class="page next">다음</span>');
			this.el.attach(nextButton);
		},
		prevButton: function(prev) {
			if( !arguments.length ) return this._prev;
			this._prev = prev;
			return this;
		},
		nextButton: function(next) {
			if( !arguments.length ) return this._next;
			this._next = next;
			return this;
		},
		min: function(min) {
			if( !arguments.length ) return this._min;
			
			if( typeof(min) === 'string' ) min = parseInt(min);
			
			if( typeof(min) === 'number' ) {
				this._min = min;
				this.refresh();
			}

			return this;
		},
		per: function(per) {
			if( !arguments.length ) return this._per;
			
			if( typeof(per) === 'string' ) per = parseInt(per);
			
			if( typeof(per) === 'number' ) {
				this._per = per;
				this.refresh();
			}

			return this;
		},
		max: function(max) {
			if( !arguments.length ) return this._max;
			
			if( typeof(max) === 'string' ) max = parseInt(max);
			
			if( typeof(max) === 'number' ) {
				this._max = max;
				this.refresh();
			} else {
				console.error('WARN:invalid min value');
			}

			return this;
		},
		current: function(current) {
			if( !arguments.length ) return this._current;
			
			if( typeof(current) === 'string' ) current = parseInt(current);
			
			if( typeof(current) === 'number' ) {
				this._current = current;
				this.refresh();

				this.fire('changed', {current:current, min: this._min, max: this._max});
			} else {
				console.error('WARN:invalid min value');
			}

			return this;
		}
	};
	
	Pagination.style = {
		'text-align': 'center',

		'> .page': {
			'display': 'inline-block',
			'cursor': 'pointer',
			'margin': '-1px',
			'padding': '7px 12px 6px',
			'border': '1px solid',
			'border-color': '#e5e6e7',
			'background-color': '#fbfbfb',
			'font-weight': 'bold',
			'line-height': '16px',
			'vertical-align': 'top'
		},
		'> .page:hover': {
			'text-decoration': 'underline',
			'color': '#080'
		},
		'> .page.selected': {
			'background-color': '#fff',
			'color': '#080'
		},
		'> .prev': {
			'padding-left': '23px',
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAJEAAPz8/ExOVvv7+wAAACH5BAAAAAAALAAAAAAFAAcAAAIKhBMiqLypXpQRFQA7) no-repeat 13px 12px'
		},
		'> .prev:hover': {
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAIABAAXDAP///yH5BAEAAAEALAAAAAAFAAcAAAIJjAGXgWr+WgQFADs=) no-repeat 13px 12px'
		},
		'> .next': {
			'padding-right': '23px',
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAJEAAPz8/ExOVvv7+wAAACH5BAAAAAAALAAAAAAFAAcAAAIKTIRiqZfbEDSgFgA7) no-repeat 41px 12px'
		},
		'> .next:hover': {
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAIABAAXDAP///yH5BAEAAAEALAAAAAAFAAcAAAIKBIJhqZfbEIShAAA7) no-repeat 41px 12px'
		}
	};

	return Pagination = UI.inherit(Pagination, UI.Component);
})();

UI.Pagination = UI.component('pagination', UI.Pagination);