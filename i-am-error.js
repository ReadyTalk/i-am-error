'use strict';

const iamerror = {};

/**
 * Creates a dynamically named constructor for an error that inherits from Error.
 *
 * @param {string} name - Name for the new error's constructor (e.g. 'InvalidInputError')
 * @param {object} attrs - Attributes assigned to the new error when createError is called. Must be string, number or boolean.
 * @param {array} args - Attributes assigned to the new error when the new error is constructed. Names must be strings, args passed in can be anything.
 *
 * Example:
 * The following creates an AuthenticationError object with a status attribute set to 403
 *
 * createError('AuthenticationError', { status: 403 }, [ 'timestamp' ])
 *
 * and can be used like:
 *
 * throw new AuthenticationError('Some message', new Date(), { optional: 'data' });
 *
 * Each error is automatically configured with a message attribute and a data attribute.
 */
iamerror.createError = (name, attrs={}, args=[]) => {
  // Sanitize name
  if (!isValidIdentifier(name)) {
    throw new Error('Invalid error name \'' + name + '\'');
  }

  // Sanitize attrs
  if (attrs) {
    for (const attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        if (!isValidIdentifier(attr)) {
          throw new Error('Invalid attribute name \'' + attr + '\'');
        }
        if (!isValidAttributeValue(attrs[attr])) {
          throw new Error('Invalid attribute value \'' + attrs[attr] + '\'');
        }
      }
    }
  }

  // Sanitize args
  if (args) {
    for (let i = 0; i < args.length; i++) {
      if (!isValidIdentifier(args[i])) {
        throw new Error('Invalid argument name \'' + args[i] + '\'');
      }
      if (args.indexOf(args[i]) !== i) {
        throw new Error('Invalid argument name \'' + args[i] + '\' already used as argument');
      }
      if (Object.keys(attrs).indexOf(args[i]) >= 0) {
        throw new Error('Invalid argument name \'' + args[i] + '\' already used as attribute');
      }
    }
  }

  // Build error constructor code
  const errorConstructorCode =
    'return function ' + name + '(message, ' +
        args.map((arg) => { return arg + ', '; }).join('') +
        'data) {' +
      'if (typeof data === \'undefined\') data = {};' +
      'Error.call(this, message);' +
      'if (Error.captureStackTrace) {' +
        'Error.captureStackTrace(this, this.constructor);' +
      '}' +
      'this.name = \'' + name + '\';' +
      'this.message = message;' +
      Object.keys(attrs).map((attr) => {
        return 'this.' + attr + ' = ' + JSON.stringify(attrs[attr]) + ';';
      }).join('') +
      args.map((arg) => { return 'this.' + arg + ' = ' + arg + ';'; }).join('') +
      'this.data = data;' +
    '};';

  // Create error constructor
  // eslint-disable-next-line no-new-func
  const ErrorConstructor = new Function(errorConstructorCode)();
  ErrorConstructor.prototype = Object.create(Error.prototype);
  ErrorConstructor.prototype.constructor = ErrorConstructor;

  return ErrorConstructor;
};

function isValidIdentifier(str) {
  // Must be a string
  if (typeof str !== 'string') {
    return false;
  }

  // Must not have leading or trailing whitespace
  if (str.trim() !== str) {
    return false;
  }

  // Must not be one of the default attributes
  if (str.trim() === 'message' || str.trim() === 'data') {
    return false;
  }

  // Must be a valid identifier
  try {
    // eslint-disable-next-line no-new-func
    new Function(str, 'var ' + str);
  } catch (e) {
    return false;
  }

  return true;
}

function isValidAttributeValue(attr) {
  // Must be string, number, or boolean
  if (typeof attr !== 'string' && typeof attr !== 'number' && typeof attr !== 'boolean') {
    return false;
  }

  // If a string, must be a valid identifier
  if (typeof attr === 'string' && attr.length > 0 && !isValidIdentifier(attr)) {
    return false;
  }

  return true;
}

module.exports = iamerror;
