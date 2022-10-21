import { PrismaClient } from "@prisma/client";
import { createPubSub } from "@graphql-yoga/node";
import type { PubSub } from "@graphql-yoga/node";
import prisma from "./prisma";
import type { UserSubscriptionPayload } from "./resolvers/Subscription";

const pubSub = createPubSub<{
  user: [user: UserSubscriptionPayload];
}>();

export interface GraphQLContext {
  prisma: PrismaClient;
  pubSub: PubSub<{
    user: [user: UserSubscriptionPayload];
  }>;
  request: Request;
}

export function createContext(request: Request): GraphQLContext {
  return {
    request,
    prisma,
    pubSub,
  };
}
