// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('seat', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     office_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'office',
//         key: 'id'
//       }
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: true
//     }
//   }, {
//     sequelize,
//     tableName: 'seat',
//     schema: 'public',
//     timestamps: false,
//     indexes: [
//       {
//         name: "seat_pkey",
//         unique: true,
//         fields: [
//           { name: "id" },
//         ]
//       },
//     ]
//   });
// };

import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Seat extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				office_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: true,
				},
			},
			{
				sequelize,
				tableName: "seat",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "seat_pkey",
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
			as: "office",
		});

		this.hasMany(models.Term, {
			foreignKey: "seat_id",
			as: "terms",
			onDelete: "CASCADE",
		});
	}
}

export default Seat;
