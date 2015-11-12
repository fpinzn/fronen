var greet = require('../src/scripts/main.js').greet
console.dir(greet)
describe('greeter', function () {

  it('should say Hello to the World', function () {
    expect(greet('World')).toEqual('Hello, World!');
  });
});
