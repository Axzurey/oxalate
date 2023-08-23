export class Result<T, E> {

    private constructor(private value: T | E, private _is_error: boolean) {
        (getmetatable(this) as any).__eq = (a: Result<T, E>, b: Result<T, E>) => {
            if (a.value !== undefined && b.value !== undefined) {
                if (a.value === b.value) return true;
            }
            else if (a.value === undefined && b.value === undefined) {
                return true;
            }
            return false;
        }
        (getmetatable(this) as any).__tostring = (a: Result<T, E>) => {
            return `Result[${a.value}]`;
        }
    };

    public static _construct_ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>(value, false);
    }

    public static _construct_err<T, E>(value: E): Result<T, E> {
        return new Result<T, E>(value, true);
    }

    is_ok(): boolean {
        return !this._is_error;;
    }

    is_ok_and(predicate: (value: T) => boolean): boolean {
        if (this._is_error) return false;
        if (predicate(this.value as T)) return true;
        return false;
    }

    is_err(): boolean {
        return this._is_error;
    }

    is_err_and(predicate: (value: E) => boolean): boolean {
        if (!this._is_error) return false;
        if (predicate(this.value as E)) return true;
        return false;
    }

    map<F>(operation: (v: T) => F): Result<F, E> {
        if (this.is_ok()) {
            return Ok(operation(this.value as T));
        }
        else {
            return Err(this.value as E);
        }
    }

    unwrap(): T {
        if (this.is_err()) {
            error(this.value);
        }
        return this.value as T;
    }

    unwrap_err(): E {
        if (this.is_ok()) {
            error(`Value is not an error, but instead has a value of ${this.unwrap()}`);
        }
        return this.value as E;
    }

    unwrap_or_default(default_value: T): T {
        if (this.is_err()) return default_value;
        return this.value as T;
    }

    unwrap_or_else(default_value: (err: E) => T) {
        if (this.is_err()) return default_value(this.value as E);
        return this.value as T;
    }
}

export function Ok<T>(value: T) {
    return Result._construct_ok<T, any>(value);
}

export function Err<E>(err: E) {
    return Result._construct_err<any, E>(err);
}