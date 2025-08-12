import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Verification extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				item_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				item_type: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				verification_type: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				token: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				expiry: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
			},
			{
				sequelize,
				tableName: "verification",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "verification_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.hasMany(models.User, {
			foreignKey: "item_id",
			constraints: false,
			scope: {
				item_type: "user",
			},
		});
	}
}

export default Note;
