Class.define('PE.SiteAdminNavigation', {
	$extends: Appbus.View,

	SiteAdminNavigation: function(o) {
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
								name: 'bbs',
								text: '게시판',
								selected: true
							}, {
								name: 'members',
								text: '회원관리'
							}, {
								name: 'contents',
								text: '컨텐츠'
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

PE.SiteAdminNavigation.style = {
	inherit: [Appbus.View]
};

Appbus.Component.addType(PE.SiteAdminNavigation);
