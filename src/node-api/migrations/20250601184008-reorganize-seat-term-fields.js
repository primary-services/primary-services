"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("office", "seat_count", Sequelize.INTEGER);
    queryInterface.addColumn("term", "start_year", Sequelize.INTEGER);
    queryInterface.addColumn("term", "end_year", Sequelize.INTEGER);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("office", "seat_count");
    queryInterface.removeColumn("term", "start_year");
    queryInterface.removeColumn("term", "end_year");
  },
};

/*
  -- Update Seat Count SQL:

  UPDATE 
    office 
  SET
    seat_count = (
      SELECT 
        count(id) 
      FROM 
        seat 
      WHERE 
        office_id = office.id
    )  
 */

/*
  -- Update Term Years

  UPDATE 
    term
  SET
    start_year = DATE_PART('year', term.start),
    end_year = DATE_PART('year', term.end)
 */
