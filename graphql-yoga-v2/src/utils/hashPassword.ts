import { GraphQLYogaError } from "@graphql-yoga/node";
import bcrypt from "bcryptjs";

const hashPassword = (password: string) => {
  if (password.length < 8) {
    throw new GraphQLYogaError("Password must be 8 characters or longer.");
  }
  return bcrypt.hash(password, 10);
};

export default hashPassword;
