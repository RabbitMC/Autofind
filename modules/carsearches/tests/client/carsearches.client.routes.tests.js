(function () {
  'use strict';

  describe('Carsearches Route Tests', function () {
    // Initialize global variables
    var $scope,
      CarsearchesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CarsearchesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CarsearchesService = _CarsearchesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('carsearches');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/carsearches');
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
          CarsearchesController,
          mockCarsearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('carsearches.view');
          $templateCache.put('modules/carsearches/client/views/view-carsearch.client.view.html', '');

          // create mock Carsearch
          mockCarsearch = new CarsearchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Carsearch Name'
          });

          //Initialize Controller
          CarsearchesController = $controller('CarsearchesController as vm', {
            $scope: $scope,
            carsearchResolve: mockCarsearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:carsearchId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.carsearchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            carsearchId: 1
          })).toEqual('/carsearches/1');
        }));

        it('should attach an Carsearch to the controller scope', function () {
          expect($scope.vm.carsearch._id).toBe(mockCarsearch._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/carsearches/client/views/view-carsearch.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CarsearchesController,
          mockCarsearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('carsearches.create');
          $templateCache.put('modules/carsearches/client/views/form-carsearch.client.view.html', '');

          // create mock Carsearch
          mockCarsearch = new CarsearchesService();

          //Initialize Controller
          CarsearchesController = $controller('CarsearchesController as vm', {
            $scope: $scope,
            carsearchResolve: mockCarsearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.carsearchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/carsearches/create');
        }));

        it('should attach an Carsearch to the controller scope', function () {
          expect($scope.vm.carsearch._id).toBe(mockCarsearch._id);
          expect($scope.vm.carsearch._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/carsearches/client/views/form-carsearch.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CarsearchesController,
          mockCarsearch;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('carsearches.edit');
          $templateCache.put('modules/carsearches/client/views/form-carsearch.client.view.html', '');

          // create mock Carsearch
          mockCarsearch = new CarsearchesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Carsearch Name'
          });

          //Initialize Controller
          CarsearchesController = $controller('CarsearchesController as vm', {
            $scope: $scope,
            carsearchResolve: mockCarsearch
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:carsearchId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.carsearchResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            carsearchId: 1
          })).toEqual('/carsearches/1/edit');
        }));

        it('should attach an Carsearch to the controller scope', function () {
          expect($scope.vm.carsearch._id).toBe(mockCarsearch._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/carsearches/client/views/form-carsearch.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
