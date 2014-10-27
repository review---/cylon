/*
 * connection
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Logger = require('./logger'),
    Utils = require('./utils'),
    Adaptor = require('./adaptor');

// Public: Creates a new Connection
//
// opts - hash of acceptable params:
//   robot - Robot the Connection belongs to
//   name - name for the connection
//   adaptor - string module name of the adaptor to be set up
//   port - string port to use for the Connection
//
// Returns the newly set-up connection
var Connection = module.exports = function Connection(opts) {
  opts = opts || {};
  Logger.debug("Loading adaptor '" + opts.adaptor + "'.");
  var connection = {};
  var connection = opts.robot.initAdaptor(opts.adaptor, connection, opts);

  connection.robot = opts.robot;
  connection.name = opts.name;
  //this.port = opts.port;
  //this.adaptor = this.initAdaptor(opts);

  //this.details = {};

  //for (var opt in opts) {
  //  if (['robot', 'name', 'adaptor'].indexOf(opt) < 0) {
  //    this.details[opt] = opts[opt];
  //  }
  // }
  //
  // private methods
  var _logstring = function(action) {
    var msg = action + " '" + connection.name + "'";

    if (connection.port != null) {
      msg += " on port " + connection.port;
    }

    msg += ".";

    return msg;
  };

  // Public: Expresses the Connection in JSON format
  //
  // Returns an Object containing Connection data
  connection.toJSON = function() {
    return {
      name: connection.name,
      //adaptor: this.adaptor.constructor.name || this.adaptor.name,
      adaptor: connection.constructor.name || connection.name,
      details: connection.details
    };
  };

  // Public: Connect the adaptor's connection
  //
  // callback - callback function to run when the adaptor is connected
  //
  // Returns nothing
  //connection.connect = function(callback) {
  connection.start = function(callback) {
    var msg = _logstring("Connecting to");
    Logger.info(msg);
    connection.connect(function() {
      //Utils.proxyFunctions(this.adaptor, this)
      callback.apply(connection, arguments);
    });
  };

  // Public: Disconnect the adaptor's connection
  //
  // callback - function to be triggered then the adaptor has disconnected
  //
  // Returns nothing
  //connection.disconnect = function(callback) {
  connection.stop = function(callback) {
    var msg = _logstring("Disconnecting from");
    Logger.info(msg);
    connection.removeAllListeners();
    connection.disconnect(callback);
  };

  // Public: sets up adaptor with @robot
  //
  // opts - options for adaptor being initialized
  //   adaptor - name of the adaptor
  //
  // Returns the set-up adaptor
  //Connection.prototype.initAdaptor = function(opts) {
  //  Logger.debug("Loading adaptor '" + opts.adaptor + "'.");
  //  return this.robot.initAdaptor(opts.adaptor, this, opts);
  //};

  return connection;
};

//Utils.subclass(Connection, EventEmitter);

