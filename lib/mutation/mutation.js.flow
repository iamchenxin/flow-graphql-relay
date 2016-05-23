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
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  InputObjectConfigFieldMap,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo
} from 'flow-graphql';

export type mutationFn = (object: Object, ctx: mixed,
  info: GraphQLResolveInfo) => ( Object | Promise<Object> );

function resolveMaybeThunk<T>(thingOrThunk: T | () => T): T {
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
export type MutationConfig = {
  name: string,
  inputFields: InputObjectConfigFieldMap,
  outputFields: GraphQLFieldConfigMap,
  mutateAndGetPayload: mutationFn,
}

/**
 * Returns a GraphQLFieldConfig for the mutation described by the
 * provided MutationConfig.
 */
export function mutationWithClientMutationId(
  config: MutationConfig
): GraphQLFieldConfig {
  var {name, inputFields, outputFields, mutateAndGetPayload} = config;
  var augmentedInputFields = () => ({
    ...resolveMaybeThunk(inputFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });
  var augmentedOutputFields = () => ({
    ...resolveMaybeThunk(outputFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });

  var outputType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedOutputFields
  });

  var inputType = new GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: outputType,
    args: {
      input: {type: new GraphQLNonNull(inputType)}
    },
    resolve: (_, args, context, info) => {
      // ToDo: Should make a static flow check later
      // runtime check GraphQL(mixed) -> Relay(Object)
      const input:Object = ( args.input instanceof Object) ? args.input
        : (()=>{
          throw new Error('args.input must be string,' +
          ` but its ${args.input}(type: ${typeof args.input})`);
        })();
      return Promise.resolve(mutateAndGetPayload(input, context, info))
        .then(payload => {
          payload.clientMutationId = input.clientMutationId;
          return payload;
        });
    }
  };
}
