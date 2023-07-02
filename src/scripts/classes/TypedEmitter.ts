import EventEmitter from 'node:events';

export interface EventEmitterOptions {
    /**
     * Enables automatic capturing of promise rejection.
     */
    captureRejections?: boolean | undefined;
}

export interface TypedEmitter<Events extends Record<string | symbol, any> = Record<string | symbol, any>> extends EventEmitter {
    listenerCount(eventName: keyof Events): number;
    listenerCount(eventName: string|symbol): number;

    listeners(eventName: keyof Events): Function[];
    listeners(eventName: string|symbol): Function[];

    rawListeners(eventName: keyof Events): Function[];
    rawListeners(eventName: string|symbol): Function[];

    removeAllListeners(event?: keyof Events): this;
    removeAllListeners(event?: string|symbol): this;

    off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    off<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    on<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    once<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    addListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    addListener<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean;
    emit<K extends string|symbol>(eventName: K, ...args: any): boolean;

    prependListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    prependListener<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    prependOnceListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    prependOnceListener<K extends string|symbol>(event: K, listener: (...args: any) => void): this;

    removeListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    removeListener<K extends string|symbol>(event: K, listener: (...args: any) => void): this;
}

export class TypedEmitter<Events extends Record<string|symbol, any>> extends EventEmitter {
    constructor(options?: EventEmitterOptions) {
        super(options);
    }
}