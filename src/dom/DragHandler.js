var DragHandler = (function() {
	function DragHandler() {
	}

	DragHandler.prototype = {
		movable: function(m) {
			if( m !== false ) {
				var self = this;

				this.dragHandler = function(e) {
					self.handleDrag(e);
				};

				var dragel = this.dragel = this.el;
				if( typeof(m) === 'string' ) {
					dragel = this.el.find(m);
					if( !dragel ) {
						console.warn('[' + this.id() + '] defined drag handle is not exist (' + m + ')');
						dragel = this.el;
					}
				}

				if( dragel ) {
					dragel.attr('draggable', 'true');
					dragel.on('drag', this.dragHandler, false);
					dragel.on('dragstart', this.dragHandler, false);
					dragel.on('dragend', this.dragHandler, false);
				}
			}
		},	
		handleDrag: function(e) {
			if( e.type === 'dragstart' ) {
				var dt = e.dataTransfer;
				dt.effectAllowed = 'all';

				var icon = document.createElement('img');
				icon.width = 0;

				dt.setDragImage(icon, 0, 0);
				dt.setData("appbus.drag.component", this.id());

				var b = this.boundary();
				
				this._sx = e.x;
				this._sy = e.y;
				this._x = b.x;
				this._y = b.y;
				//console.log('dragstart', b, e.x, e.y, this.startX, this.startY);
			} else if( e.type === 'drag' ) {
				if( e.x <= 0 && e.y <= 0 ) return;
				var mx = (e.x - this._sx);
				var my = (e.y - this._sy);
				
				this.el.css('transform', 'translate(' + mx + 'px,' + my + 'px)');
			} else if( e.type === 'dragend' ) {
				var position = this.el.computed("position");
				if( position === 'absolute' ) {
					var mx = (e.x - this._sx) + this._x;
					var my = (e.y - this._sy) + this._y;
					this.el.css('top', my);
					this.el.css('left', mx);
				}
				this.el.css('transform', false);

				delete this._sx;
				delete this._sy;
				delete this._x;
				delete this._y;
			}
		}
	};

	return DragHandler;
})();