import { slice_array } from "./fnutils";
import { None, Option, Some } from "./option";
import { Ok, Result } from "./result";

export type Iteratable<T> = Array<T>

export default class RIterator<T extends defined> {
    private internal_counter = 0;

    private constructor(private values: Iteratable<T>) {
        
    };

    public static from<T extends defined>(into_iter: Iteratable<T>): RIterator<T> {
        return new RIterator(into_iter);
    }

    public static from_riter<T extends defined>(iter: RIterator<T>): RIterator<T> {
        return new RIterator([...iter.values]);
    }

    next(): Option<T> {
        if (this.internal_counter < this.values.size()) {
            let out = Some(this.values[this.internal_counter]);
            this.internal_counter ++;
            return out;
        }
        return None();
    }

    peek(): Option<T> {
        if (this.internal_counter < this.values.size()) {
            return Some(this.values[this.internal_counter]);
        }
        return None();
    }

    size_hint(): number {
        return this.values.size() - this.internal_counter;
    }

    length(): number {
       return this.values.size(); 
    }

    nth(n: number): Option<T> {
        if (n < 0 && -n >= this.values.size()) return None();
        if (n >= this.values.size()) return None();
        
        if (n >= 0) {
            return Some(this.values[n]);
        }
        else {
            return Some(this.values[this.values.size() + n]);
        }
    }

    chain(iterator: RIterator<T>): RIterator<T> {
        return RIterator.from([...this.values, ...iterator.values]);
    }

    map<B extends defined>(f: (e: T) => B): RIterator<B> {
        let mapped: B[] = this.values.map((e) => f(e));
        return RIterator.from(mapped);
    }

    take(n: number): Result<RIterator<T>, string> {
        if (n + this.internal_counter >= this.values.size()) {
            let slice = slice_array(this.values, n);
            return slice.map((v) => RIterator.from(v));
        }
        
        let c: T[] = [];

        for (let i = this.internal_counter; i < n; i++) {
            let o = this.values[i];
            c.push(o);
        }

        return Ok(RIterator.from(c));
    }

    collect_array(): T[] {
        return this.values;
    }

    /**
     * 
     * @param condition 
     * @returns 2 arrays, left and right. Left is populated with those elements for which condition is true
     */

    partition(condition: (e: T, index: number) => boolean): [T[], T[]] {
        let left: T[] = [];
        let right: T[] = [];

        this.values.forEach((v, i) => {
            if (condition(v, i)) {
                left.push(v);
            }
            else {
                right.push(v);
            }
        });

        return [left, right];
    }
}