'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.mutationWithClientMutationId = mutationWithClientMutationId;

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


function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

/**
 * A description of a mutation consumable by mutationWithClientMutationId
 * to create a GraphQLFieldConfig for that mutation.
 *
 * The inputFields and outputFields should not include `clientMutationId`,
 * as this will be provided automatically.
 *
 * An input object will be created containing the input fields, and an
 * object will be created containing the output fields.
 *
 * mutateAndGetPayload will receieve an Object with a key for each
 * input field, and it should return an Object with a key for each
 * output field. It may return synchronously, or return a Promise.
 */


/**
 * Returns a GraphQLFieldConfig for the mutation described by the
 * provided MutationConfig.
 */
function mutationWithClientMutationId(config) {
  var name = config.name;
  var inputFields = config.inputFields;
  var outputFields = config.outputFields;
  var mutateAndGetPayload = config.mutateAndGetPayload;

  var augmentedInputFields = function augmentedInputFields() {
    return (0, _extends3.default)({}, resolveMaybeThunk(inputFields), {
      clientMutationId: {
        type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLString)
      }
    });
  };
  var augmentedOutputFields = function augmentedOutputFields() {
    return (0, _extends3.default)({}, resolveMaybeThunk(outputFields), {
      clientMutationId: {
        type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLString)
      }
    });
  };

  var outputType = new _flowGraphql.GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedOutputFields
  });

  var inputType = new _flowGraphql.GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: outputType,
    args: {
      input: { type: new _flowGraphql.GraphQLNonNull(inputType) }
    },
    resolve: argsCheck(function (args) {
      return {
        input: _flowDynamic.pro.isObject(args.input)
      };
    }, function (_, _ref, context, info) {
      var input = _ref.input;

      return _promise2.default.resolve(mutateAndGetPayload(input, context, info)).then(function (payload) {
        payload.clientMutationId = input.clientMutationId;
        return payload;
      });
    })
  };
}