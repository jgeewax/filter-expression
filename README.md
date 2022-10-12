# Filtering

This is a TypeScript library for parsing filter expressions and evaluating
whether they match a provided record.

## Installation

```sh
$ npm i --save filter-expression
```

## Simple usage

```typescript
import { Evaluator } from 'filter-expression';

let evaluator = Evaluator.fromFilterString('name = "Bob"');
let record = { name: 'Bob' };
let result = evaluator.matches(record);
```

## Functionality overview

### Things you can do with this syntax:

1. Simple equality matching for strings, numbers, booleans, and null values
   (e.g., `name = "Bob"`).
2. Simple inequality matching for the same types
   (e.g., `name != "Bob"` or `age != 44`).
3. Inequality (less than, greater than, etc) for numbers and strings
   (e.g., `age > 44`, `name > "A"`, `amount <= 100.4`).
4. Evaluate against nested values of static types
   (e.g., `favoriteBook.author.firstName = "Bob"`).
5. Evaluate against nested values inside maps
   (e.g., `labelsMap.dynamicKey = "value"`).
6. Evaluate against many values inside an array, succeeding if any values match
   (e.g., `tags.* = "tech"` or `favoriteNumbers.* > 10`).
7. Evaluate against all the values in an object or map
   (e.g., `labelsMap.* = "value"`).
8. Refer to map keys that might have weird names using backticks to escape keys
   (e.g., ``labelsMap.`weird.field.name` = "value"`` or ``labelsMap.`==` = 10``).

### Things you cannot do with this syntax:

1. Advanced boolean logic
   (e.g., `name = "Bob" OR name = "Sally" AND age > 21`).
2. Non-literal comparisons
   (e.g., `author.name = editor.name`).
3. Address individual items in an array
   (e.g., `tags[0] = "tech"`).
4. (currently) Check for existence of a key in a map
   (e.g., `labelsMap hasKey "category"`).
   (Note that you can check if a key value is non-null with `labelsMap.key != null`.)
5. String manipulation
   (e.g., `name[0] = "B"`)

## Grammar overview

Filter strings are made up of several pieces:

- **Filters** are collections of several expressions (e.g., `name = "Bob" age > 21`).
- **Expressions** are comparisons of a field (or field path) and a literal value using an operator (e.g., `field = "value"`).
- **Field paths** are ways to navigate to a specific field on a resource,
  including navigating inside maps or using wildcards (`*`) to compare against
  multiple values (e.g., all values in an array or all values in a map).
- **Comparators** are simple operators such as `=` or `>`.
- **Values** are literal, scalar values such as `"foo"`, `1234`, `null`, or `true`.

Note that for a filter to match a given resource, all of the expressions must match.

### Field paths

Field paths are ways of navigating to specific fields on a resource. Often this
is very straightforward, such as `title` or `author.name` for a `Book` resource.

Field paths can also be more complex, specifically in cases where maps are
involved as they can have key values that might have odd characters.
For example, imagine the following resource:

```json
{
    "title": "Book",
    "author": {
        "name": "Bob"
    },
    "labels": {
        "category": "tech",
        "=": "equals",
        "title.eng": "Book Eng",
        "test`s": "test"
    }
}
```

To address these values, we use a dot (`.`) as a traversal operator and backticks for quoting
reserved characters.
For example, the following filter expressions will all result in a match with the resource above:

- `title = "Book"`
- `author.name = "Bob"`
- `labels.category = "tech"`
- ``labels.`=` = "equals"``
- ``labels.`title.eng` = "Book Eng"``
- ```labels.`test``s` = "test"```

### Wildcards

Wildcards can be used to apply a comparison across multiple values, either all items in an array
or all values in a map.
For example, consider the following resource:

```json
{
    "title": "Book",
    "tags": ["tech", "typescript"],
    "authors": [
        { "id": 1, "name": "Bob" },
        { "id": 2, "name": "Sally" }
    ],
    "metadata": {
        "categories": ["tech", "internet"],
        "rating": 4.0
    }
}
```

Wildcards allow for the following scenarios:

- `tags.* = "tech"` would match because there is a single value in the `tags` field matching.
- `authors.*.name = "Bob"` would match because there is an author named Bob.
- `metadata.* > 3` would match because there is a piece of metadata with a value greater than 3.

### Comparators

This syntax supports the simple comparators for equality and inequality:

- Equals: `=` or `==` or `:`
- Inequality: `>`, `<`, `>=`, `<=`, and `!=`

For equality, both the values and the types must match.
This means that `{ id: 1234 }` would not match a filter of `id = "1234"`.
This is because the value set is a number and the value in the filter expression is a string.

For inequality, only the same types can be compared.
This means that `{ age: 21 }` would not match a filter of `age > "20"`
because the value is a number and the filter expression value is a string.

String value inequalities are performed by the Node engine.
This means that `"a" > "b"` evaluates as though it was typed out in a Node REPL.

### Values

Values are scalars. The following types are supported:

- **Strings** are any text surrouned by double quotes (e.g., `"Bob"`).
- **Numbers** can be any JSON supported number (e.g., `1`, `1.2`, `5e10`).
- **Booleans** are the literals `true` and `false`.
- **Nulls** are the literal `null` value.

Note that values **cannot** be complex values such as arrays or objects.
