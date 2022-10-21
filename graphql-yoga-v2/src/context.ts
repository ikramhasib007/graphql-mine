import { PrismaClient } from "@prisma/client";
import { createPubSub } from "@graphql-yoga/node";
import type { PubSub } from "@graphql-yoga/node";
import prisma from "./prisma";

const pubSub = createPubSub();

export interface GraphQLContext {
  prisma: PrismaClient;
  pubSub: PubSub<{}>;
}

export function createContext(): GraphQLContext {
  return {
    prisma,
    pubSub,
  };
}
