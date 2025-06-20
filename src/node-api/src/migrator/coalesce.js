import { columntypes, aliases } from "./datatypes.js";
import { constraintName } from "./generators.js";

const getSequelizeType = (pgType) => {
	pgType = aliases[pgType] || pgType;

	for (var x in columntypes) {
		if (columntypes[x].toLowerCase() === pgType.toLowerCase()) {
			return x;
		}
	}
};

export const coalesce = (changes, creates, updates, deletes) => {
	creates.map((c) => {
		if (c.type === "table") {
			let key = `${c.table}`;
			let { up, down } = changes.tables;

			let upDef = up.creates[key] || {
				table: c.table,
				definition: c.definition,
			};

			let downDef = down.deletes[key] || {
				table: c.table,
			};

			up.creates[key] = upDef;
			down.deletes[key] = downDef;
		}

		if (c.type === "column") {
			let key = `${c.table}.${c.definition.field}`;
			let { up, down } = changes.columns;

			let upDef = up.creates[key] || {
				table: c.table,
				column: c.definition.field,
				attrs: [],
				definition: c.definition,
			};

			let downDef = down.deletes[key] || {
				table: c.table,
				column: c.definition.field,
				attrs: [],
				definition: c.definition,
			};

			up.creates[key] = upDef;
			down.deletes[key] = downDef;
		}

		if (["unique", "index", "fk"].includes(c.type)) {
			let key = `${c.table}.${c.key}`;
			let { up, down } = changes.constraints;

			let upDef = up.creates[key] || {
				table: c.table,
				type: c.type,
				key: c.key,
				definition: c.definition,
			};

			let downDef = down.deletes[key] || {
				table: c.table,
				type: c.type,
				key: c.key,
				name: constraintName(c),
				definition: c.definition,
			};

			up.creates[key] = upDef;
			down.deletes[key] = downDef;
		}
	});

	updates.map((u) => {
		if (u.type === "column") {
			let key = `${u.table}.${u.column}`;
			let { up, down } = changes.columns;

			let attr = u.attribute;
			let upDef = up.updates[key] || {
				table: u.table,
				column: u.column,
				attrs: [],
				definition: u.definition,
			};

			let downDef = down.updates[key] || {
				table: u.table,
				column: u.column,
				attrs: [],
				definition: {
					type: getSequelizeType(u.old.data_type),
					allowNull: u.old.is_nullable === "YES",
					primaryKey: u.old.is_identity === "YES",
					autoIncrement: u.old.identity_increment !== null,
					defaultValue: u.old.column_default,
				},
			};

			upDef.attrs.push(attr);
			downDef.attrs.push(attr);

			up.updates[key] = upDef;
			down.updates[key] = downDef;
		}

		if (["unique", "index", "fk"].includes(u.type)) {
			let key = `${u.table}.${u.key}`;
			let { up, down } = changes.constraints;

			let upDef = up.updates[key] || {
				table: u.table,
				type: u.type,
				key: u.key,
				name: u.old.conname,
				definition: u.definition,
			};

			up.updates[key] = upDef;
		}
	});

	deletes.map((d) => {
		// console.log(d);
		if (d.type === "table") {
			let key = `${d.table}`;
			let { up, down } = changes.tables;

			let upDef = up.deletes[key] || {
				table: d.table,
			};

			let downDef = down.creates[key] || {
				table: d.table,
				definition: d.definition,
			};
		}

		if (d.type === "column") {
			let key = `${d.table}.${d.old}`;
			let { up, down } = changes.columns;

			let upDef = up.deletes[key] || {
				table: d.table,
				column: d.old,
				attrs: [],
			};

			up.deletes[key] = upDef;
		}

		if (["unique", "index", "fk"].includes(d.type)) {
			let key = `${d.table}.${d.key}`;
			let { up, down } = changes.constraints;

			let upDef = up.deletes[key] || {
				table: d.table,
				type: d.type,
				key: d.key,
				name: u.old.conname,
				definition: d.definition,
			};

			up.deletes[key] = upDef;
		}
	});
};
