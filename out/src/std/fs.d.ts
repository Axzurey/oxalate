/// <reference types="@rbxts/types" />
import Path from "./path";
import { Result } from "./result";
declare namespace fs {
    function resolve(path: Path): Result<Instance, string>;
}
export default fs;
