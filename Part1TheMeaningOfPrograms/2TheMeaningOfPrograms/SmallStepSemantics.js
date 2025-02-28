"use strict";
class SReducible {
}
class SNumber {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return `${this.value}`;
    }
    get reducible() {
        return false;
    }
}
class SAdd extends SReducible {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    toString() {
        return `${this.left} + ${this.right}`;
    }
    get reducible() {
        return true;
    }
    reduce() {
        if (this.left.reducible) {
            return new SAdd(this.left.reduce(), this.right);
        }
        else if (this.right.reducible) {
            return new SAdd(this.left, this.right.reduce());
        }
        else {
            return new SNumber(this.left.value + this.right.value);
        }
    }
}
class SMultiply extends SReducible {
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    toString() {
        return `${this.left} * ${this.right}`;
    }
    get reducible() {
        return true;
    }
    reduce() {
        if (this.left.reducible) {
            return new SMultiply(this.left.reduce(), this.right);
        }
        else if (this.right.reducible) {
            return new SMultiply(this.left, this.right.reduce());
        }
        else {
            return new SNumber(this.left.value * this.right.value);
        }
    }
}
var expression = new SAdd(new SMultiply(new SNumber(5), new SNumber(5)), new SMultiply(new SNumber(6), new SNumber(6)));
console.log(`new SAdd(
  new SMultiply(new SNumber(5), new SNumber(5)), 
  new SMultiply(new SNumber(6), new SNumber(6))
) = `, expression.toString());
console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce();
console.log('expression.reduce(): ', expression.toString());
console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce();
console.log('expression.reduce(): ', expression.toString());
console.log('expression.reducible: ', expression.reducible);
expression = expression.reduce();
console.log('expression.reduce(): ', expression.value);
