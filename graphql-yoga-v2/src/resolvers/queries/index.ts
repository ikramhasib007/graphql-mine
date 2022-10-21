import { DefaultArgs } from "@graphql-yoga/node";
import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../../context";
import type { Post } from "@prisma/client";
import type { User } from "@prisma/client";

interface IdParamsArgs {
  id: string;
}

const Query = {
  users: (
    parent: User[],
    args: DefaultArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    return context.prisma.user.findMany();
  },
  user: (
    parent: User,
    args: IdParamsArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
    });
  },
  posts: (
    parent: Post[],
    args: DefaultArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    return context.prisma.user.findMany();
  },
  post: (
    parent: Post,
    args: IdParamsArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
    });
  },
};

export default Query;
