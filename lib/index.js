var util = require("util");
var _ = require("lodash");

var Redis = require("ioredis");

var COMMANDS = [
  "addjob",
  "getjob",
  "qlen",
  "qpeek",
  "qstat",
  "show",
  "ackjob",
  "nack",
  "fastack",
  "info",
  "hello",
  "enqueue",
  "dequeue",
  "deljob"
];

function Diskew (endpoints, options) {
  var opts = Object.assign({}, endpoints[0], options);
  Redis.call(this, opts);
}

util.inherits(Diskew, Redis);

Diskew.prototype.getBuiltinCommands().forEach(function (commandName) {
  delete Diskew.prototype[commandName];
});

_.forEach(COMMANDS, function (commandName) {
  Diskew.prototype[commandName] = Diskew.prototype.createBuiltinCommand(commandName).string;
  Diskew.prototype[commandName + "Buffer"] = Diskew.prototype.createBuiltinCommand(commandName).buffer;
});

var getjob = Diskew.prototype.getjob;
Diskew.prototype.getjob = function (queue) {
  return getjob.call(this, "from", [queue]);
};

var getjobBuffer = Diskew.prototype.getjobBuffer;
Diskew.prototype.getjobBuffer = function (queue) {
  return getjobBuffer.call(this, "from", [queue]);
};

module.exports = Diskew;
