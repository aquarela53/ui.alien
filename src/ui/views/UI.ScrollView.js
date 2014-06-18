var ScrollView = (function() {
	"use strict"

	function ScrollView(options) {
		this.$super(options);
	}

	ScrollView.prototype = {
		build: function() {
		}
	};

	ScrollView.style = {
	};

	return ScrollView = UI.inherit(ScrollView, UI.Attachable);
})();

UI.Dialog = UI.context().component('dialog', ScrollView);
