class Decimal {
	constructor(val) {
		this.val = typeof val === "string" ? val : val.toString(); //sanitizing
	}
	static cleanse(num) {
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
		return num;
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
	//Static prop allows dual syntax of Decimal.addition("1.5", "2.3") and let a = new Decimal("1.5") / a.add("2.3")
	static addition(addend, addendum) {
		// data cleansing
		addendum = Decimal.cleanse(addendum);
		addend = Decimal.cleanse(addend);
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
	add(num) {
		this.val = Decimal.addition(this.val, num);
		return this.val;
	}
	static subtraction (minued, subtrahend) {
		subtrahend = Decimal.cleanse(subtrahend);
		minued = Decimal.cleanse(minued)
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
		return (parseInt(int1) - parseInt(int2) + carry).toString() + "." + mant;
	}
	subtract(num) {
		this.val = Decimal.subtraction(this.val, num)
		return this.val
	}
	static multiplication(multiplicand, multiplier) {
		let neg = false;
		multiplier = Decimal.cleanse(multiplier);
		multiplicand = Decimal.cleanse(multiplicand);
		if (multiplicand.charAt(0) === "-") {
			neg = !neg;
			multiplicand = multiplicand.substring(1);
		}
		if (multiplier.charAt(0) === "-") {
			neg = !neg;
			multiplier = multiplier.substring(1);
		}
		if (multiplicand === "0") return "0";
		if (multiplier === "0") {
			return 0
		}
		while (multiplicand.charAt(multiplicand.length - 1) === "0") {
			multiplicand = multiplicand.substring(0, multiplicand.length - 1);
		}
		while (multiplier.charAt(multiplier.length - 1) === "0") {
			multiplier = multiplier.substring(0, multiplier.length - 1);
		}
		const first = parseInt(multiplicand.split(".").join(""));
		const second = parseInt(multiplier.split(".").join(""));
		const prod = (first * second).toString();
		const x = multiplicand.split(".")[1]?.length ?? 0;
		const y = multiplier.split(".")[1]?.length ?? 0;
		const deci = prod.length - (x + y);
		let res = prod.slice(0, deci) + "." + prod.slice(deci);
		while (res.charAt(res.length - 1) === "0") {
			res = res.substring(0, res.length - 1);
		}
		if (neg) res = "-" + res;
		return res
	}
	multiply(num) {
		this.val = Decimal.multiplication(this.val, num)
		return this.val
	}
	// divide(divisor, prec = 10) {
	//	if (typeof prec !== "number") {
	// 		prec = 10
	// 	}
	// 	if (divisor instanceof Decimal) {
	// 		divisor = divisor.val;
	// 	}
	// 	if (typeof divisor !== "string") {
	// 		divisor = divisor.toString();
	// 	}
	// 	if (
	// 		!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(divisor)
	// 	) {
	// 		throw Decimal.errorFloat;
	// 	}
	// 	while (this.val.charAt(this.val.length - 1) === "0") {
	// 		this.val = this.val.substring(0, this.val.length - 1)
	// 	}
	// 	while (divisor.charAt(divisor.length - 1) === "0") {
	// 		divisor = divisor.substring(0, divisor.length - 1)
	// 	}
	// 	if (this.val === "0") return "0";
	// 	if (divisor === "0") {
	// 		throw new Error("Cannot divide by zero");
	// 	}
	// 	let n = divisor.length - divisor.indexOf(".") - 1;
	// 	if (divisor.indexOf(".") === -1) n = 0;
	// 	divisor = divisor.replace(".", "");
	// 	console.log(divisor, n);
	// 	let dividend = this.val;
	// 	if (dividend.length < dividend.indexOf(".") + n) {
	// 		console.log(true);
	// 	} else {
	// 		console.log(false);
	// 	}

	// 	divisor = parseInt(divisor);
	// 	let m = dividend.length - dividend.indexOf(".");
	// 	if (dividend.indexOf(".") === -1) dividend = 0;

	// 	throw new Error("I don't work yet");
	// }
	power(exponent) {
		if (exponent instanceof Decimal) {
			exponent = exponent.num;
		}
		if (typeof exponent === "string") {
			if (
				!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)
			) {
				throw Decimal.errorFloat;
			}
			exponent = parseInt(exponent);
		}
		if (typeof exponent !== "number") {
			throw new Error("You must input a number");
		}
		if (exponent % 1 === 0) {
			let base = this.val;
			let n = base.length - base.indexOf(".") - 1;
			if (base.indexOf(".") === -1) n = 0;
			base = base.replace(".", "");
			base = parseInt(base);
			base = base ** exponent;
			base = base.toString();
			let m = base.length - n * 2;
			base = base.substring(0, m) + "." + base.substring(m);
			this.val = base;
		} else {
			exponent = exponent.toString()[(int, mant)] = exponent.split(".");
			int = parseInt(int);
			let base = this.val;
			let n = base.length - base.indexOf(".") - 1;
			if (base.indexOf(".") === -1) n = 0;
			base = base.replace(".", "");
			base = parseInt(base);
			base = base ** int;
			base = base.toString();
			let m = base.length - n * 2;
			base = base.substring(0, m) + "." + base.substring(m);
			this.val = base;
			throw new Error("I only work for integers so far");
		}
		return this.val;
	}
	// root(radical) {
	// 	throw new Error("I don't work yet");
	// }
}

Object.defineProperties(Decimal, {
	sqrt2: {
		value: "1.41421356237",
		writable: false,
		enumerable: false,
		configurable: false,
	},
	sqrt3: {
		value: "1.73205080757",
		writable: false,
		enumerable: false,
		configurable: false,
	},
	sqrt5: {
		value: "2.2360679775",
		writable: false,
		enumerable: false,
		configurable: false,
	},
	sqrt7: {
		value: "2.64575131106",
		writable: false,
		enumerable: false,
		configurable: false,
	},
});

const b = new Decimal("-3.45");
const a = new Decimal("4.97");

console.log(b.subtract(a));
console.log(Decimal.addition("-0.43", "-4.97"));
