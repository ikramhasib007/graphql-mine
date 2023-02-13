import Context from "src/context";
import { PrismaSelect } from "@paljs/plugins";
import type { QueryResolvers } from "./../../../types.generated";
export const user: NonNullable<QueryResolvers["user"]> = async (
  _parent,
  _arg,
  _ctx: Context,
  info
) => {
  /* Implement Query.user resolver logic here */
  const select = new PrismaSelect(info).value;
  return _ctx.prisma.user.findFirstOrThrow({
    where: { id: _arg.id },
    ...select,
  });
};
