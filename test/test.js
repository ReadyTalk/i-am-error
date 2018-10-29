const chai = require('chai');
const expect = chai.expect;

const IAmError = require('../i-am-error');

describe('IAmError', function () {

  describe('no attributes or arguments', function () {

    it('should create a valid error constructor', function () {
      const TestError = IAmError('TestError');

      expect(TestError.name).to.equal('TestError');
      expect(TestError).to.be.a('function');
    });

    it('should throw an error with no arguments', function () {
      expect(IAmError).to.throw('Invalid error name');
    });

    it('should not allow invalid identifiers as a name', function () {
      expect(() => {
        IAmError('123');
      }).to.throw('Invalid error name');
      expect(() => {
        IAmError('Test-Error');
      }).to.throw('Invalid error name');
      expect(() => {
        IAmError('1TestError');
      }).to.throw('Invalid error name');
      expect(() => {
        IAmError('TestError () { console.log("bad things"); } function ');
      }).to.throw('Invalid error name');
    });

  });

  describe('some attributes no arguments', function () {

    it('should not allow invalid identifiers as attribute names', function () {
      expect(() => {
        IAmError('BadError', { '': 123 });
      }).to.throw('Invalid attribute name');
      expect(() => {
        IAmError('BadError', { '123': 123 });
      }).to.throw('Invalid attribute name');
      expect(() => {
        IAmError('BadError', { 'bad-attr': 123 });
      }).to.throw('Invalid attribute name');
      expect(() => {
        IAmError('BadError', { 'message': 123 });
      }).to.throw('Invalid attribute name');
      expect(() => {
        IAmError('BadError', { 'data': 123 });
      }).to.throw('Invalid attribute name');
      expect(() => {
        IAmError('BadError', { 'a = 1; let bad': 123 });
      }).to.throw('Invalid attribute name');
    });

    it('should not allow invalid identifiers as attribute values', function () {
      expect(() => {
        IAmError('BadError', { a: [] });
      }).to.throw('Invalid attribute value');
      expect(() => {
        IAmError('BadError', { a: {} });
      }).to.throw('Invalid attribute value');
      expect(() => {
        IAmError('BadError', { a: new Date() });
      }).to.throw('Invalid attribute value');
      expect(() => {
        IAmError('BadError', { a: '1; let bad=2;' });
      }).to.throw('Invalid attribute value');
      expect(() => {
        IAmError('BadError', { a: 'message' });
      }).to.throw('Invalid attribute value');
      expect(() => {
        IAmError('BadError', { a: 'data' });
      }).to.throw('Invalid attribute value');
    });

  });

  describe('some arguments no attributes', function () {

    it('should not allow invalid identifiers as argument names', function () {
      expect(() => {
        IAmError('BadError', {}, [ '' ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ 123 ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ [] ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ {} ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ new Date() ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ 'a = 1; let bad' ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ 'message' ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', {}, [ 'data' ]);
      }).to.throw('Invalid argument name');
    });

    it('should not allow duplicate argument names (both in attributes and arguments)', function () {
      expect(() => {
        IAmError('BadError', {}, [ 'test', 'test' ]);
      }).to.throw('Invalid argument name');
      expect(() => {
        IAmError('BadError', { test: 123 }, [ 'test' ]);
      }).to.throw('Invalid argument name');
    });

  });


});

describe('instantiatied error', function () {

  describe('no attributes or arguments', function () {

    let TestError;

    beforeEach(function () {
      TestError = IAmError('TestError');
    });

    it('should be a valid error', function () {
      const testError = new TestError();

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.be.undefined;
      expect(testError.data).to.deep.equal({});
      expect(() => { throw testError; }).to.throw(TestError);
    });

  });

  describe('some attributes no arguments', function () {

    const attr1 = 'test';
    const attr2 = 123;
    const attr3 = true;
    let TestError;

    beforeEach(function () {
      TestError = IAmError('TestError', { attr1: attr1, attr2: attr2, attr3: attr3 });
    });

    it('should be a valid error', function () {
      const testError = new TestError();

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.be.undefined;
      expect(testError.data).to.deep.equal({});
      expect(testError.attr1).to.equal(attr1);
      expect(testError.attr2).to.equal(attr2);
      expect(testError.attr3).to.equal(attr3);
      expect(() => { throw testError; }).to.throw(TestError);
    });

    it('should accept a message', function () {
      const testError = new TestError('message');

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({});
      expect(testError.attr1).to.equal(attr1);
      expect(testError.attr2).to.equal(attr2);
      expect(testError.attr3).to.equal(attr3);
      expect(() => { throw testError; }).to.throw(TestError);
    });

    it('should accept a data object', function () {
      const testError = new TestError('message', { test: 'test' });

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({ test: 'test' });
      expect(testError.attr1).to.equal(attr1);
      expect(testError.attr2).to.equal(attr2);
      expect(testError.attr3).to.equal(attr3);
      expect(() => { throw testError; }).to.throw(TestError);
    });

  });

  describe('some arguments no attributes', function () {

    const arg1 = 'arg1';
    const arg2 = 'arg2';
    const arg3 = 'arg3';
    const arg4 = 'arg4';
    const arg5 = 'arg5';
    let TestError;

    beforeEach(function () {
      TestError = IAmError('TestError', {}, [ arg1, arg2, arg3, arg4, arg5 ]);
    });

    it('should be a valid error', function () {
      const date = new Date();
      const testError = new TestError('message', 'test', 123, [ 1, 2, 3 ], { test: [ 1, 2, 3 ] }, date);

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({});
      expect(testError.arg1).to.equal('test');
      expect(testError.arg2).to.equal(123);
      expect(testError.arg3).to.deep.equal([ 1, 2, 3 ]);
      expect(testError.arg4).to.deep.equal({ test: [ 1, 2, 3 ] });
      expect(testError.arg5).to.equal(date);
      expect(() => { throw testError; }).to.throw(TestError);
    });

    it('should have undefined attribute if argument is not passed', function () {
      const testError = new TestError('message');

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({});
      expect(testError.arg1).to.be.undefined;
      expect(testError.arg2).to.be.undefined;
      expect(testError.arg3).to.be.undefined;
      expect(testError.arg4).to.be.undefined;
      expect(testError.arg5).to.be.undefined;
      expect(() => { throw testError; }).to.throw(TestError);
    });

    it('should accept a data object', function () {
      const date = new Date();
      const testError = new TestError('message', 'test', 123, [ 1, 2, 3 ], { test: [ 1, 2, 3 ] }, date, { test: 'test' });

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({ test: 'test' });
      expect(testError.arg1).to.equal('test');
      expect(testError.arg2).to.equal(123);
      expect(testError.arg3).to.deep.equal([ 1, 2, 3 ]);
      expect(testError.arg4).to.deep.equal({ test: [ 1, 2, 3 ] });
      expect(testError.arg5).to.equal(date);
      expect(() => { throw testError; }).to.throw(TestError);
    });

  });

  describe('some arguments some attributes', function () {

    const attr1 = 'test';
    const attr2 = 123;
    const attr3 = true;
    const arg1 = 'arg1';
    const arg2 = 'arg2';
    const arg3 = 'arg3';
    const arg4 = 'arg4';
    const arg5 = 'arg5';
    let TestError;

    beforeEach(function () {
      TestError = IAmError('TestError',
        { attr1: attr1, attr2: attr2, attr3: attr3 },
        [ arg1, arg2, arg3, arg4, arg5 ]);
    });

    it('should be a valid error', function () {
      const date = new Date();
      const testError = new TestError('message', 'test', 123, [ 1, 2, 3 ], { test: [ 1, 2, 3 ] }, date);

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({});
      expect(testError.attr1).to.equal(attr1);
      expect(testError.attr2).to.equal(attr2);
      expect(testError.attr3).to.equal(attr3);
      expect(testError.arg1).to.equal('test');
      expect(testError.arg2).to.equal(123);
      expect(testError.arg3).to.deep.equal([ 1, 2, 3 ]);
      expect(testError.arg4).to.deep.equal({ test: [ 1, 2, 3 ] });
      expect(testError.arg5).to.equal(date);
      expect(() => { throw testError; }).to.throw(TestError);
    });

    it('should accept a data object', function () {
      const date = new Date();
      const testError = new TestError('message', 'test', 123, [ 1, 2, 3 ], { test: [ 1, 2, 3 ] }, date, { test: 'test' });

      expect(testError.name).to.equal('TestError');
      expect(testError).to.be.an.instanceof(TestError);
      expect(testError.message).to.equal('message');
      expect(testError.data).to.deep.equal({ test: 'test' });
      expect(testError.attr1).to.equal(attr1);
      expect(testError.attr2).to.equal(attr2);
      expect(testError.attr3).to.equal(attr3);
      expect(testError.arg1).to.equal('test');
      expect(testError.arg2).to.equal(123);
      expect(testError.arg3).to.deep.equal([ 1, 2, 3 ]);
      expect(testError.arg4).to.deep.equal({ test: [ 1, 2, 3 ] });
      expect(testError.arg5).to.equal(date);
      expect(() => { throw testError; }).to.throw(TestError);
    });

  });

});
