/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { createUser as Mutation_createUser } from './user/resolvers/Mutation/createUser';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { User } from './user/resolvers/User';
import    { DateResolver,DateTimeResolver } from 'graphql-scalars';
    export const resolvers: Resolvers = {
      Query: { user: Query_user,users: Query_users },
      Mutation: { createUser: Mutation_createUser },
      
      User: User,
Date: DateResolver,
DateTime: DateTimeResolver
    }