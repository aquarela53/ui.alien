Class.define('UI.SelectField', {
	$extends : UI.Component,

	SelectField : function(o) {
		this.$super(o);
	},

	build: function() {
		var o = this.options;
		var self = this;
	},

	setValue: function(value) {
		if( ! value ) value = '';
		this.value = value;

		if( this.field ) this.field.value = this.value;
	},

	getValue: function() {
		return this.field.value;
	}
});

UI.SelectField.style = {
	namespace: 'selectfield'
};

UI.Component.addType(UI.SelectField);
UI.Field.TYPES['select'] = UI.SelectField;