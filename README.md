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

```js
var jsonSchemaFormatter = require('json-schema-formatter');
var jsonSchema = jsonSchemaFormatter.format({
  body: {
    foo: 'bar'
  },
  metadata: {
    count: 200
  },
  url: 'http://myapi.com/article/1'
});

console.log(jsonSchema);
```

## License

MIT