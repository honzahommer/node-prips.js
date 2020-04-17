const chai = require('chai');
const { expect } = require('chai');
const { prips, Prips } = require('../');

describe('prips.js#prips', () => {
  it('prips to be ok', () => {
    expect(prips).to.be.ok;
  });

  it('prips 192.168.0.0/30', () => {
    expect(prips('192.168.0.0/30')).to.have.lengthOf(4);
  });

  it('prips 192.168.0.0/255.255.255.252', () => {
    expect(prips('192.168.0.0/255.255.255.252')).to.have.lengthOf(4);
  });

  it('prips 192.168.0.10 192.168.0.19', () => {
    expect(prips('192.168.0.10', '192.168.0.19')).to.have.lengthOf(10);
  });

  it('prips 192.168.0.1000', () => {
    expect(prips.bind(prips, '192.168.0.1000')).to.throw(Error);
  });

  it('prips 192.168.0.1000 192.168.0.109', () => {
    expect(prips.bind(prips, '192.168.0.1000', '192.168.0.109')).to.throw(Error);
  });

  it('prips 192.168.0.100 192.168.0.1009', () => {
    expect(prips.bind(prips, '192.168.0.100', '192.168.0.1009')).to.throw(Error);
  });

  it('prips 192.168.0.100 192.168.0.109 { increment: 4 }', () => {
    expect(prips('192.168.0.100', '192.168.0.109', { increment: 4 })).to.have.lengthOf(3);
  });

  it('prips 192.168.0.100/30 { increment: 4 }', () => {
    expect(prips('192.168.0.100/30', { increment: 4 })).to.have.lengthOf(1);
  });

  it('prips 192.168.0.100/30 { increment: 0 }', () => {
    expect(prips.bind(prips, '192.168.0.100/30', { increment: 0 })).to.throw(Error);
  });

  it('prips 192.168.0.100/30 { format: dec }', () => {
    expect(prips('192.168.0.100/30', { format: 'dec' })).to.include.members([ 3232235620, 3232235621 ]);
  });

  it('prips 192.168.0.100/30 { format: dot }', () => {
    expect(prips('192.168.0.100/30', { format: 'dot' })).to.include.members(['192.168.0.100', '192.168.0.101']);
  });

  it('prips 192.168.0.100/30 { format: hex }', () => {
    expect(prips('192.168.0.100/30', { format: 'hex' })).to.include.members([ '0xC0A80064', '0xC0A80065' ]);
  });

  it('prips 192.168.0.100/30 { format: foo }', () => {
    expect(prips.bind(prips, '192.168.0.100/30', { format: 'foo' })).to.throw(Error);
  });
});

describe('prips.js#Prips', () => {
  it('Prips to be ok', () => {
    expect(Prips).to.be.ok;
  });

  it('Prips.dot2dec', () => {
    expect(Prips.dot2dec('127.0.0.1')).to.equal(2130706433);
  });

  it('Prips.dec2dot', () => {
    expect(Prips.dec2dot(2130706433)).to.equal('127.0.0.1');
  });

  it('Prips.dec2hex', () => {
    expect(Prips.dec2hex(2130706433)).to.equal('0x7F000001');
  });

  it('Prips.mask2cidr', () => {
    expect(Prips.mask2cidr('255.255.255.0')).to.equal(24);
  });

  it('Prips.cidr2hosts', () => {
    expect(Prips.cidr2hosts(30)).to.equal(2);
  });

  it('Prips.cidr2dec', () => {
    expect(Prips.cidr2dec(24)).to.equal(-256);
  });

  it('Prips.cidr2mask', () => {
    expect(Prips.cidr2mask(24)).to.equal('255.255.255.0');
  });
});
