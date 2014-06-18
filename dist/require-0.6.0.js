/*!
 * ui.alien - UI Alien the Module-based Web UI Toolkit (MIT License)
 * 
 * @author: joje (https://github.com/joje6)
 * @version: 0.6.0
 * @date: 2014-06-18 22:52:4
*/

if( !window.JSON ) {
	window.JSON = {};
	
	(function () {
		function f(n) {
			return n < 10 ? '0' + n : n;
		}

		if (typeof Date.prototype.toJSON !== 'function') {

			Date.prototype.toJSON = function (key) {

				return isFinite(this.valueOf()) ?
					this.getUTCFullYear()     + '-' +
					f(this.getUTCMonth() + 1) + '-' +
					f(this.getUTCDate())      + 'T' +
					f(this.getUTCHours())     + ':' +
					f(this.getUTCMinutes())   + ':' +
					f(this.getUTCSeconds())   + 'Z' : null;
			};

			String.prototype.toJSON      =
				Number.prototype.toJSON  =
				Boolean.prototype.toJSON = function (key) {
					return this.valueOf();
				};
		}

		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap,
			indent,
			meta = {    // table of character substitutions
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"' : '\\"',
				'\\': '\\\\'
			},
			rep;


		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}


		function str(key, holder) {
			var i,          // The loop counter.
				k,          // The member key.
				v,          // The member value.
				length,
				mind = gap,
				partial,
				value = holder[key];

			if (value && typeof value === 'object' &&
					typeof value.toJSON === 'function') {
				value = value.toJSON(key);
			}

			if (typeof rep === 'function') {
				value = rep.call(holder, key, value);
			}

			switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) {
					return 'null';
				}

				gap += indent;
				partial = [];

				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					v = partial.length === 0 ? '[]' : gap ?
						'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
						'[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				v = partial.length === 0 ? '{}' : gap ?
					'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
					'{' + partial.join(',') + '}';
				gap = mind;
				return v;
			}
		}

		if (typeof JSON.stringify !== 'function') {
			JSON.stringify = function (value, replacer, space) {
				var i;
				gap = '';
				indent = '';

				if (typeof space === 'number') {
					for (i = 0; i < space; i += 1) {
						indent += ' ';
					}
				} else if (typeof space === 'string') {
					indent = space;
				}

				rep = replacer;
				if (replacer && typeof replacer !== 'function' &&
						(typeof replacer !== 'object' ||
						typeof replacer.length !== 'number')) {
					throw new Error('JSON.stringify');
				}

				return str('', {'': value});
			};
		}

		if (typeof JSON.parse !== 'function') {
			JSON.parse = function (text, reviver) {
				var j;

				function walk(holder, key) {
					var k, v, value = holder[key];
					if (value && typeof value === 'object') {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}

				text = String(text);
				cx.lastIndex = 0;
				if (cx.test(text)) {
					text = text.replace(cx, function (a) {
						return '\\u' +
							('0000' + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}

				if (/^[\],:{}\s]*$/
						.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
							.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
							.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
					j = eval('(' + text + ')');

					return typeof reviver === 'function' ?
						walk({'': j}, '') : j;
				}

				throw new SyntaxError('JSON.parse');
			};
		}
	}());
}

// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = _Array_slice_.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(_Array_slice_.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(_Array_slice_.call(arguments))
                );

            }

        };
        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var _Array_slice_ = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if ([1,2].splice(0).length != 2) {
    var array_splice = Array.prototype.splice;

    if (function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = [];
            while (l--) {
                a.unshift(l)
            }
            return a
        }

        var array = []
            , lengthBefore
        ;

        array.splice.bind(array, 0, 0).apply(null, makeArray(20));
        array.splice.bind(array, 0, 0).apply(null, makeArray(26));

        lengthBefore = array.length; //20
        array.splice(5, 0, "XXX"); // add one element

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
        // else {
        //    IE8 bug
        // }
    }()) {//IE 6/7
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(_Array_slice_.call(arguments, 2)))
            }
        };
    }
    else {//IE8
        Array.prototype.splice = function(start, deleteCount) {
            var result
                , args = _Array_slice_.call(arguments, 2)
                , addElementsCount = args.length
            ;

            if (!arguments.length) {
                return [];
            }

            if (start === void 0) { // default
                start = 0;
            }
            if (deleteCount === void 0) { // default
                deleteCount = this.length - start;
            }

            if (addElementsCount > 0) {
                if (deleteCount <= 0) {
                    if (start == this.length) { // tiny optimisation #1
                        this.push.apply(this, args);
                        return [];
                    }

                    if (start == 0) { // tiny optimisation #2
                        this.unshift.apply(this, args);
                        return [];
                    }
                }

                // Array.prototype.splice implementation
                result = _Array_slice_.call(this, start, start + deleteCount);// delete part
                args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));// right part
                args.unshift.apply(args, _Array_slice_.call(this, 0, start));// left part

                // delete all items from this array and replace it to 'left part' + _Array_slice_.call(arguments, 2) + 'right part'
                args.unshift(0, this.length);

                array_splice.apply(this, args);

                return result;
            }

            return array_splice.call(this, start, deleteCount);
        }

    }
}

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) == undefined but should be "1"
if ([].unshift(0) != 1) {
    var array_unshift = Array.prototype.unshift;
    Array.prototype.unshift = function() {
        array_unshift.apply(this, arguments);
        return this.length;
    };
}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000,
    negativeYearString = "-000001";
