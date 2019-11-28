import database from '../models';

class NasabahService {
    static async getAllNasabahs() {
        try {
            return await database.nasabah.findAll();
        } catch (error) {
            throw error;
        }
    }

    static async addNasabah(newNasabah) {
        try {
            return await database.nasabah.create(newNasabah);
        } catch (error) {
            throw error;
        }
    }

    static async updateNasabah(id, updateNasabah) {
        try {
            const nasabahToUpdate = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (nasabahToUpdate) {
                return await nasabahToUpdate.update(updateNasabah);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getNasabah(id) {
        try {
            const nasabah = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            return nasabah;
        } catch (error) {
            throw error;
        }
    }

    static async getNomor(id) {
        try {
            const nasabah = await database.nasabah.findOne({
                attributes: ['handphone'],
                where: {
                    id: Number(id)
                }
            });

            return nasabah.handphone;
        } catch (error) {
            throw error;
        }
    }

    static async getNasabahCustom(id) {
        try {
            const query = `
            SELECT
                nsb.*,
                SUBSTRING(handphone, 1, 2) as kode_negara,
                jtm.keterangan as jenis_tabungan_text,
                pm.keterangan as pendidikan_text,
                itm.keterangan as kd_identitas_text,
                km.citynm as kota_text,
                jkm.keterangan as jns_kelamin_text,
                kam.keterangan as kode_agama_text,
                wm.keterangan as warganegara_text,
                pm1.keterangan as provinsi_text,
                smm.status as sts_nikah_text,
                sdm.param as sifat_dana_text,
                pm2.keterangan as penghasilan_text,
                sm.sumdana as sumdana_text,
                pm3.keterangan as pekerjaan_text,
                jm.keterangan as jabatan_text,
                um.keterangan as usaha_text,
                hm.keterangan as hubank_text,
                tm.tujuan as tujuan_text
            FROM
                nasabah nsb
            LEFT JOIN
                jenis_tabungan_mstr jtm ON jtm.id_tabungan = nsb.jenis_tabungan
            LEFT JOIN
                pendidikan_mstr pm ON pm.id_pendidikan = nsb.pendidikan
            LEFT JOIN
                identitas_type_mstr itm ON itm.id_identitas::character varying = nsb.kd_identitas
            LEFT JOIN
                kota_mstr km ON km.cityid = nsb.kota
            LEFT JOIN
                jenis_kelamin_mstr jkm ON jkm.id_kelamin = nsb.jns_kelamin
            LEFT JOIN
                kode_agama_mstr kam ON kam.id_agama::character varying = nsb.kode_agama
            LEFT JOIN
                warganegara_mstr wm ON wm.id::character varying = nsb.warganegara
            LEFT JOIN
                provinsi_mstr pm1 ON pm1.id_propinsi = nsb.provinsi
            LEFT JOIN
                status_menikah_mstr smm ON smm.id_menikah::character varying = nsb.sts_nikah
            LEFT JOIN
                sifat_dana_mstr sdm ON sdm.id = nsb.sifat_dana
            LEFT JOIN
                penghasilan_mstr pm2 ON pm2.id_penghasilan::character varying = nsb.penghasilan
            LEFT JOIN
                sumdana_mstr sm ON sm.id = nsb.sumdana
            LEFT JOIN
                pekerjaan_mstr pm3 ON pm3.id_pekerjaan = nsb.pekerjaan
            LEFT JOIN
                jabatan_mstr jm ON jm.id_jabatan = nsb.jabatan
            LEFT JOIN
                usaha_mstr um ON um.id_usaha::character varying = nsb.usaha
            LEFT JOIN
                hubank_mstr hm ON hm.id_hub = nsb.hubank
            LEFT JOIN
                tujuan_mstr tm ON tm.id = nsb.tujuan
            WHERE
                nsb.id = '${id}'
            `;
            const primaryData = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return primaryData.length > 0 ? primaryData[0] : {};
        } catch (error) {
            throw error;
        }
    }

    static async deleteNasabah(id) {
        try {
            const nasabahToDelete = await database.nasabah.findOne({
                where: {
                    id: Number(id)
                }
            });

            if (nasabahToDelete) {
                return await nasabahToDelete.destroy();
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getNasabahByStatus(kode_cabang, status, page) {
        try {
            let query = `
            SELECT
                nsb.*,
                cbg.kode as kode_kantor_cabang,
                cbg.nama as kantor_cabang,
                usr.nama as nama_marketing,
                usr.username as kode_fo
            FROM
                nasabah nsb
            LEFT JOIN
                cabang cbg ON cbg.kode = nsb.kd_cab
            LEFT JOIN
                "user" usr ON usr.kode = nsb.kd_agen`;

            let sql_condition = ``;
            const max_page = 10;
            const offset = ((page - 1) * max_page);

            if (status == "update") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'approved' AND nsb.status_secondary_data IS NULL`;
            } else if (status == "pending") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'pending' OR nsb.status_secondary_data = 'pending' OR nsb.status_primary_data = 'rejected' OR nsb.status_secondary_data = 'rejected'`;
            } else if (status == "req_new_data") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'waiting_update'`;
            } else if (status == "req_update_data") {
                sql_condition += `\nWHERE nsb.status_secondary_data = 'waiting_update'`;
            } else if (status == "completed") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'approved' AND nsb.primary_data_keterangan = 'approved' AND nsb.status_secondary_data = 'approved' AND nsb.secondary_data_keterangan = 'approved'`;
            } else if (status == "approved") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'approved' OR nsb.status_secondary_data = 'approved'`;
            } else if (status == "rejected") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'rejected' OR nsb.status_secondary_data = 'rejected'`;
            } else if (status == "pembukaan_rekening") {
                sql_condition += `\nWHERE nsb.status_primary_data = 'approved' AND nsb.status_secondary_data = 'approved'`;
            }

            sql_condition += ` AND nsb.kd_cab = '${kode_cabang}'`;

            query = query + sql_condition;

            //pagination
            let limitation = ``;

            if (page > 0) {
                limitation = ` offset '${offset}' limit '${max_page}' `;
            }

            const primaryData = {};

            //get data with limitation
            primaryData.rows = await database.sequelize.query(query + limitation, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            //get max page
            // const temp_size = await database.sequelize.query(query , {
            //     type: database.Sequelize.QueryTypes.SELECT
            // });

            // primaryData.max_page = Math.ceil(temp_size.length/max_page);

            return primaryData;

        } catch (error) {
            throw error;
        }
    }

    static async sendRequestData(id, keterangan) {
        try {
            const query = `
            UPDATE nasabah SET (status_primary_data, status_secondary_data) = (CASE WHEN status_primary_data = 'pending' OR status_primary_data = 'rejected' THEN 'waiting_update' ELSE status_primary_data END, CASE WHEN status_secondary_data = 'pending' OR status_secondary_data = 'rejected' THEN 'waiting_update' ELSE status_secondary_data END), keterangan = '${keterangan}'
            WHERE id = '${id}'
            `;
            const result = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getReportPembukaanRekeningData(start_date, finish_date) {
        try {
            const query = `
            SELECT
                nsb.*,
                knm.kode as kode_negara,
                knm.negara as warganegara,
                jtm.keterangan as jenis_tabungan,
                cbg.kode as kode_kantor_cabang,
                cbg.nama as kantor_cabang,
                usr.nama as nama_marketing,
                usr.username as kode_fo
            FROM
                nasabah nsb
            LEFT JOIN
                kode_negara_mstr knm ON knm.id_negara::character varying = nsb.warganegara
            LEFT JOIN
                jenis_tabungan_mstr jtm ON jtm.id_tabungan = nsb.jenis_tabungan
            FULL JOIN
                cabang cbg ON cbg.kode = nsb.kd_cab
            FULL JOIN
                public.user usr ON usr.kode = nsb.kd_agen

            WHERE nsb.status_primary_data = 'approved' AND nsb.status_secondary_data = 'approved' AND nsb.date >= '${start_date}' AND nsb.date <= '${finish_date}'
            `;

            const resultReport = await database.sequelize.query(query, {
                type: database.Sequelize.QueryTypes.SELECT
            });

            return resultReport;

        } catch (error) {
            throw error;
        }
    }
}

export default NasabahService;
