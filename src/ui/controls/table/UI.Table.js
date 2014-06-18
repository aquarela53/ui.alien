UI.Table = (function() {
	function Table(options) {
		this.$super(options);
	}

	Table.prototype = {
		build: function() {
			var o = this.options;


			// create header & body
			var body = this._body = new UI.TableBody(o.body || {});			
			var header = this._header = new UI.TableHeader(((o.header === false) ? {hidden:true} : (o.header || {})));
			
			// connect header & body
			header.body(body);

			// attach header & body
			header.attachTo(this);
			body.attachTo(this);


			// apply options			
			this.innerborder(o.innerborder);
			this.cols(o.cols);


			// child component cannot connect to this, manually
			this.attachTarget(false);


			// attach events
			this.on('add', function(e) {
				if( typeof(e) !== 'object' || e.item instanceof UI.Component ) return false;				
			});

			this.on('added', function(e) {
				body.add(e.item);
			});

			this.on('removed', function(e) {
				body.remove(e.item);
			});			

			// call super
			this.$super();
		},
		innerborder: function(innerborder) {
			if( !arguments.length ) return this.el.hc('innerborder');

			if( innerborder === false ) this.el.rc('innerborder');
			else this.el.ac('innerborder');

			return this;
		},
		cols: function(cols) {
			if( !arguments.length ) return this._body.cols();
			this._body.cols(cols);
			this._header.sync();
			return this;
		}
	};

	Table.style = {
		'position': 'relative',
		'background-color': '#232323',
		'color': '#fcfcfc'
	};

	return Table = UI.inherit(Table, UI.SelectableContainer);
})();

UI.Table = UI.component('table', UI.Table);