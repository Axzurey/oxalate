export default class Ref<T> {
    constructor(private value: T) {}

    public get(): T {
        return this.value;
    }

    public set(value: T) {
        this.value = value;
    }
}