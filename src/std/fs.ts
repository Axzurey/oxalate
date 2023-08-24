import { None, Option, Some } from "./option";
import RIterator from './riterator';
import Path, { FileNameExt } from "./path";
import { Err, Ok, Result } from "./result";
import { findFirstChildOfClassWithNameOption, findFirstChildOption, get_callstack, wrap_call } from "./fnutils";

type ExtToInstance<E extends any> = 
    E extends keyof Instances ? Instances[E] : Instance;

function get_roblox_instance(path: string): Option<Instance> {
    let cd: Instance = game;
    for (let split of path.split('.')) {
        let o = cd.FindFirstChild(split);
        if (o === undefined) {
            return None()};
        cd = o;
    }

    return Some(cd);
}

function matchFileExt(str: string): Result<[string, string], string> {
    let res = wrap_call<[string, string]>(() => {
        let out = str.find("(.+)%.(.+)" );
        return [out[2], out[3]] as unknown as [string, string];
    })
    if (res.is_err()) return Err(`${res.unwrap_err()}`);
    return Ok(res.unwrap().map((v) => v === undefined ? "" : v) as [string, string]);
}

function formatInstancePath(inst: Instance): string {
    return string.gsub(inst.GetFullName(), "%.", "/")[0];
}

function resolve_to_string<T extends string>(path: RIterator<string>): T {
    let path_buf: string[] = [];

    let first = true;
    for (let token of path.collect_array()) {
        if (token === '..') {
            path_buf.pop();
        }
        else if (token === '.') {
            path_buf.push(formatInstancePath(
                get_roblox_instance(get_callstack()[2][0]).unwrap()
            ))
        }
        else {
            if (first && token !== 'game') {
                path_buf.push(formatInstancePath(
                    get_roblox_instance(get_callstack()[2][0]).unwrap()
                ))
            }
            else {
                path_buf.push(token);
            }
        }
        first = false;
    }

    return path_buf.join('/') as T;
}

function get_from_resolved_path<T extends string>(resolvedstr: string): Result<ExtToInstance<FileNameExt<T>[1]>, string> {
    let resolved = resolvedstr.split('/');
    let current: Instance = game;
    for (let i = 1; i < resolved.size(); i++) {
        if (i === resolved.size() - 1) { //tail of the path
            let f = matchFileExt(resolved[i]);
            if (f.is_ok()) {
                let [file, ext] = [f.unwrap()[0], f.unwrap()[1]];
                if (ext === "" || ext === "*") {
                    let c = findFirstChildOption(current, file).ok_or(`Path ${resolved.join('/')} doesn't exist. ${file} isn't a valid member of ${resolved[i - 1]}`);
                    return c as unknown as Result<ExtToInstance<FileNameExt<T>[1]>, string>;
                }
                else {
                    let c = findFirstChildOfClassWithNameOption(current, file, ext as keyof Instances).ok_or(`Path ${resolved.join('/')} doesn't exist. Tail ${file}.${ext} isn't a valid member of ${resolved[i - 1]}`);;
                    return c as unknown as Result<ExtToInstance<FileNameExt<T>[1]>, string>;
                }
            }
            else {
                return Err(`Unable to match file name and extension for tail (${resolved[i]}) of path ${resolved.join('/')}`)
            }
        }
        else {
            let o = findFirstChildOption(current, resolved[i]).ok_or(`Path ${resolved.join('/')} doesn't exist. ${resolved[i]} isn't a valid member of ${resolved[i - 1]}`);
            if (o.is_ok()) {
                current = o.unwrap();
            }
            else {
                return o as unknown as Result<ExtToInstance<FileNameExt<T>[1]>, string>;
            }
        }
    }
    return Ok(current) as unknown as Result<ExtToInstance<FileNameExt<T>[1]>, string>;
}

export function resolve<T extends string>(path: Path<T>): Result<ExtToInstance<FileNameExt<T>[1]>, string> {
    return get_from_resolved_path(resolve_to_string(path.to_iter()));
}