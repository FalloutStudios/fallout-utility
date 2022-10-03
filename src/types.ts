export type If<Condition extends boolean, T, E = null> = Condition extends true
    ? T
    : Condition extends false
        ? E
        : T|E;

export type ResOrArray<T> = T[]|T[][];
export type Awaitable<T> = T|PromiseLike<T>;