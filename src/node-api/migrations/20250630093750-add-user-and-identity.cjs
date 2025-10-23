"use strict";

/** 
    Generated file, please proof before running
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("identity", {});
    await queryInterface.createTable("identity_parent", {});
    await queryInterface.createTable("user", {});
    await queryInterface.addColumn("identity", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("identity", "first_name", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity", "middle_name", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity", "last_name", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity", "suffix", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity", "nickname", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity_parent", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("identity_parent", "identity_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity_parent", "parent_id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("identity_parent", "parent_type", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("user", "id", {
      type: "INTEGER",
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });
    await queryInterface.addColumn("user", "email", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("user", "password", {
      type: "TEXT",
      allowNull: false,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("user", "resetToken", {
      type: "TEXT",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.addColumn("user", "resetTokenExpiry", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
    });
    await queryInterface.changeColumn("note", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "NOW()",
    });
    await queryInterface.changeColumn("source", "created_at", {
      type: "TIMESTAMP WITH TIME ZONE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "NOW()",
    });
    await queryInterface.addConstraint("identity", {
      fields: ["id"],
      type: "primary key",
      name: "identity_pkey",
    });
    await queryInterface.addConstraint("identity_parent", {
      fields: ["id"],
      type: "primary key",
      name: "identity_parent_pkey",
    });
    await queryInterface.addConstraint("identity_parent", {
      fields: ["identity_id", "parent_id", "parent_type"],
      type: "unique",
      name: "identity_parent_unique_idx",
    });
    await queryInterface.addConstraint("identity_parent", {
      fields: ["identity_id"],
      type: "foreign key",
      name: "identity_parent_identity_id_fkey",
      references: { table: "identity", field: "id" },
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    await queryInterface.addConstraint("user", {
      fields: ["id"],
      type: "primary key",
      name: "user_pkey",
    });
    await queryInterface.addConstraint("user", {
      fields: ["email"],
      type: "unique",
      name: "user_email_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("note", "created_at", {
      type: "DATE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "'2025-06-18 12:49:46.154036+00'::timestamp with time zone",
    });
    await queryInterface.changeColumn("source", "created_at", {
      type: "DATE",
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: "'2025-06-18 12:49:46.159001+00'::timestamp with time zone",
    });
    await queryInterface.removeConstraint("identity", identity_pkey, {});
    await queryInterface.removeConstraint(
      "identity_parent",
      identity_parent_pkey,
      {},
    );
    await queryInterface.removeConstraint(
      "identity_parent",
      identity_parent_unique_idx,
      {},
    );
    await queryInterface.removeConstraint(
      "identity_parent",
      identity_parent_identity_id_fkey,
      {},
    );
    await queryInterface.removeConstraint("user", user_pkey, {});
    await queryInterface.removeConstraint("user", user_email_unique, {});
    await queryInterface.removeColumn("identity", "id", {});
    await queryInterface.removeColumn("identity", "first_name", {});
    await queryInterface.removeColumn("identity", "middle_name", {});
    await queryInterface.removeColumn("identity", "last_name", {});
    await queryInterface.removeColumn("identity", "suffix", {});
    await queryInterface.removeColumn("identity", "nickname", {});
    await queryInterface.removeColumn("identity_parent", "id", {});
    await queryInterface.removeColumn("identity_parent", "identity_id", {});
    await queryInterface.removeColumn("identity_parent", "parent_id", {});
    await queryInterface.removeColumn("identity_parent", "parent_type", {});
    await queryInterface.removeColumn("user", "id", {});
    await queryInterface.removeColumn("user", "email", {});
    await queryInterface.removeColumn("user", "password", {});
    await queryInterface.removeColumn("user", "resetToken", {});
    await queryInterface.removeColumn("user", "resetTokenExpiry", {});
    await queryInterface.dropTable("identity", {});
    await queryInterface.dropTable("identity_parent", {});
    await queryInterface.dropTable("user", {});
  },
};
