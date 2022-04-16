//Each method accepts Decimal objects, strings, or numbers. This cleanses the inputs and returns them as strings. Used by all computational methods, either directly (other static methods) or indirectly (the inherited methods).
/**
 * @throws Error if string is not float
 * @param {*} num
 * @returns {string} string
 */
function cleanseStr(num) {
	if (num instanceof Decimal) {
		//allows access to other decimal object
		num = num.val;
	}
	if (typeof num !== "string") {
		num = num.toString();
	}
	if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {
		throw new Error("Parameter is not a float");
	}
	while (num.charAt(num.length - 1) === "0") {
		num = num.substring(0, num.length - 1);
	}
	if (num.charAt(0) === ".") {
		num = "0" + num
	}
	return num;
}
/**
 *
 * @throws Error if string is not a float
 * @param {*} num
 * @returns {number}
 */
function cleanseNum(num) {
	if (num instanceof Decimal) {
		return num.num;
	} else if (typeof num === "string") {
		if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {
			throw new Error("Parameter is not a float");
		}
		return parseFloat(num);
	} else if (typeof "number") {
		return num;
	} else {
		throw new Error("Parameter is not a float");
	}
}
function chopZeros(val) {
	while (val.charAt(val.length - 1) === "0") {
		val = val.substring(0, val.length - 1);
	}
	if (val.charAt(val.length - 1) === ".")
		val = val.substring(0, val.length - 1);
	return val;
}

/**
 * Creates a new Decimal
 * @class
 */
class Decimal {
	constructor(val) {
		this.val = typeof val === "string" ? val : val.toString(); //sanitizing
	}
	get num() {
		//get function to return as number
		return parseFloat(this.val);
	}
	get decimalLength() {
		//gets length of string after the the decimal
		let res = this.val.length - this.val.indexOf(".") - 1;
		return res === this.val.length ? 0 : res;
	}
	get numLength() {
		//gets length of the num, minus deimal point and sign
		let carry = 0;
		if (this.val.includes("-")) carry++;
		if (this.val.includes(".")) carry++;
		return this.val.length - carry;
	}
	get length() {
		// gets length of the string
		return this.val.length;
	}

