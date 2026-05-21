/**
 * Type declarations for modern APIs that are already polyfilled by core-js
 * but are not yet included in the current TypeScript lib definitions.
 *
 * This file only provides type annotations and does NOT include runtime
 * implementations. Actual polyfills are provided by core-js.
 */
/* eslint-disable no-var */

type IteratorZipOptions<T extends readonly unknown[]> = {
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
    padding?: T;
}

interface IteratorConstructor {
	/**
	 * creates a new Iterator object that aggregates elements from multiple iterable objects by
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
	zip<T extends readonly unknown[]>(iterables: { [K in keyof T]: Iterable<T[K]> | Iterator<T[K], any, undefined> }, options?: IteratorZipOptions<T>): Iterable<{ [K in keyof T]: T[K] }>;
}

declare var Iterator: IteratorConstructor;
