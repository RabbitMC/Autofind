(function () {
  'use strict';

  angular
    .module('carsearches')
    .controller('CarsearchesListController', CarsearchesListController);

  CarsearchesListController.$inject = ['CarsearchesService'];

  function CarsearchesListController(CarsearchesService) {
    var vm = this;

    vm.carsearches = CarsearchesService.query();
  }
})();
