// es5.js [attrs.ui-0.6.0]
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

// EOF of es5.js [attrs.ui-0.6.0]

// es6.js [attrs.ui-0.6.0]
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
// EOF of es6.js [attrs.ui-0.6.0]

// BOF.js [attrs.ui-0.6.0]
/*!
 * attrs.ui (MIT License)
 * 
 * @author: joje
 * @version: 0.7.0
 */
(function() {
	var __build_info__ = {
		version: '0.7.0',
		starttime: new Date().getTime(),
		print: function() {
			console.log('* attrs.ui info');
			console.log('\tversion: ' + __build_info__.version );
			console.log('\tcore build: ' + __build_info__.buildtime + ' ms');
			console.log('\telapsed time to here: ' + (new Date().getTime() - __build_info__.finishtime) + ' ms');
			console.log('\ttotal elapsed time: ' + (new Date().getTime() - __build_info__.starttime) + ' ms');
		}
	};

	var UI = {};
	
	// start class definitions
// EOF of BOF.js [attrs.ui-0.6.0]

// Util.js [attrs.ui-0.6.0]
var Util = (function() {
	"use strict"

	function mix(o1, o2) {
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

	function currency(n, f){
		var c, d, t;

		var n = n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	}

	return {
		mix: mix,
		clone: function(o, allprototype) {
			return clone(o, true, allprototype);
		},
		copy: function(o) {
			return clone(o);
		},
		array: {
			removeByItem: array_removeByItem
		},
		currency: currency
	};
})();



/*
var arg = ['1', '2', '3', '4', '3'];
console.log(Util.array.removeByItem(arg, '3'), arg.length);
*/

// EOF of Util.js [attrs.ui-0.6.0]

// DateUtil.js [attrs.ui-0.6.0]
var DateUtil = (function() {
	"use strict"

	/*
	 * Date Format 1.2.3
	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
	 * MIT license
	 *
	 * Includes enhancements by Scott Trenda <scott.trenda.net>
	 * and Kris Kowal <cixar.com/~kris.kowal/>
	 *
	 * Accepts a date, a mask, or a date and a mask.
	 * Returns a formatted version of the given date.
	 * The date defaults to the current date/time.
	 * The mask defaults to dateFormat.masks.default.
	 */
	var dateFormat = function () {
		var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			timezoneClip = /[^-+\dA-Z]/g,
			pad = function (val, len) {
				val = String(val);
				len = len || 2;
				while (val.length < len) val = "0" + val;
				return val;
			};

		// Regexes and supporting functions are cached through closure
		return function (date, mask, utc) {
			var dF = dateFormat;

			// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
			if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
				mask = date;
				date = undefined;
			}

			// Passing date through Date applies Date.parse, if necessary
			date = date ? new Date(date) : new Date;
			if (isNaN(date)) throw SyntaxError("invalid date");

			mask = String(dF.masks[mask] || mask || dF.masks["default"]);

			// Allow setting the utc argument via the mask
			if (mask.slice(0, 4) == "UTC:") {
				mask = mask.slice(4);
				utc = true;
			}

			var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
				flags = {
					d:    d,
					dd:   pad(d),
					ddd:  dF.i18n.dayNames[D],
					dddd: dF.i18n.dayNames[D + 7],
					m:    m + 1,
					mm:   pad(m + 1),
					mmm:  dF.i18n.monthNames[m],
					mmmm: dF.i18n.monthNames[m + 12],
					yy:   String(y).slice(2),
					yyyy: y,
					h:    H % 12 || 12,
					hh:   pad(H % 12 || 12),
					H:    H,
					HH:   pad(H),
					M:    M,
					MM:   pad(M),
					s:    s,
					ss:   pad(s),
					l:    pad(L, 3),
					L:    pad(L > 99 ? Math.round(L / 10) : L),
					t:    H < 12 ? "a"  : "p",
					tt:   H < 12 ? "am" : "pm",
					T:    H < 12 ? "A"  : "P",
					TT:   H < 12 ? "AM" : "PM",
					Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
					o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
				};

			return mask.replace(token, function ($0) {
				return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
			});
		};
	}();

	// Some common format strings
	dateFormat.masks = {
		"default":      "ddd mmm dd yyyy HH:MM:ss",
		shortDate:      "m/d/yy",
		mediumDate:     "mmm d, yyyy",
		longDate:       "mmmm d, yyyy",
		fullDate:       "dddd, mmmm d, yyyy",
		shortTime:      "h:MM TT",
		mediumTime:     "h:MM:ss TT",
		longTime:       "h:MM:ss TT Z",
		isoDate:        "yyyy-mm-dd",
		isoTime:        "HH:MM:ss",
		isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};

	// Internationalization strings
	dateFormat.i18n = {
		dayNames: [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
			"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
		],
		monthNames: [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		]
	};

	// For convenience...
	Date.prototype.format = function (mask, utc) {
		return dateFormat(this, mask, utc);
	};

	return {
		format: function(date, mask, utc) {
			return dateFormat(date, mask, utc);
		}
	};
})();

// EOF of DateUtil.js [attrs.ui-0.6.0]

// Color.js [attrs.ui-0.6.0]
var Color = (function() {
	"use strict"

	return {
		hexToR : function(h) {return parseInt((this.cutHex(h)).substring(0,2),16)},
		hexToG : function(h) {return parseInt((this.cutHex(h)).substring(2,4),16)},
		hexToB : function(h) {return parseInt((this.cutHex(h)).substring(4,6),16)},
		cutHex : function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h},
		toRGBA : function(h, alpha) {
			if( !h ) return null;
			if( ! alpha ) alpha = 1;
			alpha = parseInt(alpha);
			if( isNaN(alpha) ) alpha = 1;

			//*console.log(h);

			if( typeof(h) == 'object' ) {
				return 'rgba(' + h.r + ',' + h.g + ',' + h.b + ',' + alpha + ')';
			} else if( typeof(h) == 'string' ) {		
				return 'rgba(' + this.hexToR(h) + ',' + this.hexToG(h) + ',' + this.hexToB(h) + ',' + alpha + ')';
			}
		},
		toRGB : function(h) {
			if( !h ) return null;
			return {
				r : this.hexToR(h),
				g : this.hexToG(h),
				b : this.hexToB(h)
			};
		},
		changeAlpha: function(rgba, alpha) {
			if( !rgba ) return null;

			if( rgba.startsWith('#') ) {
				var rgba = toRGB(rgba);
			}

			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
			} else if( rgba.startsWith('rgb(') ) {
				var digits = /(.*?)rgb\((.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
			}

			if( digits ) {
				var r = parseInt(digits[2]);
				var g = parseInt(digits[3]);
				var b = parseInt(digits[4]);

				return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
			}
			return null;
		},
		getAlpha: function(rgba) {
			if( !rgba ) return null;
			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var a = parseFloat(digits[5]);
				return a;
			}
			return null;
		},
		toHex: function(rgba) {
			if( !rgba ) return null;
			if( rgba.startsWith('rgba(') ) {
				var digits = /(.*?)rgba\((.*?),(.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				
				var rgb = blue | (green << 8) | (red << 16);
				return '#' + rgb.toString(16).toUpperCase();
			} else if( rgba.startsWith('rgb(') ) {
				var digits = /(.*?)rgb\((.*?),(.*?),(.*?)\)(.*?)/.exec(rgba);
				
				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				
				var rgb = blue | (green << 8) | (red << 16);
				return '#' + rgb.toString(16).toUpperCase();
			} else if( rgba.startsWith('#') ) {
				return rgba;
			} else {
				return null;
			}
		},
		sumRGB : function(h, r, g, b) {
			if( !h ) return null;
			var a = {
				r : this.hexToR(h) + r,
				g : this.hexToG(h) + g,
				b : this.hexToB(h) + b
			};

			a.r = (a.r <= 255) ? a.r : 255;
			a.g = (a.g <= 255) ? a.g : 255;
			a.b = (a.b <= 255) ? a.b : 255;

			return a;
		},
		sumRGBA : function(h, r, g, b, alpha) {
			if( !h ) return null;
			var a;
			
			if( typeof(h) == 'object' ) {
				a = {
					r : h.r + r,
					g : h.g + g,
					b : h.b + b
				};
			} else if( typeof(h) == 'string' ) {
				a = {
					r : this.hexToR(h) + r,
					g : this.hexToG(h) + g,
					b : this.hexToB(h) + b
				};
			}

			a.r = (a.r <= 255) ? a.r : 255;
			a.g = (a.g <= 255) ? a.g : 255;
			a.b = (a.b <= 255) ? a.b : 255;

			return this.toRGBA(a, alpha);
		}
	};
})();

// EOF of Color.js [attrs.ui-0.6.0]

// EventDispatcher.js [attrs.ui-0.6.0]
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


// EOF of EventDispatcher.js [attrs.ui-0.6.0]

// Options.js [attrs.ui-0.6.0]
var Options = (function() {
	"use strict"

	function Options(o) {
		for(var k in o) {
			if( o.hasOwnProperty(k) ) {
				this[k] = o[k];
			}
		}
	}

	Options.prototype = {
		set: function(key, value) {
			this[key] = value;
		},
		get: function(key) {
			return this[key];
		},
		toJSON: function() {
			var json = {};
			for(var k in this) {
				if( this.hasOwnProperty(k) ) {
					json[k] = this[k];
				}
			}

			return json;
		}
	};

	return Options;
})();

// EOF of Options.js [attrs.ui-0.6.0]

// Class.js [attrs.ui-0.6.0]
var Class = (function() {	
	"use strict"
	
	// extract function name
	function fname(f) {
		if( typeof(f) != 'function' ) return null;
		var n = /\W*function\s+([\w\$]+)\(/.exec( f.toString() );
		return (n) ? n[1] : null;
	}

	// copy getter/setter
	function cgs(src, dest, k) {
		var g, s;
		if( src.__lookupGetter__ ) {
			g = src.__lookupGetter__(k);
			s = src.__lookupSetter__(k);
		}

		if ( dest.__defineGetter__ && (g || s) ) {
			//TODO : 같은 애트리뷰트가 상위의 getter/setter 일 수 있으므로... 체크해야 한다.
			if ( g ) dest.__defineGetter__(k, g);
			if ( s ) dest.__defineSetter__(k, s);
			return true;
		} else {
			return false;
		}
	}

	var _ = {}, issuper = false, debug = true;

	var Class = {
		fname: fname,
		inherit: function inherit(clz, sclz, instantiatable) {
			if( typeof(clz) !== 'function' ) throw new TypeError('class must be a function');
			if( sclz && typeof(sclz) !== 'function' ) throw new TypeError('super class must be a function');
			
			//console.log('-- ' + fname(clz));
						
			var attrs = {};
			var constructor = function(a) {
				if( a !== _ ) {
					if( instantiatable === false && !issuper ) throw new TypeError('this class cannot instantiatable');
					// bind $super initializer
					var self = this;
					this.$super = function() {
						issuper = true;
						var r = sclz.apply(self, arguments);
						issuper = false;
						return r;
					};
					
					// bind prototype attributes : ignore if called by $super
					if( !issuper ) {
						for (var k in attrs) {
							this[k] = attrs[k];
						}
					}
					
					// call initializer
					var r = clz.apply(this, arguments);
					try {delete this['$super'];} catch(e) {this['$super'] = null;}
					return r;
				};
			};

			// define cls class
			var cls = function cls() {constructor.apply(this, arguments);}

			// for debug
			if( debug ) {
				var name = fname(clz);
				eval('cls = function ' + (name || 'anonymous') + '() {constructor.apply(this, arguments);}');
				cls.__cls_name__ = name;
			}

			// inheritance
			if( sclz ) cls.prototype = new sclz(_);
			cls.prototype.constructor = cls;
			cls.origin = clz;
			cls.inherits = sclz;
			cls.clone = function() {
				return Class.inherit(clz, sclz, instantiatable);
			};

			// copy prototype
			var proto = clz.prototype;
			for( var k in proto ) {
				if( !proto.hasOwnProperty(k) ) continue;

				if( !cgs(proto, cls, k) ) {
					var v = proto[k];
					
					if( sclz && typeof(v) == 'function' && typeof(sclz.prototype[k]) == 'function' ) {
						cls.prototype[k] = function(name, fn) {
							return function() {
								var self = this;
								var p = this.$super;
								this.$super = function() {
									sclz.prototype[name].apply(self, arguments);
								};
								var r = fn.apply(this, arguments);
								if( p ) {
									this.$super = p;
								} else {
									this.$super = null;
									try {delete this['$super'];} catch(e) {this['$super'] = null;}
								}

								return r;
							};
						}(k, v);
					} else {
						cls.prototype[k] = v;
					}
				}
			}

			// copy static
			for( var k in clz ) {
				if( clz.hasOwnProperty(k) ) if( !cgs(clz, cls, k) ) cls[k] = clz[k];
			}

			// extract attributes
			for( var k in cls.prototype ) {
				var v = cls.prototype[k];
				if( typeof(v) != 'function' ) {
					attrs[k] = v;
				}
			}
			
			return cls;
		}
	};
	
	return Class;
})();


// EOF of Class.js [attrs.ui-0.6.0]

// HashController.js [attrs.ui-0.6.0]
var HashController = (function() {
	"use strict"
	
	var handlers = [];

	// singleton
	function HashController() {
	}

	HashController.prototype = {
		current: function() {
			var hash = window.location.hash || '#';
			return hash.substring(1);
		},
		start: function() {
			var self = this;
			if( "onhashchange" in window ) {
				this.listener = function (e) {
					self.invoke();
				};

				if( window.addEventListener ) window.addEventListener("hashchange", this.listener, false);
				else window.attachEvent("hashchange", this.listener);
			} else {
				var current = window.location.hash;
				this.poller = window.setInterval(function () {
					if (window.location.hash != current) {
						current = window.location.hash;
						self.invoke();
					}
				}, 200);
			}
		},
		stop: function() {
			if( this.poller ) window.clearInterval(this.poller);
			if( this.listener ) {
				if( window.removeEventListener ) window.removeEventListener("hashchange", this.listener, false);
				else window.detachEvent("hashchange", this.listener);
			}
		},
		invoke: function() {
			for(var i=0; i < handlers.length; i++) {
				var handler = handlers[i];
				var fn = handler.fn;
				var scope = handler.scope || window;

				if( typeof(fn) === 'object' ) {
					scope = fn;
					fn = fn.onHash;
					if( !fn ) continue;
				}

				//try {
					var hash = window.location.hash || '';
					hash = hash.split('#').join('');

					fn.call(scope, hash, window.location);
				//} catch(err) {
				//	console.error('WARN:exception occured in hash handler', err.message, err, fn, scope);
				//}
			}
		},
		handlers: function() {
			return handlers.slice();
		},
		unregist: function(fn) {
			if( !fn ) return false;
			if( typeof(fn) === 'object' && fn.onHash ) {
				fn = fn.onHash;
			}
			
			var target;
			for(var i=0; i < handlers.length;i++) {
				if( handlers[i] && handlers[i].fn === fn ) {
					target = handlers[i];
				}
			}

			if( !target ) return false;

			handlers.splice(handlers.indexOf(target), 1);
			return true;
		},
		regist: function(fn, scope) {
			if( !fn ) return this;

			handlers.push({
				fn: fn,
				scope: scope
			});

			return this;
		}
	};

	return new HashController();	
})();



// EOF of HashController.js [attrs.ui-0.6.0]

// CSS3Calibrator.js [attrs.ui-0.6.0]
var DefaultCSS3Validator = (function() {
	"use strict"

	var PREFIX_KEYS = [
		'align-content',
		'align-items',
		'align-self',
		'animation-delay',
		'animation-direction',
		'animation-duration',
		'animation-fill-mode',
		'animation-iteration-count',
		'animation-name',
		'animation-play-state',
		'animation-timing-function',
		'appearance',
		'backface-visibility',
		'background-clip',
		'background-composite',
		'background-origin',
		'background-size',
		'border-fit',
		'border-horizontal-spacing',
		'border-image',
		'border-vertical-spacing',
		'box-align',
		'box-decoration-break',
		'box-direction',
		'box-flex',
		'box-flex-group',
		'box-lines',
		'box-ordinal-group',
		'box-orient',
		'box-pack',
		'box-reflect',
		'box-shadow',
		'box-sizing',
		'color-correction',
		'column-axis',
		'column-break-after',
		'column-break-before',
		'column-break-inside',
		'column-count',
		'column-gap',
		'column-rule-color',
		'column-rule-style',
		'column-rule-width',
		'column-span',
		'column-width',
		'filter',
		'flex',
		'flex-direction',
		'flex-flow',
		'flex-wrap',
		'flow-from',
		'flow-into',
		'flex-glow',
		'flex-shrink',
		'flex-basis',
		'font-kerning',
		'font-smoothing',
		'font-variant-ligatures',
		'grid-column',
		'grid-columns',
		'grid-row',
		'grid-rows',
		'highlight',
		'hyphenate-character',
		'hyphenate-limit-after',
		'hyphenate-limit-before',
		'hyphenate-limit-lines',
		'hyphens',
		'justify-content',
		'line-align',
		'line-box-contain',
		'line-break',
		'line-clamp',
		'line-grid',
		'line-snap',
		'locale',
		'margin-after-collapse',
		'margin-before-collapse',
		'marquee-direction',
		'marquee-increment',
		'marquee-repetition',
		'marquee-style',
		'mask-attachment',
		'mask-box-image',
		'mask-box-image-outset',
		'mask-box-image-repeat',
		'mask-box-image-slice',
		'mask-box-image-source',
		'mask-box-image-width',
		'mask-clip',
		'mask-composite',
		'mask-image',
		'mask-origin',
		'mask-position',
		'mask-repeat',
		'mask-size',
		'nbsp-mode',
		'order',
		'perspective',
		'perspective-origin',
		'print-color-adjust',
		'region-break-after',
		'region-break-before',
		'region-break-inside',
		'region-overflow',
		'rtl-ordering',
		'shape-inside',
		'shape-outside',
		'svg-shadow',
		'tap-highlight-color',
		'text-combine',
		'text-decorations-in-effect',
		'text-emphasis-color',
		'text-emphasis-position',
		'text-emphasis-style',
		'text-fill-color',
		'text-orientation',
		'text-security',
		'text-stroke-color',
		'text-stroke-width',
		'transform',
		'transform-origin',
		'transform-style',
		'transition',
		'transition-delay',
		'transition-duration',
		'transition-property',
		'transition-timing-function',
		'user-drag',
		'user-modify',
		'user-select',
		'wrap-flow',
		'wrap-margin',
		'wrap-padding',
		'wrap-through',
		'writing-mode',
		'text-size-adjust'
	];

	var PREFIX_VALUES = {
		'display': ['box', 'flex', 'flexbox'],
		'transition': ['transform'],
		'transition-property': ['transform']
	};
	
	var NUMBER_SUFFIXES = {
		'height': 'px',
		'min-height': 'px',
		'max-height': 'px',
		'width': 'px',
		'min-width': 'px',
		'max-width': 'px',
		'margin': 'px',
		'margin-left': 'px',
		'margin-right': 'px',
		'margin-top': 'px', 
		'margin-bottom': 'px', 
		'padding': 'px',
		'padding-left': 'px',
		'padding-right': 'px',
		'padding-top': 'px',
		'padding-bottom': 'px',
		'line-height': 'px',
		'marquee-increment': 'px',
		'mask-box-image-outset': 'px',
		'column-rule-width': 'px',
		'border-image-outset': 'px',
		'border-left-width': 'px',
		'border-right-width': 'px',
		'border-top-width': 'px',
		'border-bottom-width': 'px',
		'border-top-left-radius': 'px',
		'border-top-right-radius': 'px',
		'border-bottom-left-radius': 'px',
		'border-bottom-right-radius': 'px',
		'outline-offset': 'px',
		'outline-width': 'px',
		'word-spacing': 'px',
		'text-indent': 'px',
		'font-size': 'px',

		'animation-duration': 's',
		'animation-delay': 's',
		'transition-delay': 's',
		'transition-duration': 's',

		'perspective-origin': '%',
		'text-stroke-width': 'px'
	};

	// remove prefix in value
	function normalizeValue(v) {
		if( !v || typeof(v) !== 'string' ) return v;

		v = v.trim();
		v = v.split('-webkit-').join('');
		v = v.split('-moz-').join('');
		v = v.split('-ms-').join('');
		v = v.split('-o-').join('');
		v = v.split('-wap-').join('');

		return v;
	}
	
	// remove prefix in key
	function normalizeKey(v) {
		if( typeof(v) === 'string' ) return normalizeValue(v.toLowerCase());
		return v;
	}

	// class DefaultCSSValidator
	function DefaultCSS3Validator(prefix) {
		prefix = prefix || '';
		if( prefix ) prefix = '-' + prefix + '-';
		prefix = prefix.split('--').join('-');
		this.prefix = prefix;
	}

	DefaultCSS3Validator.prototype = {
		rule: function(rule) {
			if( typeof(rule) !== 'string' ) throw new Error('invalid css rule', rule);

			var rule = normalizeValue(rule);
			
			var device;
			var prefix = this.prefix;
			if( ~rule.indexOf(':input-placeholder') || ~rule.indexOf(':placeholder')) {
				rule = rule.split('::input-placeholder').join(':placeholder');
				rule = rule.split(':input-placeholder').join(':placeholder');
				rule = rule.split('::placeholder').join(':placeholder');
				rule = rule.split(':placeholder').join('::placeholder');

				device = [];

				if( prefix === '-ms-' ) {
					device = rule.split('::placeholder').join(':' + prefix + 'input-placeholder');
				} else if( prefix === '-webkit-' ) {
					device = rule.split('::placeholder').join('::' + prefix + 'input-placeholder');
				} else if( prefix === '-moz-' ) {
					device.push(rule.split('::placeholder').join(':' + prefix + 'placeholder'));
					device.push(rule.split('::placeholder').join('::' + prefix + 'placeholder'));
				} else {
					device = rule.split('::placeholder').join('::' + prefix + 'placeholder');
				}
			}

			if( ~rule.indexOf('@keyframes') ) device = rule.split('@keyframes').join('@' + prefix + 'keyframes');
			
			device = device || rule;

			return {
				original: rule,
				device: device
			};
		},
		key: function(key) {
			if( typeof(key) !== 'string' ) throw new Error('invalid css key', key);

			key = normalizeKey(key);

			var deviceKey = key;
			if(~PREFIX_KEYS.indexOf(key)) {
				deviceKey = this.prefix + key;
			}
			
			return {
				original: key,
				device: deviceKey,
				merged: (key === deviceKey) ? key : [key, deviceKey]
			};
		},
		value: function(key, value) {
			if( typeof(key) !== 'string' ) throw new Error('invalid css key', key);
			
			var key = this.key(key);

			var processValue = function(prefix, keyname, value) {
				value = normalizeValue(value);

				var pv = PREFIX_VALUES[keyname];
				var targetValue = pv ? pv[pv.indexOf(value)] : null;

				return {
					key: key,
					original: value,
					device: (( targetValue ) ? (prefix + targetValue) : value)
				};
			};
			
			var prefix = this.prefix;			
			if( typeof(value) === 'string' ) {
				var splits = value.split(',');

				var argo = [];
				var argd = [];
				for(var i=0; i < splits.length; i++) {
					var value = splits[i].trim();

					var result = processValue(prefix, key.original, value);
					argo.push(result.original);
					argd.push(result.device);
				}

				return {
					key: key,
					original: argo.join(', '),
					device: argd.join(', ')
				};
			} else if( typeof(value) === 'number' ) {
				value = ((value === 0) ? '0' : (value + (NUMBER_SUFFIXES[key.original] || '')));

				return {
					key: key,
					original: value,
					device: value
				};
			}

			return {
				key: key,
				original: value,
				device: value
			};
		}
	};

	return DefaultCSS3Validator;
})();


var CSS3Calibrator = (function() {
	"use strict"
	
	function camelcase(key) {
		var position;
		try {
			while( ~(position = key.indexOf('-')) ) {
				var head = key.substring(0, position);
				var lead = key.substring(position + 1, position + 2).toUpperCase();
				var tail = key.substring(position + 2);
				key = head + lead + tail;
			}

			key = key.substring(0,1).toLowerCase() + key.substring(1);
		} catch(e) {
			console.error('WARN:style key camelcase translation error', key, e);
		}

		return key;
	}

	function CSS3Calibrator(device) {
		this.device = device;
		var prefix = device.prefix;
		if( !prefix || typeof(prefix) !== 'string' ) prefix = '';
		this.adapter = new DefaultCSS3Validator(prefix || '');
	}

	CSS3Calibrator.prototype = {
		adapter: function(c) {
			if( !arguments.length ) return this.adapter;
			if( typeof(c) !== 'object' ) throw new Error('invalid calibrator(object)', c);
			this.adapter = c;
			return this;
		},
		camelcase: function(key) {
			if( key === 'float' ) {
				if( this.device.is('ie') ) return 'styleFloat';
				else if( this.device.is('gecko') ) return 'cssFloat';
			}

			return camelcase(key);
		},
		value: function(key, value) {
			if( typeof(key) !== 'string' ) throw new Error('invalid key(string)', key);

			if( Array.isArray(value) ) {
				var o = {original:{},device:{},merged:{}};

				for(var i=0; i < value.length; i++) {
					var result = this.adapter.value(key, value[i]);

					var k = result.key;

					if( !o.original[k.original] ) o.original[k.original] = [];
					if( !o.device[k.device] ) o.device[k.device] = [];

					o.original[k.original].push(result.original);
					o.device[k.device].push(result.device);

					if( key.original === key.device ) {
						if( !o.merged[k.original] ) o.merged[k.original] = [];

						if( result.original === result.device ) {
							o.merged[k.original].push(result.original);
						} else {
							o.merged[k.original].push(result.original);
							o.merged[k.device].push(result.device);
						}
					} else {
						if( !o.merged[k.original] ) o.merged[k.original] = [];						
						if( !o.merged[k.device] ) o.merged[k.device] = [];

						o.merged[k.original].push(result.original);
						o.merged[k.device].push(result.device);
					}
				}

				return o;
			} else {
				var result = this.adapter.value(key, value);

				var k = result.key;
				
				var o = {original:{},device:{},merged:{}};
				o.original[k.original] = result.original;
				o.device[k.device] = result.device;
				
				if( k.original === k.device && result.original !== result.device ) {
					o.merged[k.original] = [];
					o.merged[k.original].push(result.original);
					o.merged[k.original].push(result.device);
				} else {
					o.merged[k.original] = result.original;
					o.merged[k.device] = result.device;
				}
				return o;
			}
		},
		values: function(values) {
			if( typeof(values) !== 'object' ) throw new Error('invalid values(object)');
			
			var result = {
				original: {},
				device: {},
				merged: {}
			};
			for(var key in values) {
				if( !values.hasOwnProperty(key) ) continue;
								
				var calibrated = this.value(key, values[key]);
				key = this.key(key);

				result.original[key.original] = calibrated.original[key.original];
				result.device[key.device] = calibrated.device[key.device];

				if( !Array.isArray(key.merged) ) key.merged = [key.merged];

				for(var i=0; i < key.merged.length;i++) {
					result.merged[key.merged[i]] = calibrated.merged[key.merged[i]];
				}
			}
			return result;
		},
		key: function(key) {
			if( typeof(key) !== 'string' ) throw new Error('invalid key(string)', key);
			return this.adapter.key(key);
		},
		rule: function(rule) {
			if( typeof(rule) !== 'string' ) throw new Error('invalid rule(string)', rule);

			if( ~rule.indexOf(',') ) rule = rule.split(',');
			
			if( Array.isArray(rule) ) {
				var result = {
					original: [],
					device: [],
					merged: []
				};

				for(var i=0; i < rule.length;i++) {
					var calibrated = this.adapter.rule(rule[i].trim());

					result.original.push(calibrated.original);
					result.device.push(calibrated.device);

					if( calibrated.original === calibrated.device ) {
						result.merged.push(calibrated.original);
					} else {
						result.merged.push(calibrated.original);

						if( Array.isArray(calibrated.device) ) result.merged = result.merged.concat(calibrated.device);
						else result.merged.push(calibrated.device);
					}
				}

				result.original = result.original.join(', ');
				result.device = result.device.join(', ');
				result.merged = result.merged.join(', ');

				return result;
			} else {
				var result = {};

				var calibrated = this.adapter.rule(rule);
				result.original = calibrated.original;
				result.device = calibrated.device;
				if( calibrated.original !== calibrated.device ) {
					result.merged = [calibrated.original];	
					
					if( Array.isArray(calibrated.device) ) result.merged = result.merged.concat(calibrated.device);
					else result.merged.push(calibrated.device);	
				} else {
					result.merged = result.original;
				}

				if(Array.isArray(result.original)) result.original = result.original.join(', ');
				if(Array.isArray(result.device)) result.device = result.device.join(', ');
				if(Array.isArray(result.merged)) result.merged = result.merged.join(', ');

				return result;
			}
		},
		proofread: function(rule, values) {
			var rules = this.rule(rule);
			values = this.values(values);

			var result = {
				original: {},
				device: {},
				merged: {}
			};

			var args = rules.original;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.original[rule] = values.original;
			}

			args = rules.device;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.device[rule] = values.device;
			}

			args = rules.merged;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length;i++) {
				var rule = args[i];
				result.merged[rule] = values.merged;
			}
			
			return result;
		}
	};

	return CSS3Calibrator;
})();

/*

var c = new CSS3Calibrator('-webkit-');

if( false ) {
	console.log('display', JSON.stringify(c.key('display'), null, '\t'), '\n\n\n');
	console.log('box-flex', JSON.stringify(c.key('box-flex'), null, '\t'), '\n\n\n');
	console.log('-webkit-box-flex', JSON.stringify(c.key('-webkit-box-flex'), null, '\t'), '\n\n\n');
	console.log('-ms-box-flex', JSON.stringify(c.key('-ms-box-flex'), null, '\t'), '\n\n\n');
	console.log('-o-box-flex', JSON.stringify(c.key('-o-box-flex'), null, '\t'), '\n\n\n');
	console.log('-moz-box-flex', JSON.stringify(c.key('-moz-box-flex'), null, '\t'), '\n\n\n');
}

if( false ) {
	console.log('transition(width, transform, height)', JSON.stringify(c.value('transition', 'width, transform, height'), null, '\t'), '\n\n\n');
	console.log('transition(transform)', JSON.stringify(c.value('transition', 'transform'), null, '\t'), '\n\n\n');
	console.log('display(box)', JSON.stringify(c.value('display', 'box'), null, '\t'), '\n\n\n');
	console.log('display(block)', JSON.stringify(c.value('display', 'block'), null, '\t'), '\n\n\n');
	console.log('display(flex)', JSON.stringify(c.value('display', 'flex'), null, '\t'), '\n\n\n');
	console.log('box-flex', JSON.stringify(c.value('box-flex', 1), null, '\t'), '\n\n\n');
	console.log('height', JSON.stringify(c.value('height', 100), null, '\t'), '\n\n\n');
	
	console.log('display([box, flex])', JSON.stringify(c.value('display', ['box', 'flex']), null, '\t'), '\n\n\n');
	console.log('box-flex([1,2])', JSON.stringify(c.value('box-flex', [1, 2]), null, '\t'), '\n\n\n');
}

if( false ) {
	var o = {
		'display': 'box',
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'-moz-transition': 'background-color, color',
		'font-weight': 'bold'
	};

	console.log('values', JSON.stringify(c.values(o), null, '\t'), '\n\n\n');
}

if( false ) {
	console.log('.cmp, #cmp', JSON.stringify(c.rule('.cmp, #cmp'), null, '\t'), '\n\n\n');
	console.log('.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b', JSON.stringify(c.rule('.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b'), null, '\t'), '\n\n\n');
	console.log('@keyframes', JSON.stringify(c.rule('@keyframes'), null, '\t'), '\n\n\n');
	console.log('@-webkit-keyframes', JSON.stringify(c.rule('@-webkit-keyframes'), null, '\t'), '\n\n\n');
	console.log('.cmp:input-placeholder', JSON.stringify(c.rule('.cmp:input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp::input-placeholder', JSON.stringify(c.rule('.cmp::input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp::-webkit-input-placeholder', JSON.stringify(c.rule('.cmp::-webkit-input-placeholder'), null, '\t'), '\n\n\n');
	console.log('.cmp:-ms-input-placeholder', JSON.stringify(c.rule('.cmp:-ms-input-placeholder'), null, '\t'), '\n\n\n');
}

if( true ) {
	console.log('.field_text::input-placeholder ', JSON.stringify(c.rule('.field_text::input-placeholder '), null, '\t'), '\n\n\n');
}

if( false ) {
	var rule = '.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp .b';
	var o = {
		'display': ['box', 'flex'],
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'font-weight': 'bold'
	};

	console.log(rule, JSON.stringify(c.proofread(rule, o), null, '\t'), '\n\n\n');
}

if( false ) {
	var rule = '.cmp';
	var o = {
		'display': ['box', 'flex'],
		'box-flex': 1,
		'box-align': 'start',
		'margin': 0,
		'height': 100,
		'transition': 'transform, width',
		'font-weight': 'bold'
	};

	console.log(rule, JSON.stringify(c.proofread(rule, o), null, '\t'), '\n\n\n');
}


- key(key)
	display
	{
		original: 'display',
		device: 'display',
		merged: 'display'
	}

	box-flex
	{
		original: 'box-flex',
		device: '-webkit-box-flex',
		merged: ['box-flex', '-webkit-box-flex']
	}

	-webkit-box-flex
	{
		original: 'box-flex',
		device: '-webkit-box-flex',
		merged: ['box-flex', '-webkit-box-flex']
	}

- value(key, value)
	display, box
	{
		original: {
			'display': 'box'
		},
		device: {
			'display': '-webkit-box'
		},
		merged: {
			'display': ['box', '-webkit-box']
		}
	}

	box-flex, 1
	{
		original: {
			'box-flex': '1'
		},
		device: {
			'-webkit-box-flex': '1'
		},
		merged: {
			'box-flex': '1',
			'-webkit-box-flex': '1'
		}
	}

- rule(rule)
	.cmp
	{
		original: '.cmp',
		device: '.cmp',
		merged: '.cmp'
	}

	.cmp:input-placeholder
	{
		original: '.cmp:input-placeholder',
		device: '.cmp::-webkit-input-placeholder',
		merged: ['.cmp:input-placeholder', '.cmp::-webkit-input-placeholder']
	}

	.cmp, .cmp:input-placeholder, #cmp, .cmp > .a, .cmp
	{
		original: ['.cmp', '.cmp:input-placeholder, #cmp', '.cmp > .a', '.cmp'],
		device: ['.cmp', '.cmp:input-placeholder, #cmp', '.cmp > .a', '.cmp'],
		merged: ['.cmp', '.cmp:input-placeholder', '.cmp::-webkit-input-placeholder', '#cmp', '.cmp > .a']
	}

- proofread(rule, o)
	".view > .a, .view > .b::input-placeholder", {
		'display': 'box',
		'box-flex': 1
	}

	{
		original: {
			'.view > .a': {
				'display': 'box',
				'box-flex': 1
			},
			'.view > .b::input-placeholder': {
				'display': 'box',
				'box-flex': 1
			}
		},
		device: {
			'.view > .a': {
				'display': '-webkit-box',
				'-webkit-box-flex': 1
			},
			'.view > .b::-webkit-input-placeholder': {
				'display': '-webkit-box',
				'-webkit-box-flex': 1
			}
		},
		merged: {
			'.view > .a': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			},
			'.view > .b::input-placeholder': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			},
			'.view > .b::-webkit-input-placeholder': {
				'display': ['box', '-webkit-box'],
				'-webkit-box-flex': 1,
				'box-flex': 1
			}
		}
	}
*/
// EOF of CSS3Calibrator.js [attrs.ui-0.6.0]

// Device.js [attrs.ui-0.6.0]
/*
 * Device : Evalutate platform informations & stylesheet validation
 *
 * <pre>
 *	- Chrome
 *	Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36 
 *
 *	- iPhone user agent
 *	Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543a Safari/419.3
 *
 *	- iPod Touch user agent
 *	Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3
 *
 *	- iPad user agent
 *	Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10
 *
 *	- Android user agent
 *	Mozilla/5.0 (Linux; U; Android 1.1; en-gb; dream) AppleWebKit/525.10+ (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2
 *	Mozilla/5.0 (Linux; U; Android 2.1; en-us; Nexus One Build/ERD62) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17
 *	
 *	- NetFront
 *	SAMSUNG-C5212/C5212XDIK1 NetFront/3.4 Profile/MIDP-2.0 Configuration/CLDC-1.1
 *	MozillaMozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.5 (screen 824x1200;rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.5 (screen 824x1200;rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.5 (screen 824x1200; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.5 (screen 600x800; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.5 (screen 1200x824; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.3 (screen 600x800; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.3 (screen 1200x824; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.1 (screen 824x1200; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.0 (screen 824x1200; rotate)
 *	Mozilla/4.0 (compatible; Linux 2.6.22) NetFront/3.4 Kindle/2.0 (screen 600x800)
 *	Mozilla/4.0 (compatible; Linux 2.6.10) NetFront/3.4 Kindle/1.0 (screen 600x800)
 *	NetFront 3.3
 *	SonyEricssonK800c/R8BF Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1
 *	SonyEricssonK530i/R6BA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1
 *	SonyEricssonK530c/R8BA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1
 *	SonyEricssonK510c/R4EA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1
 *	Mozilla/4.0 (compatible; Linux 2.6.10) NetFront/3.3 Kindle/1.0 (screen 600x800)
 *	
 *	- BlackBerry user agent
 *	BlackBerry9000/4.6.0.266 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/120
 * </pre>
 *
 * @author: joje(joje.attrs@gmail.com)
*/

var Device = (function() {
	"use strict"

	// class device
	function Device() {
		var nav = window.navigator;
		var _platform = nav.platform;
		var agent = nav.userAgent;
		
		var platform = {
			name: '',
			version: '',
			codename: '',
			type: ''
		};
		var device = 'desktop';
		var engine = '';
		var browser = '';
		var version = '';
		var retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1);
		var touchable = 'ontouchstart' in window;
		var prefix = '';
		var hasTransform = false;
		var has3d = false;
		var resolution = {
			width: screen.width,
			height: screen.height 
		};
		
		if( ~agent.indexOf('Seamonkey/') ) engine = 'gecko', browser = 'seamonkey', prefix = '-moz-';
		else if( ~agent.indexOf('Firefox/') ) engine = 'gecko', browser = 'firefox', prefix = '-moz-';
		else if( ~agent.indexOf('Opera/') ) engine = 'presto', browser = 'opera', prefix = '-o-';
		else if( ~agent.indexOf('MSIE ') ) engine = 'trident', browser = 'msie', prefix = '-ms-';
		else if( ~agent.indexOf('webOS/') ) engine = 'webkit', browser = 'webos', prefix = '-webkit-';
		else if( ~agent.indexOf('Chromium/') ) engine = 'webkit', browser = 'chromium', prefix = '-webkit-';
		else if( ~agent.indexOf('Chrome/') ) engine = 'webkit', browser = 'chrome', prefix = '-webkit-';
		else if( ~agent.indexOf('Android') ) engine = 'webkit', browser = 'android', prefix = '-webkit-';
		else if( ~agent.indexOf('Safari/') ) engine = 'webkit', browser = 'safari', prefix = '-webkit-';
		else if( ~agent.indexOf('Kindle/')) engine = 'netfront', browser = 'kindle', prefix = '', platform = {name: 'kindle', type: 'tablet'};
		else if( ~agent.indexOf('NetFront/')) engine = 'netfront', browser = 'netfront', prefix = '';
		else if( ~agent.indexOf('BlackBerry')) engine = 'webkit', browser = 'blackberry', prefix = '', platform = {name: 'kindle', type: 'tablet'};
		else if( ~agent.indexOf('AppleWebKit/') ) engine = 'webkit', browser = 'webkit', prefix = '-webkit-';
		else if( ~agent.indexOf('Gecko/') ) engine = 'gecko', browser = 'gecko', prefix = '-moz-';
				
		if( !platform.name ) {
			if( ~agent.indexOf('(iPhone;') ) device = 'iphone', platform = {name: 'ios', type: 'mobile'};
			else if( ~agent.indexOf('(iPad;') ) device = 'ipad', platform = {name: 'ios', type: 'tablet'};
			else if( ~agent.indexOf('(iPod;') ) device = 'ipod', platform = {name: 'ios', type: 'mobile'};
			else if( ~agent.indexOf('Android') && ~agent.indexOf('Mobile') ) device = 'android', platform = {name: 'android', type: 'mobile'};
			else if( ~agent.indexOf('Android') ) device = 'android', platform = {name: 'android', type: 'tablet'};
		}

		if( !platform.type ) {
			if( (/ipad|android 3|xoom|sch-i800|playbook|tablet|kindle/i.test(agent.toLowerCase())) ) platform.type = 'tablet';
			else if( (/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(agent.toLowerCase())) ) platform.type = 'mobile';
		}
		
		if( !platform.name ) {			
			if( ~agent.indexOf('Mac OS X;') ) platform = {name: 'osx', type: 'desktop'};
			else if( ~agent.indexOf('Mac OS') ) platform = {name: 'mac', type: 'desktop'};
			else if( ~agent.indexOf('Windows;') || _platform === 'Win32' ) platform = {name: 'windows', type: 'desktop'};
			else if( ~agent.indexOf('Linux;') ) platform = {name: 'linux', type: 'desktop'};
			else platform.name = _platform;
		}
		
		var style = document.documentElement.style;
		if( engine == 'webkit' ) hasTransform = ('webkitTransform' in style), has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
		else if( engine == 'gecko' ) hasTransform = ('MozTransform' in style);
		else if( engine == 'presto' ) hasTransform = ('OTransform' in style);
		else if( engine == 'trident' ) hasTransform = ('MSTransform' in style);
		if( !hasTransform ) hasTransform = ('Transform' in style);
		
		var index;
		if( browser === 'android' && ~(index = agent.indexOf('Android')) ) version = platform.version = agent.substring(index + 7, agent.indexOf(' ', index + 1));
		else if( browser === 'msie' && ~(index = agent.indexOf('MSIE ')) ) version = agent.substring(index + 5, agent.indexOf(';', index + 1));
		else if( browser === 'chrome' && ~(index = agent.indexOf('Chrome/')) ) version = agent.substring(index + 7, agent.indexOf(' ', index + 1));
		else if( browser === 'safari' && ~(index = agent.indexOf('Version/')) ) version = agent.substring(index + 8, agent.indexOf(' ', index + 1));
		
		this.agent = agent;
		this.platform = platform;
		this.device = device;
		this.engine = engine;
		this.browser = browser;
		this.version = version;
		this.retina = retina;
		this.touchable = touchable;
		this.prefix = prefix;
		this.hasTransform = hasTransform;
		this.has3d = has3d;
		this.resolution = resolution;

		this.calibrator = new CSS3Calibrator(this);

		// gecko 의 경우 innerText 바인딩
		if( engine === 'gecko' && window.HTMLElement && window.HTMLElement.prototype.__defineGetter__ ) {
			HTMLElement.prototype.__defineGetter__("innerText",function() {
				if(this.textContent) {
					return(this.textContent)
				} 
				else {
					var r = this.ownerDocument.createRange();
					r.selectNodeContents(this);
					return r.toString();
				}
			});
			
			HTMLElement.prototype.__defineSetter__("innerText",function(sText) {
				this.innerHTML = sText
			});
		}

		//console.log('device', JSON.stringify(this, null, '\t'));
	}

	Device.prototype = {
		is: function(query) {
			// engine
			if( query === 'webkit' ) return (this.engine === 'webkit');
			if( query === 'gecko' ) return (this.engine === 'gecko');
			if( query === 'netfront' ) return (this.engine === 'netfront');
			if( query === 'presto' ) return (this.engine === 'presto');
			if( query === 'trident' ) return (this.engine === 'trident');

			// platform type
			if( query === 'phone' ) return (this.platform.type === 'phone');
			if( query === 'tablet' ) return (this.platform.type === 'tablet');
			if( query === 'dsektop' ) return (this.platform.type === 'dsektop');

			// platform name
			if( query === 'ios' ) return (this.platform.name === 'ios');
			if( query === 'iphone' ) return (this.device === 'iphone');
			if( query === 'ipad' ) return (this.device === 'ipad');
			if( query === 'ipod' ) return (this.device === 'ipod');			
			if( query === 'android' ) return (this.platform.name === 'android');
			if( query === 'mac' ) return (this.platform.type === 'osx' || this.platform.type === 'mac');
			if( query === 'osx' ) return (this.platform.name === 'osx');
			if( query === 'windows' ) return (this.platform.name === 'windows');
			if( query === 'linux' ) return (this.platform.name === 'linux');
			
			// features
			if( query === 'retina' ) return this.retina;
			if( query === 'touchable' ) return this.touchable;
			if( query === '3d' ) return this.has3d;
			if( query === 'transform' ) return this.hasTransform;
			
			// browser
			if( query === 'ie' || query === 'ms' || query === 'msie' ) return (this.browser === 'msie');
			if( query === 'firefox' ) return (this.browser === 'firefox');
			if( query === 'kindle' ) return (this.browser === 'kindle');
			if( query === 'opera' ) return (this.browser === 'opera');
			if( query === 'chrome' ) return (this.browser === 'chrome');
			if( query === 'chromium' ) return (this.browser === 'chromium');
			if( query === 'safari' ) return (this.browser === 'safari');
			if( query === 'blackberry' ) return (this.browser === 'blackberry');
			if( query === 'webkit browser' ) return (this.browser === 'webkit');
			if( query === 'android browser' ) return (this.browser === 'android');			

			return false;
		}
	};

	return new Device();
})();

