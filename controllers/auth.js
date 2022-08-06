const User = require("../models/user");
const { hashPassword, comparePasswords } = require("../util/auth");
const { sign } = require("jsonwebtoken");

// register routing

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // validating data

    if (!name) {
      return res.send("Invalid name, try another name.");
    }
    let userExists = await User.findOne({ email }).exec();
    if (userExists) {
      return res.send("Email is already in use.");
    }

    if (!password || password.length < 6 || password.length > 64) {
      return res.send("Invalid password, try another password.");
    }

    // saving user

    let hashedPassword = await hashPassword(password);

    let newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // sending response
    res.status(200).send("Registered! You can login Now");
  } catch (e) {
    console.log(e);
    res.send("ERROR ... Try Again ...");
  }
};

//login routing

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validating data

    let user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).send("User does not exist.");
    }

    let verify = await comparePasswords(password, user.password);

    if (!verify) {
      return res.status(400).send("Password is wrong.");
    }

    // sending response

    const token = sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1D",
    });

    user.password = undefined;

    res
      .status(202)
      .cookie("JWT_TOKEN", token, {
        maxAge: 86400000,
        httpOnly: true,
      })
      .send(user.toJSON());
  } catch (e) {
    console.log(e);
    res.status(400).send("ERROR ... Try Again ...");
  }
};

// logout

const logout = async (req, res) => {
  try {
    res.clearCookie("JWT_TOKEN");
    res.send("Logout Success!");
  } catch (e) {
    console.log(e);
    res.send("Error... Try Again");
  }
};

module.exports = { register, login, logout };
