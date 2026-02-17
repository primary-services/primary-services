import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Flag extends Model {
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
				name: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "flag",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "flag_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);

		this.humanReadableIdentifier = "name";
		this.versionItemType = "Flag";
	}

	static associate(models) {
		this.prototype.setUpVersioning(models, this.versionItemType);

		this.belongsTo(models.Municipality, {
			foreignKey: "item_id",
			constraints: false,
		});
	}
}

export default Flag;
