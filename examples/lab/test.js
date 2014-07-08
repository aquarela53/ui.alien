(function() {
	var UI = require('ui');
	
	UI.ready(function(e) {
		console.log('UI.ready!');
		
		var app = e.application;
		
		var view = app.pack({
			component: 'view',
			horizontal: true,
			items: [
				{
					component: 'html',
					html: 'html!'
				}, {
					component: 'timetable',
					cols: ['room1', 'room2', 'room3'],
					rows: 'date',
					mapper: {
						col: function(data) {
							var booked = data.booked;
						},
						row: function(data) {
						}
					}
				}
			]
		});
		
		view.attachTo('#content', 1);
		
		var app2 = new UI.Application('application/index.js');
		app2.method();
	});
})();