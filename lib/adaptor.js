/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Basestar = require('./basestar')

// Public: Creates a new Adaptor
//
// opts - hash of acceptable params
//   name - name of the Adaptor, used when printing to console
//   connection - Connection the adaptor will use to proxy commands/events
//
// Returns a new Adaptor
var Adaptor = module.exports = function(opts) {
  var adaptor = Basestar();
  opts = opts || {};
  //var extraParams = opts.extraParams || {};
  var extraParams = opts.extraParams || opts;

  adaptor.name = extraParams.name;
  adaptor.port = extraParams.port;

  return adaptor;
};
