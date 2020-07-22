const { Sequelize, DataTypes, DATE } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory");

const Group = sequelize.define(
  "Group",
  {
    group_id: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING(32),
    },
    creationDate: {
      type: DataTypes.DATE,
    },
    createdBy: {
      type: DataTypes.UUID,
    },
  },
  {
    tableName: "groups",
  }
);

//Group.sync();
module.exports = Group;