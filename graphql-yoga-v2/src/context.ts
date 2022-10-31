import { PrismaClient } from "@prisma/client";
import { createPubSub, YogaInitialContext } from "@graphql-yoga/node";
import { UserSubscriptionPayload } from "./resolvers/Subscription";

export const pubSub = createPubSub<{
  user: [user: UserSubscriptionPayload];
  "globalCounter:changed": [];
}>();

export default interface Context extends YogaInitialContext {
  prisma: PrismaClient;
  pubSub: typeof pubSub;
}