// EOF of Device.js [attrs.ui-0.6.0]

// DOM.js [attrs.ui-0.6.0]
var EL = (function() {
	"use strict"
	
	
	function EL(el) {
		if( el.__handler__ ) return el.__handler__;
		else if( el instanceof EL ) return el;
		
		if( el.nodeName == '#text' || el.nodeName == '#cdata-section' || el.nodeName == '#comment' ) {			
			return new TextNode(el);
		}

		if( !EL.isElement(el) ) {
			console.error('invalid element', el);
			throw new Error('invalid element');
		}

		el.__handler__ = this;
		this.length = 1;
		this[0] = el;
	};

	EL.prototype = {
		id: function(id) {
			if( !arguments.length ) return this[0].id;
			return this.attr('id', ((id) ? id : false));
		},
		name: function(name) {
			if( !arguments.length ) return this.attr('name');
			return this.attr('name', ((name) ? name : false));
		},

		// attach & detach
		create: function(tag, attrs) {
			var el = EL.create(tag, attrs);
			this.attach(el);
			return el;
		},
		attachBefore: function(el, reference) {
			return this.attach(el, reference, -1);
		},
		attachAfter: function(el, reference) {
			return this.attach(el, reference);
		},
		attach: function(els, reference, adjust) {
			if( !els ) throw new Error('el was null');
			
			var el = this[0];
			if( typeof(els.length) !== 'number' ) els = [els];
			for(var i=0; i < els.length; i++) {
				var children = $(els[i]);
				if( !children ) continue;
				for(var j=0; j < children.length; j++) {
					var child = children[j].__handler__ || new EL(children[j]);
					
					var e = child.fire('attach', {
						cancelable: true,
						to: el,
						el: child
					});

					if( e && (e.defaultPrevented === true || e.returnValue === false) ) {
						console.warn('EL attach canceled by event handler', this);
						return this;
					}
					
					e = this.fire('add', {
						cancelable: true,
						el: child
					});

					if( e && (e.defaultPrevented === true || e.returnValue === false) ) {
						console.warn('EL add canceled by event handler', this);
						return this;
					}
	
					child.detach();
	
					var ref = null;
					if( reference || reference === 0 ) {
						if( typeof(refrence) === 'number' ) ref = el.children[refrence];
						else if( EL.isElement(refrence) ) ref = refrence;
						else if( EL.isElement(refrence[0]) ) ref = refrence[0];
			
						if( adjust && ref ) {
							var index = el.children.indexOf(ref) + adjust;
							if( index > el.children.length - 1 ) index = el.children.length - 1;
							else if( index < 0) index = 0;
							ref = el.children[index];
						}
					}
		
					if( ref ) el.insertAfter(child[0], ref); 
					else el.appendChild(child[0]);
	
					child.fire('attached');
					this.fire('added', {el: child});

					if( this.isStaged() ) {
						child.visit(function(el) {
							$(el).fire('staged');
						}, 'down', true);
					}
				}
			}
			return this;
		},
		attachTo: function(el, reference) {
			if( !el ) throw new Error('missing el:' + el);
			$(el).attach(this, reference);
			return this;
		},
		isStaged: function() {
			var el = this[0];
			var el = {
				parentNode: el
			};

			for(;el = el.parentNode;) {
				if( el.nodeType === 11 ) return false;
				if( el.style.display === 'none' ) return false;
				if( el === document.body ) {
					return true;
				}
			}

			return false;
		},
		showing: function() {
			var el = this[0];
			if( this.computed('visibillity') === 'hidden' ) return false;
			if( (el.scrollWidth || el.scrollHeight || el.offsetWidth || el.offsetHeight || el.clientWidth || el.clientHeight) ) return true;
			return false;
		},
		detach: function() {
			var parent = this[0].parentNode;
			if( !EL.isElement(parent) ) return;

			var el = this[0];
			var e = this.fire('detach', {
				cancelable: true,
				from: parent,
				el: el
			});
			
			if( e.defaultPrevented === true || e.returnValue === false ) {
				console.warn('EL detach canceled by event handler', this);
				return this;
			}
			
			var p = new EL(parent);
			e = p.fire('remove', {
				cancelable: true,
				el: el
			});
			
			if( e.defaultPrevented === true || e.returnValue === false ) {
				console.warn('EL remove canceled by event handler', this);
				return this;
			}
			
			parent.removeChild(el);
			
			var self = this;
			self.fire('detached', {
				from: parent
			});

			p.fire('removed', {
				from: parent
			});
			
			self.visit(function(el) {
				$(el).fire('unstaged', {
					from: parent
				});
			}, 'down', true);

			return this;
		},
		clear: function() {
			this.fire('clear');
			this.style(false);
			this.attr(false);
			this.classes(false);
			this.html(false);
			this.un();
			this.fire('cleared');
			return this;
		},
		css: function(key, value) {
			return this.style(key, value);
		},
		style: function(key, value) {
			if( !arguments.length ) return new StyleSession(this[0]);
						
			var session = new StyleSession(this[0]);
			if( arguments.length === 1 && typeof(key) !== 'object' ) {
				if( key === false ) {
					session.clear();
				} else if( typeof(key) === 'string' && ~key.indexOf(':') ) {
					session.text(key);
					session.commit();
				} else if( typeof(key) === 'string' ) {
					return session.get(key);
				}

				return this;
			}
			
			if( typeof(key) === 'object' ) session.set(key);
			else session.set(key, value);
			
			session.commit();

			return this;
		},
		computed: function(k) {
			var cs;
			var el = this[0];
			if ( el.currentStyle ) {
				cs = el.currentStyle;
			} else if( document.defaultView && document.defaultView.getComputedStyle ) {
				cs = document.defaultView.getComputedStyle(el);
			} else {
				throw new Error('browser does not support computed style');
			}

			return (typeof(k) === 'string') ? cs[k] : cs;
		},
		
		// class
		classes: function(classes, flag) {
			var el = this[0];
			var o = (el.className || '').trim();

			if( !arguments.length ) return o;			

			if( typeof(flag) === 'boolean' ) {
				if( !classes ) return this;
				if( Array.isArray(classes) ) classes = classes.join(' ');
				classes = classes.split(' ');
				
				var args = o ? o.split(' ') : [];
				for(var i=0; i < classes.length; i++) {
					var cls = classes[i];
					if( cls ) {
						if( !flag && ~args.indexOf(cls) ) args = Util.array.removeByItem(args, cls);
						else if( flag && !~args.indexOf(cls) ) args.push(cls);
					}
				}

				el.className = args.join(' ');
			} else {
				el.className = '';
				el.removeAttribute('class');
				if( Array.isArray(classes) ) classes = classes.join(' ').trim();
				if( classes ) el.className = classes;
			}

			var changed = (el.className || '').trim();
			
			if( o !== changed ) {
				this.fire('changed.class', {
					originValue: o,
					newValue: changed
				});
			}
			
			return this;
		},
		addClass: function(s) {
			return this.classes(s, true);
		},
		hasClass: function(s) {
			return (s && ~this[0].className.split(' ').indexOf(s)) ? true : false;
		},
		removeClass: function(s) {
			return this.classes(s, false);
		},
		clearClass: function() {
			var el = this[0];
			var o = el.className;
			el.className = '';
			el.removeAttribute('class');

			this.fire('changed.class', {
				originValue: o,
				newValue: '',
				cleared: true
			});

			return this;
		},
		ac: function(s) {
			return this.classes(s, true);
		},
		rc: function(s) {
			return this.classes(s, false);
		},
		hc: function(s) {
			return this.hasClass(s);
		},
		cc: function() {
			return this.clearClass();
		},
		
		// events
		on: function(type, fn, capture) {
			if( !type || !fn ) return console.error('[ERROR] illegal event type or handler', type, fn, capture);

			var dispatcher = this._dispatcher;
			if( !dispatcher ) dispatcher = this._dispatcher = new EventDispatcher(this);

			capture = (capture===true) ? true : false;

			var el = this[0];
			if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events			
				if( el.addEventListener ) {
					el.addEventListener(type, fn, capture);

					if( type.toLowerCase() == 'transitionend' && Device.is('webkit') ) {
						el.addEventListener('webkitTransitionEnd', fn, capture);
					}
				} else if( el.attachEvent ) {
					el.attachEvent('on' + type, fn);
				}
			}

			dispatcher.on(type, fn, capture);
			return this;
		},
		hasOn: function(type) {
			var dispatcher = this._dispatcher;
			return (dispatcher) ? dispatcher.has(type) : false;
		},
		un: function(type, fn, capture) {
			if( !type || !fn ) return console.error('[ERROR] illegal event type or handler', type, fn, capture);

			var dispatcher = this._dispatcher;
			if( !dispatcher ) return this;

			capture = (capture===true) ? true : false;

			var el = this[0];
			if(('on' + type) in el || type.toLowerCase() == 'transitionend') {	// if dom events
				if( el.removeEventListener ) {
					el.removeEventListener(type, fn, capture);

					if( type.toLowerCase() == 'transitionend' && Device.is('webkit') )
						el.removeEventListener('webkitTransitionEnd', fn, capture);
				} else if( el.attachEvent ) {
					el.detachEvent('on' + type, fn);
				}
			}

			dispatcher.un(type, fn, capture);
			return this;
		},
		unAll: function() {
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return this;

			var listeners = dispatcher.listeners();
			for(var type in listeners) {
				var fns = listeners[type];

				if( fns ) {
					for(var i=fns.length - 1;i >= 0;i--) {
						var o = fns[i];
						this.un(o.type, o.fn, o.capture);
					}
				}
			}

			this.fire('event.cleared');

			return this;
		},
		fire: function(type, values) {
			if( !type ) return console.error('[ERROR] cannot fire event type:', type);
			if( !values ) values = {};

			var dispatcher = this._dispatcher;
			if( !dispatcher ) dispatcher = this._dispatcher = new EventDispatcher(this);

			var e, el = this[0];
			if(('on' + type) in el) {	// if dom events
				// eventName, bubbles, cancelable
				if( document.createEvent ) {
					e = document.createEvent('Event');
					e.initEvent(type, ((values.bubbles===true) ? true : false), ((values.cancelable===true) ? true : false));
				} else if( document.createEventObject ) {
					e = document.createEventObject();
				} else {
					return console.error('this browser does not supports manual dom event fires');
				}
				
				for(var k in values) {
					if( !values.hasOwnProperty(k) ) continue;
					var v = values[k];
					try {
						e[k] = v;
					} catch(err) {
						console.error('[WARN] illegal event value', e, k);
					}
				}
				e.values = values;
				e.src = this;

				if( this[0].dispatchEvent ) {
					this[0].dispatchEvent(e);
				} else {
					e.cancelBubble = ((values.bubbles===true) ? true : false);
					this[0].fireEvent('ontest', e );
				}
			} else if( dispatcher ) {
				e = dispatcher.fireSync(type, values);
			}

			return e;
		},
		attr: function(k,v) {
			var el = this[0];

			if( !arguments.length ) {
				var arga = el.attributes;
				var o = {};
				for(var i=0; i < arga.length; i++) {
					o[arga[i].name] = arga[i].nodeValue;
				}

				return o;
			} else if( k === false ) {
				var arga = el.attributes;
				for(var i=(arga.length - 1); i >= 0; i--) {
					el.removeAttribute(arga[i].name);
				}
				return this;
			} else if( arguments.length === 1 && typeof(k) === 'string' ) {
				return el.getAttribute(k);
			}
			
			var self = this;
			var fn = function(k,v) {
				var o = el.getAttribute(k);
				if( !v && v !== 0 ) el.removeAttribute(k);
				else el.setAttribute(k,v);			
				self.fire('changed.attr', {
					attributeKey: k,
					originValue: o,
					newValue: el.getAttribute(k)
				});
			};
			
			if( typeof(k) === 'object' ) {
				for(var key in k) 
					if( k.hasOwnProperty(key) && typeof(key) === 'string' ) fn(key, k[key]);
			} else {
				fn(k, v);
			}

			return this;
		},
		value: function(v) {
			if( !arguments.length ) return this[0].value;

			var o = this[0].value;
			this[0].value = v;

			this.fire('changed.value', {
				originValue: o,
				newValue: this[0].value
			});

			return this;
		},
		html: function(s, append) {
			if( !arguments.length ) return this[0].innerHTML;
			if( !s ) s = '';
			
			var o = this[0].innerHTML;
			try {
				this[0].innerHTML = (append === true) ? o + s : s;
			} catch(e) {
				this[0].innerText = (append === true) ? o + s : s;
			}

			this.fire('changed.html', {
				originValue: o,
				newValue: this[0].innerHTML
			});

			return this;
		},
		text: function(s, append) {
			if( !arguments.length ) return this[0].innerText;
			if( !s ) s = '';
			
			var o = this[0].innerText;
			this[0].innerText = (append === true) ? o + s : s;

			this.fire('changed.html', {
				originValue: o,
				newValue: this[0].innerHTML
			});

			return this;
		},
		tpl: function(o, fns, reset) {
			if( !this._tpl ) this._tpl = new Template(this[0]);
			return this._tpl.bind(o, fns, reset);
		},
		empty: function() {
			this[0].innerHTML = '';

			return this;
		},
		wrap: function(tag) {
		},		
		unwrap: function() {
			var el = this[0];
			var p = el.parentNode;
			if( !p ) throw new Error('cannot unwrap because has no parent');
			var nodes = p.childNodes;
			var _argc = [];
			if( nodes ) for(var a=0; a < nodes.length;a++) _argc.push(nodes[a]);

			if( _argc ) {
				if( p.parentNode ) {
					for(var a=0; a < _argc.length;a++) {
						p.parentNode.insertBefore(_argc[a], p);
					}
					p.parentNode.removeChild(p);
				} else {
					return new ELs(_argc);
				}
			}
			
			return this;
		},
		offsetWidth: function() {
			return this[0].offsetWidth;
		},
		offsetHeight: function() {
			return this[0].offsetHeight;
		},
		clientWidth: function() {
			return this[0].clientWidth;
		},
		clientHeight: function() {
			return this[0].clientHeight;
		},
		scrollWidth: function() {
			return this[0].scrollWidth;
		},
		scrollHeight: function() {
			return this[0].scrollHeight;
		},
		innerWidth: function() {
			var w = 0;
			var c = this[0].children;
			if(c) {
				for(var i=0; i < c.length; i++) {
					w += c[i].offsetWidth;
				}
			}

			return w;
		},
		innerHeight: function() {
			var h = 0;
			var c = this[0].children;
			if(c) {
				for(var i=0; i < c.length; i++) {
					h += c[i].offsetHeight;
				}
			}

			return h;
		},
		boundary: function() {
			var el = this[0];

			var abs = function(el) {
				if( !el ) el = this[0];
				var r = { x: el.offsetLeft, y: el.offsetTop };
				if (el.offsetParent) {
					var tmp = abs(el.offsetParent);
					r.x += tmp.x;
					r.y += tmp.y;
				}
				return r;
			};

			if( !el ) return null;
			var boundary = function() {};
			boundary = new boundary();		
			boundary.x = boundary.y = 0;
			boundary.width = el.offsetWidth;
			boundary.height = el.offsetHeight;
			boundary.scrollWidth = el.scrollWidth;
			boundary.scrollHeight = el.scrollHeight;
			boundary.clientWidth = el.clientWidth;
			boundary.clientHeight = el.clientHeight;


			var pos = boundary;

			if( el.parentNode ) {
				pos.x = el.offsetLeft + el.clientLeft;
				pos.y = el.offsetTop + el.clientTop;
				if( el.offsetParent ) {
					var parentpos = abs(el.offsetParent);
					pos.x += parentpos.x;
					pos.y += parentpos.y;
				}
			}
			return pos;
		},
		data: function(k, v) {
			var el = this[0];
			if( !arguments.length ) return el.__data__;
			else if( arguments.length == 1 ) return el.__data__ && el.__data__[k];

			if( !el.__data__ ) el.__data__ = {};
			el.__data__[k] = v;
			return this;
		},
		find: function(qry) {
			var el = this[0].querySelector(qry);
			if( el ) return new EL(el);
			else return new ELs();
		},
		finds: function(qry) {
			return new ELs(this[0].querySelectorAll(qry));
		},
		parent: function() {
			var pel = this[0].parentNode;
			if( pel && pel.nodeType != 11 ) return new EL(pel);
		},
		children: function(all) {
			var c = (all === true) ? this[0].childNodes : this[0].children;
			return new ELs(c);
		},
		count: function(all) {
			if( all ) return (this[0].childNodes && this[0].childNodes.length) || 0;
			return (this[0].children && this[0].children.length) || 0;
		},
		nodes: function() {
			return new ELs(this[0].childNodes);
		},
		clone: function(deep) {
			return new EL(this[0].cloneNode((deep === false ? false : true)));
		},
		visit: function(fn, direction, containSelf, scope) {
			if( typeof(fn) !== 'function' ) throw new Error('invalid arguments. fn must be a function');
			scope = scope || this;
			if( containSelf && fn.call(scope, this[0]) === false ) return;
			
			var propagation;
			if( direction === 'up' ) {
				propagation = function(el) {
					var p = el.parentNode;
					if( p ) {
						if( !EL.isElement(p) ) return;
						if( fn.call(scope, p) !== false ) {
							propagation(p);
						}
					}
				};
			} else if( !direction || direction === 'down' ) {
				propagation = function(el) {
					var argc = el.children;
					if( argc ) {
						for(var i=0; i < argc.length;i++) {
							var cel = argc[i];
							if( fn.call(scope, cel) !== false ) {
								propagation(cel);
							}
						}
					}
				};
			} else {
				console.error('unknown direction', direction);
				return this;
			}

			propagation(this[0]);
		},
		outer: function() {
			return this.stringify();
		},
		stringify: function() {
			if( this[0].outerHTML ) {
				return this[0].outerHTML;
			} else {
				var p = this.parent();
				var el = this[0];
				if( p ) {
					return p.html();
				} else {
					var html = '<' + el.tagName;
					
					if( el.style ) html += ' style="' + el.style + '"';
					if( el.className ) html += ' class="' + el.className + '"';
					
					var attrs = el.attributes;
					for(var k in attrs) {
						if( !attrs.hasOwnProperty(k) ) continue;
						if( k && attrs[k] ) {
							html += ' ' + k + '="' + attrs[k] + '"';
						}
					}

					html += '>';
					html += el.innerHTML;
					html += '</' + el.tagName + '>';

					return html;
				}
			}
		},
		invisible: function() {
			this[0].style.visibility = 'hidden';
			return this;
		},		
		checked: function(b) {
			if( !arguments.length ) return this[0].checked;

			this[0].checked = b;
			return this;
		},
		selected: function(b) {
			if( !arguments.length ) return this[0].selected;

			this[0].selected = b;
			return this;
		},

		// TODO
		movable: function(qry, options) {
			return this;
		},		
		hide: function(options, fn) {
			var internal = function(anim) {
				this[0].style.display = 'none';
				if(fn) fn.call(this, anim);
				this.fire('hide');
			};

			if( typeof(options) === 'object' ) {
				this.anim(options, scope || this).run(internal);
			} else {
				if( typeof(options) === 'function' ) fn = options;
				internal.call(this);
			}
			return this;
		},
		show: function(options, fn) {
			var internal = function(anim) {
				this[0].style.display = '';
				this[0].style.visibility = '';
				if( !this[0].style.cssText ) this.attr('style', false);

				if( this.computed('display').toLowerCase() === 'none' ) this[0].style.display = 'block';
				if( this.computed('visibility').toLowerCase() === 'hidden' ) this[0].style.display = 'visible';

				if(fn) fn.call(this, anim);
				this.fire('show');
			};

			if( typeof(options) === 'object' ) {
				this.anim(options, scope || this).run(internal);
			} else {
				if( typeof(options) === 'function' ) fn = options;
				internal.call(this);
			}
			return this;
		},
		anim: function(options, scope) {
			return new Animator(this, options, scope || this);
		},
		
		// utility styles
		margin: function(margin) {
			var el = this;
			if( !arguments.length ) return el.style('margin');
			el.style('margin', margin);
			return this;
		},
		padding: function(padding) {
			var el = this;
			if( !arguments.length ) return el.style('padding');
			el.style('padding', padding);
			return this;
		},
		width: function(width) {
			var el = this;
			if( !arguments.length ) return el.style('width');

			el.style('width', width);
			if( !el.style('min-width') ) el.style('min-width', width);
			if( !el.style('max-width') ) el.style('max-width', width);

			return this;
		},
		minWidth: function(width) {
			var el = this;
			if( !arguments.length ) return el.style('min-width');
			el.style('min-width', width);
			return this;
		},
		maxWidth: function(width) {
			var el = this;
			if( !arguments.length ) return el.style('max-width');
			el.style('max-width', width);
			return this;
		},
		height: function(height) {
			var el = this;
			if( !arguments.length ) return el.style('height');

			el.style('height', height);
			if( !el.style('min-height') ) el.style('min-height', height);
			if( !el.style('max-height') ) el.style('max-height', height);
			return this;
		},
		minHeight: function(height) {
			var el = this;
			if( !arguments.length ) return el.style('min-height');
			el.style('min-height', height);
			return this;
		},
		maxHeight: function(height) {
			var el = this;
			if( !arguments.length ) return el.style('max-height');
			el.style('max-height', height);
			return this;
		},
		flex: function(flex) {
			var el = this;
			if( !arguments.length ) return el.style('flex');
			el.style('flex', flex);
			return this;
		},
		'float': function(f) {
			var el = this;
			if( !arguments.length ) return el.style('float');
			el.style('float', f);
			return this;
		},
		bg: function(bg) {
			var el = this;

			if( !arguments.length ) {
				if( !el.style.backgroundImage && el.style.backgroundColor ) return null;

				var o = {};
				if( el.style.backgroundImage ) o['image'] = el.style.backgroundImage;
				if( el.style.backgroundColor ) o['color'] = el.style.backgroundColor;
				if( el.style.backgroundSize ) o['size'] = el.style.backgroundSize;
				if( el.style.backgroundPosition ) o['position'] = el.style.backgroundPosition;
				if( el.style.backgroundAttachment ) o['attachment'] = el.style.backgroundAttachment;
				if( el.style.backgroundRepeat ) o['repeat'] = el.style.backgroundRepeat;
				if( el.style.backgroundClip ) o['clip'] = el.style.backgroundClip;
				if( el.style.backgroundOrigin ) o['origin'] = el.style.backgroundOrigin;
				
				return o;
			}

			if( typeof(bg) === 'string' ) {
				var s = bg.trim().toLowerCase();
				if( (!~bg.indexOf('(') && !~bg.indexOf(' ')) || bg.startsWith('rgb(') || bg.startsWith('rgba(') || bg.startsWith('hsl(') || bg.startsWith('hlsa(') ) bg = {'color':bg};
				else bg = {'image':bg};
			}

			if( typeof(bg) !== 'object' ) return this;
			
			el.style('background-image', bg['image']);
			el.style('background-color', bg['color']);
			el.style('background-size', bg['size']);
			el.style('background-position', bg['position']);
			el.style('background-attachment', bg['attachment']);
			el.style('background-repeat', bg['repeat']);
			el.style('background-clip', bg['clip']);
			el.style('background-origin', bg['origin']);
			return this;
		},
		font: function(font) {
			var el = this;

			if( !arguments.length ) {
				if( !el.style.fontFamily && el.style.fontSize ) return null;

				var o = {};
				if( el.style.fontFamily ) o['family'] = el.style.fontFamily;
				if( el.style.fontSize ) o['size'] = el.style.fontSize;
				if( el.style.fontStyle ) o['style'] = el.style.fontStyle;
				if( el.style.fontVarient ) o['variant'] = el.style.fontVarient;
				if( el.style.fontWeight ) o['weight'] = el.style.fontWeight;
				if( el.style.fontSizeAdjust ) o['adjust'] = el.style.fontSizeAdjust;
				if( el.style.fontStretch ) o['stretch'] = el.style.fontStretch;
				if( el.style.letterSpacing ) o['spacing'] = el.style.letterSpacing;
				if( el.style.lineHeight ) o['height'] = el.style.lineHeight;
				
				return o;
			}

			if( typeof(font) === 'string' ) {
				var s = font.trim().toLowerCase();
				if( s.endsWith('px') || s.endsWith('pt') || s.endsWith('em') ) font = {size:font};
				else font = {family:font};
			} else if( typeof(font) === 'number' ) font = {size:font};

			if( typeof(font) !== 'object' ) return this;

			el.style('font-family', font['family']);
			el.style('font-size', font['size']);
			el.style('font-style', font['style']);
			el.style('font-variant', font['variant']);
			el.style('font-weight', font['weight']);
			el.style('font-size-adjust', font['adjust']);
			el.style('font-stretch', font['stretch']);
			el.style('letter-spacing', font['spacing']);
			el.style('line-height', font['height']);

			return this;
		},
		color: function(color) {
			var el = this;
			if( !arguments.length ) return el.style('color');
			el.style('color', color);
			return this;
		},
		border: function(border) {
			var el = this;
			if( !arguments.length ) return el.style('border');
			el.style('border', border);
			return this;
		}
	};

	// static method
	EL.isElement = function(el) {
		if( !el ) return false;

		if( !(window.attachEvent && !window.opera) ) return (el instanceof window.Element);
		else return (el.nodeType == 1 && el.tagName);
	};

	EL.eval = function(html) {
		if( typeof(html) !== 'string' ) return null;

		html = html.trim();
		
		var els = new ELs();
		var el = document.createElement('body');			
		if( html.toLowerCase().startsWith('<tr') ) el = document.createElement('tbody');
		else if( html.toLowerCase().startsWith('<tbody') ) el = document.createElement('table');
		else if( html.toLowerCase().startsWith('<td') ) el = document.createElement('tr');

		el.innerHTML = html;
		if( el.childNodes ) {
			var fordel = [];
			for(var i=0; i < el.childNodes.length; i++) {
				var child = el.childNodes[i];
				els.push(child);
				fordel.push(child);
			}

			fordel.forEach(function(item) {
				el.removeChild(item);
			});
		} else {
			console.warn('empty creation [' + html + '] attrs:[' + JSON.stringify(attrs) + ']');
		}

		if( els.length === 1 ) return new EL(els[0]);
		return els;
	};

	EL.create = function(tag, attrs) {
		if( typeof(tag) !== 'string' ) return null;

		tag = tag.trim();
		
		var el;
		if( tag.match(/^(\w+)$/ig) ) {
			el = new EL(document.createElement(tag));
		} else if( tag.startsWith('!#') ) {
			el = EL.eval(tag.substring(2));
		} else {
			el = EL.eval(tag);
		}

		if( el && el[0] ) {
			var e = el[0];
			for(var key in attrs) {
				if( !key ) continue;
				if( key.toLowerCase() == 'html' ) e.innerHTML = attrs[key] || '';
				else e.setAttribute(key, attrs[key]);
			}
		}
		return el;
	};

	EL.finds = function(qry) {
		if( !qry || typeof(qry) !== 'string' ) return null;

		var els = new ELs();
		if( qry === 'body' ) els.push(document.body);
		else if( qry === 'head' ) els.push(document.head);
		else if( document.querySelectorAll ) els.merge(document.querySelectorAll(qry));
		return els;
	};

	EL.find = function(qry) {
		if( !qry || typeof(qry) !== 'string' ) return null;

		var el;
		if( qry === 'body' ) el = document.body;
		else if( qry === 'head' ) el = document.head;
		else el = document.querySelector(qry);

		return el ? new EL(el) : null;
	};

	// misc
	EL.prototype.bind = EL.prototype.on;
	EL.prototype.unbind = EL.prototype.un;
	EL.prototype.trigger = EL.prototype.fire;

	EL.prototype.focus = function() {
		this[0].focus();
		return this;
	};

	EL.prototype.hover = function(over, out) {
	};

	EL.prototype.toggle = function(before, after) {
	};

	EL.prototype.each = function(fn) {
		fn.apply(this[0], [0, this[0]]);
	};

	EL.prototype.forEach = function(fn) {
		fn.apply(this[0], [0, this[0]]);
	};

	// Text Node
	function TextNode(element) {
		this[0] = element;
		this.__handler__ = this;
	}

	for(var k in EL.prototype) {
		var v = EL.prototype[k];
		if( typeof(v) === 'function' ) {
			TextNode.prototype[k] = function() {};
		}
	}

	TextNode.prototype.attachTo = EL.prototype.attachTo;
	TextNode.prototype.detach = EL.prototype.detach;
	
	return EL;
})();


