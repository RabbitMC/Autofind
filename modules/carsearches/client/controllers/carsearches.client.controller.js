(function () {
  'use strict';

  // Carsearches controller
  angular
    .module('carsearches')
    .controller('CarsearchesController', CarsearchesController);

  CarsearchesController.$inject = ['$scope', '$state', 'Authentication', 'carsearchResolve'];

  function CarsearchesController ($scope, $state, Authentication, carsearch) {
    var vm = this;

    vm.authentication = Authentication;
    vm.carsearch = carsearch;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Carsearch
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.carsearch.$remove($state.go('carsearches.list'));
      }
    }

    // Save Carsearch
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.carsearchForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.carsearch._id) {
        vm.carsearch.$update(successCallback, errorCallback);
      } else {
        vm.carsearch.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('carsearches.view', {
          carsearchId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
