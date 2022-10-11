import { IToken } from 'ebnf';

import { FieldPath } from './field_path';
import { Comparator } from './types';
import { Value } from './value';


export class Expression {
    fieldPath: FieldPath;
    comparator: Comparator;
    value: Value;

    constructor(fieldPath: FieldPath, comparator: Comparator, value: Value) {
        this.fieldPath = fieldPath
        this.comparator = comparator;
        this.value = value;
    }

    static fromAst(input: IToken): Expression {
        if (input.type !== 'expression') {
            throw new Error(`Invalid input type ${input.type}`);
        }

        let fieldPath: FieldPath;
        let comparator: Comparator;
        let value: Value;

        for (let component of input.children) {
            if (component.type == 'fieldPath') {
                fieldPath = FieldPath.fromAst(component);
            } else if (component.type == 'comparator') {
                comparator = component.text as Comparator;
            } else if (component.type == 'value') {
                value = Value.fromAst(component);
            }
        }
        return new Expression(fieldPath!, comparator!, value!);
    }

    toString(): string {
        return `${this.fieldPath} ${this.comparator} ${this.value}`;
    }
}