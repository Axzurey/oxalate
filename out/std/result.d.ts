export declare class Result<T, E> {
    private value;
    private _is_error;
    private constructor();
    static _construct_ok<T, E>(value: T): Result<T, E>;
    static _construct_err<T, E>(value: E): Result<T, E>;
    is_ok(): boolean;
    is_ok_and(predicate: (value: T) => boolean): boolean;
    is_err(): boolean;
    is_err_and(predicate: (value: E) => boolean): boolean;
    map<F>(operation: (v: T) => F): Result<F, E>;
    unwrap(): T;
    unwrap_err(): E;
    unwrap_or_default(default_value: T): T;
    unwrap_or_else(default_value: (err: E) => T): T;
}
export declare function Ok<T>(value: T): Result<T, any>;
export declare function Err<E>(err: E): Result<any, E>;
