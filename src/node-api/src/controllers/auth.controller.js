import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const cookieConfig = {
  path: "/",
  sameSite: "Strict",
  secure: true,
};

if (process.env["NODE_ENV"] !== "local") {
  cookieConfig.domain = ".deadlykitten.com";
}

export default {
  signup: async (req, res) => {
    let requiredFields = [
      "first_name",
      "last_name",
      "email",
      "password",
      "password_confirmation",
    ];

    let {
      first_name,
      last_name,
      email,
      password,
      password_confirmation,
      pword,
    } = req.body;

    console.log("Signing Up:", email);
    if (pword !== "") {
      console.log("Bot Check Failed:", req.body);
      return res.status(200).json({ error: null, fields: [] });
    }

    let missing_fields = [];
    requiredFields.map((field) => {
      if (!req.body[field]) {
        missing_fields.push(field);
      }
    });

    if (missing_fields.length > 0) {
      console.log("Missing Fields", missing_fields);
      return res.status(422).json({
        error: "Missing Required Fields",
        fields: missing_fields,
      });
    }

    if (password !== password_confirmation) {
      console.log("Password Mismatch", password, password_confirmation);
      return res.status(422).json({
        error: "Mismatched Password",
        fields: ["password", "verify_password"],
      });
    }

    if (!validPassword(password)) {
      console.log("Invalid Password", password);
      return res.status(422).json({
        error: "Invalid Password",
        fields: ["password", "verify_password"],
      });
    }

    let existing = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!!existing) {
      console.log("User Exists", email.toLowerCase());
      return res.status(422).json({
        error: "An account with this email has already been registered",
        fields: ["email"],
      });
    }

    try {
      let user = new User({
        email: email,
        password: password,
      });

      await user.save();
    } catch (e) {
      console.log(e, e.message);
      if (e.message === "INVALID_PASSWORD") {
      }
    }

    let token = jwt.sign(
      {
        user_id: +user.id,
      },
      process.env["SERVER_JWT_SECRET"],
      { expiresIn: process.env["SERVER_JWT_TIMEOUT"] },
    );

    res.cookie("api_token", token, cookieConfig);
    return res.status(200).json({ success: true });
  },

  login: async (req, res) => {
    let queries = getQueries();
    let { email, password } = req.body;

    let user = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user) {
      console.log("Couldn't find user for", email);
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    let validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let token = jwt.sign(
      {
        user_id: +user.id,
      },
      process.env["SERVER_JWT_SECRET"],
      { expiresIn: process.env["SERVER_JWT_TIMEOUT"] },
    );

    res.cookie("api_token", token, cookieConfig);
    return res.status(200).json({ success: true });
  },

  logout: (req, res) => {
    res.status(200).json({ success: true });
  },
};
//   requestPasswordReset: async (req, res) => {
//     const { email } = req.body;
//     try {
//       const user = await User.findOne({ where: { email } });
//       if (!user)
//         return res.status(400).json({ message: "No user with that email" });

//       const token = user.generateResetToken();
//       await user.save();

//       // Normally you'd email the token, but here we'll just return it
//       res.json({ message: "Reset token generated", token });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },

//   resetPassword: async (req, res) => {
//     const { token, newPassword } = req.body;
//     try {
//       const user = await User.findOne({
//         where: {
//           resetToken: token,
//           resetTokenExpiry: { [require("sequelize").Op.gt]: new Date() },
//         },
//       });

//       if (!user)
//         return res.status(400).json({ message: "Invalid or expired token" });

//       await user.setNewPassword(newPassword);
//       await user.save();

//       res.json({ message: "Password has been reset" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   },
// };
