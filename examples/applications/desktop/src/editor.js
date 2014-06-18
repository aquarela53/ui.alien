var starttime = new Date().getTime();

var workbench = {
	component: 'View',
	id: 'root',
	c: [
		{
			component: 'Bar',
			movable: true,
			skin: 'boxshadow border',
			c: [				
			]
		}, {
			component: 'Space',
			style: {
				height: 3
			}
		}, {
			component: 'View',
			horizontal: true,
			reverse: false,
			c: [
				{
					id: 'test1',
					component: 'Space',
					style: {
						width: 3
					}
				}, {
					component: 'View',
					id: 'test2',
					style: {
						'max-width': 280
					},
					skin: 'boxshadow border',
					c: [
						{
							component: 'View',
							style: {
								'min-height': 150
							},
							skin: 'boxshadow border',
							c: [
								{
									component: 'TabView',
									debug: false,
									c: [
										{
											component: 'View',
											title: '상품'
										}, {
											component: 'View',
											title: '주문'
										}, {
											component: 'View',
											title: '사이트'
										}, {
											component: 'View',
											title: '통계'
										}
									],
									e: {
										'click2': function(e) {
											console.log(e.src.path());
											console.log(e.src.path(Appbus.get('test2')));
										}
									}
								}
							]
						}
					]
				}, {
					component: 'BoxSplitter',
					id: 'splitter',
					thickness: 2
				}, {
					component: 'View',
					style: {
						'min-width': 300
					},
					skin: 'boxshadow border',
					c: [
						{
							component: 'TabView',
							c: [
								
								/*{
									component: 'remote',
									title: '리스트',
									url: 'src/modules/SampleList.json'
								}, {
									component: 'Paragraph',
									title: '문단',
									cols: 3,
									url: 'html/decarte.html'
								}, {
									component: 'editor.CodeEditor',
									title: 'UI Design',
									theme: 'twilight',
									lang: 'javascript',
									src: 'function foo(items) {\n' + 
										'	var i;\n' + 
										'	for (i = 0; i &lt; items.length; i++) {\n' + 
										'		alert("Ace Rocks " + items[i]);\n' + 
										'}}\n'
								}*/
							],
							e: { 
								click: function(e) {
									//console.log('this', this);
									//console.log('width', e.src._csize.w, e.src.el.width());
									//console.log('height', e.src._csize.h, e.src.el.height());
									//console.log('e.src.resizecount', e.src.resizecount);
									//console.log('e.src.movecount', e.src.movecount);
								},
								attached: function(e) {
									//console.log('attached', this);
								},
								'container.added': function(e) {
									//console.log('container.added', this);
								},
								detached: function(e) {
									//console.log('detached', this);
								},
								staged: function(e) {
									//console.log('staged', this);
								},
								unstaged: function(e) {
									//console.log('unstaged', this);
								},
								resize: function(e) {
									if( !e.src.resizecount ) e.src.resizecount = 0;
									e.src.resizecount++;
								},
								mousemove: function(e) {
									if( !e.src.movecount ) e.src.movecount = 0;
									e.src.movecount++;
									
									if( (e.src.movecount % 100) === 0 ) {
										//console.log('mousemove', e);
									}
								},
								scope: 'element'
							}
						}
					]
				}, {
					component: 'BoxSplitter',
					thickness: 2
				}, {
					component: 'View',
					style: {
						'max-width': 300
					},
					skin: 'boxshadow border',
					c: [
						{
							component: 'TabView',
							c: [
								{
									component: 'View',
									title: '대기열'
								}
							]
						}
					]
				}, {
					component: 'Space',
					style: {
						'width': 3
					}
				}
			]
		}, {
			component: 'Space',
			style: {
				'height': 3
			}
		}, {
			component: 'View',
			skin: {
				'': {
					'background-color': '#181818',
					'border': '1px solid rgba(15,15,15,0.65)'
				}
			},
			style: {
				'max-height': 24
			}
		}
	]
};

var ui = new Appbus.UI({
	id: 'app',
	src: workbench,
	controller: WorkbenchController
});

var app = new Appbus.Application({
	fullscreen: true,
	ui: ui
});

console.log('structure build: ' + (new Date().getTime() - starttime) + 'ms');
starttime = new Date().getTime();

Appbus.on('ready', function() {
	app.attachTo(El(document.body));
	console.log('staged: ' + (new Date().getTime() - starttime) + 'ms');
});
