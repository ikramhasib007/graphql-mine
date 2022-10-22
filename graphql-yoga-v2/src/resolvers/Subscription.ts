import { DefaultArgs, pipe, filter } from "@graphql-yoga/node";
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
    ) =>
      pipe(
        context.pubSub.subscribe("user"),
        filter((payload: any) => {
          console.log("payload: ", payload);
          return payload;
        })
      ),
    resolve: ({ user }: UserSubscriptionPayload) => {
      return user;
    },
  },
};

export default Subscription;
