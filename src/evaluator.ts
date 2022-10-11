import { Filter } from './filter';
import { Scalar } from './types';
import { isObject } from './helpers';
import { FieldPath } from './field_path';
import { Expression } from './expression';


/**
 * An Evaluator accepts a Filter and determines if a record matches the filter.
 * 
 * The most common and simple usage is:
 * 
 *      let evaluator = Evaluator.fromFilterString('name = "Bob");
 *      let record = { name: 'Bob' };
 *      let result = evaluator.matches(record);
 */
export class Evaluator {
    filter: Filter;

    constructor(filter: Filter) {
        this.filter = filter;
    }

    static fromFilterString(filter: string): Evaluator {
        return new Evaluator(Filter.fromString(filter));
    }

    getValues(inputs: any | any[], fieldPath: FieldPath): any | any[] {
        // Make sure we always have an array and never a single value.
        if (!Array.isArray(inputs)) inputs = [inputs];

        // If there are no segments, we're left with just values to return.
        if (fieldPath.segments.length == 0) {
            return inputs as Scalar[];
        }

        // The start of our return value.
        let values: any[] = [];

        // We know we have at least one segment. Take the first one.
        let segment = fieldPath.segments[0].segment;
        // TODO: Move this into the Segment class. Figure out a name for this...
        if (segment[0] == '`') {
            segment = segment.substring(1, segment.length-1).replace('``', '`');
        }

        if (segment == '*') {
            for (let input of inputs) {
                // If this is an array, we just want to add all values in that
                // array to the outputs.
                // If this is an object, we want to add the values for all keys
                // to the outputs.
                if (Array.isArray(input)) {
                    values = values.concat(input);
                } else if (isObject(input)) {
                    values = values.concat(Object.values(input));
                }
            }
        } else {
            // For each of the inputs provided, get the field being addressed
            // and append it to the value outputs.
            // E.g., if the segment is "tags", then for each object input, add
            // input["tags"] to the values output.
            for (let input of inputs) {
                values.push(input[segment]);
            }
        }

        // Recurse with the remaining segments and the new values.
        return this.getValues(values, new FieldPath(fieldPath.segments.slice(1)));
    }


    compareMulti(values: Scalar[], expression: Expression): boolean {
        // True if ANY of the values matches the right side of ALL expressions.

        // For each value, do a comparison. If that comparison matches the
        // entire value, return true and short-circuit (we only need one match).
        // Otherwise, return false.
        for (let value of values) {
            if (this.compare(value, expression)) {
                return true;
            }
        }
        return false;
    }

    compare(value: Scalar, expression: Expression): boolean {
        // True if the value matches the ENTIRE expression.
        // The fieldPath portion of the expression is ignored as we assume the
        // values provided have been "nagivated to" using getValues().

        // Check for equality using any of the three equality symbols.
        if ([':', '=', '=='].indexOf(expression.comparator) >= 0)
            return (value === expression.value.value);

        // Check for strict inequality (works for all scalar values).
        if (expression.comparator == '!=')
            return (value !== expression.value.value);

        // Check for numeric/text inequality if we're dealing with a number or a
        // string value (e.g., 'b' > 'a').
        // All of these are pretty straightforward. Check the comparator and
        // perform the comparison.
        if (expression.value.value != null &&
            (typeof value == 'number' || typeof value == 'string')) {
            if (expression.comparator == '>')
                return (value > expression.value.value);

            if (expression.comparator == '>=')
                return (value >= expression.value.value);

            if (expression.comparator == '<')
                return (value < expression.value.value);

            if (expression.comparator == '<=')
                return (value <= expression.value.value);
        }

        // If we find anything else, something broke with the grammar as we
        // have covered all the comparator values.
        throw new Error(`Unknown comparator ${expression.comparator}`);
    }

    matches(record: Record<string, any>): boolean {
        // Figure out if a record matches the filter provided when creating
        // this Evaluator instance.

        // Go through each expression.
        for (let expression of this.filter.expressions) {
            // Find all the values for each expression's field path
            // (e.g., if the field path is tags.*.id then we'd return all the
            // values for the `id` field inside the array of objects in the
            // tags field.)
            let values = this.getValues(record, expression.fieldPath);
            // Do a comparison across all of these. If it fails, short-circuit
            // and return false.
            if (!this.compareMulti(values, expression)) return false;
        }

        // Only return true if all the expressions match.
        return true;
    }
}