import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";
import type { GraphQLContext } from "../../context";

interface CreateUserData {
  data: {
    name: string;
    email: string;
  };
}

const Mutation = {
  async createUser(
    parent: unknown,
    args: CreateUserData,
    context: GraphQLContext,
    info: GraphQLResolveInfo
  ) {
    const select = new PrismaSelect(info).value;
    return context.prisma.user.create({
      data: args.data,
      ...select,
    });
  },
};

export default Mutation;
