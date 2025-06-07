import { Sequelize, DataTypes } from "sequelize";
import slugify from "slugify";
import Model from "../lib/base-model.js";

class Municipality extends Model {
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
        type: {
          type: DataTypes.ENUM("STATE", "COUNTY", "TOWN", "DISTRICT"),
          allowNull: false,
        },
        website: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        slug: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "municipality",
        schema: "public",
        timestamps: false,
        hooks: {
          beforeSave: (instance, options) => {
            console.log(
              instance.name,
              slugify(instance.name.toLowerCase(), "_"),
            );
            instance.slug = slugify(instance.name.toLowerCase(), "_");
          },
        },
        indexes: [
          {
            name: "municipality_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      },
    );
  }
  static associate(models) {
    // TODO: this is super annoying
    this.hasMany(models.Office, {
      foreignKey: "municipality_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      as: "offices",
    });

    this.hasMany(models.Contact, {
      foreignKey: "municipality_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      as: "contacts",
    });

    this.belongsToMany(models.Requirement, {
      through: {
        model: models.RequirementParent,
        unique: false,
        scope: {
          parent_type: "MUNICIPALITY",
        },
      },
      foreignKey: "parent_id",
      constraints: false,
      as: "requirements",
    });

    this.belongsToMany(models.Form, {
      through: {
        model: models.FormParent,
        unique: false,
        scope: {
          parent_type: "MUNICIPALITY",
        },
      },
      foreignKey: "parent_id",
      constraints: false,
      as: "forms",
    });

    this.belongsToMany(models.Deadline, {
      through: {
        model: models.DeadlineParent,
        unique: false,
        scope: {
          parent_type: "MUNICIPALITY",
        },
      },
      foreignKey: "parent_id",
      constraints: false,
      as: "deadlines",
    });
  }
}

export default Municipality;
