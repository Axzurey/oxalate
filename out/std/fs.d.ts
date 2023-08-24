/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/types" />
import Path, { FileNameExt } from "./path";
import { Result } from "./result";
type ExtToInstance<E extends any> = E extends keyof Instances ? Instances[E] : Instance;
export declare function resolve<T extends string>(path: Path<T>): Result<ExtToInstance<FileNameExt<T>[1]>, string>;
export {};
