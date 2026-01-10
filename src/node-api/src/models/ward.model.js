import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Ward extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				municipality_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				deleted: {
					type: DataTypes.BOOLEAN,
					allowNull: true,
					defaultValue: false,
				},
			},
			{
				sequelize,
				tableName: "ward",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "ward_pkey",
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
			as: "ward",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});

		this.hasMany(models.Seat, {
			foreignKey: "ward_id",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			as: "wards",
		});

		this.humanReadableIdentifier = "name";
		this.versionItemType = "Ward";
	}
}

export default Ward;
