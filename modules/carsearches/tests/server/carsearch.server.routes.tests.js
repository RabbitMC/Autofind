'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Carsearch = mongoose.model('Carsearch'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, carsearch;

/**
 * Carsearch routes tests
 */
describe('Carsearch CRUD tests', function () {

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

    // Save a user to the test db and create new Carsearch
    user.save(function () {
      carsearch = {
        name: 'Carsearch name'
      };

      done();
    });
  });

  it('should be able to save a Carsearch if logged in', function (done) {
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

        // Save a new Carsearch
        agent.post('/api/carsearches')
          .send(carsearch)
          .expect(200)
          .end(function (carsearchSaveErr, carsearchSaveRes) {
            // Handle Carsearch save error
            if (carsearchSaveErr) {
              return done(carsearchSaveErr);
            }

            // Get a list of Carsearches
            agent.get('/api/carsearches')
              .end(function (carsearchsGetErr, carsearchsGetRes) {
                // Handle Carsearch save error
                if (carsearchsGetErr) {
                  return done(carsearchsGetErr);
                }

                // Get Carsearches list
                var carsearches = carsearchesGetRes.body;

                // Set assertions
                (carsearches[0].user._id).should.equal(userId);
                (carsearches[0].name).should.match('Carsearch name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Carsearch if not logged in', function (done) {
    agent.post('/api/carsearches')
      .send(carsearch)
      .expect(403)
      .end(function (carsearchSaveErr, carsearchSaveRes) {
        // Call the assertion callback
        done(carsearchSaveErr);
      });
  });

  it('should not be able to save an Carsearch if no name is provided', function (done) {
    // Invalidate name field
    carsearch.name = '';

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

        // Save a new Carsearch
        agent.post('/api/carsearches')
          .send(carsearch)
          .expect(400)
          .end(function (carsearchSaveErr, carsearchSaveRes) {
            // Set message assertion
            (carsearchSaveRes.body.message).should.match('Please fill Carsearch name');

            // Handle Carsearch save error
            done(carsearchSaveErr);
          });
      });
  });

  it('should be able to update an Carsearch if signed in', function (done) {
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

        // Save a new Carsearch
        agent.post('/api/carsearches')
          .send(carsearch)
          .expect(200)
          .end(function (carsearchSaveErr, carsearchSaveRes) {
            // Handle Carsearch save error
            if (carsearchSaveErr) {
              return done(carsearchSaveErr);
            }

            // Update Carsearch name
            carsearch.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Carsearch
            agent.put('/api/carsearches/' + carsearchSaveRes.body._id)
              .send(carsearch)
              .expect(200)
              .end(function (carsearchUpdateErr, carsearchUpdateRes) {
                // Handle Carsearch update error
                if (carsearchUpdateErr) {
                  return done(carsearchUpdateErr);
                }

                // Set assertions
                (carsearchUpdateRes.body._id).should.equal(carsearchSaveRes.body._id);
                (carsearchUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Carsearches if not signed in', function (done) {
    // Create new Carsearch model instance
    var carsearchObj = new Carsearch(carsearch);

    // Save the carsearch
    carsearchObj.save(function () {
      // Request Carsearches
      request(app).get('/api/carsearches')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Carsearch if not signed in', function (done) {
    // Create new Carsearch model instance
    var carsearchObj = new Carsearch(carsearch);

    // Save the Carsearch
    carsearchObj.save(function () {
      request(app).get('/api/carsearches/' + carsearchObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', carsearch.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Carsearch with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/carsearches/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Carsearch is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Carsearch which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Carsearch
    request(app).get('/api/carsearches/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Carsearch with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Carsearch if signed in', function (done) {
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

        // Save a new Carsearch
        agent.post('/api/carsearches')
          .send(carsearch)
          .expect(200)
          .end(function (carsearchSaveErr, carsearchSaveRes) {
            // Handle Carsearch save error
            if (carsearchSaveErr) {
              return done(carsearchSaveErr);
            }

            // Delete an existing Carsearch
            agent.delete('/api/carsearches/' + carsearchSaveRes.body._id)
              .send(carsearch)
              .expect(200)
              .end(function (carsearchDeleteErr, carsearchDeleteRes) {
                // Handle carsearch error error
                if (carsearchDeleteErr) {
                  return done(carsearchDeleteErr);
                }

                // Set assertions
                (carsearchDeleteRes.body._id).should.equal(carsearchSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Carsearch if not signed in', function (done) {
    // Set Carsearch user
    carsearch.user = user;

    // Create new Carsearch model instance
    var carsearchObj = new Carsearch(carsearch);

    // Save the Carsearch
    carsearchObj.save(function () {
      // Try deleting Carsearch
      request(app).delete('/api/carsearches/' + carsearchObj._id)
        .expect(403)
        .end(function (carsearchDeleteErr, carsearchDeleteRes) {
          // Set message assertion
          (carsearchDeleteRes.body.message).should.match('User is not authorized');

          // Handle Carsearch error error
          done(carsearchDeleteErr);
        });

    });
  });

  it('should be able to get a single Carsearch that has an orphaned user reference', function (done) {
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

          // Save a new Carsearch
          agent.post('/api/carsearches')
            .send(carsearch)
            .expect(200)
            .end(function (carsearchSaveErr, carsearchSaveRes) {
              // Handle Carsearch save error
              if (carsearchSaveErr) {
                return done(carsearchSaveErr);
              }

              // Set assertions on new Carsearch
              (carsearchSaveRes.body.name).should.equal(carsearch.name);
              should.exist(carsearchSaveRes.body.user);
              should.equal(carsearchSaveRes.body.user._id, orphanId);

              // force the Carsearch to have an orphaned user reference
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

                    // Get the Carsearch
                    agent.get('/api/carsearches/' + carsearchSaveRes.body._id)
                      .expect(200)
                      .end(function (carsearchInfoErr, carsearchInfoRes) {
                        // Handle Carsearch error
                        if (carsearchInfoErr) {
                          return done(carsearchInfoErr);
                        }

                        // Set assertions
                        (carsearchInfoRes.body._id).should.equal(carsearchSaveRes.body._id);
                        (carsearchInfoRes.body.name).should.equal(carsearch.name);
                        should.equal(carsearchInfoRes.body.user, undefined);

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
      Carsearch.remove().exec(done);
    });
  });
});
