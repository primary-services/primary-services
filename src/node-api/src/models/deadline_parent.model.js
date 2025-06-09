import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class DeadlineParent extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				deadline_id: {
					type: DataTypes.INTEGER,
					unique: "deadline_parent_unique_idx",
					allowNull: false,
				},
				parent_id: {
					type: DataTypes.INTEGER,
					unique: "deadline_parent_unique_idx",
					allowNull: false,
				},
				parent_type: {
					type: DataTypes.ENUM("MUNICIPALITY", "ELECTION"),
					unique: "deadline_parent_unique_idx",
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "deadline_parent",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "deadline_parent_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Deadline, {
			foreignKey: "deadline_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default DeadlineParent;
