(function () {
  'use strict';

  angular
    .module('carfinds')
    .controller('CarfindsListController', CarfindsListController);

  CarfindsListController.$inject = ['CarfindsService'];

  function CarfindsListController(CarfindsService) {
    var vm = this;

    vm.carfinds = CarfindsService.query();
  }
})();
