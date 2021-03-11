var expect = require('chai').expect;
var helpers = require('../src/helpers');

describe('Helper Functions', () => {
  describe('#reverseDate()', () => {
    it('should convert 20/03/2020 into 2020-03-20', () => {
      expect(helpers.reverseDate('20/03/2020', '/', '-')).to.equal(
        '2020-03-20'
      );
    });
    it('should convert 2020-04-13 into 13/04/2020', () => {
      expect(helpers.reverseDate('2020-04-13', '-', '/')).to.equal(
        '13/04/2020'
      );
    });
  });
  describe('#toBASE64()', () => {
    it('should convert an ASCII string into BASE64', () => {
      expect(helpers.toBASE64('e22fde8f-9ed0-4b8b-a525-9ecb056496af')).to.equal(
        'ZTIyZmRlOGYtOWVkMC00YjhiLWE1MjUtOWVjYjA1NjQ5NmFm=='
      );
      expect(helpers.toBASE64('2f114a15-1fde-404a-b481-2adb06749baa')).to.equal(
        'MmYxMTRhMTUtMWZkZS00MDRhLWI0ODEtMmFkYjA2NzQ5YmFh=='
      );
    });
  });
  // describe('#handleDateInput()', () => {
  //     it('should return date 20 days ahead with 20d input', function() {
  //         assert.equal(helpers.handleDateInput('20d'), '20d')
  //     });
  // });
});
