Class.define('PE.QuickViewNavigation', {
	$extends: Appbus.View,

	QuickViewNavigation: function(o) {
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
								text: '대기주문',
								selected: true
							}, {
								text: '취소요청'
							}, {
								text: '고객문의'
							}
						],
						e: {
							'active': function(e) {
								//console.log('선택', e.item);
							},
							'deactive': function(e) {
								//console.log('해제', e.item);
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

PE.QuickViewNavigation.style = {
	inherit: [Appbus.View]
};

Appbus.Component.addType(PE.QuickViewNavigation);
