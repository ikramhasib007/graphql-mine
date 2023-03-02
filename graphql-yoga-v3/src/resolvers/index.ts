import Query from "./queries";
import Mutation from "./mutations";
import Subscription from "./Subscription";
import { Resolvers } from "src/generated/graphql";
import Context from "src/context";

export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
  Subscription,
};
