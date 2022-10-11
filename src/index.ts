import { assert } from 'console';
import { Grammars, IToken } from 'ebnf';
import { readFileSync } from 'fs';

import { isObject } from './helpers';

// const util = require('util');

// type Scalar = string | number | boolean | null;
// type Equals = '=' | ':' | '==';
// type Comparator = '<' | '>' | '<=' | '>=' | '!=' | Equals;


// class Evaluator {
//     filter: Filter;

//     constructor(filter: Filter) {
//         this.filter = filter;
//     }

//     getValues(inputs: any | any[], fieldPath: FieldPath): any | any[] {
//         // Make sure we always have an array and never a single value.
//         if (!Array.isArray(inputs)) inputs = [inputs];

//         // If there are no segments, we're left with just values to return.
//         if (fieldPath.segments.length == 0) {
//             return inputs as Scalar[];
//         }

//         // The start of our return value.
//         let values: any[] = [];

//         // We know we have at least one segment. Take the first one.
//         let segment = fieldPath.segments[0].segment;
//         if (segment == '*') {
//             for (let input of inputs) {
//                 // If this is an array, we just want to add all values in that
//                 // array to the outputs.
//                 // If this is an object, we want to add the values for all keys
//                 // to the outputs.
//                 if (Array.isArray(input)) {
//                     values = values.concat(input);
//                 } else if (isObject(input)) {
//                     values = values.concat(Object.values(input));
//                 }
//             }
//         } else {
//             // For each of the inputs provided, get the field being addressed
//             // and append it to the value outputs.
//             // E.g., if the segment is "tags", then for each object input, add
//             // input["tags"] to the values output.
//             for (let input of inputs) {
//                 values.push(input[segment]);
//             }
//         }

//         // Recurse with the remaining segments and the new values.
//         return this.getValues(values, new FieldPath(fieldPath.segments.slice(1)));
//     }


//     compareMulti(values: Scalar[], expression: Expression): boolean {
//         // True if ANY of the values matches the right side of ALL expressions.
        
//         // For each value, do a comparison. If that comparison matches the
//         // entire value, return true and short-circuit (we only need one match).
//         // Otherwise, return false.
//         for (let value of values) {
//             if (this.compare(value, expression)) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     compare(value: Scalar, expression: Expression): boolean {
//         // True if the value matches the ENTIRE expression.
//         // The fieldPath portion of the expression is ignored as we assume the
//         // values provided have been "nagivated to" using getValues().

//         // Check for equality using any of the three equality symbols.
//         if ([':', '=', '=='].indexOf(expression.comparator) >= 0)
//             return (value === expression.value.value);

//         // Check for strict inequality (works for all scalar values).
//         if (expression.comparator == '!=')
//             return (value !== expression.value.value);

//         // Check for numeric/text inequality if we're dealing with a number or a
//         // string value (e.g., 'b' > 'a').
//         // All of these are pretty straightforward. Check the comparator and
//         // perform the comparison.
//         if (expression.value.value != null && 
//             (typeof value == 'number' || typeof value == 'string')) {
//             if (expression.comparator == '>')
//                 return (value > expression.value.value);

//             if (expression.comparator == '>=')
//                 return (value >= expression.value.value);

//             if (expression.comparator == '<')
//                 return (value < expression.value.value);

//             if (expression.comparator == '<=')
//                 return (value <= expression.value.value);
//         }

//         // If we find anything else, something broke with the grammar as we
//         // have covered all the comparator values.
//         throw new Error(`Unknown comparator ${expression.comparator}`);
//     }

//     matches(record: Record<string, any>): boolean {
//         // Figure out if a record matches the filter provided when creating
//         // this Evaluator instance.

//         // Go through each expression.
//         for (let expression of this.filter.expressions) {
//             // Find all the values for each expression's field path
//             // (e.g., if the field path is tags.*.id then we'd return all the
//             // values for the `id` field inside the array of objects in the
//             // tags field.)
//             let values = this.getValues(record, expression.fieldPath);
//             // Do a comparison across all of these. If it fails, short-circuit
//             // and return false.
//             if (!this.compareMulti(values, expression)) return false;
//         }

