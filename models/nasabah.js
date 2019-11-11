'use strict';

import moment from "moment";

export default (sequelize, DataTypes) => {
  const nasabah = sequelize.define('nasabah', {
    kd_cab: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kd_agen: {
      allowNull: true,
      type: DataTypes.STRING
    },
    nama_nsb: {
      allowNull: true,
      type: DataTypes.STRING
    },
    nama_singkat: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tgl_lahir: {
      allowNull: true,
      type: DataTypes.DATEONLY
    },
    handphone: {
      allowNull: true,
      type: DataTypes.STRING
    },
    jenis_tabungan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    no_kartu: {
      allowNull: true,
      type: DataTypes.STRING
    },
    setoran_awal: {
      allowNull: true,
      type: DataTypes.STRING
    },
    foto_ktp: {
      allowNull: true,
      type: DataTypes.STRING
    },
    date: {
      allowNull: true,
      type: DataTypes.DATEONLY,
      defaultValue: function() {
        return moment().format('YYYY-MM-DD');
      }
    },
    time1: {
      allowNull: true,
      type: DataTypes.TIME,
      defaultValue: function() {
        return moment().format('HH:mm:ss');
      }
    },
    status_primary_data: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });
  nasabah.associate = function (models) {
    // associations can be defined here
  };
  return nasabah;
};