Class.define('PE.ProductNavigation', {
	$extends: Appbus.TabView,

	ProductNavigation: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;
		
		this.api = o.api;

		o.title = o.title || '상품';
		o.tabAlign = o.tabAlign || 'bottom',
		o.style = o.style || {
			'border': 'none'
		};

		var CategoryEditDialog = new Appbus.Window({
		});

		o.c = [
			{
				component: 'Box',
				title: '카테고리',
				c: [
					{
						component: 'Bar',
						style: {
							'z-index': 9999,
							'box-shadow': '0 1px 15px rgba(0,0,0,0.3)'
						},
						c: [
							{
								component: 'Button',
								text: '추가',
								e: {
									action: function(e) {
										CategoryEditDialog.open();
									}
								}
							}, {
								component: 'Button',
								align: 'right',
								text: '수정',
								e: {
									action: function(e) {
										var category = self.getSelectedCategory();
										CategoryEditDialog.open(category);
									}
								}
							}, {
								component: 'Button',
								align: 'right',
								text: '삭제',
								e: {
									action: function(e) {
										Appbus.Window.confirm('삭제하시겠습니까?', function(btn) {
											self.deleteCategoty();
										});
									}
								}
							}
						]
					}, {
						component: 'View',
						scroll: true,
						style: {
							'padding-top': 5,
							'background': 'white',
							'color': '#151515',
							'border': '1px solid black'
						},
						c: {
							component: 'Tree',
							name: 'tree',
							css: 'bordered',
							e: {
								'tree.selected': function(e) {
									self.setSelectedCategory(e.item);
								}
							},
							c: [
								{
									name: 'test',
									label: '테스트',
									c: [
										{
											name: 'test',
											label: '테스트'
										}, {
											name: 'test',
											label: '테스트테스트테스트테스트'
										}
									]
								}, {
									name: 'root',
									label: '루트',
									c: [
										{
											name: 'test',
											label: '테스트',
											c: [
												{
													name: 'test',
													label: '테스트'
												}, {
													name: 'test',
													label: '테스트'
												}
											]
										}, {
											name: 'test',
											label: '테스트'
										}, {
											name: 'test',
											label: '테스트',
											c: [
												{
													name: 'test',
													label: '테스트',
													c: [
														{
															name: 'test',
															label: '테스트'
														}, {
															name: 'test',
															label: '테스트'
														}
													]
												}, {
													name: 'test',
													label: '테스트'
												}
											]
										}, {
											name: 'test',
											label: '테스트'
										}
									]
								}
							]
						}
					}
				]
			}, {
				component: 'Box',
				title: '상품등록',
				c: [
					{
						component: 'Bar',
						c: [
							{
								component: 'MultiButton',
								align: 'center',
								fit: true,
								c: [
									{
										text: '판매중',
										selected: true
									}, {
										text: '비활성'
									}, {
										text: '템플릿'
									}
								],
								e: {
									'active': function(e) {
										console.log('선택', e.item);
									},
									'deactive': function(e) {
										console.log('해제', e.item);
									}
								}
							}
						]
					}, {
						component: 'View',
						layout: 'card',
						name: 'productview'						
					}
				]
			}
		];

		this.$super();

		this.tree = this.findOne({name:'tree'});
		console.log('tree', this.tree);

		this.refreshCategory();
	},
	refreshCategory: function() {		
		if( this.tree ) {
			if( !this.api ) {
				console.warn('[' + this.id() + '@' + this.getClass().name + '.' + '.refreshCategory] PrintingEngine API not ready');
				return;
			}

			var self = this;
			var $category = this.api.get('category');
			$category.get('products').complete(function(err, data) {
				if( err ) {
					console.error('error', err);
					return;
				}

				if( data ) {
					self.tree.data(data);
				}
			});			
		} else {
			console.warn('Illegalstate: tree not found');	
		}
	},
	createCategory: function(item) {		
		try {			
			var path = '';
			var selected = this.getSelectedCategory();
			if( selected ) path = selected.path(this.tree);

			var $category = this.api.get('category');
			var category = $category.get('products');
			if( !category ) category = $category.create('products');
			
			var self = this;
			$category.add('product://' + path, item).complete(function(err, data) {
				self.tree.addNode(data);
			});
		} catch(e) {
			console.error(this.getClass().name + '.createCategory', e);
			Appbus.Window.alert('API 오류:' + e.message);
		}
	},	
	setSelectedCategory: function(category) {
		this.selected = category;
	},
	getSelectedCategory: function() {
		return this.selected;
	}
});

PE.ProductNavigation.style = {
	inherit: [Appbus.View, Appbus.TabView]
};

Appbus.Component.addType(PE.ProductNavigation);
