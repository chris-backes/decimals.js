const { expect } = require("@jest/globals")
const Decimal = require('../index')

test('checks for leading zero problem in addition', () => {
    const a = new Decimal("0.123")
    const b = new Decimal("000.3456")
    const c = new Decimal(0.45)
    const d = new Decimal(".23")

    expect(a.add(b)).toBe("0.4686")
    expect(a.subtract(b)).toBe("0.123")

    expect(b.add(a)).toBe("0.4686")
    expect(b.subtract(a)).toBe("0.3456")

    expect(Decimal.addition(a, b)).toBe("0.4686")
    expect(Decimal.subtraction(b, a)).toBe("0.2226")

    // expect(b.add(c)).toBe("0.7956")
    // expect(c.add(b)).toBe("0.7956")
    // expect(Decimal.addition(b, c)).toBe("0.7956")
    // expect(c.add(d)).toBe("0.68")
    // expect(d.add(c)).toBe("0.68")
    // expect(Decimal.addition(c, d)).toBe("0.68")
    // expect(d.add(a)).toBe("0.353")
    // expect(a.add(d)).toBe("0.353")
    // expect(Decimal.addition(a, d)).toBe("0.353")

    // expect(a.add(c)).toBe("0.573")
    // expect(c.add(a)).toBe("0.573")
    // expect(Decimal.addition(a, c)).toBe("0.573")
    // expect(b.add(d)).toBe("0.5756")
    // expect(d.add(b)).toBe("0.5756")
    // expect(Decimal.addition(b, d)).toBe("0.5756")
})