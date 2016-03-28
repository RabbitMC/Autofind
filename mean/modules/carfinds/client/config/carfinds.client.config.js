(function () {
  'use strict';

  angular
    .module('carfinds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Carfinds',
      state: 'carfinds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'carfinds', {
      title: 'List Carfinds',
      state: 'carfinds.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'carfinds', {
      title: 'Create Carfind',
      state: 'carfinds.create',
      roles: ['user']
    });
  }
})();
