import { PrismaSelect } from "@paljs/plugins";
import { GraphQLError } from "graphql";
import Context from "src/context";
import type { QueryResolvers } from "./../../../types.generated";
export const users: NonNullable<QueryResolvers["users"]> = async (
  _parent,
  _arg,
  _ctx: Context,
  info
) => {
  /* Implement Query.users resolver logic here */
  try {
    // const userId = getUserId(request, false);
    const select = new PrismaSelect(info).value;
    const users = await _ctx.prisma.user.findMany({ ...select });
    return users;
  } catch (error: any) {
    throw new GraphQLError(error);
  }
};
