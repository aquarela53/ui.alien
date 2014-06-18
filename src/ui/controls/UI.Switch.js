UI.Switch = (function() {
	"use strict"

	function Switch(options) {
		this.$super(options);
	}

	Switch.prototype = {
		build: function() {
			// TODO
		}
	};

	return Switch = UI.inherit(Switch, UI.Component);
})();

UI.Switch = UI.component('switch', UI.Switch);