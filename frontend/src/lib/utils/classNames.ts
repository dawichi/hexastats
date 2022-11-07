/**
 * 
 * @param classes Array of classes
 * @returns A single string of classes
 */
export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}