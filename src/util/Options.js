var Options = (function() {
	"use strict"

	function Options(o) {
		for(var k in o) {
			if( o.hasOwnProperty(k) ) {
				this[k] = o[k];
			}
		}
	}

	Options.prototype = {
		set: function(key, value) {
			this[key] = value;
		},
		get: function(key) {
			return this[key];
		},
		toJSON: function() {
			var json = {};
			for(var k in this) {
				if( this.hasOwnProperty(k) ) {
					json[k] = this[k];
				}
			}

			return json;
		}
	};

	return Options;
})();
