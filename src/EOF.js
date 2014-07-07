	// ends of class definitions

	// hash controller start
	HashController.start();

	// bundle require binding
	define('color', function(module) { module.exports = Color; });
	define('class', function(module) { module.exports = Class; });
	
	define('style.system', function(module) { module.exports = StyleSystem; });
	define('style', function(module) { module.exports = Style; });
	define('theme', function(module) { module.exports = Theme; });
	
	define('util', function(module) { module.exports = Util; });	
	define('hash', function(module) { module.exports = HashController; });	
	define('framework', function(module) { module.exports = Framework; });
	define('debug', function(module) { module.exports = debug; });
	define('ui', function(module) { module.exports = Application; });
	
	// mark build time
	Framework.buildtime = (Framework.finishtime = new Date().getTime()) - Framework.starttime;
})();

// End Of File (attrs.ui.js), Authored by joje6 ({https://github.com/joje6})

