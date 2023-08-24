/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/types" />
import { Option } from "./option";
import RIterator from "./riterator";
export type FileNameExt<S extends string> = S extends `${infer _Head}/${infer Tail}` ? FileNameExt<Tail> : S extends `${infer Name}.${infer Ext}` ? [Name, Ext] : never;
export default class Path<T extends string> {
    private directory;
    constructor(path: T);
    static from_path<T extends string>(path: Path<T>): Path<T>;
    is_absolute(): boolean;
    is_relative(): boolean;
    to_string(): string;
    parent(): Option<Path<T>>;
    file_name(): Option<String>;
    extension(): Option<keyof Instances>;
    push(subpath: string): void;
    to_iter(): RIterator<string>;
}
