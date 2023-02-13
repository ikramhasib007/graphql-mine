import { PrismaSelect } from "@paljs/plugins";
import hashPassword from "src/utils/hashPassword";
import { PrismaError } from "prisma-error-enum";
import type {
  MutationResolvers,
  CreateUserInput,
  User,
} from "./../../../types.generated";
import { GraphQLError } from "graphql";
export const createUser: NonNullable<MutationResolvers["createUser"]> = async (
  _parent,
  _arg,
  _ctx,
  info
) => {
  /* Implement Mutation.createUser resolver logic here */
  try {
    const select = new PrismaSelect(info).value;
    const data: CreateUserInput = {
      fullName: _arg.data.fullName,
      email: _arg.data.email,
    };

    if (_arg.data.password) {
      data.password = await hashPassword(_arg.data.password);
    }

    const user: User = await _ctx.prisma.user.create({
      data,
      ...select,
    });

    // context.pubSub.publish("user", {
    //         user: {
    //         mutation: MutationType.Created,
    //         data: user,
    //         },
    // });

    return user;
  } catch (error: any) {
    if (
      error.code === PrismaError.UniqueConstraintViolation &&
      error.meta.target[0] === "email"
    ) {
      throw new GraphQLError(
        "This email is already registered by another user"
      );
    }
    throw new GraphQLError(error);
  }
};
