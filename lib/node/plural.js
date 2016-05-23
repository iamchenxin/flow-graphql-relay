
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.pluralIdentifyingRootField = pluralIdentifyingRootField;
exports.nonNull = nonNull;

var _graphql = require('graphql');

function pluralIdentifyingRootField(config) {
  var inputArgs = {};
  inputArgs[config.argName] = {
    type: new _graphql.GraphQLNonNull(new _graphql.GraphQLList(nonNull(config.inputType)))
  };
  return {
    description: config.description,
    type: new _graphql.GraphQLList(config.outputType),
    args: inputArgs,
    resolve: function resolve(obj, args, context, info) {
      var uncheckedInputs = args[config.argName];
      // ToDo : should make static flow check later
      // runtime check for args[config.argName] : Array<mixed>
      var inputs = Array.isArray(uncheckedInputs) ? uncheckedInputs : (function () {
        throw new Error('plural\'s inputArgs must be Array, but its' + (' ' + uncheckedInputs + '(type: ' + typeof uncheckedInputs + ')'));
      })();
      return _Promise.all(inputs.map(function (input) {
        return _Promise.resolve(config.resolveSingleInput(input, context, info));
      }));
    }
  };
}

function nonNull(type) {
  if (type instanceof _graphql.GraphQLNonNull) {
    return type;
  } else {
    return new _graphql.GraphQLNonNull(type);
  }
}