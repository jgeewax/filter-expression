/**
 * Returns whether or not the provided input is an object type (e.g., {}).
 * 
 * @param input Any value
 * @returns boolean if the value is an object type (e.g., {}).
 */
export function isObject(input: any): boolean {
    // Credit: https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
    return typeof input == 'object' && input !== null && !Array.isArray(input);
}