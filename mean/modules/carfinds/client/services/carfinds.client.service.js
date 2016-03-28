//Carfinds service used to communicate Carfinds REST endpoints
(function () {
  'use strict';

  angular
    .module('carfinds')
    .factory('CarfindsService', CarfindsService);

  CarfindsService.$inject = ['$resource'];

  function CarfindsService($resource) {
    return $resource('api/carfinds/:carfindId', {
      carfindId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
