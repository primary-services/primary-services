import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class District extends Model {
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
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "district",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "district_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.hasMany(models.DistrictMunicipality, {
      foreignKey: "district_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default District;
