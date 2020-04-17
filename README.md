# prips.js

[![npm Package](https://img.shields.io/npm/v/prips.js.svg)](https://www.npmjs.org/package/prips.js)
[![License](https://img.shields.io/npm/l/express.svg)](https://github.com/honzahommer/node-prips.js/blob/master/LICENSE)
[![build status](https://img.shields.io/travis/honzahommer/node-prips.js/master.svg)](http://travis-ci.org/honzahommer/node-prips.js)
[![downloads per month](http://img.shields.io/npm/dm/prips.js.svg)](https://www.npmjs.org/package/prips.js)

> Prints IP subnet ranges by list or CIDR

## Installation

> npm install prips.js

## Usage

```js
const prips = require('prips');

prips('192.168.0.0/30');
// => [ '192.168.0.0', '192.168.0.1', '192.168.0.2', '192.168.0.3' ]

prips('192.168.0.0/255.255.255.252', { format: 'hex' });
// => [ '0xC0A80000', '0xC0A80001', '0xC0A80002', '0xC0A80003' ]

prips('192.168.0.0 255.255.255.252', { format: 'dec' });
// => [ 3232235520, 3232235521, 3232235522, 3232235523 ]

prips('192.168.0.0', '192.168.0.3', { increment: 2 });
// => [ '192.168.0.0', '192.168.0.2' ]
```

### Options

* `format` - dec | dot | hex (default dot)
* `increment` - positive integer (default 1)

## CLI

```sh
$ prips.js -h
// => usage: prips.js [options] <start end | CIDR block>
// =>         -h              display this help message and exit
// =>         -f <x>          set the format of addresses (hex, dec, or dot)
// =>         -i <x>          set the increment to `x`
```

## License

MIT
