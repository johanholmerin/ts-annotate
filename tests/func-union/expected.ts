function foo(x: ((...args: any[]) => any) | undefined): undefined {}

foo(() => {});
foo(undefined);
