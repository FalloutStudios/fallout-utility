import operatingSystem  from 'os';
import inspector from 'inspector';
import _path from 'path';
import { EncodingOption, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

export enum OS {
    WINDOWS,
    LINUX,
    MACOS,
    ANDROID,
    OPENBSD,
    FREEBSD,
    OTHER
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

export const path = getOperatingSystem() === OS.WINDOWS ? _path.win32 : _path.posix;

export interface CreateNewFileOptions<T> {
    formatReadData?: (data: string|Buffer, defaultContent: T) => T;
    encodeFileData?: (data: T) => any;
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
        mkdirSync(path.dirname(filePath), { recursive: true });
        writeFileSync(filePath, options?.encodeFileData ? options?.encodeFileData(defaultContent) : String(defaultContent), options?.encoding);
    }

    const fileData = readFileSync(filePath, options?.encoding);
    return options?.formatReadData ? options.formatReadData(fileData, defaultContent) : fileData;
}

/**
 * Checks if a string is a valid IPv4
 * @param ip String to check
 */
export function isValidIPv4(ip: string): boolean {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}