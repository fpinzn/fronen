var greet = require('../scripts/main.js')
console.dir(greet)
describe('greeter', function () {

  it('should say Hello to the World', function () {
    expect(greet).toEqual('lol');
    expect(greet('World')).toEqual('Hello, World!');
  });
});
