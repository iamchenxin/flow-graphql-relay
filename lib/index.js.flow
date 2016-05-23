/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Helpers for creating connection types in the schema
export {
  backwardConnectionArgs,
  connectionArgs,
  connectionDefinitions,
  forwardConnectionArgs,
} from './connection/connection.js';

// Helpers for creating connections from arrays
export {
  connectionFromArray,
  connectionFromArraySlice,
  connectionFromPromisedArray,
  connectionFromPromisedArraySlice,
  cursorForObjectInConnection,
  cursorToOffset,
  getOffsetWithDefault,
  offsetToCursor,
} from './connection/arrayconnection.js';

// Helper for creating mutations with client mutation IDs
export {
  mutationWithClientMutationId,
} from './mutation/mutation.js';

// Helper for creating node definitions
export {
  nodeDefinitions,
} from './node/node.js';

// Helper for creating plural identifying root fields
export {
  pluralIdentifyingRootField,
} from './node/plural.js';

// Utilities for creating global IDs in systems that don't have them.
export {
  fromGlobalId,
  globalIdField,
  toGlobalId,
} from './node/node.js';

// EXport types
export type {
  ConnectionConfig,
  GraphQLConnectionDefinitions,
} from './connection/connection.js';

export type {
  ConnectionCursor,
  PageInfo,
  Connection,
  Edge,
  ConnectionArguments
} from './connection/connectiontypes.js';

export type {
  mutationFn,
  MutationConfig,
} from './mutation/mutation.js';

export type {
  GraphQLNodeDefinitions,
  typeResolverFn,
  ResolvedGlobalId,
} from './node/node.js';

export type {
  PluralIdentifyingRootFieldConfig
} from './node/plural.js';

export type {
  Base64String
} from './utils/base64.js';
