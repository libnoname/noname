type Options = number | { delay?: number, failResult?: any };

export type AsynchronizedType<T> = T extends Promise<unknown> ? T : Promise<T>;
export type Asynchronized<T extends (...args: any[]) => any> = 
  T extends (...args: infer Args) => infer Return 
    ? (...args: infer Args) => AsynchronizedType<Return>
    : never;

export function debounce<T extends (...args: any[]) => any>(sourceFunction: T, options: Options = 500): Asynchronized<T>;
export function throttle<T extends (...args: any[]) => any>(sourceFunction: T, options: Options = 500): Asynchronized<T>;