import JwtService from "../services/jwt.service.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ "error:": "Unauthorized" });
  }
};

export default authMiddleware;
