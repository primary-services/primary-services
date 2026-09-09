import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Contact extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        municipality_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        phone: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        contact_form: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "contact",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "contact_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Municipality, {
      foreignKey: "municipality_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default Contact;
