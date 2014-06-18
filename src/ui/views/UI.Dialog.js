var Dialog = (function() {
	"use strict"

	function Dialog(options) {
		this.$super(options);
	}

	Dialog.prototype = {
		build: function() {
		}
	};

	Dialog.style = {
		'position': 'absolute',
		'top': 0,
		'left': 0
	};

	return Dialog = UI.inherit(Dialog, UI.Attachable);
})();

UI.Dialog = UI.context().component('dialog', Dialog);


// easy access
UI.alert = function(message, fn) {
};

UI.prompt = function(message, fn) {
};

UI.confirm = function(message, fn) {
};

UI.toast = function(message, style, duration) {
};

UI.tooltip = function(message, cmp) {
};

UI.dialog = function(view, modal) {
};