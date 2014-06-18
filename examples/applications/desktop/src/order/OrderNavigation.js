Class.define('PE.OrderNavigation', {
	$extends: Appbus.View,

	OrderNavigation: function(o) {
		this.$super(o);
	},

	build: function() {
		var self = this;
		var o = this.options;
		
		o.c = [
			{
				component: 'Bar',
				c: [
					{
						component: 'MultiButton',
						align: 'center',
						fit: true,
						c: [
							{
								name: 'order',
								text: '일반주문',
								selected: true
							}, {
								name: 'trashbox',
								text: '디자인주문'
							}, {
								name: 'trashbox',
								text: '삭제된주문'
							}
						],
						e: {
							'active': function(e) {
								console.log('선택', e.item.name);
							}
						}
					}
				]
			}, {
				component: 'Box'
			}
		];

		this.$super();
	}
});

PE.OrderNavigation.style = {
	inherit: [Appbus.View, Appbus.TabView]
};

Appbus.Component.addType(PE.OrderNavigation);
