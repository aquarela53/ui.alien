var Util = (function() {
	"use strict"

	function merge(o1, o2) {
		if( o1 === null || typeof(o1) !== 'object' ) return null;
		if( o2 === null || typeof(o2) !== 'object' ) return o1;

		if( Array.isArray(o1) && Array.isArray(o2) ) return o1.concat(o2);

		o1 = clone(o1);
		o2 = clone(o2);

		if( o2 ) {
			for(var k in o2) {
				o1[k] = o2[k];
			}
		}

		return o1;
	}

	function clone(o, deep, allprototype) {
		if( o == null || typeof(o) != 'object' ) return o;

		if( Array.isArray(o) ) return o.slice();

		var n = {};
		for(var k in o) {
			if( !o.hasOwnProperty(k) && !allprototype ) continue;
			if( deep === true ) n[k] = clone(o[k]);
			else n[k] = o[k];
		}

		return n;
	}

	function array_removeByItem(arg, item, once) {
		if( !Array.isArray(arg) ) return null;
		
		for(var index;(index = arg.indexOf(item)) >= 0;) {
			arg.splice(index, 1);
			if( once ) break;
		}
		return arg;
	}
	
	function outline(fn) {
		if( typeof(fn) !== 'function' ) return fn;
	
		var o = new (function Static(){});
		for(var k in fn) {
			if( !fn.hasOwnProperty(k) ) continue;
			o[k] = fn[k];
		}
	
		return o;
	}
	
	function camelcase(value, delimeter, firstlower){
		if( !delimeter ) delimeter = '-';
		var result = value.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace(delimeter,'');});
		if( !result ) return result;
		if( firstlower ) return result;
		return result.substring(0,1).toUpperCase() + result.substring(1);
	};
	
	function uncamelcase(value, delimeter){
		if( !delimeter ) delimeter = '-';
		var result = value.replace(/([A-Z])/g, function($1){return (delimeter + $1).toLowerCase();});
		if( value[0] !== '-' && result[0] === '-' ) result = result.substring(1);
		return result;
	};

	function currency(n, f){
		var c, d, t;

		var n = n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	}

	return {
		merge: merge,
		clone: function(o, allprototype) {
			return clone(o, true, allprototype);
		},
		copy: function(o) {
			return clone(o);
		},
		array: {
			removeByItem: array_removeByItem
		},
		currency: currency,
		camelcase: camelcase,
		uncamelcase: uncamelcase,
		outline: outline
	};
})();


/*
var arg = ['1', '2', '3', '4', '3'];
console.log(Util.array.removeByItem(arg, '3'), arg.length);
*/
