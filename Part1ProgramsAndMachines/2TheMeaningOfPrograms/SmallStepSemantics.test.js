import { describe, it, expect } from 'vitest';
import { SNumber, SBoolean, SAdd, SMultiply, SLessThan, SVariable } from './SmallStepSemantics';

describe('SmallStepSemantics', () => {
  describe('SNumber', () => {
    it('should create an instance with the given value', () => {
      const num = new SNumber(5);
      expect(num.value).toBe(5);
    });

    it('should return the correct string representation', () => {
      const num = new SNumber(5);
      expect(num.toString()).toBe('5');
    });

    it('should indicate that it is not reducible', () => {
      const num = new SNumber(5);
      expect(num.reducible).toBe(false);
    });
  });

  describe('SBoolean', () => {
    it('should create an instance with the given value', () => {
      const bool = new SBoolean(true);
      expect(bool.value).toBe(true);
    });

    it('should return the correct string representation', () => {
      const bool = new SBoolean(true);
      expect(bool.toString()).toBe('true');
    });

    it('should indicate that it is not reducible', () => {
      const bool = new SBoolean(true);
      expect(bool.reducible).toBe(false);
    });
  });

  describe('SAdd', () => {
    it('should create an instance with the given left and right expressions', () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(add.toString()).toBe('5 + 3');
    });

    it('should indicate that it is reducible', () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      expect(add.reducible).toBe(true);
    });

    it('should reduce to a new SAdd instance if the left expression is reducible', () => {
      const add = new SAdd(new SAdd(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe('5 + 3');
    });

    it('should reduce to a new SAdd instance if the right expression is reducible', () => {
      const add = new SAdd(new SNumber(5), new SAdd(new SNumber(1), new SNumber(2)));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe('5 + 3');
    });

    it('should reduce to an SNumber instance if both expressions are not reducible', () => {
      const add = new SAdd(new SNumber(5), new SNumber(3));
      const reduced = add.reduce({});
      expect(reduced.toString()).toBe('8');
    });
  });

  describe('SMultiply', () => {
    it('should create an instance with the given left and right expressions', () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(multiply.toString()).toBe('5 * 3');
    });

    it('should indicate that it is reducible', () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      expect(multiply.reducible).toBe(true);
    });

    it('should reduce to a new SMultiply instance if the left expression is reducible', () => {
      const multiply = new SMultiply(new SMultiply(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe('6 * 3');
    });

    it('should reduce to a new SMultiply instance if the right expression is reducible', () => {
      const multiply = new SMultiply(new SNumber(5), new SMultiply(new SNumber(1), new SNumber(2)));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe('5 * 2');
    });

    it('should reduce to an SNumber instance if both expressions are not reducible', () => {
      const multiply = new SMultiply(new SNumber(5), new SNumber(3));
      const reduced = multiply.reduce({});
      expect(reduced.toString()).toBe('15');
    });
  });

  describe('SLessThan', () => {
    it('should create an instance with the given left and right expressions', () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(lessThan.toString()).toBe('5 < 3');
    });

    it('should indicate that it is reducible', () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      expect(lessThan.reducible).toBe(true);
    });

    it('should reduce to a new SLessThan instance if the left expression is reducible', () => {
      const lessThan = new SLessThan(new SAdd(new SNumber(2), new SNumber(3)), new SNumber(3));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe('5 < 3');
    });

    it('should reduce to a new SLessThan instance if the right expression is reducible', () => {
      const lessThan = new SLessThan(new SNumber(5), new SAdd(new SNumber(1), new SNumber(2)));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe('5 < 3');
    });

    it('should reduce to an SBoolean instance if both expressions are not reducible', () => {
      const lessThan = new SLessThan(new SNumber(5), new SNumber(3));
      const reduced = lessThan.reduce({});
      expect(reduced.toString()).toBe('false');
    });
  });

  describe('SVariable', () => {
    it('should create an instance with the given name', () => {
      const variable = new SVariable('x');
      expect(variable.name).toBe('x');
    });

    it('should return the correct string representation', () => {
      const variable = new SVariable('x');
      expect(variable.toString()).toBe('x');
    });

    it('should indicate that it is reducible', () => {
      const variable = new SVariable('x');
      expect(variable.reducible).toBe(true);
    });

    it('should reduce to the value of the variable in the given environment', () => {
      const variable = new SVariable('x');
      const reduced = variable.reduce({ x: new SNumber(5) });
      expect(reduced.toString()).toBe('5');
    });
  });
});