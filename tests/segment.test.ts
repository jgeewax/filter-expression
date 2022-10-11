import { IToken } from 'ebnf';

import { Segment } from '../src/segment';

describe('Segment', () => {
    test('constructor', () => {
        let seg = new Segment('fieldName');
        expect(seg.segment).toEqual('fieldName');
    });

    describe('toString', () => {
        test('quoted default', () => {
            let seg = new Segment('`quoted_with_backticks`');
            expect(seg.toString()).toEqual('`quoted_with_backticks`');
        });

        test('quoted explicit', () => {
            let seg = new Segment('`quoted_with_backticks`');
            expect(seg.toString({ quoted: true })).toEqual('`quoted_with_backticks`');
        });

        test('unquoted', () => {
            let seg = new Segment('`quoted_with_backticks`');
            expect(seg.toString({ quoted: false })).toEqual('quoted_with_backticks');
        });

        test('quoted with escape characters', () => {
            let seg = new Segment('`back``tick`');
            expect(seg.toString({ quoted: true })).toEqual('`back``tick`');
        });

        test('unquoted with escape characters', () => {
            let seg = new Segment('`back``tick`');
            expect(seg.toString({ quoted: false })).toEqual('back`tick');
        });
    });
});