'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.pluralIdentifyingRootField = pluralIdentifyingRootField;
exports.nonNull = nonNull;

var _flowGraphql = require('flow-graphql');

var _flowDynamic = require('flow-dynamic');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var argsCheck = _flowDynamic.graph.argsCheck;
function pluralIdentifyingRootField(config) {
  var inputArgs = {};
  inputArgs[config.argName] = {
    type: new _flowGraphql.GraphQLNonNull(new _flowGraphql.GraphQLList(nonNull(config.inputType)))
  };
  return {
    description: config.description,
    type: new _flowGraphql.GraphQLList(config.outputType),
    args: inputArgs,
    resolve: argsCheck(function (args) {
      return _flowDynamic.pro.isObject(args);
    }, function (obj, args, context, info) {
      var inputs = args[config.argName];
      return _promise2.default.all(inputs.map(function (input) {
        return _promise2.default.resolve(config.resolveSingleInput(input, context, info));
      }));
    })
  };
}

function nonNull(type) {
  if (type instanceof _flowGraphql.GraphQLNonNull) {
    return type;
  } else {
    return new _flowGraphql.GraphQLNonNull(type);
  }
}