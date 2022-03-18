/**
 * 
 * Limit text to a certain number of characters with a suffix
 */
export function limitText (text: string = '', length: number = 0, endsWith:string = '...') {
    return text != null && text.length >= length ? text.slice(0,length) + endsWith : text;
}