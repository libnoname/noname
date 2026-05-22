/**
 * Type declarations for modern APIs that are already polyfilled by core-js
 * but are not yet included in the current TypeScript lib definitions.
 *
 * This file only provides type annotations and does NOT include runtime
 * implementations. Actual polyfills are provided by core-js.
 */
/* eslint-disable no-var */

/**
 * 从Iterable和Iterator中获取遍历类型
 */
type ValueTypeOf<T> = T extends Iterable<infer U> ? U : T extends Iterator<infer U, any, any> ? U : never;

interface IteratorZipOptions {
	/**
	 * One of the following:
	 * - "shortest" (default): The resulting iterator stops when one input iterable is exhausted.
	 * - "longest": The resulting iterator stops when all input iterables are exhausted.
	 * Missing values from shorter iterables are filled according to the `padding` option.
	 * - "strict": A `TypeError` is thrown if not all input iterables finish at the same time.
	 */
	mode?: "shortest" | "longest" | "strict";

	/**
	 * An iterable object (not iterator). Only retrieved and validated when mode is "longest".
	 * If undefined or absent, missing values from shorter iterables are filled with undefined
	 * (which is equivalent to passing an empty iterable). If an iterable is provided,
	 * it is iterated for the number of times equal to the number of elements in iterables
	 * as soon as Iterator.zip() is called. padding[i] is used for missing values for iterables[i]
	 * (assuming padding and iterables are provided as arrays; they don't have to be).
	 * If padding is shorter than iterables, undefined is used for the remaining iterables.
	 */
	padding?: Iterable<unknown>;
}

interface IteratorZipKeyedOptions<T extends Record<string, Iterable<any> | Iterator<any>>> {
	/**
	 * One of the following:
	 * - "shortest" (default): The resulting iterator stops when one input iterable is exhausted.
	 * - "longest": The resulting iterator stops when all input iterables are exhausted.
	 * Missing values from shorter iterables are filled according to the `padding` option.
	 * - "strict": A `TypeError` is thrown if not all input iterables finish at the same time.
	 */
	mode?: "shortest" | "longest" | "strict";

	/**
	 * An object. Only retrieved and validated when mode is "longest". If undefined or absent,
	 * missing values from shorter iterables are filled with undefined (which is equivalent to
	 * passing an empty object). If an object is provided, each key of the iterables argument is
	 * retrieved as soon as Iterator.zipKeyed() is called. padding[key] is used for missing values
	 * for iterables[key]. If the padding object is missing some keys, those keys are filled with undefined.
	 */
	padding?: Partial<{ [K in keyof T]: unknown }>;
}

interface IteratorConstructor {
	/**
	 * Creates a new Iterator object that aggregates elements from multiple iterable objects by
	 * yielding arrays containing elements at the same position. It essentially "zips" the input iterables together,
	 * allowing simultaneous iteration over them.
	 *
	 * @param iterables - An iterable of iterables whose elements are aggregated.
	 * It must be iterable and cannot be an iterator. It should be finite, although its elements can be
	 * infinite iterables. Each element must implement either the iterable protocol or, failing that,
	 * the iterator protocol. Strings are rejected: to zip strings, convert them to iterators explicitly using Iterator.from().
	 * @param options - An object specifying behavior in case of inconsistent input lengths.
	 * @returns A new Iterator object. Each of its elements is an array with length equal to the number of input iterables,
	 * containing the elements from each input iterable at the corresponding position. If the iterables object is empty,
	 * the resulting iterator is created as completed.
	 */
	zip<T extends readonly unknown[]>(iterables: { [K in keyof T]: Iterable<T[K]> | Iterator<T[K], any, undefined> }, options?: IteratorZipOptions): Iterable<{ [K in keyof T]: T[K] }>;
	zip(iterables: Iterable<Iterable<unknown> | Iterator<unknown>>, options?: IteratorZipOptions): Iterator<unknown[]>;

	/**
	 * Creates a new Iterator object that aggregates elements from multiple iterable objects by
	 * yielding objects containing elements at the same position, with keys specified by the input.
	 * It essentially "zips" the input iterables together, allowing simultaneous iteration over them.
	 *
	 * @param iterables - An object. Each property's key is used as the key in the resulting objects.
	 * The property's value must implement either the iterable protocol or, failing that,
	 * the iterator protocol. These iterables may be infinite. Strings are rejected: to zip strings,
	 * convert them to iterators explicitly using Iterator.from().
	 * @param options - An object specifying behavior in case of inconsistent input lengths.
	 * @returns A new Iterator object. Each of its elements is an object with the same keys as the iterables argument,
	 * containing the elements from each input iterable at the corresponding position.
	 */
	zipKeyed<T extends Record<string, Iterable<any> | Iterator<any>>>(iterables: T, options?: IteratorZipKeyedOptions<T>): Iterator<{ [K in keyof T]: ValueTypeOf<T[K]> }>;
	zipKeyed(iterables: Record<string, Iterable<any> | Iterator<any>>, options?: IteratorZipKeyedOptions<Record<string, Iterable<any> | Iterator<any>>>): Iterator<Record<string, unknown>>;
}

declare var Iterator: IteratorConstructor;
