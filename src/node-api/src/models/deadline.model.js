// const Sequelize = require("sequelize");
// module.exports = function (sequelize, DataTypes) {
// 	return sequelize.define(
// 		"deadline",
// 		{
// 			id: {
// 				autoIncrement: true,
// 				type: DataTypes.INTEGER,
// 				allowNull: false,
// 				primaryKey: true,
// 			},
// 			description: {
// 				type: DataTypes.STRING,
// 				allowNull: false,
// 			},
// 			deadline: {
// 				type: DataTypes.DATEONLY,
// 				allowNull: false,
// 			},
// 			label: {
// 				type: DataTypes.STRING,
// 				allowNull: false,
// 			},
// 		},
// 		{
// 			sequelize,
// 			tableName: "deadline",
// 			schema: "public",
// 			timestamps: false,
// 			indexes: [
// 				{
// 					name: "deadline_pkey",
// 					unique: true,
// 					fields: [{ name: "id" }],
// 				},
// 			],
// 		},
// 	);
// };

import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Deadline extends Model {
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
				deadline: {
					type: DataTypes.DATEONLY,
					allowNull: false,
				},
				label: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "deadline",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "deadline_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsToMany(models.Municipality, {
			through: {
				model: models.DeadlineParent,
				unique: false,
			},
			foreignKey: "deadline_id",
			constraints: false,
		});

		this.belongsToMany(models.Election, {
			through: {
				model: models.DeadlineParent,
				unique: false,
			},
			foreignKey: "deadline_id",
			constraints: false,
		});

		this.hasOne(models.Requirement, {
			foreignKey: "deadline_id",
		});
	}
}

export default Deadline;
