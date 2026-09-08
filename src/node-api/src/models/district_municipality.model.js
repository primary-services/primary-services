"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("district", {});
    await queryInterface.createTable("district_municipalities", {});
    await queryInterface.addColumn("district", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("district", "name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("district_municipalities", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("district_municipalities", "district_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn(
      "district_municipalities",
      "municipality_id",
      {
        type: "INTEGER",
        allowNull: false,
        primaryKey: false,
        autoIncrement: false,
      },
    );
    await queryInterface.addConstraint("district", {
      fields: ["id"],
      type: "primary key",
      name: "district_pkey",
    });
    await queryInterface.addConstraint("district_municipalities", {
      fields: ["id"],
      type: "primary key",
      name: "district_municipalities_pkey",
    });
    await queryInterface.addConstraint("district_municipalities", {
      fields: ["district_id"],
      type: "foreign key",
      name: "district_municipalities_district_id_fkey",
      references: { table: "district", field: "id" },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    await queryInterface.addConstraint("district_municipalities", {
      fields: ["municipality_id"],
      type: "foreign key",
      name: "district_municipalities_municipality_id_fkey",
      references: { table: "municipality", field: "id" },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("district", "district_pkey", {});
    await queryInterface.removeConstraint(
      "district_municipalities",
      "district_municipalities_pkey",
      {},
    );
    await queryInterface.removeConstraint(
      "district_municipalities",
      "district_municipalities_district_id_fkey",
      {},
    );
    await queryInterface.removeConstraint(
      "district_municipalities",
      "district_municipalities_municipality_id_fkey",
      {},
    );
    await queryInterface.removeColumn("district", "id", {});
    await queryInterface.removeColumn("district", "name", {});
    await queryInterface.removeColumn("district_municipalities", "id", {});
    await queryInterface.removeColumn(
      "district_municipalities",
      "district_id",
      {},
    );
    await queryInterface.removeColumn(
      "district_municipalities",
      "municipality_id",
      {},
    );
    await queryInterface.dropTable("district", {});
    await queryInterface.dropTable("district_municipalities", {});
  },
};
