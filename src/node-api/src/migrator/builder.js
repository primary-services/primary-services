const queries = {
	up: [],
	down: [],
};

const formatDefaultValue = (value) => {
	if (value === undefined) {
		return "";
	}

	if (typeof value === "number") {
		return `defaultValue: ${value}`;
	}

	if (typeof value === "boolean") {
		return `defaultValue: ${!!value ? "TRUE" : "FALSE"}`;
	}

	return `defaultValue: "${value}"`;
};

const addTables = (dir, tables) => {
	for (t in tables) {
		queries.push(`await queryInterface.createTable('${t.table}', {})`);
	}
};

const dropTables = (dir, tables) => {
	for (t in tables) {
		queries.push(`await queryInterface.dropTable('${t.table}', {})`);
	}
};

const addColumns = (dir, columns) => {
	for (let key in columns) {
		let c = columns[key];

		let {
			type = null,
			allowNull = true,
			primaryKey = false,
			autoIncrement = false,
			defaultValue,
		} = c.definition;

		queries[dir].push(
			`
			await queryInterface.addColumn("${c.table}", "${c.column}", {
				type: ${type},
				allowNull: ${allowNull},
				primaryKey: ${primaryKey},
				autoIncrement: ${autoIncrement},
				${formatDefaultValue(defaultValue)}
			}
		`
				.replace(/\s{2,}/g, " ")
				.trim(),
		);
	}
};

const updateColumns = (dir, columns) => {
	for (let key in columns) {
		let c = columns[key];

		let {
			type = null,
			allowNull = true,
			primaryKey = false,
			autoIncrement = false,
			defaultValue,
		} = c.definition;

		queries[dir].push(
			`
			await queryInterface.changeColumn("${c.table}", "${c.column}", {
				type: ${type},
				allowNull: ${allowNull},
				primaryKey: ${primaryKey},
				autoIncrement: ${autoIncrement},
				${formatDefaultValue(defaultValue)}
			}
		`
				.replace(/\s{2,}/g, " ")
				.trim(),
		);
	}
};

const dropColumns = (dir, columns) => {
	for (let key in columns) {
		let c = columns[key];

		queries[dir].push(
			`await queryInterface.removeColumn('${c.table}', ${c.column}, {})`,
		);
	}
};

const addConstraints = (dir, constraints) => {
	for (let key in constraints) {
		let c = constraints[key];

		if (c.type === "unique") {
			queries[dir].push(
				`
				await queryInterface.addConstraint('${c.table}', {
					fields: [${c.definition.fields.join(",")}],
					type: "unique",
					name: ${c.key},
				})`
					.replace(/\s{2,}/g, " ")
					.trim(),
			);
		}

		if (c.type === "check") {
			// Stub
		}

		if (c.type === "index") {
			queries[dir].push(
				`
				await queryInterface.addConstraint('${c.table}', {
			   	fields: [${c.definition.fields.join(",")}],
			   	type: 'primary key',
			   	name: '${c.table}_pkey'
				})`
					.replace(/\s{2,}/g, " ")
					.trim(),
			);
		}

		if (c.type === "fk") {
			queries[dir].push(
				`
				await queryInterface.addConstraint('${c.table}', {
				  fields: [${c.definition.field}],
				  type: 'foreign key',
				  name: '${c.table}_${c.key}_fkey',
				  references: {
				    table: '${c.definition.target.table}',
				    field: '${c.definition.target.field}'
				  },
				  onDelete: '${c.definition.onDelete || "SET NULL"}',
				  onUpdate: '${c.definition.onDelete || "CASCADE"}'
				});
			`
					.replace(/\s{2,}/g, " ")
					.trim(),
			);
		}

		if (c.type === "multi-fk") {
			// STUB
		}
	}

	// Foreign Key
	// queryInterface.addConstraint('Posts', {
	//   fields: ['username'],
	//   type: 'foreign key',
	//   name: 'custom_fkey_constraint_name',
	//   references: { //Required field
	//     table: 'target_table_name',
	//     field: 'target_column_name'
	//   },
	//   onDelete: 'cascade',
	//   onUpdate: 'cascade'
	// });
	// Composite Foreign Key
	// queryInterface.addConstraint('TableName', {
	//   fields: ['source_column_name', 'other_source_column_name'],
	//   type: 'foreign key',
	//   name: 'custom_fkey_constraint_name',
	//   references: { //Required field
	//     table: 'target_table_name',
	//     fields: ['target_column_name', 'other_target_column_name']
	//   },
	//   onDelete: 'cascade',
	//   onUpdate: 'cascade'
	// });

	// Stub
	//  * - UNIQUE
	//  * - CHECK (Not supported by MySQL)
	//  * - FOREIGN KEY
	//  * - PRIMARY KEY
};

const dropConstraints = (dir, constraints) => {
	for (let key in constraints) {
		let c = constraints[key];
		queries[dir].push(
			`await queryInterface.removeConstraint('${c.table}', ${c.name}, {})`,
		);
	}
};

export const build = async (changes) => {
	let { tables, columns, constraints } = changes;

	console.log(changes);

	addTables("up", tables.up.creates);
	dropTables("up", tables.up.deletes);

	addColumns("up", columns.up.creates);
	updateColumns("up", columns.up.updates);

	addConstraints("up", constraints.up.creates);
	// There's no alter constraint migration, so they need to
	// be removed, then added
	dropConstraints("up", constraints.up.updates);
	addConstraints("up", constraints.up.updates);

	dropConstraints("up", constraints.up.deletes);
	dropColumns("up", columns.up.deletes);

	// Up order and down order will be the same?
	// That doesn't seem right
	addTables("down", tables.down.creates);
	dropTables("down", tables.down.deletes);

	addColumns("down", columns.down.creates);
	updateColumns("down", columns.down.updates);

	addConstraints("down", constraints.down.creates);
	dropConstraints("up", constraints.down.updates);
	addConstraints("up", constraints.down.updates);

	dropConstraints("down", constraints.down.deletes);
	dropColumns("down", columns.down.deletes);

	let migration = `
"use strict";

/** 
		Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    ${queries.up.join("\n    ")}
  },

  async down(queryInterface, Sequelize) {
    ${queries.down.join("\n    ")}
  },
};
`;

	console.log(migration);
};
