import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Version extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				item_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				item_type: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				fields: {
					type: DataTypes.JSONB,
					allowNull: false,
				},
				created_at: {
					type: DataTypes.DATE,
					allowNull: true,
					defaultValue: DataTypes.NOW,
				},
			},
			{
				sequelize,
				tableName: "versions",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "versions_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Office, {
			foreignKey: "office_id",
			constraints: false,
		});

		this.hasOne(models.User, {
			foreignKey: "id",
			sourceKey: "user_id",
			as: "user",
			constraints: false,
		});
	}
}

export default Version;
