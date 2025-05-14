// const Sequelize = require('sequelize');
// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define('election_term', {
//     id: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     election_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'election',
//         key: 'id'
//       }
//     },
//     term_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'term',
//         key: 'id'
//       }
//     }
//   }, {
//     sequelize,
//     tableName: 'election_term',
//     schema: 'public',
//     timestamps: false,
//     indexes: [
//       {
//         name: "election_term_pkey",
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

class ElectionTerm extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				election_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					// references: {
					// 	model: "election",
					// 	key: "id",
					// },
				},
				term_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					// references: {
					// 	model: "term",
					// 	key: "id",
					// },
				},
			},
			{
				sequelize,
				tableName: "election_term",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "election_term_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}
}

export default ElectionTerm;
