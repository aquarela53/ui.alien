UI.LabelField = new Class({
	$extends : UI.Component,

	LabelField : function(o) {
		this.$super(o);
	},

	build: function() {
		var o = this.options;
		var self = this;
		
		this.value = (o.value || '');

		var field = this.field = El('div');
		field.html(this.value);

		this.attach(field);
	},

	setValue: function(value) {
		if( ! value ) value = '';
		this.value = value;

		if( this.field ) this.field.innerHTML = this.value;
	},

	getValue: function() {
		return this.value;
	}
});

UI.LabelField.style = {
	namespace: 'labelfield'
};

UI.Component.addType(UI.LabelField);
