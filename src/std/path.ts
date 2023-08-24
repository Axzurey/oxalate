import { None, Option, Some } from "./option";
import RIterator from "./riterator";

export type FileNameExt<S extends string> = 
    S extends `${infer _Head}/${infer Tail}` ? FileNameExt<Tail> :
    S extends `${infer Name}.${infer Ext}` ? [Name, Ext] :
     never

export default class Path<T extends string> {
    
    private directory: RIterator<string>;

    constructor(path: T) {
        this.directory = RIterator.from(path.split('/'));
    }

    public static from_path<T extends string>(path: Path<T>): Path<T> {
        return new Path(path.directory.collect_array().join('/'));
    }

    is_absolute(): boolean {
        if (this.directory.length() === 0) return false;

        let zeroth = this.directory.nth(0);
        return zeroth.is_some() && zeroth.unwrap() === "game";
    }

    is_relative(): boolean {
        if (this.directory.length() === 0) return false;

        let zeroth = this.directory.nth(0);
        return zeroth.is_some() && zeroth.unwrap() !== "game";
    }

    to_string(): string {
        return this.directory.collect_array().join('/')
    }

    parent(): Option<Path<T>> { //TODO: it shouldn't be of type <T>, but rather a different type
        if (this.directory.length() === 0) return None();
        return Some(new Path(this.directory.take(this.directory.length() - 1).unwrap().collect_array().join('/')));
    }

    file_name(): Option<String> {
        return this.directory.nth(this.directory.size_hint());
    }

    extension(): Option<keyof Instances> {
        return this.directory.nth(this.directory.length() - 1) as Option<keyof Instances>;
    }

    push(subpath: string) {
        this.directory = this.directory.chain(RIterator.from(subpath.split('/')))
    }

    to_iter(): RIterator<string> {
        return RIterator.from_riter(this.directory);
    }
}