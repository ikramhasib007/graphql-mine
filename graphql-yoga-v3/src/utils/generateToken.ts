import jwt, { JwtPayload } from "jsonwebtoken";

const generateToken = (userId: JwtPayload) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: "30 days",
  });
};

export default generateToken;
