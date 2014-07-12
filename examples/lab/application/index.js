module.exports = function(app) {
	
	// for cache
	var ui = {};
	
	// setup pages
	app.pages({
		'@': function(e) {
			ui.index = ui.index || app.load('ui/index.html');
			this.byId('contents-body').items(ui.index);
		},
		'json': function(e) {
			ui.json = ui.json || app.load('ui/ui.json');
			this.byId('contents-body').items(ui.json);
		},
		'js': function(e) {
			ui.js = ui.js || app.load('ui/ui.js');
			this.byId('contents-body').items(ui.js);
		},
		'reservations': function(e) {
			ui.reservations = ui.reservations || app.load('ui/reservations.html');
			this.byId('contents-body').items(ui.reservations);
		}
	});
	
	app.test = function(arg) {
		require('framework').print();
	};
	
	app.ready(function(e) {
	});
};
