import { DefaultArgs, pipe, filter, Repeater } from "@graphql-yoga/node";
import type { User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../context";

export interface UserSubscriptionPayload {
  user: {
    mutation: string;
    data: User;
  };
}

const Subscription = {
  user: {
    // Merge initial value with source streams of new values
    subscribe: (
      parent: unknown,
      args: DefaultArgs,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ) =>
      pipe(
        Repeater.merge([undefined, context.pubSub.subscribe("user")]),
        // map all stream values to the latest user
        filter((payload: any) => payload)
      ),
    resolve: ({ user }: UserSubscriptionPayload) => user,
  },
};

export default Subscription;
