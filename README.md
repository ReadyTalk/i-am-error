## i-am-error
Lets you easily create custom Error objects.

### Install:
```
npm install i-am-error
```

### Usage:
`createError` - Creates a dynamically named constructor for an error that inherits from Error.
- name: Name for the new error's constructor (e.g. 'InvalidInputError')
- attrs: Attributes assigned to the new error when createError is called. Must be string, number or boolean.
- args: Attributes assigned to the new error when the new error is constructed. Names must be strings, args passed in can be anything.

Each error is automatically configured with a message attribute and a data attribute.
- message: A string detailing the error.
- data: An object containing arbitrary data.

####Simple Example: 
Create a MyError object:
```
createError('MyError')
```
and can be used like:
```
throw new MyError();
throw new MyError('Some message');
throw new MyError('Some message', { optional: 'data' });
```

####A More Complex Example: 
Create an AuthenticationError object with a status attribute set to 403 and a timestamp argument that can be passed into the error:
```
createError('AuthenticationError', { status: 403 }, [ 'timestamp' ])
```
and can be used like:
```
throw new AuthenticationError('Some message', new Date(), { optional: 'data' });
```