var ELs = (function() {
	"use strict"

	function ELs(arr) {
		this.length = 0;
		this.merge(arr);
	}

	ELs.prototype = new Array;

	var o = EL.prototype;
	for( var k in o ) {
		if( !o.hasOwnProperty(k) ) continue;
		var fn = o[k];
		if( typeof(fn) === 'function' ) {
			(function(k, fn) {
				ELs.prototype[k] = function() {
					for(var i=0; i < this.length; i++) {
						var item = this[i];
						fn.apply(item.__handler__ || new EL(item), arguments);
					}

					return this;
				};
			})(k, fn);
		}
	}

	ELs.prototype.push = function(o) {
		if( o instanceof EL ) this[this.length++] = o[0];			
		else if( EL.isElement(o) ) this[this.length++] = o;
		else if( o && (o.nodeName == '#text' || o.nodeName == '#comment' || o.nodeName == '#cdata-section') ) this[this.length++] = o;
		else console.error('WARN:incompatible element pushed', o);
	};

	ELs.prototype.merge = function(o) {
		if( !o ) return;

		if( typeof(o.length) === 'number' ) {
			for(var i=0; i < o.length; i++) {
				this.push(o[i]);
			}
		} else {
			this.push(o);
		}
	};

	ELs.prototype.forEach = function(fn) {
		if( typeof(fn) !== 'function' ) throw new TypeError('invalid function');

		for(var i=0; i < this.length; i++) {
			var item = this[i];
			fn.apply(this, [item, i]);
		}
	};

	ELs.prototype.each = ELs.prototype.forEach;

	return ELs;
})();


// dom query
var DOM = (function() {
	"use strict"

	var DOM = function(qry) {
		if( !qry ) return null;
		else if( qry instanceof EL ) return qry;
		else if( qry instanceof ELs ) return qry;
		else if( DOM.isElement(qry) ) return new EL(qry);

		var els = new ELs();		
		if( typeof(qry) === 'object' && typeof(qry.length) === 'number' ) {
			for(var i=0; i < qry.length; i++) {
				els.push(qry[i]);
			}
		} else if( typeof(qry) === 'string' ) {
			if( qry.startsWith('!#') || qry.match(/(<([^>]+)>)/ig) || ~qry.indexOf('\n') ) {
				els = DOM.create(qry);
			} else {
				els = DOM.finds(qry);
			}
		}

		if( els && els.length === 1 ) return new EL(els[0]);
		return els;
	};

	DOM.isElement = EL.isElement;
	DOM.create = EL.create;
	DOM.eval = EL.eval;
	DOM.finds = EL.finds;
	DOM.find = EL.find;

	return DOM;
})();

var $ = DOM;
var $1 = DOM.find;
var $n = DOM.finds;
var $c = DOM.create;

// global event
(function() {
	"use strict"

	DOM.on = function(type, fn, bubble) {
		if( !type || !fn ) throw new Error('missing:type or fn');

		if( window.addEventListener ) {
			if( type == 'ready' ) type = 'DOMContentLoaded';
			window.addEventListener(type, fn, ((bubble===true) ? true : false));
		} else if( window.attachEvent ) {
			if( type == 'ready' ) {
				document.attachEvent("onreadystatechange", function(){
					if ( document.readyState === "complete" ) {
						//console.log('dom ready');
						document.detachEvent( "onreadystatechange", arguments.callee );
						if( fn ) fn.apply(this, arguments);
					}
				});
			} else {
				document.attachEvent('on' + type, fn, ((bubble===true) ? true : false));
			}
		}
	};

	DOM.un = function(type, fn, bubble) {
		if( window.removeEventListener ) {
			window.removeEventListener(type, fn, ((bubble===true) ? true : false));
		} else {
			document.detachEvent('on' + type, fn, ((bubble===true) ? true : false));
		}
	};
})();
// EOF of DOM.js [attrs.ui-0.6.0]

// Template.js [attrs.ui-0.6.0]
var Template = (function() {
	"use strict"
	
	//var TPL_PATTERN = new RegExp('[{][.\\w:\\w(.\\w)?\\-]+[}]', 'igm');
	var TPL_PATTERN = new RegExp('[{][a-zA-Z0-9 :.,()\'";?<>\|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]+[}]', 'igm');

	function currency(n, f){
		var c, d, t;

		var n = n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + ((f===false) ? '' : (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""));
	}

	var TRANSLATORS = {
		image: function(v) {
			return ( typeof(v) === 'string' ) ? '<img src="' + v + '" />' : '';
		},
		currency: function(v) {
			var value = v;
			if( typeof(value) === 'number' ) value = parseInt(value);
			if( isNaN(value) ) return v;
			return currency(value, false);
		},
		stringify: function(v) {
			if( typeof(v) === 'object' ) return JSON.stringify(v, null, '\t');
			else if( typeof(v) === 'function' ) return v.toString();
			else return v;
		},
		date: function(v, format) {
			if( typeof(v) !== 'number' || isNaN(v) ) return v;
			return new Date(v).format(format || 'yyyy.mm.dd');
		}
	};


	// class Template
	function Template(html) {
		this.html = html;
	}

	Template.prototype = {
		bind: function(o, fns) {
			o = o || {};
			fns = fns || {};

			var el = document.createElement('body');			
			el.innerHTML = this.html;

			var parseKey = function(k) {
				if( typeof(k) !== 'string' ) return null;

				if( k.startsWith('{') ) k = k.substring(1);
				if( k.endsWith('}') ) k = k.substring(0, k.length -1);
				
				var args = k.split(':');

				var fn = args[1];
				var option, pos;
				if( fn && (pos = fn.indexOf('(')) > 0 ) {
					option = fn.substring(fn.indexOf('(') + 1, fn.indexOf(')', pos+1));
					fn = fn.substring(0, fn.indexOf('('));
				}

				return {
					key: args[0],
					fn: fn,
					option: option,
					defaultValue: args[2],
					mask: args[3],
					args: args
				}
			};

			var getValue = function(key, o) {
				if( typeof(key) !== 'string' ) return null;
				
				if( key.indexOf('.') > 0 ) {
					var c = o;
					var arg = key.split('.');
					arg.forEach(function(k) {
						if( c ) c = c[k];
					});
					return c;
				}

				return o[key];
			};
			
			var evaluate = function(path, el, nodeValue, o, fns, global, preprocessor) {
				var v = nodeValue;
				var pos = -1;
				while((pos = v.indexOf('{')) >= 0) {
					v = v.substring(pos + 1);
					var matched  = v.substring(0, v.indexOf('}'));
					var parsed = parseKey(matched);
					var key = parsed.key;
					var fn = parsed.fn;
					var option = parsed.option;
					var def = parsed.defaultValue || '';
					var fnc = fns[fn] || global[fn] || TRANSLATORS[fn];
				
					var row = o;
					while( key.startsWith('.') ) {
						row = row._parent || {};
						fnc = (fns._parent || {})[fn] || (fns._parent || {})['all'];
						key = key.substring(1);
					}

					var value = getValue(key, row);

					if( preprocessor ) {
						var result = preprocessor(path, key, value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}

					if( fns && fns.$all ) {							
						var result = fns.$all(key, value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}

					if( fnc ) {
						if( typeof(fnc) !== 'function' && typeof(fnc.$) === 'function' ) fnc = fnc.$;
						var result = fnc(value, option, row, el, fns);
						if( result !== undefined ) value = result;
					}
					
					if( !value ) value = def;
					nodeValue = nodeValue.split('{' + matched + '}').join(value);
				}

				return nodeValue;
			};

			var parse = function(path, el, o, fns, global, preprocessor) {
				if( el.nodeName == '#text' ) {
					if( el.nodeValue ) {
						var value = evaluate(path, el, el.nodeValue, o, fns, global, preprocessor);
						var p = el.parentNode;
						var nel = document.createElement((p.tagName || 'div'));
						nel.innerHTML = value;

						var c = nel.childNodes;
						var argc = [];
						if( c ) for(var j=0; j < c.length;j++) argc.push(c[j]);
						if( argc ) for(var j=0; j < argc.length;j++) p.insertBefore(argc[j], el);
						p.removeChild(el);
					}
				} else if( el.getAttribute ) {
					var attrs = el.attributes;
					for(var i=0; i < attrs.length; i++) {
						var attr = attrs[i];
						var value = evaluate(path, el, attr.value, o, fns, global, preprocessor);
						if( value !== attr.value ) {
							el.setAttribute(attr.name, value);
						}
					}
				}
				
				var childNodes = el.childNodes;
				var argc = [];
				if( childNodes && childNodes.length ) {
					for(var i=0; i < childNodes.length;i++) argc.push(childNodes[i]);
				}

				if( argc ) {
					for(var i=0; i < argc.length;i++) {
						var sub = argc[i];
						var v;

						if( sub.getAttribute && (v = sub.getAttribute('bypass')) ) {
							if( v.trim().toLowerCase() === 'true' ) continue;
						}
						
						// if hash console attr
						if( sub.getAttribute && (v = sub.getAttribute('log')) ) {
							sub.removeAttribute('log');
							
							(function(condition) {
								try {
									console.log(condition + ':', eval(v));
								} catch(e){
									console.error('tpl console log error', e, v);
								}
							}).call(o, v);

							if( sub.tagName.toUpperCase() === 'TPL' && !sub.getAttribute('for') && !sub.getAttribute('if') ) {
								el.removeChild(sub);
							}
						}

						// if in condition
						if( sub.getAttribute && (v = sub.getAttribute('if')) ) {
							//console.log('is condition', sub);
							var elsetag = sub.querySelector('else');
							if( elsetag && elsetag.parentNode !== sub ) elsetag = null;
							if( elsetag ) sub.removeChild(elsetag);
							sub.removeAttribute('if');

							var checktrue = (function(condition) {
								try {
									//console.log('evaluation', this, condition);
									//return eval('(row.items && row.items.length)');
									var item = o;
									var row = o;
									var r = eval('(' + condition + ')');
									//console.log('eval', condition, r);
									return r;
								} catch(e){
									console.error('tpl evaluation error', e, condition);
									return false;
								}
							}).call(o, v);

							var cnodes = [], rebuild = false;
							if( checktrue ) {
								if( sub.tagName.toUpperCase() === 'TPL' && !sub.getAttribute('for') ) {
									var subc = sub.childNodes;
									if( subc ) for(var p=0; p < subc.length;p++) cnodes.push(subc[p]);
									rebuild = true;
								}
							} else {
								if( elsetag ) {
									var subc = elsetag.childNodes;
									if( subc ) {
										for(var p=0; p < subc.length;p++) cnodes.push(subc[p]);
									}
								}
								rebuild = true;
							}

							if( rebuild ) {
								//console.log('is rebuild', sub);
								for(var p=0; p < cnodes.length; p++) {
									var n = cnodes[p];
									el.insertBefore(n, sub);
									argc.push(cnodes[p]);
								}
								el.removeChild(sub);
								continue;
							}
						}
						
						// if for loop
						if( sub.getAttribute && (v = sub.getAttribute('for')) ) {
							var parsed = parseKey(v);
							if( parsed ) {
								var key = parsed.key;
								var fn = parsed.fn;
								var def = parsed.defaultValue;
								var option = parsed.option;
								var arg = getValue(key, o) || def;
								var sfns = fns[fn || key] || global[fn || key] || TRANSLATORS[fn || key];
								var spath = ((path) ? (path + '.') : '') + key;
								var snext = sub.nextSibling;
								
								el.removeChild(sub);

								if( typeof(arg) === 'string' ) {
									el.innerHTML = arg;
									return;
								}

								if( !arg ) continue;

								if( typeof(arg.length) !== 'number' ) arg = [arg];

								for(var j=0; j < arg.length; j++) {
									var row = arg[j];

									var type = typeof(row);
									if( type === 'string' ) {
										var r = {};
										r[key] = row;
										row = r;
									} else if( !row || type !== 'object' ) {
										continue;
									}

									//console.error('#' + path, key, row, sfns, sub);

									var temp = sub.cloneNode(true);
									
									//만약 노드의 fn 이 펑션이라면 펑션 실행
									if( preprocessor ) {
										var result = preprocessor(path, key, row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									if( sfns && typeof(sfns.$) === 'function' ) {
										var result = sfns.$(key, row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									if( typeof(sfns) === 'function' ) {
										var result = sfns(row, option, o, temp, fns);
										if( result !== undefined ) row = result;
									}

									if( row ) {
										if( AE.isElement(row) ) {
											temp = row;
										} else if( row instanceof AE ) {
											temp = row.el;
										} else if( row === false) {
											continue;
										}
									} else if( row === undefined ) {
										row = arg[j];
									}

									if( !sfns ) sfns = {};

									temp.removeAttribute('for');
									row._parent = o;
									sfns._parent = fns;

									row._index = j;
									parse(spath, temp, row, sfns, global, preprocessor);
									
									if( temp.tagName.toUpperCase() === 'TPL' ) {
										var nodes = temp.childNodes;
										var _argc = [];
										if( nodes && nodes.length ) {
											for(var a=0; a < nodes.length;a++) _argc.push(nodes[a]);
										}

										if( _argc ) {
											for(var a=0; a < _argc.length;a++) {
												if( snext ) el.insertBefore(_argc[a], snext);
												else el.appendChild(_argc[a]);
											}
										}
									} else {
										if( snext ) el.insertBefore(temp, snext);
										else el.appendChild(temp);
									}
								}
							}
						} else {
							parse(path, sub, o, fns, global, preprocessor);
						}
					}
				}
			};

			parse('', el, o, fns, fns['global'] || {}, fns['preprocessor']);

			return new Elements(el.children);
		}
	};

	return Template;
})();
// EOF of Template.js [attrs.ui-0.6.0]

// StyleSession.js [attrs.ui-0.6.0]
var StyleSession = (function() {
	"use strict"

	var calibrator = Device.calibrator;

	// class Template
	function StyleSession(el) {
		if( !EL.isElement(el)) throw new TypeError('invalid element:' + el);
		this.el = el;
		this.buffer = {};
	}

	StyleSession.prototype = {
		toString: function() {
			return this.text();
		},
		toJSON: function() {
			return this.get();
		},
		raw: function(text) {
			if( !arguments.length ) return this.el.style.cssText;			
			if( typeof(text) === 'string' ) this.el.attr('style', text);
			return this;
		},
		text: function(text) {
			if( !arguments.length ) {
				var styles = this.get();
			
				var text = '';
				for(var key in styles) {
					text += key + ': ' + (styles[key] || '') + '; ';
				}
				
				return text;
			}
			
			if( typeof(text) === 'string') {
				var args = text.split(';');
				for(var i=0; i < args.length ; i++) {					
					var item = args[i];
					if( item ) {
						var keyvalue = item.split(':');
						var key = keyvalue[0];
						var value = keyvalue[1];
						if( typeof(value) === 'string') value = value.trim();
						this.set(key.trim(), value);
					}
				}
			} else {
				console.error('[WARN] illegal style text', text);
			}
			
			return this;
		},
		get: function(key) {
			if( !arguments.length ) {
				var o = {};
				var el = this.el;
				
				var raw = el.style.cssText;
				if( raw ) {
					var args = raw.split(';');
					for(var i=0; i < args.length ; i++) {					
						var item = args[i];
						if( item ) {
							var keyvalue = item.split(':');
							var key = keyvalue[0];
							var value = keyvalue[1];
							if( typeof(value) === 'string') value = value.trim();
							o[key.trim()] = value;
						}
					}
				}
				
				var buffer = this.buffer;
				for(var key in buffer) {
					o[key] = buffer[key];
				}
				
				return o;								
			}
			
			if( typeof(key) !== 'string' ) console.error('[WARN] invalid key', key);
			
			var buffer = this.buffer;
			if( buffer[key] ) return buffer[key];
			
			var el = this.el;
			key = calibrator.key(key);
			var value = el.style[calibrator.camelcase(key.device)] || el.style[calibrator.camelcase(key.original)];
			var calibrated = calibrator.value(key.original, value);
			return calibrated.original[key.original];
		},
		set: function(key, value) {
			if( arguments.length === 1 && key === false ) return this.clear();
						
			var o = {};
			if( typeof(key) === 'string' ) o[key] = value;
			else if( typeof(key) === 'object' ) o = key;
			else return this;

			var calibrated = calibrator.values(o);
			var merged = calibrated.merged;
			var buffer = this.buffer;

			if( merged ) {
				for(var key in merged) {
					if( !merged.hasOwnProperty(key) ) continue;
				
					var value = merged[key];
					buffer[key] = value;
				}
			}
			
			return this;
		},
		clear: function() {
			this.buffer = {$clear: true};
		},
		rollback: function() {
			this.buffer = {};
		},
		commit: function() {
			var el = this.el;
			
			try {
				var original = el.style.cssText;
				var buffer = this.buffer || {};
				this.buffer = {};
				if( buffer.$clear) el.style.cssText = '';
			
				for(var key in buffer) {
					if( !buffer.hasOwnProperty(key) ) continue;
				
					var value = buffer[key];
					key = calibrator.camelcase(key);
					if( !Array.isArray(value) ) value = [value];
									
					for(var i=0; i < value.length; i++) {
						try {
							if( value[i] === false ) el.style[key] = null;
							else el.style[key] = value[i];
						} catch(err) {
							console.error('[ERROR] style write failure (' + key + ':' + value[i] + ')');
							el.style.cssText = original;
							return this;
						}
					}
				}
			
				if( !el.style.cssText ) el.removeAttribute('style');
			} catch(err) {
				console.error('[ERROR] style write failure (' + err.message + ')', buffer, err);
				el.style.cssText = original;
			}
			
			return this;			
		}
	};

	return StyleSession;
})();

// test
if( false ) {
	var el = document.createElement('div');
	el.style.cssText = 'display:block;width:100%;';
	
	var session = new StyleSession(el);
	
	console.log('el', el);
	console.log('raw', session.raw());
	console.log('text', session.text());
	console.log('toString', session.toString());
	console.log('json', JSON.stringify(session));
	console.log('display', session.get('display'));
	console.log('width', session.get('width'));	
	
	session.set('font-weight', 'bold');
	session.set('height', 50);
	session.set('transition', 'all 1s');
	console.log('raw', session.raw());
	console.log('json', JSON.stringify(session));
	console.log('buffer', session.buffer);
	session.commit();
}

// EOF of StyleSession.js [attrs.ui-0.6.0]

// Animator.js [attrs.ui-0.6.0]
var Animator = (function() {
	"use strict"

	// privates
	function pixel(el, key, value) {
	}
	
	function toString(value, unit) {
		if( typeof(value) !== 'number' ) return value;
		return value + (unit || '');
	}

	var reserved = ['delay', 'use3d', 'backface', 'origin', 'perspective', 'easing', 'duration', 'perspective'];
	function transition(el, o) {
		var parent = el.parent();

		var session = el.style();
		if( o.use3d !== false ) session.set('transform-style', 'preserve-3d');
		if( o.backface === 'hidden' ) session.set('backface-visibility', 'hidden');
		if( o.origin ) session.set('transform-origin', o.origin);
		if( parent && typeof(o.perspective) === 'number' ) parent.style('perspective', o.perspective);
		session.set('transition-timing-function', o.easing || Animator.DEFAULT_EASING || 'ease-in-out');		
		session.set('transition-duration', (o.duration || Animator.DEFAULT_DURATION) + 'ms');
		
		var properties = [];
		for(var key in o) {
			if( !key || !o.hasOwnProperty(key) || ~reserved.indexOf(key)) continue;

			var value = o[key];
			if( key === 'transform' && typeof(value) === 'object' ) {			
				var transform = o['transform'];
				
				var text = '';
				for(var key in transform) {
					if( !transform.hasOwnProperty(key) ) continue;
					
					var value = transform[key];
					
					if( key === 'x' ) text += 'translateX(' + toString(value, 'px') + ') ';
					else if( key === 'y' ) text += 'translateY(' + toString(value, 'px') + ') ';
					else if( key === 'z' ) text += 'translateZ(' + toString(value, 'px') + ') ';
					else if( key === 'rx' ) text += 'rotateX(' + toString(value, 'deg') + ') ';
					else if( key === 'ry' ) text += 'rotateY(' + toString(value, 'deg') + ') ';
					else if( key === 'rz' ) text += 'rotateZ(' + toString(value, 'deg') + ') ';
					else if( key === 'sx' ) text += 'scaleX(' + toString(value) + ') ';
					else if( key === 'sy' ) text += 'scaleY(' + toString(value) + ') ';
					else if( key === 'sz' ) text += 'scaleZ(' + toString(value) + ') ';
					else text += (key + '(' + value + ')');
				}
				
				//console.log('transform', text);
				
				session.set('transform', text);
				properties.push('transform');
			} else if( key ) {
				session.set(key, value);
				properties.push(key);
			}
		}			

		session.set('transition-property', properties.join(','));		
		session.commit();
		//console.log('transition:', session.raw());
	}
	
	// class Animator
	function Animator(el, options, scope) {
		if( EL.isElement(el) ) el = $(el);
		if( !(el instanceof EL) ) throw new Error('Animator:invalid element');
		this.el = el;
		if( scope ) this.scope(scope);
		this._chain = [];
		this.index = -1;
		if( options ) this.chain(options);
	}

	Animator.DEFAULT_DURATION = 250;
	Animator.DEFAULT_EASING = 'ease-in-out';
	Animator.FAULT_WAITING = 100;

	Animator.prototype = {
		chain: function(options) {
			if( !arguments.length ) return this._chain;
			if( typeof(options) === 'number' ) return this._chain[options];
			
			if( options === false ) {
				this._chain = [];
				return this;
			}

			var args = options;
			if( !Array.isArray(args) ) args = [args];
			for(var i=0; i < args.length; i++) {
				var o = args[i];
				if( typeof(o) !== 'object' ) console.error('[WARN] illegal animation options', o);
				this._chain.push(o);
			}
			
			return this;
		},
		scope: function(scope) {
			if( !arguments.length ) return this._scope || this.el;
			if( scope ) this._scope = scope;
			return this;
		},
		length: function() {
			return this._chain.length;
		},
		reset: function(options) {
			this.stop();
			this.first();
			this.chain(options);
		},
		before: function(before) {
			if( !arguments.length ) return this._before;
			if( before === false ) {
				this._before = null;
				return this;
			}

			if( typeof(before) !== 'function' ) return console.error('Animator:before function must be a function', before);
			this._before = before;
			return this;
		},
		run: function(callback) {
			this.first();

			var before = this.before();
			if( before ) before.call(this.scope(), this);

			var fn = function() {
				if( !this.next(fn) && callback ) callback.call(this.scope(), this);
			};

			fn.call(this);

			return this;
		},
		reverse: function(callback) {
			this.last();

			var before = this.before();
			if( before ) before.call(this.scope(), this);

			var fn = function() {
				if( !this.prev(fn) && callback ) callback.call(this.scope(), this);
			};

			fn.call(this);

			return this;
		},
		executeCurrent: function(callback) {
			var self = this;
			var finished = false;
			var fn = function(e) {
				if( !finished ) {
					finished = true;
					self.el.un('transitionend', fn);
					if( callback ) callback.call(self.scope(), self);
				}
			};
			var options = this.chain(this.index);
			if( !options ) return false;
			this.el.on('transitionend', fn);
			
			if( typeof(options.delay) === 'number' ) {
				setTimeout(function() {
					transition(self.el, options);
				}, options.delay);
			} else {
				transition(this.el, options);
			}
			
			var wait = Animator.FAULT_WAITING;
			if( typeof(wait) !== 'number' || isNaN(options.delay) ) wait = 100;
			if( typeof(options.delay) === 'number' && !isNaN(options.delay) ) wait = wait + options.delay;
			if( typeof(options.duration) === 'number' && !isNaN(options.duration) ) wait = wait + options.duration;
			else wait += Animator.DEFAULT_DURATION;
			setTimeout(function() {
				if( !finished ) {
					finished = true;
					console.log('animation not affected', options);
					self.el.un('transitionend', fn);
					if( callback ) callback.call(self.scope(), self);
				}
			}, wait);

			return this;
		},
		first: function() {
			this.index = -1;
			return this;
		},		
		last: function() {
			this.index = -1;
			return this;
		},
		next: function(callback) {
			var o = this.chain(++this.index);
			if( !o ) return false;
			var self = this;
			var b = this.executeCurrent(function(anim) {
				if( callback ) callback.call(self, anim);
			});
			if( !b ) return false;
			return this;
		},
		prev: function(callback) {
			var o = this.chain(--this.index);
			if( !o ) return false;
			var self = this;
			var b = this.executeCurrent(function(anim) {
				if( callback ) callback.call(self, anim);
			});
			if( !b ) return false;
			return this;
		}
	};

	return Animator;
})();

// EOF of Animator.js [attrs.ui-0.6.0]

// Scroller.js [attrs.ui-0.6.0]
var Scroller = (function() {
	var SCROLL_INPUT_ELEMENTS =  ['input','textarea', 'select'];
	var SCROLL_HAS_TOUCH = ('createTouch' in document);

	var D = Device;

	function Scroller(el, options) {
		//*console.log('setup scroller', options);
		var s = this.options;
		var o = options;
		for(var k in o ) {
			var v = o[k];
			s[k] = v;	
		}

		this.id = (options) ? options.id : '';
		this.el = el.el || el;

		this.unlock();
	}

	Scroller.prototype = {
		options: {
			fps: (( D.is('android') ) ? 45 : (( D.is('ios') ) ? undefined : 120)),
			snapEasing: 'cubic-bezier(0.3, 0.6, 0.6, 1)',
			snapDelay: 250,
			initialY: 0,
			initialX: 0,
			lockThreshold: 0,
			overscroll: true,
			acceleration: true
		},
		
		id: undefined,
		clientWidth: 0,
		clientHeight: 0,
		contentWidth: 0,
		contentHeight: 0,
		lockThreshold: 0,
		
		target: undefined,
		overscroll: true,
		axisx: false,
		axisy: false,
		axisauto: false,
		startx: 0,
		starty: 0,
		lastx: 0,
		lasty: 0,
		lastd: 0,
		fpsInterval: undefined,
		use3d: true,
		beginTime: 0,
		acceleration: true,
		isDragging: false,
		hl: false,
		scale: 1,
		e: {},

		initialized: false,

		lock: function() {
			var el = this.el;

			if( SCROLL_HAS_TOUCH ) {
				el.removeEventListener('touchstart', this, false);
				el.removeEventListener('touchmove', this, false);
				el.removeEventListener('touchend', this, false);
			} else {
				el.removeEventListener('mousedown', this, false);
				el.removeEventListener('mousemove', this, false);
				el.removeEventListener('mouseup', this, false);
				el.removeEventListener('mouseout', this, false);
			}
			el.removeEventListener('gesturechange', this, false);
			el.removeEventListener('gestureend', this, false);
			el.removeEventListener('click', this, false);
			el.removeEventListener('click', this, true);
			el.removeEventListener('transitionend', this, false);
		},

		unlock: function() {
			var el = this.el;
			
			if( SCROLL_HAS_TOUCH ) {
				el.addEventListener('touchstart', this, false);
				el.addEventListener('touchmove', this, false);
				el.addEventListener('touchend', this, false);
			} else {
				el.addEventListener('mousedown', this, false);
				el.addEventListener('mousemove', this, false);
				el.addEventListener('mouseup', this, false);
				el.addEventListener('mouseout', this, false);
			}
			el.addEventListener('click', this, false);
			el.addEventListener('click', this, true);
			el.addEventListener('transitionend', this, false);
			
			if( this.options.zoom ) {
				el.addEventListener('gesturechange', this, false);
				el.addEventListener('gestureend', this, false);
			}
		},
		
		on : function( type, listener ) {
			if( !type || !listener ) return;
			this.e[type] = listener;
			this.hl = true;
		},

		fire : function(type, a,b,c,d,e,f,g,h) {
			var li = this.e[type];
			if( li && typeof(li) == 'function' ) li(a,b,c,d,e,f,g,h);
		},

		changeAxis: function(axis) {
			this.axisx = this.axisy = false;

			if( axis ) {
				if( axis == 'x' ) this.axisx = true;
				if( axis == 'y' ) this.axisy = true;
				if( axis == 'xy' || axis == 'yx' ) this.axisx = this.axisy = true;
			} else {
				this.axisy = true;
				this.axisauto = true;
			}

			//console.log('[' + this.id + ']', axis, this.axisx, this.axisy);

			this.validate();
		},

		reload: function() {
			this.initialized = true;
			var o = this.options;
			var self = this;

			this.stop();
			
			window.removeEventListener('resize', self.validate, false);
			window.addEventListener('resize', self.validate, false);

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			this.contentWidth = this.el.scrollWidth;
			this.contentHeight = this.el.scrollHeight;

			this.target = undefined;
			this.clientWidth = 0;
			this.clientHeight = 0;
			this.contentWidth = 0;
			this.contentHeight = 0;
			this.starty = 0;
			this.startx = 0;
			this.lastx = 0;
			this.lasty = 0;
			this.lastd = 0;
			this.use3d = (o.use3d === false) ? false : true;
			this.beginTime = 0;
			this.isDragging = false;

			this.acceleration = !(o.acceleration == false);		
			this.lockThreshold = o.lockThreshold ? o.lockThreshold : 0;
			this.overscroll = (o.overscroll == false) ? false : true;
			if( o.e ) {
				this.e = o.e;
				this.hl = true;
			}

			this.changeAxis(o.axis);

			this.unlock();

			var fps = o.fps;
			if( fps && !isNaN(parseInt(fps)) ) this.fpsInterval = Math.round(1000 / fps);
			//*//*console.log('[' + this.id + '] fps interval:' + this.fpsInterval + ' use 3d:' +  this.use3d + ' axisx:' + this.axisx + ', axisy:' + this.axisy + ', momentum:', this.acceleration);
		},

		destroy: function() {
			var el = this.el;

			this.lock();

			if( this.hl ) this.fire('destroyed', this);
		},
		
		validate: function(e) {
			if( this.hl ) this.fire('beforevalidate', this);
			
			//console.warn('clientHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.clientHeight);
			//console.warn('scrollHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.scrollHeight);
			//console.warn('offsetHeight(' + this.el.parentNode.getAttribute('id') + ')', this.el.offsetHeight);
			
			if( !this.el || !this.el.parentNode ) return;

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			if( this.scale == 1) this.contentWidth = this.el.scrollWidth;
			if( this.scale == 1) this.contentHeight = this.el.scrollHeight;
			this.bottomx = -(this.contentWidth - this.clientWidth);
			this.bottomy = -(this.contentHeight - this.clientHeight);
			var x = this.lastx;
			var y = this.lasty;

			if( this.scale === 1 ) {
				this.ocw = this.contentWidth;
				this.och = this.contentHeight;
			}

			if( this.axisauto ) {			
				this.axisx = false;
				this.axisy = true;
				if( this.contentWidth > this.clientWidth ) {
					this.axisx = true;
					this.axisy = false;
				}
				if( this.contentHeight > this.clientHeight ) this.axisy = true;
				//console.log('axisauto', this.axisx, this.axisy);
			}
			
			////*//*console.log('[' + this.id + '] x:' + this.clientWidth + ',' + this.contentWidth + ' = ' + -(this.contentWidth - this.clientWidth));
			//*//*console.log('[' + this.id + '] y:' + this.clientHeight + '/' + this.contentHeight + ', ' + this.bottomy + ',' + y);

			var bx = this.bottomx = -(this.contentWidth - this.clientWidth);
			var by = this.bottomy = -(this.contentHeight - this.clientHeight);
			
			//this.stop();
			//console.log('[' + this.id + ']', x, y, bx, by);

			//바운더리 벗어났다면, 바운드한다.
			if( this.axisy ) {
				if( y > 0 || by >= 0 ) {
					this.toTop();
				} else if( y < by ) {
					this.toBottom();
				}
			}
			
			if( this.axisx ) {
				if( x > 0 || bx >= 0 ) {
					this.toLeft();
				} else if( x < bx ) {
					this.toRight();
				}
			}
			if( this.hl ) this.fire('aftervalidate', this);
		},

		//event handler
		handleEvent: function(e) {
			if( !this.initialized ) this.reload();
			//scrollTo 피니시 펑션 수행 : 새로운 사용자 액션 혹은 트랜지션 종료시 실행
			if( this.scrollToFn ) {
				var fn = this.scrollToFn;
				this.scrollToFn = null;
				//console.log('finished scrollTo');
				fn(this, this.lastx, this.lasty)
			}

			if( !e.type == 'click' ) e._handleByScroller = true;
			//y가 고정이면 x 축 스크롤링(axisx) 일 경우만 동작, x 가 고정이면 y축 스크롤링(axisy) 인 경우만 동작
			if( (e.lockx && this.axisx) || (e.locky && this.axisy) ) return;
			
			var tag = e.target.tagName;

			//줌
			if( this.options.zoom ) {
				//console.log('줌');
				if( e.type == 'gesturechange' ) {
					e.preventDefault();
					this.zoomlock = true;
					var scale = this.scale = e.scale;				
					
					this.contentWidth = Math.round(scale * this.ocw);
					this.contentHeight = Math.round(scale * this.och);

					this.axisx = true;
					this.axisy = true;
					
					var el = this.el;
					el.css('transition', '');
					el.css('transform', 'scale(' + e.scale + ')');
				} else if( e.type == 'gestureend' ) {
					e.preventDefault();
					e.stopPropagation();				

					this.contentWidth = Math.round(scale * this.ocw);
					this.contentHeight = Math.round(scale * this.och);
					
					var el = this.el;
					el.css('transition', '');
					el.css('transform', 'scale(' + e.scale + ')');
					

					this.validate();

					this.zoomlock = false;				
				}
			
				if( this.zoomlock ) return;
			}

			if( e.type == 'touchstart' || e.type == 'mousedown' ) {
				this.begin(e);
			} else if( this.isDragging && (e.type == 'touchmove' || e.type == 'mousemove') ) {
				var p = e.touches ? e.touches[0] : e;
				if( (!this.fpsInterval || this.lastd == 0 || (e.timeStamp - this.lastd) > this.fpsInterval) ) {
					this.moving(e,p);
				}

				//하위 이벤트에 락 통보
				if( this.lockThreshold ) {
					var dx = Math.abs(p.clientX - this.startx);
					var dy = Math.abs(p.clientY - this.starty);

					////*//*console.log('dx,dy:', dx, dy);

					if( this.axisy && dx <= this.lockThreshold ) e.lockx = true;
					if( this.axisx && dy <= this.lockThreshold ) e.locky = true;
				}

				if( this.axisx && this.lastx < 0 && this.lastx > this.bottomx ) e.lockx = true;
				if( this.axisy && this.lasty < 0 && this.lasty > this.bottomy ) e.locky = true;
				////*console.warn('[' + this.id + '] lock:', e.lockx, e.locky );	
			} else if( this.isDragging && (e.type == 'touchend' || e.type == 'mouseup') ) {		
				this.finish(e);
			/*} else if( this.isDragging && e.type == 'mouseout' ) {
				this.out(e);*/
			} else if( e.type == 'click' ) {
				if( e.touches && e.touches.length > 1 ) {
					e.stopPropagation();
					return;
				}
				//e.preventDefault();
				//console.warn(e._handleByScroller);
				
				//안드로이드의 경우 select 이벤트를 소프트로 대체해줘야 한다... 망할
				if( D.is('android') && tag == 'SELECT' ) {
					return;
				}

				if( !e._handleByScroller ) {
					e.stopPropagation();
					//e.preventDefault();
				}
				return;
			} else if( e.type == 'webkitTransitionEnd' ) {
				if( e.target != this.el ) return;
				//console.warn(e.target, e);

				if( e.propertyName == '-webkit-transform' ) {
					//*console.log('scroller transition finished : ' + this.id, e);
					if( this.hl ) {
						if( this.isOver ) {
							console.log('finished with transition');
							this.fire('finish', this, this.lastx, this.lasty, this.bottomx, this.bottomy, this.isOver, e, this.dx, this.dy);
						}
					}
				}

				this.validate();

				e.stopPropagation();
				return;
			}
			
			
			//TODO: 이거 왜 했을까.. 이유를 알 수 없음
			//아무튼 안드로이드에서만 유독 인풋에서 발생한 이벤트가 상위로 올라감. 
			if( ~tag.indexof('SELECT', 'INPUT', 'TEXTAREA') ) {
				//this.validate();
				//e.preventDefault();
				//e.stopPropagation();
			}
		},

		begin: function(e) {
			//*//*console.log('[' + this.id + '] begin');
			////*console.log(e);

			this.stop();
			this.validate();

			this.el.css('transition', '');
			
			//*console.log('[' + this.id + '] x:' + this.clientWidth + ',' + this.contentWidth + ' = ' + -(this.contentWidth - this.clientWidth));
			//*console.log('[' + this.id + '] y:' + this.clientHeight + ',' + this.contentHeight + ' = ' + -(this.contentHeight - this.clientHeight));

			this.isDragging = true;
			this.beginTime = e.timeStamp;

			var p = e.touches ? e.touches[0] : e;
			this.target = e.target;

			this.starty = p.clientY;
			this.startOffsetY = this.lasty;

			this.startx = p.clientX;
			this.startOffsetX = this.lastx;

			this.dx = 0;
			this.dy = 0;

			if( this.hl ) this.fire('begin', this, e);
		},

		moving: function(e,p) {
			this.lastd = e.timeStamp;

			var currenty = p.clientY;
			var deltay = currenty - this.starty;
			var y = deltay + this.startOffsetY;

			var currentx = p.clientX;
			var deltax = currentx - this.startx;
			var x = deltax + this.startOffsetX;

			this.dx = (p.clientX - this.startx);
			this.dy = (p.clientY - this.starty);
			
			//바운더리를 넘었다면. 특정값에 수렴하도록 한다.
			if(y && this.axisy) {
				if( y >= 0 ) {
					if( !this.overscroll ) return;
					y = y - (deltay/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				} else if( y <= this.bottomy ) {
					if( !this.overscroll ) return;
					y = y - (deltay/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				}
				
				if(y) this._scrollBy(null,y);
			}

			//바운더리를 넘었다면. 특정값에 수렴하도록 한다.
			if(x && this.axisx) {
				if( x >= 0 ) {
					if( !this.overscroll ) return;
					x = x - (deltax/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				} else if( x <= this.bottomx ) {
					if( !this.overscroll ) return;
					x = x - (deltax/2); //TODO : 바운더리가 넘어간만큼에 대해서만 1/2 하게 바꿔야 해
				}
				
				if(x) this._scrollBy(x,null);
			}

			if( this.hl ) this.fire('moving', this, e, this.dx, this.dy);
		},

		finish: function(e) {
			if( this.hl ) this.fire('beforefinish', this, e);
			//*console.log('[' + this.id + '] finish');

			this.clientWidth = this.el.parentNode.clientWidth;
			this.clientHeight = this.el.parentNode.clientHeight;
			if( this.scale == 1) this.contentWidth = this.el.scrollWidth;
			if( this.scale == 1) this.contentHeight = this.el.scrollHeight;

			var bx = this.bottomx = -(this.contentWidth - this.clientWidth);
			var by = this.bottomy = -(this.contentHeight - this.clientHeight);
			var x = this.lastx;
			var y = this.lasty;
			var duration = e.timeStamp - this.beginTime;

			//console.log('[' + this.id + '] finish:', this.contentHeight, this.clientHeight);
			
			var isOver = false;
			
			//*//*console.log('[' + this.id + '] y:' + this.clientHeight + '/' + this.contentHeight + ', ' + this.bottomy + ',' + y);
			
			if( this.axisx && this.axisy ) {
				if( y >= 0 || by >= 0 ) {
					isOver = true;
					this.toTop();
				} else if( y < by ) {
					isOver = true;
					this.toBottom();
				} else if (duration < 300 && this.acceleration) {
					if(this.dy > 0) this.toTop(3000);
					if(this.dy < 0) this.toBottom(3000);
				}

				if( x >= 0 || bx >= 0 ) {
					isOver = true;
					this.toLeft();
				} else if( x < bx ) {
					isOver = true;
					this.toRight();
				} else if (duration < 300 && this.acceleration) {
					//this.toRight(1200);
					if(this.dx > 0) this.toLeft(3000);
					if(this.dx < 0) this.toRight(3000);
				}
			} else if( this.axisy ) {
				if( y >= 0 || by >= 0 ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'y', y, e);
					this.toTop();
				} else if( y < by ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'y', y - by, e);
					this.toBottom();
				} else if (duration < 300 && this.acceleration) {
					var my = this._momentum(y - this.startOffsetY, duration, -y, ((this.clientHeight - this.contentHeight) < 0 ? this.contentHeight - this.clientHeight + y : 0), this.options.overscroll ? this.clientHeight : 0);
					var ny = y + my.dist;
					this.scrollTo(0, ny, my.time);
				}
			} else if( this.axisx ) {
				if( x >= 0 || bx >= 0 ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'x', x, e);
					this.toLeft();
				} else if( x < bx ) {
					isOver = true;
					if( this.hl ) this.fire('over', this, 'x', x - bx, e);
					this.toRight();
				} else if (duration < 300 && this.acceleration) {
					var mx = this._momentum(x - this.startOffsetX, duration, -x, ((this.clientWidth - this.contentWidth) < 0 ? this.contentWidth - this.clientWidth + x : 0), this.options.overscroll ? this.clientWidth : 0);
					var nx = x + mx.dist;
					this.scrollTo(nx, 0, mx.time);
				}
			}

			this.isDragging = false;
			
			if( !e._dispatched && Math.abs(this.dx) <= 20 && Math.abs(this.dy) <= 20 ) {
				this._dispatchOriginalEvent(e);
			}
			e._dispatched = true;

			this.isOver = isOver;
			if( this.hl ) {
				if( ! this.isOver ) {
					//console.log('finished normally');
					this.fire('finish', this, this.lastx, this.lasty, this.bottomx, this.bottomy, this.isOver, e, this.dx, this.dy);
				}
			}
		},
		
		/*out: function(e) {
			var target = e.target;
			var related = e.relatedTarget;
			console.log('[' + this.id + '] out', this.el, target, related);
			if (false) {
				//만약 out 이벤트가 element 의 자식이 아닌것으로 일어났다면, 정지한다. 자식이라면 그대로 진행.
				

				if (!target) {
					//*//*console.log('[' + this.id + '] out', target);
					this.finish(e);
					return;
				}

				if(target.parentNode == this.el) {
					//*//*console.log('[' + this.id + '] out', target);
					this.finish(e);
					return;
				}
				
				//*//*console.log('[' + this.id + '] related', target);
				//*//*console.log('[' + this.id + '] element', this.el);

				while (target = target.parentNode) {
					//*//*console.log('[' + this.id + '] elemend', target);
					if (target == this.el) {
						this.finish(e);
						return;
					}
				}
			}
		},*/

		//private
		_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
			var mround = function(r) { return r >> 0; }

			var deceleration = 0.00065,
				speed = Math.abs(dist) / time,
				newDist = (speed * speed) / (2 * deceleration),
				newTime = 0, outsideDist = 0;

			// Proportinally reduce speed if we are outside of the boundaries 
			if (dist > 0 && newDist > maxDistUpper) {
				outsideDist = size / (6 / (newDist / speed * deceleration));
				maxDistUpper = maxDistUpper + outsideDist;
				speed = speed * maxDistUpper / newDist;
				newDist = maxDistUpper;
			} else if (dist < 0 && newDist > maxDistLower) {
				outsideDist = size / (6 / (newDist / speed * deceleration));
				maxDistLower = maxDistLower + outsideDist;
				speed = speed * maxDistLower / newDist;
				newDist = maxDistLower;
			}

			newDist = newDist * (dist < 0 ? -1 : 1);
			newTime = speed / deceleration;

			return { dist: newDist, time: mround(newTime) };
		},
		/*_momentum : function(dx,dy,mx,my,d) {
			var nx, ny, timex, timey;

			if( dx ) {
				var vx = dx / d;
				var ax = vx < 0 ? 0.0006 : -0.0006;
				nx = - (vx * vx) / (2 * ax);
				timex = - vx / ax;
				
				if( nx >= 0 ) {
					timex = timex * (mx/nx);
					nx = 0;
				} else if( nx < mx ) {
					timex = timex * (mx/nx);
					nx = mx;
				}
			}
			
			if( dy ) {
				var vy = dy / d;
				var ay = vy < 0 ? 0.0006 : -0.0006;
				ny = - (vy * vy) / (2 * ay);
				timey = - vy / ay;

				if( ny >= 0 ) {
					timey = timey * (my/ny);
					ny = 0;
				} else if( ny < my ) {
					timey = timey * (my/ny);
					ny = my;
				}
			}
			
			return {
				time: ((timex > timey) ? timex : timey),
				nx: nx,
				ny: ny
			};
		},*/

		_scrollBy: function(x,y) {
			////*//*console.log('[' + this.id + '] _scrollBy:', x, y);
			if(x != 0 ) x = x || this.lastx;
			if(y != 0 ) y = y || this.lasty;
			
			this.lastx = x;
			this.lasty = y;
			//this.el.style('transform'] = 'translate(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ')';
			
			if( this.use3d ) {
				this.el.css('transform', 'translate3d(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ', 0)');
			} else {
				this.el.css('transform', 'translate(' + (x ? x + 'px' : 0) + ', ' + (y ? y + 'px' : 0) + ')');
			}
		},

		_dispatchOriginalEvent: function (e) {
			var target = this.target;
			
			//인풋 개체인 경우 click 이벤트 발생하지 않는다.
			if (SCROLL_INPUT_ELEMENTS.indexOf(target.localName) != -1) {
				return;
			}

			if( D.is('webkit') ) {
				var pe = document.createEvent('MouseEvent');
				pe.initMouseEvent('click', true, false, document.defaultView, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
				pe._handleByScroller = true;
				pe._ignoreInner = e._ignoreInner;
				target.dispatchEvent(pe);
			} else if( document.dispatchEvent ) {
				var pe = document.createEvent( "MouseEvents" );
				pe.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, target);
				pe._handleByScroller = true;
				pe._ignoreInner = e._ignoreInner;
				target.dispatchEvent(pe);
			} else if( document.fireEvent ) {
				target.fireEvent("onclick");
			}
		},
		
		//public
		scrollTo: function(x, y, ms, fn, easing) {
			//*//*console.log('[' + this.id + '] scrollTo:', x, y, ms);
			//*//*console.log('[' + this.id + '] translate3d(0, ' + y + 'px, 0)');
			if(ms !== 0) this.el.css('transition', 'transform ' + (ms || this.options.snapDelay) + 'ms ' + (easing || this.options.snapEasing));
			this._scrollBy(x, y, fn);
			
			if( fn && typeof(fn) == 'function' ) {
				if( ms == 0 && fn ) {
					fn(this, this.lastx, this.lasty);
				} else {
					this.scrollToFn = fn;
				}
			}
		},

		stop: function() {
			if( this.hl ) this.fire('beforestop', this);
			//*//*console.log('[' + this.id + '] stop');
			var style = document.defaultView.getComputedStyle(this.el, null);
			if( window.WebKitCSSMatrix ) {
				var transform = new WebKitCSSMatrix(style['webkitTransform']);
				this._scrollBy(transform.m41, transform.m42);
				this.el.css('transition', '');
				this.el.css('transition-duration', '');
				this.el.css('transition-delay', '');
				this.el.css('transform-timing-function', '');
				//*console.warn('[' + this.id + '] m41/m42:', transform.m41, transform.m42);
			}

			//this.validate();
			if( this.hl ) this.fire('afterstop', this);
		},

		toTop: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toTop:', ms);
			this.scrollTo(null,0,ms, easing, fn);
		},
		
		toBottom: function(ms, easing, fn) {
			if( !this.axisy ) return;
			//console.log('[' + this.id + '] toBottom:', ms, this.contentHeight, this.clientHeight);
			this.scrollTo(null,-(this.contentHeight - this.clientHeight),ms, easing, fn);
		},

		toLeft: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toLeft:', ms);
			this.scrollTo(0,null,ms, easing, fn);
		},
		
		toRight: function(ms, easing, fn) {
			if( !this.axisx ) return;
			//*//*console.log('[' + this.id + '] toRight:', ms);
			this.scrollTo(-(this.contentWidth - this.clientWidth),null,ms, easing);
		},

		toFirst: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toFirst:', ms);
			this.scrollTo(0,0,ms, easing, fn);
		},
		
		toLast: function(ms, easing, fn) {
			//*//*console.log('[' + this.id + '] toLast:', ms);
			var x = -(this.contentWidth - this.clientWidth);
			var y = -(this.contentHeight - this.clientHeight)
			
			if( !this.axisx ) x = 0;
			if( !this.axisy ) y = 0;

			this.scrollTo(x,y,ms, easing, fn);
		}
	};

	return Scroller;
})();
// EOF of Scroller.js [attrs.ui-0.6.0]

// Path.js [attrs.ui-0.6.0]
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
// EOF of Path.js [attrs.ui-0.6.0]

// Ajax.js [attrs.ui-0.6.0]
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
// EOF of Ajax.js [attrs.ui-0.6.0]

// Require.js [attrs.ui-0.6.0]
/**
 * require, supports CommonJS & AMD. MIT Lisence.
 * @author joje6 (joje.attrs@gmail.com)
 */
var Require = (function() {	
	// imports
	var global = window;

	// privates
	// create new require environment for each module
	function createRequire(src) {
		src = Path.join(location.href, src) || location.href;
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
		var exports = {};
		var require = createRequire(src);
		var module = {
			exports:exports
		};

		// extract current require dirname & filename
		var __filename = Path.join(Path.dir(location.href), src);
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
	var require = function(src, cache) {
		return Require.sync(src, cache);
	};

	window.require = require;

	window.require.noConflict = function() {
		window.require = another;
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

// EOF of Require.js [attrs.ui-0.6.0]

// StyleSheetManager.js [attrs.ui-0.6.0]
/*
 * class StyleSheetManagerHandler for raw stylesheet handling
 */
var StyleSheetManager = (function() {
	"use strict"
	
	function StyleSheetManager(name, media) {
		if( !name || typeof(name) !== 'string' ) throw new Error('illegal stylesheet name:' + name);
		
		//this.debug = true;
		this._media = media;
		this._name = name;
		if( STYLESHEETS[this.id()] ) throw new Error('already exists stylesheet name & media');

		this.clear();

		STYLESHEETS[this.id()] = this;
	}

	StyleSheetManager.prototype = {
		id: function() {
			return this.name() + '.' + this.media();
		},
		media: function(media) {
			if( !arguments.length ) return this._media || 'all';

			if( media && typeof(media) !== 'string' ) throw new TypeError('illegal stylesheet media(string):' + media);

			this._media = media;
			return this;
		},
		name: function(name) {
			if( !arguments.length ) return this._name;

			if( !name || typeof(name) !== 'string' ) throw new TypeError('illegal stylesheet name(string):' + name);

			this._name = name;
			return this;
		},
		cssText: function() {
			var css = '';
			var rules = this.rules();
			for(var i=0; i < rules.length; i++) {
				css += rules[i].cssText + '\n';
			}
			return css;
		},
		rules: function() {
			var stylesheet = this.stylesheet;
			return ( stylesheet ) ? (stylesheet.rules || stylesheet.cssRules) : null;
		},
		clear: function() {
			var head = document.head || document.getElementsByTagName('head').item(0);
			var tag = document.createElement('style');
			tag.setAttribute('name', this.name());
			tag.setAttribute('media', this.media());
			tag.setAttribute('type', 'text/css');
			
			var prev = this.tag;
			if( prev ) {
				head.insertBefore(tag, prev);
				head.removeChild(prev);
			} else {
				head.appendChild(tag);
			}

			var stylesheets = document.styleSheets, stylesheet;
			if( stylesheets ) {
				for(var i=0; i < stylesheets.length; i++) {
					if( (stylesheets[i].ownerNode || stylesheets[i].owningElement) === tag )
						stylesheet = stylesheets[i];
				}
			}

			if( !stylesheet ) throw new Error('style tag creation failure');
			this.stylesheet = stylesheet;
			this.tag = tag;

			return this;
		},
		detach: function() {
			if( this.tag ) {
				var head = document.head || document.getElementsByTagName('head').item(0);

				if( this.tag.parentNode === head ) {
					head.removeChild(this.tag);
				}
			}
			return this;
		},
		attach: function(tag, after) {
			if( this.tag ) {
				var head = document.head || document.getElementsByTagName('head').item(0);

				if( this.tag.parentNode === head ) return this;

				if( tag && (tag.tag || tag) ) {
					if( after === true ) head.insertAfter(this.tag, tag.tag || tag);
					else head.insertBefore(this.tag, tag.tag || tag);
				} else {
					head.appendChild(this.tag);
				}
			}
			return this;
		},
		insert: function(accessor, css) {
			if( !accessor ) return console.error('[insert] ' + this.id(), 'invalid accessor', accessor);
			if( !css ) return console.error('[insert] ' + this.id(), 'invalid css', css);
			
			if( css instanceof Style ) css = css.css();
			else if( typeof(css) === 'object' ) css = new Style(css).css();

			var stylesheet = this.stylesheet;
			try {
				if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', stylesheet.cssRules.length);
				else stylesheet.addRule(accessor, css, stylesheet.rules.length);

				if( this.debug ) console.log('[insert] ' + this.id(), '\n' + accessor + ' {\n' + css + '}\n');
			} catch(e) {
				console.error(e.message, '\n' + accessor + ' {\n' + css + '}\n');
			}

			return this;
		},
		update: function(accessor, css) {
			if( !accessor ) return console.error('[update] ' + this.id(), 'invalid accessor', accessor);
			if( !css ) return console.error('[update] ' + this.id(), 'invalid css', css);

			if( css instanceof Style ) css = css.css();
			else if( typeof(css) === 'object' ) css = new Style(css).css();

			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			var updated = false;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', i);
					else stylesheet.addRule(accessor, css, i);

					updated = true;

					if( this.debug ) console.log('[update] ' + this.id(), '\n' + accessor + ' {\n' + css + '}\n');

					break;
				}
			}

			if( !updated ) this.insert(accessor, css);

			return this;
		},
		remove: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);
				}
			}

			if( this.debug ) console.log('[remove] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		removeLast: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=(rules.length - 1); i >= 0; i--) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					break;
				}
			}

			if( this.debug ) console.log('[removeLast] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		removeFirst: function(accessor) {
			var stylesheet = this.stylesheet;
			var rules = stylesheet.rules || stylesheet.cssRules;
			for(var i=0; i < rules.length; i++) {
				var rule = rules[i].selectorText;
				if( rule.trim() == accessor.trim() ) {
					if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
					else stylesheet.removeRule(i);

					break;
				}
			}

			if( this.debug ) console.log('[removeFirst] ' + this.id(), '\n' + accessor, css);
			return this;
		},
		visit: function(fn, reverse) {
			function handler(stylesheet, rule) {
				var rules = Array.prototype.slice.call(stylesheet.rules || stylesheet.cssRules || []);
				return {
					stylesheet: stylesheet,
					rule: rule,
					rules: rules,
					update: function(accessor, css) {
						var i = rules.indexOf(rule);
						if( ~i ) {
							if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
							else stylesheet.removeRule(i);

							if( stylesheet.insertRule ) stylesheet.insertRule(accessor + ' {' + css + '}', i);
							else stylesheet.addRule(accessor, css, i);
						} else {
							console.error('[WARN] cannot update rule(not exist):' + rule);
						}
					},
					remove: function() {
						var i = rules.indexOf(rule);
						if( ~i ) {
							if( stylesheet.deleteRule ) stylesheet.deleteRule(i);
							else stylesheet.removeRule(i);
						} else {
							console.error('[WARN] cannot remove rule(not exist):' + rule);
						}
					}
				};
			}

			var stylesheet = this.stylesheet;
			var rules = Array.prototype.slice.call(stylesheet.rules || stylesheet.cssRules || []);
			if( reverse === true ) {
				for(var i=(rules.length - 1); i >= 0; i--) {
					var rule = rules[i].selectorText;
					if( fn.apply(this, handler(stylesheet, rule)) === false ) break;
				}
			} else {
				for(var i=0; i < rules.length; i++) {
					var rule = rules[i].selectorText;
					if( fn.call(this, handler(stylesheet, rule)) === false ) break;
				}
			}

			return this;
		}
	};

	
	var STYLESHEETS = {};
	StyleSheetManager.get = function get(name, media) {
		return STYLESHEETS[name + '.' + (media || 'all')];
	};

	StyleSheetManager.all = function all() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(STYLESHEETS[k]);
		}
		return o;
	};

	StyleSheetManager.ids = function ids() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(k);
		}
		return o;
	};

	StyleSheetManager.names = function ids() {
		var o = [];
		for(var k in STYLESHEETS) {
			if( !STYLESHEETS.hasOwnProperty(k) ) continue;
			o.push(STYLESHEETS[k].name);
		}
		return o;
	};


	return StyleSheetManager;
})();

