import operatingSystem  from 'os';

export enum OS {
    WINDOWS,
    LINUX,
    MACOS,
    ANDROID,
    OPENBSD,
    FREEBSD,
    OTHER
}

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