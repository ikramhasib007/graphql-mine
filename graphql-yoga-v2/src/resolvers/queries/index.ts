import { GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaSelect } from "@paljs/plugins";
import Context from "src/context";
import { QueryResolvers } from "src/generated/graphql";
import getUserId from "src/utils/getUserId";

const Query: QueryResolvers = {
  users: async (parent, args, { prisma, request }: Context, info) => {
    try {
      const userId = getUserId(request, false);
      const select = new PrismaSelect(info).value;
      const users = await prisma.user.findMany({ ...select });
      return users;
    } catch (error: any) {
      throw new GraphQLYogaError(error);
    }
  },
  user: (parent, args, context, info) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
      ...select,
    });
  },
  posts: (parent, args, context, info) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findMany({ ...select });
  },
  post: (parent, args, context, info) => {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.findFirstOrThrow({
      where: { id: args.id },
      ...select,
    });
  },
};

export default Query;
