'use strict';

describe('Carsearches E2E Tests:', function () {
  describe('Test Carsearches page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/carsearches');
      expect(element.all(by.repeater('carsearch in carsearches')).count()).toEqual(0);
    });
  });
});
