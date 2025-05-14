import { Sequelize } from "sequelize";

import databaseConfig from "../config/database.js";
import { columntypes } from "./datatypes.js";
import fs from "fs";

const modelFiles = fs
	.readdirSync("./src/models/")
	.filter((file) => file.endsWith(".js"));

class Migrator {
	constructor() {
		this.connection = null;
		this.tables = {};
	}

	async run() {
		await this.init();
		await this.getTables();
		await this.getColumnInfo();
		await this.getConstraintInfo();
		// TODO: compare tables
		await this.compareColumns();

		return;
	}

	async init() {
		try {
			this.connection = new Sequelize({ ...databaseConfig, logging: false });

			for (const file of modelFiles) {
				const model = await import(`../models/${file}`);
				if (!!model?.default?.init) {
					model.default.init(this.connection);
				}
			}

			modelFiles.map(async (file) => {
				const model = await import(`../models/${file}`);
				if (!!model?.default?.init) {
					model.default.associate &&
						model.default.associate(this.connection.models);
				}
			});

			console.log("[SEQUELIZE] Database service initialized");
		} catch (error) {
			console.log("[SEQUELIZE] Error during database service initialization");
			throw error;
		}
	}

	async getTables() {
		let response = await this.connection.query(`
			SELECT
			    table_name as show_tables
			FROM
			    information_schema.tables
			WHERE
			    table_type = 'BASE TABLE'
			AND
			    table_schema NOT IN ('pg_catalog', 'information_schema');
		`);

		return Promise.all(
			response[0].map(async (tableInfo) => {
				// There's got to be a safer way to do this, but I honestly doubt that any
				// of our table names will ever be an SQL Injection risk
				let query = `SELECT 'public.${tableInfo.show_tables}'::regclass::oid;`;
				let oidResp = await this.connection.query(query);

				this.tables[tableInfo.show_tables] = {
					oid: oidResp[0][0].oid,
					columns: {},
					contraints: {},
				};
			}),
		);
	}

	async getColumnInfo() {
		let columns = await this.connection.query(`
			select 
				* 
			from 
				INFORMATION_SCHEMA.COLUMNS 
			where 
				table_schema = 'public' 
			order by 
				table_name, 
				ordinal_position;
		`);

		columns[0].map((column) => {
			let { table_name, column_name } = column;
			if (!!this.tables[table_name]) {
				this.tables[table_name].columns[column_name] = column;
			}
		});
	}

	async getConstraintInfo() {
		let constraints = await this.connection.query(`
			SELECT 
				conrelid::regclass AS table_from,
			    conname,
			    pg_get_constraintdef(c.oid),
			    c.conrelid AS table_oid,
			    c.conindid AS relation_contstraint_oid,
			    c.confrelid AS relation_table_oid,
			    c.confupdtype AS relation_update_action,
			    c.confdeltype AS relation_delete_action,
			    c.confmatchtype AS relation_match_type,
			    c.*
			FROM   pg_constraint c
			JOIN   pg_namespace n ON n.oid = c.connamespace
			WHERE  contype IN ('f', 'p ')
			AND    n.nspname = 'public' -- your schema here
			ORDER  BY conrelid::regclass::text, contype DESC;
		`);

		constraints[0].map((contraint) => {
			let { table_from, conname } = contraint;
			this.tables[table_from].contraints[conname] = contraint;
		});
	}

	async getNameByOID(oid) {
		return this.connection.query(
			`
			select nsp.nspname as schema_name, tbl.relname as name
			from pg_namespace nsp
			  join pg_class tbl on nsp.oid = tbl.relnamespace
			where tbl.oid = ?;
		`,
			{ replacements: [oid] },
		);
	}

	async compareColumns() {
		// let attributes = model.tableAttributes;
		// let associations = model.associations;

		let creates = [];
		let updates = [];
		let deletes = [];

		Object.keys(this.connection.models).map((key) => {
			let model = this.connection.models[key];
			let modelColumns = Object.keys(model.tableAttributes);
			let dbColumns = Object.keys(this.tables[model.tableName].columns);

			modelColumns.map((mc, mcColIdx) => {
				let mAttrs = model.tableAttributes[mc];

				// First check that the model column exists in the database columns
				let dbColIdx = dbColumns.indexOf(mc);
				if (dbColIdx !== -1) {
					// If does remove it from the dbColumns array, any that remain
					// will be columns that have been removed in the model
					dbColumns.splice(dbColIdx, 1);
				} else {
					// If it doesn't exist, it's a column to be added
					creates.push(mAttrs);
					return;
				}

				// get the database attributes to compare
				let dbAttrs = this.tables[model.tableName].columns[mc];

				// TODO: Renames? How?
				let dataTypeUpdates = this.compareDataTypes(
					model.tableName,
					mc,
					mAttrs,
					dbAttrs,
				);
				let nullableUpdates = this.compareNullable(
					model.tableName,
					mc,
					mAttrs,
					dbAttrs,
				);
				let defaultUpdates = this.compareDefaults(
					model.tableName,
					mc,
					mAttrs,
					dbAttrs,
				);

				updates = [
					...updates,
					...dataTypeUpdates,
					...nullableUpdates,
					...defaultUpdates,
				];
			});

			// If there's any remaining DB columns they should be dropped
			dbColumns.map((col) => {
				deletes.push(col);
			});
		});

		console.log("Creates:", creates);
		console.log("Updates:", updates);
		console.log("Deletes:", deletes);
	}

	compareDataTypes(table, column, mAttrs, dbAttrs) {
		let updates = [];

		if (mAttrs.type.constructor.name !== "ENUM") {
			// Compare data type
			let modelDataType = (
				columntypes[mAttrs.type.constructor.name] || ""
			).toUpperCase();
			let dbDataType = dbAttrs.udt_name.toUpperCase();

			if (modelDataType !== dbDataType) {
				let update = {
					update: "datatype",
					table: table,
					column: column,
					modelAttributes: mAttrs,
					databaseAttributes: dbAttrs,
				};

				updates.push(update);
			}
		} else {
			// Deal with enums
		}

		return updates;
	}

	compareNullable(table, column, mAttrs, dbAttrs) {
		let updates = [];

		let dbNullable = dbAttrs.is_nullable === "NO" ? false : true;
		if (mAttrs.allowNull !== dbNullable) {
			let update = {
				update: "nullable",
				table: table,
				column: column,
				modelAttributes: mAttrs,
				databaseAttributes: dbAttrs,
			};

			updates.push(update);
		}

		return updates;
	}

	compareDefaults(table, column, mAttrs, dbAttrs) {
		let updates = [];

		let mDefault = mAttrs.defaultValue || "";
		let dbDefault = dbAttrs.column_default || "";

		if (mDefault !== dbDefault) {
			// If it's a primary key, check that the default is a nextvalue sequence
			if (mAttrs.primaryKey && /^nextval\(.*\)$/.test(dbDefault)) {
				return updates;
			}

			// If it's a boolean, convert to a string and compare
			if (
				typeof mDefault === "boolean" &&
				new Boolean(mDefault).toString() === dbDefault
			) {
				return updates;
			}

			// It's an actual update
			let update = {
				update: "default",
				table: table,
				column: column,
				modelAttributes: mAttrs,
				databaseAttributes: dbAttrs,
			};

			updates.push(update);
		}

		return updates;
	}
}

(async () => {
	const migrator = new Migrator();
	await migrator.run();

	console.log("Done");
	process.exit();
})();
