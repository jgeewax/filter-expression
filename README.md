# Filtering

This is a TypeScript library for parsing filter expressions and evaluating
whether they match a provided record.

## Installation

```sh
$ npm i --save filter-expression
```

## Simple usage

```typescript
import { Evaluator } from '../src/evaluator';

let evaluator = Evaluator.fromFilterString('name = "Bob");
let record = { name: 'Bob' };
let result = evaluator.matches(record);
```

## Grammar overview

Filter strings are made up of several pieces:

- **Expressions** are simple matches (e.g., `fieldPath = "value"`).
- **Field paths** are ways to navigate to a specific field on a resource,
  including navigating inside maps and using wildcards to compare against
  multiple values (e.g., all values in an array or all values in a map).
- **Comparators** are simple evaluation expressions such as `=` or `>`.
- **Values** are literal, scalar values such as `"foo"`, `1234`, `null`, or `true`.

### Field paths

Field paths are ways of navigating to specific fields on a resource. Often this
is very straightforward, such as `title` or `author.name` for a Book resource.

Field paths can also be more complex, specifically in cases where maps are
involved as they can have key values that might have odd characters.
For example, imagine the following resource and how you might indicate the
various keys:

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

For these we use a very simple escaping mechanism, relying on backticks. For
example, the following filter expressions will all result in a match:

- `title = "Book"`
- `author.name = "Bob"`
- `labels.category = "tech"`
- ``labels.`=` = "equals"``
- ``labels.`title.eng` = "Book Eng"``
- ```labels.`test``s` = "test"```

You can see the full grammar at [filter.enbf][].

### Comparators

This syntax supports the simple comparators for equality and inequality:

- Equals: `=` or `==` or `:`
- Inequality: `>`, `<`, `>=`, `<=`, and `!=`