// EOF of StyleSheetManager.js [attrs.ui-0.6.0]

// Style.js [attrs.ui-0.6.0]
/**
 *	Style: JSON Style Sheet Object Representation (JSON-SS)
 *
 * 
 *	- CSS Selectors and Pseudo Selectors Browser Compatibility
 *	CSS 1 
 *		E
 *		E F
 *		:link
 *		E:active
 *		E:visited
 *		E:first-line
 *		E:first-letter
 *		E.classname
 *		E#id
 *		.classname.classname
 *
 *	CSS 2.1	
 *		*
 *		E > F
 *		E:first-child
 *		E:hover
 *		E:focus	(not supported in IE7)
 *		E + F
 *		E[attr]
 *		E[attr="name"]
 *		E[attr~="name"]
 *		E:before	(not supported in IE7)
 *		E:after	(not supported in IE7)
 *
 *	CSS 3
 *		E ~ F
 *		E[attr^="name"]
 *		E[attr$="name"]
 *		E[attr*="name"]
 *		E[attr|="name"]
 *	
 *	CSS 3 (not supported in IE 7 & 8)
 *		E:root
 *		E:nth-of-type
 *		E:nth-last-of-type
 *		E:first-of-type
 *		E:last-of-type
 *		E:only-of-type
 *		E:only-child
 *		E:last-child
 *		E:nth-child
 *		E:nth-last-child
 *		E:empty
 *		E:target
 *		E:checked
 *		E::selection
 *		E:enabled
 *		E:disabled
 *		E:not(s)
 */

