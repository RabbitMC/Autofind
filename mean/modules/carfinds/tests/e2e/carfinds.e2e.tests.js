'use strict';

describe('Carfinds E2E Tests:', function () {
  describe('Test Carfinds page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/carfinds');
      expect(element.all(by.repeater('carfind in carfinds')).count()).toEqual(0);
    });
  });
});
