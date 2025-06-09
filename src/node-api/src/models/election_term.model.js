import { Sequelize, DataTypes } from "sequelize";
import Model from "../lib/base-model.js";

class ElectionTerm extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					autoIncrement: true,
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
				},
				election_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					// references: {
					// 	model: "election",
					// 	key: "id",
					// },
				},
				term_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					// references: {
					// 	model: "term",
					// 	key: "id",
					// },
				},
			},
			{
				sequelize,
				tableName: "election_term",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "election_term_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			},
		);
	}

	static associate(models) {
		this.belongsTo(models.Election, {
			foreignKey: "election_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});

		this.belongsTo(models.Term, {
			foreignKey: "term_id",
			onDelete: "NO ACTION",
			onUpdate: "NO ACTION",
		});
	}
}

export default ElectionTerm;
