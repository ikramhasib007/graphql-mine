import { DefaultArgs, pipe, filter, Repeater } from "@graphql-yoga/node";
import type { User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";
import { SubscriptionResolvers } from "src/generated/graphql";

export interface UserSubscriptionPayload {
  user: {
    mutation: string;
    data: User;
  };
}

const Subscription: SubscriptionResolvers = {
  user: {
    // Merge initial value with source streams of new values
    subscribe: (parent, args, context, info) =>
      pipe(
        Repeater.merge([undefined, context.pubSub.subscribe("user")]),
        // map all stream values to the latest user
        filter((payload: any) => payload)
      ),
    resolve: (payload: any) => payload,
  },

  globalCounter: {
    // Merge initial value with source stream of new values
    subscribe: (parent, args, context, info) =>
      pipe(
        Repeater.merge([
          // cause an initial event so the
          // globalCounter is streamed to the client
          // upon initiating the subscription
          undefined,
          // event stream for future updates
          context.pubSub.subscribe("globalCounter:change"),
        ])
        // map all stream values to the latest globalCounter
        // map((item: any) => globalCounter)
      ),
    resolve: (payload: number) => payload,
  },
};

export default Subscription;
