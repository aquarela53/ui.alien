module.exports = function(application) {		
	// setup application metadata
	application.icons({
		'64': 'url',
		'112': 'url',
		'512': 'url'
	})
	.splash({
		'480x640': 'url'
	})
	.theme('ios')
	.hash('guide', function(e) {
		this.find('#content').load('guide.html');
		this.find('side-navigation').load('./data/guide.ui.json');

		return false;
	})
	.component('test', 'components/test/TestComponent.js');
	
	// define custom methods
	application.custom = function(e) {
		console.log('controller\'s custom function called');
	};
	
	application.method = function() {
		console.log('this is remote application\'s custom method');
	};
	
	application.on('ready', function() {
		console.log('remote application ready!');	
	});
	
	application.ready(function(e) {
		console.log('application is ready!', e.application);
	});
	
	// print framework status
	require('framework').print();
};
