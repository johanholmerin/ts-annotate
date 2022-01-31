function foo(x: number | string | boolean | symbol | undefined | null): void {}

foo(1.5);
foo('some string');
foo(true);
foo(Symbol());
foo(undefined);
foo(null);
