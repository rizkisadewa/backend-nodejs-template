'use strict';
import moment from 'moment';
import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    kode: {
      allowNull: false,
      unique: {
        msg: 'Kode User sudah terdaftar'
      },
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Kode User harus diisi'
        },
        len: {
          args: [3],
          msg: 'Kode User harus berisi 3 karakter'
        },
        isNumeric: {
          msg: 'Kode User harus bernilai numerik'
        }
      }
    },
    username: {
      allowNull: false,
      unique: {
        msg: 'Username sudah terdaftar'
      },
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Username harus diisi'
        },
        len: {
          args: [5, 20],
          msg: 'Username harus berisi diantara 5-20 karakter'
        }
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Password harus diisi'
        },
        len: {
          args: [6, 100],
          msg: 'Password harus berisi diantara 6-25 karakter'
        }
      }
    },
    nama: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Nama maksimal berisi 50 karakter'
        }
      }
    },
    alamat: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Alamat maksimal berisi 50 karakter'
        }
      }
    },
    no_ktp: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [16, 20],
          msg: 'No KTP harus berisi diantara 16-20 karakter'
        },
        isNumeric: {
          msg: 'No KTP harus bernilai numerik'
        }
      }
    },
    no_tlp: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 15],
          msg: 'No HP harus berisi diantara 10-15 karakter'
        },
        isNumeric: {
          msg: 'No HP harus bernilai numerik'
        }
      }
    },
    foto: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Nama Foto maksimal berisi 100 karakter'
        }
      }
    },
    aoid: {
      allowNull: false,
      unique: {
        msg: 'AOID sudah terdaftar'
      },
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'AOID harus diisi'
        },
        len: {
          args: [3],
          msg: 'Username harus berisi diantara 3 karakter'
        }
      }
    },
    created: {
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    modified: {
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('modified')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  user.beforeCreate(function (ouser, options) {
    if (ouser.changed('password')) {
      ouser.password = bcrypt.hashSync(ouser.password, bcrypt.genSaltSync(10));
    }
  });
  user.beforeUpdate(function (ouser, options) {
    if (ouser.changed('password')) {
      ouser.password = bcrypt.hashSync(ouser.password, bcrypt.genSaltSync(10));
    }
  });
  user.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };
  user.associate = function (models) {
    // associations can be defined here
    user.belongsTo(models.cabang, {
      foreignKey: 'kode_cabang',
      targetKey: 'kode',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    user.belongsTo(models.user_type, {
      foreignKey: 'kode_user_type',
      targetKey: 'kode',
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  };
  return user;
};
