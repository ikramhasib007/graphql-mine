import { GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";
import type { GraphQLContext } from "../../context";
import type { User } from "@prisma/client";
import { PrismaError } from "prisma-error-enum";
import Upload from "./upload";

interface CreateUserData {
  data: {
    name: string;
    email: string;
    bio: string;
  };
}

const Mutation = {
  ...Upload,

  async createUser(
    parent: unknown,
    args: CreateUserData,
    { prisma, pubSub }: GraphQLContext,
    info: GraphQLResolveInfo
  ) {
    try {
      const select = new PrismaSelect(info).value;
      const user: User = await prisma.user.create({
        data: {
          name: args.data.name,
          email: args.data.email,
          profile: {
            create: {
              bio: args.data.bio,
            },
          },
        },
        ...select,
      });

      pubSub.publish("user", {
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
