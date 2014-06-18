var UI = require('ui').context();

var ui_login = new UI.HTML('login.html');
var ui_logout = new UI.HTML('logout.html');

function LoginUI(options) {
	this.$super(options);	
}

LoginUI.prototype = {
	build: function() {
		this.logout();
		
		var self = this;
		ui_login.find('btn_logout').on('click', function(e) {
			self.logout();
		});
		ui_logout.find('btn_login').on('click', function(e) {
			self.login();
		});
	},
	login: function() {
		this.items(ui_login);
	},
	logout: function() {
		this.items(ui_logout);		
		this.find('username').value('saved_userid');
	}
};

LoginUI.style = './login.css';

module.exports = LoginUI = UI.component('login', LoginUI);
