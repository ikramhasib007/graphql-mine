import { DefaultArgs } from "@graphql-yoga/node";
import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "../../context";
import type { Post } from "@prisma/client";
import type { User } from "@prisma/client";
import { PrismaSelect } from "@paljs/plugins";

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
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findMany({ ...select });
  },
  user: (
    parent: User,
    args: IdParamsArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
      ...select,
    });
  },
  posts: (
    parent: Post[],
    args: DefaultArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findMany({ ...select });
  },
  post: (
    parent: Post,
    args: IdParamsArgs,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
      ...select,
    });
  },
};

export default Query;
