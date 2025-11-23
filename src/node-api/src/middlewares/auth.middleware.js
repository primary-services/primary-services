import JwtService from "../services/jwt.service.js";
import { error_codes } from "../utils/error_codes.js";

// TODO: check the DB to make sure the user still exists. If not expire the cookie

export const auth = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);
    const decoded = JwtService.jwtVerify(token);

    req.jwt = decoded;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error_code: "UNAUTHORIZED",
      error_msg: error_codes["UNAUTHORIZED"],
    });
  }
};
