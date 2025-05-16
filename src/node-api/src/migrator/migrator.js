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

		this.creates = [];
		this.updates = [];
		this.deletes = [];
	}

	async run() {
		await this.init();
		await this.getTables();
		await this.getColumnInfo();
		await this.getConstraintInfo();
		// TODO: compare tables
		await this.compareColumns();
		await this.compareConstraints();
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
				if (tableInfo.show_tables === "SequelizeMeta") {
					// Ignore the migrations table
					return;
				}

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
		    rc.cols AS relation_columns,
				a.cols AS self_columns,
		    c.confrelid AS relation_table_oid,
		    c.confupdtype AS relation_update_action,
		    c.confdeltype AS relation_delete_action,
		    c.confmatchtype AS relation_match_type,
		    c.*
			FROM   pg_constraint c
			JOIN   pg_namespace n ON n.oid = c.connamespace
			LEFT JOIN LATERAL (
				SELECT JSONB_AGG(column_name) AS cols
				FROM information_schema.constraint_column_usage 
				WHERE constraint_name = conname
			) AS rc ON TRUE
			INNER JOIN LATERAL (
				SELECT JSONB_AGG(pg_attribute.attname) AS cols
				FROM pg_attribute
				WHERE 
					pg_attribute.attrelid = c.conrelid
				AND 
					pg_attribute.attnum IN (
						SELECT * FROM unnest(c.conkey)
					) 
			) AS a ON TRUE
			WHERE  n.nspname = 'public' -- your schema here
			ORDER  BY conrelid::regclass::text, contype DESC;
		`);

		constraints[0].map((contraint) => {
			let { table_from, conname } = contraint;
			if (table_from === '"SequelizeMeta"') {
				return;
			}

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
					creates.push({
						type: "column",
						action: "create",
						table: model.tableName,
						definition: mAttrs,
					});
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
				deletes.push({
					type: "column",
					action: "delete",
					table: model.tableName,
					old: col,
				});
			});
		});

		this.creates = [...this.creates, ...creates];
		this.updates = [...this.updates, ...updates];
		this.deletes = [...this.deletes, ...deletes];
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
					type: "column",
					action: "update",
					attribute: "datatype",
					table: table,
					column: column,
					definition: mAttrs,
					old: dbAttrs,
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
				type: "column",
				action: "update",
				attribute: "nullable",
				table: table,
				column: column,
				definition: mAttrs,
				old: dbAttrs,
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
				type: "column",
				action: "update",
				attribute: "default",
				table: table,
				column: column,
				definition: mAttrs,
				old: dbAttrs,
			};

			updates.push(update);
		}

		return updates;
	}

	compareConstraints() {
		Object.keys(this.connection.models).map((key) => {
			let model = this.connection.models[key];
			let mAssociations = Object.keys(model.associations);

			// Gather all the necessary foreign key opitions. Indexes
			// and unique constraints have accessors
			let foreignKeys = {};
			mAssociations.map((association) => {
				let ass = model.associations[association];
				let { tableName, foreignKey, onDelete, onUpdate, indexes, scopes } =
					ass.options;

				let ignoredAsses = ["HasMany", "HasOne", "BelongsToMany"];

				if (!ignoredAsses.includes(ass.associationType)) {
					foreignKeys[foreignKey] = {
						table: tableName,
						field: foreignKey,
						target: {
							table: ass.target.tableName,
							field: ass.targetKeyField,
						},
						onDelete: onDelete,
						onUpdate: onUpdate,
					};
				}
			});

			// Var for raw db constraints list
			let dbConstraints = this.tables[model.tableName].contraints;
			let dbKeys = Object.keys(dbConstraints);

			// Compare the indexes, keep track of the dbKeys used
			dbKeys = this.compareIndexes(
				model.tableName,
				model._indexes,
				dbConstraints,
				dbKeys,
			);

			dbKeys = this.compareUniques(
				model.tableName,
				model.uniqueKeys,
				dbConstraints,
				dbKeys,
			);

			dbKeys = this.compareFKs(
				model.tableName,
				foreignKeys,
				dbConstraints,
				dbKeys,
			);

			dbKeys.map((dbKey) => {
				this.deletes.push({
					type: "constraint",
					old: dbConstraints[dbKey],
				});
			});

			// console.log("Indexes:", model._indexes);
			// console.log("Unique Keys:", model.uniqueKeys);
			// console.log(foreignKeys);
		});
	}

	compareIndexes(table, mIdxs, dbIdxs, dbKeys) {
		let creates = [];
		let updates = [];

		mIdxs.map((mIdx) => {
			let dbIdx = dbIdxs[mIdx.name];

			if (!dbIdx) {
				creates.push({
					type: "index",
					table: table,
					definition: mIdx,
				});

				return;
			}

			if (dbIdx.contype === "p") {
				// console.log(mIdx.name, dbKeys.indexOf(mIdx.name));
				dbKeys.splice(dbKeys.indexOf(mIdx.name), 1);
				return;
			}

			// Honestly don't know what else to compare here
			console.log("This is a different index?", mIdx);
		});

		this.creates = [...this.creates, ...creates];
		this.updates = [...this.updates, ...updates];

		return dbKeys;
	}

	compareUniques(table, mUniques, dbUniques, dbKeys) {
		let creates = [];
		let updates = [];

		for (let key in mUniques) {
			let mUnique = mUniques[key];
			let dbUnique = dbUniques[key];

			if (!dbUnique) {
				creates.push({
					type: "unique",
					table: table,
					definition: mUnique,
					old: dbUnique,
				});

				continue;
			}

			if (dbUnique.contype === "u") {
				// console.log(key, dbKeys.indexOf(key));
				dbKeys.splice(dbKeys.indexOf(key), 1);
			}

			if (this.compareArrays(mUnique.fields, dbUnique.relation_columns)) {
				// They're the same, horray!
			} else {
				updates.push({
					type: "unique",
					table: table,
					definition: mUnique,
					old: dbUnique,
				});
			}
		}

		this.creates = [...this.creates, ...creates];
		this.updates = [...this.updates, ...updates];

		return dbKeys;
	}

	compareFKs(table, mFKs, dbFKs, dbKeys) {
		let creates = [];
		let updates = [];

		// console.log(dbFKs);

		for (let key in mFKs) {
			let mFK = mFKs[key];
			let dbFK = Object.entries(dbFKs).find((e) => {
				return e[1].self_columns.includes(key) && e[1].table_from === table;
			})[1];

			if (!dbFK) {
				creates.push({
					type: "fk",
					table: table,
					definition: mFK,
				});

				continue;
			}

			if (dbFK.contype === "f") {
				dbKeys.splice(dbKeys.indexOf(dbFK.conname), 1);
			}

			// Finally the actual comparisons
			let actions = {
				r: "RESTRICT",
				c: "CASCADE",
				a: "NO ACTION",
				d: "SET DEFAULT",
				n: "SET NULL",
			};

			let dbUpdate = actions[dbFK.relation_update_action];
			let dbDelete = actions[dbFK.relation_delete_action];

			if (dbUpdate !== mFK.onUpdate) {
				updates.push({
					type: "fk",
					table: table,
					definition: mFK,
					old: dbFK,
				});
			}

			if (dbDelete !== mFK.onDelete) {
				updates.push({
					type: "fk",
					table: table,
					definition: mFK,
					old: dbFK,
				});
			}
		}

		this.creates = [...this.creates, ...creates];
		this.updates = [...this.updates, ...updates];

		return dbKeys;
	}

	compareArrays(arr1, arr2) {
		return (
			arr1.every((k) => arr2.includes(k)) && arr2.every((k) => arr1.includes(k))
		);
	}
}

(async () => {
	const migrator = new Migrator();

	await migrator.run();

	console.log("Creates:", migrator.creates);
	console.log("Updates:", migrator.updates);
	console.log("Deletes:", migrator.deletes);
	console.log("Done");

	// This will throw an error, but it's just a hack to get nodemon to fully exit
	process.exit(1);
})();
