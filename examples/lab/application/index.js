module.exports = function(app) {
	// setup pages
	app.pages({
		'@default': function(e) {
			this.byId('contents-body').load('partials/index.html');
		},
		'json': function(e) {
			this.byId('contents-body').load('partials/ui.json');
		},
		'js': function(e) {
			this.byId('contents-body').load('partials/ui.js');
		},
		'reservations': function(e) {
			this.byId('contents-body').load('partials/reservations.html');
		}
	});
	
	app.test = function(arg) {
		console.log('hello, test', arg);
	};
	
	app.ready(function(e) {
		console.log('application is ready!', e.application.accessor());
		require('framework').print();
	});
};
