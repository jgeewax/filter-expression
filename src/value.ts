import { IToken } from 'ebnf';

import { Scalar } from './types';


export class Value {
    value: Scalar;

    constructor(value: Scalar) {
        this.value = value;
    }

    static fromString(input: string) {
        let value: Scalar;

        if (input[0] == '"') {
            value = input.substring(1, input.length - 1);
        } else if (input == 'true') {
            value = true;
        } else if (input == 'false') {
            value = false;
        } else if (input == 'null') {
            value = null;
        } else {
            value = parseFloat(input);
        }
        return new Value(value);
    }

    static fromAst(input: IToken) {
        return Value.fromString(input.text);
    }

    toString(): string {
        if (typeof this.value === 'string') {
            return `"${this.value}"`;
        } else {
            return `${this.value}`;
        }
    }
}