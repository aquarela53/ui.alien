var WorkbenchController = function(ui) {
	this.ui = ui;
}

WorkbenchController.prototype = {
	'*.*': function(e) {
		// 전역 control
	},
	'*.click': function(e) {
		// 모든 component 의 click event control
	},
	'btn1.click': function(e) {
		// id 가 btn1 인 component 의 click event control
	},
	'btn1': function(e) {
		// id 가 btn1 인 component 의 모든 event control
	},
	'$Button.click': function(e) {
		// 모든 Appbus.Button type component 의 click event control
	}
};

// controll sequence
// 1. id.eventname
// 2. id
// 3. type.eventname
// 4. *.eventname
// 5. *.*
// or
// In the order in which listener is defined.
