import { Evaluator } from '../src/evaluator';

describe('Evaluator', () => {
    describe('fromFilterString', () => {
        test('simple', () => {
            let evaluator = Evaluator.fromFilterString('a = 4');
            expect(evaluator.filter.expressions.length).toEqual(1);
        });
    });

    describe('matches', () => {
        test('simple number', () => {
            let evaluator = Evaluator.fromFilterString('a = 4');
            expect(evaluator.matches({a: 4})).toBe(true);
        });

        test('simple string', () => {
            let evaluator = Evaluator.fromFilterString('a = "4"');
            expect(evaluator.matches({a: '4'})).toBe(true);
            expect(evaluator.matches({a: 4})).toBe(false);
        });

        test('multi', () => {
            let evaluator = Evaluator.fromFilterString('a = 4 b = 2');
            expect(evaluator.matches({a: 4, b: 2})).toBe(true);
        });

        test('nested', () => {
            let evaluator = Evaluator.fromFilterString('author.name = "Bob"');
            expect(evaluator.matches({author: { name: 'Bob' }})).toBe(true);
        });

        test('nested with escape characters', () => {
            let evaluator = Evaluator.fromFilterString('author.`na.me` = "Bob"');
            expect(evaluator.matches({author: { 'na.me': 'Bob' }})).toBe(true);
        });

        test('nested with escape characters and backticks', () => {
            let evaluator = Evaluator.fromFilterString('author.`na.``me` = "Bob"');
            expect(evaluator.matches({author: { 'na.`me': 'Bob' }})).toBe(true);
        });

        test('top level wildcard', () => {
            let evaluator = Evaluator.fromFilterString('* = "Bob"');
            expect(evaluator.matches({author: 'Bob' })).toBe(true);
        });

        test('array wildcard', () => {
            let evaluator = Evaluator.fromFilterString('tags.* = "tech"');
            expect(evaluator.matches({tags: ['tech'] })).toBe(true);
        });

        test('nested array wildcard', () => {
            let evaluator = Evaluator.fromFilterString('tags.*.id = "1234"');
            expect(evaluator.matches({tags: [{ id: '1234' }] })).toBe(true);
        });

        test('map keys wildcard', () => {
            let evaluator = Evaluator.fromFilterString('labels.* = "tech"');
            expect(evaluator.matches({labels: { category: 'tech' } })).toBe(true);
        });

        test('equality different types', () => {
            let evaluator = Evaluator.fromFilterString('age = "21"');
            expect(evaluator.matches({ age: 21 })).toBe(false);
            expect(evaluator.matches({ age: "21" })).toBe(true);
        });

        test('inequality different types', () => {
            let evaluator = Evaluator.fromFilterString('age > 20');
            expect(evaluator.matches({ age: 21 })).toBe(true);
            expect(evaluator.matches({ age: "21" })).toBe(false);
        });
    });

});