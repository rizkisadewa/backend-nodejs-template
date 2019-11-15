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
    },
    primary_data_keterangan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kd_identitas: {
      allowNull: true,
      type: DataTypes.STRING
    },
    no_identitas: {
      allowNull: true,
      type: DataTypes.STRING
    },
    alamat_ktp: {
      allowNull: true,
      type: DataTypes.STRING
    },
    rt: {
      allowNull: true,
      type: DataTypes.STRING
    },
    rw: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kelurahan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kecamatan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kota: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kode_pos: {
      allowNull: true,
      type: DataTypes.STRING
    },
    alamat_domisili: {
      allowNull: true,
      type: DataTypes.STRING
    },
    jns_kelamin: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kode_agama: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tempat_lahir: {
      allowNull: true,
      type: DataTypes.STRING
    },
    warganegara: {
      allowNull: true,
      type: DataTypes.STRING
    },
    no_identitas_exp: {
      allowNull: true,
      type: DataTypes.DATEONLY
    },
    nama_ibu: {
      allowNull: true,
      type: DataTypes.STRING
    },
    provinsi: {
      allowNull: true,
      type: DataTypes.STRING
    },
    npwp: {
      allowNull: true,
      type: DataTypes.STRING
    },
    kode_area: {
      allowNull: true,
      type: DataTypes.STRING
    },
    telp_rumah: {
      allowNull: true,
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    pendidikan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sts_nikah: {
      allowNull: true,
      type: DataTypes.STRING
    },
    hobby: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sifat_dana: {
      allowNull: true,
      type: DataTypes.STRING
    },
    penghasilan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    sumdana: {
      allowNull: true,
      type: DataTypes.STRING
    },
    pekerjaan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    jabatan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    usaha: {
      allowNull: true,
      type: DataTypes.STRING
    },
    nama_prs: {
      allowNull: true,
      type: DataTypes.STRING
    },
    alamat_prs: {
      allowNull: true,
      type: DataTypes.STRING
    },
    rata_akt_daily: {
      allowNull: true,
      type: DataTypes.STRING
    },
    hubank: {
      allowNull: true,
      type: DataTypes.STRING
    },
    tujuan: {
      allowNull: true,
      type: DataTypes.STRING
    },
    norek: {
      allowNull: true,
      type: DataTypes.STRING
    },
    nama_bank_lain: {
      allowNull: true,
      type: DataTypes.STRING
    },
    status_secondary_data: {
      allowNull: true,
      type: DataTypes.STRING
    },
    secondary_data_keterangan: {
      allowNull: true,
      type: DataTypes.STRING
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
