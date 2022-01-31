function foo(x: ((...args: any[]) => any) | undefined): void {}

foo(() => {});
foo(undefined);
