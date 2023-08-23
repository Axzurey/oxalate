import { None, Option, Some } from "./option";
import RIterator from './riterator';
import Path from "./path";
import { Err, Ok, Result } from "./result";
import { findFirstChildOfClassWithNameOption, findFirstChildOption, get_callstack, wrap_call } from "./fnutils";

namespace fs {

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

    function resolve_to_array(path: RIterator<string>) {
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

        return path_buf
    }

    function get_from_resolved_path(resolved: string[]): Result<Instance, string> {
        let current: Instance = game;
        for (let i = 1; i < resolved.size(); i++) {
            if (i === resolved.size() - 1) { //tail of the path
                let f = matchFileExt(resolved[i]);
                if (f.is_ok()) {
                    let [file, ext] = [f.unwrap()[0], f.unwrap()[1]];
                    if (ext === "" || ext === "*") {
                        let c = findFirstChildOption(current, file).ok_or(`Path ${resolved.join('/')} doesn't exist. ${file} isn't a valid member of ${resolved[i - 1]}`);
                        return c;
                    }
                    else {
                        let c = findFirstChildOfClassWithNameOption(current, file, ext as keyof Instances).ok_or(`Path ${resolved.join('/')} doesn't exist. Tail ${file}.${ext} isn't a valid member of ${resolved[i - 1]}`);;
                        return c;
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
                    return o;
                }
            }
        }
        return Ok(current);
    }

    export function resolve(path: Path) {
        return get_from_resolved_path(resolve_to_array(path.to_iter()));
    }
}

export default fs;