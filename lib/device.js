/*
 * device
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var EventEmitter = require('events').EventEmitter;

var Logger = require('./logger'),
    Utils = require('./utils');

// Public: Creates a new Device
//
// opts - object containing Device params
//   name - string name of the device
//   pin - string pin of the device
//   robot - parent Robot to the device
//   connection - connection to the device
//   driver - string name of the module the device driver logic lives in
//
// Returns a new Device
var Device = module.exports = function Device(opts) {
  opts = opts || {};

  Logger.debug("Loading driver '" + opts.driver + "'.");
  var device = {}
  var device = opts.robot.initDriver(opts.driver, device, opts);



  // private methods
  // Public: Retrieves the connections from the parent Robot instances
  //
  // conn - name of the connection to fetch
  //
  // Returns a Connection instance
  var determineConnection = function(conn) {
    return device.robot.connections[conn];
  };

  // Public: Returns a default Connection to use
  //
  // Returns a Connection instance
  var defaultConnection = function() {
    var first = 0;

    for (var c in device.robot.connections) {
      var connection = device.robot.connections[c];
      first = first || connection;
    }

    return first;
  };


  // public
  device.robot = opts.robot;
  device.name = opts.name;
  device.connection = determineConnection(opts.connection) || defaultConnection();


  //this.driver = this.initDriver(opts);

  //this.details = {};

  //for (var opt in opts) {
  //  if (['robot', 'name', 'connection', 'driver'].indexOf(opt) < 0) {
  //    this.details[opt] = opts[opt];
  //  }
  // }

  // Public: Starts the device driver
  //
  // callback - callback function to be executed by the driver start
  //
  // Returns nothing
  device.startDevice = function(callback) {
    var msg = "Starting device '" + device.name + "'";

    if (device.pin != null) {
      msg += " on pin " + device.pin;
    }

    msg += ".";

    Logger.info(msg);
    device.start(function() {
      //Utils.proxyFunctions(this.driver, this)
      callback.apply(device, arguments);
    });
  };

  // Public: Halt the device driver
  //
  // callback - function to trigger when the device has been halted
  //
  // Returns nothing
  device.haltDevice = function(callback) {
    Logger.info("Halting device '" + device.name + "'.");
    device.removeAllListeners();
    device.halt(callback);
  };

  // Public: Expresses the Device in JSON format
  //
  // Returns an Object containing Connection data
  device.toJSON = function() {
    return {
      name: device.name,
      driver: device.constructor.name || device.name,
      connection: device.connection.name,
      commands: Object.keys(device.commands),
      details: device.details
    };
  };

  return device;
};


/*
// Public: sets up driver with @robot
//
// opts - object containing options when initializing driver
//   driver - name of the driver to intt()
//
// Returns the set-up driver
Device.prototype.initDriver = function(opts) {
  if (opts == null) {
    opts = {};
  }

  Logger.debug("Loading driver '" + opts.driver + "'.");
  return this.robot.initDriver(opts.driver, this, opts);
};
*/
