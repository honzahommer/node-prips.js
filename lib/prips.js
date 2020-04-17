class Prips {
  constructor (start, end, options) {
    const REGEX_ADDR = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
    const REGEX_MASK = '(?:255\\.){3}(?:255|254|252|248|240|224|192|128|0+))|(?:(?:255\\.){2}(?:255|254|252|248|240|224|192|128|0+)\\.0)|(?:(?:255\\.)(?:255|254|252|248|240|224|192|128|0+)(?:\\.0+){2})|(?:(?:255|254|252|248|240|224|192|128|0+)(?:\\.0+){3}';
    const REGEX_CIDR = '3[0-2]|[1-2][0-9]|[0-9]';
    const REGEX_SEPARATOR = '\\s*[\\/\\s]\\s*';

    const result = [];

    if (typeof end === 'object') {
      options = end;
      end = undefined;
    }

    let { increment, format } = {
      increment: 1,
      format: 'dot',
      ...options
    };

    if (!(increment > 0)) {
      throw Error('increment must be a positive integer');
    }

    switch (format) {
      case 'dec':
        format = (i) => i;
        break;
      case 'dot':
        format = Prips.dec2dot;
        break;
      case 'hex':
        format = Prips.dec2hex;
        break;
      default:
        throw Error(`invalid format ${format.toString()}`);
    }

    if (!end) {
      let { groups: { addr, mask, cidr = 32 } } = new RegExp(
        `^(?<addr>${REGEX_ADDR})(?:${REGEX_SEPARATOR}(?:(?<mask>${REGEX_MASK})|(?<cidr>${REGEX_CIDR})))?$`
      ).exec(start) || { groups: { } };

      if (addr) {
        if (mask) {
          cidr = Prips.mask2cidr(mask);
        } else {
          mask = Prips.cidr2mask(cidr);
        }

        start = Prips.dec2dot(Prips.dot2dec(addr) & Prips.dot2dec(mask));
        end = Prips.dec2dot(Prips.dot2dec(start) + Prips.cidr2hosts(cidr) + 1);
      }
    }

    if (!new RegExp(`^${REGEX_ADDR}$`).test(start)) {
      throw Error(`bad IP address ${start}`);
    }

    if (!new RegExp(`^${REGEX_ADDR}$`).test(end)) {
      throw Error(`bad IP address ${end}`);
    }

    for (let i = Prips.dot2dec(start); i <= Prips.dot2dec(end); i += parseInt(increment)) {
      result.push(format(i));
    }

    return result;
  }

  static dot2dec (dot) {
    return dot.split('.').map((octet, index, array) => {
      return parseInt(octet) * Math.pow(256, (array.length - index - 1));
    }).reduce((prev, curr) => {
      return prev + curr;
    });
  }

  static dec2dot (dec) {
    return [
      (dec >> 24) & 0xff,
      (dec >> 16) & 0xff,
      (dec >> 8) & 0xff,
      dec & 0xff
    ].join('.');
  }

  static dec2hex (dec) {
    return `0x${dec.toString(16).toUpperCase()}`;
  }

  static mask2cidr (mask) {
    let dec = mask.split('.').reduce((acc, val) => {
      return (acc << 8 | val) >>> 0;
    });

    dec -= (dec >>> 1) & 0x55555555;
    dec = (dec & 0x33333333) + (dec >>> 2 & 0x33333333);

    return ((dec + (dec >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
  }

  static cidr2hosts (cidr) {
    return Math.pow(2, (32 - cidr)) - 2;
  }

  static cidr2dec (cidr) {
    return -1 << (32 - cidr);
  }

  static cidr2mask (cidr) {
    return Prips.dec2dot(Prips.cidr2dec(cidr));
  }
}

const prips = function prips (start, end, options) {
  return new Prips(start, end, options);
};

module.exports = Object.assign(prips, {
  default: prips,
  prips,
  Prips
});
