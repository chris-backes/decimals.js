class Decimal {
	constructor(val) {
		this.val = typeof val === "string" ? val : val.toString();                      //sanitizing
	}
	get num() {                                                                         //get function to return as num
		return parseFloat(this.val);
	}
    precision(num, round = true) {
        let [int, mant] = this.val.split(".");
        let carry = 0
        if (mant.length === num) {
            return this.val
        }
        while (mant.length < num) {
            mant = mant.concat("0")
        }
        while (mant.length > num) {
            if (parseInt(mant.charAt(mant.length - 1)) > 4) {
                carry = true
            } else {
                carry = false
            }
            mant = mant.substring(0, mant.length - 1)
        }
        if (round && carry) {
            let temp = (parseInt(mant.charAt(mant.length - 1)) + 1).toString()
            mant = mant.substring(0, mant.length - 1) + temp
        }
        this.val = int + "." + mant
        return this.val
    }
	add(num) {
		if (typeof num !== "string") {
			num = num.toString();
		}
		if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {
			throw new Error("Parameter is not a float");
		}
		let [int1, mant1] = this.val.split(".");
		let [int2, mant2] = num.split(".");
		let x = mant1.length;
		let y = mant2.length;
		let n = x > y ? x : y;
		let m = Math.abs(x - y);
		mant1 = parseInt(mant1);
		mant2 = parseInt(mant2);
		n = 10 ** n;
		let carry = 0;
		m = 10 ** m;
		if (x > y) {
			mant2 = mant2 * m;
		} else if (x < y) {
			mant1 = mant1 * m;
		}
		let mant = mant1 + mant2;
		if (mant >= n) {
			mant = mant - n;
			carry = 1;
		}
		this.val =
			(parseInt(int1) + parseInt(int2) + carry).toString() +
			"." +
			mant.toString();
		return this.val;
	}
	subtract(num) {
		if (typeof num !== "string") {
			num = num.toString();
		}
		if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {
			throw new Error("Parameter is not a float");
		}
		let [int1, mant1] = this.val.split(".");
		let [int2, mant2] = num.split(".");
		let x = mant1.length;
		let y = mant2.length;
		let n = x > y ? x : y;
		let m = Math.abs(x - y);
		mant1 = parseInt(mant1);
		mant2 = parseInt(mant2);
		let carry = 0;
		m = 10 ** m;
		if (x > y) {
			mant2 = mant2 * m;
		} else if (x < y) {
			mant1 = mant1 * m;
		}
		let mant = mant1 - mant2;
		if (mant <= 0) {
			mant = mant + n;
			carry = 1;
		}
		mant = mant.toString();
		while (mant.length < n) {
			mant = "0".concat(mant);
		}
		this.val =
			(parseInt(int1) - parseInt(int2) - carry).toString() + "." + mant;
		return this.val;
	}
	multiply(num) {
        let neg = false
		if (typeof num !== "string") {                                                  //sanitizing data
			num = num.toString();
		}
        if (this.val.charAt(0) === "-") {
            neg = !neg
            this.val = this.val.substring(1)
        }
        if (num.charAt(0) === "-") {
            neg = !neg
            num = num.substring(1)
        }
        if (this.val === "0") return "0";
        if (num === "0") {
            this.val = 0
            return this.val
        }
		if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {         //error handler
			throw new Error("Parameter is not a float");
		}
		const first = parseInt(this.val.split(".").join(""));
		const second = parseInt(num.split(".").join(""));
		const prod = (first * second).toString();
		const x = this.val.split(".")[1]?.length ?? 0;
		const y = num.split(".")[1]?.length ?? 0;
		const deci = prod.length - (x + y);
		let res = prod.slice(0, deci) + "." + prod.slice(deci);
		while (res.charAt(res.length - 1) === "0") {
			res = res.substring(0, res.length - 1);
		}
        if (neg) res = "-" + res
		this.val = res;
		return this.val;
	}
	divide(num, prec = 5) {
		if (typeof num !== "string") {
			num = num.toString();
		}
		if (!/[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/.test(num)) {
			throw new Error("Parameter is not a float");
		}
		if (this.val === "0") return "0";
		if (num === "0") {
			throw new Error("Cannot divide by zero");
		}
		let first = parseInt(this.val.split(".").join(""));
		let second = parseInt(num.split(".").join(""));
		let quotFront = Math.floor(first / second);
		let quotBack = first % second;
	}
}