var Style = (function() {
	"use strict"

	var calibrator = Device.calibrator;

	function parse(s, forceobjectify) {
		s = s.trim();
		if( ~s.indexOf(':') && !~s.indexOf('{') ) {
			var o = s;
			var bracket;

			if( ~s.indexOf('(') && ~s.indexOf(')') ) {
				bracket = s.substring(s.indexOf('('), s.indexOf(')') + 1);
				s = s.split(bracket).join('$bracket$');
			}

			var arg = s.split(';');
			if( arg.length <= 1 && forceobjectify !== true ) {
				if( o.endsWith(';') ) o = o.substring(0, o.lastIndexOf(';'));
				return o;
			}

			var result = {};
			for(var i=0; i < arg.length; i++) {
				var c = arg[i];
				if( !c || !~c.indexOf(':') ) {
					console.error('WARN:detected invalid style item [' + c + '] in ' + o);
					continue;
				}
				
				var pos = c.indexOf(':');
				var key = c.substring(0, pos).trim();
				var value = c.substring(pos + 1).trim();
				if( bracket && value.indexOf('$bracket$') ) value = value.split('$bracket$').join(bracket);

				result[key] = value;
			}

			return result;
		}

		if( s.endsWith(';') ) s = s.substring(0, s.lastIndexOf(';'));

		return s;
	}

	function isPrimitive(value) {
		return (typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean') ? true : false;
	}

	function joinRule(prefix, rule) {
		if( !rule || typeof(rule) !== 'string' ) throw new TypeError('illegal rule:' + rule);
		
		var rules = rule.split(',');
		var result = [];
		for(var i=0; i < rules.length; i++) {
			var rule = rules[i].trim();
			if( !rule ) continue;

			if( !rule.startsWith('@') ) {
				if( rule.startsWith(':') || rule.startsWith('..') ) rule = prefix + rule.split('..').join('.');
				else if( rule.startsWith('!') ) rule = rule.substring(1) + prefix;
				else rule = prefix + ' ' + rule;
			}

			if( rule ) result.push(rule);
		}

		return result.join(', ');
	}

	// class Style
	var Style = function Style(source) {
		if( typeof(source) !== 'object' ) source = {};

		this._d = new EventDispatcher().scope(this).source(this);

		source = Util.copy(source);
		this.reset(source);
	};
	
	Style.prototype = {
		get: function(rule) {
			if( !arguments.length ) return null;
			return this[rule];
		},
		rules: function(recursive) {
			var arr = [];
			for(var k in this) {
				if( !this.hasOwnProperty(k) || k.startsWith('_') ) continue;
				if( this[k] || isPrimitive(this[k]) ) arr.push(k);	
			}

			return arr;
		},
		clear: function() {
			// delete current elements
			var dispatcher = this._d;
			
			for(var rule in this) {
				if( !this.hasOwnProperty(rule) || rule.startsWith('_') ) continue;
				this[rule] = null;
				try { delete this[rule]; } catch(e) {}
			}

			dispatcher.fireSync('cleared');
			dispatcher.fireSync('changed');
			return this;
		},
		reset: function(source) {
			if( !arguments.length || typeof(source) !== 'object' ) return this;
			
			var dispatcher = this._d;
			
			var silent = dispatcher.silent();
			dispatcher.silent(true);

			// clear previous
			this.clear();
			this.set(source);
			dispatcher.silent(silent);

			dispatcher.fireSync('reset', {source:source});
			dispatcher.fireSync('changed');
			return this;
		},
		set: function(rule, value, event) {
			var source;

			if( typeof(rule) === 'object' ) {
				source = rule;
			} else if( typeof(rule) === 'string' ) {
				source = {};
				source[rule] = value;
			} else {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}

			var dispatcher = this._d;
			var p = this[rule];

			// bind new elements
			for(var rule in source) {
				if( !source.hasOwnProperty(rule) || rule.startsWith('_') ) continue;
				
				value = source[rule];
				rule = rule.trim();

				// if string, try parse to object
				if( typeof(value) === 'string' ) {
					var force = false;
					if( rule.startsWith('.') || rule.startsWith('#') || rule.startsWith('@') || rule.startsWith(':') || rule.startsWith('[') || ~rule.indexOf('~') || ~rule.indexOf('+') || ~rule.indexOf('>') || ~rule.indexOf(' ') || ~rule.indexOf('*') ) force = true;
					value = parse(value, force);
				}
				
				if( isPrimitive(value) ) {
					this[rule] = value;
				} else if( Array.isArray(value) ) {
					var arr = value;

					for(var i=0; i < arr.length; i++) {
						if( typeof(arr[i]) === 'object' ) {
							var style = arr[i] = new Style(arr[i]);
					
							// bind events
							var fn = function(e) {
								dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
							};
							style.on('changed', fn).__listener__ = fn;
						}
					}

					this[rule] = arr;
				} else if( typeof(value) === 'object' ) {
					var style = new Style(value);
					
					// bind events
					var fn = function(e) {
						dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
					};
					style.on('changed', fn).__listener__ = fn;

					this[rule] = style;
				} else {
					if( !value ) console.warn('style item[' + rule + '] bypassed. illegal value:', value, source);
				}

			}
			
			if( event !== false ) {
				if( p ) dispatcher.fireSync('replaced', {rule:rule, value:value});
				else dispatcher.fireSync('added', {rule:rule, value:value});
				dispatcher.fireSync('changed');
			}
			
			return this;
		},
		merge: function(rule, value, event) {
			if( arguments.length < 2 || !rule || typeof(rule) !== 'string' || rule.startsWith('_') ) {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}
			
			rule = rule.trim();

			var item = this[rule];
			var dispatcher = this._d;
			
			if( !item ) {
				return this.set(rule, value, event);
			} else if( item instanceof Style ) {
				if( typeof(value) !== 'object' ) return this;

				for(var k in value) {
					if( !value.hasOwnProperty(k) || k.startsWith('_') ) continue;
					item.merge(k, value[k], event);
				}
			} else {
				if( Array.isArray(value) ) {
					var arr = value;

					for(var i=0; i < arr.length; i++) {
						var v = arr[i];
						
						if( typeof(v) === 'object' ) {
							v = new Style(v);
						} else if( !isPrimitive(value) ) {
							continue;
						}

						// bind events
						if( v instanceof Style ) {
							var fn = function(e) {
								dispatcher.fireSync('changed', {rule:rule, originalEvent:e.originalEvent || e});
							};
							style.on('changed', fn).__listener__ = fn;
						}

						item.push(v);
					}

					this[rule] = arr;
				} else if( isPrimitive(value) ) {
					this[rule] = value;
				} else {
					if( !value ) console.warn('style item[' + rule + '] bypassed. illegal value:', value);
				}
			}
			
			if( event !== false ) {
				dispatcher.fireSync('merged', {rule:rule, value:value});
				dispatcher.fireSync('changed');
			}

			return this;
		},
		remove: function(rule) {
			if( arguments.length < 1 || !rule || typeof(rule) !== 'string' || rule.startsWith('_') ) {
				console.error('WARN:illegal style rule name', rule, value);
				return this;
			}

			rule = rule.trim();

			var style = this[rule];
			if( style === null || style === undefined ) return this;
			
			var dispatcher = this._d;

			if( style instanceof Style ) {
				style.un('changed', style.__listener__);
			}

			this[rule] = null;
			try { delete this[rule]; } catch(e) {}

			dispatcher.fireSync('removed', {rule:rule});
			dispatcher.fireSync('changed');

			return this;
		},
		css: function() {
			var values;
			for(var key in this) {
				if( !this.hasOwnProperty(key) || key.startsWith('_') || this[key] instanceof Style || key === 'inherit' || key === 'debug' ) continue;
				
				if( !values ) values = {};
				values[key] = this[key];
			}
			
			if( !values ) return '';

			//console.log('css', values);
			var calibrated = calibrator.values(values);
			//console.log(JSON.stringify(calibrated, null, '\t'));
			
			var css = '';
			var merged = calibrated.merged;
			for(var key in merged) {
				var values = merged[key];
				if( !Array.isArray(values) ) values = [values];
				for(var i=0; i < values.length; i++) {
					//if( !isPrimitive(items[i]) ) continue;
					var value = values[i];

					if( key === '!' ) css = '' + value + '\n';
					else css += '\t' + key + ': ' + value + ';\n';
				}				
			}			

			return css;
		},
		build: function(prefix, stylesheet, excludeAtkey) {			
			if( !prefix ) prefix = '';
			if( typeof(prefix) !== 'string' ) throw new Error('invalid style prefix:' + prefix);
			
			prefix = prefix.trim();			
			var css = this.css() || '';
			
			//console.error(prefix);

			//if( prefix.startsWith('@') ) prefix = calibrator.rule(prefix).merged;
			prefix = calibrator.rule(prefix).device;
			
			if( stylesheet && prefix && css ) stylesheet.insert(prefix, css);

			if( css ) css = prefix + ' {\n' + css + '}\n\n';

			//console.log(css);
			
			
			var subcss = '';
			for(var rule in this) {
				if( !this.hasOwnProperty(rule) || rule.startsWith('_') || typeof(this[rule]) !== 'object' ) continue;
				
				var items = this[rule];
				if( !Array.isArray(items) ) items = [items];

				for(var i=0; i < items.length; i++) {
					if( !(items[i] instanceof Style) ) continue;
					if( rule.trim().startsWith('@') && excludeAtkey === true ) continue;
					
					var item = items[i];
					var subprefix = joinRule(prefix, rule);

					subcss += item.build(subprefix, stylesheet, excludeAtkey);
				}
			}

			return css + subcss;
		},
		clone: function() {
			return new Style(JSON.parse(JSON.stringify(this)));
		},
		
		// event dispatcher bridge method
		on: function() {
			return this._d.on.apply(this._d, arguments);
		},
		un: function() {
			return this._d.un.apply(this._d, arguments);
		},
		has: function() {
			return this._d.has.apply(this._d, arguments);
		},
		
		// json interpreter
		toJSON: function() {
			var r = {};
			for(var k in this) {
				if( !this.hasOwnProperty(k) || k.startsWith('_') ) continue;
				if( this[k] || isPrimitive(this[k]) ) r[k] = this[k];		
			}

			return r;
		}
	};

	return Style;
})();

// EOF of Style.js [attrs.ui-0.6.0]

// StyleSystem.js [attrs.ui-0.6.0]
var StyleSystem = (function() {
	"use strict"

	// define style tags
	var style_global = new StyleSheetManager('attrs.ui.global');
	
	
	// global style
	var global = new Style();
	global.on('changed', function(e) {
		style_global.clear();
		global.build('', style_global);
	});

	return {
		stylesheets: StyleSheetManager,
		global: global
	};
})();

// EOF of StyleSystem.js [attrs.ui-0.6.0]

// UI.UIObject.js [attrs.ui-0.6.0]
UI.UIObject = function UIObject() {};
//UI.UIObject.cmpname = 'x';

UI.inherit = function inherit(cls, scls, instantiatable) {
	if( typeof(cls) !== 'function' ) return console.error('invalid component class(function) : ', cls);
	if( (!scls || !(scls.prototype instanceof UI.UIObject)) && scls !== UI.UIObject ) return console.error('supercomponent must be an intanceof UIObject:', scls);
	cls = Class.inherit(cls, scls, instantiatable);
	return cls;
};

UI.ready = function ready(fn) {
	$.on('ready', fn);
};

UI.load = function load(fn) {
	$.on('load', fn);
};

UI.on = function on(type, fn, bubble) {
	$.on(type, fn, bubble);
};

UI.un = function un(type, fn, bubble) {
	$.un(type, fn, bubble);
};

// css reset
StyleSystem.global.set({
	'body': {
		'font-size': 11,
		'margin': 0,
		'padding': 0
	}
});
// EOF of UI.UIObject.js [attrs.ui-0.6.0]

// UI.Theme.js [attrs.ui-0.6.0]
UI.Theme = (function() {
	"use strict"
	
	// private
	var writeComponentStyleSheet = function(context, style, cmpname, prefix, stylesheet) {
		var cmp = context.component(cmpname);
		if( !cmp || !cmp.accessor ) {
			if( !cmp ) return console.error('WARN:theme css writing warning. component[' + cmpname + '] does not exists. bypassed');
			else return console.error('WARN:component\'s \'accessor\' attribute is not defined.');
		}
		
		style.build(prefix + '.' + cmp.accessor.split(' ').join('.'), stylesheet);
	};
	
	// class theme
	function Theme(context, name, src) {
		if( !(context instanceof UI.Context) ) {
			console.error('[ERROR] invalid context', context);
			throw new Error('invalid context:' + context);
		}

		if( name && (typeof(name) !== 'string' || !/^[-a-zA-Z0-9]+$/.test(name) || name.startsWith('-')) ) throw new Error('illegal theme name:' + name);

		this._name = name || '';
		this._context = context;
		this._styles = {};
		this._stylesheet = new StyleSheetManager('attrs.ui.' + context.id() + ((name) ? '.' + name : ''));
		this._d = new EventDispatcher().scope(this).source(this);

		if( src ) this.src(src);
	};

	Theme.prototype = {
		name: function() {
			return this._name || '';
		},
		context: function() {
			return this._context;
		},
		styles: function() {
			return this._styles;
		},
		stylesheet: function() {
			return this._stylesheet;
		},
		source: function(source) {
			if( !arguments.length ) return this._source;
			
			if( typeof(source) !== 'object' ) return console.error('[ERROR] invalid source', source);
			
			this._source = source;
			this.clear();

			// remove previous component styles
			var styles = this.styles();
			for(var k in styles) {
				if( !styles.hasOwnProperty(k) || k.startsWith('_') ) continue;
				this.remove(k);
			}

			// create new component styles
			for(var k in source) {
				if( !source.hasOwnProperty(k) || k.startsWith('_') ) continue;

				var style = this.component(k);
				if( style ) style.reset(source[k]);
			}
			
			return this;
		},
		src: function(src, async) {
			if( !arguments.length ) return this._src;
			
			if( typeof(src) !== 'string' ) return console.error('[ERROR] invalid src', src);

			if( async && typeof(src) == 'string' ) {
				this._src = src;
				var self = this;
				Require.async(this.context().path(src)).done(function(err, module) {
					if( err ) return console.error('[ERROR] remote theme load fail', src, e.message);
					console.log('theme loaded from', src, module.exports);
					if( module ) self.source(module.exports);
				});
				return this;
			}

			this.source(Require.sync(this.context().path(src)));
			
			return this;
		},
		global: function() {
			return this.component('global');
		},
		component: function(id) {
			if( typeof(id) !== 'string' || !/^[-a-zA-Z0-9_]+$/.test(id) || id.startsWith('-') ) throw new Error('illegal theme component name:' + id);

			var style = this.styles()[id];
			var context = this.context();
			var prefix = this.accessor();
			var stylesheet = this.stylesheet();
			
			if( !style ) {
				style = new Style();
				this.styles()[id] = style;
				
				var accessor = prefix;
				if( id !== 'global' ) {
					var cmp = context.component(id);
					if( !cmp ) return console.warn('[WARN] theme [' + (this.name() || '(default)') + ':' + (this.src() || '(unknown source)') + '] apply failure. [' + id + '] component theme bypassed.', this.source());
					accessor = cmp && cmp.accessor;
					
					if( accessor ) accessor = prefix + '.' + accessor.split(' ').join('.');
					else return console.error('[WARN] component\'s \'accessor\' attribute is not defined.');
				}

				// binding listener
				var dispatcher = this._d;
				var fn = function(e) {
					dispatcher.fireSync('changed', {component:id});
					
					// 기존스타일 제거
					/*stylesheet.visit(function(current) {
						var rule = current.rule;
						//console.log(rule, accessor);
						if( accessor && (rule === accessor || rule.indexOf(accessor + ' ') === 0 || rule.indexOf(accessor + '.') === 0) ) current.remove();
					});*/

					style.build(accessor, stylesheet);
				};
				style.__listener_bytheme__ = fn;
				style.on('changed', fn);
			}

			return style;
		},
		remove: function(id) {
			var style = this.styles()[id];
			if( style ) {
				// remove listener
				style.un('changed', style.__listener_bytheme__);

				this.styles()[id] = null;
				try { delete this.styles()[id]; } catch(e) {}

				this._d.fireSync('removed', {component:id});
			}

			return this;
		},
		accessor: function() {
			var ca = this.context().accessor();
			var name = this.name();
			return (ca ? '.' + ca : '') + (name ? '.theme-' + name : '');
		},
		writeTo: function(stylesheet) {
			if( !stylesheet ) return console.error('[ERROR] missing parameter:stylesheet ');
			var context = this.context();
			var styles = this.styles();
			var prefix = this.accessor();

			for(var cmpname in styles) {
				var cmp = context.component(cmpname);
				var accessor = cmp && cmp.accessor;
				
				if( accessor ) accessor = prefix + '.' + accessor.split(' ').join('.');
				else return console.error('WARN:component\'s \'accessor\' attribute is not defined.');

				styles[cmpname].build(accessor, stylesheet);
			}
		},
		css: function(pretty) {
			var result = '';
			if( pretty === false ) this.writeTo({insert:function(p,c){result += p + ' {' + c + '}';}});
			else this.writeTo({insert:function(p,c){result += p + ' {\n' + c + '\n}\n';}});
			return result;
		},
		clear: function() {
			this._styles = {};
			this.stylesheet().clear();
		},
		refresh: function() {
			this.writeTo(this.stylesheet());
		},
		
		// event dispatcher bridge method
		on: function() {
			return this._d.on.apply(this._d, arguments);
		},
		un: function() {
			return this._d.un.apply(this._d, arguments);
		},
		has: function() {
			return this._d.has.apply(this._d, arguments);
		},
		
		// json interpreter
		clone: function(asname) {
			if( typeof(asname) !== 'string' ) throw new TypeError('illegal clone theme name');
			var source = JSON.parse(JSON.stringify(this));
			source.name = asname;
			return new Theme(source);
		},
		toJSON: function() {
			return this.styles();
		}
	};

	return Theme;
})();

// EOF of UI.Theme.js [attrs.ui-0.6.0]

// UI.Context.js [attrs.ui-0.6.0]
(function() {
	"use strict"
	
	UI.Context = (function() {
		var seq = 0;

		function Context(origin) {
			this._id = 'ctx' + (seq++);
			this._accessor = this._id;
			this._cmps = [];
			this._children = [];
			this._instances = [];
			if( origin ) this.origin(origin);
		}

		Context.prototype = {
			id: function() {
				return this._id;
			},
			parent: function() {
				return this._parent;
			},
			children: function() {
				return this._children.slice();
			},
			createNew: function(origin) {
				var ctx = new Context(origin);
				ctx._parent = this;
				this._children.push(ctx);
				return ctx;
			},
			accessor: function() {
				return this._accessor;
			},
			module: function(module) {
				if( !arguments.length ) return this._module;
				return this.origin(module);
			},
			origin: function(origin) {
				if( !arguments.length ) return this._origin || location.href;

				//console.log(UI.ModuleConcrete);
				if( UI.ModuleConcrete && (origin instanceof UI.ModuleConcrete) ) {
					this._module = origin;
					this._origin = origin.src();
				} else if( typeof(origin) === 'string' ) {
					this._origin = origin;
				} else {
					console.error('[WARN] illegal origin', origin);
				}
				
				return this;
			},
			path: function(src) {
				return Path.join(this.base(), src);
			},
			base: function() {
				return Path.dir(this.origin());
			},
			add: function(instance) {
				if( !(instance instanceof UI.UIObject) ) {
					console.error('[WARN] invalid instance(UIObject)', instance);
					return this;
				}
				
				//if( instance.context() ) instance.context().disconnect(instance);				
				//console.log('connect', this.id(), instance.name());
				
				this._instances.push(instance);
				instance.attr('title', 'context.' + this.id());
				return this;
			},
			remove: function(instance) {
				if( !(instance instanceof UI.UIObject) ) {
					console.error('[WARN] invalid instance', instance, this);
					return this;
				}
				
				this._instances = Util.array.removeByItem(this._instances, instance);
				instance.attr('title', 'disconnected from context.' + this.id());
				return this;
			},
			
			// finds
			all: function() {
				return this._instances;
			},
			find: function(name) {			
				var result;
				this.each(function(cmp) {
					if( cmp.name() === name ) {
						result = cmp;
						return false;
					}
				});

				return result;
			},
			finds: function(name) {
				var result = [];
				var self = this;
				this.each(function(cmp) {
					if( cmp.name() === name ) {
						result.push(cmp);
					}
				});

				return result;
			},
			findsAll: function() {
				var result = [];
				this.each(function(cmp) {
					result.push(cmp);
				});
				return result;
			},
			each: function(fn, scope) {
				if( typeof(fn) !== 'function' ) throw new Error('illegal arguments. fn must be a function:' + fn);
				var scope = scope || this;
				
				var instances = this.all().slice();
				for( var i=0; i < instances.length; i++ ) {
					var cmp = instances[i];

					if( fn.call(scope, cmp) === false ) return false;
				}

				return true;
			},
			
			// routes
			route: function(rule, fn, scope) {
				if( !this._routes ) this._routes = {};
				if( arguments.length <= 1 ) return this._routes[rule];

				if( typeof(rule) !== 'string' ) throw new Error('invalid route rule(string)[' + rult + ']:' + fn);
				if( typeof(fn) !== 'boolean' && typeof(fn) !== 'function' ) throw new Error('invalid route listener(function or boolean)[' + rult + ']:' + fn);
				
				var context = this;

				// fn 이 false 이거나 이미 기존 rule 이 있었다면 기존 라우트 삭제.
				if( fn === false || this._routes[rule] ) {
					// delete route
					fn = this._routes[rule];
					if( fn ) {
						var cmpname = rule.substring(0, rule.indexOf('.'));
						var action = rule.substring(rule.indexOf('.') + 1);
						if( cmpname && action ) {
							var cmps = context.finds(cmpname);
							if( cmps ) {
								for(var i=0; i < cmps.length; i++) {
									var cmp = cmps[i];
									cmp.un(action, (fn.proxy || fn));
								}
							}
						}

						this._routes[rule] = null;
						try { delete this._routes[rule]; } catch(e) {}
					}

					return this;
				}
				
				if( typeof(fn) === 'function' ) {
					// append route
					this._routes[rule] = fn;

					var cmpname = rule.substring(0, rule.indexOf('.'));
					var action = rule.substring(rule.indexOf('.') + 1);
					if( cmpname && action ) {
						var cmps = context.finds(cmpname);
						if( cmps ) {
							for(var i=0; i < cmps.length; i++) {
								var cmp = cmps[i];
								if( scope === 'component' ) {
									cmp.on(action, fn);
									continue;
								}

								scope = scope || this;
								if( scope === 'el' ) scope = cmp.el;

								var proxy = (function(fn) {
									return function(e) {
										fn.call(scope, e);
									};
								})(fn);
								fn.proxy = fn;
								cmp.on(action, proxy);
							}
						}
					}
				}

				return this;
			},
			routes: function(o, scope, appendmode) {
				if( !this._routes ) this._routes = {};
				if( !arguments.length ) return this._routes;
				
				if( typeof(o) !== 'object' ) throw new Error('invalid routes(object):' + o);
				
				var context = this;
				var routes = this._routes;

				// remove events from previous router
				if( !appendmode ) {
					for(var k in routes) {
						context.route(k, false);
					}
				}

				// bind new router's events
				for(var k in o) {
					var fn = o[k];
					if( k.indexOf('.') && typeof(fn) === 'function' ) {
						context.route(k, fn, scope);
					}
				}

				return this;
			},
			
			// theme & components
			components: function(cmps) {
				if( !arguments.length ) return this._cmps;

				if( typeof(cmps) !== 'object' ) return this;

				for(var k in cmps) {
					var cmp = cmps[k];
					if( cmp ) this.component(k, cmp);
				}

				return this;
			},
			theme: function(name) {
				if( !this._themes ) this._themes = {};

				var themes = this._themes;
				var theme = themes[name];
				if( !theme ) theme = themes[name] = new UI.Theme(this, name);				
				
				return theme;
			},
			themes: function() {
				if( !this._themes ) this._themes = {};
				return this._themes;
			},
			stylesheet: function() {
				if( !this._stylesheet ) this._stylesheet = new StyleSheetManager('attrs.ui.' + this.id() + '.instances');
				return this._stylesheet;
			},
			component: function(name, cls, style) {
				if( typeof(name) !== 'string' ) return console.error('illegal component name:', name, cls);			
				if( arguments.length === 1 ) {
					var cmp = this._cmps[name.split('.').join('_')];
					if( !cmp && this.parent() ) return this.parent().component(name);
					return cmp;
				}

				name = name.split('.').join('_');
				
				if( typeof(cls) === 'string' ) {
					try {
						cls = require(cls);
					} catch(err) {
						console.error('[WARN] remote component load fail', cls);
						return this;
					}
				}

				if( typeof(cls) !== 'function' ) return console.error('[WARN] invalid component class', name, cls);

				if( UI.ModuleConcrete ) {
					if( cls instanceof UI.ModuleConcrete ) cls = cls.component();

					if( !(cls && cls.prototype && cls.prototype instanceof UI.UIObject) ) {
						cls = new UI.ModuleConcrete({
							context: this,
							controller: cls
						}).component();
					}
				}

				if( !(cls && cls.prototype && cls.prototype instanceof UI.UIObject) ) return console.error('[WARN] invalid component class', name, cls);
				
				cls = cls.clone();
				
				var c = cls;
				var inherits = [];
				for(;c = c.inherits;) {
					var a = (c && c.cmpname);
					if(a) inherits.push(a);
				}
				inherits = inherits.reverse();
				inherits.push(name);

				cls.cmpname = name;
				cls.accessor = inherits.join(' ');

				var self = this;
				cls.context = function() {
					return self;
				};
				cls.theme = function(themeId) {
					return self.theme(themeId).component(name);
				};

				if( this._cmps[name] ) return console.error('[WARN] already exists component name', name, cls);
				else this._cmps[name] = cls;

				
				if( cls.style ) this.theme().component(name).reset(style || cls.style);
			
				if( UI.debug ) console.info('component registerd', 'context:[' + this.id() + ']', 'name:[' + cls.cmpname + ']', 'accessor:[' + cls.accessor + ']', cls.name);

				return cls;
			},
			build: function(source) {
				if( !source ) return console.error('source was null', source);
				if( source instanceof UI.UIObject ) return source;

				//if( parent && !(parent instanceof UI.UIObject) ) return console.error('[ERROR] invalid parent component', parent);
				//var context = (parent && parent.context()) || UI.context();
				var context;
								
				var cls;		
				if( typeof(source) === 'string' ) {
					var path = this.path(source);				
					var source = Require.sync(path);

					if( typeof(source) === 'function' ) {
						cls = new UI.ModuleConcrete({
							src: path,
							context: this,
							controller: source
						}).component();
						context = this.createNew(path);
					} else if( typeof(source) === 'object' && typeof(source.component) === 'string' ) {
						cls = this.component(source.component);
						context = this.createNew(path);
					} else {
						return console.error('[ERROR] invalid remote source(path:' + path + ')', source);
					}
				} else if( source.component == 'module' ) {
					var src = (source.src) ? this.path(source.src) : source.controller;
					cls = new UI.ModuleConcrete(src).component();
				} else {
					cls = this.component(source.component);
				}

				if( !cls ) return console.error('[ERROR] not exists component [' + source.component + ']');

				var options = {};
				for(var k in source) {
					if( source.component == 'module' && (k == 'src' || k == 'controller') ) continue;
					if( source.hasOwnProperty(k) && k !== 'component' ) options[k] = source[k];
				}
				
				if( options.context === true ) context = this.createNew(this.origin());
				options.context = context || this;				
				return new cls(options);
			},
			destroy: function() {
				var origin = this.origin();
				var id = this.id();
				for(var k in this) {
					var v = this[k];
					this[k] = null;
					try { delete this[k]; } catch(e) {}
					if( typeof(v) === 'function' ) this[k] = function() {throw new Error('context [' + id + ':' + origin + '] destroyed.');};
				}
			}
		};

		Context.getContext = function(instance) {
			return instances.get(instance) || UI.context();
		};
		
		return Context = Class.inherit(Context);
	})();


	// define local context class
	UI.LocalContext = (function() {
		function LocalContext() {
			this.$super(location.href);
			this._id = 'local';
			this._accessor = '';
			this._parent = null;
		}

		LocalContext.prototype = {
		};
		
		return LocalContext = Class.inherit(LocalContext, UI.Context);
	})();

	// export local context
	var localContext = new UI.LocalContext();
	UI.context = function() {
		return localContext;
	};

	UI.component = function(name, cls) {
		return localContext.component(name, cls);
	};

	UI.components = function(o) {
		return localContext.components(o);
	};

	UI.build = function(source, parent) {
		return localContext.build(source, parent);
	};
})();
// EOF of UI.Context.js [attrs.ui-0.6.0]

// UI.Component.js [attrs.ui-0.6.0]
UI.Component = (function() { 
	"use strict"

	var DOM_EVENTS = [
		'click', 'dblclick', 'contextmenu', 'blur', 'focus', 
		'tap', 'dbltap', 'shorttap', 'longtap',
		'touchstart', 'touchmove', 'touchend', 'touchstop',
		'mouseup', 'mousedown', 'mouseover', 'mousemove', 'mouseout', 'mouseout',
		'keyup', 'keydown', 'mousewheel','orientationchange',
		'drag', 'dragstart', 'drop', 'dragover', 
		'swipeleft', 'swiperight',
		'staged', 'unstaged',
		'transition.start', 'transition.stop', 'transition.end',
		'attach', 'attached', 'detach', 'detached'
	];
	
	var seq = 100;
	
	
	// privates
	function makeup() {
		var o = this.options;
		var cls = this.constructor;

		if( o.debug ) this.debug = true;

		// create el
		if( !this.el ) this.el = $.create((o.tag || cls.tag || 'div'), o.attrs);
		else this.el.clear();
		
		// setup el
		var el = this.el.data('component', this);
		
		// confirm event scope
		var events = o.e || o.events;
		var scope = (events && events.scope) || this;
		if( scope == 'el' ) scope = el;
		else if( scope == 'element' ) scope = el[0];

		// bind event in options
		var dispatcher = this._dispatcher = new EventDispatcher(this, {
			source: (o.e && o.e.source) || this,
			scope: scope
		});

		for(var k in events) {
			var fn = events[k];
			if( typeof(fn) === 'function' ) this.on(k, fn);
		}
		
		// setup context & name
		if( o.name ) this.name(o.name);
		if( o.context ) this.context(o.context);
		this.classes(o.classes);
		if( o.origin ) this.origin(o.origin);

		// setup status
		if( o.hidden ) el.style('display', 'none');
		if( o.movable ) el.movable(o.movable);
		if( o.enable ) this.enable(o.enable);

		// setup style & dom
		if( o.style ) this.style(o.style);
		if( o.css ) this.css(o.css);
		if( o.theme ) this.theme(o.theme);
		if( o.abs ) this.abs(o.abs);
		if( o.html ) this.html(o.html);

		// href
		if( o.href ) this.href(o.href);
		
		// bg 와 width height font 에 대해서는 편의적 메소드를 제공하기로...
		if( o.bg || o.background ) el.bg(o.bg || o.background);
		if( o.color ) el.color(o.color);
		if( o.flex ) el.flex(o.flex);
		if( o['float'] ) this['float'](o['float']);
		if( o.font ) el.font(o.font);
		if( o.margin ) el.margin(o.margin);
		if( o.padding ) el.padding(o.padding);
		if( o.border ) el.border(o.border);
		if( o.width || o.width === 0 ) el.width(o.width);
		if( o.minWidth || o.minWidth === 0 ) el.minWidth(o.minWidth);
		if( o.maxWidth || o.maxWidth === 0 ) el.maxWidth(o.maxWidth);
		if( o.height || o.height === 0 ) el.height(o.height);
		if( o.minHeight || o.minHeight === 0 ) el.minHeight(o.minHeight);
		if( o.maxHeight || o.maxHeight === 0 ) el.maxHeight(o.maxHeight);

		if( o.fit ) el.ac('fit');		

		// setup effects options
		if( o.effects ) this.effects(o.effects);
		
		// invoke class's build & options build
		if( typeof(o.before) === 'function' ) o.before.call(this);
		if( typeof(this.build) === 'function' ) this.build();
		if( typeof(o.build) === 'function' ) o.build.call(this);
		if( typeof(o.after) === 'function' ) o.after.call(this);

		// block build method
		this.build = function() { throw new Error('illegal access'); };
	}
	

	// class Component
	function Component(options) {
		this.options = new Options(options);
		makeup.call(this);
	}

	Component.prototype = {
		id: function(id) {
			if( !arguments.length ) return this.el.attr('id');
			this.el.attr('id', id);
			return this;
		},
		title: function(title) {
			if( !arguments.length ) return this.el.attr('title');
			this.el.attr('title', title);
			return this;
		},
		origin: function() {
			return this.context().origin();
		},
		base: function() {
			return this.context().base();
		},
		path: function(src) {
			return this.context().path(src);
		},
		context: function(context) {
			if( !arguments.length ) return this._context || UI.context();

			//if( context === true ) context = new UI.Context(this.origin());

			if( context === false ) {
				if( this._context ) this._context.remove(this);
				this._context = null;
			} else if( context instanceof UI.Context ) {
				context.add(this);
				this._context = context;
			} else {
				console.error('[ERROR] invalid context', context);
				throw new Error('invalid context:' + context);
			}
			
			this.classes(true);

			return this;
		},
		name: function(name) {
			if( !arguments.length ) return this._name;
			if( typeof(name) !== 'string' ) {
				console.error('WARN:illegal component.name(string)', name);
				return this;
			}
			
			var previous = this._name;
			this._name = name;
			this.el.attr('name', name);
			this.fireSync('renamed', {previous: previous, name: name});

			return this;
		},
		rebuild: function() {
			makeup.call(this);
			this.fire('rebuilt');
			return this;
		},
		parent: function() {
			return this._parent;
		},
		detach: function() {
			var parent = this.parent();
			if( parent ) {
				if( parent.disconnect(this) ) {
					this.el.detach();
				} else {
					console.log('detach refused by ', target);
					throw new Error('cannot detach from target');
				}
			} else {
				this.el.detach();
			}

			return this;
		},
		attachTo: function(target, index) {
			if( !target ) return this;

			var origin = target;

			if( EL.isElement(target) || typeof(target) === 'string' ) target = $(target) || target;

			if( typeof(target) === 'string' ) {
				var context = this.context();

				if( context ) {
					target = context.find(target) || target;
				}
			}

			if( target instanceof UI.Attachable ) {
				if( target.attachTarget() && target.connect(this) ) {
					target.attachTarget().attach(this.el, index);
				} else {
					console.log('attach refused by ', target);
					throw new Error('cannot attach to target');
				}
			} else if( target instanceof EL ) {
				target.attach(this.el, index);
			} else {
				console.error('invalid target', origin);
				throw new Error('invalid target(available only Element or EL or UI.Attachable)');
			}

			return this;
		},

		// dom control
		accessor: function() {
			var cls = this.constructor;
			var accessor;
			if( cls.accessor ) {
				accessor = cls.accessor;
			} else {
				for(var c = cls;c = c.inherits;) {
					accessor = (c && c.accessor);
					if( accessor ) break;
				}
			}
			
			this.context().theme(this.theme()).accessor().split('.')
			
		},
		classes: function(classes) {
			if( !arguments.length ) return this._classes || '';
			
			if( typeof(classes) !== 'string' ) {
				console.error('[WARN] illegal component classes', classes);
				return this;
			}
			
			if( classes === true ) classes = this._classes;
			
			classes = this._classes = classes.trim().split('-').join('_');
			
			var el = this.el;
			var cls = this.constructor;

			if( !arguments.length ) return el.classes();
			
			var accessor;
			if( cls.accessor ) {
				accessor = cls.accessor;
			} else {
				for(var c = cls;c = c.inherits;) {
					accessor = (c && c.accessor);
					if( accessor ) break;
				}
			}
			
			el.classes('');
			el.ac(this.context().theme(this.theme()).accessor().split('.'));
			el.ac(accessor);
			if( typeof(classes) === 'string' ) el.ac(classes);
			return this;
		},
		attr: function() {
			this.el.attr.apply(this.el, arguments);
			return this;
		},		
		theme: function(theme) {
			if( !arguments.length ) return this._theme || '';

			if( typeof(theme) === 'string' ) this._theme = theme;
			else return console.error('invalid theme name', theme);

			this.classes(true);

			return this;
		},
		style: function(key, value) {
			if( !arguments.length ) return this.el.style();
			if( arguments.length === 1 && typeof(key) === 'string' ) return this.el.style(key);

			this.el.style.apply(this.el, arguments);
			return this;
		},
		css: function(css) {
			var el = this.el;
			var id = el.id();
			var stylesheet = this.context().stylesheet();


			if( !arguments.length ) return id ? stylesheet.get('#' + id) : null;	
			
			if( typeof(css) === 'object' ) {
				id = id || ('gen-' + (this.constructor.cmpname || 'nemo') + '-' + (seq++));
				el.id(id);
				stylesheet.update('#' + id, css);
				if( css.debug ) console.log('#' + id, stylesheet.build());
			} else if( css === false ) {				
				if( id ) {
					el.id(false);
					stylesheet.remove(id);
				}
			} else {
				console.warn('invalid css', css);
			}

			return this;
		},
		abs: function(abs) {
			var el = this.el;
			if( !arguments.length ) return el.hc('abs');
			
			el.rc('abs').rc('top').rc('right').rc('left').rc('bottom');

			if( abs !== false ) {
				this.el.ac('abs');
			}
			
			if( typeof(abs) === 'string' ) {
				if( ~abs.indexOf('top') ) el.ac('top');
				if( ~abs.indexOf('left') ) el.ac('left');
				if( ~abs.indexOf('right') ) el.ac('right');
				if( ~abs.indexOf('bottom') ) el.ac('bottom');
			}

			return this;
		},
		html: function(html) {
			if( !arguments.length ) return this.el.html();			
			if( typeof(html) === 'string' ) this.el.html(html);
			return this;
		},
		show: function(options, fn) {
			this.el.show(options, fn);
			return this;
		},
		hide: function(options, fn) {
			this.el.hide(options, fn);
			return this;
		},
		anim: function(options, scope) {
			return this.el.anim(options, scope || this);
		},
		effect: function(type, options) {
			var listeners = this._effect_listeners;
			if( !listeners ) listeners = this._effect_listeners = {};

			if( !arguments.length ) return console.error('[WARN] illegal parameters', type, options);
			if( arguments.length === 1 ) return this._animation_listeners[type];

			if( options === false ) {
				listeners[type] = null;
				try { delete listeners[type] } catch(e) {}
			}

			if( typeof(options) !== 'object' ) return console.error('[WARN] invalid animation options', options);
			var fn = (function(options) {
				return function(e) {
					this.el.anim().chain(options).run();
				};
			})(options);
			listeners[type] = fn;
			this.on(type, fn);

			return true;
		},
		effects: function(effects) {
			for(var type in effects) {
				this.effect(type, effects[type]);
			}
			return true;
		},
		disable: function(b) {
			this.enable(b === false ? true : false);
		},
		enable: function(b) {
			var el = this.el;
			if( b === false ) {
				if( !el.hc('disabled') ) {
					el.ac('disabled');
					this.fire('disabled');
				}
			} else {
				if( el.hc('disabled') ) {
					el.rc('disabled');
					this.fire('enabled');
				}
			}

			return this;
		},
		boundary: function() {
			return this.el.boundary();
		},
		data: function(key, value) {
			var data = this._data;
			if( !arguments.length ) return data;
			else if( arguments.length == 1 ) return data && data[k];

			if( !data ) data = this._data = {};
			data[key] = value;
			return this;
		},

		// href
		action: function(href) {
			if( !href ) return false;

			var href = href.trim();
			if( href.toLowerCase().startsWith('javascript:') ) {
				var script = href.substring(11);
				var self = this;
				(function() {
					var context = self.context();
					var module = (context) ? context.origin() : null;
					var o = eval(script);
					if( o ) console.log('href script call has result', o);
				})();
			} else if( href.startsWith('this:') ) {
				var path = href.substring(5);
				var context = self.context();
				if( context ) url = context.path(path);
				location.href = path;
			} else {
				location.href = href;
			}

			return true;
		},
		href: function(href) {
			if( !arguments.length ) return this._href;

			this._href = href;
			if( this._hrefhandler ) this.un('click', this._hrefhandler);
			
			if( href && typeof(href) === 'string' ) {
				var self = this;
				this._hrefhandler = function(e) {
					self.action.call(self, self._href);
				};
				this.on('click', this._hrefhandler);
				this.el.ac('clickable');
			} else {
				this.el.rc('clickable');
				this._href = null;
				try { delete this._href; } catch(e) {}
			}

			return this;
		},

		// event handle
		on: function(action, fn, bubble) {
			if( typeof(action) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', action, fn, bubble);
			
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is displatcher?');
			
			// if action is dom element event type, binding events to dom element
			if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action === '*' || action === 'dom.*' ) {
				var type = action.startsWith('dom.') ? action.substring(4) : action;
				var self = this;
				var proxy = function(e) {
					return fn.call(self, e);
				};
				fn.proxy = proxy;
				this.el.on(type, proxy, bubble);
				if( action !== '*' ) return this;
			}
	
			dispatcher.on.apply(dispatcher, arguments);
			return this;
		},
		un: function(action, fn, bubble) {
			if( typeof(action) !== 'string' || typeof(fn) !== 'function') return console.error('[ERROR] invalid event parameter', action, fn, bubble);
	
			var dispatcher = this._dispatcher;
			if( !dispatcher ) return console.error('[ERROR] where is displatcher?');

			if( ~DOM_EVENTS.indexOf(action) || action.startsWith('dom.') || action == '*' || action == 'el.*' ) {
				var type = action.startsWith('dom.') ? action.substring(4) : action;
				this.el.un(type, fn.proxy || fn, bubble);
				if( action !== '*' ) return this;
			}

			dispatcher.un.apply(dispatcher, arguments);
			return this;
		},
		fireSync: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fireSync.apply(d, arguments);
		},
		fire: function() {
			var d = this._dispatcher;
			if( !d ) return;
			return d.fire.apply(d, arguments);
		},
		toJSON: function() {
			var o = this.options.toJSON();

			var json = {
				component: this.constructor.namespace
			};

			for(var k in o) {
				if( o.hasOwnProperty(k) ) json[k] = o[k];
			}

			return json;
		},
		destroy: function() {
			this.detach();
			var ns = this.constructor.namespace;
			var name = this.name() || '(unknown)';
			var context = this.context();
			if( context ) context.disconnect(this);
			this.el.clear();
			for(var k in this) {
				if( this.hasOwnProperty(k) ) continue;
				var v = this[k];
				this[k] = null;
				try { delete this[k]; } catch(e) {}
				if( typeof(v) === 'function' ) this[k] = function() {throw new Error(ns + ' component [' + name + '] was destroyed.');};
			}
		}
	};
	
	Component.style = {
		'user-select': 'none',
		'box-sizing': 'border-box',
		'margin': 0,
		'padding': 0,

		'*': {
			'box-sizing': 'border-box',
			'margin': 0,
			'padding': 0
		},
		'::selection': {
			'background-color': '#cc3c09',
			'color': '#fff',
			'text-shadow': 'none'
		},

		// classes
		'..fit': {
			'position': 'absolute !important',
			'top': 0,
			'left': 0,
			'right': 0,
			'bottom': 0,
			'overflow': 'hidden'
		},
		'..abs': {
			'position': 'absolute !important'
		},
		'..abs.h': {
			'width': '100%'
		},
		'..abs.v': {
			'height': '100%'
		},
		'..abs.top': {
			'left': '0',
			'top': '0'
		},
		'..abs.left': {
			'top': '0',
			'left': '0'
		},
		'..abs.right': {
			'top': '0',
			'right': '0'
		},
		'..abs.bottom': {
			'left': '0',
			'bottom': '0'
		},		
		'..fixed': {
			'position': 'absolute !important'
		},
		'..fixed.h': {
			'width': '100%'
		},
		'..fixed.v': {
			'height': '100%'
		},
		'..fixed.top': {
			'left': '0',
			'top': '0'
		},
		'..fixed.left': {
			'top': '0',
			'left': '0'
		},
		'..fixed.right': {
			'top': '0',
			'right': '0'
		},
		'..fixed.bottom': {
			'left': '0',
			'bottom': '0'
		},
		'..border': {
			'border': '1px solid rgba(255,255,255, 0.1)'
		},
		'..boxshadow': {
			'box-shadow': '0 0 5px rgba(25,25,25,0.3)'
		},
		'..round': {
			'border-radius': 5
		},
		'..glass': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 50%)',
			'border-top': '1px solid rgba(255, 255, 255, 0.4)',
			'border-bottom': '1px solid rgba(0, 0, 0, 0.3)'
		},
		'..pad': {
			'margin': 5,
			'padding': 5
		},
		'..innerpad': {
			'padding': 5
		},
		'..outerpad': {
			'margin': 5
		},
		'..clickable': {
			'cursor': ['hand', 'pointer']
		},
		'..bg-stripe': {
			'background-image': 'url(data:image/gif;base64,R0lGODlhBwABAKIAAAAAAP///8G2pMzDtP///wAAAAAAAAAAACH5BAEAAAQALAAAAAAHAAEAAAMEKKozCQA7)'
		},
		'..bg-transparent': {
			'background-color': 'white',
			'background-image': 'url(data:image/gif;base64,R0lGODlhAgACAJEAAAAAAP///8DAwP///yH5BAEAAAMALAAAAAACAAIAAAID1CYFADs=)',
			'background-size': '16px'
		}
	};

	return Component = UI.inherit(Component, UI.UIObject, false);
})();

