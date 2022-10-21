import { PrismaClient } from "@prisma/client";
import { createPubSub } from "@graphql-yoga/node";
import type { PubSub } from "@graphql-yoga/node";
import prisma from "./prisma";

const pubSub = createPubSub();

export interface GraphQLContext {
  prisma: PrismaClient;
  pubSub: PubSub<{}>;
  request: Request;
}

export function createContext(request: Request): GraphQLContext {
  return {
    request,
    prisma,
    pubSub,
  };
}
