import JwtService from "../services/jwt.service.js";
import { BadTokenError } from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    next(new BadTokenError());
  }
};

export default authMiddleware;
