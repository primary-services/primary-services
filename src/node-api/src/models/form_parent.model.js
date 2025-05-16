import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class FormParent extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				form_id: {
					type: DataTypes.INTEGER,
					unique: "form_parent_unique_idx",
					allowNull: false,
				},
				parent_id: {
					type: DataTypes.INTEGER,
					unique: "form_parent_unique_idx",
					allowNull: false,
				},
				parent_type: {
					type: DataTypes.ENUM("MUNICIPALITY", "ELECTION"),
					unique: "form_parent_unique_idx",
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "form_parent",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "form_parent_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Form, {
			foreignKey: "form_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default FormParent;
