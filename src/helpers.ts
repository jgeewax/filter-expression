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

export function isScalar(input: any): boolean {
    // Returns true if the value is null, true, false, or any number or any string.
    return input === null || ['boolean', 'number', 'string'].indexOf(typeof input) >= 0;
}