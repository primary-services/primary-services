import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class Term extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				start: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				start_year: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				end: {
					type: DataTypes.DATEONLY,
					allowNull: true,
				},
				end_year: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				seat_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
			},
			{
				sequelize,
				tableName: "term",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "term_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsToMany(models.Election, {
			through: models.ElectionTerm,
			foreignKey: "term_id",
			as: "elections",
		});

		this.belongsTo(models.Seat, {
			foreignKey: "seat_id",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			as: "seat",
		});
	}
}

export default Term;
