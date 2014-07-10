var $ = require('attrs.dom');
var Ajax = require('ajax');
var Path = require('path');

function LoginUI(options) {
	this.$super(options);	
}

LoginUI.prototype = {
	build: function() {
		var UI = this.context(); //.component('html');
		
		this.ui_login = new UI.HTML('login.html');
		this.ui_logout = new UI.HTML('logout.html');
		
		this.logout();
		
		var self = this;
		this.ui_login.find('.btn_logout').on('click', function(e) {
			self.logout();
		});
		this.ui_logout.find('.btn_login').on('click', function(e) {
			self.login();
		});
	},
	login: function() {
		this.items(this.ui_login);
	},
	logout: function() {
		this.items(this.ui_logout);
	}
};

LoginUI.style = Ajax.text(Path.join(__dirname, 'login.less'));

module.exports = LoginUI;
