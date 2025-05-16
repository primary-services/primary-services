"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      onDelete: "CASCADE",
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
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
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
};
