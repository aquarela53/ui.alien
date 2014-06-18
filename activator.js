var path = require('path');
var fs = require('fs');
var async = require('async');

var require_package = [
	'./src/shims/json.js',
	'./src/shims/es5-shim.js',
	'./src/shims/es6.js',
	'./src/util/EventDispatcher.js',
	'./src/ajax/Path.js',
	'./src/ajax/Ajax.js',
	'./src/ajax/Require.js'
];

var ui_package = [
	'./src/shims/es5.js',
	'./src/shims/es6.js',
	'./src/BOF.js',
	
	// util
	'./src/util/Util.js',
	'./src/util/DateUtil.js',
	'./src/util/Color.js',
	'./src/util/EventDispatcher.js',
	'./src/util/Options.js',
	'./src/util/Class.js',
	'./src/util/HashController.js',

	// device
	'./src/device/CSS3Calibrator.js',
	'./src/device/Device.js',
	
	// dom
	'./src/dom/DOM.js',
	'./src/dom/Template.js', 
	'./src/dom/StyleSession.js',
	'./src/dom/Animator.js',
	'./src/dom/Scroller.js',
	
	// ajax
	'./src/ajax/Path.js',
	'./src/ajax/Ajax.js',
	'./src/ajax/Require.js',

	// style system
	'./src/style/StyleSheetManager.js',
	'./src/style/Style.js',
	'./src/style/StyleSystem.js',
	
	// ui
	'./src/ui/UI.UIObject.js',
	'./src/ui/UI.Theme.js',
	'./src/ui/UI.Context.js',
	'./src/ui/UI.Component.js',
	'./src/ui/UI.Container.js',
	'./src/ui/UI.Attachable.js',
	'./src/ui/UI.SelectableContainer.js',
	'./src/ui/UI.SingleSelectableContainer.js',
	'./src/ui/UI.Module.js',
	'./src/ui/views/UI.Block.js',
	'./src/ui/views/UI.View.js',
	'./src/ui/views/UI.Bar.js',
	'./src/ui/views/UI.CardView.js',
	'./src/ui/views/UI.StackView.js',
	'./src/ui/views/UI.GridView.js',
	'./src/ui/views/UI.TabView.js',
	'./src/ui/views/UI.Dialog.js',
	'./src/ui/views/decorators/UI.Splitter.js',
	'./src/ui/views/decorators/UI.Space.js',
	'./src/ui/views/decorators/UI.Flipper.js',
	'./src/ui/controls/UI.HTML.js',
	'./src/ui/controls/UI.Video.js',
	'./src/ui/controls/UI.Image.js',
	'./src/ui/controls/UI.Button.js',
	'./src/ui/controls/UI.Thumnails.js',
	'./src/ui/controls/UI.Breadcrumb.js',
	'./src/ui/controls/UI.Pagination.js',
	'./src/ui/controls/UI.Tabs.js',
	'./src/ui/controls/form/UI.FieldSet.js',
	'./src/ui/controls/form/UI.Field.js',
	'./src/ui/controls/form/UI.TextField.js',
	'./src/ui/controls/form/fields/UI.CheckField.js',
	'./src/ui/controls/UI.MultiButton.js',
	'./src/ui/controls/UI.Slider.js',
	'./src/ui/controls/UI.Switch.js',
	'./src/ui/controls/list/UI.List.js',
	'./src/ui/controls/list/UI.ListItem.js',
	'./src/ui/controls/table/UI.Table.js',
	'./src/ui/controls/table/UI.TableHeader.js',
	'./src/ui/controls/table/UI.TableBody.js',
	'./src/EOF.js'
];

var addons = [
];

module.exports = {
	start: function(ctx) {
		function push(files) {
			if( !files ) throw new Error('files_was_null:' + files);

			if( typeof(files) === 'string' ) files = [files];
			if( !Array.isArray(files) ) throw new Error('invalid_files:' + files);

			for(var i=0; i < files.length; i++) {
				addons.push({
					file: files[i],
					from: this
				});
			}
		}

		function drop() {
			for(var i=0; i < addons.length; i++) {
				if( addons[i].from === this ) delete addons[i];
			}
		}

		// bind bundle.system listener
		ctx.on('bundle.stop', function(bundle) {
			drop.apply(bundle);
		});
		
		// bind core scripts
		push.apply(this, [ui_package]);
		
		// exports
		this.exports = {
			push: push,
			drop: drop
		};

		var app = ctx.require('http').router('/attrs.ui');
		
		var cnt = 0;
		app.use('/ui.debug.js', function(req, res, next) {
			async.mapSeries(addons, function(o, callback) {
				var bundle = o.from;
				if( !bundle ) return callback(new Error('illegalstate:no_bundle_info:' + JSON.stringify(o)));
				
				var file = bundle.path(o.file);
				var fn = (function(file, from) {
					fs.readFile(file, 'utf-8', function(err, contents) {
						if( err ) return callback(err);
						callback(err, {
							file: file,
							from: from,
							contents: (contents || '')
						});
					});
				})(file, bundle);
			}, function(err, results){
				if( err ) return next(err);

				var out = fs.createWriteStream(path.join(__dirname, 'examples/ui.debug.js'), {'flags': 'w', encoding: 'utf-8', mode: 0666});

				res.contentType('application/javascript');
				for(var i=0; i < results.length; i++) {
					var bundle = results[i].from;
					var label = path.basename(results[i].file) + ' [' + bundle.bundleId + '-' + bundle.version + ']';
					res.write('// ' + label + '\n');
					res.write(results[i].contents + '\n');
					res.write('// EOF of ' + label  + '\n\n');

					out.write('// ' + label + '\n');
					out.write(results[i].contents + '\n');
					out.write('// EOF of ' + label  + '\n\n');
				}

				res.end();
				out.end();
			});
		});
		
		var self = this;
		app.use('/require.debug.js', function(req, res, next) {
			async.mapSeries(require_package, function(o, callback) {				
				var file = self.path(o);
				var fn = (function(file) {
					fs.readFile(file, 'utf-8', function(err, contents) {
						if( err ) return callback(err);
						callback(err, {
							file: file,
							contents: (contents || '')
						});
					});
				})(file);
			}, function(err, results){
				if( err ) return next(err);

				var out = fs.createWriteStream(path.join(__dirname, 'examples/require.debug.js'), {'flags': 'w', encoding: 'utf-8', mode: 0666});

				res.contentType('application/javascript');
				res.write('(function() {\n');
				out.write('(function() {\n');
				for(var i=0; i < results.length; i++) {
					var label = path.basename(results[i].file);
					res.write('// ' + label + '\n');
					res.write(results[i].contents + '\n');
					res.write('// EOF of ' + label  + '\n\n');

					out.write('// ' + label + '\n');
					out.write(results[i].contents + '\n');
					out.write('// EOF of ' + label  + '\n\n');
				}
				res.write('})();');
				out.write('})();');

				res.end();
				out.end();
			});
		});

		
		app.static('/', path.join(__dirname, 'dist'));
		app.static('/', path.join(__dirname, 'examples'));
		app.static('/docs', path.join(__dirname, 'docs'));
		app.static('/src', path.join(__dirname, 'src'));

		console.log('[' + ctx.bundleId + '] started!');
	}
};
