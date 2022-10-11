import { Grammars, IToken } from 'ebnf';
import { readFileSync } from 'fs';

import { Expression } from './expression';


export class Filter {
    expressions: Expression[];

    constructor(expressions: Expression[]) {
        this.expressions = expressions;
    }

    static fromAst(input: IToken): Filter {
        return new Filter(input.children.map(Expression.fromAst));
    }

    static fromString(input: string): Filter {
        // If the filter string is empty, just return an empty filter with no expressions.
        if (input.trim() === '') return new Filter([]);

        let grammar = readFileSync('./filter.ebnf', { encoding: 'ascii' });
        let parser = new Grammars.W3C.Parser(grammar);
        let ast = parser.getAST(input.trim());
        if (ast === null) {
            throw new Error(`Invalid filter string "${input}"`)
        } else if (ast.errors.length != 0) {
            throw new Error(`Parsing error: ${ast.errors[0]}`);
        }
        return Filter.fromAst(ast);
    }
}