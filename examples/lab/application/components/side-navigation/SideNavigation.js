"use strict";

var UI = require('ui');
var $ = require('attrs.dom');

// class Timetable
function SideNavigation(options) {
	this.$super(options);
}

SideNavigation.prototype = {
	build: function() {
		var o = this.options;
		
		var menu = [1,2,3,4,5,6,7,8,9];
		this.el.create('ul').create('li.item', menu).html(function(d) {return 'menu-' + d;});
	}
};

SideNavigation.fname = 'SideNavigation';
SideNavigation.translator = function(el, attrs) {
	var cls = this['SideNavigation'];
	return new cls(attrs);
};

module.exports = SideNavigation;