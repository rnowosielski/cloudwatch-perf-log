'use strict';

class PerformanceTimer {

  _report(msg) {
    console.log(msg);
  }

  constructor() {
    this.timers = {};
  }

  start_timing(label) {
    if (process.env.logPerf !== "false") {
      this.timers["performance-" + label] = new Date().getTime();
    }
  }

  stop_timing(label) {
    if (process.env.logPerf !== "false") {
      this._report("performance-" + label + " ms " + (new Date().getTime() - this.timers["performance-" + label]));
    }
  }

  wrap(obj) {
    let performanceTimer = this;
    Object.getOwnPropertyNames(obj).filter(function (p) {
      return typeof obj[p] === 'function';
    }).map((p) => {
      let currentMethod = obj[p];
      obj[p] = function () {
        performanceTimer.start_timing(p);
        let returnValue = currentMethod.apply(obj, arguments);
        if (returnValue instanceof Promise) {
          return returnValue.then(
            (res) => {
              performanceTimer.stop_timing(p);
              return Promise.resolve(res);
            },
            (err) => {
              performanceTimer.stop_timing(p);
              return Promise.reject(err);
            });
        } else {
          performanceTimer.stop_timing(p);
          return returnValue;
        }
      };
      return null;
    });
    return obj;
  }

}

module.exports = new PerformanceTimer();