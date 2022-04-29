# js-decimals

This repo is for handling floating point decimals in JavaScript while maintaining accuracy.

It is a known feature of programming languages that expressing any float which cannot be represented in binary leads to inaccuracy:

```js
console.log(0.1 + 0.2)
0.30000000000000004
```

This attempts to overcome that difficulty.

Other libraries perform similar tasks. This library is small, to handle the most basic of tasks. It has two different methodologies: calling a new instance of the Decimal object allows the user to store changes to the value after the operation, whereas calling the static Decimal methods do not change any variables.

***PLEASE NOTE*** This library is currently unergoing unit testing for edge cases. It ought not to be used in production environments. Anyone wishing to test may reach out to me.

## Usage

Accessing the object:
```js
const Decimal = require('js-decimals')
```

All Decimal objects store a value as a string, accessed with .val, and can be accessed as a number with a get function num(). To create a Decimal object, one must call `new Decimal()` with a string or a number:

```js
const abc = new Decimal("16.377654");
const def = new Decimal(15.543)
```

Methods (outlined below) are attached to the object

## Properties

### Val

The value stored in the object, as a string

### Num

Get function, which returns the value stored in the object as a number

### Length

Get function, returns the length of the string, inluding decimal and sign

#### numLength

Get function which returns the length minus the decimal and sign, if any.

#### decimalLength

Get function returning the length of the decimal values.

## Methods

All methods which involve a mathematical operation can take a string, number, or another Decimal object. In addition each of the operations can take two forms: first, by calling a new instance of the Decimal object, as seen below: 

```js
const b = new Decimal("-3.45");
const a = new Decimal("4.97");
b.add(a);
b.add("4.97");
b.add(4.97)
```

Each of the three manners above will work identically. Second, we can call a static method from the Decimal object directly:

```js
Decimal.addition("4.97", -3.45)
const b = new Decimal("-3.45");
const a = new Decimal("4.97");
Decimal.addition(a, b)
```

The former will modify the value stored the object upon which it is called, whereas the second method will not modify any variables.

Those methods which have both will list the method used on the new instance and the static method of the class in that order.

### precision(num, round = true)

Precision takes two parameters. The first is the length of the decimal value, and the second is a boolean (default true) which determines whether or not the last value is rounded. This can also add trailing zeros, but those zeros will be removed during any of the operations.

### isEqual(compare) / equality(first, second)

IsEqual takes one parameter: the number being compared to the Decimal object. It returns a boolean.

Eqaulity takes two parameters: the two numbers being compared.

### add(addend) / addition(addend, addendum) 

Add takes one parameter: the number being added to the Decimal object. It returns the result of the operation and modifies the object.

Addition takes two parameters: the numbers to be added.

### subtract(subtrahend) / subtraction(minued, subtrahend)

Subtract takes one parameter: the number being subtracted from the Decimal object. It returns the result of the operation and modifies the object.

Subtaction takes two variables: the latter is subtracted from the former.

### multiply(multiplier) / multiplication(multiplicand, multiplier)

Multiply takes one parameter: the number being multipplied with the Decimal object. It returns the result of the operation and modifies the object.

Multiplication takes two paramters: the numbers to be multiplied with one another.

### divide(divisor, precision = 10, round = true) / division(dividend, divisor, precision = 10, round = true)

Divide takes 3 parameters:
- divisor: the number to divide by
- precision: how long the decimal point should be
- round: determines whether the last digit should be rounded or truncated

It returns the result of the operation and modifies the object.

Division takes the addition parameter of the dividend, the number to be divided

### exponentiate(exponent) / exponentiation(base, exponent)

***Currently only handles postive integers***

Exponentiate takes one parameter: the value representing the power to which the value of the Decimal object is to be raised. It returns the result of the operation and modifies the object.

Exponentiation takes the base in addition to the exponent.

## Contact
- Email: christopher.backes@gmail.com
- GitHub: https://github.com/chris-backes
