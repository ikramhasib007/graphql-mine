import { GraphQLYogaError } from "@graphql-yoga/node";
import jwt from "jsonwebtoken";

export default (request: Request, requireAuth = true) => {
  const header = request.headers.get("authorization");

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    return decoded.userId;
  }
  if (requireAuth) throw new GraphQLYogaError("Authentication required");

  return null;
};
