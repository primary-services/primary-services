import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Candidate extends Model {
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
          allowNull: false,
        },
        election_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "election",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "candidate",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "candidate_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Election, {
      foreignKey: "election_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default Candidate;
