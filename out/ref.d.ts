export default class Ref<T> {
    private value;
    constructor(value: T);
    get(): T;
    set(value: T): void;
}
