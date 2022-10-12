import { IToken } from 'ebnf';

import { Value } from '../src/value';

describe('Value', () => {
    describe('fromString', () => {
        test('boolean true', () => {
            expect(Value.fromString('true').value).toBe(true);
        });

        test('boolean false', () => {
            expect(Value.fromString('false').value).toBe(false);
        });

        test('null', () => {
            expect(Value.fromString('null').value).toBe(null);
        });

        test('strings', () => {
            expect(Value.fromString('"string"').value).toEqual('string');
            expect(Value.fromString('"st\\"ring"').value).toEqual('st"ring');
            expect(Value.fromString('"true"').value).toEqual('true');
            expect(Value.fromString('"1234"').value).toBe('1234');
        });

        test('numbers', () => {
            expect(Value.fromString('1234').value).toBe(1234);
            expect(Value.fromString('1.2').value).toBe(1.2);
        });

        test('complex throws error', () => {
            expect(() => Value.fromString('{}')).toThrow('Invalid input');
        });
    });
});