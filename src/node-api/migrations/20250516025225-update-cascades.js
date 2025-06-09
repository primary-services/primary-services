"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Candidate: election_id
    queryInterface.removeConstraint("candidate", "candidate_election_id_fkey");
    queryInterface.addConstraint("candidate", {
      fields: ["election_id"],
      type: "FOREIGN KEY",
      name: "candidate_election_id_fkey",
      references: {
        table: "election",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Official: office_id
    queryInterface.removeConstraint("official", "official_office_id_fkey");
    queryInterface.addConstraint("official", {
      fields: ["office_id"],
      type: "FOREIGN KEY",
      name: "official_office_id_fkey",
      references: {
        table: "office",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Requirement: deadline_id
    queryInterface.removeConstraint(
      "requirement",
      "requirement_deadline_id_fkey",
    );
    queryInterface.addConstraint("requirement", {
      fields: ["deadline_id"],
      type: "FOREIGN KEY",
      name: "requirement_deadline_id_fkey",
      references: {
        table: "deadline",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Requirement: form_id
    queryInterface.removeConstraint("requirement", "requirement_form_id_fkey");
    queryInterface.addConstraint("requirement", {
      fields: ["form_id"],
      type: "FOREIGN KEY",
      name: "requirement_form_id_fkey",
      references: {
        table: "form",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Seat: office_id
    queryInterface.removeConstraint("seat", "seat_office_id_fkey");
    queryInterface.addConstraint("seat", {
      fields: ["office_id"],
      type: "FOREIGN KEY",
      name: "seat_office_id_fkey",
      references: {
        table: "office",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });

    // Term: seat_id
    queryInterface.removeConstraint("term", "term_seat_id_fkey");
    queryInterface.addConstraint("term", {
      fields: ["seat_id"],
      type: "FOREIGN KEY",
      name: "term_seat_id_fkey",
      references: {
        table: "seat",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Candidate: election_id
    queryInterface.removeConstraint("candidate", "candidate_election_id_fkey");
    queryInterface.addConstraint("candidate", {
      fields: ["election_id"],
      type: "FOREIGN KEY",
      name: "candidate_election_id_fkey",
      references: {
        table: "election",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    // Official: office_id
    queryInterface.removeConstraint("official", "official_office_id_fkey");
    queryInterface.addConstraint("official", {
      fields: ["office_id"],
      type: "FOREIGN KEY",
      name: "official_office_id_fkey",
      references: {
        table: "office",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    // Requirement: deadline_id
    queryInterface.removeConstraint(
      "requirement",
      "requirement_deadline_id_fkey",
    );
    queryInterface.addConstraint("requirement", {
      fields: ["deadline_id"],
      type: "FOREIGN KEY",
      name: "requirement_deadline_id_fkey",
      references: {
        table: "deadline",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    // Requirement: form_id
    queryInterface.removeConstraint("requirement", "requirement_form_id_fkey");
    queryInterface.addConstraint("requirement", {
      fields: ["form_id"],
      type: "FOREIGN KEY",
      name: "requirement_form_id_fkey",
      references: {
        table: "form",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    // Seat: office_id
    queryInterface.removeConstraint("seat", "seat_office_id_fkey");
    queryInterface.addConstraint("seat", {
      fields: ["office_id"],
      type: "FOREIGN KEY",
      name: "seat_office_id_fkey",
      references: {
        table: "office",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });

    // Term: seat_id
    queryInterface.removeConstraint("term", "term_seat_id_fkey");
    queryInterface.addConstraint("term", {
      fields: ["seat_id"],
      type: "FOREIGN KEY",
      name: "term_seat_id_fkey",
      references: {
        table: "seat",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },
};
