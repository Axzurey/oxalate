/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/compiler-types" />
import { Option } from "./option";
import { Result } from "./result";
export type Iteratable<T> = Array<T>;
export default class RIterator<T extends defined> {
    private values;
    private internal_counter;
    private constructor();
    static from<T extends defined>(into_iter: Iteratable<T>): RIterator<T>;
    static from_riter<T extends defined>(iter: RIterator<T>): RIterator<T>;
    next(): Option<T>;
    peek(): Option<T>;
    size_hint(): number;
    length(): number;
    nth(n: number): Option<T>;
    chain(iterator: RIterator<T>): RIterator<T>;
    map<B extends defined>(f: (e: T) => B): RIterator<B>;
    take(n: number): Result<RIterator<T>, string>;
    collect_array(): T[];
    /**
     *
     * @param condition
     * @returns 2 arrays, left and right. Left is populated with those elements for which condition is true
     */
    partition(condition: (e: T, index: number) => boolean): [T[], T[]];
}
