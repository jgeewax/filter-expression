import { IToken } from 'ebnf';

import { isObject } from '../src/helpers';

describe('Helpers', () => {
    describe('isObject', () => {
        test('scalars not object', () => {
            for (let input of [1, 'str', 1.2, null, true, false, undefined]) {
                expect(isObject(input)).toBe(false);
            }
        });

        test('array not object', () => {
            expect(isObject([1, 2, 3])).toBe(false);
        });

        test('object is object', () => {
            expect(isObject({})).toBe(true);
        });
    });
});