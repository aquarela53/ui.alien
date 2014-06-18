UI.Video = (function() {
	"use strict"

	function Video(options) {
		this.$super(options);
	}

	Video.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.type ) this.type(o.type);
			if( o.cover ) this.cover(o.cover);
			if( o.src ) this.src(o.src);
		},
		src: function(url) {
			if( !arguments.length ) return this._url;
			if( typeof(url) !== 'string' ) throw new Error('illegal src');

			this._url = url;

			var type = this.type();
			var o = this.options;

			if( type === 'youtube' ) {
				var src = (~url.indexOf('/')) ? url : '//www.youtube.com/v/' + url;
				var locale = (navigator.userLanguage || navigator.language).split('-').join('_');
				var version = o.version || 3;

				var html = '<object width="100%" height="100%"><param name="movie" value="' + src + '?version=' + version + '&amp;hl=' + locale + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + src + '?version=' + version + '&amp;hl=' + locale + '" type="application/x-shockwave-flash" width="100%" height="100%" allowscriptaccess="always" allowfullscreen="true"></embed></object>';

				this.html(html);
			} else if( type === 'vimeo' ) {
				console.error('[WARN] no support yet');
			} else {
				// use video tag
				console.error('[WARN] no support yet');
			}

			return this;
		},
		cover: function(cover) {
			if( !arguments.length ) return this._cover;
			this._cover = cover;
			return this;
		},
		type: function(type) {
			if( !arguments.length ) return this._type;
			this._type = type;
			return this;
		}
	};
	
	Video.style = {
		'background-color': 'black',
		'position': 'relative',
		'overflow': 'hidden',
		'width': '100%',
		'height': '100%',
		'> *': {
			'z-index': 1,
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'box-sizing': 'border-box'
		},
		'> .cover': {
			'z-index': 2
		}
	};

	return Video = UI.inherit(Video, UI.Component);
})();

UI.Video = UI.component('video', UI.Video);