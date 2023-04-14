export type If<Condition extends boolean, T, E = null> = Condition extends true
    ? T
    : Condition extends false
        ? E
        : T|E;

export interface JSONEncodable<T> {
    toJSON(): T;
}

export type PartialDeep<T> = T extends object ? {
    [P in keyof T]?: PartialDeep<T[P]>;
} : T;

export type RestOrArray<T> = T[]|T[][];
export type Awaitable<T> = T|PromiseLike<T>;
export type Noting<T> = T;