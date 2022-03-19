# Decimals Library

This repo is for handling floating point decimals in JavaScript while maintaining accuracy.

It is a known feature of programming languages that expressing any float which cannot be represented in binary leads to inaccuracy:
```js
console.log(0.1 + 0.2)
0.30000000000000004
```
This attempts to overcome that difficulty.

The project is still incomplete, and is not as good as other libraries which handle the task (https://www.npmjs.com/package/js-big-decimal).

There is no illusion that this will ever be superior; it is just a side project of mine.

## Usage

All Decimal objects store a value as a string, accessed with .val, and can be accessed as a number with a get function number(). To create a Decimal object, one must call new Decimal() with a string or a number:
```js
const abc = new Decimal("16.377654");
const def = new Decimal(15.543)
```

Methods (outlined below) are attached to the object

## Methods

### Precision(num, round = true)

Precision() takes two parameters. The first is the length of the decimal value, and the second is a boolean (default true) which determines whether or not the last value is rounded. This can also add trailing zeros.

### Add(num)
** Currently cannot handle negative values **
Add takes one parameter: the number being added to the Decimal object. It can be a string or a number (integer or float). It returns the answer, and modifies the Decimal object value.

### Subtract(num)
** Currently cannot handle negative values **
Subtract takes one parameter: the number being subtracted from the Decimal object. It can be a string or a number (integer or float). It returns the difference, and modifies the Decimal object value.

### Multiply(num)
Multiply takes one parameter: the number being multipplied with the Decimal object. It can be a string or a number (integer or float). It returns the product, and modifies the Decimal object value.

### Division
Division currently does not work.