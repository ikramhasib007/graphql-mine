import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { PrismaSelect } from "@paljs/plugins";
import type { User } from "@prisma/client";
import { PrismaError } from "prisma-error-enum";
import Upload from "./upload";
import { MutationResolvers, MutationType } from "../../generated/graphql";
import Context from "../../context";
import generateToken from "../../utils/generateToken";
import hashPassword from "../../utils/hashPassword";

let globalCounter = 0;

interface ProfilePayload {
  create: {
    bio?: string;
  };
}

interface UserCreatePayload {
  name: string;
  email: string;
  password?: string;
  profile?: ProfilePayload;
}

const Mutation: MutationResolvers = {
  ...Upload,

  async createUser(parent, args, context: Context, info) {
    try {
      const select = new PrismaSelect(info).value;
      const data: UserCreatePayload = {
        name: args.data.name,
        email: args.data.email,
        // profile: {
        //   create: {
        //     bio: args.data.bio,
        //   },
        // },
      };

      if (args.data.password) {
        data.password = await hashPassword(args.data.password);
      }

      const user: User = await context.prisma.user.create({
        data,
        ...select,
      });

      context.pubSub.publish("user", {
        mutation: MutationType.Created,
        data: user,
      });

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
  },

  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data;
    try {
      let query = {
        where: {
          email,
        },
      };
      const user = await prisma.user.findFirstOrThrow(query);

      if (password) {
        if (!user.password)
          throw new GraphQLError("User exist with different sign in method");
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new GraphQLError("Unable to login");
      }

      return {
        user,
        token: generateToken(user.id),
      };
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },

  incrementGlobalCounter(parent, args, { pubSub }: Context, info) {
    try {
      globalCounter = globalCounter + 1;
      // publish a global counter increment event
      pubSub.publish("globalCounter:changed");
      return globalCounter;
    } catch (error: any) {
      throw new GraphQLError(error);
    }
  },
};

export default Mutation;
