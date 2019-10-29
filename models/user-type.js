'use strict';
export default (sequelize, DataTypes) => {
  const userType = sequelize.define('user_type', {
    kode: {
      allowNull: false,
      unique: {
        msg: 'Kode User Type sudah terdaftar'
      },
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Kode User Type harus diisi'
        },
        len: {
          args: [3],
          msg: 'Kode User Type harus berisi 3 karakter'
        },
        isNumeric: {
          msg: 'Kode User Type harus bernilai numerik'
        }
      }
    },
    nama: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Nama User Type harus diisi'
        },
        len: {
          args: [1, 100],
          msg: 'Nama User Type maksimal berisi 100 karakter'
        }
      }
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  userType.associate = function (models) {
    // associations can be defined here
    userType.hasMany(models.user, {
      foreignKey: 'kode_user_type',
      sourceKey: 'kode'
    });
  };
  return userType;
};