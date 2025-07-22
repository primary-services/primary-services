import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import owasp from "owasp-password-strength-test";
import emailValidator from "email-validator";

import User from "../models/user.model.js";

const cookieConfig = {
  path: "/",
  sameSite: process.env["NODE_ENV"] === "local" ? "None" : "Strict",
  secure: true,
};

// TODO should to real email validation
const emailTransform = (email) => {
  return email.trim().toLowerCase();
};

if (process.env["NODE_ENV"] !== "local") {
  cookieConfig.domain = ".deadlykitten.com";
}

owasp.config({
  allowPassphrases: false,
});

export default {
  authorize: async (req, res) => {
    if (!!req.jwt) {
      return res.status(200).json(req.jwt.user);
    } else {
      return res.status(401).json({ success: false });
    }
  },

  signup: async (req, res) => {
    let requiredFields = [
      "identities.0.first_name",
      "identities.0.last_name",
      "email",
      "password",
      "password_confirmation",
    ];

    let data = req.body;

    console.log("Signing Up:", data.email);
    if (data.pword !== "") {
      console.log("Bot Check Failed:", req.body);

      // TODO: Maybe track bot emails if this every becomes a problem?
      return res.status(200).json({ success: true, error: null, fields: [] });
    }

    let missing_fields = [];
    requiredFields.map((field) => {
      let path = field.split(".");

      let obj = data;
      for (var i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }

      if (!obj[path[path.length - 1]]) {
        missing_fields.push(path[path.length - 1]);
      }
    });

    if (missing_fields.length > 0) {
      return res.status(422).json({
        success: false,
        error: "Please fill out all required fields",
        fields: missing_fields,
      });
    }

    if (!emailValidator.validate(emailTransform(data.email))) {
      return res.status(422).json({
        success: false,
        error: "Please use a valid email address",
        fields: ["email"],
      });
    }

    if (data.password !== data.password_confirmation) {
      return res.status(422).json({
        success: false,
        error: "Mismatched password and password confirmation",
        fields: ["password_confirmation"],
      });
    }

    if (!owasp.test(data.password)) {
      return res.status(422).json({
        success: false,
        error: "Password does not meet complexity requirements",
        fields: ["password", "password_confirmation"],
      });
    }

    let existing = await User.findOne({
      where: {
        email: emailTransform(data.email),
      },
    });

    if (!!existing) {
      return res.status(422).json({
        success: false,
        error: "An account with this email has already been registered",
        fields: ["email"],
      });
    }

    let user = null;
    try {
      user = await User.prototype.upsertAll({
        ...data,
        email: emailTransform(data.email),
      });
    } catch (e) {
      console.log("Error creating user:", e, data);
      return res.status(500).json({
        success: false,
        error:
          "An error has occured creating your account, please contact the dev team",
        fields: [],
      });
    }

    let token = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      process.env["SERVER_JWT_SECRET"],
      {
        expiresIn: new Date().getTime() + process.env["SERVER_JWT_TIMEOUT"],
      },
    );

    res.cookie("auth_token", token, cookieConfig);
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  },

  login: async (req, res) => {
    let { email, password } = req.body;

    let user = await User.findOne({
      where: {
        email: emailTransform(data.email),
      },
    });

    if (!user) {
      console.log("Couldn't find user for", email);
      return res.status(401).json({
        success: false,
        error: "Invalid Credentials",
        fields: ["email", "password"],
      });
    }

    let validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      console.log("Invalid password");
      return res.status(401).json({
        success: false,
        error: "Invalid Credentials",
        fields: ["email", "password"],
      });
    }

    let token = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      process.env["SERVER_JWT_SECRET"],
      {
        expiresIn: new Date().getTime() + process.env["SERVER_JWT_TIMEOUT"],
      },
    );

    res.cookie("auth_token", token, cookieConfig);
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
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
