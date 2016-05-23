
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.nodeDefinitions = nodeDefinitions;
exports.toGlobalId = toGlobalId;
exports.fromGlobalId = fromGlobalId;
exports.globalIdField = globalIdField;

var _graphql = require('graphql');

var _utilsBase64Js = require('../utils/base64.js');

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
  var nodeInterface = new _graphql.GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID',
    fields: function fields() {
      return {
        id: {
          type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
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
        type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
        description: 'The ID of an object'
      }
    },
    resolve: function resolve(obj, args, context, info) {
      // ToDo : should make static flow check later
      // graphql should pass a args.id(GraphQLID) in.

      var id = typeof args.id === 'string' ? args.id : (function () {
        throw new Error('args.id must be string,but its ' + args.id + ('(type: ' + typeof args.id + ')'));
      })();
      return idFetcher(id, context, info);
    }
  };

  return { nodeInterface: nodeInterface, nodeField: nodeField };
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */

function toGlobalId(type, id) {
  return (0, _utilsBase64Js.base64)([type, id].join(':'));
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */

function fromGlobalId(globalId) {
  var unbasedGlobalId = (0, _utilsBase64Js.unbase64)(globalId);
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
    type: new _graphql.GraphQLNonNull(_graphql.GraphQLID),
    resolve: function resolve(source, args, context, info) {
      // ToDo : should make static flow check later
      // runtime check for GraphQLNonNull(GraphQLID) : string|number
      if (idFetcher) {
        var _id = check(idFetcher(source, context, info), 'globalIdField.idFetcher must return a string|number, ' + 'check your code.');
        return toGlobalId(typeName || info.parentType.name, _id);
      } else {
        var _id2 = check(source.id, 'id field must be string|number, ' + ('but it is ' + source.id + '(type: ' + typeof source.id + ')'));
        return toGlobalId(typeName || info.parentType.name, _id2);
      }

      function check(unId, eMsg) {
        switch (typeof unId) {
          case 'string':
            return unId;
          case 'number':
            return unId.toString();
          default:
            throw new Error(eMsg);
        }
      }
    }
  };
}

// which always serialize to a string in graphql v0.6