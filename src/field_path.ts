import { IToken } from 'ebnf';

import { Segment } from './segment';

/**
 * A FieldPath represents a pointer to a specific field inside a resource.
 * This might be something like "author.first_name" for a single field, or
 * using a wildcard could refer to many different values such as
 * tags.*.id.
 */
export class FieldPath {
    segments: Segment[];

    constructor(segments: Segment[]) {
        this.segments = segments;
    }

    static fromAst(input: IToken): FieldPath {
        return new FieldPath(input.children.map((token) => {
            return new Segment(token.text);
        }));
    }

    toString(): string {
        return '[ ' + this.segments.map((seg) => {
            return seg.toString({ quoted: false });
        }).join(', ') + ' ]';
    }
}