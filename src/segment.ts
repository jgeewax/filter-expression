/**
 * A Segment is a single field in a FieldPath.
 * 
 * Fundamentally this is a string value, but there is escaping involved which
 * means that the string value has two separate representations: the literal
 * one and the functional one.
 * 
 * We use backticks for escaping (per the EBNF grammar). This allows us to 
 * traverse values inside maps even when the map keys might include things like
 * dots. For example, if a map key is "foo.bar", the filter expression would
 * be something like map.`foo.bar` = "abcd".
 * 
 * In cases where backticks are required in the map key, we just use double
 * backticks. For example, to note a key value of "back`tick" we would have a
 * filter expression like map.`back``tick` = "abcd".
 * 
 * When turning a segment into a string value, you have an optional "quoted"
 * parameter in an options map which defaults to true.
 */

export class Segment {
    segment: string;

    constructor(segment: string) {
        this.segment = segment;
    }

    /**
     * Returns the string representation of a segment value.
     * 
     * @param options.quoted If true, returns the segment with any provided backticks and quoted double backticks.
     * @returns string
     */
    toString(options: { quoted?: boolean } = { quoted: true }): string {
        // TODO: Figure this out. I think there is more work here...
        if (options.quoted === false && this.segment[0] == '`') {
            return this.segment.substring(1, this.segment.length - 1).replace('``', '`');
        } else {
            return this.segment;
        }
    }
}