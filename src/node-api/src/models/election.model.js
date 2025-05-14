// const Sequelize = require("sequelize");
// module.exports = function (sequelize, DataTypes) {
// 	return sequelize.define(
// 		"election",
// 		{
// 			id: {
// 				autoIncrement: true,
// 				type: DataTypes.INTEGER,
// 				allowNull: false,
// 				primaryKey: true,
// 			},
// 			type: {
// 				type: DataTypes.ENUM("PRIMARY", "GENERAL", "SPECIAL"),
// 				allowNull: false,
// 			},
// 			polling_date: {
// 				type: DataTypes.DATEONLY,
// 				allowNull: false,
// 			},
// 		},
// 		{
// 			sequelize,
// 			tableName: "election",
// 			schema: "public",
// 			timestamps: false,
// 			indexes: [
// 				{
// 					name: "election_pkey",
// 					unique: true,
// 					fields: [{ name: "id" }],
// 				},
// 			],
// 		},
// 	);
// };

import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Election extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				type: {
					type: DataTypes.ENUM("PRIMARY", "GENERAL", "SPECIAL"),
					allowNull: false,
				},
				polling_date: {
					type: DataTypes.DATEONLY,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "election",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "election_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		// TODO: this is super annoying

		this.belongsToMany(models.Term, {
			through: models.ElectionTerm,
			foreignKey: "election_id",
		});

		// this.belongsToMany(models.Seat, {
		// 	through: models.Term,
		// });

		// this.belongsToMany(models.Office, {
		// 	through: models.Seat,
		// });

		// this.belongsTo(Municipality, {
		// 	foreignKey: "municipality_id",
		// });
	}
}

export default Election;
