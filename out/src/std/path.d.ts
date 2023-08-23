/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/types" />
import { Option } from "./option";
import RIterator from "./riterator";
export default class Path {
    private directory;
    constructor(path: string);
    static from_path(path: Path): Path;
    is_absolute(): boolean;
    is_relative(): boolean;
    to_string(): string;
    parent(): Option<Path>;
    file_name(): Option<String>;
    extension(): Option<keyof Instances>;
    push(subpath: string): void;
    to_iter(): RIterator<string>;
}
