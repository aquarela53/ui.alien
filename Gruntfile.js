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
	'./src/shims/es6.js',
	'./src/BOF.js',

	// ajax
	'./src/ajax/Path.js',
	'./src/ajax/Ajax.js',
	'./src/ajax/Require.js',

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
	'./src/dom/TagTranslator.js',
	'./src/dom/Template.js', 
	'./src/dom/StyleSession.js',
	'./src/dom/Animator.js',
	'./src/dom/Scroller.js',

	// style system
	'./src/style/StyleSheetManager.js',
	'./src/style/Style.js',
	'./src/style/StyleSystem.js',
	
	// ui
	'./src/ui/Component.js',
	'./src/ui/Container.js',
	'./src/ui/Context.js',
	'./src/ui/Theme.js',
	'./src/ui/BaseStyle.js',
	'./src/ui/views/View.js',
	'./src/ui/controls/HTML.js',
	'./src/ui/controls/Button.js',
	
	/*
	'./src/ui/UI.Container.js',
	'./src/ui/UI.Attachable.js',
	'./src/ui/UI.SelectableContainer.js',
	'./src/ui/UI.SingleSelectableContainer.js',
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
	'./src/ui/controls/UI.Button.js',
	'./src/ui/controls/UI.Image.js',
	'./src/ui/controls/UI.Thumnails.js',
	'./src/ui/controls/UI.Breadcrumb.js',
	'./src/ui/controls/UI.Pagination.js',
	'./src/ui/controls/UI.Tabs.js',
	'./src/ui/controls/UI.Video.js',
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
	*/
	
	'./src/EOF.js'
];

module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json');
	
	grunt.initConfig({
		pkg: pkg,
		concat: {
			options: {
				separator: '\n\n',
				stripBanners: true,
				banner: '/*!\n' + 
					' * <%= pkg.name %> - <%= pkg.description %> (MIT License)\n' +
					' * \n' +
					' * @author: <%= pkg.author.name %> (<%= pkg.author.url %>)\n' + 
					' * @version: <%= pkg.version %>\n' + 
					' * @date: <%= grunt.template.today("yyyy-mm-dd H:M:s") %>\n' + 
					'*/\n\n',
				process: function(src, filepath) {
					return src
						.replace('{pkg.bundleId}', pkg.bundleId || '')
						.replace('{pkg.name}', pkg.name || '')
						.replace('{pkg.description}', pkg.description || '')
						.replace('{pkg.version}', pkg.version || '')
						.replace('{pkg.author}', JSON.stringify(pkg.author) || '{}')
						.replace('{pkg.repository}', JSON.stringify(pkg.repository) || '{}')
						.replace('{pkg.licenses}', JSON.stringify(pkg.licenses) || '{}')
						.replace('{pkg.dependencies}', JSON.stringify(pkg.dependencies) || '{}')
						.replace('{pkg.keywords}', JSON.stringify(pkg.keywords) || '{}')
						.replace('{pkg.bugs}', JSON.stringify(pkg.bugs) || '{}')
		        }
			},
			basic_and_extras: {
		      files: {
		        'dist/ui.js': ui_package,
		        'dist/require.js': require_package,
		        'dist/ui-<%= pkg.version %>.js': ui_package,
		        'dist/require-<%= pkg.version %>.js': require_package				
		      }
		    }
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: {
					'dist/ui.min.js': ['dist/ui.js'],
					'dist/require.min.js': ['dist/require.js'],
					'dist/ui-<%= pkg.version %>.min.js': ['dist/ui.js'],
					'dist/require-<%= pkg.version %>.min.js': ['dist/require.js']
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		watch: {
			files: ['Gruntfile.js', 'src/**/*'],
			tasks: ['concat'],
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('test', ['concat', 'uglify', 'jshint', 'qunit']);
	grunt.registerTask('default', ['concat', 'uglify', 'jshint']);
};