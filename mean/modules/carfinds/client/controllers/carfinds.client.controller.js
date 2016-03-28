(function () {
  'use strict';

  // Carfinds controller
  angular
    .module('carfinds')
    .controller('CarfindsController', CarfindsController);

  CarfindsController.$inject = ['$scope', '$state', 'Authentication', 'carfindResolve'];

  function CarfindsController ($scope, $state, Authentication, carfind) {
    var vm = this;

    vm.authentication = Authentication;
    vm.carfind = carfind;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Carfind
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.carfind.$remove($state.go('carfinds.list'));
      }
    }

    // Save Carfind
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.carfindForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.carfind._id) {
        vm.carfind.$update(successCallback, errorCallback);
      } else {
        vm.carfind.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('carfinds.view', {
          carfindId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
