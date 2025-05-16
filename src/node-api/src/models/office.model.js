import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Office extends Model {
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
					allowNull: true,
				},
				description: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				elected: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					defaultValue: true,
				},
				tenure: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				salary: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				min_hours: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				max_hours: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				municipality_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					// references: {
					// 	model: "municipality",
					// 	key: "id",
					// },
				},
			},
			{
				sequelize,
				tableName: "office",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "office_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.hasMany(models.Official, {
			foreignKey: "office_id",
			as: "officials",
			onRemove: "DELETE", // Custom action for upsertAll
		});

		this.hasMany(models.Seat, {
			foreignKey: "office_id",
			as: "seats",
			hooks: true,
			onRemove: "DELETE", // Custom action for upsertAll
		});

		this.belongsTo(models.Municipality, {
			foreignKey: "municipality_id",
			as: "municipality",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default Office;
