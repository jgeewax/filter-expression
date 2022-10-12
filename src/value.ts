import { IToken } from 'ebnf';
import { isScalar } from './helpers';

import { Scalar } from './types';


export class Value {
    value: Scalar;

    constructor(value: Scalar) {
        this.value = value;
    }

    static fromString(input: string) {
        let value = JSON.parse(input);
        if (!isScalar(value)) throw new Error(`Invalid input ${input}`);
        return new Value(value as Scalar);
    }

    static fromAst(input: IToken) {
        return Value.fromString(input.text);
    }

    toString(): string {
        return JSON.stringify(this.value);
    }
}