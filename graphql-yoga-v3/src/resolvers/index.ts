import Query from "./queries";
import Mutation from "./mutations";
import Subscription from "./Subscription";
import { Resolvers } from "../generated/graphql";
import Context from "../context";

export const resolvers: Resolvers<Context> = {
  Query,
  Mutation,
  Subscription,
};
