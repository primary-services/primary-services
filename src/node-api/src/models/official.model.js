import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Official extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        contact_form: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        office_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          // references: {
          //   model: "office",
          //   key: "id",
          // },
        },
        term_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          // references: {
          //   model: "term",
          //   key: "id",
          // },
        },
      },
      {
        sequelize,
        tableName: "official",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "official_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Office, {
      foreignKey: "office_id",
    });
  }
}

export default Official;
