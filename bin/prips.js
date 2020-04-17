#!/usr/bin/env node

const prips = require('..');

try {
  const args = process.argv.slice(2).reduce((acc, arg, i, arr) => {
    if (arg !== null) {
      let { groups: { key, val } } = /-(?<key>[a-z])(?<val>.*)?/.exec(arg) || { groups: { } };

      if (key) {
        switch (key) {
          case 'h':
            console.log('usage: prips.js [options] <start end | CIDR block>');
            console.log('        -h              display this help message and exit');
            console.log('        -f <x>          set the format of addresses (hex, dec, or dot)');
            console.log('        -i <x>          set the increment to `x`');
            process.exit(0);
            break;
          case 'f':
            key = 'format';
            break;
          case 'i':
            key = 'increment';
            break;
          default:
            throw Error(`unknown option ${key}`);
        }

        if (!val) {
          val = arr[i + 1];
          arr[i + 1] = null;
        }

        acc[acc.length - 1][key] = val;
      } else {
        acc.splice(acc.length - 1, 0, arg);
      }
    }

    return acc;
  }, [{}]);

  console.log(prips.apply(prips, args).join('\n'));
} catch (e) {
  process.stderr.write(`prips.js: ${e.message}`);
  process.exit(1);
}
