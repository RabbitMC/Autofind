(function () {
  'use strict';

  angular
    .module('carfinds')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Cars',
      state: 'carfinds',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'carfinds', {
      title: 'List Cars',
      state: 'carfinds.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'carfinds', {
      title: 'Add a Car',
      state: 'carfinds.create',
      roles: ['user']
    });
  }
})();
