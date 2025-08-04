export type AsynchronizedType<T> = T extends Promise<unknown> ? T : Promise<T>;
export type Asynchronized<T extends (...args: any[]) => any> = 
  T extends (...args: infer Args) => infer Return 
    ? AsynchronizedType<Return>
    : never;

export function debonuce<T extends (...args: any[]) => any>(sourceFunction: T, delay: number = 500): Asynchronized<T>;
export function throttle<T extends (...args: any[]) => any>(sourceFunction: T, delay: number = 500): Asynchronized<T>;