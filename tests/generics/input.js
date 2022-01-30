function foo(x) {}

foo(Promise.resolve());
foo(new Set());
foo(new Map());
foo(new WeakSet());
foo(new WeakMap());