if (
    !Date.prototype.toISOString ||
    (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
            ("00000" + Math.abs(year))
            .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + "-" + result.slice(0, 2).join("-") +
            "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        );
    };
}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = false;
try {
    dateToJSONIsSupported = (
        Date.prototype.toJSON &&
        new Date(NaN).toJSON() === null &&
        new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
        Date.prototype.toJSON.call({ // generic
            toISOString: function () {
                return true;
            }
        })
    );
} catch (e) {
}
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be toPrimitive(O, hint Number).
        var o = Object(this),
            tv = toPrimitive(o),
            toISO;
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === "number" && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        toISO = o.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof toISO != "function") {
            throw new TypeError("toISOString property is not callable");
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(o);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                                      // 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:(\\.\\d{1,}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var months = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
        ];

        function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        }

        function toUTC(t) {
            return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond;
                    if (isLocalTime) {
                        result = toUTC(result);
                    }
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    // Hide these variables and functions
    (function () {
        var base, size, data, i;

        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];

        function multiply(n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide(n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString() {
            var i = size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += '0000000'.slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        }

        function log(x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;

            // Test for NaN and round fractionDigits down
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            // Test for NaN
            if (x !== x) {
                return "NaN";
            }

            // If it is too big or small, return the string value of the number
            if (x <= -1e21 || x >= 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21 < x < 1e21
                // -70 < log2(x) < 70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000; // Math.pow(2, 52);
                e = 52 - e;

                // -18 < e < 122
                // x = z / 2 ^ e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }

                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        }
    }());
}


//
// String
// ======
//


// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = String.prototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === "t" ||
    ''.split(/.?/).length === 0 ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

        String.prototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0)
                return [];

            // If `separator` is not a regex, use native split
            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                return string_split.apply(this, arguments);
            }

            var output = [],
                flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline  ? "m" : "") +
                        (separator.extended   ? "x" : "") + // Proposed for ES6
                        (separator.sticky     ? "y" : ""), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator = new RegExp(separator.source, flags + "g"),
                separator2, match, lastIndex, lastLength;
            string += ""; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                limit >>> 0; // ToUint32(limit)
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        Array.prototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test("")) {
                    output.push("");
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ("0".split(void 0, 0).length) {
    String.prototype.split = function(separator, limit) {
        if (separator === void 0 && limit === 0) return [];
        return string_split.apply(this, arguments);
    }
}


// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
if ("".substr && "0b".substr(-1) !== "b") {
    var string_substr = String.prototype.substr;
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === void 0 || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this)
            .replace(trimBeginRegexp, "")
            .replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}

// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});


// es6 shim
(function() {
	if( !String.prototype.startsWith ) {
		String.prototype.startsWith = function(s) {
			return this.indexOf(s) === 0;
		};
	}

	if( !String.prototype.endsWith ) {
		String.prototype.endsWith = function(s) {
			var t = String(s);
			var index = this.lastIndexOf(t);
			return index >= 0 && index === this.length - t.length;
		};
	}

	if( !String.prototype.contains ) {
		String.prototype.contains = function(s) {
			return this.indexOf(s) !== -1;
		};
	}

	if( !String.prototype.toArray ) {
		String.prototype.toArray = function() {
			return this.split('');
		};
	}

	var global = window;
	// ES6 Map shim
	if( !global.Map ) {
		var Map = function Map() {
			this.k = [];
			this.v = [];
			this.size = 0;
		};

		Map.prototype = {
			get: function(k) {
				return this.v[this.k.indexOf(k)];
			},
			set: function(k, v) {
				var i = this.k.indexOf(k);
				if( i >= 0 ) {
					this.k[i] = v;
				} else {
					this.k.push(k);
					this.v.push(v);
				}
				
				this.size = this.k.length;
			},
			"delete": function(k) {
				var i = this.k.indexOf(k);
				if( i >= 0 ) {
					this.k.remove(i);
					this.v.remove(i);
					this.size = this.k.length;
					return true;
				}
				return false;
			},
			has: function(k) {
				return (this.k.indexOf(k) >= 0);
			},
			keys: function() {
				return this.k;
			},
			values: function() {
				return this.v;
			},
			items: function() {
			},
			iterator: function() {
				return this.items();
			},
			clear: function() {
				this.k = [];
				this.v = [];
				this.size = 0;
			}
		};
		
		// custom method
		Map.prototype.getKeyByValue = function(v) {	
			var argk = this.keys();
			var argv = this.values();
			return argk[argv.indexOf(v)];
		};

		Map.prototype.toObject = function() {
			var keys = this.keys();
			var o = {};
			for(var i=0; i < keys.length; i++) {
				var k = keys[i];
				o[k] = this.get(k);
			}

			return o;
		};
		
		global.Map = global.WeakMap = Map;
	}
})();

