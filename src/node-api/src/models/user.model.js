import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import Model from "../lib/base-model.js";

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
          type: DataTypes.TEXT,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        resetToken: {
          type: DataTypes.TEXT,
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

  static associate(models) {
    this.belongsToMany(models.Identity, {
      through: {
        model: models.IdentityParent,
        unique: false,
        scope: {
          parent_type: "USER",
        },
      },
      foreignKey: "parent_id",
      constraints: false,
      as: "identities",
    });
  }
}

export default User;
