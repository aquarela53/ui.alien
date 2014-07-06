// application controller
function TestApplication(app, options) {
	app.icons({
		'64': 'url',
		'112': 'url',
		'512': 'url'
	}).splash({
		'480x640': 'url'
	}).theme('ios').page('guide', function(e) {
		this.find('#content').load('guide.html');
		this.find('side-navigation').load('./data/guide.ui.json');

		return false;
	}).component('test', './components/test/TestComponent.js');
	
	var ui = app.build('index.html');
	app.items(ui);
}

TestApplication.prototype = {
	method: function() {
		console.log('custom method');
	}
};


module.exports = TestApplication;