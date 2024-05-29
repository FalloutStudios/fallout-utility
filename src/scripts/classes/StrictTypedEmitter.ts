import EventEmitter from 'node:events';
import { EventEmitterOptions } from './TypedEmitter';

export interface StrictTypedEmitter<Events extends Record<string|symbol, any> = Record<string|symbol, any>> extends EventEmitter {
    listenerCount(eventName: keyof Events): number;

    listeners(eventName: keyof Events): Function[];

    rawListeners(eventName: keyof Events): Function[];

    removeAllListeners(event?: keyof Events): this;

    off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    addListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean;

    prependListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    prependOnceListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

    removeListener<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
}

export class StrictTypedEmitter<Events extends Record<string|symbol, any>> extends EventEmitter {
    constructor(options?: EventEmitterOptions) {
        super(options);
    }
}