var EventDispatcher = (function() {	
	"use strict"

	var seq = 100;

	var EventObjectSeq = 1;
	var EventObject = function(o) {
		this.options(o);
	};

	EventObject.prototype = {
		options: function(o) {
			this.timestamp = new Date().getTime();
			this.eventObjectId = EventObjectSeq++;
			this.type = o.type;
			this.cancelable = ((o.cancelable===true) ? true : false);
			this.bubbles = ((o.bubbles===true) ? true : false);
			this.cancelBubble = false;
			this.src = o.src;
			this.returnValue = true;
			this.eventPrevented = false;
			this.values = o.values;
			
			var values = o.values;
			if( values ) {
				if( values.stopPropagation && values.preventDefault ) this.originalEvent = values;
				else this.originalValues = values;

				for(var k in values) {
					if( values.hasOwnProperty && !values.hasOwnProperty(k) ) continue;
					if( !this[k] ) this[k] = values[k];
				}
			}
		},
		preventDefault: function() {
			if( this.cancelable ) {
				this.returnValue = false;
				this.eventPrevented = true;
			}

			if( this.originalEvent ) this.originalEvent.preventDefault();
		},
		stopPropagation: function() {
			this.cancelBubble = true;

			if( this.originalEvent ) this.originalEvent.stopPropagation();
		}
	};
	
	/* 
	 * Class EventDispatcher
	 * 
	 * layout
	 * {
	 *		_options: {},
	 *		_listeners: {},
	 *		_visitor: Function,
	 *		_scope: Object,
	 *		_source: Object,
	 *		__proto__: {
	 *			options: Function(),
	 *			listeners: Function(),
	 *			visitor: Function(),
	 *			scope: Function(),
	 *			source: Function(),
	 *			on: Function(),
	 *			un: Function(),
	 *			has: Function(),
	 *			fire: Function(),
	 *			fireSync: Function(),
	 *			dispatchEvent: Function()
	 *			
	 *		}
	 * }
	 *
	 */
	function EventDispatcher(scope, options) {
		if( scope ) this.scope(scope);
		if( options ) this.options(options);
	}

	EventDispatcher.prototype = {		
		options: function(options) {
			if( !arguments.length ) return this._options;

			if( typeof(options) != 'object' ) throw new Error('options must be a object'); 
			
			this._options = null;
			this._listeners = null;
			this._visitor = null;
			this._scope = null;
			this._source = null;
			this._silent = null;
			this._types = null;

			try {
				delete this._options;
				delete this._listeners;
				delete this._visitor;
				delete this._scope;
				delete this._source;
				delete this._silent;
				delete this._types;
			} catch(e) {}

			this._options = options;
			if( options.listeners ) this.listeners(options.listeners);
			if( options.visitor ) this.visitor(options.visitor);
			if( options.scope ) this.scope(options.scope);
			if( options.source ) this.source(options.source);
			if( options.silent ) this.source(options.silent);
			if( options.types ) this.source(options.types);

			return this;
		},
		silent: function(silent) {
			if( !arguments.length ) return (this._silent) ? true : false;

			if( silent === true ) {
				this._silent = true;
			} else {
				this._silent = false;
			}

			return this;
		},
		types: function(types, flag) {
			var args = this._types;
			if( !arguments.length ) return args;

			if( types === false || types === '*' ) {
				this._types = null;
				return true;
			}

			if( typeof(types) === 'string' ) types = types.split(' ');
			if( !Array.isArray(types) ) console.error('[ERROR] illegal types', types);

			if( flag === false ) {				
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					var index = args.indexOf(type);
					if( ~index ) args = args.splice(index, 1);
				}
			} else {
				for(var i=0; i < types.length; i++) {
					var type = types[i];
					if( type && !~args.indexOf(type) ) args.push(type);
				}
			}

			return this;
		},
		listeners: function(listeners) {
			if( !this._listeners ) this._listeners = {};
			if( !arguments.length ) return this._listeners;

			if( !listeners ) return this;
					
			if( typeof(listeners) !== 'object' ) throw new Error('invalid listeners:' + listeners);
			for(var k in listeners) {
				if( !listeners.hasOwnProperty(k) || k === 'scope' || k === 'visitor' || k === 'source' ) continue;
				
				var handler = listeners[k];
				if( handler && typeof(handler) === 'function' || typeof(handler.handleEvents) === 'function' ) this.on(k, handler);
			}

			return this;
		},
		visitor: function(visitor) {
			if( !arguments.length ) return this._visitor;
			if( !visitor ) return this;
			this._visitor = visitor;
			return this;
		},
		scope: function(scope) {
			if( !arguments.length ) return this._scope || this;
			if( !scope ) return this;
			this._scope = scope;
			return this;
		},
		source: function(source) {
			if( !arguments.length ) return this._source || this.scope();
			if( !source ) return this;
			this._source = source;
			return this;
		},
		
		// actions
		wrap: function(o) {
			var self = this;
			o.on = function() {
				return self.on.apply(self, arguments);
			};
			o.un = function() {
				return self.un.apply(self, arguments);
			};
			o.has = function() {
				return self.has.apply(self, arguments);
			};
			o.fireSync = function() {
				return self.fireSync.apply(self, arguments);
			};
			o.fire = function() {
				return self.fire.apply(self, arguments);
			};
			o.getEventDispatcher = function() {
				return self;
			};

			return this;
		},
		isAllow: function(allow) {
			var types = this.types();
			if( !types ) return true;
			return (~types.indexOf(allow) || ~types.indexOf('*')) ? true : false;
		},
		has: function(action) {
			if( typeof(action) !== 'string' ) throw new Error('invalid action name:' + action);

			var listeners = this.listeners();
			var fns = listeners[action];

			if( fns ) {
				for(var i=0;i < fns.length;i++) {
					var fn = fns[i];
					if( typeof(fn) == 'function' ) {
						return true;
					}
				}
			}

			return false;
		},
		on: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) throw new Error('invalid event type:' + types);
			if( !(typeof(fn) === 'object' || typeof(fn) === 'function') ) throw new Error('invalid event listener:fn=' + fn);
			
			if( capture !== true ) capture = false;
			
			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' ) continue;
				if( !listeners[type] ) listeners[type] = [];

				var items = listeners[type];
				var item = {
					type: type,
					handler: fn,
					capture: capture
				};
				items.push(item);
				this.fireSync('event.on', item);
			}

			return this;
		},
		un: function(types, fn, capture) {
			if( typeof(types) !== 'string' ) return console.error('[WARN] invalid event type', types);
			if( !fn || !(typeof(fn) === 'object' || typeof(fn) === 'function') ) return console.error('[WARN] invalid event handler', fn);
			
			if( capture !== true ) capture = false;

			var listeners = this.listeners();
			var types = types.split(' ');
			for(var i=0; i < types.length; i++) {
				var type = types[i];
				if( !type || typeof(type) !== 'string' || !listeners[type] ) continue;
			
				var items = listeners[type];
				for(var x=items.length - 1;x >= 0;x--) {
					var item = items[x];
					if( item && item.type === type && item.handler === fn && item.capture === capture) {
						items[x] = null;
						items = items.splice(x, 1);
						this.fireSync('event.un', item);
					}
				}
			}

			return this;
		},
		dispatchEvent: function(event, scope) {
			if( this.silent() ) return this;

			if( !(event instanceof EventObject) ) throw new Error('invalid EventObject:' + event);

			var listeners = this.listeners();			
			var global = listeners['*'] || [];
			var items = global.concat(listeners[event.type] || []);
			
			if( items ) {
				for(var i=(items.length - 1);i >= 0;i--) {					
					var item = items[i];
					var handler = item.handler;
					
					var result;
					if( typeof(handler) == 'function' ) {
						result = handler.call(scope || {}, event);
					} else if( typeof(handler) == 'object' && typeof(handler.handleEvent) === 'function' ) {						
						result = handler.handleEvent(event);
					} else {
						console.warn('invalid event listener(bypassed)', handler.toString());
					}

					if( result === false ) event.preventDefault();						
					if( event.cancelBubble ) break;
				}
			}

			return this;
		},
		fireSync: function(action, values, fn) {
			//if( action === 'named' ) console.error('fireSync', action, values);
			if( typeof(action) !== 'string' ) return null;

			var event = new EventObject({
				values: values || {},
				src: this.source(),
				type: action
			});

			if( this.silent() ) return event;

			var targets = [this];
			var visitor = this.visitor();
			if( event.bubbles ) {
				var p = this.visitor().parent();
				for(;p;) {
					if( typeof(p.eventParent) !== 'function' ) break;
					targets.push(p);
					p = p.eventParent();
				}
			}

			for(var i=0; i < targets.length; i++) {
				var target = targets[i];
				event.target = target;
				
				target.dispatchEvent(event, this.scope());
				if( event.cancelBubble ) break;
			}
			
			if( typeof(fn) === 'function' ) {
				fn.call(this, event);
			} else if( fn ) {
				console.warn('invalid event callback:', action, fn);
			}

			return event;
		},
		fire: function(action, values, fn) {
			//if( action === 'named' ) console.error('fire', action, values);
			if( typeof(action) !== 'string' ) return this;

			var self = this;
			setTimeout(function() {
				self.fireSync(action, values, fn);
			}, 1);

			return this;
		}
	};
	

	return EventDispatcher;
})();