	/**
	 *
	 * @param {string} num
	 * @param {boolean} round
	 * @returns {string}
	 */
	precision(num, round = true) {
		let [int, mant] = this.val.split(".");
		let carry = false;
		if (mant.length < num) {
			return this.val;
		}
		while (mant.length < num) {
			mant = mant.concat("0");
		}
		while (mant.length > num) {
			if (parseInt(mant.charAt(mant.length - 1)) > 4) {
				carry = true;
			} else {
				carry = false;
			}
			mant = mant.substring(0, mant.length - 1);
		}
		if (round && carry) {
			let temp = (parseInt(mant.charAt(mant.length - 1)) + 1).toString();
			mant = mant.substring(0, mant.length - 1) + temp;
		}
		this.val = int + "." + mant;
		return this.val;
	}
	//Static method allows dual syntax of Decimal.addition("1.5", "2.3") and let a = new Decimal("1.5") / a.add("2.3")\
	//Static methods are called by the class
	static equality(first, second) {
		first = cleanseNum(first);
		second = cleanseNum(second);
		return first === second;
	}
	isEqual(compare) {
		return this.num === cleanseNum(compare);
	}
	/**
	 *
	 * @param {*} addend
	 * @param {*} addendum
	 * @returns {string}
	 */
	static addition(addend, addendum) {
		// data cleansing
		addendum = cleanseStr(addendum);
		addend = cleanseStr(addend);
		while (addend.charAt(addend.length - 1) === "0") {
			addend = addend.substring(0, addend.length - 1);
		}
		while (addendum.charAt(addendum.length - 1) === "0") {
			addendum = addendum.substring(0, addendum.length - 1);
		}
		// separating out the numbers into the integer and decimal values
		let [int1, mant1] = addend.split(".");
		let [int2, mant2] = addendum.split(".");

		// the length values get used in two different ways
		let x = mant1.length;
		let y = mant2.length;
		// We need to know the length of the longer decimal
		let p = x > y ? x : y;
		let n = 10 ** p;
		let m = 10 ** Math.abs(x - y);
		// // we need to append the sign after getting the length vals, else p will be wrong
		if (int1.charAt(0) === "-") mant1 = "-" + mant1;
		if (int2.charAt(0) === "-") mant2 = "-" + mant2;
		// x and y get used to correct for longer or shorter decimals
		mant1 = parseInt(mant1);
		mant2 = parseInt(mant2);
		if (x > y) {
			mant2 = mant2 * m;
		} else if (x < y) {
			mant1 = mant1 * m;
		}
		let mant = mant1 + mant2;
		let carry = 0;
		//If both are positive
		if (mant >= n && int1.charAt(0) !== "-" && int2.charAt(0) !== "-") {
			mant = mant - n;
			carry = 1;
		}
		//if both are negative all of this should be redundant with the rewrite
		let special = "blank";
		if (
			Math.abs(mant) >= n &&
			int1.charAt(0) === "-" &&
			int2.charAt(0) === "-"
		) {
			mant = mant + n;
			carry = -1;
		} else if ((int1.charAt(0) === "-" || int2.charAt(0) === "-") && mant) {
			// TO DO: solve the issue of one being negative and one being positive
			let addendumNum = parseInt(addendum);
			let addendNum = parseInt(addend);
			if (Math.abs(addendumNum) === Math.abs(addendNum)) {
				special = "0";
			} else if (Math.abs(addendumNum) > Math.abs(addendNum)) {
				special = Decimal.methodNegPosi();
			} else {
				special = Decimal.methodNegPosi();
			}
		}

		mant = Math.abs(mant).toString();
		// adding leading zeros to decimal
		while (mant.length < p) {
			mant = "0".concat(mant);
		}

		let res =
			(parseInt(int1) + parseInt(int2) + carry).toString() + "." + mant;
		addend = special === "blank" ? res : special;
		return addend;
	}
	//Ordinary methods are called from the instances of the class
	add(num) {
		this.val = Decimal.addition(this.val, num);
		return this.val;
	}
	static subtraction(minued, subtrahend) {
		subtrahend = cleanseStr(subtrahend);
		minued = cleanseStr(minued);
		while (minued.charAt(minued.length - 1) === "0") {
			minued = minued.substring(0, minued.length - 1);
		}
		while (subtrahend.charAt(subtrahend.length - 1) === "0") {
			subtrahend = subtrahend.substring(0, subtrahend.length - 1);
		}
		let [int1, mant1] = minued.split(".");
		let [int2, mant2] = subtrahend.split(".");
		let x = mant1.length;
		let y = mant2.length;
		let n = x > y ? x : y;
		let nPow = 10 ** n;
		let m = Math.abs(x - y);
		mant1 = parseInt(mant1);
		mant2 = parseInt(mant2);
		if (int1.charAt(0) === "-") mant1 *= -1;
		if (int2.charAt(0) === "-") mant2 *= -1;
		let carry = 0;
		m = 10 ** m;
		if (x > y) {
			mant2 = mant2 * m;
		} else if (x < y) {
			mant1 = mant1 * m;
		}
		let mant = mant1 - mant2;
		if (mant >= nPow) {
			mant = mant - nPow;
			carry = 1;
		}
		if (mant < 0) {
			mant = mant + nPow;
			carry = -1;
		}
		mant = Math.abs(mant).toString();
		while (mant.length < n) {
			mant = "0".concat(mant);
		}
		return (
			(parseInt(int1) - parseInt(int2) + carry).toString() + "." + mant
		);
	}
	subtract(num) {
		this.val = Decimal.subtraction(this.val, num);
		return this.val;
	}
	//attempts to implemnet a method which can handle larger numbers
	static multiplication(multiplicand, multiplier) {
		let neg = false;
		multiplier = cleanseStr(multiplier);
		multiplicand = cleanseStr(multiplicand);
		if (multiplicand.charAt(0) === "-") {
			neg = !neg;
			multiplicand = multiplicand.substring(1);
		}
		if (multiplier.charAt(0) === "-") {
			neg = !neg;
			multiplier = multiplier.substring(1);
		}
		if (multiplicand === "0") return "0";
		if (multiplier === "0") return "0;";
		while (multiplicand.charAt(multiplicand.length - 1) === "0") {
			multiplicand = multiplicand.substring(0, multiplicand.length - 1);
		}
		while (multiplier.charAt(multiplier.length - 1) === "0") {
			multiplier = multiplier.substring(0, multiplier.length - 1);
		}
		if (multiplier.length > 8) multiplier = multiplier.substring(0, 8);
		if (multiplicand.length > 8)
			multiplicand = multiplicand.substring(0, 8);
		const x = multiplicand.split(".")[1]?.length ?? 0;
		const y = multiplier.split(".")[1]?.length ?? 0;
		const deci = x + y;

		let first = multiplicand
			.replace(".", "")
			.split("")
			.map((a) => parseInt(a))
			.reverse();
		let second = multiplier
			.replace(".", "")
			.split("")
			.map((a) => parseInt(a))
			.reverse();
		let res = [0];
		for (let i = 0; i < second.length; i++) {
			for (let j = 0; j < first.length; j++) {
				let prod = second[i] * first[j];
				if (res[i + j] !== undefined) {
					res[i + j] = res[i + j] + prod;
				} else {
					res.push(prod);
				}
			}
		}
		let carry = 0;
		for (let i = 0; i < res.length; i++) {
			let curr = res[i] + carry;
			carry = Math.floor(curr / 10);
			res[i] = curr % 10;
		}
		while (res[res.length - 1] === 0) {
			res.pop();
		}
		if (carry !== 0) {
			res.push(carry);
		}
		res = res.reverse().join("");
		let n = res.length - deci;
		if (n >= 0) res = res.substring(0, n) + "." + res.substring(n);
		if (res.charAt(res.length - 1) === ".")
			res = res.substring(0, res.length - 1);
		if (neg) res = "-" + res;
		return res;
	}
	multiply(num) {
		this.val = Decimal.multiplication(this.val, num);
		return this.val;
	}
	/**
	 *
	 * @param {*} dividend
	 * @param {*} divisor
	 * @param {number} prec
	 * @param {boolean} round
	 * @returns {string}
	 * [Called by divide method]{@link Decimal#divide}
	 */
	static division(dividend, divisor, prec = 10, round = true) {
		if (typeof prec !== "number") {
			prec = 10;
		}
		// The function still uses number (w could probably wrap in BigInt to avoid this)
		if (prec > 15) {
			prec = 15;
		}
		let neg = false;
		let proxy = cleanseNum(dividend) / cleanseNum(divisor);
		proxy = proxy.toString().indexOf(".");
		dividend = cleanseStr(dividend);
		divisor = cleanseStr(divisor);
		if (dividend.charAt(0) === "-") {
			neg = !neg;
			dividend = dividend.substring(1);
		}
		if (divisor.charAt(0) === "-") {
			neg = !neg;
			divisor = divisor.substring(1);
		}
		if (dividend === "0") return "0";
		if (divisor === "0") {
			throw new Error("Cannot divide by zero");
		}
		let n =
			divisor.indexOf(".") !== -1
				? divisor.length - divisor.indexOf(".") - 1
				: 0;
		let m =
			dividend.indexOf(".") !== -1
				? dividend.length - dividend.indexOf(".") - 1
				: 0;
		let decimalPointer = n - m;
		if (dividend.indexOf(".") === -1) m = 0;
		if (divisor.indexOf(".") === -1) n = 0;
		divisor = divisor.replace(".", "");
		dividend = dividend.replace(".", "");
		while (n > m) {
			dividend = dividend + "0";
			m++;
		}
		while (m > n) {
			divisor = divisor + "0";
			n++;
		}
		divisor = parseInt(divisor);
		dividend = parseInt(dividend);

		let res = Math.floor(dividend / divisor);
		dividend = dividend % divisor;
		if (neg) {
			res *= -1;
		}
		if (res === 0) {
			res = "0.";
			while (prec > 0 && dividend !== 0) {
				dividend = dividend * 10;
				res = res + Math.floor(dividend / divisor).toString();
				dividend = dividend % divisor;
				prec--;
			}
		} else {
			res = res.toString() + ".";
			while (prec > 0 && dividend !== 0) {
				dividend = dividend * 10;
				res = res + Math.floor(dividend / divisor).toString();
				dividend = dividend % divisor;
				prec--;
			}
		}
		if (round) {
			dividend = dividend * 10;
			if (Math.floor(dividend / divisor) > 4) {
				let temp = parseInt(res.charAt(res.length - 1)) + 1;
				res = res.substring(0, res.length - 1) + temp.toString();
			}
		}
		return res;
	}
	divide(divisor, precision, round) {
		this.val = Decimal.division(this.val, divisor, precision, round);
		return this.val;
	}
	static exponentiation(base, exponent) {
		base = cleanseNum(base);
		exponent = cleanseNum(exponent);
		let res = base;
		if (exponent === 0) return 1;
		if (exponent % 1 === 0 && exponent > 0) {
			while (exponent > 1) {
				res = Decimal.multiplication(res, base);
				exponent--;
			}
		} else {
			throw new Error("I only work for positive integers so far");
		}
		return res;
	}
	exponentiate(exponent) {
		this.val = Decimal.exponentiation(this.val, exponent);
		return this.val;
	}
}

module.exports = Decimal
