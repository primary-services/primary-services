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
		// Dynamically associate to all models that have versionItemType defined
		for (const modelName of Object.keys(models)) {
			const model = models[modelName];
			if (Object.hasOwn(model, "versionItemType") && !!model.versionItemType) {
				this.belongsTo(model, {
					foreignKey: "item_id",
					constraints: false,
				});
			}
		}

		this.hasOne(models.User, {
			foreignKey: "id",
			sourceKey: "user_id",
			as: "user",
			constraints: false,
		});
	}
}

export const createNewVersion = async (model, user, data) => {
	let [item, diff] = await model.prototype.upsertAllAndDiff(data);

	if (diff !== null) {
		let version = Version.build({
			user_id: user.id,
			item_id: item.id,
			item_type: model.name,
			fields: diff,
		});

		await version.save();
	}

	return item;
}

export default Version;
