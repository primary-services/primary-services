"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ward", {});
    await queryInterface.addColumn("seat", "ward_id", {
      type: "INTEGER",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("ward", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("ward", "municipality_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("ward", "name", {
      type: "VARCHAR(255)",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("ward", "deleted", {
      type: "BOOLEAN",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: false,
    });
    await queryInterface.addConstraint("ward", {
      fields: ["id"],
      type: "primary key",
      name: "ward_pkey",
    });
    await queryInterface.addConstraint("ward", {
      fields: ["municipality_id"],
      type: "foreign key",
      name: "ward_municipality_id_fkey",
      references: { table: "municipality", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("seat", {
      fields: ["ward_id"],
      type: "foreign key",
      name: "seat_ward_id_fkey",
      references: { table: "ward", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("seat", seat_ward_id_fkey, {});
    await queryInterface.removeConstraint("ward", ward_pkey, {});
    await queryInterface.removeConstraint(
      "ward",
      ward_municipality_id_fkey,
      {},
    );
    await queryInterface.removeColumn("seat", "ward_id", {});
    await queryInterface.removeColumn("ward", "id", {});
    await queryInterface.removeColumn("ward", "municipality_id", {});
    await queryInterface.removeColumn("ward", "name", {});
    await queryInterface.removeColumn("ward", "deleted", {});
    await queryInterface.dropTable("ward", {});
  },
};
