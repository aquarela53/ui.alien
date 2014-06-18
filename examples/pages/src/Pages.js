var UI = require('ui');

var pages = [
	'page1.ui.json',
	'page2.ui.json',
	'page3.ui.json',
	'page4.ui.json',
	'page5.ui.json'
]

function Pages(options) {
	this.index = -1;
	this.items('master.ui.json');
	
	var ctx = this.items(0).context();
			
	if( options.title ) ctx.find('title').html(options.title);
	if( options.author ) ctx.find('author').html(options.author);
	
	var self = this;
	ctx.find('next').on('click', function() {
		console.log('다음페이지');
		self.next();
	});
	
	ctx.find('prev').on('click', function() {
		console.log('이전페이지');
		self.prev();
	});
}

Pages.prototype = {
	first: function() {
		this.items(pages[0]);
	},
	last: function() {
		this.items(pages[pages.length - 1]);
	},
	next: function() {
		this.index = this.index + 1;
		var page = pages[this.index];
		if( !page ) return console.error('end of pages');
		
		console.log('page', page);
		
		var slot = this.items(0).context().find('slot');
		console.log('slot', slot);
		slot.items(page);
	},
	prev: function() {
		this.index = this.index - 1;
		var page = pages[this.index];
		if( !page ) return console.error('end of pages');
		
		console.log('page', page);
		
		var slot = this.items(0).context().find('slot');
		slot.items(page);
	}
};

module.exports = Pages;