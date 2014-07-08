module.exports = function(application, argv) {	
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
	
	// define custom method
	application.method = function() {
		console.log('this is remote application\'s custom method');
	};
	
	application.on('ready', function() {
		console.log('remote application ready!');	
	});
};
