import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Identity extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        middle_name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        last_name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        suffix: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        nickname: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "identity",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "identity_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: {
        model: models.IdentityParent,
        unique: false,
      },
      foreignKey: "identity_id",
      constraints: false,
    });
  }
}

export default Identity;
