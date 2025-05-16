"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint("deadline_parent", {
      fields: ["deadline_id", "parent_id", "parent_type"],
      type: "unique",
      name: "deadline_parent_unique_idx",
    });

    queryInterface.addConstraint("election_term", {
      fields: ["election_id", "term_id"],
      type: "unique",
      name: "election_term_term_id_election_id_unique",
    });

    queryInterface.addConstraint("requirement_parent", {
      fields: ["requirement_id", "parent_id", "parent_type"],
      type: "unique",
      name: "requirement_parent_unique_idx",
    });

    queryInterface.addConstraint("form_parent", {
      fields: ["form_id", "parent_id", "parent_type"],
      type: "unique",
      name: "form_parent_unique_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint(
      "deadline_parent",
      "deadline_parent_unique_idx",
    );

    queryInterface.removeConstraint(
      "election_term",
      "election_term_term_id_election_id_unique",
    );

    queryInterface.removeConstraint(
      "requirement_parent",
      "requirement_parent_unique_idx",
    );

    queryInterface.removeConstraint("form_parent", "form_parent_unique_idx");
  },
};