var Path = (function() {
	"use strict"

	function Path(src) {
		if( src instanceof Path ) src = src.src;
		if( !src || typeof(src) !== 'string' ) throw new Error('invalid path:' + src);
		this.src = src.trim();
	}

	Path.prototype = {
		join: function(path) {
			return Path.join(this.src, path);
		},
		dir: function() {
			return Path.dir(this.src);
		},
		uri: function() {
			return Path.uri(this.src);
		},
		filename: function() {
			return Path.filename(this.src);
		},
		querystring: function() {
			return Path.querystring(this.src);
		},
		query: function() {
			return Path.query(this.src);
		},
		host: function() {
			return Path.host(this.src);
		},
		parse: function() {
			return Path.parse(this.src);
		},
		parent: function() {
			return Path.parent(this.src);
		},
		isFile: function() {
			return !( src.endsWith('/') );
		},
		isDirectory: function() {
			return src.endsWith('/');
		},
		toString: function() {
			return this.src;
		}
	};
		
	Path.join = function(base, path) {
		if( !base ) return path;
		if( base instanceof Path ) base = base.src;
		if( path instanceof Path ) path = path.src;

		base = this.dir(base);
		path = path.trim();

		if( path.indexOf(':') >= 0 ) return path;

		if( path.startsWith('/') ) {
			var i;
			if( (i = base.indexOf('://')) >= 0 ) {
				base = base.substring(0, base.indexOf('/', i + 3));
			} else if( (i = base.indexOf(':')) >= 0 ) {
				base = base.substring(0, i + 1);
			} else {
				return path;
			}
		} else {			
			// 상대경로 맞추기
			for(;path.startsWith('.');) {
				if( path.startsWith('./') ) {
					path = path.substring(2);
				} else if( path.startsWith('../') ) {
					base = this.parent(base);
					path = path.substring(3);
					if( !base ) return null;
				} else {
					return null;	// 오류
				}
			}
		}
		
		return base + path;
	};
	
	Path.dir = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		var base = '', i;

		if( (i = path.indexOf('://')) ) {
			i = path.indexOf('/', i + 3);
			if( i < 0 ) return path + '/';

			base = path.substring(0, i) || path;
			path = path.substring(i);
		}
		
		if( path.endsWith('/') ) {
			path = path;
		} else if( path.indexOf('/') >= 0 ) {
			path = path.substring(0, path.lastIndexOf('/')) + '/';
		} else {
			path = path + '/';
		}

		return base + path;
	};
	
	Path.filename = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		if( path.endsWith('/') ) {
			path = path.substring(0, path.length - 1);
			return path.substring(path.lastIndexOf('/') + 1);
		} else {
			return path.substring(path.lastIndexOf('/') + 1);
		}
	};

	Path.uri = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		return path;
	};

	Path.querystring = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = path.trim();

		if( ~path.indexOf('?') ) path = path.substring(path.indexOf('?') + 1);
		else return '';
	};

	Path.query = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		var q = this.querystring(q);
		var query = {};
		q.replace(
			new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
			function($0, key, $2, value) {
				if( !key || value === undefined ) return;

				if( value.indexOf('#') >= 0 ) value = value.substring(0, value.lastIndexOf('#'));

				if( o.query[key] !== undefined ) {
					if( !Array.isArray(query[key]) ) query[key] = [query[key]];
					query[key].push(value);
				} else {
					query[key] = value;
				}
			}
		);

		return query;
	};

	Path.host = function(url) {
		if( !url ) return null;
		if( url instanceof Path ) url = url.src;

		if( (i = url.indexOf('://')) >= 0 ) {
			var j = url.indexOf('/', i + 3);
			url = url.substring(i + 3, (j >= 0) ? j : url.length);
			if( (i = url.indexOf(':')) >= 0 ) url = url.substring(0, i);
			return url;
		} else {
			return null;
		}
	};

	Path.parse = function(url) {
		if( !url ) return null;
		if( url instanceof Path ) url = url.src;

		return {
			url: url,
			uri: this.uri(url),
			host: this.host(url),
			querystring: this.querystring(url),
			query: this.query(url),
			name: this.filename(url),
			dir: this.dir(url),
			parent: this.parent(url)			
		};			
	};

	Path.parent = function(path) {
		if( !path ) return null;
		if( path instanceof Path ) path = path.src;

		path = this.dir(path);

		if( ~path.indexOf('?') ) path = path.substring(0, path.indexOf('?'));
		if( ~path.indexOf('#') ) path = path.substring(0, path.indexOf('#'));

		var arg = path.split('/');
		if( !arg || arg.length <= 2 ) return null;
		return arg.splice(0, arg.length - 2).join('/') + '/';
	};

	return Path;
})();



