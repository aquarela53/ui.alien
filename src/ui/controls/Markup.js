(function() {
	"use strict"
	
	function Markup(options) {
		if( typeof(options) === 'string' ) options = {html:options};
		this.$super(options);
	}

	Markup.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.html ) this.html(o.html, true);
			else if( o.text ) this.text(o.text, true);
			else if( o.src ) this.src(o.src, o.cache, 'html');
		},
		src: function(url, cache, mode, append) {
			console.log('html', this.base(), url, this.context().base());
			url = this.path(url);

			var self = this;
			Ajax.ajax(url).cache(cache).done(function(err, data) {
				if( err ) return console.error('[ERROR] remote html load fail', err);
				
				if( mode === 'text' ) self.text(data, append);
				else self.html(data, append);

				self.fire('html.loaded', {contents:data, mode:mode});
			});
			return this;
		},
		html: function(html, append) {
			if( !arguments.length ) return this.el.html();
			this.el.html(html, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:html, mode:'html'});
			return this;
		},
		text: function(text, append) {
			if( !arguments.length ) return this.el.text();
			this.el.text(text, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:text, mode:'text'});
			return this;
		},
		bind: function(data, fns) {
			this.el.tpl(data, fns);
			this.fire('html.changed', {contents:this.el.html(), mode:'html'});
			return this;
		}
	};
	
	Markup.style = {
		'background-color': 'transparent',
		'user-select': 'all',

		'..center': {
			'text-align': 'center'
		},
		'..left': {
			'text-align': 'left'
		},
		'..right': {
			'text-align': 'right'
		},
		'..darkshadow': {
			'text-shadow': '0 -1px 0 rgba(0,0,0,0.8)'
		},
		'..lightshadow': {
			'text-shadow': '0 1px 0 rgba(255,255,255,0.8)'
		},
		'..h3': {
			'font-weight': 'bold',
			'letter-spacing': 0,
			'font-size': 13
		}
	};
	
	Markup.fname = 'Markup';
	Markup.translator = Component.translator('markup');
		
	return Markup = UI.component('markup', Markup);
})();
