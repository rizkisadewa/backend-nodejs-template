'use strict';
import moment from "moment";
export default (sequelize, DataTypes) => {
  const disdukLog = sequelize.define('disduk_log', {
    username: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Kode User Type harus berisi 3 karakter'
        }
      }
    },
    timestamp: {
      allowNull: true,
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    NIK: {
      allowNull: true,
      type: DataTypes.STRING
    },
    status_response: {
      allowNull: true,
      type: DataTypes.STRING
    },
    keterangan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    ip: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  disdukLog.associate = function (models){
    // associations can be defined here

  };
  return disdukLog;
};
