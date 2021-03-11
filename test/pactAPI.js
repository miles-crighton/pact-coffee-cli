var expect = require('chai').expect;
var apiInterface = require('../src/pactAPIInterface');
var crypto = require('../src/crypto');
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
let authToken;

describe('Pact API Requests', () => {
  describe('Get an auth token', () => {
    it('should get a valid auth token', async () => {
      const email = process.env.CREDS_EMAIL;
      const password = await crypto.decrypt(process.env.CREDS_PASSWORD);
      const req = await apiInterface.getAuthToken({
        email,
        password,
      });
      expect(req).to.be.an('string');
      authToken = req;
    });
  });

  describe('Get required data', () => {
    // Make sure we've got an auth token before fetching from the API
    var checkAuthToken = function (done) {
      if (authToken) done();
      else
        setTimeout(() => {
          checkAuthToken(done);
          retryCount++;
        }, 1000);
    };

    before(function (done) {
      checkAuthToken(done);
    });

    describe('Fetch User Data', () => {
      it('Should have all required fields', async () => {
        const req = await apiInterface.getUserData(authToken);

        expect(req).to.have.nested.property('start.order_ids[0]');
        expect(req).to.have.nested.property('orders[0].dispatch_on');
        expect(req).to.have.nested.property('items[0].product_name');
      });
    });

    describe('Fetch Order History', () => {
      it('Should have all required fields', async () => {
        const req = await apiInterface.getOrderHistory(authToken);
        expect(req).to.have.nested.property('orders[0].current_state');
        expect(req).to.have.nested.property('orders[0].item_ids[0]');
        expect(req).to.have.nested.property('orders[0].dispatch_on');
        expect(req).to.have.nested.property('items[0].product_name');
      });
    });
  });
});
