import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class OfficeTemplate extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "office_template",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "office_template_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}
}

export default OfficeTemplate;
