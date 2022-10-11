import { IToken } from 'ebnf';

import { Filter } from '../src/filter';

describe('Filter', () => {
    describe('fromString', () => {
        test('simple', () => {
            let filter = Filter.fromString('a = 4');
            expect(filter.expressions.length).toEqual(1);
            let expr = filter.expressions[0];
            expect(expr.fieldPath.segments.length).toEqual(1);
            expect(expr.toString()).toEqual('[ a ] = 4');
        });

        test('multi', () => {
            let filter = Filter.fromString('a = 4 b = 5');
            expect(filter.expressions.length).toEqual(2);
        });

        test('number and string', () => {
            let filter = Filter.fromString('a = 4 b = "asdf"');
            expect(filter.expressions.length).toEqual(2);
        });
    });
});