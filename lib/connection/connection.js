'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectionArgs = exports.backwardConnectionArgs = exports.forwardConnectionArgs = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.connectionDefinitions = connectionDefinitions;

var _flowGraphql = require('flow-graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with forward pagination.
 */
var forwardConnectionArgs = exports.forwardConnectionArgs = {
  after: {
    type: _flowGraphql.GraphQLString
  },
  first: {
    type: _flowGraphql.GraphQLInt
  }
};

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with backward pagination.
 */

/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var backwardConnectionArgs = exports.backwardConnectionArgs = {
  before: {
    type: _flowGraphql.GraphQLString
  },
  last: {
    type: _flowGraphql.GraphQLInt
  }
};

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with bidirectional pagination.
 */
var connectionArgs = exports.connectionArgs = (0, _extends3.default)({}, forwardConnectionArgs, backwardConnectionArgs);

function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

/**
 * Returns a GraphQLObjectType for a connection with the given name,
 * and whose nodes are of the specified type.
 */
function connectionDefinitions(config) {
  var nodeType = config.nodeType;

  var name = config.name || nodeType.name;
  var edgeFields = config.edgeFields || {};
  var connectionFields = config.connectionFields || {};
  var resolveNode = config.resolveNode;
  var resolveCursor = config.resolveCursor;
  var edgeType = new _flowGraphql.GraphQLObjectType({
    name: name + 'Edge',
    description: 'An edge in a connection.',
    fields: function fields() {
      return (0, _extends3.default)({
        node: {
          type: nodeType,
          resolve: resolveNode,
          description: 'The item at the end of the edge'
        },
        cursor: {
          type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLString),
          resolve: resolveCursor,
          description: 'A cursor for use in pagination'
        }
      }, resolveMaybeThunk(edgeFields));
    }
  });

  var connectionType = new _flowGraphql.GraphQLObjectType({
    name: name + 'Connection',
    description: 'A connection to a list of items.',
    fields: function fields() {
      return (0, _extends3.default)({
        pageInfo: {
          type: new _flowGraphql.GraphQLNonNull(pageInfoType),
          description: 'Information to aid in pagination.'
        },
        edges: {
          type: new _flowGraphql.GraphQLList(edgeType),
          description: 'A list of edges.'
        }
      }, resolveMaybeThunk(connectionFields));
    }
  });

  return { edgeType: edgeType, connectionType: connectionType };
}

/**
 * The common page info type used by all connections.
 */
var pageInfoType = new _flowGraphql.GraphQLObjectType({
  name: 'PageInfo',
  description: 'Information about pagination in a connection.',
  fields: function fields() {
    return {
      hasNextPage: {
        type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLBoolean),
        description: 'When paginating forwards, are there more items?'
      },
      hasPreviousPage: {
        type: new _flowGraphql.GraphQLNonNull(_flowGraphql.GraphQLBoolean),
        description: 'When paginating backwards, are there more items?'
      },
      startCursor: {
        type: _flowGraphql.GraphQLString,
        description: 'When paginating backwards, the cursor to continue.'
      },
      endCursor: {
        type: _flowGraphql.GraphQLString,
        description: 'When paginating forwards, the cursor to continue.'
      }
    };
  }
});