// var DataTypes = require("sequelize").DataTypes;
// var _alembic_version = require("./alembic_version");
// var _candidate = require("./candidate");
// var _deadline = require("./deadline");
// var _deadline_parent = require("./deadline_parent");
// var _election = require("./election");
// var _election_term = require("./election_term");
// var _form = require("./form");
// var _form_parent = require("./form_parent");
// var _municipality = require("./municipality");
// var _office = require("./office");
// var _office_template = require("./office_template");
// var _official = require("./official");
// var _requirement = require("./requirement");
// var _requirement_parent = require("./requirement_parent");
// var _requirement_scope = require("./requirement_scope");
// var _seat = require("./seat");
// var _term = require("./term");

// function initModels(sequelize) {
//   var alembic_version = _alembic_version(sequelize, DataTypes);
//   var candidate = _candidate(sequelize, DataTypes);
//   var deadline = _deadline(sequelize, DataTypes);
//   var deadline_parent = _deadline_parent(sequelize, DataTypes);
//   var election = _election(sequelize, DataTypes);
//   var election_term = _election_term(sequelize, DataTypes);
//   var form = _form(sequelize, DataTypes);
//   var form_parent = _form_parent(sequelize, DataTypes);
//   var municipality = _municipality(sequelize, DataTypes);
//   var office = _office(sequelize, DataTypes);
//   var office_template = _office_template(sequelize, DataTypes);
//   var official = _official(sequelize, DataTypes);
//   var requirement = _requirement(sequelize, DataTypes);
//   var requirement_parent = _requirement_parent(sequelize, DataTypes);
//   var requirement_scope = _requirement_scope(sequelize, DataTypes);
//   var seat = _seat(sequelize, DataTypes);
//   var term = _term(sequelize, DataTypes);

//   deadline_parent.belongsTo(deadline, { as: "deadline", foreignKey: "deadline_id"});
//   deadline.hasMany(deadline_parent, { as: "deadline_parents", foreignKey: "deadline_id"});
//   requirement.belongsTo(deadline, { as: "deadline", foreignKey: "deadline_id"});
//   deadline.hasMany(requirement, { as: "requirements", foreignKey: "deadline_id"});
//   candidate.belongsTo(election, { as: "election", foreignKey: "election_id"});
//   election.hasMany(candidate, { as: "candidates", foreignKey: "election_id"});
//   election_term.belongsTo(election, { as: "election", foreignKey: "election_id"});
//   election.hasMany(election_term, { as: "election_terms", foreignKey: "election_id"});
//   form_parent.belongsTo(form, { as: "form", foreignKey: "form_id"});
//   form.hasMany(form_parent, { as: "form_parents", foreignKey: "form_id"});
//   requirement.belongsTo(form, { as: "form", foreignKey: "form_id"});
//   form.hasMany(requirement, { as: "requirements", foreignKey: "form_id"});
//   municipality.belongsTo(municipality, { as: "parent", foreignKey: "parent_id"});
//   municipality.hasMany(municipality, { as: "municipalities", foreignKey: "parent_id"});
//   office.belongsTo(municipality, { as: "municipality", foreignKey: "municipality_id"});
//   municipality.hasMany(office, { as: "offices", foreignKey: "municipality_id"});
//   requirement.belongsTo(municipality, { as: "municipality", foreignKey: "municipality_id"});
//   municipality.hasMany(requirement, { as: "requirements", foreignKey: "municipality_id"});
//   official.belongsTo(office, { as: "office", foreignKey: "office_id"});
//   office.hasMany(official, { as: "officials", foreignKey: "office_id"});
//   seat.belongsTo(office, { as: "office", foreignKey: "office_id"});
//   office.hasMany(seat, { as: "seats", foreignKey: "office_id"});
//   requirement_parent.belongsTo(requirement, { as: "requirement", foreignKey: "requirement_id"});
//   requirement.hasMany(requirement_parent, { as: "requirement_parents", foreignKey: "requirement_id"});
//   requirement_scope.belongsTo(requirement, { as: "requirement", foreignKey: "requirement_id"});
//   requirement.hasMany(requirement_scope, { as: "requirement_scopes", foreignKey: "requirement_id"});
//   term.belongsTo(seat, { as: "seat", foreignKey: "seat_id"});
//   seat.hasMany(term, { as: "terms", foreignKey: "seat_id"});
//   election_term.belongsTo(term, { as: "term", foreignKey: "term_id"});
//   term.hasMany(election_term, { as: "election_terms", foreignKey: "term_id"});
//   official.belongsTo(term, { as: "term", foreignKey: "term_id"});
//   term.hasMany(official, { as: "officials", foreignKey: "term_id"});

//   return {
//     alembic_version,
//     candidate,
//     deadline,
//     deadline_parent,
//     election,
//     election_term,
//     form,
//     form_parent,
//     municipality,
//     office,
//     office_template,
//     official,
//     requirement,
//     requirement_parent,
//     requirement_scope,
//     seat,
//     term,
//   };
// }
// module.exports = initModels;
// module.exports.initModels = initModels;
// module.exports.default = initModels;
