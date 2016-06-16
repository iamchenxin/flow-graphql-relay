'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeDefinitions = nodeDefinitions;
exports.toGlobalId = toGlobalId;
exports.fromGlobalId = fromGlobalId;
exports.globalIdField = globalIdField;

var _flowGraphql = require('flow-graphql');

var _base = require('../utils/base64.js');

var _flowDynamic = require('flow-dynamic');

var argsCheck = _flowDynamic.graph.argsCheck;
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var sourceCheck = _flowDynamic.graph.sourceCheck;


/**
 * Given a function to map from an ID to an underlying object, and a function
 * to map from an underlying object to the concrete GraphQLObjectType it
 * corresponds to, constructs a `Node` interface that objects can implement,
 * and a field config for a `node` root field.
 *
 * If the typeResolver is omitted, object resolution on the interface will be
 * handled with the `isTypeOf` method on object types, as with any GraphQL
 * interface without a provided `resolveType` method.
 */
function nodeDefinitions(idFetcher, typeResolver) {
  var nodeInterface = new _flowGraphql.GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID',
    fields: function fields() {
      return {
        id: {
          type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLID),
          description: 'The id of the object.'
        }
      };
    },
    resolveType: typeResolver
  });

  var nodeField = {
    name: 'node',
    description: 'Fetches an object given its ID',
    type: nodeInterface,
    args: {
      id: {
        type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLID),
        description: 'The ID of an object'
      }
    },
    //  type NodeArgs = {id:string};
    resolve: argsCheck(function (args) {
      return { id: _flowDynamic.pro.isString(args.id) };
    }, function (obj, args, context, info) {
      return idFetcher(args.id, context, info);
    })
  };

  return { nodeInterface: nodeInterface, nodeField: nodeField };
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
function toGlobalId(type, id) {
  return (0, _base.base64)([type, id].join(':'));
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
function fromGlobalId(globalId) {
  var unbasedGlobalId = (0, _base.unbase64)(globalId);
  var delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

/**
 * Creates the configuration for an id field on a node, using `toGlobalId` to
 * construct the ID from the provided typename. The type-specific ID is fetched
 * by calling idFetcher on the object, or if not provided, by accessing the `id`
 * property on the object.
 */
function globalIdField(typeName, idFetcher) {
  return {
    name: 'id',
    description: 'The ID of an object',
    type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLID),
    resolve: sourceCheck(function (obj) {
      return _flowDynamic.pro.isObject(obj);
    }, function (obj, args, context, info) {
      return toGlobalId(typeName || info.parentType.name, idFetcher ? idFetcher(obj, context, info) : obj.id);
    })
  };
}