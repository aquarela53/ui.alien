	// ends of class definitions

	// hash controller start
	HashController.start();

	// bundle require binding
	Require.defines({
		'debug': function(module) { module.exports = debug; },
		"color": function(module) {  module.exports = Color; },
		"document": function(module) {  module.exports = document; },
		"class": function(module) {  module.exports = Class; },
		"style.system": function(module) {  module.exports = StyleSystem; },
		"el": function(module) {  module.exports = EL; },
		"style": function(module) {  module.exports = Style; },
		"theme": function(module) {  module.exports = Theme; },
		"framework": function(module) {  module.exports = Framework; }
	});
	
	// mark build time
	Framework.buildtime = (Framework.finishtime = new Date().getTime()) - Framework.starttime;
})();

// End Of File (attrs.ui.js), Authored by joje6 ({https://github.com/joje6})