/*
var url_file = 'http://host:8080/appbus/module/appbus.ui.json';
var windows_file = 'c:/appbus/module/appbus.ui.json';
var unix_file = '/appbus/module/appbus.ui.json';

var url_dir = 'http://host:8080/appbus/module/';
var windows_dir = 'c:/appbus/module/';
var unix_dir = '/appbus/module/';

var empty = '';
var path_abs = '/other/other.ui.json';
var path_rel1 = './other.js';
var path_rel2 = '../';
var path_rel3 = '../other/other.ui.json';

console.log('dir.url(file)', Path.dir(url_file));
console.log('dir.windows(file)', Path.dir(windows_file));
console.log('dir.unix(file)', Path.dir(unix_file));

console.log('dir.url(dir)', Path.dir(url_dir));
console.log('dir.windows(dir)', Path.dir(windows_dir));
console.log('dir.unix(dir)', Path.dir(unix_dir));

console.log('name.url(file)', Path.filename(url_file));
console.log('name.windows(file)', Path.filename(windows_file));
console.log('name.unix(file)', Path.filename(unix_file));

console.log('name.url(dir)', Path.filename(url_dir));
console.log('name.windows(dir)', Path.filename(windows_dir));
console.log('name.unix(dir)', Path.filename(unix_dir));

console.log('parent.url(file)', Path.parent(url_file));
console.log('parent.windows(file)', Path.parent(windows_file));
console.log('parent.unix(file)', Path.parent(unix_file));

console.log('parent.url(dir)', Path.parent(url_dir));
console.log('parent.windows(dir)', Path.parent(windows_dir));
console.log('parent.unix(dir)', Path.parent(unix_dir));

console.log('join.url.path_abs(file)', Path.join(url_file, path_abs));
console.log('join.url.path_rel1(file)', Path.join(url_file, path_rel1));
console.log('join.url.path_rel2(file)', Path.join(url_file, path_rel2));
console.log('join.url.path_rel3(file)', Path.join(url_file, path_rel3));

console.log('join.windows.path_abs(file)', Path.join(windows_file, path_abs));
console.log('join.windows.path_rel1(file)', Path.join(windows_file, path_rel1));
console.log('join.windows.path_rel2(file)', Path.join(windows_file, path_rel2));
console.log('join.windows.path_rel3(file)', Path.join(windows_file, path_rel3));

console.log('join.unix.path_abs(file)', Path.join(unix_file, path_abs));
console.log('join.unix.path_rel1(file)', Path.join(unix_file, path_rel1));
console.log('join.unix.path_rel2(file)', Path.join(unix_file, path_rel2));
console.log('join.unix.path_rel3(file)', Path.join(unix_file, path_rel3));


console.log('dir(a)', Path.dir('a'));
console.log('dir(http://host:80)', Path.dir('http://host:80'));
console.log('dir(http://host:80/)', Path.dir('http://host:80/'));
console.log('dir(http://host:80/a)', Path.dir('http://host:80/a'));
console.log('dir(http://host:80/a/b)', Path.dir('http://host:80/a/b'));
console.log('dir(http://host:80/a/b/c)', Path.dir('http://host:80/a/b/c'));
console.log('host(ftp://a.b.c.com)', Path.host('ftp://a.b.c.com'));
console.log('host(ftp://a.b.c.com:8080)', Path.host('ftp://a.b.c.com:8080'));
console.log('host(ftp://a.b.c.com:8080/)', Path.host('ftp://a.b.c.com:8080/'));
console.log('host(ftp://a.b.c.com:8080/a/b/c)', Path.host('ftp://a.b.c.com:8080/a/b/c'));
*/

