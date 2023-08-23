import { None, Option, Some } from "./option";
import RIterator from "./riterator";

export default class Path {
    
    private directory: RIterator<string>;

    constructor(path: string) {
        this.directory = RIterator.from(path.split('/'));
    }

    public static from_path(path: Path): Path {
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

    parent(): Option<Path> {
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