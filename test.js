var assert = require('assert');
var helpers = require('./helpers');

describe('Helper Functions', function () {
    describe('#reverseDate()', function () {
        it('should convert 20/03/2020 into 2020-03-20', function () {
            assert.equal(helpers.reverseDate('20/03/2020', '/', '-'), '2020-03-20');
        });
        it('should convert 2020-04-13 into 13/04/2020', function () {
            assert.equal(helpers.reverseDate('2020-04-13', '-', '/'), '13/04/2020');
        });
    });
    describe('#toBASE64()', function () {
        it('should convert decimal into BASE64', function() {
            assert.equal(helpers.toBASE64('e22fde8f-9ed0-4b8b-a525-9ecb056496af'), 
                'ZTIyZmRlOGYtOWVkMC00YjhiLWE1MjUtOWVjYjA1NjQ5NmFm==');
            assert.equal(helpers.toBASE64('2f114a15-1fde-404a-b481-2adb06749baa'),
                'MmYxMTRhMTUtMWZkZS00MDRhLWI0ODEtMmFkYjA2NzQ5YmFh==');
        });
    });
});