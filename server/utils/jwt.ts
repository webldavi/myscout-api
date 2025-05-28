import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || ''

export const signJwt = (payload: object, expiresIn = "24h") => {
  return jwt.sign(payload, secret, { expiresIn });
};
