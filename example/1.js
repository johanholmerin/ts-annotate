function foo(x) {
  if (x < 2) {
    return 42;
  }
  return 'What are the return types of foo?';
}

class Rectangle {}

foo({ a: { b: [1] } });
foo(require('./2'));
foo(1.5);
foo([1]);
foo('some string');
foo(new Rectangle());
