import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Note extends Model {
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
				summary: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				content: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				created_at: {
					type: DataTypes.DATE,
					allowNull: true,
					defaultValue: DataTypes.NOW,
				},
				created_by: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				deleted: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
			},
			{
				sequelize,
				tableName: "note",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "note_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Municipality, {
			foreignKey: "item_id",
			constraints: false,
		});

		this.hasMany(models.Source, {
			foreignKey: "item_id",
			constraints: false,
			scope: {
				item_type: "note",
			},
		});
	}
}

export default Note;
