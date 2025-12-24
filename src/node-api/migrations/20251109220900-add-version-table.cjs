"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("versions", {});
    await queryInterface.addColumn("versions", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("versions", "user_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("versions", "item_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("versions", "item_type", {
      type: "VARCHAR(255)",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("versions", "fields", {
      type: "JSONB",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("versions", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: Sequelize.fn("NOW"),
    });
    await queryInterface.addColumn("versions", "office_id", {
      type: "INTEGER",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addConstraint("versions", {
      fields: ["id"],
      type: "primary key",
      name: "versions_pkey",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("versions", versions_pkey, {});
    await queryInterface.removeColumn("versions", "id", {});
    await queryInterface.removeColumn("versions", "user_id", {});
    await queryInterface.removeColumn("versions", "item_id", {});
    await queryInterface.removeColumn("versions", "item_type", {});
    await queryInterface.removeColumn("versions", "fields", {});
    await queryInterface.removeColumn("versions", "created_at", {});
    await queryInterface.removeColumn("versions", "office_id", {});
    await queryInterface.dropTable("versions", {});
  },
};
