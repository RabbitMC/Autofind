(function () {
  'use strict';

  angular
    .module('carsearches')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Carsearches',
      state: 'carsearches',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'carsearches', {
      title: 'List Carsearches',
      state: 'carsearches.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'carsearches', {
      title: 'Create Carsearch',
      state: 'carsearches.create',
      roles: ['user']
    });
  }
})();
