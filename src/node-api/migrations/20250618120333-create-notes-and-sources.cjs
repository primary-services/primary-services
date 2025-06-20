"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("note", {});
    await queryInterface.createTable("source", {});
    await queryInterface.addColumn("note", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("note", "item_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("note", "item_type", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("note", "summary", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("note", "content", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("note", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "NOW",
    });
    await queryInterface.addColumn("note", "created_by", {
      type: "INTEGER",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("source", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("source", "item_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("source", "item_type", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("source", "summary", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("source", "url", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("source", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "NOW",
    });
    await queryInterface.addColumn("source", "created_by", {
      type: "INTEGER",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addConstraint("note", {
      fields: ["id"],
      type: "primary key",
      name: "note_pkey",
    });
    await queryInterface.addConstraint("source", {
      fields: ["id"],
      type: "primary key",
      name: "source_pkey",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("note", note_pkey, {});
    await queryInterface.removeConstraint("source", source_pkey, {});
    await queryInterface.removeColumn("note", "id", {});
    await queryInterface.removeColumn("note", "item_id", {});
    await queryInterface.removeColumn("note", "item_type", {});
    await queryInterface.removeColumn("note", "summary", {});
    await queryInterface.removeColumn("note", "content", {});
    await queryInterface.removeColumn("note", "created_at", {});
    await queryInterface.removeColumn("note", "created_by", {});
    await queryInterface.removeColumn("source", "id", {});
    await queryInterface.removeColumn("source", "item_id", {});
    await queryInterface.removeColumn("source", "item_type", {});
    await queryInterface.removeColumn("source", "summary", {});
    await queryInterface.removeColumn("source", "url", {});
    await queryInterface.removeColumn("source", "created_at", {});
    await queryInterface.removeColumn("source", "created_by", {});
    await queryInterface.dropTable("note", {});
    await queryInterface.dropTable("source", {});
  },
};
