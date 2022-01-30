function foo(x: Promise<any> | Set<any> | Map<any, any> | WeakSet<any> | WeakMap<any, any>): undefined {}

foo(Promise.resolve());
foo(new Set());
foo(new Map());
foo(new WeakSet());
foo(new WeakMap());