//         // Only return true if all the expressions match.
//         return true;
//     }
// }


// class Filter {
//     expressions: Expression[];

//     constructor(expressions: Expression[]) {
//         this.expressions = expressions;
//     }

//     static fromAst(input: IToken): Filter {
//         return new Filter(input.children.map(Expression.fromAst));
//     }

//     static fromString(input: string): Filter {
//         let ast = parser.getAST(input);
//         if (ast === null) {
//             throw new Error(`Invalid filter string "${input}"`)
//         } else if (ast.errors.length != 0) {
//             throw new Error(`Parsing error: ${ast.errors[0]}`);
//         }
//         return Filter.fromAst(ast);
//     }
// }


// class Expression {
//     fieldPath: FieldPath;
//     comparator: Comparator;
//     value: Value;

//     constructor(fieldPath: FieldPath, comparator: Comparator, value: Value) {
//         this.fieldPath = fieldPath
//         this.comparator = comparator;
//         this.value = value;
//     }

//     static fromAst(input: IToken): Expression {
//         assert(input.type == 'expression');

//         let fieldPath: FieldPath;
//         let comparator: Comparator;
//         let value: Value;

//         for (let component of input.children) {
//             if (component.type == 'fieldPath') {
//                 fieldPath = FieldPath.fromAst(component);
//             } else if (component.type == 'comparator') {
//                 comparator = component.text as Comparator;
//             } else if (component.type == 'value') {
//                 value = Value.fromAst(component);
//             }
//         }
//         return new Expression(fieldPath!, comparator!, value!);
//     }

//     toString(): string {
//         return `${this.fieldPath} ${this.comparator} ${this.value}`;
//     }
// }


// class FieldPath {
//     segments: Segment[];

//     constructor(segments: Segment[]) {
//         this.segments = segments;
//     }

//     static fromAst(input: IToken): FieldPath {
//         let segments: Segment[] = [];
//         for (let token of input.children) {
//             segments.push(new Segment(token.text));
//         }
//         return new FieldPath(segments);
//     }

//     toString(): string {
//         return '[ ' + this.segments.map((seg) => seg.toString({ quoted: false })).join(', ') + ' ]';
//     }

//     [util.inspect.custom](depth: any, opts: any) {
//         return this.toString();
//     }
// }


// class Value {
//     value: Scalar;

//     constructor(value: Scalar) {
//         this.value = value;
//     }

//     static fromAst(input: IToken) {
//         let value: Scalar;

//         if (input.text[0] == '"') {
//             value = input.text.substring(1, input.text.length - 1);
//         } else if (input.text == 'true') {
//             value = true;
//         } else if (input.text == 'false') {
//             value = false;
//         } else if (input.text == 'null') {
//             value = null;
//         } else {
//             value = parseFloat(input.text);
//         }
//         return new Value(value);
//     }

//     toString(): string {
//         return `${this.value}`;
//     }

//     [util.inspect.custom](depth: any, opts: any) {
//         return this.toString();
//     }
// }


// class Segment {
//     segment: string;

//     constructor(segment: string) {
//         this.segment = segment;
//     }

//     toString(options: { quoted?: boolean } = { quoted: true }): string {
//         if (options.quoted === false && this.segment[0] == '`') {
//             return this.segment.substring(1, this.segment.length - 1).replace('``', '`');
//         } else {
//             return this.segment;
//         }
//     }
// }


// -----------------------------------------------------------------------------


import { Evaluator } from './evaluator';
let evaluator = Evaluator.fromFilterString(`
nested.*.foo = "b"
tags.* = "1"
map.foo = "bar"
name: "Bob"
`);

console.log(evaluator.matches({
    age: 20,
    name: 'Bob',
    tags: ['1', 2, null],
    map: { foo: 'bar', bar: 2 },
    nested: [
        { foo: 'a' },
        { foo: 'b' },
    ]
}));