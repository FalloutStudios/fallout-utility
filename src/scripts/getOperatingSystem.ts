export function getOperatingSystem(): string {
    const os = require('os');
    return os.platform();
}