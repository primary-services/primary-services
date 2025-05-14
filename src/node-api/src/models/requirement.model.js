// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('requirement', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     municipality_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'municipality',
//         key: 'id'
//       }
//     },
//     form_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'form',
//         key: 'id'
//       }
//     },
//     deadline_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'deadline',
//         key: 'id'
//       }
//     },
//     label: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   }, {
//     sequelize,
//     tableName: 'requirement',
//     schema: 'public',
//     timestamps: false,
//     indexes: [
//       {
//         name: "requirement_pkey",
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

class Requirement extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				municipality_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "municipality",
						key: "id",
					},
				},
				form_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "form",
						key: "id",
					},
				},
				deadline_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {
						model: "deadline",
						key: "id",
					},
				},
				label: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "requirement",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "requirement_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}
}

export default Requirement;
