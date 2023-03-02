import { GraphQLError } from "graphql";
import { pipe, filter, Repeater } from "graphql-yoga";
import type { User } from "@prisma/client";
import Context from "../context";
import { MutationType, SubscriptionResolvers } from "../generated/graphql";
import getUserId from "../utils/getUserId";

export interface UserSubscriptionPayload {
  user: {
    mutation: MutationType;
    data: User;
  };
}

const Subscription: SubscriptionResolvers = {
  user: {
    // Merge initial value with source streams of new values
    subscribe: (parent, args, { pubSub, request }: Context, info) => {
      try {
        const userId = getUserId(request, false);
        return pipe(
          Repeater.merge([undefined, pubSub.subscribe("user")]),
          // map all stream values to the latest user
          filter((payload: any) => payload)
        );
      } catch (error: any) {
        throw new GraphQLError(error);
      }
    },
    resolve: (user: any) => user,
  },

  globalCounter: {
    // Merge initial value with source stream of new values
    subscribe: (parent, args, { pubSub }: Context, info) =>
      pipe(
        Repeater.merge([
          // cause an initial event so the
          // globalCounter is streamed to the client
          // upon initiating the subscription
          undefined,
          // event stream for future updates
          pubSub.subscribe("globalCounter:changed"),
        ])
        // map all stream values to the latest globalCounter
        // map((item: any) => globalCounter)
      ),
    resolve: (payload: number) => payload,
  },
};

export default Subscription;
