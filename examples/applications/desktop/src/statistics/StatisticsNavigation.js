Class.define('PE.StatisticsNavigation', {
	$extends: Appbus.View,

	StatisticsNavigation: function(o) {
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
								name: 'daily',
								text: '일별',
								selected: true
							}, {
								name: 'monthly',
								text: '월별'
							}, {
								name: 'yearly',
								text: '년도별'
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

PE.StatisticsNavigation.style = {
	inherit: [Appbus.View]
};

Appbus.Component.addType(PE.StatisticsNavigation);
