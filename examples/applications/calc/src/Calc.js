var UI = require('ui');

function Calc(options) {
	this.calculate(72600, 0.205, 12);
}

Calc.prototype = {
	calculate: function(principal, interest, month) {
		var ppm = principal / month;
		interest = (interest / 12);
		
		if( ppm % 100 ) {
			var dv = Math.round(ppm % 100 * month);
			ppm = Math.floor(ppm / 100) * 100;
		}
		
		var margin = principal;
		
		console.log('원금/월', ppm);
		console.log('이자율/월', interest);
		console.log('100원미만1회차로', dv);
		console.log('원금', margin);
		
		var isum = 0;
		for(var i=month - 1; i >= 0; i--) {
			var p = ppm;
			if( dv ) {
				p += dv;
				dv = 0;
			}
			
			var ipm = margin * interest;
			isum += ipm;
			margin = margin - p;
			console.log((month - i), p, p * i, margin, ipm);
		}
		
		console.log('total interest', isum);
	}
};

module.exports = Calc;