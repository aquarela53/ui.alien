UI.Flipper = (function() {
	"use strict"

	function Flipper(options) {
		this.$super(options);
	}

	Flipper.prototype = {
		build: function() {
			var o = this.options;
		}
	};
	
	Flipper.style = {
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'right': 0,
		'bottom': 0,

		'.indicator': {
			'width': 10,
			'height': 10,
			'margin': 5,
			'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAWCAYAAAAW5GZjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAh9JREFUeNq0UTFv00AUPp+dpq7lpgSrcZUUBYjaSjB0IAORUKQEdenAhAQSA0MGFiZWJgb+AjMSYoiYKkfqgBgzAFIDgkSKrCoibkISaCTHrkIaJ7yvOJ688qTPd/f5u/fed09iFPL951cZ549ou88Evsvmsy/Mmx7OnOHbP4evTOJnhLnoC19q6fzTxPW91MbWvqRe3kpKy7H82ehkk2ub370f304hlpCRhA/WrxXYIuRY6gIU9waTg2NaXxBGHKUpEwuLCz4q36XtKiHC0eOyuhEqBi9I0R3arhAkDjPjUTdUDH5+Pm5CSOAcrke/m6Fi8HNnWKXtFC8iilduduGa7u1wHmHSksLGdocNO5/ZoGG895of38xOO23cFegjLt15eIPH1h/DDHpEaWT0jo+MqfmpTppfC7Hg96T4rlf8M0qfEWyCi7Pgt4cVzxhZmPGnhgvniwniByuVSpdEUdwVBGGbc657ntebTCZmv9//WqlUBgvDAgnjkiTtFQqFJ4lEIqMoiu667s9er2cahvHaNM0P1Wq1gypiNpu9XSwWn2UymXw0Gl2l7BxrPB5Pa5q21mq1rEajYaEdjtLIGPbO4FVVTQfjRo8oHSYGL8vyWjBumEGPYWLwBDsYN1zDTJgYPL1IPxh3Mpl0LctyYSbyLxTHcbrtdvuoXC6/q9VqTdu2B8G4c7lcStf1WzCDHlEaGev1eosunfz/cf8VYAAQqPdHriLGtgAAAABJRU5ErkJggg==)',
			
			'.active': {
				'background-position': '0 10px'
			}
		}
	};

	return Flipper = UI.inherit(Flipper, UI.Component);
})();

UI.Flipper = UI.component('flipper', UI.Flipper);