import { DefaultArgs, GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";
import type { User } from "@prisma/client";
import { PrismaError } from "prisma-error-enum";
import Upload from "./upload";
import { MutationResolvers } from "src/generated/graphql";
import Context from "src/context";

let globalCounter = 0;

const Mutation: MutationResolvers = {
  ...Upload,

  async createUser(parent, args, context: Context, info) {
    try {
      const select = new PrismaSelect(info).value;
      const user: User = await context.prisma.user.create({
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

  incrementGlobalCounter(parent, args, context, info) {
    globalCounter = globalCounter + 1;
    // publish a global counter increment event
    context.pubSub.publish("globalCounter:changed");
    return globalCounter;
  },
};

export default Mutation;
