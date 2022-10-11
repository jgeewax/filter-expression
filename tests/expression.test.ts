import { IToken } from 'ebnf';

import { Expression } from '../src/expression';
import { FieldPath } from '../src/field_path';
import { Segment } from '../src/segment';
import { Comparator } from '../src/types';
import { Value } from '../src/value';

describe('Segment', () => {
    test('constructor', () => {
        let fieldPath = new FieldPath([new Segment('id')]);
        let comparator = '=' as Comparator;
        let value = Value.fromString('"1234"');
        let expr = new Expression(fieldPath, comparator, value);
        expect(expr.fieldPath).toEqual(fieldPath);
        expect(expr.comparator).toEqual(comparator);
        expect(expr.value).toEqual(value);
    });

    describe('toString', () => {
        test('simple', () => {
            let fieldPath = new FieldPath([new Segment('id')]);
            let comparator = '=' as Comparator;
            let value = Value.fromString('"1234"');
            let expr = new Expression(fieldPath, comparator, value);
            expect(expr.toString()).toEqual('[ id ] = "1234"');
        });
    });
});