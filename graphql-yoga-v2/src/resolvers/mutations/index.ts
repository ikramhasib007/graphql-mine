import { GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";
import type { GraphQLContext } from "../../context";
import type { User } from "@prisma/client";
import { PrismaError } from "prisma-error-enum";
import type { UserSubscriptionPayload } from "../Subscription";

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
    try {
      const select = new PrismaSelect(info).value;
      const user: User = await context.prisma.user.create({
        data: args.data,
        ...select,
      });

      context.pubSub.publish("user", {
        user: {
          mutation: "CREATED",
          data: user,
        },
      });

      return user;
    } catch (error: any) {
      if (
        error.code === PrismaError.UniqueConstraintViolation &&
        error.meta.target[0] === "email"
      ) {
        throw new GraphQLYogaError(
          "This email is already registered by another user"
        );
      }
      throw new GraphQLYogaError(error);
    }
  },
};

export default Mutation;
