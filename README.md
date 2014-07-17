# json-schema-formatter
[![Build Status](https://travis-ci.org/lemonde/json-schema-formatter.svg?branch=master)](https://travis-ci.org/lemonde/json-schema-formatter)
[![Dependency Status](https://david-dm.org/lemonde/json-schema-formatter.svg?theme=shields.io)](https://david-dm.org/lemonde/json-schema-formatter)
[![devDependency Status](https://david-dm.org/lemonde/json-schema-formatter/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/json-schema-formatter#info=devDependencies)

JSON Schema formatter.

## Install

```
npm install git://github.com/lemonde/json-schema-formatter.git
```

## Usage

Formatter (JS Object to JSON Schema).

```js
var jsonSchemaFormatter = require('json-schema-formatter').format;
var jsonSchema = jsonSchemaFormatter({
  body: {
    foo: 'bar'
  },
  metadata: {
    count: 200
  },
  url: 'http://myapi.com/article/1'
});

```

Parser (JSON Schema to JS Object)

```js
var jsonSchemaParser = require('json-schema-formatter').parse;
var bookshelf = jsonSchemaParser({
  body: {
    //json schema meta
    metas: {
    },
    //json schema main resource
    resources: {
    }
  }
});

```

## License

MIT
