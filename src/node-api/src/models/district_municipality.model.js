import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class DistrictMunicipality extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        district_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        municipality_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "district_municipalities",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "district_municipalities_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.District, {
      foreignKey: "district_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    this.belongsTo(models.Municipality, {
      foreignKey: "municipality_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default DistrictMunicipality;
