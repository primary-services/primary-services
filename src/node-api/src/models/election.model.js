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
		this.belongsTo(models.Municipality, {
			foreignKey: "municipality_id",
			as: "municipality",
		});

		this.belongsToMany(models.Term, {
			through: models.ElectionTerm,
			foreignKey: "election_id",
			as: "terms",
		});

		this.belongsToMany(models.Requirement, {
			through: {
				model: models.RequirementParent,
				unique: false,
				scope: {
					parent_type: "ELECTION",
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
					parent_type: "ELECTION",
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
					parent_type: "ELECTION",
				},
			},
			foreignKey: "parent_id",
			constraints: false,
			as: "deadlines",
		});
	}
}

export default Election;
