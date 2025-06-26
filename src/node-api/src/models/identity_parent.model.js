import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class IdentityParent extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				identity_id: {
					type: DataTypes.INTEGER,
					unique: "identity_parent_unique_idx",
					allowNull: false,
				},
				parent_id: {
					type: DataTypes.INTEGER,
					unique: "identity_parent_unique_idx",
					allowNull: false,
				},
				parent_type: {
					type: DataTypes.TEXT,
					unique: "identity_parent_unique_idx",
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "identity_parent",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "identity_parent_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Identity, {
			foreignKey: "identity_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default IdentityParent;