var Ajax = (function() {
	"use strict"

	function AjaxError(msg, xhr) {
		this.message = msg;
		if( xhr ) {
			this.status = xhr.status;
			this.xhr = xhr;
		}
	}

	AjaxError.toString = function() {
		return this.message;
	};
	
	// eval script in global scope
	function eval_in_global(script) {
		try {
			eval.call(window, script);
		} catch(e) {
			throw new SyntaxError('remote script syntax error (' + e.message + ') in [' + src + ']');
		}
	}

	// eval script in global scope
	function eval_json(script, src) {
		try {
			var o;
			eval('o = ' + script);
			return o;
		} catch(e) {
			throw new SyntaxError('remote json syntax error (' + e.message + ') in [' + src + ']');
		}
	}

	// string to xml
	function string2xml(text){
		if( window.ActiveXObject ) {
			var doc = new ActiveXObject('Microsoft.XMLDOM');
			doc.async = 'false';
			doc.loadXML(text);
		} else {
			var doc = new DOMParser().parseFromString(text, 'text/xml');
		}
		return doc;
	}

	// class ajax
	var Ajax = function() {};
	
	Ajax.prototype = {		
		toqry: function(obj) {
			if( !obj || typeof(obj) != 'object' ) return '';
			
			var s = '';
			var first = true;
			for(var k in obj) {
				var v = obj[k];
				var type = typeof(v);
				if( type == 'string' || type == 'number' || type == 'boolean' ) {
					v = encodeURIComponent(v);
					if( k ) s += ( ((first) ? '':'&') + k + '=' + v);
					first = false;
				}
			}

			return s;
		},
		get: function(url, qry, options, fn) {
			if( typeof(options) == 'function' ) fn = options, options = null;

			if( !url ) {
				if( fn ) fn(new AjaxError('missing url'));
				else throw new AjaxError('missing url');
			}
			
			var o = options || {};
			if( o.eval || o.json ) o.parse = false;
			else if( o.parse !== true ) o.parse = false;
			
			
			if( !fn ) {
				o.sync = true;
				fn = function(err, data) {
					if( err ) throw err;
				};
			}
			
			var result;
			this.ajax(url).qry(qry).parse(o.parse).cache(o.cache).sync(o.sync).get().done(
				function(err,data,xhr) {
					if( err ) return fn(err, data, xhr);
					
					if( o.json ) {
						data = eval_json(data);
					} else if( o.eval ) {
						eval_in_global(data);
					}

					result = data;
					fn(err, data, xhr);
				}
			);

			return result;
		},
		text: function(url, cache, fn) {
			return this.get(url, null, {cache:cache}, fn);
		},
		eval: function(url, cache, fn) {
			return this.get(url, null, {eval:true, cache:cache}, fn);
		},
		json: function(url, cache, fn) {
			return this.get(url, null, {json:true, cache:cache}, fn);
		},
		ajax: function(url) {
			var config = {
				method: 'get',
				sync: false,
				cache: false,
				parse: true
			};

			if( typeof(url) === 'object' ) {
				for(var k in url) {
					config[k] = url[k];
				}
			} else if( typeof(url) === 'string' ) {
				config.url = url;
			} else {
				throw new AjaxError('illegal ajax option(string or object):' + url);
			}

			var handler = null;
			var self = this;

			var execute = function() {
				var fns, err, payload, loaded = false, status, statusText, contentType, parsed = false;
				handler = {
					done: function(fn) {
						fns.listeners.done.push(fn);
						fns.commit();
						return this;
					},
					success: function(fn) {
						fns.listeners.success.push(fn);
						fns.commit();
						return this;
					},
					error: function(fn) {
						fns.listeners.error.push(fn);
						fns.commit();
						return this;
					}
				};

				var o = config;
				
				fns = {
					listeners: {done:[],success:[],error:[]},
					done: function() {
						var l = this.listeners.done, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					success: function() {
						var l = this.listeners.success, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					error: function() {
						var l = this.listeners.error, args = arguments;
						if( l ) {
							l.forEach(function(item) {
								if( typeof(item) === 'function' ) item.apply(o.scope || item, args);
							});
						}
					},
					commit: function() {
						if( loaded ) {							
							var data = payload;
							if( data && !parsed ) {
								if( o.parse && contentType && contentType.indexOf('json') >= 0 && data ) {
									try {
										var json = JSON.parse(data);
										data = json;
									} catch(e) {
										console.error('json parse error:', e.message, '[in ' + url + ']');
									}
								} else if( o.parse && contentType && contentType.indexOf('xml') >= 0 && data ) {
									data = string2xml(data);
								}

								parsed = true;
							}
							
							if( o.interceptor ) {
								o.interceptor.apply(o.scope || this, [{
									config: o,
									error: err,
									xhr: xhr,
									payload: payload,
									data: data,
									statusText: statusText,
									contentType: contentType
								}]);
							} else {
								if( err ) this.error(err, data, xhr, payload);
								else this.success(data, xhr, payload);

								this.done(err, data, xhr, payload);
							}
						}
					}
				};

				if( o.success ) fns.listeners.success.push(o.success);
				if( o.error ) fns.listeners.error.push(o.error);
				if( o.done ) fns.listeners.done.push(o.done);
				
				var url = o.url;
				var qry = self.toqry(o.qry) || '';
				if( url.indexOf('?') > 0 ) url += ((!o.cache ? '&_nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));
				else url += ((!o.cache ? '?_nc=' + Math.random() : '') + ((qry) ? ('&' + qry) : ''));

				// create xhr
				var xhr = ( window.XMLHttpRequest ) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				xhr.open(o.method, url, !o.sync);
				if( o.accept ) xhr.setRequestHeader("Accept", o.accept);

				// success
				var oncomplete = function () {
					payload = xhr.responseText || '';
					status = xhr.status;
					statusText = xhr.statusText;
					contentType = xhr.getResponseHeader('Content-Type');
					loaded = true;

					if( xhr.status == 200 || xhr.status == 204 ) {
						err = null;
					} else {
						err = new AjaxError(statusText || status, xhr);
					}

					fns.commit();
				};

				// error
				var onerror = function() {
					payload = xhr.responseText || '';
					status = xhr.status;
					statusText = xhr.statusText;
					contentType = xhr.getResponseHeader('Content-Type');
					loaded = true;
					err = statusText || status || 'unknown ajax error';

					fns.commit();
				};

				if( xhr.addEventListener ) {
					xhr.addEventListener("load", oncomplete, false);
					xhr.addEventListener("error", onerror, false);
					xhr.addEventListener("abort", onerror, false);
				} else {
					xhr.onreadystatechange = function() {
						if( xhr.readyState === 4 ) oncomplete();
					};
					xhr.onload = onload;
					xhr.onerror = onerror;
					xhr.onabort = onerror;
				}

				handler.xhr = xhr;
				
				try {
					if( o.payload ) {
						if( typeof(o.payload) === 'object' ) {
							o.payload = JSON.stringify(o.payload);
							o.contentType = 'application/json';
						}
						
						xhr.setRequestHeader('Content-Type', (o.contentType || 'application/x-www-form-urlencoded') + (o.charset ? ('; charset=' + o.charset) : ''));

						xhr.send(o.payload);
					} else {
						xhr.send();
					}
				} catch(e) {
					err = e;
					status = -1;
					statusText = 'script error:' + e;
					loaded = true;
					fns.commit();
				}

				return handler;
			};

			return {
				qry: function(qry) {
					if( !qry ) return this;
					config.qry = qry;
					return this;
				},
				nocache: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					return this.cache(!b);
				},
				cache: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.cache = b;
					return this;
				},
				parse: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.parse = b;
					return this;
				},
				sync: function(b) {
					if( !arguments.length) b = true;
					if( typeof(b) != 'boolean' ) return this;
					config.sync = b;
					return this;
				},
				url: function(url) {
					if( !url ) return this;
					config.url = url;
					return this;
				},
				contentType: function(type) {
					config.contentType = type;
					return this;
				},
				charset: function(charset) {
					config.charset = charset;
					return this;
				},
				accept: function(accept) {
					config.accept = accept;
					return this;
				},
				post: function(payload) {
					config.method = 'post';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				put: function(payload) {
					config.method = 'put';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				get: function(payload) {
					config.method = 'get';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				options: function(payload) {
					config.method = 'options';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				del: function(payload) {
					config.method = 'delete';
					if( payload ) config.payload = payload;
					else config.payload = null;
					return this;
				},
				interceptor: function(fn) {
					config.interceptor = fn;
					return this;
				},
				listeners: function(listeners) {
					if( listeners.success ) config.success = listeners.success;
					if( listeners.error ) config.error = listeners.error;
					if( listeners.done ) config.done = listeners.done;

					return this;
				},
				scope: function(scope) {
					config.scope = scope;
					return this;
				},
				
				// execute
				execute: function() {
					if( handler ) throw new AjaxError('already executed');
					return execute();
				},
				done: function(fn) {
					if( !handler ) execute();
					handler.done(fn);
					return handler;
				},
				success: function(fn) {
					if( !handler ) execute();
					handler.success(fn);
					return handler;
				},
				error: function(fn) {
					if( !handler ) execute();
					handler.error(fn);
					return handler;
				}
			};
		}
	};

	return new Ajax();
})();

var Require = (function() {	
	// imports
	var global = window;
	
	var current_uri = Path.uri(location.href);

	// privates
	// create new require environment for each module
	function createRequire(src) {
		src = Path.join(current_uri, src) || current_uri;
		src = Path.dir(src);
		return (function(base) {
			return function require(path, reload, nocache) {				
				if( path.startsWith('./') || ~path.indexOf('://') ) {
					path = Path.join(base, path);
				}

				return Require.get(path, reload, nocache);
				
			};
		})(src);
	}

	// create sandbox
	var excepts = ['require', 'Map', 'Set', 'WeakMap', 'console', 'alert', 'confirm', 'print', 'prompt', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'];
	var sandbox = function() {
		var o = {};

		for(var k in window) {
			if( ~excepts.indexOf(k) ) continue;
			o[k] = undefined;
		}

		return o;
	};

	var global = {__sandbox_global__:1};
	
	// eval as module
	function eval_as_module(script, src) {
		// closure variables clear prepare for a possible illegal access in inner modules
		//var document = null, Element = null, window = null, $ = null, $$ = null;
		
		src = src || current_uri;
		
		var exports = {};
		var require = createRequire(src);
		var module = {
			exports:exports
		};

		// extract current require dirname & filename
		var __filename = Path.join(Path.dir(current_uri), src);
		var __dirname = Path.dir(__filename);

		//try {
			var scope = sandbox();
			scope.Ajax = undefined;
			scope.Path = undefined;
			scope.Require = undefined;
			scope.eval_as_module = undefined;
			scope.sandbox = undefined;
			scope.excepts = undefined;
			scope.createRequire = undefined;
			scope.global = global;

			with(scope) {
				if( typeof(script) === 'string' ) {
					eval('(function(module, require, exports, __filename, __dirname) {	' + script + ' \n})(module, require, exports, __filename, __dirname);');
				} else if( typeof(script) === 'function' ) {
					script(module, require, exports, __filename, __dirname);
				} else {
					throw new Error('illegal script or function');
				}
			}
		/*} catch(e) {
			//throw new SyntaxError('remote module syntax error (' + e.message + ' at ' + e.lineNumber + ') in [' + __filename + ']');
			console.error('remote module syntax error (' + e.message + ') in [' + __filename + ']');
			//throw e;
		}*/

		return module;
	}
	
	var Require;
	return Require = (function() {
		"use strict"
		
		// eval script in global scope
		function eval_json(json, src) {
			try {
				eval('json = ' + json);
				return json;
			} catch(e) {							
				throw new SyntaxError('json [' + src + '] has syntax error (' + e.message + ')');
			}

			/*try {
				if( window.JSON ) {
					try {
						json = JSON.parse(json);
					} catch(err) {
						try {
							eval('json = ' + json);
							console.error('[WARN] json syntax warning "' + err.message + '" at "' + src + '"');
						} catch(e) {							
							throw new SyntaxError('json [' + src + '] has syntax error (' + e.message + ')');
						}
					}
				} else {
					eval('json = ' + json);
				}

				return json;
			} catch(err) {
				throw new SyntaxError('json file [' + src + '] has syntax error (' + err.message + ')');
			}*/
		}
		
		// ajax execute to eval remote script
		function conn(src, cache, sync, fn) {
			Ajax.ajax(src).cache(cache).parse(false).sync(sync).get().done(function(err, data, xhr) {
				if( err ) return fn(err, data, xhr);
				
				var contentType = xhr.getResponseHeader('content-type');
					
				if( contentType && ~contentType.indexOf('javascript') ) {
					data = eval_as_module(data, src);
				} else if( contentType && ~contentType.indexOf('/json') || (src.lastIndexOf('.json') >= 0 && src.lastIndexOf('.json') === src.length - '.json'.length) ) {
					data = {
						exports: eval_json(data, src)
					};
				} else if( contentType && ~contentType.indexOf('text/') || (src.lastIndexOf('.html') >= 0 && src.lastIndexOf('.html') === src.length - '.html'.length) ) {
					data = data;
				} else {
					data = eval_as_module(data, src);
				}

				fn(null, data);
			});
		}

		var cached = {};
		var bundles = {
			'window': window,
			'document': document,
			'ajax': Ajax,
			'path': function(module) {  module.exports = Path; },
			'events': function(module) {  module.exports = EventDispatcher; }
		};

		// class Require, singleton
		function Require() {}

		Require.prototype = {
			bundles: function() {
				return bundles;
			},
			bundle: function(name) {
				return bundles[name];
			},
			cached: function() {
				return cached;
			},
			define: function(name, fn) {
				if( !name || typeof(name) !== 'string' ) return this;

				bundles[name] = fn;
			},
			defines: function(o) {
				if( !arguments.length ) return bundles;

				if( typeof(o) !== 'object' ) return null;

				for(var k in o) {
					if( !o.hasOwnProperty(k) || k[0] === '_' || ~k.indexOf(' ') ) continue;				
					this.define(k, o[k]);
				}

				return this;
			},
			get: function(path, reload, nocache, fn) {
				if( reload === true ) cached[path] = null;

				if( typeof(path) !== 'string' ) throw new Error('invalid path \'' +  + path + '\'');

				var module;
				
				//console.log('path', path, this.bundle(path));

				// if in bundles
				var bundle = this.bundle(path);
				
				if( typeof(bundle) === 'function' ) {					
					module = cached[path] || eval_as_module(bundle);					
				} else if( bundle ) {
					module = {exports:bundle};
				} else if( path.startsWith('./') || ~path.indexOf('://') ) {
					var cache = (nocache === true) ? false : true;
					
					if( typeof(fn) === 'function' ) {
						if( cached[path] ) return fn(null, cached[path]);
						
						conn(path, cache, false, function(err, module) {
							if( err ) fn(err);

							if( module ) cached[path] = module;
							else fn(new Error('Can not load module \'' + path + '\''));

							fn(null, module);
						});
						return;
					} else {
						conn(path, cache, true, function(err, data) {
							if( err ) throw err;
							module = data;
						});
					}
				}

				if( module ) cached[path] = module;

				if( typeof(fn) === 'function' ) {
					if( !module ) fn(new Error('Can not find module \'' + path + '\''));
					return fn(null, (module && module.exports || module));
				} else {				
					if( !module ) throw new Error('Can not find module \'' + path + '\'');
					return module && module.exports;
				}
			},
			sync: function(path, reload, nocache) {
				return this.get(path, reload, nocache);
			},
			async: function(path, reload, nocache) {
				var self = this;
				return {
					done: function(fn) {
						self.get(path, reload, nocache, fn);
					}
				};
			}
		};

		return Require = new Require();
	})();
})();

(function() {
	// export require in global
	var another = window.require;
	var anotherd = window.define;
	
	var require = function(src, cache) {
		return Require.sync(src, cache);
	};

	window.require = require;
	window.define = Require.define;

	window.require.noConflict = function() {
		window.require = another;
		window.define = anotherd;
		return require;
	};

	var __require_jquery_url__ = 'http://code.jquery.com/jquery-latest.js';
	if( window.__require_jquery_url__ ) __require_jquery_url__ = window.__require_jquery_url__;

	// additional bundle module for jquery... 
	Require.define('jquery', function(module) {
		var $, error;

		var load = function(fn) {
			var script = document.createElement("script");
			script.charset = 'utf-8';
			script.async = true;
			script.src = __require_jquery_url__;
			
			var done = false;
			script.onload = script.onreadystatechange = function(e) {
				if ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
					done = true;
					$ = window.jQuery;
					fn($);
				} else if( this.readyState === "error" ) {
					error = 'jquery(http://code.jquery.com/jquery-latest.js) load error';
					console.error(error);
				}
			};

			script.onerror = function(e) {
				error = 'jquery(http://code.jquery.com/jquery-latest.js) load error';
				console.error(error);
			};
			
			var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
			head.appendChild(script);
		};
		
		module.exports = {
			ready: function(fn) {
				if( $ ) fn($);
				else if( error ) console.error(error);
				else load(fn);
			}
		};
	});
})();


/*
-- TODO : 언젠간 jsonp 를...
var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
var script = document.createElement("script");
if ( charset ) script.charset = charset;

script.async = false;

if( script.addEventListener ) {
	script.addEventListener('load', function() {
	});
	script.addEventListener('error', function() {
	});
} else if(script.attachEvent) {
	script.attachEvent('onload', function() {
	});
	script.attachEvent('onerror', function() {
	});
} else {
	var done = false;
	script.onload = script.onreadystatechange = function() {
		if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
		} else if( this.readyState === "error" ) {
		}
	};
}

script.src = 'http://code.jquery.com/jquery-latest.js';
head.insertBefore(script, head.firstChild);
*/
