// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('municipality', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     type: {
//       type: DataTypes.ENUM("STATE","COUNTY","TOWN","DISTRICT"),
//       allowNull: false
//     },
//     parent_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'municipality',
//         key: 'id'
//       }
//     },
//     website: {
//       type: DataTypes.STRING,
//       allowNull: true
//     }
//   }, {
// sequelize,
// tableName: 'municipality',
// schema: 'public',
// timestamps: false,
// indexes: [
//   {
//     name: "municipality_pkey",
//     unique: true,
//     fields: [
//       { name: "id" },
//     ]
//   },
// ]
//   });
// };

import { Sequelize, DataTypes } from "sequelize";
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
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "municipality",
            key: "id",
          },
        },
        website: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "municipality",
        schema: "public",
        timestamps: false,
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
    });
  }
}

export default Municipality;
