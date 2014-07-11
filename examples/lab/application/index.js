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
	application.test = function(cmp) {
		// child & parent & contents & items
		console.log('- parent & children & items');
		console.log('parent', cmp.parent());
		console.log('contents', cmp.contents());
		console.log('children', cmp.children());
		if( cmp instanceof application.Container ) console.log('items', cmp.items());
		console.log('');
		
		// find test
		console.log('- find & finds by selector');
		console.log('find', application.find('.fit[name="snb"]'));
		console.log('finds', application.finds('[name="guides"]'));
		console.log('byName', application.byName('snb'));
		console.log('byId', application.byId('contents'));
		console.log('');
		
		console.log('- find & finds all');
		console.log('find', application.find());
		console.log('finds', application.finds());	
		console.log('');
		
		// visit test
		console.log('- visit');
		application.byId('page').visit(function() {
			console.log(this.accessor());	
		});
		console.log('');
		
		console.log('- visitup');
		application.byId('page').visitup(function() {
			console.log(this.accessor());	
		});
		console.log('');
		
		console.log('- visit(containself)');
		application.byId('page').visit(function() {
			console.log(this.accessor());
		}, true);
		console.log('');
		
		console.log('- visitup(containself)');
		application.byId('page').visitup(function() {
			console.log(this.accessor());	
		}, true);
		console.log('');
	};
	
	application.method = function() {
		console.log('this is remote application\'s custom method');
	};
	
	application.on('ready', function() {
		console.log('remote application ready!');	
	});
	
	application.ready(function(e) {
		console.log('application is ready!', e.application.accessor());		
	});
	
	// print framework status
	require('framework').print();
};
