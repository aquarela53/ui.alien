module.exports = function(app) {
	
	// for cache
	var ui = {};
	
	// setup pages
	app.routes({
		'@init': function(e) {
			this.byId('contents-title').html('pages init!');
		},
		'@default': function(e) {
			ui.index = ui.index || app.load('ui/index.html');
			this.byId('contents-title').html('').hide();
			this.byId('contents-body').items(ui.index);
		},
		'json': function(e) {
			ui.json = ui.json || app.load('ui/ui.json');
			this.byId('contents-title').html('JSON').show();
			this.byId('contents-body').items(ui.json);
		},
		'js': function(e) {
			ui.js = ui.js || app.load('ui/ui.js');
			this.byId('contents-title').html('JS').show();
			this.byId('contents-body').items(ui.js);
		},
		'reservations': function(e) {
			ui.reservations = ui.reservations || app.load('ui/reservations.html');
			this.byId('contents-title').html('예약현황').show();
			this.byId('contents-body').items(ui.reservations);
		},
		'service': function(e) {
			ui.service = ui.service || app.load('ui/service.html');
			this.byId('contents-title').html('서비스 관리').show();
			this.byId('contents-body').items(ui.service);
		},
		'statistics': function(e) {
			ui.statistics = ui.statistics || app.load('ui/statistics.html');
			this.byId('contents-title').html('통계').show();
			this.byId('contents-body').items(ui.statistics);
		}
	});
	
	app.test = function(arg) {
		require('framework').print();
	};
};
