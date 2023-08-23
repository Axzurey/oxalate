/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/types" />
import { Option } from "./option";
import { Result } from "./result";
export declare function wrap_call<T>(fn: () => T): Result<T, string>;
export declare function get_callstack(max_stacks?: number): LuaTuple<[string, number, string | undefined, number, boolean, Callback]>[];
export declare function slice_array<T extends defined>(array: T[], slice: number): Result<T[], string>;
export declare function shallow_eq<T extends unknown[]>(a: T, b: T): boolean;
export declare function findFirstChildOption(inst: Instance, child: string): Option<Instance>;
export declare function findFirstChildOfClassOption(inst: Instance, child: keyof Instances): Option<Instance>;
export declare function findFirstChildOfClassWithNameOption(inst: Instance, name: string, cls: keyof Instances): Option<Instance>;
