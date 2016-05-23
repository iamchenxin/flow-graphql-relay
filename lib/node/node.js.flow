/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLResolveInfo
} from 'flow-graphql';

import {
  base64,
  unbase64
} from '../utils/base64.js';

export type GraphQLNodeDefinitions = {
  nodeInterface: GraphQLInterfaceType,
  nodeField: GraphQLFieldConfig
}

export type typeResolverFn = (object: any) => ?GraphQLObjectType;

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
export function nodeDefinitions(
  idFetcher: ((id: string, context: any, info: GraphQLResolveInfo) => any),
  typeResolver?: typeResolverFn
): GraphQLNodeDefinitions {
  var nodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The id of the object.',
      },
    }),
    resolveType: typeResolver
  });

  var nodeField = {
    name: 'node',
    description: 'Fetches an object given its ID',
    type: nodeInterface,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of an object'
      }
    },
    resolve: (obj, args, context, info) => {
      // ToDo : should make static flow check later
      // graphql should pass a args.id(GraphQLID) in.
      // which always serialize to a string in graphql v0.6
      const id:string = (typeof args.id === 'string') ? args.id
        : (()=>{
          throw new Error(`args.id must be string,but its ${args.id}` +
            `(type: ${typeof args.id})`);
        })();
      return idFetcher(id, context, info);
    },
  };

  return {nodeInterface, nodeField};
}

export type ResolvedGlobalId = {
  type: string,
  id: string
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
export function toGlobalId(type: string, id: string): string {
  return base64([type, id].join(':'));
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
export function fromGlobalId(globalId: string): ResolvedGlobalId {
  var unbasedGlobalId = unbase64(globalId);
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
export function globalIdField(
  typeName?: ?string,
  idFetcher?: (object: Object, context: mixed,
    info: GraphQLResolveInfo) => string
): GraphQLFieldConfig {
  return {
    name: 'id',
    description: 'The ID of an object',
    type: new GraphQLNonNull(GraphQLID),
    resolve: (source, args, context, info) => {
      // ToDo : should make static flow check later
      // runtime check for GraphQLNonNull(GraphQLID) : string|number
      if ( idFetcher ) {
        let id = check( idFetcher((source:any), context, info),
        'globalIdField.idFetcher must return a string|number, ' +
        'check your code.');
        return toGlobalId(typeName || info.parentType.name, id);
      } else {
        let id = check( (source:any).id, 'id field must be string|number, ' +
        `but it is ${(source:any).id}(type: ${typeof (source:any).id})`);
        return toGlobalId(typeName || info.parentType.name, id);
      }

      function check(unId:any,eMsg:string):string {
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
