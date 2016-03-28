'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Carfind = mongoose.model('Carfind'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, carfind;

/**
 * Carfind routes tests
 */
describe('Carfind CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Carfind
    user.save(function () {
      carfind = {
        name: 'Carfind name'
      };

      done();
    });
  });

  it('should be able to save a Carfind if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Carfind
        agent.post('/api/carfinds')
          .send(carfind)
          .expect(200)
          .end(function (carfindSaveErr, carfindSaveRes) {
            // Handle Carfind save error
            if (carfindSaveErr) {
              return done(carfindSaveErr);
            }

            // Get a list of Carfinds
            agent.get('/api/carfinds')
              .end(function (carfindsGetErr, carfindsGetRes) {
                // Handle Carfind save error
                if (carfindsGetErr) {
                  return done(carfindsGetErr);
                }

                // Get Carfinds list
                var carfinds = carfindsGetRes.body;

                // Set assertions
                (carfinds[0].user._id).should.equal(userId);
                (carfinds[0].name).should.match('Carfind name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Carfind if not logged in', function (done) {
    agent.post('/api/carfinds')
      .send(carfind)
      .expect(403)
      .end(function (carfindSaveErr, carfindSaveRes) {
        // Call the assertion callback
        done(carfindSaveErr);
      });
  });

  it('should not be able to save an Carfind if no name is provided', function (done) {
    // Invalidate name field
    carfind.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Carfind
        agent.post('/api/carfinds')
          .send(carfind)
          .expect(400)
          .end(function (carfindSaveErr, carfindSaveRes) {
            // Set message assertion
            (carfindSaveRes.body.message).should.match('Please fill Carfind name');

            // Handle Carfind save error
            done(carfindSaveErr);
          });
      });
  });

  it('should be able to update an Carfind if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Carfind
        agent.post('/api/carfinds')
          .send(carfind)
          .expect(200)
          .end(function (carfindSaveErr, carfindSaveRes) {
            // Handle Carfind save error
            if (carfindSaveErr) {
              return done(carfindSaveErr);
            }

            // Update Carfind name
            carfind.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Carfind
            agent.put('/api/carfinds/' + carfindSaveRes.body._id)
              .send(carfind)
              .expect(200)
              .end(function (carfindUpdateErr, carfindUpdateRes) {
                // Handle Carfind update error
                if (carfindUpdateErr) {
                  return done(carfindUpdateErr);
                }

                // Set assertions
                (carfindUpdateRes.body._id).should.equal(carfindSaveRes.body._id);
                (carfindUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Carfinds if not signed in', function (done) {
    // Create new Carfind model instance
    var carfindObj = new Carfind(carfind);

    // Save the carfind
    carfindObj.save(function () {
      // Request Carfinds
      request(app).get('/api/carfinds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Carfind if not signed in', function (done) {
    // Create new Carfind model instance
    var carfindObj = new Carfind(carfind);

    // Save the Carfind
    carfindObj.save(function () {
      request(app).get('/api/carfinds/' + carfindObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', carfind.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Carfind with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/carfinds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Carfind is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Carfind which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Carfind
    request(app).get('/api/carfinds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Carfind with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Carfind if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Carfind
        agent.post('/api/carfinds')
          .send(carfind)
          .expect(200)
          .end(function (carfindSaveErr, carfindSaveRes) {
            // Handle Carfind save error
            if (carfindSaveErr) {
              return done(carfindSaveErr);
            }

            // Delete an existing Carfind
            agent.delete('/api/carfinds/' + carfindSaveRes.body._id)
              .send(carfind)
              .expect(200)
              .end(function (carfindDeleteErr, carfindDeleteRes) {
                // Handle carfind error error
                if (carfindDeleteErr) {
                  return done(carfindDeleteErr);
                }

                // Set assertions
                (carfindDeleteRes.body._id).should.equal(carfindSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Carfind if not signed in', function (done) {
    // Set Carfind user
    carfind.user = user;

    // Create new Carfind model instance
    var carfindObj = new Carfind(carfind);

    // Save the Carfind
    carfindObj.save(function () {
      // Try deleting Carfind
      request(app).delete('/api/carfinds/' + carfindObj._id)
        .expect(403)
        .end(function (carfindDeleteErr, carfindDeleteRes) {
          // Set message assertion
          (carfindDeleteRes.body.message).should.match('User is not authorized');

          // Handle Carfind error error
          done(carfindDeleteErr);
        });

    });
  });

  it('should be able to get a single Carfind that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Carfind
          agent.post('/api/carfinds')
            .send(carfind)
            .expect(200)
            .end(function (carfindSaveErr, carfindSaveRes) {
              // Handle Carfind save error
              if (carfindSaveErr) {
                return done(carfindSaveErr);
              }

              // Set assertions on new Carfind
              (carfindSaveRes.body.name).should.equal(carfind.name);
              should.exist(carfindSaveRes.body.user);
              should.equal(carfindSaveRes.body.user._id, orphanId);

              // force the Carfind to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Carfind
                    agent.get('/api/carfinds/' + carfindSaveRes.body._id)
                      .expect(200)
                      .end(function (carfindInfoErr, carfindInfoRes) {
                        // Handle Carfind error
                        if (carfindInfoErr) {
                          return done(carfindInfoErr);
                        }

                        // Set assertions
                        (carfindInfoRes.body._id).should.equal(carfindSaveRes.body._id);
                        (carfindInfoRes.body.name).should.equal(carfind.name);
                        should.equal(carfindInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Carfind.remove().exec(done);
    });
  });
});
