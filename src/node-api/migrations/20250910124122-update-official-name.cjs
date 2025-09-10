"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("official", "name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE 
        official
      SET
        name = first_name || ' ' || last_name
    `);

    await queryInterface.removeColumn("official", "first_name", {});
    await queryInterface.removeColumn("official", "last_name", {});
    await queryInterface.removeColumn("official", "middle_name", {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("official", "first_name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("official", "middle_name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("official", "last_name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });

    await queryInterface.sequelize.query(`
      UPDATE 
        official
      SET
        first_name = regexp_replace(name,'\s\S+',''),
        last_name = regexp_replace(name,'.+[\s]','')
    `);

    await queryInterface.removeColumn("official", "name", {});
  },
};
