// 컴포넌트에서 theme 를 설정하는 방법, Appbus.Component.define 으로 컴포넌트화시킨다음 호출된 다음 사용가능
Appbus.test.Component.theme('test-theme').set({
	inherit: false,
	'': {
		'border': '1px solid silver'
	}
});

// StyleSystem 에 직접 넣는 방법
Appbus.StyleSystem.themes.get('test-theme').component('test').set({
	inherit: false,
	'': {
		'border': '1px solid orange'
	}
});


// bind function for test
Appbus.test.Component.test = function() {
	console.log('-- Appbus.test.Component ------------------------------------------------');
	var body = El('body');
	var cmp = new Appbus.test.Component({id:'cmp',name:'test'});
	var child1 = new Appbus.test.Component({id:'child1', skin: 'skin1'});
	var child2 = new Appbus.test.Component({id:'child2'});

	var eventHandler = function(e) {
		console.log(e.type, e.src, e);
		//e.stopPropagation();
		return false;
	};
	child1.on('click', eventHandler, true);
	cmp.el.on('click', eventHandler, true);
	//child2.el.on('click', eventHandler);

	console.error('- cmp.attachTo(El(body))');
	cmp.attachTo(body);
	console.log('cmp.parent()', cmp.parent());
	console.log('cmp.children()', cmp.children());
	console.log('cmp.getEl().getParent()', cmp.getEl().parent());

	console.error('- cmp.attach(child1)');
	cmp.attach(child1);	
	console.log('cmp.parent()', cmp.parent());
	console.log('cmp.children()', cmp.children());
	console.log('child1.parent()', child1.parent());
	console.log('child1.children()', child1.children());

	console.error('- cmp.attach(child2)');
	cmp.attach(child2);	
	console.log('cmp.parent()', cmp.parent());
	console.log('cmp.children()', cmp.children());
	console.log('child2.parent()', child2.parent());
	console.log('child2.children()', child2.children());
		
	console.error('- child2.detach()');
	child2.detach();
	console.log('cmp.parent()', cmp.parent());
	console.log('cmp.children()', cmp.children());
	console.log('child2.parent()', child2.parent());
	console.log('child2.children()', child2.children());

	console.error('- child2.attach(cmp)');
	child2.attach(cmp);
	child2.attachTo(body);
	console.log('cmp.parent()', cmp.parent());
	console.log('cmp.children()', cmp.children());
	console.log('child2.parent()', child2.parent());
	console.log('child2.children()', child2.children());

	console.error('- visit test');
	child2.visitSync(function(c) {
		console.log('visit', c);
	});

	console.error('- find test');
	console.log('child2.find({name:\'test\'})', child2.find({name:'test'}));
	console.log('child2.find(\'.skin1\')', child2.find('.skin1'));
	console.log('child2.find(Appbus.test.Component)', child2.find(Appbus.test.Component));

	console.log('cmp instanceof Appbus.Component', (cmp instanceof Appbus.Component));
	console.log('cmp instanceof Appbus.Container', (cmp instanceof Appbus.Container));

	console.log('-- //Appbus.test.Component ------------------------------------------------');
};


// bind function for test
Appbus.test.Container.test = function() {
	console.log('-- Appbus.test.Container ------------------------------------------------');

	var body = document.body;
	var container = new Appbus.test.Container({
		c: [
			{
				component: 'Appbus.test.Component',
				title: '번들아이템1'
			}, {
				component: 'Appbus.test.Component',
				title: '번들아이템2'
			}
		],
		e: {
			'mousewheel': function(e) {
				console.log('wheel', e);
			}
		}
	});

	console.error('- container.attachTo(El(body))');
	container.attachTo(body);
	
	console.error('- container.add(Object)');
	container.add({
		title: '아이템1'
	});
	
	console.error('- container.add(Array)');
	container.add([
		{
			title: '아이템2'
		}, {
			title: '아이템3'
		}
	]);
	
	console.error('- container.get(0)', container.get(0));
	console.error('- container.size()', container.size());
	console.error('- container.length', container.length);
	console.error('- container.getAll()', container.getAll());

	console.error('- container.remove(4)');
	container.remove(4);

	console.error('- container.get(0)', container.get(0));
	console.error('- container.size()', container.size());
	console.error('- container.length', container.length);
	console.error('- container.getAll()', container.getAll());

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());
	
	console.error('- container.next()');
	container.next();

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());
	
	console.error('- container.select(0)');
	container.select(0);

	console.error('- container.select(2)');
	container.select(2);

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());

	console.error('- container.prev()');
	container.prev();

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());

	console.log('-- //Appbus.test.Container ------------------------------------------------');
};




// bind function for test
Appbus.test.SelectableContainer.test = function() {
	console.log('-- Appbus.test.SelectableContainer ------------------------------------------------');

	var body = document.body;
	var container = new Appbus.test.SelectableContainer({
		c: [
			{
				component: 'Appbus.test.Component',
				title: '번들아이템1'
			}, {
				component: 'Appbus.test.Component',
				title: '번들아이템2'
			}
		],
		e: {
			'mousewheel': function(e) {
				console.log('wheel', e);
			}
		}
	});

	console.error('- container.attachTo(El(body))');
	container.attachTo(body);
	
	console.error('- container.add(Object)');
	container.add({
		title: '아이템1'
	});
	
	console.error('- container.add(Array)');
	container.add([
		{
			title: '아이템2'
		}, {
			title: '아이템3'
		}
	]);
	
	console.error('- container.get(0)', container.get(0));
	console.error('- container.size()', container.size());
	console.error('- container.length', container.length);
	console.error('- container.getAll()', container.getAll());

	console.error('- container.remove(4)');
	container.remove(4);

	console.error('- container.get(0)', container.get(0));
	console.error('- container.size()', container.size());
	console.error('- container.length', container.length);
	console.error('- container.getAll()', container.getAll());

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());
	
	console.error('- container.next()');
	container.next();

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());
	
	console.error('- container.select(0)');
	container.select(0);

	console.error('- container.select(2)');
	container.select(2);

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());

	console.error('- container.prev()');
	container.prev();

	console.error('- container.getSelected()', container.getSelected());
	console.error('- container.getSelectedIndex()', container.getSelectedIndex());
	console.error('- container.getAll()', container.getAll());

	console.log('-- //Appbus.test.Container ------------------------------------------------');
};