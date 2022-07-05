import operatingSystem  from 'os';

export enum os {
    WINDOWS,
    LINUX,
    MACOS,
    ANDROID,
    OPENBSD,
    FREEBSD,
    OTHER
}

export function getOperatingSystem(): os {
    switch (operatingSystem.platform()) {
        case 'win32':
            return os.WINDOWS;
        case 'linux':
            return os.LINUX;
        case 'darwin':
            return os.MACOS;
        case 'android':
            return os.ANDROID;
        case 'openbsd':
            return os.OPENBSD;
        case 'freebsd':
            return os.FREEBSD;
        default:
            return os.OTHER;
    }
}