import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Office extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        // True if the position is shared across municipalities
        shared: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        warded: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        elected: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        seat_count: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        tenure: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        salary: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        min_hours: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        max_hours: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        municipality_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          // references: {
          //  model: "municipality",
          //  key: "id",
          // },
        },
        deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        paranoid: true,
        tableName: "office",
        schema: "public",
        timestamps: false,
        indexes: [
          {
            name: "office_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
    this.humanReadableIdentifier = "title";
    this.versionItemType = "Office";
  }

  static associate(models) {
    // this.hasMany(models.Official, {
    //  foreignKey: "office_id",
    //  as: "officials",
    //  onRemove: "DELETE", // Custom action for upsertAll
    // });

    this.prototype.setUpVersioning(models, this.versionItemType);

    this.hasMany(models.Seat, {
      foreignKey: "office_id",
      as: "seats",
      onRemove: "DELETE", // Custom action for upsertAll
    });

    this.belongsTo(models.Municipality, {
      foreignKey: "municipality_id",
      as: "municipality",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}

export default Office;
