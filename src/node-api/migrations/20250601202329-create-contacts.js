"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contact", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // This makes the 'id' column the primary key
        type: Sequelize.INTEGER,
      },
      municipality_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contact_form: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint("contact", {
      fields: ["municipality_id"],
      type: "FOREIGN KEY",
      name: "contact_municipality_id_fkey",
      references: {
        table: "municipality",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("contact");
  },
};
