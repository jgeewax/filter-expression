import { IToken } from 'ebnf';

import { FieldPath } from '../src/field_path';
import { Segment } from '../src/segment';

describe('FieldPath', () => {
    describe('constructor', () => {
        test('simple', () => {
            let fieldPath = new FieldPath([]);
            expect(fieldPath.segments.length).toEqual(0);
        });
    });

    describe('fromAst', () => {
        test('empty', () => {
            let itoken: IToken = {
                type: 'fieldPath',
                text: '',
                start: 0,
                end: 0,
                children: [],
                parent: null!,
                fullText: '',
                errors: [],
                rest: ''
            };

            let fieldPath = FieldPath.fromAst(itoken as IToken);
            expect(fieldPath.segments.length).toEqual(0);
        });

        test('single field', () => {
            let seg: IToken = {
                type: 'segment',
                text: 'tags',
                start: 0,
                end: 4,
                children: [],
                parent: null!,
                fullText: 'tags',
                errors: [],
                rest: ''
            };

            let itoken: IToken = {
                type: 'fieldPath',
                text: 'tags',
                start: 0,
                end: 4,
                children: [seg],
                parent: null!,
                fullText: 'tags',
                errors: [],
                rest: ''
            };

            let fieldPath = FieldPath.fromAst(itoken as IToken);
            expect(fieldPath.segments.length).toEqual(1);
            expect(fieldPath.segments[0].segment).toEqual('tags');
        });

        test('nested field', () => {
            let author: IToken = {
                type: 'segment',
                text: 'author',
                start: 0,
                end: 5,
                children: [],
                parent: null!,
                fullText: 'author',
                errors: [],
                rest: ''
            };
            let name: IToken = {
                type: 'segment',
                text: 'name',
                start: 7,
                end: 10,
                children: [],
                parent: null!,
                fullText: 'name',
                errors: [],
                rest: ''
            };

            let fp: IToken = {
                type: 'fieldPath',
                text: 'author.name',
                start: 0,
                end: 10,
                children: [author, name],
                parent: null!,
                fullText: 'author.name',
                errors: [],
                rest: ''
            };
            author.parent = fp;
            name.parent = fp;

            let fieldPath = FieldPath.fromAst(fp);
            expect(fieldPath.segments.length).toEqual(2);
            expect(fieldPath.segments[0].segment).toEqual('author');
            expect(fieldPath.segments[1].segment).toEqual('name');
        });
    });

    describe('toString', () => {
        test('simple', () => {
            let segments = ['author', 'name'].map((s) => new Segment(s));
            let fieldPath = new FieldPath(segments);
            expect(fieldPath.toString()).toEqual('[ author, name ]');
        });

        test('not quoted', () => {
            let segments = ['`author`', '`name`'].map((s) => new Segment(s));
            let fieldPath = new FieldPath(segments);
            expect(fieldPath.toString()).toEqual('[ author, name ]');
        });
    });
});