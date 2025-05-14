// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('requirement_scope', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     mandatory: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false
//     },
//     scope: {
//       type: DataTypes.ENUM("STATE","COUNTY","TOWN","DISTRICT"),
//       allowNull: false
//     },
//     requirement_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'requirement',
//         key: 'id'
//       }
//     }
//   }, {
//     sequelize,
//     tableName: 'requirement_scope',
//     schema: 'public',
//     timestamps: false,
//     indexes: [
//       {
//         name: "requirement_scope_pkey",
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

class RequirementScope extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				mandatory: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
				},
				scope: {
					type: DataTypes.ENUM("STATE", "COUNTY", "TOWN", "DISTRICT"),
					allowNull: false,
				},
				requirement_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "requirement",
						key: "id",
					},
				},
			},
			{
				sequelize,
				tableName: "requirement_scope",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "requirement_scope_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}
}

export default RequirementScope;
