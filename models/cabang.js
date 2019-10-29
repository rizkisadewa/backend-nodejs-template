'use strict';
export default (sequelize, DataTypes) => {
  const cabang = sequelize.define('cabang', {
    kode: {
      allowNull: false,
      unique: {
        msg: 'Kode Cabang sudah terdaftar'
      },
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Kode Cabang harus diisi'
        },
        len: {
          args: [3],
          msg: 'Kode Cabang harus berisi 3 karakter'
        },
        isNumeric: {
          msg: 'Kode Cabang harus bernilai numerik'
        }
      }
    },
    nama: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Nama Cabang harus diisi'
        },
        len: {
          args: [1, 10],
          msg: 'Nama Cabang maksimal berisi 10 karakter'
        }
      }
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  cabang.associate = function (models) {
    // associations can be defined here
    cabang.hasMany(models.user, {
      foreignKey: 'kode_cabang',
      sourceKey: 'kode'
    });
  };
  return cabang;
};