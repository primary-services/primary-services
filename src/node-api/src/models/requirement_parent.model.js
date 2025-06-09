import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class RequirementParent extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				requirement_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					unique: "requirement_parent_unique_idx",
					references: {
						model: "requirement",
						key: "id",
					},
				},
				parent_id: {
					type: DataTypes.INTEGER,
					unique: "requirement_parent_unique_idx",
					allowNull: false,
					references: null,
				},
				parent_type: {
					type: DataTypes.ENUM("MUNICIPALITY", "ELECTION"),
					unique: "requirement_parent_unique_idx",
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "requirement_parent",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "requirement_parent_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Requirement, {
			foreignKey: "requirement_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default RequirementParent;
