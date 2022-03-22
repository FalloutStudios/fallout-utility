export function trimChars(str: string, chars: string|string[]): string {
    chars = typeof chars === 'string' ? [chars] : chars;

    for (let char of chars) {
        str = str.replace(new RegExp(`^${char}+|${char}+$`, 'g'), '');
    }

    return str;
}