UI.Component = UI.component('x', UI.Component);

// EOF of UI.Component.js [attrs.ui-0.6.0]

// UI.Container.js [attrs.ui-0.6.0]
UI.Container = (function() {
	"use strict"

	var remove = Util.array.removeByItem;
	var Component = UI.Component;

	// class container
	function Container(options) {
		this._items = [];
		this.$super(options);
	}

	Container.prototype = {
		build: function() {
			var self = this;
			var o = this.options;
			var fn = function() {
				self.items(o.items || o.item || o.src);
				self.mark();
			};

			if( o.async === true ) {
				setTimeout(function() {
					fn();
				}, 5);
			} else {
				fn();
			}
		},
		add: function(item, index) {
			if( !item ) return this;
			
			var items = item;
			if( !Array.isArray(items) ) items = [items];
			
			if( index && typeof(index) !== 'number' ) index = this.indexOf(index);
			
			if( index <= 0 ) index = 0;
			else if( index >= this._items.length ) index = this.length() - 1;
			else index = -1;

			if( items ) {
				for(var i=0; i < items.length; i++) {
					var item = items[i];

					if( !item && item !== 0 ) continue;
					
					// evaluation for available to add
					var e = this.fireSync('add', {
						cancelable: true,
						item: item,
						index: ((index === -1) ? this.length() - 1 : index + 1)
					});
					item = e.item;
					
					// if event prevented or item replaced to null, bypass
					if( e.eventPrevented || item === null || item === undefined ) continue;
					
					// if item maybe meta component, build it
					if( typeof(item) == 'string' || (!(item instanceof UI.UIObject) && typeof(item.component) === 'string') ) {
						item = this.context().build(item);
						if( !(item instanceof UI.UIObject) ) continue;
					}
					

					if( !item._context ) item.context(this.context());

					//console.log('this.context', this.name(), this.context().id());
					//console.log('item.context', item.name(), item.context().id());
										
					if( index === -1 ) {
						this._items.push(item);
					} else {
						var at = index++;
						this._items.splice(at, 0, item);
					}

					e = this.fireSync('added', {item:item, index:this.indexOf(item)});
				}
			}

			return this;
		},
		remove: function(index) {
			var item = this.get(index);

			if( !item ) return;
			
			remove(this._items, item);
			this.fireSync('removed', {item:item});

			return this;
		},
		removeAll: function() {
			var items = this._items.slice();
			for(var i=items.length; i >= 0;i--) {
				this.remove(i);
			}

			this.fireSync('removedAll');
			return this;
		},
		items: function(items) {
			if( !arguments.length ) return this._items.slice();
			if( typeof(items) === 'number' ) return this.get(items);

			this.removeAll();
			this._source = items;
			if( items || items === 0 ) this.add(items);
			return this;
		},
		mark: function(name, flag) {
			if( !arguments.length ) name = 'initial';
			
			if( !this._marks ) this._marks = {};
			if( flag !== false ) {
				this._marks[name] = this._source || false;
			} else {
				this._marks[name] = null;
				try {
					delete this._marks[name];
				} catch(e) {}				
			}

			return this;
		},
		source: function() {
			return this._source;
		},
		restore: function(mark) {
			if( !this._marks ) return false;
			var source = ( !arguments.length ) ? this._marks['initial'] : this._marks[mark];			
			if( source || source === false ) this.items(source);
			return true;
		},
		get: function(index) {
			if( typeof(index) === 'number' ) return this._items[index];
			index = this._items.indexOf(index);
			if( index >= 0 ) return this._items[index];
			return null;
		},
		contains: function(item) {
			return this._items.contains(item);
		},
		length: function() {
			return this._items.length;
		},
		indexOf: function(item) {
			return this._items.indexOf(item);
		}
	};

	return Container = UI.inherit(Container, UI.Component, false);
})();

// EOF of UI.Container.js [attrs.ui-0.6.0]

// UI.Attachable.js [attrs.ui-0.6.0]
UI.Attachable = (function() {
	"use strict"

	var remove = Util.array.removeByItem;
	var Component = UI.Component;

	// class container
	function Attachable(options) {
		this._cmps = [];
		this.$super(options);
	}

	Attachable.prototype = {
		visit: function(fn, scope) {
			if( typeof(fn) !== 'function' ) throw new Error('illegal arguments. fn must be a function:' + fn);
			var scope = scope || this;

			var currentContext = this.context();
			var propagation = function(cmp) {
				if( cmp instanceof UI.Attachable ) {
					var children = children = cmp.children();
					if( children ) {
						for(var i=0; i < children.length;i++) {
							var child = children[i];
							if( fn.call(scope, child) === false ) return false;
							
							if( child._context && child._context !== currentContext ) continue;
								
							propagation(child);
						}
					}
				}
			};

			if( fn.call(scope, this) === false ) return false;
			propagation(this);

			return true;
		},
		find: function(name) {			
			var result;
			this.visit(function(cmp) {
				if( cmp.name() === name ) {
					result = cmp;
					return false;
				}
			});

			return result;
		},
		finds: function(name) {
			var result = [];
			var self = this;
			this.visit(function(cmp) {
				if( cmp.name() === name ) {
					result.push(cmp);
				}
			});

			return result;
		},
		findsAll: function() {
			var result = [];
			this.visit(function(cmp) {
				result.push(cmp);
			});
			return result;
		},

		// set attach target
		attachTarget: function(target) {
			if( !arguments.length ) return this._attach_target || ((this._attach_target === false) ? false : this.el);

			if( target instanceof EL ) {
				this._attach_target = target;
			} else if( EL.isElement(target) ) {
				this._attach_target = new EL(target);
			} else if( target === false ) {
				this._attach_target = false;
			} else {
				console.error('WARN:illegal container attach target:', target);
			}

			return this;
		},
		
		// with component	
		connect: function(cmp) {
			if( !(cmp instanceof Component) ) {
				console.error('WARN:connect available with only Component:', cmp);
				return false;
			}

			if( ~this._cmps.indexOf(cmp) ) return true;
			
			var e = cmp.fireSync('connectTo', {parent:this,cancelable: true});
			if( e.eventPrevented ) return false;

			var e = this.fireSync('connect', {item:cmp,cancelable: true});
			if( e.eventPrevented ) return false;
			
			// disconnect from previous parent
			if( cmp.parent() && !cmp.parent().disconnect(cmp) ) return false;

			// connect
			this._cmps.push(cmp);
			cmp._parent = this;

			cmp.fireSync('connectedTo', {parent:this,cancelable: true});
			this.fireSync('connected', {item:cmp,cancelable: true});

			return true;
		},
		disconnect: function(cmp) {
			if( !(cmp instanceof Component) ) {
				console.error('WARN:connect available with only Component:', cmp);
				return false;
			}

			var e = cmp.fireSync('disconnectTo', {parent:this,cancelable: true});
			if( e.eventPrevented ) return false;
			
			var e = this.fireSync('disconnect', {item:cmp,cancelable: true});
			if( e.eventPrevented ) return false;

			remove(this._cmps, cmp);
			cmp._parent = null;

			cmp.fireSync('disconnectedTo', {parent:this,cancelable: true});
			this.fireSync('disconnected', {item:cmp,cancelable: true});

			return true;
		},
		children: function() {
			return this._cmps.slice();
		},
		connected: function() {
			return this._cmps.length;	
		}
	};

	return Attachable = UI.inherit(Attachable, UI.Container, false);
})();

// EOF of UI.Attachable.js [attrs.ui-0.6.0]

// UI.SelectableContainer.js [attrs.ui-0.6.0]
UI.SelectableContainer = (function() {
	"use strict"

	function SelectableContainer(options) {
		this._selected = [];
		this.$super(options);
		this.selectable(options.selectable);
	}
	
	SelectableContainer.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected.push(item);

			this.fireSync('selected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selectable: function(selectable) {
			if( !arguments.length ) return (this._selectable === false) ? false : true;
			if( selectable === false ) this._selectable = false;
			return this;
		},
		deselect: function(index) {
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;
			
			var e = this.fireSync('deselect', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;
			
			if( !this.selected(item) ) return false;

			this._selected.remove(item);

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(item) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			var index = this.indexOf(item);

			return ~this._selected.indexOf(item);
		}
	};
	
	return SelectableContainer = UI.inherit(SelectableContainer, UI.Attachable, false);
})();

// EOF of UI.SelectableContainer.js [attrs.ui-0.6.0]

// UI.SingleSelectableContainer.js [attrs.ui-0.6.0]
UI.SingleSelectableContainer = (function() {
	"use strict"

	function SingleSelectableContainer(options) {
		this.$super(options);
		this.selectable(options.selectable);
	}
	
	SingleSelectableContainer.prototype = {
		select: function(index) {
			if( !this.selectable() ) return false;
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;

			if( this.selected() === item ) return false;
			if( this.selected() ) this.deselect(this.selected());

			var e = this.fireSync('select', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;

			if( this.selected(item) ) return false;

			this._selected = item;

			this.fireSync('selected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selectable: function(selectable) {
			if( !arguments.length ) return (this._selectable === false) ? false : true;
			if( selectable === false ) this._selectable = false;
			return this;
		},
		deselect: function(index) {
			var item = this.get(index);
			index = this.indexOf(item);

			if( !item ) return false;
			
			var e = this.fireSync('deselect', {cancelable: true, item:item, index:index});
			if( e.eventPrevented ) return false;
			
			if( !this.selected(item) ) return false;

			this._selected = null;

			this.fireSync('deselected', {
				item: e.item,
				index: e.index
			});

			return true;
		},
		selected: function(index) {
			if( !arguments.length ) return this._selected;

			var item = this.get(index);
			index = this.indexOf(item);

			return (this._selected === item);
		},
		selectedIndex: function(item) {
			if( !this._selected ) return -1;
			return this.indexOf(this._selected);
		},
		prev: function() {
			var i = this.selectedIndex();
			if( i > 0 ) return this.select(i--);
			return false;
		},
		next: function() {
			var i = this.selectedIndex();
			if( i >= 0 && i < (this.length() - 1) ) return this.select(i++);
			return false;
		},
		first: function() {
			return this.select(0);
		},
		last: function() {
			return this.select(this.length());
		}
	};

	return SingleSelectableContainer = UI.inherit(SingleSelectableContainer, UI.Attachable, false);
})();

// EOF of UI.SingleSelectableContainer.js [attrs.ui-0.6.0]

// UI.Module.js [attrs.ui-0.6.0]
UI.Module = (function() {
	function Module(options) {
		//if( !options.context ) options.context = true;
		this.$super(options);
	}

	Module.prototype = {
		build: function() {
			// bind events
			this.on('add', function(e) {
				//if( !(e.item instanceof UI.Component) ) return false;
				if( e.item === '-' ) e.item = new UI.HTML({flex:1});
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			// processing options
			var o = this.options;
			if( o.routes ) this.routes(o.routes);
			if( o.components ) this.components(o.components);

			this.$super();
		},		
		components: function(map) {
			if( !arguments.length ) return this.context().components();
			this.context().components(map);
			return this;
		},
		component: function(name, cls, style) {
			if( arguments.length === 1 ) return this.context().components()[name];
			this.context().component(name, cls, style);
			return this;
		},
		routes: function(routes) {
			if( !arguments.length ) return this.context().routes();
			this.context().routes(routes);
			return this;
		}
	};

	Module.load = function(src) {
		return new UI.ModuleConcrete(src).component();		
	};
	
	Module.style = {
		position: 'relative'
	};
	
	return Module = UI.inherit(Module, UI.Attachable, false);
})();

UI.Module = UI.component('module', UI.Module);

UI.ModuleConcrete = (function() {
	"use strict"
	
	var seq = 100;

	var modules = {};

	// class UI
	function ModuleConcrete(options) {
		if( typeof(options) === 'function' || typeof(options) === 'string' ) options = {controller:options};
		if( typeof(options) !== 'object' ) throw new Error('illegal options(object)');
		
		var o = this.options = options;
		//this._context = o.context;

		var controller = o.controller;
		var src = o.src;
		if( typeof(controller) == 'string' ) {
			src = controller;
			controller = null;
		}
		
		if( src ) {
			src = this._src = Path.join(location.href, src);
			if( !controller ) controller = Require.sync(src, o.cache);
		}

		if( !controller ) console.error('[WARN] empty controller', controller);
		
		
 
		var concrete = this;
		// -- define concrete class ---------------------------------------------------------
		function $Module(options) {
			options = options || {};
			//options.context = new UI.Context(concrete);

			this.$super(options);			
			
			var origin = concrete.src();
			if( origin ) this.origin(origin);
			
			if( controller ) {
				var type = typeof(controller);
				if( type == 'function' ) controller.call(this, options);
				else if( type == 'object' && controller.build ) controller.build.call(this);
			}
		}

		$Module.prototype = {
			concrete: function() {
				return concrete;
			}
		};

		// bind contoller prototype functions
		if( controller && controller.prototype ) {
			for( var k in controller.prototype ) {
				//if( UI.debug && ($Module.prototype[k] || UI.Module.prototype[k]) ) console.error('[INFO] conflict Module method "' + k + '". it will be overriding.', this.src() || '(local)');
				$Module.prototype[k] = controller.prototype[k];
			}
		}

		$Module.concrete = function() {
			return concrete;
		};

		this._class = $Module = UI.inherit($Module, UI.Module);
	}

	ModuleConcrete.prototype = {
		/*context: function() {
			return this._context || UI.context();
		},*/
		component: function() {
			return this._class;
		},
		original: function() {
			return this._controller;
		},
		createNew: function(options) {
			var cls = this._concrete;
			if( !cls ) return null;
				
			var instance = new cls(options);

			return instance;
		},
		src: function() {
			return this._src;
		},
		path: function(path) {
			if( !path || typeof(path) !== 'string' ) return null;
			var base = this.base() || Path.dir(location.href);
			return Path.join(base, path);
		},
		base: function(base) {
			return Path.dir(this._src || location.href);
		}
	};

	ModuleConcrete.modules = function() {
		return modules;
	};

	return ModuleConcrete;
})();

// EOF of UI.Module.js [attrs.ui-0.6.0]

// UI.Block.js [attrs.ui-0.6.0]
UI.Block = (function() {
	"use strict"

	// class Block
	function Block(options) {
		this.$super(options);
	}

	Block.prototype = {
		build: function() {
			var self = this;

			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});
			
			// call super's build
			this.$super();
		}
	};

	Block.style = {
		'position': 'relative'
	};

	return Block = UI.inherit(Block, UI.Attachable);
})();

UI.Block = UI.component('block', UI.Block);
// EOF of UI.Block.js [attrs.ui-0.6.0]

// UI.View.js [attrs.ui-0.6.0]
var View = (function() {
	"use strict"

	// class view
	function View(options) {
		this.$super(options);
	}

	View.prototype = {
		build: function() {
			var self = this;

			// process options
			var o = this.options;
			if( o.direction ) this.direction(o.direction);
			if( o.horizontal === true ) this.direction('horizontal');

			// bind events
			this.on('add', function(e) {
				if( e.item === '-' ) e.item = new UI.HTML({flex:1});
				
				//if( typeof(item) === 'string' ) e.item = new UI.Component({html:item});
				//if( !(item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});
			
			// call super's build
			this.$super();
		},
		direction: function(direction) {
			var el = this.el;

			if( !arguments.length ) return this.el.hc('horizontal') ? 'horizontal' : 'vertical';
			
			if( direction === 'horizontal' ) el.rc('vertical').ac('horizontal');
			else if( direction === 'vertical' )  el.ac('vertical').rc('horizontal');
			else return console.error('invalid direction', direction);

			this.fire('view.direction changed', {
				direction: (el.hc('horizontal') ? 'horizontal' : 'vertical')
			});

			return this;
		}
	};
	
	View.inherit = '';
	View.style = {
		'position': 'relative',
		'display': 'flex',
		'flex-direction': 'column',
		'align-content': 'stretch',
		
		'..horizontal': {
			'flex-direction': 'row'
		}
	};

	return View = UI.inherit(View, UI.Attachable);
})();

UI.View = UI.component('view', View);
// EOF of UI.View.js [attrs.ui-0.6.0]

// UI.Bar.js [attrs.ui-0.6.0]
var Bar = (function() {
	"use strict"

	function Bar(options) {
		if( options.cellborder !== false ) options.cellborder = true;
		if( options.vertical !== true ) options.horizontal = true;
		if( options.flexible !== false ) options.flexible = true;

		this.$super(options);
	}

	Bar.prototype = {
		build: function() {
			this.$super();
		}
	};

	Bar.style = {
		'min-width': 20,
		'min-height': 20
	};

	return Bar = UI.inherit(Bar, UI.View);
})();

UI.Bar = UI.component('bar', Bar);
// EOF of UI.Bar.js [attrs.ui-0.6.0]

// UI.CardView.js [attrs.ui-0.6.0]
var CardView = (function() {
	// class view
	function CardView(options) {
		this.$super(options);
	}

	CardView.prototype = {
		build: function() {
			var self = this;
			
			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.hide();
				e.item.attachTo(self);
				if( self.length() === 1 ) self.select(e.item);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.on('selected', function(e) {
				e.item.show();
			});

			this.on('deselected', function(e) {
				e.item.hide();
			});

			this.$super();
			
			var o = this.options;
			if( o.selected || o.selected === 0 ) {
				this.select(o.selected);
			}
		}
	};
	
	CardView.inherit = '';
	CardView.style = {
		'position': 'relative',
		'background-color': 'transparent',
		'overflow': 'hidden',
		'width': '100%',
		'height': '100%'
	};
	
	return CardView = UI.inherit(CardView, UI.SingleSelectableContainer);
})();

UI.CardView = UI.component('cardview', CardView);
// EOF of UI.CardView.js [attrs.ui-0.6.0]

// UI.StackView.js [attrs.ui-0.6.0]
var StackView = (function() {
	// class view
	function StackView(options) {
		this.$super(options);
	}

	StackView.prototype = {
		build: function() {
			var self = this;

			// create sub element 'box', all children will attach to box
			var boxel = this.boxel = this.el.create('<div></div>');
			
			// change attach target
			this.attachTarget(boxel);
			
			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {
				e.item.attachTo(self);
				if( self.length() === 1 ) self.select(e.item);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.$super();
		}
	};
	
	StackView.style = {
		'position': 'relative',
		'display': 'box',
		'box-orient': 'vertical',
		'overflow': 'hidden',
		'box-flex': 1,

		'> div': {
			'box-flex': 1,
			'display': 'box'
		},
		'> div > div': {			
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'top': '0',
			'left': '0'
		}
	};

	return StackView = UI.inherit(StackView, UI.Attachable);
})();

UI.StackView = UI.component('stackview', StackView);
// EOF of UI.StackView.js [attrs.ui-0.6.0]

// UI.GridView.js [attrs.ui-0.6.0]
UI.GridView = (function() {
	"use strict"

	function GridView(options) {
		this.$super(options);
	}

	GridView.prototype = {
		build: function() {
			this.attachTarget(false);

			var boxel = this.boxel = this.el.create('<table cellspacing="0" cellpadding="0"></table>');
			var tbody = boxel.create('<tbody></tbody>');
			var tr;

			// process options
			var o = this.options;
			this.cells(o.cells);

			// bind events
			this.on('add', function(e) {
				if( typeof(e.item) === 'string' ) e.item = new UI.Component({html:e.item});
				if( !(e.item instanceof UI.Component) ) return false;
			});

			this.on('added', function(e) {					
				var item = e.item;
				var cellconfig = item.options.cell || {};
				
				var cols = this.cols();
				var cells = this.cells();
				var height = cellconfig.height || cells.height;
				var align = cellconfig.align || cells.align;
				var bg = cellconfig.bg || cells.bg;
				var padding = cellconfig.padding || cells.padding;
				var valign = cellconfig.valign || cells.valign;
				var border = (cellconfig.border === false ) ? false : cellconfig.border || cells.border;
				if( typeof(border) !== 'boolean' ) border = true;
				
				var createRow = function() {
					var tr = tbody.create('<tr></tr>');
					for(var i=0; i < cols; i++) {
						tr.create('<td class="empty"></td>');
					}

					return tr;
				};

				if( !tr ) tr = createRow();
				var td = tr.find('.empty');
				if( td.length <= 0 ) tr = createRow();
				td = tr.find('.empty');

				var cellbody = td.create('<div class="cellbody"></div>');
				
				td.rc('empty').ac('active');
				if( padding ) td.style('padding', padding);
				if( height ) td.style('height', height);
				if( bg ) td.style('background', bg);
				if( valign ) td.style('vertical-align', valign);
				if( align ) {					
					if( align === 'center' ) cellbody.style('margin', '0 auto');
					else if( align === 'right' ) cellbody.style('float', 'right');
				}

				item.attachTo(cellbody);
				this.connect(item);
			});

			this.on('removed', function(e) {
				var item = e.item;
				var td = item.el.parent();
				var tr = td.parent();
				e.item.detach();
				td.detach();

				if( tr.count() <= 0 ) tr.detach();
			});

			this.$super();
		},
		cols: function(cols) {
			if( !arguments.length ) {
				var cols = this.cells().cols;
				if( cols <= 0 || typeof(cols) !== 'number' ) return 1;
				return cols;
			}
			
			var cells = this.cells();
			cells.cols = cols;
			this.cells(cells);
		},
		cells: function(cells) {
			if( !arguments.length ) return this._cells || {};

			if( typeof(cells) === 'number' ) cells = {col:cells};
			if( typeof(cells) !== 'object' ) return this;
			
			this._cells = cells;
			return this;
		}
	};
	
	GridView.style = {
		'> table': {
			'width': '100%',
			'table-layout': 'fixed',
			'border-style': 'none',
			'border-spacing': '0px',
			'padding': '0px',
			'background-color': 'transparent',
			'border': '1px solid #e5e6e7',
			
			'tbody > tr > td': {
				'box-sizing': 'border-box',
				'overflow': 'hidden',
				'vertical-align': 'top',
				'border-top': '1px solid #e5e6e7',
				'border-left': '1px solid #e5e6e7'
			},
			'tbody > tr > td > .cellbody': {
				'display': 'table'
			},
			'tbody > tr:first-child > td': {
				'border-top': 'none'
			},
			'tbody > tr > td:first-child': {
				'border-left': 'none'
			}
		}
	};

	return GridView = UI.inherit(GridView, UI.Attachable);
})();

UI.GridView = UI.component('gridview', UI.GridView);
// EOF of UI.GridView.js [attrs.ui-0.6.0]

// UI.TabView.js [attrs.ui-0.6.0]
var TabView = (function() {
	"use strict"

	function TabView(options) {
		this.$super(options);
	}
	
	TabView.prototype = {
		build: function() {
			var self = this;
			
			// create contents component
			var cards = this.cards = new UI.CardView();
			var tabbar = this.tabbar = new UI.TabBar({
				e: {
					'selected': function(e) {
						cards.select(e.index);
					}
				}
			});

			// process options
			var o = this.options;
			this.tabAlign(o.tabAlign);

			// bind events
			this.on('add', function(e) {
				return (e.item instanceof UI.Component);
			});

			this.on('added', function(e) {
				var cmp = e.item;

				cards.add(cmp);
				tabbar.add(new UI.Tab({
					title: cmp.options.title || 'Untitled',
					icon: cmp.options.icon,
					closable: (cmp.options.closable === false ) ? false : true
				}));
			});

			this.on('removed', function(e) {
				cards.remove(e.item);
				tabbar.remove(e.item);
			});

			this.on('selected', function(e) {
				tabbar.select(e.item);
			});
			
			// call super
			this.$super();
		},
		tabAlign: function(tabAlign) {
			var el = this.el;

			if( tabAlign === 'bottom' ) {
				this.cards.attachTo(this);
				this.tabbar.attachTo(this);
				this.tabbar.classes('bottom');
			} else {
				this.tabbar.attachTo(this);
				this.cards.attachTo(this);
				this.tabbar.classes('top');
			}
		}
	};
	
	TabView.inherit = '';
	TabView.style = {
		'background-color': '#242426',
		'border': '1px solid #373737',

		'position': 'relative',
		'display': 'box',
		'box-orient': 'vertical',
		'overflow': 'hidden',
		'box-flex': '1',

		'> .box': {
			'box-flex': '1',
			'display': 'box',
			'box-align': 'stretch',
			'box-pack': 'stretch',
			'box-orient': 'vertical'
		}
	};

	return TabView = UI.inherit(TabView, UI.SingleSelectableContainer);
})();

UI.TabView = UI.component('tabview', TabView);
// EOF of UI.TabView.js [attrs.ui-0.6.0]

// UI.Dialog.js [attrs.ui-0.6.0]
var Dialog = (function() {
	"use strict"

	function Dialog(options) {
		this.$super(options);
	}

	Dialog.prototype = {
		build: function() {
		}
	};

	Dialog.style = {
		'position': 'absolute',
		'top': 0,
		'left': 0
	};

	return Dialog = UI.inherit(Dialog, UI.Attachable);
})();

UI.Dialog = UI.context().component('dialog', Dialog);


// easy access
UI.alert = function(message, fn) {
};

UI.prompt = function(message, fn) {
};

UI.confirm = function(message, fn) {
};

UI.toast = function(message, style, duration) {
};

UI.tooltip = function(message, cmp) {
};

UI.dialog = function(view, modal) {
};
// EOF of UI.Dialog.js [attrs.ui-0.6.0]

// UI.Splitter.js [attrs.ui-0.6.0]
UI.Splitter = (function() {
	"use strict"

	function Splitter(options) {
		this.$super(options);
	}

	Splitter.prototype = {
		build: function() {
			var self = this;
			
			var o = this.options;
			this.tickness( o.tickness || o.size );

			this.on('connectTo', function(e) {
				if( !(e.parent instanceof UI.BoxView) ) {
					console.error('WARN:Splitter can attach only BoxView');
					return false;
				}
			});

			this.on('connectedTo', function(e) {
				self.refresh();

				e.parent.on('boxview.direction', function(e) {
					self.refresh();				
				});
			});
		},
		refresh: function() {
			var el = this.el;
			var view = this.parent();
			if( view ) {
				if( view.direction() === 'horizontal' ) {
					el.style('max-width', this.tickness() + 'px');
					el.style('min-width', this.tickness() + 'px');
					el.style('width', this.tickness() + 'px');
					el.style('cursor', 'w-resize');
				} else if( view.direction() === 'vertical' ) {
					el.style('max-height', this.tickness() + 'px');
					el.style('min-height', this.tickness() + 'px');
					el.style('height', this.tickness() + 'px');
					el.style('cursor', 'n-resize');
				}
			}
		},
		tickness: function(thickness) {
			if( !arguments.length ) return this._tickness || 3;

			thickness = parseInt(thickness);
			if( !isNaN(thickness) ) this._thickness = tickness;
			this.refresh();
		}
	};
	
	Splitter.style = {		
		'background': 'transparent'
	};
	
	return Splitter = UI.inherit(Splitter, UI.Component);
})();

UI.Splitter = UI.component('splitter', UI.Splitter);
// EOF of UI.Splitter.js [attrs.ui-0.6.0]

// UI.Space.js [attrs.ui-0.6.0]
UI.Space = (function() {
	"use strict"

	function Space(options) {
		this.$super(options);
	}

	Space.prototype = {
		build: function() {
			var o = this.options;
			if( o.size || o.size === 0 ) this.size(o.size);
		},
		size: function(size) {
			if( !arguments.length ) return this._size;

			this.el.width(size || false);
			this.el.height(size || false);
		}
	};

	Space.style = {
		'background': 'transparent'
	};

	return Space = UI.inherit(Space, UI.Component);
})();

UI.Space = UI.component('space', UI.Space);
// EOF of UI.Space.js [attrs.ui-0.6.0]

// UI.Flipper.js [attrs.ui-0.6.0]
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
// EOF of UI.Flipper.js [attrs.ui-0.6.0]

// UI.HTML.js [attrs.ui-0.6.0]
var HTML = (function() {
	"use strict"

	function HTML(options) {
		if( typeof(options) === 'string' ) options = {html:options};
		this.$super(options);
	}

	HTML.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.html ) this.html(o.html);
			else if( o.text ) this.text(o.text);
			else if( o.src ) this.src(o.src, o.cache, 'html');
		},
		src: function(url, cache, mode, append) {
			//console.log('html', this.base(), url, this.context().base());
			url = this.path(url);

			var self = this;
			Ajax.ajax(url).cache(cache).done(function(err, data) {
				if( err ) return console.error('[ERROR] remote html load fail', err);
				
				if( mode === 'text' ) self.text(data, append);
				else self.html(data, append);

				self.fire('html.loaded', {contents:data, mode:mode});
			});
			return this;
		},
		html: function(html, append) {
			if( !arguments.length ) return this.el.html();
			this.el.html(html, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:html, mode:'html'});
			return this;
		},
		text: function(text, append) {
			if( !arguments.length ) return this.el.text();
			this.el.text(text, append);
			this._original = this.el.html();
			this.fire('html.changed', {contents:text, mode:'text'});
			return this;
		},
		bind: function(data, fns) {
			this.el.tpl(data, fns);
			this.fire('html.changed', {contents:this.el.html(), mode:'html'});
			return this;
		}
	};
	
	HTML.style = {
		'background-color': 'transparent',
		'user-select': 'all',

		'..center': {
			'text-align': 'center'
		},
		'..left': {
			'text-align': 'left'
		},
		'..right': {
			'text-align': 'right'
		},
		'..darkshadow': {
			'text-shadow': '0 -1px 0 rgba(0,0,0,0.8)'
		},
		'..lightshadow': {
			'text-shadow': '0 1px 0 rgba(255,255,255,0.8)'
		},
		'..h3': {
			'font-weight': 'bold',
			'letter-spacing': 0,
			'font-size': 13
		}
	};

	return HTML = UI.inherit(HTML, UI.Component);
})();

UI.HTML = UI.component('html', HTML);
// EOF of UI.HTML.js [attrs.ui-0.6.0]

// UI.Video.js [attrs.ui-0.6.0]
UI.Video = (function() {
	"use strict"

	function Video(options) {
		this.$super(options);
	}

	Video.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.type ) this.type(o.type);
			if( o.cover ) this.cover(o.cover);
			if( o.src ) this.src(o.src);
		},
		src: function(url) {
			if( !arguments.length ) return this._url;
			if( typeof(url) !== 'string' ) throw new Error('illegal src');

			this._url = url;

			var type = this.type();
			var o = this.options;

			if( type === 'youtube' ) {
				var src = (~url.indexOf('/')) ? url : '//www.youtube.com/v/' + url;
				var locale = (navigator.userLanguage || navigator.language).split('-').join('_');
				var version = o.version || 3;

				var html = '<object width="100%" height="100%"><param name="movie" value="' + src + '?version=' + version + '&amp;hl=' + locale + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + src + '?version=' + version + '&amp;hl=' + locale + '" type="application/x-shockwave-flash" width="100%" height="100%" allowscriptaccess="always" allowfullscreen="true"></embed></object>';

				this.html(html);
			} else if( type === 'vimeo' ) {
				console.error('[WARN] no support yet');
			} else {
				// use video tag
				console.error('[WARN] no support yet');
			}

			return this;
		},
		cover: function(cover) {
			if( !arguments.length ) return this._cover;
			this._cover = cover;
			return this;
		},
		type: function(type) {
			if( !arguments.length ) return this._type;
			this._type = type;
			return this;
		}
	};
	
	Video.style = {
		'background-color': 'black',
		'position': 'relative',
		'overflow': 'hidden',
		'width': '100%',
		'height': '100%',
		'> *': {
			'z-index': 1,
			'position': 'absolute',
			'width': '100%',
			'height': '100%',
			'box-sizing': 'border-box'
		},
		'> .cover': {
			'z-index': 2
		}
	};

	return Video = UI.inherit(Video, UI.Component);
})();

