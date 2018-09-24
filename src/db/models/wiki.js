'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define('Wiki', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    private: DataTypes.BOOLEAN
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
  };
  return Wiki;
};
