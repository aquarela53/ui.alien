UI.Slider = (function() {
	"use strict"

	function Slider(options) {
		this.$super(options);
	}

	Slider.prototype = {
		build: function() {
			var o = options;
			this.value = parseFloat(o.value);
			this.max = parseFloat(o.max);
			this.min = parseFloat(o.min);
			this.atomic = parseFloat(o.atomic);
			
			if( isNaN(this.min) ) this.min = 0;
			if( isNaN(this.max) ) this.max = 100;
			if( isNaN(this.value) ) this.value = this.max;
			if( isNaN(this.atomic) ) this.atomic = 1;

			if( this.value < this.min ) this.value = this.min;
			if( this.value > this.max ) this.value = this.max;

			this._make();
		},
		syncKnob: function() {
			if( this.knob ) {
				var totalpx = this.el.offsetWidth - (this.knob.offsetWidth / 2) - 19;
				
				var cv = (this.value - this.min) * (totalpx / (this.max - this.min));
				//console.log(totalpx, this.min, this.max, this.value, cv, Math.floor(cv));
				
				left = Math.round(cv);
				//console.log(this.value, left);
				this.moving(left);
			}
		},		
		moving: function(ax, ms, easing) {
			ms = ms || 0;
			var kw = this.knob.offsetWidth;
			var ew = this.el.offsetWidth;
			var sg = this.sguide;
			var ks = this.knob;
			var left = w = 0;
			//console.log(ax, kw, kw);
			if( ax >= 8 && ax <= (ew - (kw  / 2) - 19) ) {
				left = ax;
				w = ax;
			} else if( ax < 8 ) {
				left = 8;
				w = 0;
			} else if( ax > (ew - (kw  / 2) - 19) ) {
				left = (ew - (kw  / 2) - 19);
				w = (ew - (kw  / 2) - 19);
			}
			
			sg.style.width = w + 'px';
			ks.style.left = left + 'px';

			/*if(ms !== 0) ks.style[P_S3 + 'Transition'] = P_C3 + 'transform ' + ms + 'ms ' + (easing || '');
			else ks.style[P_S3 + 'Transition'] = '';
			ks.style[P_S3 + 'Transform'] = 'translate3d(' + (left ? left + 'px' : 8) + ',0,0)';*/
		},
		_make: function() {
			var o = this.options;
			var self = this;

			this.el.innerHTML = '';

			var guide = this.guide = document.createElement('div');
			guide.className = 'guide';

			var sguide = this.sguide = document.createElement('div');
			sguide.className = 'sguide';
			guide.appendChild(sguide);

			var knob = this.knob = document.createElement('div');
			knob.className = 'knob';

			this.el.appendChild(guide);			
			this.el.appendChild(knob);
			
			if( this.a1 ) this.a1.clear();
			if( this.a2 ) this.a2.clear();
			if( this.a3 ) this.a3.clear();

			this.a1 = new UI.AdvancedEvent(null, this.el, {
				tap: function(cmp, e) {
					if( self._dragging === false && e.target != self.knob) {
						var p = (e.touches ? e.touches[0] : e) || e;
						var ax = p.offsetX;
						//console.log('tap', self._dragging, ax, e.target);
						self.moving(ax, 220);
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				}
			});

			this.a2 = new UI.AdvancedEvent(null, knob, {
				dragstart: function(cmp, e) {
					self._dragging = true;
				},
				dragend: function(cmp, e, x, y, mx, my, ox, oy) {
					if( self._dragging) {
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				}
			});
			
			this.a3 = new UI.AdvancedEvent(null, document.body, {
				drag: function(cmp, e, x, y, mx, my, ox, oy) {
					if( self._dragging && self.isShow ) {
						var ax = self.knob.offsetLeft + mx;
						self.moving(ax);
					}
				},
				touchend: function() {
					if( self._dragging) {
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				},
				mouseout: function() {
					//self._dragging = false;
				}
			});

			var self = this;
			window.removeEventListener('resize', this);
			window.addEventListener('resize', this);
		},
		
		handleEvent: function(e) {
			if( e.type == 'resize' ) this.syncKnob();
		},

		destroy: function() {
			if( this.a1 ) this.a1.clear();
			if( this.a2 ) this.a2.clear();
			if( this.a3 ) this.a3.clear();

			this.parent();
		},

		show: function(m,fn) {
			var o = this.options;
			var self = this;
			this.parent(m,function() {
				setTimeout(function() {
					self.syncKnob();
				}, 150)
			});
		},

		calulateValue: function() {
			if( this.knob ) {
				var totalpx = this.el.offsetWidth - (this.knob.offsetWidth / 2) - 19 - 8;
				var percentage = (this.knob.offsetLeft - 8) / (totalpx / (this.max - this.min));
				var cv = (this.max - this.min) * (percentage / (this.max - this.min));

				this.value = this.min + cv;
				var round = parseInt(Math.round(this.value / this.atomic));
				this.value = (round * this.atomic);

				//console.log(this.value, percentage, this.atomic, (round * this.atomic));

				this.syncKnob();
			}
		},

		setValue: function(value) {
			if( ! value ) return;
			this.value = value;

			if( this.value < this.min ) this.value = this.min;
			if( this.value > this.max ) this.value = this.max;

			//console.log(value, this.value);

			this.syncKnob();
		},

		getValue: function() {
			if( !this.knob ) return this.value;

			this.calulateValue();
			return this.value;
		}
	};


	Slider.style = {
		'position': 'relative',
		'padding': '14px',

		'.guide': {
			'height': '8px',
			'border-radius': '20px',
			'border': '1px solid rgba(176,176,176,1)',
			'background-color': 'white',
			'box-shadow': 'inset 0 2px 5px rgba(145,145,145,0.7)',
			'box-sizing': 'border-box',
			'overflow': 'hidden'
		},
		'.sguide': {
			'margin': '14px',
			'position': 'absolute',
			'width': '0',
			'top': '0',
			'left': '0',
			'height': '6px',
			'border-radius': '20px',
			'border': '1px solid rgba(176,176,176,1)',
			'background-color': 'rgba(233,46,0,0.9)',
			'box-shadow': 'inset 0 2px 5px rgba(145,145,145,0.7)'
		},
		'.knob': {
			'position': 'absolute',
			'top': '7px',
			'left': '7px',
			'width': '22px',
			'height': '22px',
			'border-radius': '20px',
			'border': '1px solid rgba(157,157,157,1)',
			'background-color': 'white',
			'background-image ': 'gradient(linear, 0% 0%, 0% 100%, color-stop(0%, rgba(210,210,210,1)), color-stop(100%, rgba(210,210,210,0)))',
			'box-shadow': 'inset 0 1px rgba(255,255,255,1)'
		}
	};

	return Slider = UI.inherit(Slider, UI.Component);
})();

UI.Slider = UI.component('slider', UI.Slider);