UI.Video = UI.component('video', UI.Video);
// EOF of UI.Video.js [attrs.ui-0.6.0]

// UI.Image.js [attrs.ui-0.6.0]
UI.Image = (function() {
	"use strict"

	function Image(options) {
		if( typeof(options) === 'string' ) options = {src:options};
		this.$super(options);
	}

	Image.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			
			el.on('load', function(e) {
				self.fire('image.load', e);
			});

			el.on('error', function(e) {
				self.fire('image.error', e);
			});

			el.on('abort', function(e) {
				self.fire('image.abort', e);
			});
			
			var o = this.options;
			this.block(o.block);
			this.src(o.src);	
		},
		src: function(src) {
			if( !arguments.length ) return this.el.attr('src');
			
			if( typeof(src) === 'string' ) this.el.attr('src', this.path(src));
			return this;
		},
		block: function(block) {
			if( !arguments.length ) return (this.el.style('display') === 'block');

			if( block === true ) this.el.style('display', 'block');
			else this.el.style('display', false);

			return this;
		}
	};
	
	Image.tag = 'img';
	Image.style = {
	};

	return Image = UI.inherit(Image, UI.Component);
})();

UI.Image = UI.component('image', UI.Image);
// EOF of UI.Image.js [attrs.ui-0.6.0]

// UI.Button.js [attrs.ui-0.6.0]
UI.Button = (function() {
	"use strict"

	function Button(options) {
		this.$super(options);
	}

	Button.prototype = {
		build: function() {
			var o = this.options;
			this.text(o.text);
			this.icon(o.icon);
			this.image(o.image);
		},
		makeup: function() {
			this.el.html('<div class="inner"><div class="text">' + this.text() + '</div></div>');
		},
		text: function(text) {
			if( !arguments.length ) return this._text;
			this._text = text;
			this.makeup();
			return this;
		},
		icon: function(icon) {
			if( !arguments.length ) return this._icon;
			this._icon = icon;
			this.makeup();
			return this;
		},
		image: function(image) {
			if( !arguments.length ) return this._image;
			this._image = image;
			this.makeup();
			return this;
		}
	};

	Button.style = {
		'cursor': ['hand', 'pointer'],
		'min-height': 32,
		'color': '#f6f6f6',
		'background-color': 'transparent',
		
		'.inner': {
			'display': 'table',
			'table-layout': 'fixed',
			'width': '100%',
			'height': '100%'
		},
		'.text': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'vertical-align': 'middle',
			'width': '100%',
			'height': '100%',
			'text-align': 'center',
			'letter-spacing': 0,
			'font-weight': 'bold',
			'font-size': 12,
			'line-height': 12,
			'padding': '9px'
		},
		
		'..glass': {
			':hover': {
				'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 51%)'
			}
		},

		':hover': {
			'background-image': 'linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
		},
		
		'..grey': {
			'background-color': '#2e2e2e'
		},
		'..grey.dark': {
			'background-color': '#232323'
		},
		'..green': {
			'background-color': '#1f7e5c'
		},
		'..green.dark': {
			'background-color': '#1a664a'
		},
		'..red': {
			'background-color': '#e66c69'
		},
		'..red.dark': {
			'background-color': '#b85655'
		},
		'..yellow': {
			'background-color': '#daa571'
		},
		'..yellow.dark': {
			'background-color': '#af845a'
		},
		'..blue': {
			'background-color': '#5b9aa9'
		},
		'..blue.dark': {
			'background-color': '#497b86'
		},
		'..purple': {
			'background-color': '#6b5b8c'
		},
		'..purple.dark': {
			'background-color': '#554971'
		},
		'..wine': {
			'background-color': '#8b5d79'
		},
		'..wine.dark': {
			'background-color': '#704a61'
		},
		'..twitter': {
			'background-color': '#2589c5'
		},
		'..twitter.dark': {
			'background-color': '#0067bc'
		},
		'..facebook': {
			'background-color': '#3b5999'
		},
		'..facebook.dark': {
			'background-color': '#2f4785'
		}
	};

	return Button = UI.inherit(Button, UI.Component);
})();

UI.Button = UI.component('button', UI.Button);
// EOF of UI.Button.js [attrs.ui-0.6.0]

// UI.Thumnails.js [attrs.ui-0.6.0]
UI.Thumnails = (function() {
	"use strict"

	function Thumnails(options) {
		this.$super(options);
	}

	Thumnails.prototype = {
		build: function() {
			var self = this;
			var map = new Map();
			
			// create dom
			var ul = this.el.create('ul');

			// apply options
			var o = this.options;
			this.size(o.size);			

			// bind events
			this.on('add', function(e) {
				var item = e.item;

				if( typeof(item) === 'string' ) item = {src:item};				
				if( typeof(item) !== 'object' ) return false;

				e.item = item;
			});

			this.on('added', function(e) {
				var item = e.item;

				var html = '<li class="item">' + 
					'<img src="' + item.src + '" />' + 
					'<div class="mask" title="' + (item.title || '') + '"></div>' +
				'</li>';

				var thumnail = $(html);
				ul.attach(thumnail);

				map.set(item, thumnail);
				
				(function(thumnail, item) {
					thumnail.on('click', function(e) {
						self.select(item);
					});

					thumnail.on('mouseover', function(e) {
						self.fire('over', {
							item: item
						});
						e.stopPropagation();
					});

					thumnail.on('mouseout', function(e) {
						self.fire('out', {
							item: item
						});
						e.stopPropagation();
					});
				})(thumnail, item);

				if( !self.selected() || item.selected ) self.select(item);
				
			});

			this.on('removed', function(e) {
				var itemEl = map.get(e.item);
				if( itemEl ) itemEl.detach();
			});

			this.on('selected', function(e) {
			});

			this.on('deselected', function(e) {
			});

			this.$super();
		},
		size: function(size) {
			if( !arguments.length ) return this._size || {width:50,height:50};

			if( typeof(size) === 'object' && !(this.size.width || this.size.height) ) this._size = size;
			else console.error('invalid size object');

			this.css({
				'.item': {
					'width': size.width,
					'height': size.height,
					'border': size.border
				}
			});
			
			return this;
		}
	};
	
	Thumnails.style = {
		'.thumnails': {
			'overflow': 'hidden',
			'list-style': 'none'
		},
		'.item': {
			'position': 'relative',
			'cursor': ['hand', 'pointer'],
			'float': 'left',
			'width': 49,
			'overflow': 'hidden'
		},
		'.item img': {
			'width': '100%'
		},
		'.item .mask': {
			'position': 'absolute',
			'box-sizing': 'border-box',
			'top': 0,
			'bottom': 0,
			'left': 0,
			'right': 0
		},
		'.item:hover .mask': {
			'border': '2px solid #484348'
		}
	};

	return Thumnails = UI.inherit(Thumnails, UI.SingleSelectableContainer);
})();

UI.Thumnails = UI.component('thumnails', UI.Thumnails);
// EOF of UI.Thumnails.js [attrs.ui-0.6.0]

// UI.Breadcrumb.js [attrs.ui-0.6.0]
UI.Breadcrumb = (function() {
	"use strict"

	function Breadcrumb(options) {
		this.$super(options);
	}
	
	Breadcrumb.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			var ol = $('<ol class="breadcrumbs"></ol>');

			el.attach(ol);
			
			this.on('added', function(e) {
				var item = e.item;

				var html = '<li>' + 
					'<a href="#">' + (item.title || 'untitled') + '</a>' + 
				'</li>';

				var tab = $(html);
				ol.attach(tab);

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					if( item.href ) self.action(item.href);					
				});

				self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.item);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('a').rc('selected');
			});

			this.$super();
		}
	};
	
	Breadcrumb.inherit = '';
	Breadcrumb.style = {
		'border': '1px solid #ddd',
		'border-radius': '4px',
		
		'.breadcrumbs': {
			'margin-bottom': '18px',
			'margin-left': '2.2em',
			'background': 'none',
			'height': '3em',
			'overflow': 'hidden',
			'line-height': '3em',
			'margin': '0',
			'list-style': 'none',
			'font-weight': 'bold',
			'text-shadow': '0 1px 0 #fff'
		},
		'.breadcrumbs li': {
			'background': 'none',
			'float': 'left',
			'margin': '0',
			'padding': '0 0 0 1em'
		},
		'.breadcrumbs li a': {
			'color': '#666',
			'float': 'left',
			'text-decoration': 'none',
			'padding': '0 1.75em 0 0',
			'margin-left': '0px',
			'background': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABdCAMAAACIPFYVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF29vb////0lAD4QAAAAJ0Uk5T/wDltzBKAAAAoElEQVR42qyWyQ2AMBDEPP03TQM4xBJ8zUo55gjs/QMhzAEC5gABc4CAOUDAHCBgDhAwBwiYAwTMAQLmAAFzcPfXZOR2jTf7nYzcn/b3zU1Gim6+NDgZaQ44u2kyUr18yoUYMYOfQklXRd059XSpN0hVCVWJVLVTHUV1LTUZqOlDTThqilKTmtoG1Mahthq1OantTH0BUF8ZOTQsfh4BBgArjQgu2PVF4gAAAABJRU5ErkJggg==) no-repeat 100% 50%'
		},
		'.breadcrumbs li a.selected': {
			'color': '#333',
			'background': 'none'
		},
		'.breadcrumbs li a:hover': {
			'color': '#333',
			'text-decoration': 'none'
		}/*,

		'@media only screen': {
			'ol.breadcrumbs li a': {
				'background-image': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjVweCIgaGVpZ2h0PSI5M3B4IiB2aWV3Qm94PSIwIDAgMjUgOTMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI1IDkzIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5Z29uIGZpbGw9IiNEREREREQiIHBvaW50cz0iMC41Nyw5MyAtMC41Nyw5MyAyMy43ODksNDYuNDE4IDAuMjExLDAgMS4zMiwwIDI0LjkxNCw0Ni40MjUgIi8+DQo8L3N2Zz4NCg==)'
			}
		}*/
	};

	return Breadcrumb = UI.inherit(Breadcrumb, UI.SingleSelectableContainer);
})();

UI.Breadcrumb = UI.component('breadcrumb', UI.Breadcrumb);



/*
ol.breadcrumbs {
	margin-bottom: 18px;
	list-style: decimal;
	margin-left: 2.2em;
}
ol.breadcrumbs {
	font-size: 11px;
	color: #444;
	background: url(./breadcrumbs/breadcrumb_bg.png) no-repeat;
	height: 36px;
	line-height: 34px;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	float: left;
	margin: 0;
	padding: 0 0 0 20px;
	background: url(./breadcrumbs/breadcrumb_sep_20080909.png) no-repeat;
}
ol.breadcrumbs li a {
	float: left;
	color: #444;
	text-decoration: none;
	padding: 0 10px;
	margin-left: -10px;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	margin: 0;
	padding: 0 10px;
	width: 15px;
	text-indent: -9999px;
	overflow: hidden;
}

#breadory {
	border: 1px solid #ddd;
	width: 100%;
	margin: 0 auto;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
	border-radius: 4px;
	
	--background-color: #232323;
}
ol.breadcrumbs {
	background: none;
	clear: both;
	float: none;
	height: 3em;
	line-height: 3em;
	font-size: 11px;
	color: #666;
	margin: 0;
	list-style: none;
	font-weight: bold;
	text-shadow: 0 1px 0 #fff;
}
ol.breadcrumbs li {
	background: none;
	float: left;
	margin: 0;
	padding: 0 0 0 1em;
}
ol.breadcrumbs li a {
	float: left;
	color: #666;
	text-decoration: none;
	padding: 0 1.75em 0 0;
	margin-left: 0px;
	background: url(./breadcrumbs/breadcrumb_separator.png) no-repeat 100% 50%;
}
ol.breadcrumbs li a:hover {
	color: #333;
	text-decoration: none;
}
ol.breadcrumbs li.home {
	background: none;
	margin: 0;
	padding: 0;
}
ol.breadcrumbs li.home a {
	background: url(./breadcrumbs/breadcrumb_home.png) no-repeat 1.25em 50%;
	margin: 0;
	padding: 0 0 0 1.25em;
	width: 30px;
	text-indent: -9999px;
	overflow: hidden;
}
ol.breadcrumbs li.home a:hover {
	background-image: url(./breadcrumbs/breadcrumb_home_over.png);
}

@media only screen {
	ol.breadcrumbs li a {
		background-image:url(./breadcrumbs/breadcrumb_separator.svg);
	}
	ol.breadcrumbs li.home a {
		background-image:url(./breadcrumbs/breadcrumb_home.svg);
	}
	ol.breadcrumbs li.home a:hover {
		background-image:url(./breadcrumbs/breadcrumb_home_over.svg);
	}
}

<div id="breadory">
	<ol class="breadcrumbs">
		<li><a href="#">홈</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title</a></li>
		<li><a href="#">Title Title Title</a></li>
		<li><a href="#">Title</a></li>
		<li>Title</li>
	</ol>
</div>
*/

// EOF of UI.Breadcrumb.js [attrs.ui-0.6.0]

// UI.Pagination.js [attrs.ui-0.6.0]
UI.Pagination = (function() {
	"use strict"

	function Pagination(options) {
		this.$super(options);
	}

	Pagination.prototype = {
		build: function() {
			var o = this.options;
			
			if( o.min || o.min === 0 ) this.min(o.min);
			if( o.max || o.max === 0 ) this.max(o.max);
			if( o.current || o.current === 0 ) this.current(o.current);
			if( o.prev ) this.prevButton(o.prev);
			if( o.next ) this.nextButton(o.next);
		},
		refresh: function() {
			var min = this._min;
			var max = this._max;
			var current = this._current;
			var per = this._per;
			
			if( !min && min !== 0 ) min = 1;
			if( (!max && max !== 0) || max <= min ) max = min;
			if( (!current && current !== 0) || current < min ) current = min;
			if( current > max ) current = max;
			if( (!per && per !== 0 ) || per <= 0 ) per = 10;

			var self = this;
			this.el.empty();

			var prevButton = $('<span class="page prev">이전</span>');
			this.el.attach(prevButton);

			for(var i=min; i <= max;i++) {
				var pageel = $('<span class="page">' + i + '</span>');
				this.el.attach(pageel);

				if( i === current ) pageel.ac('selected');
				
				(function(pageel, i) {
					pageel.on('click', function(e) {
						self.current(i);
					});
				})(pageel, i);
			}

			var nextButton = $('<span class="page next">다음</span>');
			this.el.attach(nextButton);
		},
		prevButton: function(prev) {
			if( !arguments.length ) return this._prev;
			this._prev = prev;
			return this;
		},
		nextButton: function(next) {
			if( !arguments.length ) return this._next;
			this._next = next;
			return this;
		},
		min: function(min) {
			if( !arguments.length ) return this._min;
			
			if( typeof(min) === 'string' ) min = parseInt(min);
			
			if( typeof(min) === 'number' ) {
				this._min = min;
				this.refresh();
			}

			return this;
		},
		per: function(per) {
			if( !arguments.length ) return this._per;
			
			if( typeof(per) === 'string' ) per = parseInt(per);
			
			if( typeof(per) === 'number' ) {
				this._per = per;
				this.refresh();
			}

			return this;
		},
		max: function(max) {
			if( !arguments.length ) return this._max;
			
			if( typeof(max) === 'string' ) max = parseInt(max);
			
			if( typeof(max) === 'number' ) {
				this._max = max;
				this.refresh();
			} else {
				console.error('WARN:invalid min value');
			}

			return this;
		},
		current: function(current) {
			if( !arguments.length ) return this._current;
			
			if( typeof(current) === 'string' ) current = parseInt(current);
			
			if( typeof(current) === 'number' ) {
				this._current = current;
				this.refresh();

				this.fire('changed', {current:current, min: this._min, max: this._max});
			} else {
				console.error('WARN:invalid min value');
			}

			return this;
		}
	};
	
	Pagination.style = {
		'text-align': 'center',

		'> .page': {
			'display': 'inline-block',
			'cursor': 'pointer',
			'margin': '-1px',
			'padding': '7px 12px 6px',
			'border': '1px solid',
			'border-color': '#e5e6e7',
			'background-color': '#fbfbfb',
			'font-weight': 'bold',
			'line-height': '16px',
			'vertical-align': 'top'
		},
		'> .page:hover': {
			'text-decoration': 'underline',
			'color': '#080'
		},
		'> .page.selected': {
			'background-color': '#fff',
			'color': '#080'
		},
		'> .prev': {
			'padding-left': '23px',
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAJEAAPz8/ExOVvv7+wAAACH5BAAAAAAALAAAAAAFAAcAAAIKhBMiqLypXpQRFQA7) no-repeat 13px 12px'
		},
		'> .prev:hover': {
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAIABAAXDAP///yH5BAEAAAEALAAAAAAFAAcAAAIJjAGXgWr+WgQFADs=) no-repeat 13px 12px'
		},
		'> .next': {
			'padding-right': '23px',
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAJEAAPz8/ExOVvv7+wAAACH5BAAAAAAALAAAAAAFAAcAAAIKTIRiqZfbEDSgFgA7) no-repeat 41px 12px'
		},
		'> .next:hover': {
			'background': '#fbfbfb url(data:image/gif;base64,R0lGODlhBQAHAIABAAXDAP///yH5BAEAAAEALAAAAAAFAAcAAAIKBIJhqZfbEIShAAA7) no-repeat 41px 12px'
		}
	};

	return Pagination = UI.inherit(Pagination, UI.Component);
})();

UI.Pagination = UI.component('pagination', UI.Pagination);
// EOF of UI.Pagination.js [attrs.ui-0.6.0]

// UI.Tabs.js [attrs.ui-0.6.0]
UI.Tabs = (function() {
	"use strict"

	function Tabs(options) {
		this.$super(options);
	}
	
	Tabs.prototype = {
		build: function() {
			var self = this;
			var el = this.el;
			var map = new Map();
			
			// sub dom
			var ul = $('<ul class="tabs"></ul>');
			el.attach(ul);
			this.attachTarget(false);
			
			// options
			var o = this.options;
			this.tabAlign(o.tabAlign);
			this.type(o.type);

			// events			
			this.on('added', function(e) {
				var item = e.item;

				var html = '<li>' + 
					'<a href="javascript:;" class="tab">' + 
						'<span class="octicon octicon-diff-added"></span>' + 
						'<span class="title">' + (item.title || 'untitled') + '</span>' + 
						((item.extra || item.extra === 0) ? '<span class="extra">' + item.extra + '</span>' : '') + 
					'</a>' + 
				'</li>';

				var tab = $(html);
				ul.attach(tab);

				map.set(item, tab);

				tab.on('click', function(e) {
					self.select(item);
					
					// execute href action if exists
					if( item.href ) self.action(item.href);					
				});

				if( !self.selected() || item.selected ) self.select(item);
			});

			this.on('removed', function(e) {
				var tab = map.get(e.item);
				if( tab ) tab.detach();
			});

			this.on('selected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').ac('selected');
			});

			this.on('deselected', function(e) {
				var tab = map.get(e.item);
				tab.find('.tab').rc('selected');
			});

			this.$super();
		},
		type: function(type) {
			if( !arguments.length ) return this._type;

			if( typeof(type) !== 'string' || !type ) type = 'default';

			if( this._type ) this.el.rc(this._type);
			this.el.ac(type);
			this._type = type;
			return this;
		},
		tabAlign: function(tabAlign) {
			if( !arguments.length ) return this.el.hc('bottom') ? 'bottom' : 'top';

			if( tabAlign === 'bottom' ) this.el.rc('top').ac('bottom');
			else this.el.rc('bottom').ac('top');

			return this;
		}
	};
	
	Tabs.inherit = '';
	Tabs.style = {		
		'..default': {
			'.tabs': {
				'display': 'inline-block'
			},
			'.tabs > li': {
				'display': 'inline-block',
				'margin-bottom': '-1px'
			},
			'.tab': {
				'display': 'inline-block',
				'padding': '8px 12px 7px',
				'border': '1px solid transparent',
				'border-bottom': '0',
				'color': '#666',
				'text-decoration': 'none'
			},
			'.tab.selected': {
				'border-color': '#ddd',
				'border-radius': '4px 4px 0 0',
				'background-color': '#fff',
				'color': '#333'
			},
			'.tab:hover': {
				'text-decoration': 'none'
			},
			'.title': {
				'display': 'inline-block',
				'padding-bottom': '2px'
			},
			'.extra': {
				'display': 'inline-block',
				'margin': '0 0 0 5px',
				'padding': '2px 5px 3px',
				'font-size': '10px',
				'font-weight': 'bold',
				'line-height': '1',
				'color': '#666',
				'background-color': '#e5e5e5',
				'border-radius': '10px'
			},
			'.extra.blank': {
				'display': 'none'
			},
			
			'..bottom': {
				'.tabs > li': {
					'margin-top': '-1px'
				},
				'.tab': {
					'border': '1px solid transparent',
					'border-top': '0'
				},
				'.tab.selected': {
					'border-color': '#ddd',
					'border-radius': '0 0 4px 4px'
				}
			}
		},
		
		'..mini': {
		},
		
		'..text': {
			'font-size': '0.9em',
			'.tabs': {
			},
			'.tabs > li': {
				'display': 'inline-block'
			},
			'.tab': {
				'margin-left': 6,
				'padding-left': 6,
				'background': 'url(data:image/gif;base64,R0lGODlhAgCuAbMNAO3t7e3u79fX1+7u8ASsAO7u7+7u7ujo6efn7N3d3UpNWCAjLvPz+////wAAAAAAACH5BAEAAA0ALAAAAAACAK4BAASIEDRJp6346lyb/2AYDg1pluh5imzrvkYTz3JN0+8bNHvP/75grsXZWIbDREPJXDqbSqRroaBaq9irVAfsCr+/rfhTaJTP5jR6PW6DBA24PE6f2934u75Ox+MJDYCCgYSDhoV+UgcNi42Mj46OiW0IDZWXlpmYmJNjDA2foaCjop1+KimpqKZSEQA7) no-repeat 0 -338px',
				'color': '#6f707b',
				'text-decoration': 'none',
				'letter-spacing': -1
			},
			'.tabs > li:first-child > .tab': {
				'margin-left': 0,
				'background': 'none'
			},
			'.tab.selected': {
				'color': '#20232c',
				'font-weight': 'bold'
			},
			'.title': {
				'display': 'inline-block',
				'padding-bottom': '2px'
			},
			'.extra': {
				'margin-left': 3,
				'padding': '3px 7px',
				'font-size': '0.8em',
				'font-weight': 'normal',
				'letter-spacing': 0,
				'color': '#6f707b',
				'background-color': '#e5e5e5',
				'border-radius': 8
			},
			'.extra.blank': {
				'display': 'none'
			}
		}
	};

	return Tabs = UI.inherit(Tabs, UI.SingleSelectableContainer);
})();

UI.Tabs = UI.component('tabs', UI.Tabs);



/*
<ul class="tabnav-tabs">
	<li>
		<a href="#" class="tabnav-tab selected">
			<span class="octicon octicon-diff-added"></span>
			Contributions
		</a>
	</li>
	<li>
		<a href="#" class="tabnav-tab ">
			<span class="octicon octicon-repo"></span>
			Repositories
		</a>
	</li>
	<li>
		<a href="#" class="tabnav-tab ">
			<span class="octicon octicon-rss"></span>
			Public Activity
		</a>
	</li>
</ul>


.tabnav {
	margin:0 0 15px;
	border-bottom:1px solid #ddd;
	-moz-box-sizing:border-box;
	box-sizing:border-box;
}

.tabnav .tabnav-tabs {
	display:inline-block;
}

.tabnav .tabnav-tabs > li {
	display:inline-block;
	margin-bottom:-1px;
}

.tabnav-tab {
	display:inline-block;
	padding:8px 12px 7px;
	border:1px solid transparent;
	border-bottom:0;
	font-size:14px;
	line-height:20px;
	color:#666;
	text-decoration:none;
}

.tabnav-tab.selected {
	border-color:#ddd;
	border-radius:3px 3px 0 0;
	background-color:#fff;
	color:#333;
}

.tabnav-tab:hover {
	text-decoration:none;
}

.tabnav .counter {
	display:inline-block;
	margin:0 0 0 5px;
	padding:2px 5px 3px;
	font-size:10px;
	font-weight:700;
	line-height:1;
	color:#666;
	background-color:#e5e5e5;
	border-radius:10px;
}

.tabnav .counter.blank {
	display:none;
}
*/

// EOF of UI.Tabs.js [attrs.ui-0.6.0]

// UI.FieldSet.js [attrs.ui-0.6.0]
UI.FieldSet = (function() {
	"use strict"

	function FieldSet(o) {
		this.$super(o);
	}
	
	FieldSet.prototype = {
		build: function() {
			// apply options
			var o = this.options;
			this.legend(o.legend);
			this.bordered(o.border);

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('removed', function(e) {
				e.item.detach();
			});

			this.$super();
		},
		bordered: function(border) {
			if( !arguments.length ) return this.el.hc('bordered');
			if( !border ) this.el.rc('bordered');
			else this.el.ac('bordered');
			this.$super(border);
			return this;
		},
		legend: function(legend) {
			if( !arguments.length ) return this._legend ? this._legend.html() : null;

			if( !legend ) {
				if( this._legend ) this._legend.detach();
				return this;
			}


			if( !this._legend ) this._legend = this.el.create('legend');
			this._legend.html(legend);

			return this;
		}
	}
	
	FieldSet.tag = 'fieldset';
	FieldSet.style = {
		'border': 'none',

		'> legend': {
			'display': 'none'
		},

		'..bordered': {
			'border': '1px solid rgba(255,255,255,0.2)',
			'padding': 3,
			'margin': 3,

			'> legend': {
				'display': 'block',
				'font-size': 11,
				'font-weight': 'bold',
				'color': 'rgba(255,255,255,0.8)'
			}
		}
	};

	return FieldSet = UI.inherit(FieldSet, UI.Attachable);
})();

UI.FieldSet = UI.component('fieldset', UI.FieldSet);
// EOF of UI.FieldSet.js [attrs.ui-0.6.0]

// UI.Field.js [attrs.ui-0.6.0]
UI.Field = (function() {
	"use strict"

	function Field(options) {
		this.$super(options);
	}
	
	return Field = UI.inherit(Field, UI.Component);
})();

// EOF of UI.Field.js [attrs.ui-0.6.0]

// UI.TextField.js [attrs.ui-0.6.0]
UI.TextField = (function() {
	"use strict"

	function TextField(options) {
		this.$super(options);
	}

	TextField.prototype = {
		build: function() {
			// options
			var o = this.options;
			this.type(o.type || 'text');
			this.value(o.value);
			this.placeholder(o.placeholder);
			this.autocomplete(o.autocomplete);
			this.autocapitalize(o.autocapitalize);
			this.autocorrect(o.autocorrect);
			this.threshold(o.threshold);

			// events
			var self = this;
			var el = this.el;
			var current, timer;
			var changed = function() {
				self.fire('changed', self.value());
			};
			
			el.on('keyup', function(e) {
				var value = el.value();

				if( value === current ) return;
				else current = value;
				
				if( timer ) clearTimeout(timer);
				timer = setTimeout(changed, ((e.keyCode == 13) ? 1 : self.threshold()));
			});
			el.on('blur', function(e) {
				var value = el.value();

				if( value === current ) return;
				else current = value;
				
				if( timer ) clearTimeout(timer);
				timer = setTimeout(changed, ((e.keyCode == 13) ? 1 : self.threshold()));
			});
		},
		value: function(value) {
			if( !arguments.length ) return this.el.value();
			this.el.value(value || '');
			return this;
		},
		placeholder: function(placeholder) {
			if( !arguments.length ) return this.el.attr('placeholder');
			this.el.attr('placeholder', placeholder);
			return this;
		},
		type: function(type) {
			if( !arguments.length ) return this.el.attr('type');
			this.el.attr('type', type);
			return this;
		},
		autocomplete: function(autocomplete) {
			if( !arguments.length ) return this.el.attr('autocomplete');
			this.el.attr('autocomplete', autocomplete);
			return this;
		},
		autocapitalize: function(autocapitalize) {
			if( !arguments.length ) return this.el.attr('autocapitalize');
			this.el.attr('autocapitalize', autocapitalize);
			return this;
		},
		autocorrect: function(autocorrect) {
			if( !arguments.length ) return this.el.attr('autocorrect');
			this.el.attr('autocorrect', autocorrect);
			return this;
		},
		threshold: function(threshold) {
			if( !arguments.length ) return this._threshold || 500;
			this._threshold = threshold;
			return this;
		}
	};
	
	TextField.tag = 'input';
	TextField.style = {
		'font-size': '1em',
		'border': '2px solid transparent',
		'outline': '0',
		'height': 35,
		'line-height': 20,
		'box-shadow': 'none',
		'color': 'white',
		'padding': 3,
		'background-color': 'transparent',

		'..search': {
			'padding': '0 0 0 34px',
			'background-position': '5px 50%',
			'background-repeat': 'no-repeat',
			'background-size': '20px',
			'background-image': 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJzZWFyY2hfMV8iPg0KCTxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yMCwwLjAwNWMtNi42MjcsMC0xMiw1LjM3My0xMiwxMmMwLDIuMDI2LDAuNTA3LDMuOTMzLDEuMzk1LDUuNjA4bC04LjM0NCw4LjM0MmwwLjAwNywwLjAwNg0KCQlDMC40MDYsMjYuNjAyLDAsMjcuNDksMCwyOC40NzdjMCwxLjk0OSwxLjU4LDMuNTI5LDMuNTI5LDMuNTI5YzAuOTg1LDAsMS44NzQtMC40MDYsMi41MTUtMS4wNTlsLTAuMDAyLTAuMDAybDguMzQxLTguMzQNCgkJYzEuNjc2LDAuODkxLDMuNTg2LDEuNCw1LjYxNywxLjRjNi42MjcsMCwxMi01LjM3MywxMi0xMkMzMiw1LjM3OCwyNi42MjcsMC4wMDUsMjAsMC4wMDV6IE00Ljc5NSwyOS42OTcNCgkJYy0wLjMyMiwwLjMzNC0wLjc2OCwwLjU0My0xLjI2NiwwLjU0M2MtMC45NzUsMC0xLjc2NS0wLjc4OS0xLjc2NS0xLjc2NGMwLTAuNDk4LDAuMjEtMC45NDMsMC41NDMtMS4yNjZsLTAuMDA5LTAuMDA4bDguMDY2LTguMDY2DQoJCWMwLjcwNSwwLjk1MSwxLjU0NSwxLjc5MSwyLjQ5NCwyLjQ5OEw0Ljc5NSwyOS42OTd6IE0yMCwyMi4wMDZjLTUuNTIyLDAtMTAtNC40NzktMTAtMTBjMC01LjUyMiw0LjQ3OC0xMCwxMC0xMA0KCQljNS41MjEsMCwxMCw0LjQ3OCwxMCwxMEMzMCwxNy41MjcsMjUuNTIxLDIyLjAwNiwyMCwyMi4wMDZ6Ii8+DQoJPHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTIwLDUuMDA1Yy0zLjg2NywwLTcsMy4xMzQtNyw3YzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVzMC41LTAuMjI0LDAuNS0wLjVjMC0zLjMxMywyLjY4Ni02LDYtNg0KCQljMC4yNzUsMCwwLjUtMC4yMjQsMC41LTAuNVMyMC4yNzUsNS4wMDUsMjAsNS4wMDV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg==)'			
		},
		
		':hover': {
			'border': '2px solid rgba(255,255,255,0.15)'
		},
		':focus': {
			'border': '2px solid #1F7F5C'
		},
		'::input-placeholder': {
			'font-size': '9pt',
			'font-weight': 'bold'
		}
	};

	return TextField = UI.inherit(TextField, UI.Field);
})();

UI.TextField = UI.component('field.text', UI.TextField);
// EOF of UI.TextField.js [attrs.ui-0.6.0]

// UI.CheckField.js [attrs.ui-0.6.0]
UI.CheckField = (function() {

	function CheckField(options) {
		this.$super(options);
	}

	CheckField.prototype = {
		build: function() {
			this.checker = this.el.create('<div class="checker"></div>');
			this.label = this.el.create('<div class="label"></div>');
			this.clear = this.el.create('<div class="clear"></div>');

			var o = this.options;
			this.text(o.text);
			this.value(o.value);

			this.on('click', function(e) {
				this.value(!this.value());
			});
		},
		text: function(text) {
			if( !arguments.length ) return this.label.html();
			this.label.html(text || '');
			return this;
		},
		value: function(b) {
			if( !arguments.length ) return this.checker.hc('checked');

			if( b ) this.checker.ac('checked');
			else this.checker.rc('checked');
			return this;
		}
	};
	
	CheckField.style = {
		'margin': '5px 0',
		'cursor': ['hand', 'pointer'],

		':hover': {
			'.checker': {
				'border': '2px solid #1F805D'
			}
		},

		'.checker': {
			'float': 'left',
			'width': 13,
			'height': 13,
			'border': '1px solid rgba(155,155,155,0.7)',
			
			'..checked': {
				'border': '2px solid #1F805D',
				'background-color': '#1F805D'
			}
		},
		'.label': {
			'float': 'left',
			'margin': '0 8px',
			'line-height': 15,
			'color': '#fefefe',
			'letter-spacing': -1,
			'font-size': 11
		},
		'.clear': {
			'clear': 'both'
		}
	};

	return CheckField = UI.inherit(CheckField, UI.Field);
})();

UI.CheckField = UI.component('field.check', UI.CheckField);
// EOF of UI.CheckField.js [attrs.ui-0.6.0]

