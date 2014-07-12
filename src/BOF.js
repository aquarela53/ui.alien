(function() {
	// init Framework Object, contains initial parameters & build informations.
	var Framework = {
		id: '{pkg.bundleId}',
		version: '{pkg.version}',
		name: '{pkg.name}',
		author: {pkg.author},
		repository: {pkg.repository},
		starttime: new Date().getTime(),
		parameters: {
			get: function(key) {
				if( typeof(key) !== 'string' ) return null;
				return Framework.parameters[key];
			},
			set: function(key, value) {
				if( typeof(key) === 'string' ) Framework.parameters[key] = value;
				return Framework.parameters;
			}
		},
		print: function() {
			console.info('* [' + Framework.id + '] info');
			console.info('\tversion: ' + Framework.version );
			console.info('\tcore build: ' + Framework.buildtime + ' ms');
			console.info('\tready: ' + Framework.readytime + ' ms');
			console.info('\tload: ' + Framework.loadtime + ' ms');
			console.info('\telapsed time to here: ' + (new Date().getTime() - Framework.finishtime) + ' ms');
			console.info('\ttotal elapsed time: ' + (new Date().getTime() - Framework.starttime) + ' ms');
		}
	};

	// extract global options in meta tag
	(function() {
		var argm = document.getElementsByTagName('meta');
		for (var i=0,length=argm.length; i < length; i++) {
			var name = argm[i].name.toLowerCase();
			if( name.startsWith('attrs.ui.') ) {
				name = name.substring(9);
				if( name === 'get' || name === 'set' ) continue;
				var value = argm[i].getAttribute('content').trim();
				Framework.parameters[name] = value;
			}
		}
	})();

	// setup debug object
	var debug = (function(p) {
		return function(category) {
			category = category || '';
			var args = category.split('.');
			if( args ) {
				for(var i=args.length; i >= 1; i--) {
					var c = args.slice(0, i).join('.');
					//console.log('current', c, p['debug.' + c]);
					if( p['debug.' + c] === 'false' ) return false;
					else if( p['debug.' + c] === 'true' ) return true;
				}
			}
		
			return (p['debug'] !== 'true') ? false : true;
		}; 
	})(Framework.parameters);

	if(debug()) console.debug(Framework.name + '[' + Framework.version + '] started with \n' + JSON.stringify(Framework.parameters, null, '\t'));

	// to global use
	var $ = require('attrs.dom');
	var Ajax = require('ajax');
	var Path = require('path');
	var isElement = $.util.isElement;
	var isNode = $.util.isNode;
	
	define('dom', function(module) {
		module.exports = $;
	});
	
	/* debug test
	console.log('ui.controls.html', debug('ui.controls.html') );
	console.log('ui.controls', debug('ui.controls') );
	console.log('ui.context', debug('ui.context') );
	console.log('ui.submodule', debug('ui.submodule') );
	console.log('ui', debug('ui') );
	console.log('all', debug() );
	*/
	
	// start class definitions