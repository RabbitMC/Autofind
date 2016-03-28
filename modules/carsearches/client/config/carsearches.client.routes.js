(function () {
  'use strict';

  angular
    .module('carsearches')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('carsearches', {
        abstract: true,
        url: '/carsearches',
        template: '<ui-view/>'
      })
      .state('carsearches.list', {
        url: '',
        templateUrl: 'modules/carsearches/client/views/list-carsearches.client.view.html',
        controller: 'CarsearchesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Carsearches List'
        }
      })
      .state('carsearches.create', {
        url: '/create',
        templateUrl: 'modules/carsearches/client/views/form-carsearch.client.view.html',
        controller: 'CarsearchesController',
        controllerAs: 'vm',
        resolve: {
          carsearchResolve: newCarsearch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Carsearches Create'
        }
      })
      .state('carsearches.edit', {
        url: '/:carsearchId/edit',
        templateUrl: 'modules/carsearches/client/views/form-carsearch.client.view.html',
        controller: 'CarsearchesController',
        controllerAs: 'vm',
        resolve: {
          carsearchResolve: getCarsearch
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Carsearch {{ carsearchResolve.name }}'
        }
      })
      .state('carsearches.view', {
        url: '/:carsearchId',
        templateUrl: 'modules/carsearches/client/views/view-carsearch.client.view.html',
        controller: 'CarsearchesController',
        controllerAs: 'vm',
        resolve: {
          carsearchResolve: getCarsearch
        },
        data:{
          pageTitle: 'Carsearch {{ articleResolve.name }}'
        }
      });
  }

  getCarsearch.$inject = ['$stateParams', 'CarsearchesService'];

  function getCarsearch($stateParams, CarsearchesService) {
    return CarsearchesService.get({
      carsearchId: $stateParams.carsearchId
    }).$promise;
  }

  newCarsearch.$inject = ['CarsearchesService'];

  function newCarsearch(CarsearchesService) {
    return new CarsearchesService();
  }
})();
