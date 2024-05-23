import { EncodingOption, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import _path, { dirname } from 'node:path';
import inspector from 'node:inspector';
import operatingSystem from 'node:os';

export enum OS {
    WINDOWS = "win32",
    LINUX = "linux",
    MACOS = "darwin",
    ANDROID = "android",
    OPENBSD = "openbsd",
    FREEBSD = "freebsd",
    OTHER = "other"
}

/**
 * Get operation system
 */
export function getOperatingSystem(): OS {
    switch (operatingSystem.platform()) {
        case 'win32':
            return OS.WINDOWS;
        case 'linux':
            return OS.LINUX;
        case 'darwin':
            return OS.MACOS;
        case 'android':
            return OS.ANDROID;
        case 'openbsd':
            return OS.OPENBSD;
        case 'freebsd':
            return OS.FREEBSD;
        default:
            return OS.OTHER;
    }
}

/**
 * Checks if debug mode is enabled
 * @experimental
 */
export function isDebugging(): boolean {
    return !!inspector.url() || /--debug|--inspect/g.test(process.execArgv.join(''));
}

/**
 * @deprecated This is a dumb idea (Already implemented in path module)
 */
export const path = getOperatingSystem() === OS.WINDOWS ? _path.win32 : _path.posix;

export interface CreateNewFileOptions<T> {
    formatReadData?: (data: string|Buffer, defaultContent: T) => T;
    encodeFileData?: (data: T) => any;
    encoding?: EncodingOption;
}

export interface CreateNewFileAsyncOptions<T> {
    formatReadData?: (data: string|Buffer, defaultContent: T) => Promise<T>|T;
    encodeFileData?: (data: T) => any|Promise<any>;
    encoding?: EncodingOption;
}

/**
 * Creates file if doesn't exists and reads the file
 * @param filePath File path
 * @param defaultContent Default file content
 * @param options File create options
 */
export function createReadFile<T>(filePath: string, defaultContent: T, options?: CreateNewFileOptions<T> & Required<Pick<CreateNewFileOptions<T>, 'formatReadData'>>): T;
export function createReadFile<T>(filePath: string, defaultContent: T, options?: CreateNewFileOptions<T>): string|Buffer;
export function createReadFile<T>(filePath: string, defaultContent: T, options?: CreateNewFileOptions<T>): string|Buffer|T {
    if (!existsSync(filePath)) {
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, options?.encodeFileData ? options?.encodeFileData(defaultContent) : String(defaultContent), options?.encoding);
    }

    const fileData = readFileSync(filePath, options?.encoding);
    return options?.formatReadData ? options.formatReadData(fileData, defaultContent) : fileData;
}

/**
 * Creates file if doesn't exists and reads the file
 * @param filePath File path
 * @param defaultContent Default file content
 * @param options File create options
 */
export async function createReadFileAsync<T>(filePath: string, defaultContent: T, options?: CreateNewFileAsyncOptions<T> & Required<Pick<CreateNewFileAsyncOptions<T>, 'formatReadData'>>): Promise<T>;
export async function createReadFileAsync<T>(filePath: string, defaultContent: T, options?: CreateNewFileAsyncOptions<T>): Promise<string|Buffer>;
export async function createReadFileAsync<T>(filePath: string, defaultContent: T, options?: CreateNewFileAsyncOptions<T>): Promise<string|Buffer|T> {
    if (!(await stat(filePath).catch(() => false))) {
        await mkdir(dirname(filePath), { recursive: true });
        await writeFile(filePath, options?.encodeFileData ? await Promise.resolve(options?.encodeFileData(defaultContent)) : String(defaultContent), options?.encoding);
    }

    const fileData = await readFile(filePath, options?.encoding);
    return options?.formatReadData ? Promise.resolve(options.formatReadData(fileData, defaultContent)) : fileData;
}

/**
 * Checks if a string is a valid IPv4
 * @param ip String to check
 * @deprecated This is crazy
 */
export function isValidIPv4(ip: string): boolean {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}