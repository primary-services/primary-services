"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "municipality",
      "municipality_parent_id_fkey",
    );

    queryInterface.removeColumn("municipality", "parent_id");

    queryInterface.removeConstraint("official", "official_term_id_fkey");

    queryInterface.removeColumn("official", "term_id");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addColumn("municipality", "parent_id", Sequelize.INTEGER);

    queryInterface.addConstraint("municipality", {
      fields: ["parent_id"],
      type: "FOREIGN KEY",
      name: "municipality_parent_id_fkey",
      references: {
        table: "municipality",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    queryInterface.addColumn("official", "term_id", Sequelize.INTEGER);

    queryInterface.addConstraint("official", {
      fields: ["term_id"],
      type: "FOREIGN KEY",
      name: "official_term_id_fkey",
      references: {
        table: "term",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },
};
