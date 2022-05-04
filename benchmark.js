let Benchmark = require("benchmark");
let Decimal = require("./index");

const suite = new Benchmark.Suite();
suite
	.add("Exponentiation", Decimal.exponentiation(1.3267, 20))
	.on("complete", function () {
		this.forEach((result) =>
			console.log(
				`${result.name} averaged ${
					result.stats.mean * 1000
				} milliseconds.`
			)
		);
	})
    .run()
