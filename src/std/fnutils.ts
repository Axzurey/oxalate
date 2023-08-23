import { None, Option, Some } from "./option";
import { Err, Ok, Result } from "./result";

export function wrap_call<T>(fn: () => T): Result<T, string> {
    let out = pcall(fn);
    if (out[0] === true) {
        return Ok(out[1])
    }
    else {
        return Err(out[1] as string);
    }
}

export function get_callstack(max_stacks: number = 50): LuaTuple<[string, number, string | undefined, number, boolean, Callback]>[] {
    let stack: LuaTuple<[string, number, string | undefined, number, boolean, Callback]>[] = [];

    for (let i = 2; i < max_stacks + 1; i++) { //don't count this function
        let o = debug.info(i, 'slnaf');
        if (o[0] === undefined) break;
        stack.push(o);
    }

    return stack;
}

export function slice_array<T extends defined>(array: T[], slice: number): Result<T[], string> {
    let x: T[] = [];

    if (slice >= array.size()) return Err(`Slice of ${slice} is greater index than the array with a length of ${array.size()}`);

    if (slice >= 0) {
        for (let i = slice; i < array.size(); i++) {
            x.push(array[i]);
        }
    }
    else {
        for (let i = array.size() + slice; i < array.size(); i++) {
            x.push(array[i]);
        }
    }

    return Ok(x);
}

export function shallow_eq<T extends unknown[]>(a: T, b: T): boolean {

    if (a.size() !== b.size()) return false;

    for (let i = 0; i < a.size(); i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

export function findFirstChildOption(inst: Instance, child: string): Option<Instance> {
    let result = inst.FindFirstChild(child);

    if (result) return Some(result);
    return None();
}

export function findFirstChildOfClassOption(inst: Instance, child: keyof Instances): Option<Instance> {
    let result = inst.FindFirstChildOfClass(child);

    if (result) return Some(result);
    return None();
}

export function findFirstChildOfClassWithNameOption(inst: Instance, name: string, cls: keyof Instances): Option<Instance> {
    for (let child of inst.GetChildren()) {
        if (child.IsA(cls) && child.Name === name) return Some(child);
    }
    return None();
}