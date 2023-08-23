import { Err, Ok, Result } from "./result";

/**
 * cmon, this seemed like it would be fun c:
 * Though we don't have the "?" syntax or the same pattern matching we can still have fun with unwrapping
*/
export class Option<T> {

    constructor(private value?: T) {
        (getmetatable(this) as any).__eq = (a: Option<T>, b: Option<T>) => {
            if (a.value !== undefined && b.value !== undefined) {
                if (a.value === b.value) return true;
            }
            else if (a.value === undefined && b.value === undefined) {
                return true;
            }
            return false;
        }
        (getmetatable(this) as any).__tostring = (a: Option<T>) => {
            return `Option[${a.value}]`;
        }
    }

    is_some(): boolean {
        return this.value !== undefined;
    }

    is_none(): boolean {
        return this.value === undefined;
    }

    unwrap(): T {
        assert(this.value !== undefined, "Attempt to unwrap an Option with a null value.");
        return this.value;
    }

    expect(message: string): T {
        assert(this.value !== undefined, message);
        return this.value;
    }

    map<F>(operation: (v: T) => F): Option<F> {
        if (this.is_some()) {
            return Some(operation(this.value as T));
        }
        else {
            return None();
        }
    }

    unwrap_or(default_value: T): T {
        if (this.value === undefined) {
            return default_value;
        }
        return this.value;
    }

    unwrap_or_else(default_function: () => T): T {
        if (this.value === undefined) {
            return default_function();
        }
        return this.value;
    }

    ok_or<E>(err: E): Result<T, E> {
        if (this.is_some()) {
            return Ok(this.value as T);
        }
        else {
            return Err(err);
        }
    }
}

export function wrap<T>(value: T | undefined): Option<T> {
    if (value === undefined) return None();
    return Some(value);
}

export function Some<T>(value: T): Option<T> {
    return new Option(value);
}

export function None(): Option<any> {
    return new Option();
}