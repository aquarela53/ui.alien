(function() {
	"use strict";

	function Pagination(options) {
		this.$super(options);
	}

	Pagination.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.min || o.min === 0 ) this.min(o.min);
			else this.min(1);
			
			if( o.max || o.max === 0 ) this.max(o.max);
			else this.max(5);
			
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

			this.el.empty().create('span.page.prev').html('이전');

			for(var i=min; i <= max;i++) {
				var pageel = this.el.create('span.page').html(i);

				if( i === current ) pageel.ac('selected');
				
				(function(pageel, i) {
					pageel.on('click', function(e) {
						self.current(i);
					});
				})(pageel, i);
			}

			this.el.create('span.page.next').html('다음');
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
	};

	Pagination.fname = 'Pagination';
	Pagination.translator = Component.translator('pagination');
	
	return Pagination = UI.component('pagination', Pagination);
})();
	