import { DefaultArgs } from "@graphql-yoga/node";
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
    subscribe: (
      parent: unknown,
      args: DefaultArgs,
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ) => {
      return context.pubSub.subscribe("user");
    },
    resolve: (payload: UserSubscriptionPayload) => {
      console.log("payload: ", payload);
      return payload;
    },
  },
};

export default Subscription;
