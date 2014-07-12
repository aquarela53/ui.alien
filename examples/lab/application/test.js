var $ = require('dom');

module.exports = function(app) {	
	// setup application metadata
	app.icons({
		'64': 'url',
		'112': 'url',
		'512': 'url'
	})
	.splash({
		'480x640': 'url'
	})
	.theme('ios')
	.component('test', 'components/test/TestComponent.js');
	
		
	// define custom methods
	app.test = function(cmp) {
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
	
		
	// setup pages
	app.pages({
		'': function(e) {
			this.byId('contents-body').load('partials/index.html', function(err, text) {
				if( err ) return console.error(err);
				this.items($(text).array());
			});
		},
		'reservations': function(e) {
			this.byId('contents-body').load('partials/reservations.html', function(err, text) {
				if( err ) return console.error(err);
				this.items($(text).array());
			});
		}
	});
	
	
	// if application ready
	app.ready(function(e) {
		console.log('application is ready!', e.application.accessor());
		
		// print framework status
		require('framework').print();	
	});
};


// less usage
if( false ) {
	var parser = new less.Parser({});
	parser.parse(Ajax.get('login/login.less'), function (err, root) { 
		if( err ) return console.error(err);
		console.log(root);
	   	var css = root.toCSS();
		console.log(css);
	});
}