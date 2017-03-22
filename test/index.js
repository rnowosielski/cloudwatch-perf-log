'use strict';

/* jshint -W024 */
/* jshint expr:true */

const should = require('chai').should();
const assert = require("assert");
const sinon = require("sinon");
const performanceTimer = require("../src/index");

describe("PerformanceTimer", function () {

  let consoleLogStub;

  beforeEach(function () {
    consoleLogStub = sinon.stub(performanceTimer, "_report");
  });

  afterEach(function () {
    consoleLogStub.restore();
  });

  describe("basic use case for manually tracking time", function () {

    it('basic use case of calculating time', function () {
      performanceTimer.start_timing("test");
      performanceTimer.stop_timing("test");
      consoleLogStub.calledOnce.should.be.true;
      consoleLogStub.getCall(0).args[0].should.be.at.least("performance-test ms 0");
    });

    it('basic use case of calculating time with delay', function (done) {
      performanceTimer.start_timing("test");
      setTimeout(() => {
        performanceTimer.stop_timing("test");
        try {
          consoleLogStub.calledOnce.should.be.true;
          consoleLogStub.getCall(0).args[0].should.be.at.least("performance-test ms 10");
          done();
        } catch (err) {
          done(err);
        }
      }, 10);
    });

  });

  describe("wrapping methods", function () {

    it('basic use case of calculating time', function () {

      let spy = sinon.spy();
      let someObject = {};
      someObject.someMethod = spy;

      performanceTimer.wrap(someObject).someMethod("testArgumentBetterBeRight", 12345);

      spy.calledOnce.should.be.true;
      spy.firstCall.args[0].should.be.equal("testArgumentBetterBeRight");
      spy.firstCall.args[1].should.be.equal(12345);
      consoleLogStub.calledOnce.should.be.true;
      consoleLogStub.firstCall.args[0].should.be.at.least("performance-someMethod ms 0");
    });

    it('basic use case of calculating time with delay', function () {

      let spy = sinon.spy(function () {
        let waitDateOne = new Date();
        while ((new Date()) - waitDateOne <= 10) {
        }
      });
      let someObject = {};
      someObject.someMethod = spy;

      performanceTimer.wrap(someObject).someMethod("testArgumentBetterBeRight", 12345);

      spy.calledOnce.should.be.true;
      spy.firstCall.args[0].should.be.equal("testArgumentBetterBeRight");
      spy.firstCall.args[1].should.be.equal(12345);
      consoleLogStub.calledOnce.should.be.true;
      consoleLogStub.firstCall.args[0].should.be.at.least("performance-someMethod ms 10");
    });

    it('basic use case of calculating time with a promise returned by the method', function () {

      let spy = sinon.spy(function () {
        let waitDateOne = new Date();
        while ((new Date()) - waitDateOne <= 20) {
        }
      });
      let someObject = {};
      someObject.someMethod = function () {
        let args = arguments;
        new Promise((resolve, reject) => {
          spy.apply(spy, args);
          resolve();
        });
      };

      performanceTimer.wrap(someObject).someMethod("testArgumentBetterBeRight", 12345);

      spy.calledOnce.should.be.true;
      spy.firstCall.args[0].should.be.equal("testArgumentBetterBeRight");
      spy.firstCall.args[1].should.be.equal(12345);
      consoleLogStub.calledOnce.should.be.true;
      consoleLogStub.firstCall.args[0].should.be.at.least("performance-someMethod ms 20");
    });

  });

});