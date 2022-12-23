import operatingSystem  from 'os';
import inspector from 'inspector';
import _path from 'path';

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