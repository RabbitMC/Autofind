//Carsearches service used to communicate Carsearches REST endpoints
(function () {
  'use strict';

  angular
    .module('carsearches')
    .factory('CarsearchesService', CarsearchesService);

  CarsearchesService.$inject = ['$resource'];

  function CarsearchesService($resource) {
    return $resource('api/carsearches/:carsearchId', {
      carsearchId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
