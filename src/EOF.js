	// ends of class definitions

	// hash controller start
	HashController.start();

	// bundle require binding
	define('debug', function(module) { module.exports = debug; });
	define('color', function(module) { module.exports = Color; });
	define('document', function(module) { module.exports = document; });
	define('class', function(module) { module.exports = Class; });
	define('style.system', function(module) { module.exports = StyleSystem; });
	define('style', function(module) { module.exports = Style; });
	define('theme', function(module) { module.exports = Theme; });
	define('framework', function(module) { module.exports = Framework; });
	
	// mark build time
	Framework.buildtime = (Framework.finishtime = new Date().getTime()) - Framework.starttime;
})();

// End Of File (attrs.ui.js), Authored by joje6 ({https://github.com/joje6})

