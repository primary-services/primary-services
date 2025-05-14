// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('deadline_parent', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     deadline_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'deadline',
//         key: 'id'
//       }
//     },
//     parent_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     parent_type: {
//       type: DataTypes.ENUM("MUNICIPALITY","ELECTION"),
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'deadline_parent',
//     schema: 'public',
//     timestamps: false,
//     indexes: [
//       {
//         name: "deadline_parent_pkey",
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

class DeadlineParent extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				deadline_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "deadline",
						key: "id",
					},
				},
				parent_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				parent_type: {
					type: DataTypes.ENUM("MUNICIPALITY", "ELECTION"),
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "deadline_parent",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "deadline_parent_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}
}

export default DeadlineParent;