// UI.MultiButton.js [attrs.ui-0.6.0]
UI.MultiButton = (function() {
	"use strict"

	function MultiButton(options) {
		this.$super(options);
	}

	MultiButton.prototype = {
		build: function() {
			var o = this.options;
			var self = this;
			
			this.btns = new Map();
			this.fit(o.fit);

			this.on('added', function(e) {
				var item = e.item;

				var btn = El.create('div');
				if( item.disabled ) btn.ac('disabled');

				var w = item.width || item.w;
				if( typeof(w) === 'number' ) btn.css('width', w + 'px');
				if( typeof(w) === 'string' ) btn.css('width', w);

				var xw = item.maxWidth || item.xw;
				if( typeof(xw) === 'number' ) btn.css('max-width', xw + 'px');
				if( typeof(xw) === 'string' ) btn.css('max-width', xw);

				var mw = item.minWidth || item.mw;
				if( typeof(mw) === 'number' ) btn.css('min-width', mw + 'px');
				if( typeof(mw) === 'string' ) btn.css('min-width', mw);
				
				if( item.html ) {
					btn.html(item.html);
				} else {
					if( item.image ) btn.html('<img src="' + item.image + '" />');
					if( item.text ) btn.html('<span>' + item.text + '</span>');
				}
				
				(function(btn, item) {
					btn.on('mousedown', function(e) {
						if( self.selectable === 'multi' ) {
							if( self.isSelected(item) ) self.deselect(item);
							else self.select(item);
						} else {
							self.select(item);
						}
					});
				})(btn, item);
				
				self.btns.set(item, btn);
				self.attach(btn);

				if( item.selected ) self.select(item);
			});
			
			this.on('removed', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.detach();
					self.btns.remove(e.item);
				}
			});

			this.on('select', function(e) {
				var btn = self.btns.get(e.item);
				if( btn.hc('disabled') ) return false;
			});

			this.on('selected', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.ac('active');						
					self.fire('active', {
						originalEvent: e,
						item: e.item						
					});
				}
			});

			this.on('deselected', function(e) {
				var btn = self.btns.get(e.item);
				if( btn ) {
					btn.rc('active');
					self.fire('deactive', {
						originalEvent: e,
						item: e.item						
					});
				}
			});
		},
		fit: function(fit) {
			if( fit === undefined ) return this.el.hc('fit');

			if( fit ) this.el.ac('fit');
			else this.el.rc('fit');
		}
	};

	MultiButton.style = {
		'display': 'box',
		'margin': '1px',

		'..fit': {
			'box-flex': 1,
			'width': '100%'
		},
		'> div.disabled': {
			'color': '#bbb'
		},
		'> div': {
			'display': 'box',
			'box-align': 'center',
			'box-pack': 'center',
			'box-flex': '1',
			'min-width': 30,
			'padding': '5px 10px',
			'margin': '0',
			'margin-bottom': '1px',
			'cursor': 'pointer',
			'font-weight': 'bold',
			'font-size': '11px',
			'border': '1px solid rgba(109,109,109,0.5)',
			'border-left': 'none'
		},
		'> div.active': {
			'border': '1px solid #fff',
			'border-left': 'none',
			'color': 'black',
			'background-color': '#fff'
		},
		'> div:first-child': {
			'border-left': '1px solid rgba(109,109,109,0.5)',
			'border-top-left-radius': '4px',
			'border-bottom-left-radius': '4px'
		},
		'> div:last-child': {
			'border-left': 'none',
			'border-top-right-radius': '4px',
			'border-bottom-right-radius': '4px'
		},
		'> div > span': {
			'display': 'block',
			'max-width': '100%',
			'overflow': 'hidden',
			'white-space': 'nowrap',
			'text-overflow': 'ellipsis'
		},
		'..ios': {
			'> div.disabled': {
				'color': '#bbb',
				'text-shadow': 'rgba(0, 0, 0, 0.3) 0 -1px 0'
			},
			'> div': {
				'text-shadow': 'black 0 1px 0',
				'background-image': 'linear-gradient(bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
				'border': '1px solid rgba(109,109,109,0.5)',
				'border-left': 'none',
				'box-shadow': 'inset 0 1px 1px rgba(0,0,0,0.5), 0 1px rgba(255,255,255,0.5)'
			},
			'> div.active': {
				'border': '1px solid #eee',
				'border-left': 'none',
				'color': 'black',
				'text-shadow': 'white 0 1px 0',
				'background-color': '#ccc',
				'background-image': 'linear-gradient(bottom, #eee 0%, #fff 100%)',
				'box-shadow': '0 1px rgba(255,255,255,0.5)'
			},
			'> div:first-child': {
				'border-left': '1px solid rgba(109,109,109,0.5)',
				'border-top-left-radius': '4px',
				'border-bottom-left-radius': '4px'
			},
			'> div:last-child': {
				'border-left': 'none',
				'border-top-right-radius': '4px',
				'border-bottom-right-radius': '4px'
			}
		},
		'..vintage': {
			'> div': {
				'box-shadow': 'inset 0 1px 10px rgba(0,0,0,0.2), 0 1px rgba(255,255,255,0.3)'
			}
		},
		'..red': {
			'> div': {
				'background-color': 'rgba(141,13,0,0.8)'
			}
		}
	};

	return MultiButton = UI.inherit(MultiButton, UI.Component);
})();

UI.MultiButton = UI.component('multibutton', UI.MultiButton);
// EOF of UI.MultiButton.js [attrs.ui-0.6.0]

// UI.Slider.js [attrs.ui-0.6.0]
UI.Slider = (function() {
	"use strict"

	function Slider(options) {
		this.$super(options);
	}

	Slider.prototype = {
		build: function() {
			var o = options;
			this.value = parseFloat(o.value);
			this.max = parseFloat(o.max);
			this.min = parseFloat(o.min);
			this.atomic = parseFloat(o.atomic);
			
			if( isNaN(this.min) ) this.min = 0;
			if( isNaN(this.max) ) this.max = 100;
			if( isNaN(this.value) ) this.value = this.max;
			if( isNaN(this.atomic) ) this.atomic = 1;

			if( this.value < this.min ) this.value = this.min;
			if( this.value > this.max ) this.value = this.max;

			this._make();
		},
		syncKnob: function() {
			if( this.knob ) {
				var totalpx = this.el.offsetWidth - (this.knob.offsetWidth / 2) - 19;
				
				var cv = (this.value - this.min) * (totalpx / (this.max - this.min));
				//console.log(totalpx, this.min, this.max, this.value, cv, Math.floor(cv));
				
				left = Math.round(cv);
				//console.log(this.value, left);
				this.moving(left);
			}
		},		
		moving: function(ax, ms, easing) {
			ms = ms || 0;
			var kw = this.knob.offsetWidth;
			var ew = this.el.offsetWidth;
			var sg = this.sguide;
			var ks = this.knob;
			var left = w = 0;
			//console.log(ax, kw, kw);
			if( ax >= 8 && ax <= (ew - (kw  / 2) - 19) ) {
				left = ax;
				w = ax;
			} else if( ax < 8 ) {
				left = 8;
				w = 0;
			} else if( ax > (ew - (kw  / 2) - 19) ) {
				left = (ew - (kw  / 2) - 19);
				w = (ew - (kw  / 2) - 19);
			}
			
			sg.style.width = w + 'px';
			ks.style.left = left + 'px';

			/*if(ms !== 0) ks.style[P_S3 + 'Transition'] = P_C3 + 'transform ' + ms + 'ms ' + (easing || '');
			else ks.style[P_S3 + 'Transition'] = '';
			ks.style[P_S3 + 'Transform'] = 'translate3d(' + (left ? left + 'px' : 8) + ',0,0)';*/
		},
		_make: function() {
			var o = this.options;
			var self = this;

			this.el.innerHTML = '';

			var guide = this.guide = document.createElement('div');
			guide.className = 'guide';

			var sguide = this.sguide = document.createElement('div');
			sguide.className = 'sguide';
			guide.appendChild(sguide);

			var knob = this.knob = document.createElement('div');
			knob.className = 'knob';

			this.el.appendChild(guide);			
			this.el.appendChild(knob);
			
			if( this.a1 ) this.a1.clear();
			if( this.a2 ) this.a2.clear();
			if( this.a3 ) this.a3.clear();

			this.a1 = new UI.AdvancedEvent(null, this.el, {
				tap: function(cmp, e) {
					if( self._dragging === false && e.target != self.knob) {
						var p = (e.touches ? e.touches[0] : e) || e;
						var ax = p.offsetX;
						//console.log('tap', self._dragging, ax, e.target);
						self.moving(ax, 220);
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				}
			});

			this.a2 = new UI.AdvancedEvent(null, knob, {
				dragstart: function(cmp, e) {
					self._dragging = true;
				},
				dragend: function(cmp, e, x, y, mx, my, ox, oy) {
					if( self._dragging) {
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				}
			});
			
			this.a3 = new UI.AdvancedEvent(null, document.body, {
				drag: function(cmp, e, x, y, mx, my, ox, oy) {
					if( self._dragging && self.isShow ) {
						var ax = self.knob.offsetLeft + mx;
						self.moving(ax);
					}
				},
				touchend: function() {
					if( self._dragging) {
						self.calulateValue();
						self.fire('changed', self, self.value);
					}
					self._dragging = false;
				},
				mouseout: function() {
					//self._dragging = false;
				}
			});

			var self = this;
			window.removeEventListener('resize', this);
			window.addEventListener('resize', this);
		},
		
		handleEvent: function(e) {
			if( e.type == 'resize' ) this.syncKnob();
		},

		destroy: function() {
			if( this.a1 ) this.a1.clear();
			if( this.a2 ) this.a2.clear();
			if( this.a3 ) this.a3.clear();

			this.parent();
		},

		show: function(m,fn) {
			var o = this.options;
			var self = this;
			this.parent(m,function() {
				setTimeout(function() {
					self.syncKnob();
				}, 150)
			});
		},

		calulateValue: function() {
			if( this.knob ) {
				var totalpx = this.el.offsetWidth - (this.knob.offsetWidth / 2) - 19 - 8;
				var percentage = (this.knob.offsetLeft - 8) / (totalpx / (this.max - this.min));
				var cv = (this.max - this.min) * (percentage / (this.max - this.min));

				this.value = this.min + cv;
				var round = parseInt(Math.round(this.value / this.atomic));
				this.value = (round * this.atomic);

				//console.log(this.value, percentage, this.atomic, (round * this.atomic));

				this.syncKnob();
			}
		},

		setValue: function(value) {
			if( ! value ) return;
			this.value = value;

			if( this.value < this.min ) this.value = this.min;
			if( this.value > this.max ) this.value = this.max;

			//console.log(value, this.value);

			this.syncKnob();
		},

		getValue: function() {
			if( !this.knob ) return this.value;

			this.calulateValue();
			return this.value;
		}
	};


	Slider.style = {
		'position': 'relative',
		'padding': '14px',

		'.guide': {
			'height': '8px',
			'border-radius': '20px',
			'border': '1px solid rgba(176,176,176,1)',
			'background-color': 'white',
			'box-shadow': 'inset 0 2px 5px rgba(145,145,145,0.7)',
			'box-sizing': 'border-box',
			'overflow': 'hidden'
		},
		'.sguide': {
			'margin': '14px',
			'position': 'absolute',
			'width': '0',
			'top': '0',
			'left': '0',
			'height': '6px',
			'border-radius': '20px',
			'border': '1px solid rgba(176,176,176,1)',
			'background-color': 'rgba(233,46,0,0.9)',
			'box-shadow': 'inset 0 2px 5px rgba(145,145,145,0.7)'
		},
		'.knob': {
			'position': 'absolute',
			'top': '7px',
			'left': '7px',
			'width': '22px',
			'height': '22px',
			'border-radius': '20px',
			'border': '1px solid rgba(157,157,157,1)',
			'background-color': 'white',
			'background-image ': 'gradient(linear, 0% 0%, 0% 100%, color-stop(0%, rgba(210,210,210,1)), color-stop(100%, rgba(210,210,210,0)))',
			'box-shadow': 'inset 0 1px rgba(255,255,255,1)'
		}
	};

	return Slider = UI.inherit(Slider, UI.Component);
})();

UI.Slider = UI.component('slider', UI.Slider);
// EOF of UI.Slider.js [attrs.ui-0.6.0]

// UI.Switch.js [attrs.ui-0.6.0]
UI.Switch = (function() {
	"use strict"

	function Switch(options) {
		this.$super(options);
	}

	Switch.prototype = {
		build: function() {
			// TODO
		}
	};

	return Switch = UI.inherit(Switch, UI.Component);
})();

UI.Switch = UI.component('switch', UI.Switch);
// EOF of UI.Switch.js [attrs.ui-0.6.0]

// UI.List.js [attrs.ui-0.6.0]
UI.List = (function() {
	function List(options) {
		this.$super(options);
	}

	List.prototype = {
		build: function() {
			var o = this.options;
			this.innerborder(o.innerborder);

			// attach events
			this.on('add', function(e) {
				var item = e.item;
				if( item instanceof UI.Component ) return;

				e.item = new UI.ListItem(item);
			});

			this.on('added', function(e) {
				e.item.attachTo(this);
			});

			this.on('remove', function(e) {
				e.item.detach();
			});

			this.$super();
		},
		innerborder: function(innerborder) {
			if( !arguments.length ) return this.el.hc('innerborder');

			if( innerborder === false ) this.el.rc('innerborder');
			else this.el.ac('innerborder');

			return this;
		}
	};

	List.style = {
		'position': 'relative',
		'border': '1px solid #d9d9d9',

		'> .clickable:hover': {
			'background-color': '#d9d9d9'
		},
		'> .clickable:hover .separator': {
			'background-color': '#d9d9d9'
		},
		
		'..innerborder > .a-cmp': {			
			'border-bottom': '1px solid #d9d9d9'
		},
		'..innerborder > .a-cmp:last-child': {			
			'border-bottom': 'none'
		},
		'..dark': {
			'background-color': '#232323',
			'color': '#fcfcfc',
			'border': 'none',

			'> .clickable:hover': {
				'background-color': '#6A5A8C'
			},
			'> .clickable:hover .separator': {
				'background-color': '#6A5A8C'
			},
			
			'..innerborder > .a-cmp': {			
				'border-bottom': '1px solid #2e2e2e'
			},
			'..innerborder > .a-cmp:last-child': {			
				'border-bottom': 'none'
			}
		}
	};

	return List = UI.inherit(List, UI.SelectableContainer);
})();

UI.List = UI.component('list', UI.List);
// EOF of UI.List.js [attrs.ui-0.6.0]

// UI.ListItem.js [attrs.ui-0.6.0]
UI.ListItem = (function() {
	"use strict"

	var icons = {
		'heart': 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMyIDMyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJoZWFydCI+DQoJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNmZmZmZmQiIGQ9Ik0yOS4xOTMsNS4yNjVjLTMuNjI5LTMuNTk2LTkuNDMyLTMuNjcxLTEzLjE5MS0wLjI4OA0KCQlDMTIuMjQyLDEuNTk0LDYuNDQxLDEuNjY5LDIuODEsNS4yNjVjLTMuNzQxLDMuNzA0LTMuNzQxLDkuNzA5LDAsMTMuNDE1YzEuMDY5LDEuMDU5LDExLjA1MywxMC45NDEsMTEuMDUzLDEwLjk0MQ0KCQljMS4xODMsMS4xNzIsMy4wOTYsMS4xNzIsNC4yNzgsMGMwLDAsMTAuOTMyLTEwLjgyMiwxMS4wNTMtMTAuOTQxQzMyLjkzNiwxNC45NzQsMzIuOTM2LDguOTY5LDI5LjE5Myw1LjI2NXogTTI3Ljc2OCwxNy4yNjgNCgkJTDE2LjcxNSwyOC4yMDljLTAuMzkzLDAuMzkxLTEuMDM0LDAuMzkxLTEuNDI1LDBMNC4yMzcsMTcuMjY4Yy0yLjk1LTIuOTItMi45NS03LjY3MSwwLTEwLjU5MQ0KCQljMi44NDQtMi44MTUsNy40MTYtMi45MTQsMTAuNDA5LTAuMjIybDEuMzU2LDEuMjJsMS4zNTUtMS4yMmMyLjk5NC0yLjY5Miw3LjU2Ni0yLjU5NCwxMC40MSwwLjIyMg0KCQlDMzAuNzE3LDkuNTk2LDMwLjcxNywxNC4zNDcsMjcuNzY4LDE3LjI2OHoiLz4NCgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZmZmZCIgZD0iTTkuMjUzLDcuNTAxYy0wLjAwMiwwLTAuMDAyLDAuMDAxLTAuMDA0LDAuMDAxDQoJCWMtMi4zNDUsMC4wMDItNC4yNDYsMS45MDMtNC4yNDYsNC4yNDlsMCwwYzAsMC4yNzYsMC4yMjQsMC41LDAuNSwwLjVzMC41LTAuMjI0LDAuNS0wLjVWMTEuNzVjMC0xLjc5NCwxLjQ1NS0zLjI0OSwzLjI0OS0zLjI0OQ0KCQloMC4wMDFjMC4yNzYsMCwwLjUtMC4yMjQsMC41LTAuNVM5LjUzLDcuNTAxLDkuMjUzLDcuNTAxeiIvPg0KPC9nPg0KPC9zdmc+DQo='
	};
	
	// private
	function makeup(item) {
		var html =  
			'<div class="row">' +
				'<div class="cell">' +
					'<div class="icon">' +
						'<img alt="" src="" />' + 
					'</div>' +
				'</div>' +
				'<div class="separator"></div>' +
				'<div class="cell auto">' +
					'<div class="text">' +
						'<div class="title">' + (item.title() || '') + '</div>' +
						'<div class="description">' + (item.description() || '') + '</div>' +
					'</div>' +
				'</div>' +
				'<div class="cell">' +
					'<div class="round">10</div>' +
				'</div>' +
				'<div class="cell">' +
					'<div class="arrow"></div>' +
				'</div>' +
			'</div>';

		return html;
	}

	
	// class ListItem
	function ListItem(options) {
		this.$super(options);
	}
	
	ListItem.prototype = {
		build: function() {
			var o = this.options;
			this.title(o.title);
			this.description(o.description);
			this.icon(o.icon);
			this.thumnail(o.thumnail);
			this.roundtext(o.roundtext);
			this.sidetext(o.sidetext);
			this.arrow(o.arrow);

			this._ready = true;

			this.el.html(makeup(this));
		},
		title: function(title) {
			if( !arguments.length ) return this._title;

			if( typeof(title) === 'string' ) this._title = title;
			else if( !title ) return this;
			else console.error('WARN:illegal title(string)', title);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		description: function(description) {
			if( !arguments.length ) return this._description;

			if( typeof(description) === 'string' ) this._description = description;
			else if( !description ) return this;
			else console.error('WARN:illegal description(string)', description);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		icon: function(icon) {
			if( !arguments.length ) return this._icon;

			if( typeof(icon) === 'string' ) this._icon = icon;
			else if( !icon ) return this;
			else console.error('WARN:illegal icon(string)', icon);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		thumnail: function(thumnail) {
			if( !arguments.length ) return this._thumnail;

			if( typeof(thumnail) === 'string' ) this._thumnail = thumnail;
			else if( !thumnail ) return this;
			else console.error('WARN:illegal thumnail(string)', thumnail);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		roundtext: function(roundtext) {
			if( !arguments.length ) return this._roundtext;

			if( typeof(roundtext) === 'string' ) this._roundtext = roundtext;
			else if( !roundtext ) return this;
			else console.error('WARN:illegal roundtext(string)', roundtext);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		sidetext: function(sidetext) {
			if( !arguments.length ) return this._sidetext;

			if( typeof(sidetext) === 'string' ) this._sidetext = sidetext;
			else if( !sidetext ) return this;
			else console.error('WARN:illegal sidetext(string)', sidetext);

			if( this._ready ) this.el.html(makeup(this));

			return this;
		},
		arrow: function(arrow) {
			if( !arguments.length ) return this._arrow;

			if( arrow === false ) this._arrow = false;
			else this._arrow = true;
			return this;
		}
	};
	
	ListItem.style = {
		'display': 'table',
		'width': '100%',
		'height': 38,
		'background-color': 'transparent',

		'> .row': {
			'display': 'table-row'
		},
		'> .row > .cell': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'vertical-align': 'middle',
			'width': '1px'
		},
		'> .row > .separator': {
			'display': 'table-cell',
			'background-color': '#e9e9e9',
			'width': '1px'
		},
		'> .row > .cell.auto': {
			'width': 'auto'
		},


		/* icon */
		'> .row > .cell > .icon': {
			'margin': '0 8px',
			'margin-top': '2px',
			'width': '22px'
		},
		'> .row > .cell > .icon img': {
			'width': '22px'
		},
		
		/* thumnail */
		'> .row > .cell > .thumnail': {
			'padding': '5px',
			'overflow': 'hidden'
		},
		'> .row > .cell > .thumnail img': {
			'width': '30px',
			'height': '30px'
		},
		'> .row > .cell > .text': {
			'padding': '4px 6px'
		},
		'> .row > .cell > .title': {
			'font-weight': 'bold',
			'font-size': '1em'
		},
		'> .row > .cell > .description': {
			'font-weight': 'bold',
			'font-size': '0.9em',
			'color': '#959595'
		},
		'> .row > .cell > .round': {
			'margin-left': '4px',
			'font-size': '1em',
			'font-weight': 'bold',
			'background': '#888',
			'color': 'white',
			'padding': '1px 8px 2px',
			'margin-top': '-1px'
		},
		'> .row > .cell > .arrow': {
			'margin': '0 10px',
			'width': '9px',
			'height': '13px',
			'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABGklEQVQ4jbXULW7DMBQHcK+jiTYpZCcwXXGQUaQBS4ODRfExco0mZHQkFwjyAQw6VgV5KCFPShWDKaQlTZU5H6vt9iFbfv7Jlv42QvcqSumGc95gjNdOiBDiKIQ4WmNDxAZ76Aec88bzvCe9oSzLb8YYadu2WYJW/SCOY6KUOugNGOPXNE257/vPV53ovGmdZRm3OdnjcAIAtZRyH0XRh94YBMFLGIZvRVF8dV33uwghhJCUcl9V1Q8h5N0EG0Hna+xMsUnIBpuFTLFF6Fosz/PtamqzTf0LUUo3SZJ8Tq312UJIC6QN0gd0FjJBZiFTZBKyQUaQy6O9QC7IH8j1Y7skGwBqPb1KqQNjjABAvYSM6iaf/xBzRlzqBKp+G8ywLRSzAAAAAElFTkSuQmCC)',
			'background-repeat': 'no-repeat no-repeat',
			'background-size': '9px 13px'
		},
		
		'..dark': {
			'display': 'table',
			'width': '100%',
			'height': 38,
			'background-color': 'transparent',

			'> .row': {
				'display': 'table-row'
			},
			'> .row > .cell': {
				'display': 'table-cell',
				'box-sizing': 'border-box',
				'vertical-align': 'middle',
				'width': '1px'
			},
			'> .row > .separator': {
				'display': 'table-cell',
				'background-color': '#2e2e2e',
				'width': '1px'
			},
			'> .row > .cell.auto': {
				'width': 'auto'
			},


			/* icon */
			'> .row > .cell > .icon': {
				'margin': '0 8px',
				'margin-top': '2px',
				'width': '22px'
			},
			'> .row > .cell > .icon img': {
				'width': '22px'
			},
			
			/* thumnail */
			'> .row > .cell > .thumnail': {
				'padding': '5px',
				'overflow': 'hidden'
			},
			'> .row > .cell > .thumnail img': {
				'width': '30px',
				'height': '30px'
			},
			'> .row > .cell > .text': {
				'padding': '4px 6px'
			},
			'> .row > .cell > .title': {
				'font-weight': 'bold',
				'font-size': '1em'
			},
			'> .row > .cell > .description': {
				'font-weight': 'bold',
				'font-size': '0.9em',
				'color': '#959595'
			},
			'> .row > .cell > .round': {
				'margin-left': '4px',
				'font-size': '1em',
				'font-weight': 'bold',
				'background': '#6b5b8c',
				'color': 'white',
				'padding': '1px 8px 2px',
				'margin-top': '-1px'
			},
			'> .row > .cell > .arrow': {
				'margin': '0 10px',
				'width': '9px',
				'height': '13px',
				'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABGklEQVQ4jbXULW7DMBQHcK+jiTYpZCcwXXGQUaQBS4ODRfExco0mZHQkFwjyAQw6VgV5KCFPShWDKaQlTZU5H6vt9iFbfv7Jlv42QvcqSumGc95gjNdOiBDiKIQ4WmNDxAZ76Aec88bzvCe9oSzLb8YYadu2WYJW/SCOY6KUOugNGOPXNE257/vPV53ovGmdZRm3OdnjcAIAtZRyH0XRh94YBMFLGIZvRVF8dV33uwghhJCUcl9V1Q8h5N0EG0Hna+xMsUnIBpuFTLFF6Fosz/PtamqzTf0LUUo3SZJ8Tq312UJIC6QN0gd0FjJBZiFTZBKyQUaQy6O9QC7IH8j1Y7skGwBqPb1KqQNjjABAvYSM6iaf/xBzRlzqBKp+G8ywLRSzAAAAAElFTkSuQmCC)',
				'background-repeat': 'no-repeat no-repeat',
				'background-size': '9px 13px'
			}
		}
	};

	return ListItem = UI.inherit(ListItem, UI.Component);
})();

UI.ListItem = UI.component('list-item', UI.ListItem);
// EOF of UI.ListItem.js [attrs.ui-0.6.0]

// UI.Table.js [attrs.ui-0.6.0]
UI.Table = (function() {
	function Table(options) {
		this.$super(options);
	}

	Table.prototype = {
		build: function() {
			var o = this.options;


			// create header & body
			var body = this._body = new UI.TableBody(o.body || {});			
			var header = this._header = new UI.TableHeader(((o.header === false) ? {hidden:true} : (o.header || {})));
			
			// connect header & body
			header.body(body);

			// attach header & body
			header.attachTo(this);
			body.attachTo(this);


			// apply options			
			this.innerborder(o.innerborder);
			this.cols(o.cols);


			// child component cannot connect to this, manually
			this.attachTarget(false);


			// attach events
			this.on('add', function(e) {
				if( typeof(e) !== 'object' || e.item instanceof UI.Component ) return false;				
			});

			this.on('added', function(e) {
				body.add(e.item);
			});

			this.on('removed', function(e) {
				body.remove(e.item);
			});			

			// call super
			this.$super();
		},
		innerborder: function(innerborder) {
			if( !arguments.length ) return this.el.hc('innerborder');

			if( innerborder === false ) this.el.rc('innerborder');
			else this.el.ac('innerborder');

			return this;
		},
		cols: function(cols) {
			if( !arguments.length ) return this._body.cols();
			this._body.cols(cols);
			this._header.sync();
			return this;
		}
	};

	Table.style = {
		'position': 'relative',
		'background-color': '#232323',
		'color': '#fcfcfc'
	};

	return Table = UI.inherit(Table, UI.SelectableContainer);
})();

UI.Table = UI.component('table', UI.Table);
// EOF of UI.Table.js [attrs.ui-0.6.0]

// UI.TableHeader.js [attrs.ui-0.6.0]
UI.TableHeader = (function() {
	"use strict"
		
	// class body
	function TableHeader(options) {
		this.$super(options);
	}
	
	TableHeader.prototype = {
		build: function() {
			var o = this.options;

			this.html('<div class="headers">table header</div>');
		},
		body: function(body) {
			if( !arguments.length ) return this._body;

			if( body instanceof UI.TableBody ) {
				this._body = body;
				this.sync();
			} else {
				console.error('WARN:body must be a TableBody');
			}

			return this;
		},
		sync: function() {
			var cols = this._body && this._body.cols();
			if( cols ) {
				var el = $('<div class="row"></div>');
		
				for(var i=0; i < cols.length; i++) {
					var col = cols[i];
					var name = col.name;
					var translator = col.value;
					
					var cell = el.create('<div class="cell"></div>');

					if( translator === 'separator' ) cell.ac('separator');

					if( col.width ) cell.style('width', col.width);
					if( col.label ) cell.html(col.label);
					if( col.padding ) cell.style('padding', col.padding);
					if( typeof(col.style) === 'object' ) cell.style(col.style);
					if( col.align === 'center' ) cell.style('text-align', 'center');
					else if( col.align === 'right' ) cell.style('text-align', 'right');
					else if( !col.align ) cell.style('text-align', 'center');
				}

				this.el.html(false);
				this.el.attach(el);
			}

			return this;
		}
	};
	
	TableHeader.style = {
		'display': 'table',
		'table-layout': 'fixed',
		'border-style': 'none',
		'border-spacing': 0,
		'padding': 0,
		'width': '100%',
		'background-color': 'transparent',

		'> .row': {
			'display': 'table-row'
		},
		'> .row > .cell': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'overflow': 'hidden',
			'vertical-align': 'middle',
			'border-bottom': '1px solid #2e2e2e',
			'width': 'auto',
			'height': 38,
			'font-weight': 'bold'
		},		
		'> .row > .cell.separator': {
			'background-color': '#2e2e2e',
			'width': '1px'
		}
	};

	return TableHeader = UI.inherit(TableHeader, UI.Component);
})();

UI.component('table.header', UI.TableHeader);
// EOF of UI.TableHeader.js [attrs.ui-0.6.0]

// UI.TableBody.js [attrs.ui-0.6.0]
UI.TableBody = (function() {
	"use strict"
		
	var translators = {
		seq: function(el, value, index, col, item) {
			el.html(index + '');
		},
		separator: function(el, value) {
			el.ac('separator');
		},
		currency: function(el, value) {
			if( typeof(value) === 'number' ) value = parseInt(value);
			if( isNaN(value) ) return;

			el.html(Util.currency(value, false));
		},
		stringify: function(el, v) {
			if( typeof(v) === 'object' ) el.html(JSON.stringify(v, null, '\t'));
			else if( typeof(v) === 'function' ) el.html(v.toString());
			else if( typeof(v) === 'boolean' ) el.html(v);
			else if( typeof(v) === 'number' ) el.html(v);
			else el.html(v || '');
		},
		image: function(el, v) {
			if( typeof(v) === 'string' ) el.html('<img src="' + v + '" style="display:block;height:100%;" />');
		},
		date: function(el, v, index, col, item) {
			var date;
			if( typeof(v) === 'number' ) date = new Date(v);
			else if( typeof(v) === 'string' ) date = new Date(v);
			else if( v instanceof Date ) date = v;

			if( date ) el.html( DateUtil.format(date, (col.format || 'yyyy.mm.dd')) );
		}
	};

	// private
	function makerow(item) {
		var el = $('<div class="row"></div>');
		
		var cols = this.cols();
		var index = this.indexOf(item) + 1;
		if( cols ) {
			for(var i=0; i < cols.length; i++) {
				var col = cols[i];
				var name = col.name;
				var value = item[name];
				var translator = col.value;
				if( typeof(translator) === 'string' ) translator = translators[translator];
				
				var cell = el.create('<div class="cell"></div>');
				if( col.width ) cell.style('width', col.width);
				if( col.height ) cell.style('height', col.height);
				if( col.padding ) cell.style('padding', col.padding);
				if( col.bold ) cell.style('font-weight', 'bold');
				if( col.empty ) cell.html(col.empty);
				if( typeof(col.style) === 'object' ) cell.style(col.style);
				if( col.align === 'center' ) cell.style('text-align', 'center');
				else if( col.align === 'right' ) cell.style('text-align', 'right');

				if( typeof(translator) === 'function' ) {
					translator.apply(this, [cell, value, index, col, item]);
				} else if( value instanceof UI.Component ) {
					cell.html(false);
					value.attachTo(cell);
				} else if( value instanceof EL ) {
					cell.html(false);
					cell.attach(value);
				} else if( EL.isElement(value) ) {
					cell.html(false);
					cell.attach(value);
				} else if( value ) {
					cell.html(value);
				}
			}
		}

		return el;
	}

	
	// class TableBody
	function TableBody(options) {
		this.$super(options);
	}
	
	TableBody.prototype = {
		build: function() {
			var o = this.options;
			if( o.cols ) this.cols(o.cols);
			
			// events
			this.on('add', function(e) {
				if( typeof(e) !== 'object' || e.item instanceof UI.Component ) return false;
			});

			this.on('added', function(e) {
				var o = e.item;
				var row = makerow.call(this, o);
				o.row = row;
				this.el.attach(row);
			});

			this.on('removed', function(e) {
				var o = e.item;
				var row = o.row;
				if( row ) row.detach();
			});
		},
		col: function(name) {
			return this._columns && this._columns[name];
		},
		cols: function(cols) {
			if( !arguments.length ) return this._cols;	
			
			if( Array.isArray(cols) ) {
				var columns = {};
				if( cols ) {
					for(var i=0; i < cols.length; i++) {
						var col = cols[i];
						if( typeof(col) !== 'object' || !col.name || typeof(col.name) !== 'string' ) {
							//console.error('invalid column:', col);
							continue;
						}

						columns[col.name] = col;
					}
				}

				this._cols = cols;
				this._columns = columns;
			} else {
				console.error('WARN:illegal cols(array)', cols);
			}

			return this;
		}
	};
	
	TableBody.style = {
		'display': 'table',
		'table-layout': 'fixed',
		'border-style': 'none',
		'border-spacing': 0,
		'padding': 0,
		'width': '100%',
		'background-color': 'transparent',

		'> .row': {
			'display': 'table-row'
		},
		'> .row > .cell': {
			'display': 'table-cell',
			'box-sizing': 'border-box',
			'overflow': 'hidden',
			'vertical-align': 'middle',
			'border-bottom': '1px solid #2e2e2e',
			'width': 'auto',
			'height': 38
		},
		'> .row > .cell.separator': {
			'background-color': '#2e2e2e',
			'width': '1px'
		},

		// hover
		'> .row:hover': {
			'background-color': '#6A5A8C'
		}, 
		'> .row:hover > .cell': {
			'border-bottom': '1px solid #6A5A8C'
		}, 
		'> .row:hover > .cell.separator': {
			'background-color': '#7A6A9C'
		}
	};

	return TableBody = UI.inherit(TableBody, UI.Container);
})();

UI.TableBody = UI.component('table.body', UI.TableBody);
// EOF of UI.TableBody.js [attrs.ui-0.6.0]

// EOF.js [attrs.ui-0.6.0]
	// ends of class definitions

	// hash controller start
	HashController.start();

	// bundle require binding
	Require.defines({
		"util": Util,
		"color": Color,
		"document": document,
		"class": Class,
		"style.system": StyleSystem,
		"hash": HashController,
		"ui": UI,
		"dom": function(module) {  module.exports = $; },
		"el": function(module) {  module.exports = EL; },
		"style": function(module) {  module.exports = Style; },
		"theme": function(module) {  module.exports = Theme; },
		"buildinfo": __build_info__
	});

	// build style sheet
	//StyleSystem.initialize();

	UI.on = $.on;
	UI.un = $.un;
	
	// mark build time
	__build_info__.buildtime = (__build_info__.finishtime = new Date().getTime()) - __build_info__.starttime;

	//UI.debug = true;
})();

// End Of File (attrs.ui.js), Authored by joje(joje.attrs@gmail.com)

// EOF of EOF.js [attrs.ui-0.6.0]

