(function () {
  'use strict';

  describe('Carfinds Route Tests', function () {
    // Initialize global variables
    var $scope,
      CarfindsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CarfindsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CarfindsService = _CarfindsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('carfinds');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/carfinds');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CarfindsController,
          mockCarfind;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('carfinds.view');
          $templateCache.put('modules/carfinds/client/views/view-carfind.client.view.html', '');

          // create mock Carfind
          mockCarfind = new CarfindsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Carfind Name'
          });

          //Initialize Controller
          CarfindsController = $controller('CarfindsController as vm', {
            $scope: $scope,
            carfindResolve: mockCarfind
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:carfindId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.carfindResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            carfindId: 1
          })).toEqual('/carfinds/1');
        }));

        it('should attach an Carfind to the controller scope', function () {
          expect($scope.vm.carfind._id).toBe(mockCarfind._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/carfinds/client/views/view-carfind.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CarfindsController,
          mockCarfind;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('carfinds.create');
          $templateCache.put('modules/carfinds/client/views/form-carfind.client.view.html', '');

          // create mock Carfind
          mockCarfind = new CarfindsService();

          //Initialize Controller
          CarfindsController = $controller('CarfindsController as vm', {
            $scope: $scope,
            carfindResolve: mockCarfind
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.carfindResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/carfinds/create');
        }));

        it('should attach an Carfind to the controller scope', function () {
          expect($scope.vm.carfind._id).toBe(mockCarfind._id);
          expect($scope.vm.carfind._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/carfinds/client/views/form-carfind.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CarfindsController,
          mockCarfind;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('carfinds.edit');
          $templateCache.put('modules/carfinds/client/views/form-carfind.client.view.html', '');

          // create mock Carfind
          mockCarfind = new CarfindsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Carfind Name'
          });

          //Initialize Controller
          CarfindsController = $controller('CarfindsController as vm', {
            $scope: $scope,
            carfindResolve: mockCarfind
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:carfindId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.carfindResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            carfindId: 1
          })).toEqual('/carfinds/1/edit');
        }));

        it('should attach an Carfind to the controller scope', function () {
          expect($scope.vm.carfind._id).toBe(mockCarfind._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/carfinds/client/views/form-carfind.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
