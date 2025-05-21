import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Form extends Model {
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
				url: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				label: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "form",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "form_pkey",
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
				model: models.FormParent,
				unique: false,
			},
			foreignKey: "form_id",
			constraints: false,
		});

		this.belongsToMany(models.Election, {
			through: {
				model: models.FormParent,
				unique: false,
			},
			foreignKey: "form_id",
			constraints: false,
		});

		this.hasOne(models.Requirement, {
			foreignKey: "deadline_id",
		});
	}
}

export default Form;
