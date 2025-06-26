import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import Model from "../lib/base-model.js";

const validatePassword = (password) => {
  let hasMinLen = false;
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSpecial = false;

  if (password.length >= 8) {
    hasMinLen = true;
  }

  if (/[!|@|#\$|%|\^|&|_]+/g.test(password)) {
    hasSpecial = true;
  }

  if (/[A-Z]+/g.test(password)) {
    hasUpper = true;
  }

  if (/[a-z]+/g.test(password)) {
    hasLower = true;
  }

  if (/[0-9]+/g.test(password)) {
    hasNumber = true;
  }

  return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;
};

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        resetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetTokenExpiry: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user",
        schema: "public",
        timestamps: false,
        hooks: {
          beforeCreate: async (instance, options) => {
            if (!validatePassword(instance.password)) {
              throw "INVALID_PASSWORD";
            }

            const salt = await bcrypt.genSalt(10);

            instance.email = instance.email.trim().toLowerCase();
            instance.password = await bcrypt.hash(instance.password, salt);
          },
        },
        instanceMethods: {
          validPassword: async (password) => {
            return await bcrypt.compare(password, this.password);
          },

          generateResetToken: async () => {
            const token = crypto.randomBytes(32).toString("hex");
            this.resetToken = token;
            this.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
            return token;
          },

          setNewPassword: async (newPassword) => {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(newPassword, salt);
            this.resetToken = null;
            this.resetTokenExpiry = null;
          },
        },
        indexes: [
          {
            name: "user_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
}

export default User;
