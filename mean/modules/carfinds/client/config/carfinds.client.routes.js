(function () {
  'use strict';

  angular
    .module('carfinds')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('carfinds', {
        abstract: true,
        url: '/carfinds',
        template: '<ui-view/>'
      })
      .state('carfinds.list', {
        url: '',
        templateUrl: 'modules/carfinds/client/views/list-carfinds.client.view.html',
        controller: 'CarfindsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Carfinds List'
        }
      })
      .state('carfinds.create', {
        url: '/create',
        templateUrl: 'modules/carfinds/client/views/form-carfind.client.view.html',
        controller: 'CarfindsController',
        controllerAs: 'vm',
        resolve: {
          carfindResolve: newCarfind
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Carfinds Create'
        }
      })
      .state('carfinds.edit', {
        url: '/:carfindId/edit',
        templateUrl: 'modules/carfinds/client/views/form-carfind.client.view.html',
        controller: 'CarfindsController',
        controllerAs: 'vm',
        resolve: {
          carfindResolve: getCarfind
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Carfind {{ carfindResolve.name }}'
        }
      })
      .state('carfinds.view', {
        url: '/:carfindId',
        templateUrl: 'modules/carfinds/client/views/view-carfind.client.view.html',
        controller: 'CarfindsController',
        controllerAs: 'vm',
        resolve: {
          carfindResolve: getCarfind
        },
        data:{
          pageTitle: 'Carfind {{ articleResolve.name }}'
        }
      });
  }

  getCarfind.$inject = ['$stateParams', 'CarfindsService'];

  function getCarfind($stateParams, CarfindsService) {
    return CarfindsService.get({
      carfindId: $stateParams.carfindId
    }).$promise;
  }

  newCarfind.$inject = ['CarfindsService'];

  function newCarfind(CarfindsService) {
    return new CarfindsService();
  }
})();
