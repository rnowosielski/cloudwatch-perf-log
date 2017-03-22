# cloudwatch-perf-log
A simple package that logs executions time of code chunks in a format that makes it easy to create AWS metrics

## Usage

This simple package is supposed to provide timing for methods in your code, and allow an easy creation of custom metrics in AWS CloudWatch

### Installing the npm

    npm install cloudwatch-perf-log

### Requiring the module
 
    const performanceTimer = require("cloudwatch-perf-log");

### Using timing methods

      performanceTimer.start_timing("some-code-block");
        
      ...
      
      performanceTimer.stop_timing("some-code-block");
      
Will provide logs in the output of e.g. lambda logs, that looks something like thos:

    performance-test ms 10
    
That log as viewed in CloudWatch logs will look something like
    
    2017-03-22T11:27:32.888Z	8aa3e28a-0ef2-11e7-bdf8-69bab79b207d	performance-test ms 2
    
Given that formt it is trivial to create desired custom CloudWatch metrics using the console: using the following template `[timestamp, request, metric=performance*, unit=ms, value=*]` and specifying `$value` as the value of the metric 
