"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("flag", {});
    await queryInterface.addColumn("flag", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("flag", "item_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("flag", "item_type", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("flag", "name", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addConstraint("flag", {
      fields: ["id"],
      type: "primary key",
      name: "flag_pkey",
    });
    await queryInterface.removeConstraint("seat", "seat_ward_id_fkey", {});
    await queryInterface.addConstraint("seat", {
      fields: ["ward_id"],
      type: "foreign key",
      name: "seat_ward_id_fkey",
      references: { table: "ward", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("flag", flag_pkey, {});
    await queryInterface.removeColumn("flag", "id", {});
    await queryInterface.removeColumn("flag", "item_id", {});
    await queryInterface.removeColumn("flag", "item_type", {});
    await queryInterface.removeColumn("flag", "name", {});
    await queryInterface.dropTable("flag", {});
  },
};
