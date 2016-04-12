var Diskew = require("../");
var client;

var QUEUE_NAME = Math.random().toString(16).slice(2);

function addJobThenRun (method) {
  return function () {
    return client.addjob(QUEUE_NAME, "job", 0)
      .then(x => client[method](x))
      .then(log);
  };
}

function run (method) {
  return function () {
    return client[method]().then(log);
  };
}

function log (x) {
  if (process.env.LOGGING) console.log(x);
}

describe("diskew", function () {
  beforeEach(function () {
    client = new Diskew([{host: "localhost", port: 7711}]);
  });

  it("addjob", function () {
    return client.addjob(QUEUE_NAME, "job", 0).then(log);
  });

  it("getjob", function () {
    return client.getjob(QUEUE_NAME).then(log);
  });

  it("ackjob", addJobThenRun("ackjob"));
  it("deljob", addJobThenRun("deljob"));
  it("nack", addJobThenRun("nack"));
  it("info", run("info"));
  it("hello", run("hello"));
  it("show", addJobThenRun("show"));
  it("enqueue", addJobThenRun("enqueue"));
  it("dequeue", addJobThenRun("dequeue"));

  it("qlen", function () {
    return client.qlen(QUEUE_NAME).then(log);
  });

  it("qstat", function () {
    return client.qstat(QUEUE_NAME).then(log);
  });
});
