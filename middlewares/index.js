import { verify } from "jsonwebtoken";

export const verifyLogin = (req, res, next) => {
  const token = req.cookies && req.cookies.JWT_TOKEN;
  if (!token) {
    return res.status(400).send("Login required !");
  }

  try {
    const data = verify(token, process.env.JWT_SECRET);
    req.data = data;
    console.log(req);
    return next();
  } catch (e) {
    console.log(e);
    res.status(400).send("Login required !");
  }
};
