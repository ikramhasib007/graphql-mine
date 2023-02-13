import { PrismaClient } from "@prisma/client";
import { YogaInitialContext } from "graphql-yoga";
import { pubSub } from "./pubsub";

export default interface Context extends YogaInitialContext {
  prisma: PrismaClient;
  pubSub: typeof pubSub;
}
