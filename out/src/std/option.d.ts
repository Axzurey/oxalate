import { Result } from "./result";
/**
 * cmon, this seemed like it would be fun c:
 * Though we don't have the "?" syntax or the same pattern matching we can still have fun with unwrapping
*/
export declare class Option<T> {
    private value?;
    constructor(value?: T | undefined);
    is_some(): boolean;
    is_none(): boolean;
    unwrap(): T;
    expect(message: string): T;
    map<F>(operation: (v: T) => F): Option<F>;
    unwrap_or(default_value: T): T;
    unwrap_or_else(default_function: () => T): T;
    ok_or<E>(err: E): Result<T, E>;
}
export declare function wrap<T>(value: T | undefined): Option<T>;
export declare function Some<T>(value: T): Option<T>;
export declare function None(): Option<any>;
